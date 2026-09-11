using Microsoft.EntityFrameworkCore;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Data;

/// <summary>
/// Reads and writes the Rule_Store tables (design C5). Deliberately thin: it moves rows, and
/// nothing else. Validation lives in <c>AdminRulesController</c> (so a rejection can name the
/// field and the submitted value, R7.7), the sum-equals-100 and missing-component checks live
/// in <see cref="Services.RuleSetProvider"/> (so they run on every load, not only on save,
/// R7.8), and the bounds live again as <c>CHECK</c> constraints in the database.
/// </summary>
public interface IRuleStore
{
    Task<IReadOnlyDictionary<string, SchemeRuleRow>> GetSchemeRulesAsync(CancellationToken ct);

    Task<IReadOnlyList<ScoringWeight>> GetWeightRowsAsync(CancellationToken ct);

    /// <summary>
    /// Upserts one rule row. Returns the field-level changes actually made — the audit trail of
    /// R7.13 records one event per *changed* field, so the comparison has to happen here, where
    /// both the stored and the submitted value are in hand.
    /// </summary>
    Task<IReadOnlyList<RuleFieldChange>> SaveSchemeRuleAsync(SchemeRuleRow row, CancellationToken ct);

    /// <summary>Upserts the five weight rows in one transaction. Returns the changed ones.</summary>
    Task<IReadOnlyList<RuleFieldChange>> SaveWeightsAsync(ScoringWeights weights, CancellationToken ct);
}

/// <summary>One field whose stored value differs from the submitted value (R7.13).</summary>
public sealed record RuleFieldChange(string EntityId, string FieldName, string? PreviousValue, string? NewValue);

public class EfRuleStore : IRuleStore
{
    private readonly SchemeReadyDbContext _db;

    public EfRuleStore(SchemeReadyDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyDictionary<string, SchemeRuleRow>> GetSchemeRulesAsync(CancellationToken ct)
    {
        var rows = await _db.SchemeRules.AsNoTracking().ToListAsync(ct);
        return rows.ToDictionary(r => r.SchemeId, StringComparer.Ordinal);
    }

    public async Task<IReadOnlyList<ScoringWeight>> GetWeightRowsAsync(CancellationToken ct) =>
        await _db.ScoringWeights.AsNoTracking().ToListAsync(ct);

    public async Task<IReadOnlyList<RuleFieldChange>> SaveSchemeRuleAsync(SchemeRuleRow row, CancellationToken ct)
    {
        var changes = new List<RuleFieldChange>();

        await using var tx = await _db.Database.BeginTransactionAsync(ct);

        var existing = await _db.SchemeRules.FirstOrDefaultAsync(r => r.SchemeId == row.SchemeId, ct);

        if (existing is null)
        {
            _db.SchemeRules.Add(row);
            changes.Add(new RuleFieldChange(row.SchemeId, "SchemeRules row", null, "created"));
        }
        else
        {
            // One comparison per field, spelled out. No reflection: an added field should force a
            // decision here rather than silently acquire an audit entry with a stringified value
            // nobody chose.
            Compare(changes, row.SchemeId, nameof(row.MinimumAge), existing.MinimumAge, row.MinimumAge);
            Compare(changes, row.SchemeId, nameof(row.MaximumAge), existing.MaximumAge, row.MaximumAge);
            Compare(changes, row.SchemeId, nameof(row.IncomeLimit), existing.IncomeLimit, row.IncomeLimit);
            Compare(changes, row.SchemeId, nameof(row.MinimumProjectCost), existing.MinimumProjectCost, row.MinimumProjectCost);
            Compare(changes, row.SchemeId, nameof(row.MaximumProjectCost), existing.MaximumProjectCost, row.MaximumProjectCost);
            Compare(changes, row.SchemeId, nameof(row.GenderRestriction), existing.GenderRestriction, row.GenderRestriction);
            Compare(changes, row.SchemeId, nameof(row.InterestRate), existing.InterestRate, row.InterestRate);
            Compare(changes, row.SchemeId, nameof(row.MaximumTenureMonths), existing.MaximumTenureMonths, row.MaximumTenureMonths);
            Compare(changes, row.SchemeId, nameof(row.MoratoriumMonths), existing.MoratoriumMonths, row.MoratoriumMonths);

            CompareList(changes, row.SchemeId, nameof(row.EligibleBusinessTypes), existing.EligibleBusinessTypes, row.EligibleBusinessTypes);
            CompareList(changes, row.SchemeId, nameof(row.EligibleCategories), existing.EligibleCategories, row.EligibleCategories);

            existing.MinimumAge = row.MinimumAge;
            existing.MaximumAge = row.MaximumAge;
            existing.IncomeLimit = row.IncomeLimit;
            existing.MinimumProjectCost = row.MinimumProjectCost;
            existing.MaximumProjectCost = row.MaximumProjectCost;
            existing.EligibleBusinessTypes = new List<string>(row.EligibleBusinessTypes);
            existing.EligibleCategories = new List<string>(row.EligibleCategories);
            existing.GenderRestriction = row.GenderRestriction;
            existing.InterestRate = row.InterestRate;
            existing.MaximumTenureMonths = row.MaximumTenureMonths;
            existing.MoratoriumMonths = row.MoratoriumMonths;
        }

        await _db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);

        return changes;
    }

    public async Task<IReadOnlyList<RuleFieldChange>> SaveWeightsAsync(ScoringWeights weights, CancellationToken ct)
    {
        var changes = new List<RuleFieldChange>();
        var submitted = weights.AsDictionary();

        // One transaction for all five (R7.6): a rejected or failed save must leave *every*
        // stored weight unchanged, never three of five.
        await using var tx = await _db.Database.BeginTransactionAsync(ct);

        var stored = await _db.ScoringWeights.ToListAsync(ct);

        foreach (var (component, value) in submitted)
        {
            var row = stored.FirstOrDefault(w => string.Equals(w.ComponentName, component, StringComparison.Ordinal));

            if (row is null)
            {
                _db.ScoringWeights.Add(new ScoringWeight { ComponentName = component, Weight = value });
                changes.Add(new RuleFieldChange(component, "Weight", null, value.ToString()));
                continue;
            }

            if (row.Weight != value)
            {
                changes.Add(new RuleFieldChange(component, "Weight", row.Weight.ToString(), value.ToString()));
                row.Weight = value;
            }
        }

        await _db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);

        return changes;
    }

    private static void Compare<T>(List<RuleFieldChange> changes, string id, string field, T previous, T next)
        where T : IEquatable<T>
    {
        if (!previous.Equals(next))
        {
            changes.Add(new RuleFieldChange(id, field, previous.ToString(), next.ToString()));
        }
    }

    private static void Compare(List<RuleFieldChange> changes, string id, string field, string previous, string next)
    {
        if (!string.Equals(previous, next, StringComparison.Ordinal))
        {
            changes.Add(new RuleFieldChange(id, field, previous, next));
        }
    }

    /// <summary>
    /// Ordinal and order-sensitive, matching <c>OrderedListComparer</c> in the context: a pure
    /// reorder is a change, and it should be audited as one.
    /// </summary>
    private static void CompareList(List<RuleFieldChange> changes, string id, string field,
                                    List<string> previous, List<string> next)
    {
        if (!previous.SequenceEqual(next, StringComparer.Ordinal))
        {
            changes.Add(new RuleFieldChange(id, field, string.Join(", ", previous), string.Join(", ", next)));
        }
    }
}
