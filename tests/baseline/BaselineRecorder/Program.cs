using System.Globalization;
using System.Text.Json;
using SchemeReady.Api.Services;

namespace SchemeReady.Baseline;

/// <summary>
/// Records <c>tests/baseline/MatchingBaseline.json</c> — the behavioural oracle that
/// proves Phase E's rule externalisation changed nothing (R3.7).
///
/// Usage, from the repository root:
///
///     dotnet run --project tests/baseline/BaselineRecorder [outputPath]
///
/// The recorder runs the real <see cref="SchemeMatchingService"/> over
/// <see cref="BaselineProfiles.All"/> and serialises the full ordered result list per
/// profile. It never asserts anything: it captures whatever the code does today. The
/// judgement about whether today's behaviour is *correct* belongs to review of this diff.
///
/// It is deliberately runnable offline against a git checkout — the catalogue comes from
/// <see cref="SeedDataSchemeRepository"/>, not a database.
/// </summary>
public static class Program
{
    public static int Main(string[] args)
    {
        // The recorded strings must not depend on the recording machine's locale. The
        // service pins CultureInfo.InvariantCulture internally (R3.3); setting a hostile
        // culture here means a regression in that pinning shows up as a baseline diff
        // rather than passing silently on an en-US developer machine.
        CultureInfo.CurrentCulture = CultureInfo.GetCultureInfo("de-DE");

        var outputPath = args.Length > 0 ? args[0] : ResolveDefaultOutputPath();

        // Phase E: the engine takes its thresholds and weights from the Rule_Store. The recorder
        // supplies the snapshot a freshly seeded database yields — SeedData.MatchingRules and
        // SeedData.MatchingWeights, through the API's own validation and projection — so the
        // recorded numbers remain the numbers the API produces after seeding (R7.9).
        var service = new SchemeMatchingService(
            new SeedDataSchemeRepository(),
            new EmiCalculatorService(),
            StaticRuleSetProvider.FromSeedData());

        var document = new BaselineDocument
        {
            SchemaVersion = 1,
            RecordedAt = DateTime.UtcNow.ToString("O", CultureInfo.InvariantCulture),
            HandDerived = false,
            Notes = "Recorded by tests/baseline/BaselineRecorder from SeedData at the end of Phase B task 5.3. " +
                    "Regenerate only when a matching-behaviour change is intended; every other diff is a regression."
        };

        int resultCount = 0;

        foreach (var baselineCase in BaselineProfiles.All)
        {
            var results = service.MatchSchemesAsync(baselineCase.Profile).GetAwaiter().GetResult();

            var record = new BaselineProfileRecord
            {
                Key = baselineCase.Key,
                Coverage = baselineCase.Coverage,
                Profile = baselineCase.Profile,
                Results = results.Select(r => new BaselineResultRecord
                {
                    SchemeId = r.SchemeId,
                    MatchScore = r.MatchScore,
                    IsRecommended = r.IsRecommended,
                    PositiveReasons = r.PositiveReasons,
                    NegativeReasons = r.NegativeReasons,
                    MissingDocuments = r.MissingDocuments,
                    PartnerAvailability = r.PartnerAvailability,
                    EstimatedEmi = r.EstimatedEmi
                }).ToList()
            };

            resultCount += record.Results.Count;
            document.Profiles.Add(record);
        }

        var json = JsonSerializer.Serialize(document, BaselineJson.Options);
        Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(outputPath))!);
        File.WriteAllText(outputPath, json + Environment.NewLine);

        Console.WriteLine($"Baseline written: {document.Profiles.Count} profile(s), {resultCount} result(s)");
        Console.WriteLine($"  -> {Path.GetFullPath(outputPath)}");
        return 0;
    }

    /// <summary>
    /// Walks up from the build output until it finds the <c>tests/baseline</c> directory,
    /// so the recorder writes to the checked-in file regardless of the working directory it
    /// is launched from.
    /// </summary>
    public static string ResolveDefaultOutputPath()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);

        while (directory is not null)
        {
            var candidate = Path.Combine(directory.FullName, "tests", "baseline");
            if (Directory.Exists(candidate))
            {
                return Path.Combine(candidate, "MatchingBaseline.json");
            }

            directory = directory.Parent;
        }

        throw new DirectoryNotFoundException(
            "Could not locate tests/baseline above " + AppContext.BaseDirectory +
            ". Pass the output path explicitly: dotnet run --project tests/baseline/BaselineRecorder -- <path>");
    }
}
