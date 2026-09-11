using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using SchemeReady.Api.Data;

#nullable disable

namespace SchemeReady.Api.Migrations;

/// <summary>
/// Adds the R7.1 / R7.2 bound constraints to the two Rule_Store tables (task 15.1).
///
/// The tables themselves were created by <c>20260101000000_InitialPostgres</c> as declarations
/// only: Phase A needed them to exist so the initial migration was complete (R1.6), but nothing
/// read them and no bound was enforced. Phase E starts reading them, so the bounds arrive now,
/// as <c>ALTER TABLE ... ADD CONSTRAINT</c>.
///
/// ORDER MATTERS AT STARTUP. <c>Program.cs</c> runs <c>Database.MigrateAsync()</c> before
/// <c>DatabaseSeeder.SeedAsync()</c>, so these constraints exist before the first rule row is
/// inserted. That is deliberate: a seed row that violates a bound should fail loudly on the run
/// that introduces it, not survive until the constraint is added months later and then block an
/// unrelated deployment. This is also why <c>SeedData.MatchingRules</c> clamps
/// <c>NSFDC-SLS-06</c>'s <c>MinimumAge</c> of 17 up to the declared minimum of 18 — see the
/// remarks there; no scoring path reads age, so the clamp changes no behaviour.
///
/// EXISTING DATABASES. A database seeded before Phase E holds no <c>SchemeRules</c> or
/// <c>ScoringWeights</c> rows at all — nothing wrote them — so every <c>ADD CONSTRAINT</c>
/// validates against an empty table and cannot fail. If a hand-inserted row does exist and
/// violates a bound, the migration fails and the process does not start, which is the correct
/// outcome: the alternative is an engine scoring applicants against that row.
///
/// HAND-AUTHORED, without a Designer/BuildTargetModel companion, matching the convention of
/// <c>20260102000000_BackfillMsyGenderRestriction</c>. The constraints are declared in
/// <c>SchemeReadyDbContext.ConfigureRuleStore</c> too, so a regenerated snapshot will contain
/// them; if <c>dotnet ef migrations has-pending-model-changes</c> complains, regenerate the pair
/// with <c>dotnet ef migrations add RuleStoreCheckConstraints</c> and confirm the generated
/// <c>Up</c> matches the statements below. See docs/local-build-and-migrations.md.
/// </summary>
[DbContext(typeof(SchemeReadyDbContext))]
[Migration("20260103000000_RuleStoreCheckConstraints")]
public partial class RuleStoreCheckConstraints : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // The numbers below are the RuleBounds constants. They are literals here because a
        // migration must describe the schema as it was at this revision — interpolating live
        // constants would let a future bound change silently rewrite history. A bound that
        // changes later gets a new migration.
        migrationBuilder.Sql(@"
ALTER TABLE ""SchemeRules""
  ADD CONSTRAINT ck_scheme_rules_min_age
      CHECK (""MinimumAge"" >= 18 AND ""MinimumAge"" <= 75),
  ADD CONSTRAINT ck_scheme_rules_max_age
      CHECK (""MaximumAge"" >= 18 AND ""MaximumAge"" <= 75),
  ADD CONSTRAINT ck_scheme_rules_age_order
      CHECK (""MinimumAge"" <= ""MaximumAge""),
  ADD CONSTRAINT ck_scheme_rules_income_limit
      CHECK (""IncomeLimit"" >= 0.01 AND ""IncomeLimit"" <= 99999999.99),
  ADD CONSTRAINT ck_scheme_rules_min_project_cost
      CHECK (""MinimumProjectCost"" >= 1000.00 AND ""MinimumProjectCost"" <= 100000000.00),
  ADD CONSTRAINT ck_scheme_rules_max_project_cost
      CHECK (""MaximumProjectCost"" >= 1000.00 AND ""MaximumProjectCost"" <= 100000000.00),
  ADD CONSTRAINT ck_scheme_rules_project_cost_order
      CHECK (""MinimumProjectCost"" <= ""MaximumProjectCost""),
  ADD CONSTRAINT ck_scheme_rules_interest_rate
      CHECK (""InterestRate"" >= 0.00 AND ""InterestRate"" <= 36.00),
  ADD CONSTRAINT ck_scheme_rules_tenure
      CHECK (""MaximumTenureMonths"" >= 1 AND ""MaximumTenureMonths"" <= 240),
  ADD CONSTRAINT ck_scheme_rules_moratorium
      CHECK (""MoratoriumMonths"" >= 0 AND ""MoratoriumMonths"" <= 60),
  ADD CONSTRAINT ck_scheme_rules_moratorium_within_tenure
      CHECK (""MoratoriumMonths"" <= ""MaximumTenureMonths""),
  ADD CONSTRAINT ck_scheme_rules_gender_restriction
      CHECK (""GenderRestriction"" IN ('Any', 'Female', 'Male')),
  ADD CONSTRAINT ck_scheme_rules_business_types_count
      CHECK (jsonb_array_length(""EligibleBusinessTypes"") BETWEEN 1 AND 20),
  ADD CONSTRAINT ck_scheme_rules_categories_count
      CHECK (jsonb_array_length(""EligibleCategories"") BETWEEN 1 AND 10);
");

        migrationBuilder.Sql(@"
ALTER TABLE ""ScoringWeights""
  ADD CONSTRAINT ck_scoring_weights_range
      CHECK (""Weight"" >= 0 AND ""Weight"" <= 100),
  ADD CONSTRAINT ck_scoring_weights_component_name
      CHECK (""ComponentName"" IN ('Eligibility', 'ProjectCostFit', 'DocumentReadiness',
                                  'PartnerAvailability', 'BusinessTypePreference'));
");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
ALTER TABLE ""SchemeRules""
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_min_age,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_max_age,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_age_order,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_income_limit,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_min_project_cost,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_max_project_cost,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_project_cost_order,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_interest_rate,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_tenure,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_moratorium,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_moratorium_within_tenure,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_gender_restriction,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_business_types_count,
  DROP CONSTRAINT IF EXISTS ck_scheme_rules_categories_count;
");

        migrationBuilder.Sql(@"
ALTER TABLE ""ScoringWeights""
  DROP CONSTRAINT IF EXISTS ck_scoring_weights_range,
  DROP CONSTRAINT IF EXISTS ck_scoring_weights_component_name;
");
    }
}
