namespace SchemeReady.Api.Models;

/// <summary>
/// One named Scoring_Weight row. Exactly five rows are expected:
/// <c>Eligibility</c>, <c>ProjectCostFit</c>, <c>DocumentReadiness</c>,
/// <c>PartnerAvailability</c>, <c>BusinessTypePreference</c> — seeded 40/25/15/10/10.
///
/// Phase A declared only the persistence shape so the initial migration could create the
/// table (R1.6). Phase E added the 0–100 <c>CHECK</c> constraint, the seed rows, the
/// sum-equals-100 validation at startup and on save, and the admin editor.
///
/// The matching engine never reads this class: <see cref="Services.RuleSetProvider"/>
/// projects the five rows onto the named fields of <see cref="ScoringWeights"/>, so a
/// missing component is a load-time failure rather than a silent zero at a call site.
/// </summary>
public class ScoringWeight
{
    /// <summary>Primary key — the component name.</summary>
    public string ComponentName { get; set; } = string.Empty;

    public int Weight { get; set; }
}
