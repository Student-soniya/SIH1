namespace SchemeReady.Api.Matching;

/// <summary>
/// Constants for the indicative EMI shown beside each match result.
///
/// These are neither eligibility thresholds nor scoring weights — they shape a
/// presentational projection, not a decision — so they stay compiled constants rather
/// than moving into the Rule_Store in Phase E. They are extracted here only so that
/// <c>Services/Services.cs</c> holds no bare number (R3.1).
///
/// Values are unchanged from the previous inline expressions
/// <c>scheme.MaximumProjectCost * 0.90m</c> and <c>Math.Min(36, scheme.MaximumTenureMonths)</c>.
/// </summary>
internal static class EmiProjection
{
    /// <summary>
    /// Share of the scheme ceiling assumed to be debt-financed; the remainder stands in
    /// for promoter margin money. Caps the projected loan portion.
    /// </summary>
    internal const decimal MaximumFinancedShareOfCeiling = 0.90m;

    /// <summary>
    /// Tenure cap for the illustrative EMI, so schemes with 48- and 60-month ceilings are
    /// still previewed on a comparable three-year basis.
    /// </summary>
    internal const int MaximumProjectedTenureMonths = 36;
}
