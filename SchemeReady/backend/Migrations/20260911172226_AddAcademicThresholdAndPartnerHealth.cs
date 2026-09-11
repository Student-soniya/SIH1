using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchemeReady.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAcademicThresholdAndPartnerHealth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "MinAcademicPercentage",
                table: "Schemes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "FundUtilizationStatus",
                table: "ChannelPartners",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NpaHealthScore",
                table: "ChannelPartners",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scoring_weights_component_name",
                table: "ScoringWeights",
                sql: "\"ComponentName\" IN ('Eligibility', 'ProjectCostFit', 'DocumentReadiness', 'PartnerAvailability', 'BusinessTypePreference')");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scoring_weights_range",
                table: "ScoringWeights",
                sql: "\"Weight\" >= 0 AND \"Weight\" <= 100");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_age_order",
                table: "SchemeRules",
                sql: "\"MinimumAge\" <= \"MaximumAge\"");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_business_types_count",
                table: "SchemeRules",
                sql: "jsonb_array_length(\"EligibleBusinessTypes\") BETWEEN 1 AND 20");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_categories_count",
                table: "SchemeRules",
                sql: "jsonb_array_length(\"EligibleCategories\") BETWEEN 1 AND 10");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_gender_restriction",
                table: "SchemeRules",
                sql: "\"GenderRestriction\" IN ('Any', 'Female', 'Male')");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_income_limit",
                table: "SchemeRules",
                sql: "\"IncomeLimit\" >= 0.01 AND \"IncomeLimit\" <= 99999999.99");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_interest_rate",
                table: "SchemeRules",
                sql: "\"InterestRate\" >= 0.00 AND \"InterestRate\" <= 36.00");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_max_age",
                table: "SchemeRules",
                sql: "\"MaximumAge\" >= 18 AND \"MaximumAge\" <= 75");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_max_project_cost",
                table: "SchemeRules",
                sql: "\"MaximumProjectCost\" >= 1000.00 AND \"MaximumProjectCost\" <= 100000000.00");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_min_age",
                table: "SchemeRules",
                sql: "\"MinimumAge\" >= 18 AND \"MinimumAge\" <= 75");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_min_project_cost",
                table: "SchemeRules",
                sql: "\"MinimumProjectCost\" >= 1000.00 AND \"MinimumProjectCost\" <= 100000000.00");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_moratorium",
                table: "SchemeRules",
                sql: "\"MoratoriumMonths\" >= 0 AND \"MoratoriumMonths\" <= 60");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_moratorium_within_tenure",
                table: "SchemeRules",
                sql: "\"MoratoriumMonths\" <= \"MaximumTenureMonths\"");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_project_cost_order",
                table: "SchemeRules",
                sql: "\"MinimumProjectCost\" <= \"MaximumProjectCost\"");

            migrationBuilder.AddCheckConstraint(
                name: "ck_scheme_rules_tenure",
                table: "SchemeRules",
                sql: "\"MaximumTenureMonths\" >= 1 AND \"MaximumTenureMonths\" <= 240");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "ck_scoring_weights_component_name",
                table: "ScoringWeights");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scoring_weights_range",
                table: "ScoringWeights");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_age_order",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_business_types_count",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_categories_count",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_gender_restriction",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_income_limit",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_interest_rate",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_max_age",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_max_project_cost",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_min_age",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_min_project_cost",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_moratorium",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_moratorium_within_tenure",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_project_cost_order",
                table: "SchemeRules");

            migrationBuilder.DropCheckConstraint(
                name: "ck_scheme_rules_tenure",
                table: "SchemeRules");

            migrationBuilder.DropColumn(
                name: "MinAcademicPercentage",
                table: "Schemes");

            migrationBuilder.DropColumn(
                name: "FundUtilizationStatus",
                table: "ChannelPartners");

            migrationBuilder.DropColumn(
                name: "NpaHealthScore",
                table: "ChannelPartners");
        }
    }
}
