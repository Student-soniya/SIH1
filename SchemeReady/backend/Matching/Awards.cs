namespace SchemeReady.Api.Matching;

/// <summary>
/// The five component weights as seeded today.
///
/// Phase B keeps them here so <c>Services/Services.cs</c> contains no scoring literal
/// (R3.1, R7.3). Phase E replaces every reference to this class with a named field read
/// from <c>MatchingRuleSet.Weights</c>, which <c>SeedData.MatchingRules</c> seeds to
/// exactly these values — that is what makes the Phase E migration provably
/// behaviour-preserving against <c>tests/baseline/MatchingBaseline.json</c>.
///
/// The five values sum to 100, which is the invariant Phase E enforces at startup.
/// </summary>
internal static class SeededWeights
{
    internal const int Eligibility = 40;
    internal const int ProjectCost = 25;
    internal const int Documents = 15;
    internal const int Partner = 10;
    internal const int BusinessType = 10;
}

/// <summary>
/// Partial component awards expressed as exact integer fractions of the owning weight.
///
/// Every method is the number that is hard-coded in <c>Services/Services.cs</c> today,
/// written as <c>weight × numerator / denominator</c> where the denominator is the
/// weight seeded for that component. Because the seeded weight *equals* the denominator,
/// each award evaluates to *exactly* today's literal — integer arithmetic throughout, no
/// floating point, no rounding drift — so R3.7's zero-tolerance baseline equality holds
/// byte-for-byte once Phase E starts sourcing weights from the Rule_Store.
///
/// An admin who later moves the eligibility weight to 44 gets proportional awards
/// (22 + 22) instead of a component that silently overflows its own weight.
///
/// This is a fixed set of individually named methods, one per branch of the five
/// separately computed components (R3.1). It is not a rule interpreter: there is no
/// reflection, no attribute lookup and no expression evaluation anywhere in this file.
/// </summary>
internal static class Awards
{
    /// <summary>
    /// Rounds <c>weight × num / den</c> half-up in pure integer arithmetic.
    /// With <c>den == weight</c> — the seeded case — this returns <c>num</c> exactly.
    /// </summary>
    private static int Scale(int weight, int num, int den) => (weight * num + den / 2) / den;

    // ---------------------------------------------------------------- eligibility (40)
    internal static int EligibilityCategory(int w) => Scale(w, 20, 40);   // w=40 → 20
    internal static int EligibilityIncome(int w) => Scale(w, 20, 40);     // w=40 → 20

    /// <summary>Subtracted from the eligibility component, floored at 0 (R3.5).</summary>
    internal static int GenderPenalty(int w) => Scale(w, 15, 40);         // w=40 → 15

    // --------------------------------------------------------------- project cost (25)
    internal static int CostInRange(int w) => w;                          // w=25 → 25
    internal static int CostBelowMin(int w) => Scale(w, 8, 25);           // w=25 → 8
    internal static int CostAboveMax(int w) => Scale(w, 5, 25);           // w=25 → 5

    // ------------------------------------------------------------------ documents (15)
    internal static int DocCaste(int w) => Scale(w, 8, 15);               // w=15 → 8
    internal static int DocIncome(int w) => Scale(w, 7, 15);              // w=15 → 7

    // -------------------------------------------------------------------- partner (10)
    internal static int PartnerPresent(int w) => w;                       // w=10 → 10
    internal static int PartnerAbsent(int w) => Scale(w, 4, 10);          // w=10 → 4

    // -------------------------------------------------------------- business type (10)
    internal static int BusinessMatch(int w) => w;                        // w=10 → 10
    internal static int BusinessMismatch(int w) => Scale(w, 4, 10);       // w=10 → 4
}
