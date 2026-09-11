namespace SchemeReady.Api.Models;

/// <summary>
/// One named Scoring_Weight row. Exactly five rows are expected:
/// <c>Eligibility</c>, <c>ProjectCostFit</c>, <c>DocumentReadiness</c>,
/// <c>PartnerAvailability</c>, <c>BusinessTypePreference</c> — seeded 40/25/15/10/10.
///
/// Phase A declares only the persistence shape so the initial migration can create the
/// table (R1.6). Seeding, the 0–100 range constraint, the sum-equals-100 validation and
/// the admin editor arrive in Phase E (tasks 15.1, 15.4, 15.6).
/// </summary>
public class ScoringWeight
{
    /// <summary>Primary key — the component name.</summary>
    public string ComponentName { get; set; } = string.Empty;

    public int Weight { get; set; }
}
