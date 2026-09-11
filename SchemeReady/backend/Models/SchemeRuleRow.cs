namespace SchemeReady.Api.Models;

/// <summary>
/// Rule_Store row holding the eligibility thresholds for one scheme, one row per
/// <see cref="Scheme"/>.
///
/// Phase A declares only the persistence shape so the initial migration can create the
/// table (R1.6). Seeding, the CHECK constraints for the declared bounds, the cached
/// provider and the removal of the literals from <c>Services.cs</c> arrive in Phase E
/// (tasks 15.1–15.4). Nothing in Phase A reads this table, and
/// <c>SchemeMatchingService</c> still reads its thresholds from <see cref="Scheme"/>.
/// </summary>
public class SchemeRuleRow
{
    /// <summary>Primary key and foreign key to <see cref="Scheme.Id"/>.</summary>
    public string SchemeId { get; set; } = string.Empty;

    public int MinimumAge { get; set; }

    public int MaximumAge { get; set; }

    public decimal IncomeLimit { get; set; }

    public decimal MinimumProjectCost { get; set; }

    public decimal MaximumProjectCost { get; set; }

    public List<string> EligibleBusinessTypes { get; set; } = new();

    public List<string> EligibleCategories { get; set; } = new();

    /// <summary><c>Any</c> | <c>Female</c> | <c>Male</c>.</summary>
    public string GenderRestriction { get; set; } = "Any";

    public decimal InterestRate { get; set; }

    public int MaximumTenureMonths { get; set; }

    public int MoratoriumMonths { get; set; }
}
