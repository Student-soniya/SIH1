using System.Globalization;
using System.Text;
using System.Text.Json;
using SchemeReady.Api.Services;
using SchemeReady.Baseline;
using Xunit;

namespace SchemeReady.Api.PropertyTests;

/// <summary>
/// The Phase E merge gate (R3.7).
///
/// This is a table-driven baseline test, not a property test: it replays the seven
/// checked-in profiles in <see cref="BaselineProfiles.All"/> against the real
/// <see cref="SchemeMatchingService"/> and demands that the result list equal
/// <c>tests/baseline/MatchingBaseline.json</c> exactly — same length, same order, same
/// scores, same flags, and the same explanation strings compared with
/// <see cref="StringComparer.Ordinal"/> at every index. There is no numeric tolerance and
/// no string normalisation: a swapped apostrophe, a changed thousands separator, a
/// reordered reason or a one-point score drift all fail.
///
/// Phase E replaces every threshold and weight literal in <c>Services/Services.cs</c> with
/// a read from the Rule_Store. Because <c>SeedData.MatchingRules</c> seeds those values to
/// exactly the literals Phase B extracted, this test must stay green across that change.
/// If it goes red, the externalisation altered behaviour and the change is not shippable —
/// that is the whole point of freezing the file now.
///
/// WHILE THE BASELINE IS HAND-DERIVED, a failure is ambiguous: the sandbox that wrote the
/// JSON had no .NET SDK, so the expected values were traced by reading the scoring code
/// rather than recorded from a running process. Every failure message says so. Resolve the
/// ambiguity once, locally, with
/// <c>dotnet run --project tests/baseline/BaselineRecorder</c>; after that commit the file
/// is a genuine oracle and any failure is a real regression.
/// </summary>
public class BaselineEqualityTests
{
    private static readonly Lazy<BaselineDocument> Baseline = new(Load);

    /// <summary>
    /// The coverage R3.7 enumerates. Named here so deleting a profile from
    /// <see cref="BaselineProfiles"/> fails a test instead of quietly shrinking the gate.
    /// </summary>
    private static readonly string[] RequiredCoverage =
    {
        "all-components-maximal",
        "income-above-limit",
        "cost-below-minimum",
        "cost-above-maximum",
        "no-partner-in-district",
        "unmatched-business-type",
        "gender-restricted-scheme"
    };

    public static TheoryData<string> ProfileKeys
    {
        get
        {
            var data = new TheoryData<string>();
            foreach (var key in RequiredCoverage)
            {
                data.Add(key);
            }

            return data;
        }
    }

    [Theory]
    [MemberData(nameof(ProfileKeys))]
    public async Task Matching_reproduces_the_recorded_baseline_exactly(string profileKey)
    {
        // A hostile culture, on purpose. The service must format every interpolated number
        // with CultureInfo.InvariantCulture (R3.3); under de-DE an unpinned "N0" would
        // render "250.000" instead of "250,000" and every reason string would differ.
        var original = CultureInfo.CurrentCulture;
        CultureInfo.CurrentCulture = CultureInfo.GetCultureInfo("de-DE");

        try
        {
            var expectedProfile = Baseline.Value.Profiles.SingleOrDefault(p => p.Key == profileKey);
            Assert.True(expectedProfile is not null,
                $"Baseline file has no profile '{profileKey}'. {RegenerateHint()}");

            var baselineCase = BaselineProfiles.All.SingleOrDefault(c => c.Key == profileKey);
            Assert.True(baselineCase is not null,
                $"BaselineProfiles.All has no case '{profileKey}', but the baseline file records one.");

            // Drift guard: the recorded input must still be the input we are replaying.
            // Without this, editing a profile in code would silently re-point the oracle.
            Assert.Equal(
                JsonSerializer.Serialize(expectedProfile!.Profile, BaselineJson.Options),
                JsonSerializer.Serialize(baselineCase!.Profile, BaselineJson.Options));

            var service = new SchemeMatchingService(new SeedDataSchemeRepository(), new EmiCalculatorService());
            var actual = await service.MatchSchemesAsync(baselineCase.Profile);

            var expected = expectedProfile.Results;
            var failures = new List<string>();

            if (expected.Count != actual.Count)
            {
                failures.Add($"result count: expected {expected.Count}, got {actual.Count} " +
                             $"(expected order [{string.Join(", ", expected.Select(r => r.SchemeId))}], " +
                             $"actual order [{string.Join(", ", actual.Select(r => r.SchemeId)) }])");
            }

            for (int i = 0; i < Math.Min(expected.Count, actual.Count); i++)
            {
                var e = expected[i];
                var a = actual[i];
                var at = $"results[{i}]";

                // Ordering is asserted by position: the scheme at index i must be the scheme
                // recorded at index i, which pins the descending-score ordering *and* the
                // ordinal scheme-id tie-break (R3.4) in one comparison.
                if (!StringComparer.Ordinal.Equals(e.SchemeId, a.SchemeId))
                {
                    failures.Add($"{at}.schemeId: expected '{e.SchemeId}', got '{a.SchemeId}' — result ordering changed");
                }

                if (e.MatchScore != a.MatchScore)
                {
                    failures.Add($"{at} ({e.SchemeId}).matchScore: expected {e.MatchScore}, got {a.MatchScore}");
                }

                if (e.IsRecommended != a.IsRecommended)
                {
                    failures.Add($"{at} ({e.SchemeId}).isRecommended: expected {e.IsRecommended}, got {a.IsRecommended}");
                }

                CompareStringLists(failures, $"{at} ({e.SchemeId}).positiveReasons", e.PositiveReasons, a.PositiveReasons);
                CompareStringLists(failures, $"{at} ({e.SchemeId}).negativeReasons", e.NegativeReasons, a.NegativeReasons);
                CompareStringLists(failures, $"{at} ({e.SchemeId}).missingDocuments", e.MissingDocuments, a.MissingDocuments);

                if (!StringComparer.Ordinal.Equals(e.PartnerAvailability, a.PartnerAvailability))
                {
                    failures.Add($"{at} ({e.SchemeId}).partnerAvailability: expected '{e.PartnerAvailability}', got '{a.PartnerAvailability}'");
                }

                // Null only in the hand-derived file, where the double-precision EMI could
                // not be traced by hand. Once recorded it is compared with zero tolerance
                // like everything else.
                if (e.EstimatedEmi.HasValue && e.EstimatedEmi.Value != a.EstimatedEmi)
                {
                    failures.Add($"{at} ({e.SchemeId}).estimatedEmi: expected {e.EstimatedEmi.Value}, got {a.EstimatedEmi}");
                }
            }

            Assert.True(failures.Count == 0, BuildReport(profileKey, expectedProfile.Coverage, failures));
        }
        finally
        {
            CultureInfo.CurrentCulture = original;
        }
    }

    /// <summary>
    /// The gate is only a gate if it covers the seven cases R3.7 enumerates. This fails if
    /// the baseline file loses a case or gains an unrecorded one.
    /// </summary>
    [Fact]
    public void Baseline_covers_every_case_the_requirement_enumerates()
    {
        Assert.Equal(RequiredCoverage.OrderBy(k => k, StringComparer.Ordinal),
                     Baseline.Value.Profiles.Select(p => p.Key).OrderBy(k => k, StringComparer.Ordinal));

        Assert.Equal(RequiredCoverage.OrderBy(k => k, StringComparer.Ordinal),
                     BaselineProfiles.All.Select(c => c.Key).OrderBy(k => k, StringComparer.Ordinal));

        Assert.All(Baseline.Value.Profiles, p =>
            Assert.False(p.Results.Count == 0, $"Baseline profile '{p.Key}' records no results."));
    }

    private static void CompareStringLists(List<string> failures, string at, List<string> expected, List<string> actual)
    {
        if (expected.Count != actual.Count)
        {
            failures.Add($"{at}: expected {expected.Count} entr(ies), got {actual.Count}");
        }

        for (int i = 0; i < Math.Max(expected.Count, actual.Count); i++)
        {
            string? e = i < expected.Count ? expected[i] : null;
            string? a = i < actual.Count ? actual[i] : null;

            if (StringComparer.Ordinal.Equals(e, a))
            {
                continue;
            }

            failures.Add($"{at}[{i}]:{Environment.NewLine}" +
                         $"    expected: {Render(e)}{Environment.NewLine}" +
                         $"    actual:   {Render(a)}{Environment.NewLine}" +
                         $"    {DescribeFirstDifference(e, a)}");
        }
    }

    private static string Render(string? value) => value is null ? "<missing>" : $"\"{value}\"";

    /// <summary>
    /// Points at the exact character that differs, and names it by code point. Reason-string
    /// regressions in this codebase are overwhelmingly invisible ones — a straight
    /// apostrophe replacing the U+2019 in "applicant’s district", or a culture-dependent
    /// thousands separator — so a bare "strings differ" would waste a reviewer's afternoon.
    /// </summary>
    private static string DescribeFirstDifference(string? expected, string? actual)
    {
        if (expected is null || actual is null)
        {
            return "one side is absent";
        }

        int limit = Math.Min(expected.Length, actual.Length);
        for (int i = 0; i < limit; i++)
        {
            if (expected[i] != actual[i])
            {
                return $"first difference at index {i}: expected {Describe(expected[i])}, got {Describe(actual[i])}";
            }
        }

        return expected.Length < actual.Length
            ? $"actual has {actual.Length - expected.Length} extra trailing character(s), starting with {Describe(actual[limit])}"
            : $"actual is missing {expected.Length - actual.Length} trailing character(s), starting with {Describe(expected[limit])}";
    }

    private static string Describe(char c) =>
        char.IsControl(c) || c > 0x7E
            ? $"U+{(int)c:X4}"
            : $"'{c}' (U+{(int)c:X4})";

    private static string BuildReport(string profileKey, string coverage, List<string> failures)
    {
        var report = new StringBuilder();
        report.AppendLine($"Matching output no longer equals the frozen baseline for profile '{profileKey}'.");
        report.AppendLine($"Coverage: {coverage}");
        report.AppendLine();
        report.AppendLine($"{failures.Count} difference(s):");

        foreach (var failure in failures)
        {
            report.AppendLine($"  - {failure}");
        }

        report.AppendLine();
        report.AppendLine("This test is the Phase E merge gate (R3.7). Either the change under review altered");
        report.AppendLine("matching behaviour — in which case it is not a behaviour-preserving refactor — or the");
        report.AppendLine("change is intended, in which case re-record the baseline and justify every diff in review.");

        if (Baseline.Value.HandDerived)
        {
            report.AppendLine();
            report.AppendLine("NOTE: the baseline is still HAND-DERIVED (handDerived: true), so it may itself be");
            report.AppendLine("wrong. Regenerate it before concluding this is a regression:");
            report.AppendLine("    dotnet run --project tests/baseline/BaselineRecorder");
        }

        return report.ToString();
    }

    private static string RegenerateHint() =>
        "Regenerate with: dotnet run --project tests/baseline/BaselineRecorder";

    private static BaselineDocument Load()
    {
        var path = Program.ResolveDefaultOutputPath();
        var json = File.ReadAllText(path);

        return JsonSerializer.Deserialize<BaselineDocument>(json, BaselineJson.Options)
               ?? throw new InvalidOperationException($"Baseline at {path} deserialised to null.");
    }
}
