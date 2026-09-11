namespace SchemeReady.Api.Models;

/// <summary>
/// Rule_Store row holding the eligibility thresholds for one scheme, one row per
/// <see cref="Scheme"/>.
///
/// Phase A declared the persistence shape so the initial migration could create the table
/// (R1.6). Phase E added the <c>CHECK</c> constraints for the bounds of R7.1 (migration
/// <c>20260103000000_RuleStoreCheckConstraints</c>), the seed rows in
/// <see cref="Data.SeedData.MatchingRules"/>, and every read: <c>SchemeMatchingService</c>
/// now takes every threshold from here through <see cref="MatchingRuleSet"/>.
///
/// SINGLE SOURCE OF TRUTH. <see cref="Scheme"/> still carries columns with the same names
/// (<c>IncomeLimit</c>, <c>MaximumProjectCost</c>, <c>GenderRestriction</c>, …) because they
/// are part of the scheme's published description and of the unchanged
/// <c>GET /api/schemes</c> response schema. From Phase E onward **this row is what matching
/// reads** and those columns are descriptive only. The seeder derives this row from the
/// <see cref="Scheme"/> object initialisers so the two agree on the day they are created;
/// afterwards an admin edits rules here, through <c>POST /api/admin/rules</c>.
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
