using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchemeReady.Api.Auth;
using SchemeReady.Api.Data;
using SchemeReady.Api.Models;
using SchemeReady.Api.Services;

namespace SchemeReady.Api.Controllers;

/// <summary>
/// Rule_Store editing (R7.6, R7.7, R7.13). New routes; no existing route, verb, request schema
/// or success-response schema is touched.
///
/// <c>[Authorize(Roles = Admin)]</c> sits on the controller, not the actions, so an action added
/// later cannot arrive unattributed (R4.14).
/// </summary>
[ApiController]
[Route("api/admin/rules")]
[Authorize(Roles = RoleNames.Admin)]
public class AdminRulesController : ControllerBase
{
    private readonly IRuleStore _store;
    private readonly IRuleSetProvider _provider;
    private readonly ISchemeMatchingService _matching;
    private readonly IAuditWriter _audit;

    public AdminRulesController(
        IRuleStore store,
        IRuleSetProvider provider,
        ISchemeMatchingService matching,
        IAuditWriter audit)
    {
        _store = store;
        _provider = provider;
        _matching = matching;
        _audit = audit;
    }

    // ------------------------------------------------------------------------------ read

    /// <summary>
    /// Everything the editor needs in one round trip: the stored rule rows, the five weights, the
    /// declared bounds, and the sample profile the preview scores.
    ///
    /// The bounds travel with the payload rather than being duplicated in the frontend as
    /// literals. The editor still has to mirror them to disable the save control (R7.10), but it
    /// mirrors *these*, so a bound corrected here needs no matching frontend edit.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<AdminRulesResponse>> Get(CancellationToken ct)
    {
        var rows = await _store.GetSchemeRulesAsync(ct);
        var weightRows = await _store.GetWeightRowsAsync(ct);

        return Ok(new AdminRulesResponse
        {
            Rules = rows.Values.OrderBy(r => r.SchemeId, StringComparer.Ordinal).ToList(),
            Weights = weightRows
                .OrderBy(w => Array.IndexOf(ScoringWeights.Components.All, w.ComponentName))
                .ToDictionary(w => w.ComponentName, w => w.Weight, StringComparer.Ordinal),
            Bounds = RuleBoundsDto.Current,
            SampleProfile = SeedData.SamplePreviewProfile
        });
    }

    // ------------------------------------------------------------------------------ save

    /// <summary>
    /// Saves one rule row, or the five weights, or both.
    ///
    /// ORDER OF OPERATIONS, which is the part that matters:
    ///
    /// 1. Validate everything submitted. Any failure returns 400 naming the field and the
    ///    submitted value, and nothing at all is written — not the valid half of the payload
    ///    either (R7.6, R7.7).
    /// 2. Write, each part in its own transaction.
    /// 3. <c>Invalidate()</c> the cache.
    /// 4. *Then* return 200.
    ///
    /// Step 3 before step 4 is R7.4 stated precisely: the first matching request accepted after
    /// the caller sees this response must use the saved values. Invalidating after the response —
    /// or on a timer — leaves a window in which an administrator has been told the correction is
    /// live while beneficiaries are still scored against the old threshold.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<AdminRulesSaveResponse>> Save([FromBody] AdminRulesSaveRequest request, CancellationToken ct)
    {
        if (request.Rule is null && request.Weights is null)
        {
            return BadRequest(new { error = "Supply a rule row, a weight set, or both. The request body contained neither." });
        }

        // -------- validate first, write nothing yet
        if (request.Rule is not null)
        {
            var failure = ValidateRule(request.Rule);
            if (failure is not null)
            {
                return BadRequest(new { error = failure });                    // stored row unchanged (R7.7)
            }
        }

        ScoringWeights? weights = null;
        if (request.Weights is not null)
        {
            var (parsed, weightFailure) = ValidateWeights(request.Weights);
            if (weightFailure is not null)
            {
                return BadRequest(new { error = weightFailure });              // every stored weight unchanged (R7.6)
            }

            weights = parsed;
        }

        // -------- write
        var changes = new List<RuleFieldChange>();
        string entityType = "SchemeRules";

        if (request.Rule is not null)
        {
            changes.AddRange(await _store.SaveSchemeRuleAsync(ToRow(request.Rule), ct));
        }

        if (weights is not null)
        {
            var weightChanges = await _store.SaveWeightsAsync(weights, ct);
            if (weightChanges.Count > 0 && request.Rule is null)
            {
                entityType = "ScoringWeights";
            }

            changes.AddRange(weightChanges);
        }

        // -------- invalidate, then respond
        _provider.Invalidate();

        // One event per field whose value actually changed, carrying previous and new values
        // (R7.13). A save that changes nothing writes nothing: an audit log padded with no-op
        // entries is an audit log nobody reads.
        string actorId = User.UserId() ?? "unknown";
        string sourceIp = HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? string.Empty;

        foreach (var change in changes)
        {
            await _audit.WriteAsync(new AuditEvent
            {
                ActorId = actorId,
                ActionType = "ScoringWeightChange",
                EntityType = entityType,
                EntityId = change.EntityId,
                SourceIpAddress = sourceIp,
                Outcome = "Success",
                Detail = JsonSerializer.Serialize(new
                {
                    field = change.FieldName,
                    previousValue = change.PreviousValue,
                    newValue = change.NewValue
                })
            }, ct);
        }

        return Ok(new AdminRulesSaveResponse
        {
            ChangedFieldCount = changes.Count,
            ChangedFields = changes.Select(c => $"{c.EntityId}.{c.FieldName}").ToList()
        });
    }

    // --------------------------------------------------------------------------- preview

    /// <summary>
    /// R7.11 — scores one stored sample profile twice: once against the currently stored rules and
    /// once against the submitted pending values. Nothing is written.
    ///
    /// Both sides run through the one and only <see cref="ISchemeMatchingService"/>, so the
    /// preview cannot drift from what saving would actually produce. A frontend reimplementation
    /// of the scoring rules would have been quicker to write and would have started lying the
    /// first time either copy changed.
    ///
    /// Pending values face exactly the same validation as a save, so a preview of an invalid edit
    /// gets the same 400 the save would.
    /// </summary>
    [HttpPost("preview")]
    public async Task<ActionResult<RulePreviewResponse>> Preview([FromBody] AdminRulesSaveRequest request, CancellationToken ct)
    {
        if (request.Rule is null && request.Weights is null)
        {
            return BadRequest(new { error = "Supply a rule row, a weight set, or both to preview." });
        }

        if (request.Rule is not null)
        {
            var failure = ValidateRule(request.Rule);
            if (failure is not null) return BadRequest(new { error = failure });
        }

        ScoringWeights? pendingWeights = null;
        if (request.Weights is not null)
        {
            var (parsed, failure) = ValidateWeights(request.Weights);
            if (failure is not null) return BadRequest(new { error = failure });
            pendingWeights = parsed;
        }

        // Bypasses the cache deliberately: a preview must compare against what is in the database
        // right now, not against a snapshot up to 60 seconds old.
        var stored = await _provider.LoadAndValidateAsync(ct);

        var pendingWeightSet = pendingWeights ?? stored.Weights;
        var pendingSets = stored.BySchemeId.ToDictionary(
            kv => kv.Key,
            kv => kv.Value with { Weights = pendingWeightSet },
            StringComparer.Ordinal);

        if (request.Rule is not null)
        {
            // Validated above, so ToRuleSet cannot throw here.
            pendingSets[request.Rule.SchemeId] = RuleSetProvider.ToRuleSet(ToRow(request.Rule), pendingWeightSet);
        }

        var pending = new MatchingRuleSetSnapshot(pendingSets, pendingWeightSet);

        var profile = SeedData.SamplePreviewProfile;

        return Ok(new RulePreviewResponse
        {
            SampleProfile = profile,
            Stored = await _matching.MatchSchemesAsync(profile, stored),
            Pending = await _matching.MatchSchemesAsync(profile, pending)
        });
    }

    // ------------------------------------------------------------------------ validation

    /// <summary>
    /// Returns null when the row is acceptable, otherwise the message naming the offending field
    /// and the submitted value (R7.7). Checks run in a fixed order so the message is
    /// deterministic. Bound checks precede cross-field checks, so "min age 9 exceeds max age 8"
    /// never masks the fact that both are out of range.
    /// </summary>
    private static string? ValidateRule(SchemeRuleDto rule)
    {
        if (string.IsNullOrWhiteSpace(rule.SchemeId))
        {
            return "schemeId is required.";
        }

        var range = FirstRangeFailure(rule);
        if (range is not null) return range;

        if (!RuleBounds.IsValidGenderRestriction(rule.GenderRestriction))
        {
            return $"genderRestriction: submitted value '{rule.GenderRestriction}' is not one of {string.Join(", ", RuleBounds.GenderRestrictions)}.";
        }

        var list = FirstListFailure("eligibleBusinessTypes", rule.EligibleBusinessTypes,
                       RuleBounds.MinEligibleBusinessTypes, RuleBounds.MaxEligibleBusinessTypes)
                   ?? FirstListFailure("eligibleCategories", rule.EligibleCategories,
                       RuleBounds.MinEligibleCategories, RuleBounds.MaxEligibleCategories);
        if (list is not null) return list;

        // Cross-field (R7.7).
        if (rule.MinimumAge > rule.MaximumAge)
        {
            return $"minimumAge: submitted value {rule.MinimumAge} exceeds the submitted maximumAge {rule.MaximumAge}.";
        }

        if (rule.MinimumProjectCost > rule.MaximumProjectCost)
        {
            return $"minimumProjectCost: submitted value {rule.MinimumProjectCost} exceeds the submitted maximumProjectCost {rule.MaximumProjectCost}.";
        }

        if (rule.MoratoriumMonths > rule.MaximumTenureMonths)
        {
            return $"moratoriumMonths: submitted value {rule.MoratoriumMonths} exceeds the submitted maximumTenureMonths {rule.MaximumTenureMonths}.";
        }

        return null;
    }

    private static string? FirstRangeFailure(SchemeRuleDto r) =>
        Range("minimumAge", r.MinimumAge, RuleBounds.MinAge, RuleBounds.MaxAge)
        ?? Range("maximumAge", r.MaximumAge, RuleBounds.MinAge, RuleBounds.MaxAge)
        ?? Range("incomeLimit", r.IncomeLimit, RuleBounds.MinIncomeLimit, RuleBounds.MaxIncomeLimit)
        ?? Range("minimumProjectCost", r.MinimumProjectCost, RuleBounds.MinProjectCost, RuleBounds.MaxProjectCost)
        ?? Range("maximumProjectCost", r.MaximumProjectCost, RuleBounds.MinProjectCost, RuleBounds.MaxProjectCost)
        ?? Range("interestRate", r.InterestRate, RuleBounds.MinInterestRate, RuleBounds.MaxInterestRate)
        ?? Range("maximumTenureMonths", r.MaximumTenureMonths, RuleBounds.MinTenureMonths, RuleBounds.MaxTenureMonths)
        ?? Range("moratoriumMonths", r.MoratoriumMonths, RuleBounds.MinMoratoriumMonths, RuleBounds.MaxMoratoriumMonths);

    private static string? Range(string field, int value, int min, int max) =>
        value < min || value > max
            ? $"{field}: submitted value {value} lies outside the permitted range {min}–{max}."
            : null;

    private static string? Range(string field, decimal value, decimal min, decimal max) =>
        value < min || value > max
            ? $"{field}: submitted value {value} lies outside the permitted range {min}–{max}."
            : null;

    private static string? FirstListFailure(string field, List<string>? values, int min, int max)
    {
        if (values is null || values.Count < min || values.Count > max)
        {
            return $"{field}: submitted {values?.Count ?? 0} entr(ies); {min}–{max} are required.";
        }

        foreach (var value in values)
        {
            if (string.IsNullOrWhiteSpace(value) ||
                value.Length < RuleBounds.MinTermLength || value.Length > RuleBounds.MaxTermLength)
            {
                return $"{field}: submitted an entry of length {value?.Length ?? 0}; each entry must be " +
                       $"{RuleBounds.MinTermLength}–{RuleBounds.MaxTermLength} characters.";
            }
        }

        return null;
    }

    /// <summary>
    /// R7.6 — all five components must be present, each in range, and the five must sum to exactly
    /// 100. The rejection message states the computed sum, because "the weights must sum to 100"
    /// without saying what they currently sum to sends the administrator back to a calculator.
    /// </summary>
    private static (ScoringWeights?, string?) ValidateWeights(Dictionary<string, int> submitted)
    {
        var byName = new Dictionary<string, int>(submitted, StringComparer.Ordinal);

        var missing = ScoringWeights.Components.All.Where(n => !byName.ContainsKey(n)).ToArray();
        if (missing.Length > 0)
        {
            return (null, $"weights: no value submitted for {string.Join(", ", missing)}. All five components are required: " +
                          $"{string.Join(", ", ScoringWeights.Components.All)}.");
        }

        var unknown = byName.Keys.Where(k => !ScoringWeights.Components.All.Contains(k, StringComparer.Ordinal)).ToArray();
        if (unknown.Length > 0)
        {
            return (null, $"weights: unrecognised component name(s) {string.Join(", ", unknown)}. Permitted names: " +
                          $"{string.Join(", ", ScoringWeights.Components.All)}.");
        }

        foreach (var (component, value) in byName)
        {
            if (value < RuleBounds.MinWeight || value > RuleBounds.MaxWeight)
            {
                return (null, $"weights.{component}: submitted value {value} lies outside the permitted range " +
                              $"{RuleBounds.MinWeight}–{RuleBounds.MaxWeight}.");
            }
        }

        var weights = new ScoringWeights(
            byName[ScoringWeights.Components.Eligibility],
            byName[ScoringWeights.Components.ProjectCostFit],
            byName[ScoringWeights.Components.DocumentReadiness],
            byName[ScoringWeights.Components.PartnerAvailability],
            byName[ScoringWeights.Components.BusinessTypePreference]);

        if (weights.Sum() != RuleBounds.RequiredWeightSum)
        {
            return (null, $"weights: the five submitted values sum to {weights.Sum()}; exactly " +
                          $"{RuleBounds.RequiredWeightSum} is required. Every stored weight is left unchanged.");
        }

        return (weights, null);
    }

    private static SchemeRuleRow ToRow(SchemeRuleDto dto) => new()
    {
        SchemeId = dto.SchemeId,
        MinimumAge = dto.MinimumAge,
        MaximumAge = dto.MaximumAge,
        IncomeLimit = dto.IncomeLimit,
        MinimumProjectCost = dto.MinimumProjectCost,
        MaximumProjectCost = dto.MaximumProjectCost,
        EligibleBusinessTypes = new List<string>(dto.EligibleBusinessTypes ?? new List<string>()),
        EligibleCategories = new List<string>(dto.EligibleCategories ?? new List<string>()),
        GenderRestriction = dto.GenderRestriction,
        InterestRate = dto.InterestRate,
        MaximumTenureMonths = dto.MaximumTenureMonths,
        MoratoriumMonths = dto.MoratoriumMonths
    };
}

// ------------------------------------------------------------------------ request/response

/// <summary>
/// The submitted shape of one rule row. A DTO rather than <see cref="SchemeRuleRow"/> so model
/// binding cannot reach an EF-tracked entity, and so <c>SchemeId</c> stays required.
/// </summary>
public class SchemeRuleDto
{
    public string SchemeId { get; set; } = string.Empty;
    public int MinimumAge { get; set; }
    public int MaximumAge { get; set; }
    public decimal IncomeLimit { get; set; }
    public decimal MinimumProjectCost { get; set; }
    public decimal MaximumProjectCost { get; set; }
    public List<string>? EligibleBusinessTypes { get; set; }
    public List<string>? EligibleCategories { get; set; }
    public string GenderRestriction { get; set; } = "Any";
    public decimal InterestRate { get; set; }
    public int MaximumTenureMonths { get; set; }
    public int MoratoriumMonths { get; set; }
}

public class AdminRulesSaveRequest
{
    public SchemeRuleDto? Rule { get; set; }

    /// <summary>Component name to weight. All five or none.</summary>
    public Dictionary<string, int>? Weights { get; set; }
}

public class AdminRulesResponse
{
    public List<SchemeRuleRow> Rules { get; set; } = new();
    public Dictionary<string, int> Weights { get; set; } = new();
    public RuleBoundsDto Bounds { get; set; } = RuleBoundsDto.Current;
    public BeneficiaryProfile SampleProfile { get; set; } = new();
}

public class AdminRulesSaveResponse
{
    public int ChangedFieldCount { get; set; }
    public List<string> ChangedFields { get; set; } = new();
}

public class RulePreviewResponse
{
    public BeneficiaryProfile SampleProfile { get; set; } = new();
    public List<SchemeMatchResult> Stored { get; set; } = new();
    public List<SchemeMatchResult> Pending { get; set; } = new();
}

/// <summary>The declared bounds, serialised for the editor (R7.10).</summary>
public class RuleBoundsDto
{
    public int MinAge { get; set; }
    public int MaxAge { get; set; }
    public decimal MinIncomeLimit { get; set; }
    public decimal MaxIncomeLimit { get; set; }
    public decimal MinProjectCost { get; set; }
    public decimal MaxProjectCost { get; set; }
    public int MinEligibleBusinessTypes { get; set; }
    public int MaxEligibleBusinessTypes { get; set; }
    public int MinEligibleCategories { get; set; }
    public int MaxEligibleCategories { get; set; }
    public decimal MinInterestRate { get; set; }
    public decimal MaxInterestRate { get; set; }
    public int MinTenureMonths { get; set; }
    public int MaxTenureMonths { get; set; }
    public int MinMoratoriumMonths { get; set; }
    public int MaxMoratoriumMonths { get; set; }
    public int MinWeight { get; set; }
    public int MaxWeight { get; set; }
    public int RequiredWeightSum { get; set; }
    public List<string> GenderRestrictions { get; set; } = new();
    public List<string> WeightComponents { get; set; } = new();

    public static RuleBoundsDto Current => new()
    {
        MinAge = RuleBounds.MinAge,
        MaxAge = RuleBounds.MaxAge,
        MinIncomeLimit = RuleBounds.MinIncomeLimit,
        MaxIncomeLimit = RuleBounds.MaxIncomeLimit,
        MinProjectCost = RuleBounds.MinProjectCost,
        MaxProjectCost = RuleBounds.MaxProjectCost,
        MinEligibleBusinessTypes = RuleBounds.MinEligibleBusinessTypes,
        MaxEligibleBusinessTypes = RuleBounds.MaxEligibleBusinessTypes,
        MinEligibleCategories = RuleBounds.MinEligibleCategories,
        MaxEligibleCategories = RuleBounds.MaxEligibleCategories,
        MinInterestRate = RuleBounds.MinInterestRate,
        MaxInterestRate = RuleBounds.MaxInterestRate,
        MinTenureMonths = RuleBounds.MinTenureMonths,
        MaxTenureMonths = RuleBounds.MaxTenureMonths,
        MinMoratoriumMonths = RuleBounds.MinMoratoriumMonths,
        MaxMoratoriumMonths = RuleBounds.MaxMoratoriumMonths,
        MinWeight = RuleBounds.MinWeight,
        MaxWeight = RuleBounds.MaxWeight,
        RequiredWeightSum = RuleBounds.RequiredWeightSum,
        GenderRestrictions = RuleBounds.GenderRestrictions.ToList(),
        WeightComponents = ScoringWeights.Components.All.ToList()
    };
}
