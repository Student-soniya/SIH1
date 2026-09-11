using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using SchemeReady.Api.Data;

#nullable disable

namespace SchemeReady.Api.Migrations;

/// <summary>
/// Data-only migration: restores the women-only rule on NSFDC-MSY-03 (R3.5).
///
/// WHY THIS EXISTS. Phase B deleted the applicant-name gate
/// (<c>profile.FullName.Contains("Ravi")</c>) that was the *only* place Mahila Samriddhi
/// Yojana's women-only restriction was enforced, and moved the rule onto the row as
/// <c>Scheme.GenderRestriction</c>. <c>SeedData</c> now sets <c>"Female"</c> for that
/// scheme, which covers every fresh database — but <see cref="DatabaseSeeder"/> inserts
/// only when the primary key is absent and deliberately never issues an
/// <c>Update</c> (R1.13, R1.14), so a database seeded before this change would keep
/// <c>"Any"</c> forever and the restriction would vanish in production while passing
/// every test on a fresh database. This migration closes that window.
///
/// WHY A MIGRATION RATHER THAN SEEDER LOGIC. Migrations run exactly once per database and
/// are recorded in <c>__EFMigrationsHistory</c>. Putting the backfill in the seeder would
/// re-apply it on every startup and would overwrite a future admin decision to widen the
/// scheme. Here, an admin who deliberately sets the restriction back to <c>"Any"</c>
/// tomorrow keeps that choice across restarts.
///
/// The <c>UPDATE</c> is additionally guarded so it only touches rows still holding the
/// unrestricted default, making it safe to re-run by hand.
///
/// HAND-AUTHORED, and deliberately without a Designer/BuildTargetModel companion: it
/// changes no schema, so it contributes nothing to the model snapshot. If
/// <c>dotnet ef migrations has-pending-model-changes</c> or <c>dotnet ef migrations list</c>
/// complains, see docs/local-build-and-migrations.md — regenerate the pair with
/// <c>dotnet ef migrations add BackfillMsyGenderRestriction</c> and paste the two
/// statements below into the generated <c>Up</c>/<c>Down</c>.
/// </summary>
[DbContext(typeof(SchemeReadyDbContext))]
[Migration("20260102000000_BackfillMsyGenderRestriction")]
public partial class BackfillMsyGenderRestriction : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
UPDATE ""Schemes""
   SET ""GenderRestriction"" = 'Female'
 WHERE ""Id"" = 'NSFDC-MSY-03'
   AND (""GenderRestriction"" IS NULL
        OR ""GenderRestriction"" = ''
        OR lower(""GenderRestriction"") = 'any');
");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // Reverts to the unrestricted default so the migration is symmetric. Note that
        // reverting re-opens MSY-03 to all applicants: the pre-Phase-B name gate is gone
        // and is not coming back.
        migrationBuilder.Sql(@"
UPDATE ""Schemes""
   SET ""GenderRestriction"" = 'Any'
 WHERE ""Id"" = 'NSFDC-MSY-03'
   AND lower(""GenderRestriction"") = 'female';
");
    }
}
