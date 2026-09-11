using SchemeReady.Api.Data;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Services;

public interface IRuleSetProvider
{
    /// <summary>
    /// The current Rule_Store snapshot, from cache when it is younger than the TTL.
    /// Throws <see cref="RuleStoreUnavailableException"/> or <see cref="RuleDataInvalidException"/>
    /// rather than returning anything defaulted or stale (R7.5).
    /// </summary>
    Task<MatchingRuleSetSnapshot> GetAsync(CancellationToken ct = default);

    /// <summary>Drops the cache so the next read hits the database (R7.4).</summary>
    void Invalidate();

    /// <summary>
    /// Loads and validates without consulting or populating the cache — the startup gate of
    /// R7.8, and the "stored" half of the admin editor's preview.
    /// </summary>
    Task<MatchingRuleSetSnapshot> LoadAndValidateAsync(CancellationToken ct = default);
}

/// <summary>
/// Singleton cache in front of <see cref="IRuleStore"/> (design C5).
///
/// Registered as a singleton, so it holds no <c>DbContext</c>: it opens its own scope per load
/// through <see cref="IServiceScopeFactory"/>. A singleton capturing a scoped context is the
/// classic way to end up with one connection shared across every request for the lifetime of
/// the process.
///
/// NO STALE-SERVE-ON-FAILURE. This is the design decision worth stating plainly, because the
/// convenient thing to do is the wrong one. If the store is unreachable and the cache has aged
/// out, <see cref="GetAsync"/> throws and the request becomes a 503. It does not extend the TTL
/// "just this once", and it does not fall back to the numbers that used to be compiled into
/// <c>Services.cs</c>. A beneficiary being told the service is briefly unavailable is
/// recoverable; a beneficiary being handed a match score computed from an income limit that an
/// administrator corrected last month, with no indication that anything was wrong, is not
/// (R7.5).
/// </summary>
public sealed class RuleSetProvider : IRuleSetProvider
{
    /// <summary>R7.4 — a cached copy is served for at most 60 seconds.</summary>
    private static readonly TimeSpan Ttl = TimeSpan.FromSeconds(60);

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<RuleSetProvider> _logger;

    private readonly SemaphoreSlim _gate = new(1, 1);

    /// <summary>
    /// Written only under <see cref="_gate"/>; read without it on the fast path. A tuple in a
    /// nullable field is a single reference assignment, so a lock-free reader sees either the
    /// whole previous snapshot or the whole new one — never a half-updated pair.
    /// </summary>
    private volatile CacheEntry? _cache;

    private sealed record CacheEntry(MatchingRuleSetSnapshot Set, DateTimeOffset LoadedAt);

    public RuleSetProvider(IServiceScopeFactory scopeFactory, ILogger<RuleSetProvider> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async Task<MatchingRuleSetSnapshot> GetAsync(CancellationToken ct = default)
    {
        if (IsFresh(_cache, out var fast))
        {
            return fast;
        }

        await _gate.WaitAsync(ct);
        try
        {
            // Double-checked: while this caller queued on the gate another may have loaded, and
            // a stampede of six concurrent matching requests should cost one query, not six.
            if (IsFresh(_cache, out var afterWait))
            {
                return afterWait;
            }

            var set = await LoadAndValidateAsync(ct);
            _cache = new CacheEntry(set, DateTimeOffset.UtcNow);
            return set;
        }
        finally
        {
            _gate.Release();
        }
    }

    public void Invalidate()
    {
        // Called *before* an admin save returns its 200, so the first matching request accepted
        // after that response cannot be served from a pre-save snapshot (R7.4).
        _cache = null;
        _logger.LogInformation("Rule set cache invalidated; the next matching request reloads from the Rule_Store.");
    }

    public async Task<MatchingRuleSetSnapshot> LoadAndValidateAsync(CancellationToken ct = default)
    {
        IReadOnlyDictionary<string, SchemeRuleRow> ruleRows;
        IReadOnlyList<ScoringWeight> weightRows;

        try
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var store = scope.ServiceProvider.GetRequiredService<IRuleStore>();

            ruleRows = await store.GetSchemeRulesAsync(ct);
            weightRows = await store.GetWeightRowsAsync(ct);
        }
        catch (Exception ex) when (ex is not RuleDataInvalidException)
        {
            // Unreachable store, timed-out connection, missing table. Never a fallback.
            _logger.LogError(ex, "Rule_Store is unreachable; no cached or default rule values will be substituted.");
            throw new RuleStoreUnavailableException(
                "Scheme rules are temporarily unavailable. The rule store could not be read and no fresh cached copy exists.", ex);
        }

        return BuildSnapshot(ruleRows.Values, weightRows);
    }

    /// <summary>
    /// Validates and projects raw rows onto a snapshot. Separated from the database read so the
    /// baseline recorder and <c>BaselineEqualityTests</c> can build the seeded snapshot from
    /// <c>SeedData</c> directly, with no PostgreSQL instance — running the *same* validation and
    /// the *same* projection the API runs, which is the only way the baseline can be an oracle
    /// for the API's behaviour.
    /// </summary>
    public static MatchingRuleSetSnapshot BuildSnapshot(
        IEnumerable<SchemeRuleRow> ruleRows,
        IReadOnlyList<ScoringWeight> weightRows)
    {
        var weights = ProjectWeights(weightRows);

        var sets = ruleRows
            .Select(row => ToRuleSet(row, weights))
            .ToDictionary(s => s.SchemeId, StringComparer.Ordinal);

        return new MatchingRuleSetSnapshot(sets, weights);
    }

    /// <summary>
    /// Projects the five rows onto the named fields of <see cref="ScoringWeights"/>, failing on a
    /// missing component and on a sum other than 100, logging the missing names together with the
    /// computed sum (R7.8).
    /// </summary>
    public static ScoringWeights ProjectWeights(IReadOnlyList<ScoringWeight> rows)
    {
        var byName = rows.ToDictionary(r => r.ComponentName, r => r.Weight, StringComparer.Ordinal);

        var missing = ScoringWeights.Components.All.Where(name => !byName.ContainsKey(name)).ToArray();
        int computedSum = rows.Sum(r => r.Weight);

        if (missing.Length > 0)
        {
            throw new RuleDataInvalidException(string.Join(", ", missing), "ScoringWeights.ComponentName",
                $"The Rule_Store holds no scoring weight row for: {string.Join(", ", missing)}. " +
                $"Computed sum of the {rows.Count} row(s) present is {computedSum}; exactly five rows summing to " +
                $"{RuleBounds.RequiredWeightSum} are required.");
        }

        var weights = new ScoringWeights(
            byName[ScoringWeights.Components.Eligibility],
            byName[ScoringWeights.Components.ProjectCostFit],
            byName[ScoringWeights.Components.DocumentReadiness],
            byName[ScoringWeights.Components.PartnerAvailability],
            byName[ScoringWeights.Components.BusinessTypePreference]);

        foreach (var (component, value) in weights.AsDictionary())
        {
            if (value < RuleBounds.MinWeight || value > RuleBounds.MaxWeight)
            {
                throw new RuleDataInvalidException(component, "Weight",
                    $"Scoring weight '{component}' is {value}, outside the permitted range " +
                    $"{RuleBounds.MinWeight}–{RuleBounds.MaxWeight}.");
            }
        }

        if (weights.Sum() != RuleBounds.RequiredWeightSum)
        {
            throw new RuleDataInvalidException("ScoringWeights", "Weight",
                $"The five scoring weights sum to {weights.Sum()}; exactly {RuleBounds.RequiredWeightSum} is required. " +
                $"Values: {string.Join(", ", weights.AsDictionary().Select(kv => $"{kv.Key}={kv.Value}"))}.");
        }

        return weights;
    }

    /// <summary>
    /// One rule row to one <see cref="MatchingRuleSet"/>, checking every bound of R7.1 on the way
    /// through. A row that violates a bound fails the load naming the scheme and the field — it
    /// is not clamped, defaulted or skipped, because any of those would score an applicant
    /// against a threshold no administrator ever set (R3.8, R7.5).
    /// </summary>
    public static MatchingRuleSet ToRuleSet(SchemeRuleRow row, ScoringWeights weights)
    {
        string id = row.SchemeId;

        RequireRange(id, nameof(row.MinimumAge), row.MinimumAge, RuleBounds.MinAge, RuleBounds.MaxAge);
        RequireRange(id, nameof(row.MaximumAge), row.MaximumAge, RuleBounds.MinAge, RuleBounds.MaxAge);
        RequireRange(id, nameof(row.IncomeLimit), row.IncomeLimit, RuleBounds.MinIncomeLimit, RuleBounds.MaxIncomeLimit);
        RequireRange(id, nameof(row.MinimumProjectCost), row.MinimumProjectCost, RuleBounds.MinProjectCost, RuleBounds.MaxProjectCost);
        RequireRange(id, nameof(row.MaximumProjectCost), row.MaximumProjectCost, RuleBounds.MinProjectCost, RuleBounds.MaxProjectCost);
        RequireRange(id, nameof(row.InterestRate), row.InterestRate, RuleBounds.MinInterestRate, RuleBounds.MaxInterestRate);
        RequireRange(id, nameof(row.MaximumTenureMonths), row.MaximumTenureMonths, RuleBounds.MinTenureMonths, RuleBounds.MaxTenureMonths);
        RequireRange(id, nameof(row.MoratoriumMonths), row.MoratoriumMonths, RuleBounds.MinMoratoriumMonths, RuleBounds.MaxMoratoriumMonths);

        if (row.MinimumAge > row.MaximumAge)
        {
            throw Invalid(id, nameof(row.MinimumAge),
                $"minimumAge {row.MinimumAge} exceeds maximumAge {row.MaximumAge}");
        }

        if (row.MinimumProjectCost > row.MaximumProjectCost)
        {
            throw Invalid(id, nameof(row.MinimumProjectCost),
                $"minimumProjectCost {row.MinimumProjectCost} exceeds maximumProjectCost {row.MaximumProjectCost}");
        }

        if (row.MoratoriumMonths > row.MaximumTenureMonths)
        {
            throw Invalid(id, nameof(row.MoratoriumMonths),
                $"moratoriumMonths {row.MoratoriumMonths} exceeds maximumTenureMonths {row.MaximumTenureMonths}");
        }

        RequireList(id, nameof(row.EligibleBusinessTypes), row.EligibleBusinessTypes,
            RuleBounds.MinEligibleBusinessTypes, RuleBounds.MaxEligibleBusinessTypes);
        RequireList(id, nameof(row.EligibleCategories), row.EligibleCategories,
            RuleBounds.MinEligibleCategories, RuleBounds.MaxEligibleCategories);

        if (!RuleBounds.IsValidGenderRestriction(row.GenderRestriction))
        {
            throw Invalid(id, nameof(row.GenderRestriction),
                $"genderRestriction '{row.GenderRestriction}' is not one of {string.Join(", ", RuleBounds.GenderRestrictions)}");
        }

        return new MatchingRuleSet(
            SchemeId: row.SchemeId,
            MinimumAge: row.MinimumAge,
            MaximumAge: row.MaximumAge,
            IncomeLimit: row.IncomeLimit,
            MinimumProjectCost: row.MinimumProjectCost,
            MaximumProjectCost: row.MaximumProjectCost,
            EligibleBusinessTypes: new List<string>(row.EligibleBusinessTypes),
            EligibleCategories: new List<string>(row.EligibleCategories),
            GenderRestriction: row.GenderRestriction,
            InterestRate: row.InterestRate,
            MaximumTenureMonths: row.MaximumTenureMonths,
            MoratoriumMonths: row.MoratoriumMonths,
            Weights: weights);
    }

    private static bool IsFresh(CacheEntry? entry, out MatchingRuleSetSnapshot set)
    {
        if (entry is not null && DateTimeOffset.UtcNow - entry.LoadedAt < Ttl)
        {
            set = entry.Set;
            return true;
        }

        set = null!;
        return false;
    }

    private static void RequireRange(string id, string field, int value, int min, int max)
    {
        if (value < min || value > max)
        {
            throw Invalid(id, field, $"{Camel(field)} {value} lies outside the permitted range {min}–{max}");
        }
    }

    private static void RequireRange(string id, string field, decimal value, decimal min, decimal max)
    {
        if (value < min || value > max)
        {
            throw Invalid(id, field, $"{Camel(field)} {value} lies outside the permitted range {min}–{max}");
        }
    }

    private static void RequireList(string id, string field, List<string> values, int min, int max)
    {
        if (values.Count < min || values.Count > max)
        {
            throw Invalid(id, field, $"{Camel(field)} holds {values.Count} entr(ies); {min}–{max} are required");
        }

        foreach (var value in values)
        {
            if (string.IsNullOrWhiteSpace(value) ||
                value.Length < RuleBounds.MinTermLength || value.Length > RuleBounds.MaxTermLength)
            {
                throw Invalid(id, field,
                    $"{Camel(field)} holds an entry of length {value?.Length ?? 0}; each entry must be " +
                    $"{RuleBounds.MinTermLength}–{RuleBounds.MaxTermLength} characters");
            }
        }
    }

    private static RuleDataInvalidException Invalid(string id, string field, string detail) =>
        new(id, field, $"Scheme '{id}' rule data is invalid: {detail}. No default value is substituted and no partial match results are returned.");

    private static string Camel(string field) => char.ToLowerInvariant(field[0]) + field[1..];
}
