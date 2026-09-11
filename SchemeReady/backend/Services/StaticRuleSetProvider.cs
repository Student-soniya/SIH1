using SchemeReady.Api.Data;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Services;

/// <summary>
/// An <see cref="IRuleSetProvider"/> over a fixed, in-memory snapshot.
///
/// This exists for exactly one purpose: the baseline recorder and
/// <c>BaselineEqualityTests</c> must run <see cref="SchemeMatchingService"/> without a
/// PostgreSQL instance, and they must run it against the rules the seeder inserts — not against
/// an approximation of them. <see cref="FromSeedData"/> builds the snapshot from
/// <c>SeedData.MatchingRules</c> and <c>SeedData.MatchingWeights</c> through
/// <see cref="RuleSetProvider.BuildSnapshot"/>, so it passes through the same validation and the
/// same projection the API uses.
///
/// It is NOT registered in <c>Program.cs</c> and must never be. The API's provider is
/// <see cref="RuleSetProvider"/>, which reads the database and fails loudly when it cannot
/// (R7.5). A production fallback to compiled-in rule values is the thing Phase E deletes.
/// </summary>
public sealed class StaticRuleSetProvider : IRuleSetProvider
{
    private readonly MatchingRuleSetSnapshot _snapshot;

    public StaticRuleSetProvider(MatchingRuleSetSnapshot snapshot)
    {
        _snapshot = snapshot;
    }

    /// <summary>The snapshot a freshly seeded database yields (R7.9).</summary>
    public static StaticRuleSetProvider FromSeedData() =>
        new(RuleSetProvider.BuildSnapshot(SeedData.MatchingRules, SeedData.MatchingWeights));

    public Task<MatchingRuleSetSnapshot> GetAsync(CancellationToken ct = default) => Task.FromResult(_snapshot);

    public Task<MatchingRuleSetSnapshot> LoadAndValidateAsync(CancellationToken ct = default) => Task.FromResult(_snapshot);

    /// <summary>No cache to drop.</summary>
    public void Invalidate()
    {
    }
}
