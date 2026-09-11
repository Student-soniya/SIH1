namespace SchemeReady.Api.Models;

/// <summary>
/// The declared bounds of R7.1 and R7.2, in one place.
///
/// Three consumers read these constants and must agree, which is the entire reason they are
/// constants rather than three copies of the same numbers:
///
/// * <c>SchemeReadyDbContext.ConfigureRuleStore</c> turns them into <c>CHECK</c> constraints,
///   so the database refuses an out-of-bounds row even if it arrives by <c>psql</c>.
/// * <c>AdminRulesController</c> validates submissions against them, so an out-of-bounds
///   submission gets a 400 naming the field and the value instead of a constraint violation
///   surfacing as a 500 (R7.7).
/// * The frontend rule editor mirrors them to disable the save control (R7.10). That mirror is
///   a convenience, never the authority — every bound is enforced server-side and again in the
///   database.
///
/// These are *bounds on rule data*, not scoring behaviour: nothing here is a threshold used in
/// matching, so none of it belongs in <c>Services.cs</c>.
/// </summary>
public static class RuleBounds
{
    public const int MinAge = 18;
    public const int MaxAge = 75;

    public const decimal MinIncomeLimit = 0.01m;
    public const decimal MaxIncomeLimit = 99_999_999.99m;

    public const decimal MinProjectCost = 1_000.00m;
    public const decimal MaxProjectCost = 100_000_000.00m;

    public const int MinEligibleBusinessTypes = 1;
    public const int MaxEligibleBusinessTypes = 20;

    public const int MinEligibleCategories = 1;
    public const int MaxEligibleCategories = 10;

    public const int MinTermLength = 1;
    public const int MaxTermLength = 100;

    public const decimal MinInterestRate = 0.00m;
    public const decimal MaxInterestRate = 36.00m;

    public const int MinTenureMonths = 1;
    public const int MaxTenureMonths = 240;

    public const int MinMoratoriumMonths = 0;
    public const int MaxMoratoriumMonths = 60;

    public const int MinWeight = 0;
    public const int MaxWeight = 100;

    /// <summary>R7.2, R7.6, R7.8 — the five weights must sum to exactly this.</summary>
    public const int RequiredWeightSum = 100;

    /// <summary>The closed set of gender-restriction values (R7.1).</summary>
    public static readonly string[] GenderRestrictions = { "Any", "Female", "Male" };

    public static bool IsValidGenderRestriction(string? value) =>
        value is not null &&
        GenderRestrictions.Any(g => g.Equals(value, StringComparison.OrdinalIgnoreCase));
}
