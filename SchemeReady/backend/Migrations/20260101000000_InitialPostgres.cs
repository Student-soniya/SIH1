using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SchemeReady.Api.Migrations;

/// <summary>
/// Initial PostgreSQL schema. Supersedes the deleted MS SQL Server
/// <c>Data/schema.sql</c> (R1.9).
///
/// HAND-AUTHORED. The sandbox that produced this file has no .NET SDK and no NuGet
/// access, so <c>dotnet ef migrations add</c> could not be run and neither this class nor
/// its Designer/snapshot companions have been executed against a database. They are
/// written to be correct by inspection. Before relying on them, run on your machine:
///
///     dotnet ef migrations has-pending-model-changes
///
/// A clean result confirms the hand-written snapshot matches
/// <c>SchemeReadyDbContext</c>. If it reports pending changes, delete the three files in
/// this folder and regenerate with <c>dotnet ef migrations add InitialPostgres</c>; the
/// model configuration in <c>SchemeReadyDbContext</c> is the source of truth, not this
/// transcription. See docs/local-build-and-migrations.md.
///
/// Every statement is PostgreSQL. There are no MS SQL batch separators, no
/// database-switch statements and no system-catalogue lookups (R1.8).
/// Database creation itself is a documented <c>createdb</c> step, not a migration.
/// </summary>
public partial class InitialPostgres : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // ------------------------------------------------------------- identity (R1.6)

        migrationBuilder.CreateTable(
            name: "AspNetRoles",
            columns: table => new
            {
                Id = table.Column<string>(type: "text", nullable: false),
                Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetRoles", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUsers",
            columns: table => new
            {
                Id = table.Column<string>(type: "text", nullable: false),
                DisplayName = table.Column<string>(type: "text", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                PasswordHash = table.Column<string>(type: "text", nullable: true),
                SecurityStamp = table.Column<string>(type: "text", nullable: true),
                ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                PhoneNumber = table.Column<string>(type: "text", nullable: true),
                PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUsers", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "AspNetRoleClaims",
            columns: table => new
            {
                Id = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                RoleId = table.Column<string>(type: "text", nullable: false),
                ClaimType = table.Column<string>(type: "text", nullable: true),
                ClaimValue = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                table.ForeignKey(
                    name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                    column: x => x.RoleId,
                    principalTable: "AspNetRoles",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserClaims",
            columns: table => new
            {
                Id = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                UserId = table.Column<string>(type: "text", nullable: false),
                ClaimType = table.Column<string>(type: "text", nullable: true),
                ClaimValue = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                table.ForeignKey(
                    name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserLogins",
            columns: table => new
            {
                LoginProvider = table.Column<string>(type: "text", nullable: false),
                ProviderKey = table.Column<string>(type: "text", nullable: false),
                ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                UserId = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                table.ForeignKey(
                    name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserRoles",
            columns: table => new
            {
                UserId = table.Column<string>(type: "text", nullable: false),
                RoleId = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                table.ForeignKey(
                    name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                    column: x => x.RoleId,
                    principalTable: "AspNetRoles",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserTokens",
            columns: table => new
            {
                UserId = table.Column<string>(type: "text", nullable: false),
                LoginProvider = table.Column<string>(type: "text", nullable: false),
                Name = table.Column<string>(type: "text", nullable: false),
                Value = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                table.ForeignKey(
                    name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        // ------------------------------------------------------------- Schemes (R1.5, R1.7)
        // The wide-character prose columns become text; the three List<string> properties become jsonb;
        // InterestRate is a single numeric(5,2) column.

        migrationBuilder.CreateTable(
            name: "Schemes",
            columns: table => new
            {
                Id = table.Column<string>(type: "text", maxLength: 64, nullable: false),
                Name = table.Column<string>(type: "text", nullable: false),
                SchemeType = table.Column<string>(type: "text", nullable: false),
                TargetGroup = table.Column<string>(type: "text", nullable: false),
                MinimumAge = table.Column<int>(type: "integer", nullable: false),
                MaximumAge = table.Column<int>(type: "integer", nullable: false),
                IncomeLimit = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                MinimumProjectCost = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                MaximumProjectCost = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                EligibleBusinessTypes = table.Column<string>(type: "jsonb", nullable: false),
                InterestRate = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
                MaximumTenureMonths = table.Column<int>(type: "integer", nullable: false),
                MoratoriumMonths = table.Column<int>(type: "integer", nullable: false),
                RequiredDocuments = table.Column<string>(type: "jsonb", nullable: false),
                SupportedDistricts = table.Column<string>(type: "jsonb", nullable: false),
                ApplicationMode = table.Column<string>(type: "text", nullable: false),
                OfficialUrl = table.Column<string>(type: "text", nullable: false),
                SourceDocument = table.Column<string>(type: "text", nullable: false),
                LastVerifiedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                Status = table.Column<string>(type: "text", nullable: false),
                Description = table.Column<string>(type: "text", nullable: false),
                GenderRestriction = table.Column<string>(type: "text", nullable: false, defaultValue: "Any"),
                IsIllustrative = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                VerificationSourceReference = table.Column<string>(type: "text", maxLength: 300, nullable: true),
                VerifiedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Schemes", x => x.Id);
            });

        // ------------------------------------------------------------- ChannelPartners

        migrationBuilder.CreateTable(
            name: "ChannelPartners",
            columns: table => new
            {
                Id = table.Column<string>(type: "text", maxLength: 64, nullable: false),
                InstitutionName = table.Column<string>(type: "text", nullable: false),
                InstitutionType = table.Column<string>(type: "text", nullable: false),
                District = table.Column<string>(type: "text", nullable: false),
                State = table.Column<string>(type: "text", nullable: false),
                DistanceKm = table.Column<double>(type: "double precision", nullable: false),
                ContactNumber = table.Column<string>(type: "text", nullable: false),
                ContactPerson = table.Column<string>(type: "text", nullable: false),
                Address = table.Column<string>(type: "text", nullable: false),
                ApplicationMode = table.Column<string>(type: "text", nullable: false),
                SupportedSchemes = table.Column<string>(type: "jsonb", nullable: false),
                DocumentRequirements = table.Column<string>(type: "jsonb", nullable: false),
                LastVerifiedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                IsOnlineSubmissionAvailable = table.Column<bool>(type: "boolean", nullable: false),
                Pincode = table.Column<string>(type: "text", nullable: false),
                Latitude = table.Column<double>(type: "double precision", nullable: false),
                Longitude = table.Column<double>(type: "double precision", nullable: false),
                IsIllustrative = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                VerificationSourceReference = table.Column<string>(type: "text", maxLength: 300, nullable: true),
                VerifiedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ChannelPartners", x => x.Id);
            });

        // ------------------------------------------------- ApplicationPacks (header + jsonb)

        migrationBuilder.CreateTable(
            name: "ApplicationPacks",
            columns: table => new
            {
                ApplicationId = table.Column<string>(type: "text", maxLength: 64, nullable: false),
                GeneratedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                OwnerUserId = table.Column<string>(type: "text", nullable: true),
                AssignedPartnerId = table.Column<string>(type: "text", maxLength: 64, nullable: true),
                SelectedSchemeId = table.Column<string>(type: "text", maxLength: 64, nullable: false),
                TrackingStatus = table.Column<string>(type: "text", nullable: false),
                HandoffReferenceNumber = table.Column<string>(type: "text", nullable: false),
                ApplicantBusinessType = table.Column<string>(type: "text", nullable: false),
                District = table.Column<string>(type: "text", nullable: false),
                MissingDocumentsJson = table.Column<string>(type: "jsonb", nullable: false),
                FullDossierJson = table.Column<string>(type: "jsonb", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ApplicationPacks", x => x.ApplicationId);
            });

        // ------------------------------------------------------- Rule_Store (Phase E reads it)

        migrationBuilder.CreateTable(
            name: "SchemeRules",
            columns: table => new
            {
                SchemeId = table.Column<string>(type: "text", maxLength: 64, nullable: false),
                MinimumAge = table.Column<int>(type: "integer", nullable: false),
                MaximumAge = table.Column<int>(type: "integer", nullable: false),
                IncomeLimit = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                MinimumProjectCost = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                MaximumProjectCost = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                EligibleBusinessTypes = table.Column<string>(type: "jsonb", nullable: false),
                EligibleCategories = table.Column<string>(type: "jsonb", nullable: false),
                GenderRestriction = table.Column<string>(type: "text", nullable: false, defaultValue: "Any"),
                InterestRate = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
                MaximumTenureMonths = table.Column<int>(type: "integer", nullable: false),
                MoratoriumMonths = table.Column<int>(type: "integer", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_SchemeRules", x => x.SchemeId);
                table.ForeignKey(
                    name: "FK_SchemeRules_Schemes_SchemeId",
                    column: x => x.SchemeId,
                    principalTable: "Schemes",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "ScoringWeights",
            columns: table => new
            {
                ComponentName = table.Column<string>(type: "text", maxLength: 64, nullable: false),
                Weight = table.Column<int>(type: "integer", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ScoringWeights", x => x.ComponentName);
            });

        // ----------------------------------------------------------- Refresh_Token (R1.6)

        migrationBuilder.CreateTable(
            name: "RefreshTokens",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                UserId = table.Column<string>(type: "text", nullable: false),
                TokenHash = table.Column<string>(type: "text", nullable: false),
                IssuedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                RevokedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                ReplacedByHash = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                table.ForeignKey(
                    name: "FK_RefreshTokens_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "OfficerPartnerAssignments",
            columns: table => new
            {
                UserId = table.Column<string>(type: "text", nullable: false),
                PartnerId = table.Column<string>(type: "text", maxLength: 64, nullable: false),
                AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_OfficerPartnerAssignments", x => x.UserId);
                table.ForeignKey(
                    name: "FK_OfficerPartnerAssignments_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_OfficerPartnerAssignments_ChannelPartners_PartnerId",
                    column: x => x.PartnerId,
                    principalTable: "ChannelPartners",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        // --------------------------------------------------------- Stored_Document (R1.6)

        migrationBuilder.CreateTable(
            name: "StoredDocuments",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                OwnerUserId = table.Column<string>(type: "text", nullable: false),
                ApplicationPackId = table.Column<string>(type: "text", maxLength: 64, nullable: true),
                DocumentKey = table.Column<string>(type: "text", maxLength: 32, nullable: false),
                OriginalFileName = table.Column<string>(type: "text", maxLength: 255, nullable: false),
                StoredFileName = table.Column<string>(type: "text", nullable: false),
                ContentType = table.Column<string>(type: "text", nullable: false),
                ByteLength = table.Column<long>(type: "bigint", nullable: false),
                Sha256 = table.Column<string>(type: "text", nullable: false),
                UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_StoredDocuments", x => x.Id);
                table.ForeignKey(
                    name: "FK_StoredDocuments_AspNetUsers_OwnerUserId",
                    column: x => x.OwnerUserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_StoredDocuments_ApplicationPacks_ApplicationPackId",
                    column: x => x.ApplicationPackId,
                    principalTable: "ApplicationPacks",
                    principalColumn: "ApplicationId",
                    onDelete: ReferentialAction.SetNull);
            });

        // ------------------------------------------------------------- Audit_Event (R1.7)
        // bigint GENERATED BY DEFAULT AS IDENTITY, replacing the MS SQL auto-increment key (R1.7).

        migrationBuilder.CreateTable(
            name: "AuditEvents",
            columns: table => new
            {
                Id = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                ActorId = table.Column<string>(type: "text", nullable: false),
                ActionType = table.Column<string>(type: "text", nullable: false),
                EntityType = table.Column<string>(type: "text", nullable: false),
                EntityId = table.Column<string>(type: "text", nullable: false),
                SourceIpAddress = table.Column<string>(type: "text", nullable: false),
                Outcome = table.Column<string>(type: "text", nullable: false),
                Detail = table.Column<string>(type: "jsonb", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AuditEvents", x => x.Id);
            });

        // --------------------------------------------------------------------- indexes

        migrationBuilder.CreateIndex(
            name: "RoleNameIndex",
            table: "AspNetRoles",
            column: "NormalizedName",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_AspNetRoleClaims_RoleId",
            table: "AspNetRoleClaims",
            column: "RoleId");

        migrationBuilder.CreateIndex(
            name: "EmailIndex",
            table: "AspNetUsers",
            column: "NormalizedEmail");

        migrationBuilder.CreateIndex(
            name: "UserNameIndex",
            table: "AspNetUsers",
            column: "NormalizedUserName",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_AspNetUserClaims_UserId",
            table: "AspNetUserClaims",
            column: "UserId");

        migrationBuilder.CreateIndex(
            name: "IX_AspNetUserLogins_UserId",
            table: "AspNetUserLogins",
            column: "UserId");

        migrationBuilder.CreateIndex(
            name: "IX_AspNetUserRoles_RoleId",
            table: "AspNetUserRoles",
            column: "RoleId");

        migrationBuilder.CreateIndex(
            name: "IX_ChannelPartners_District",
            table: "ChannelPartners",
            column: "District");

        migrationBuilder.CreateIndex(
            name: "IX_ApplicationPacks_OwnerUserId",
            table: "ApplicationPacks",
            column: "OwnerUserId");

        migrationBuilder.CreateIndex(
            name: "IX_ApplicationPacks_AssignedPartnerId",
            table: "ApplicationPacks",
            column: "AssignedPartnerId");

        migrationBuilder.CreateIndex(
            name: "IX_ApplicationPacks_GeneratedDate",
            table: "ApplicationPacks",
            column: "GeneratedDate");

        migrationBuilder.CreateIndex(
            name: "IX_ApplicationPacks_ApplicantBusinessType",
            table: "ApplicationPacks",
            column: "ApplicantBusinessType");

        migrationBuilder.CreateIndex(
            name: "IX_ApplicationPacks_District",
            table: "ApplicationPacks",
            column: "District");

        migrationBuilder.CreateIndex(
            name: "IX_RefreshTokens_TokenHash",
            table: "RefreshTokens",
            column: "TokenHash",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "ix_refresh_tokens_user_live",
            table: "RefreshTokens",
            column: "UserId",
            filter: "\"RevokedAt\" IS NULL");

        migrationBuilder.CreateIndex(
            name: "IX_OfficerPartnerAssignments_PartnerId",
            table: "OfficerPartnerAssignments",
            column: "PartnerId");

        // At most one live document per (owner, key) (R6.11).
        migrationBuilder.CreateIndex(
            name: "ux_stored_documents_owner_key_live",
            table: "StoredDocuments",
            columns: new[] { "OwnerUserId", "DocumentKey" },
            unique: true,
            filter: "\"DeletedAt\" IS NULL");

        migrationBuilder.CreateIndex(
            name: "IX_StoredDocuments_ApplicationPackId",
            table: "StoredDocuments",
            column: "ApplicationPackId");

        migrationBuilder.CreateIndex(
            name: "IX_AuditEvents_OccurredAt",
            table: "AuditEvents",
            column: "OccurredAt",
            descending: new[] { true });

        // Functional index backing the case-insensitive identifier lookup of R1.2.
        // EF Core 8 cannot express an expression index in the model, so it is raw SQL —
        // which is also why it does not appear in the model snapshot.
        migrationBuilder.Sql("""
            CREATE INDEX ix_schemes_id_lower ON "Schemes" (lower("Id"));
            """);

        migrationBuilder.Sql("""
            CREATE INDEX ix_channel_partners_id_lower ON "ChannelPartners" (lower("Id"));
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("""DROP INDEX IF EXISTS ix_channel_partners_id_lower;""");
        migrationBuilder.Sql("""DROP INDEX IF EXISTS ix_schemes_id_lower;""");

        migrationBuilder.DropTable(name: "AuditEvents");
        migrationBuilder.DropTable(name: "StoredDocuments");
        migrationBuilder.DropTable(name: "OfficerPartnerAssignments");
        migrationBuilder.DropTable(name: "RefreshTokens");
        migrationBuilder.DropTable(name: "ScoringWeights");
        migrationBuilder.DropTable(name: "SchemeRules");
        migrationBuilder.DropTable(name: "ApplicationPacks");
        migrationBuilder.DropTable(name: "ChannelPartners");
        migrationBuilder.DropTable(name: "Schemes");
        migrationBuilder.DropTable(name: "AspNetUserTokens");
        migrationBuilder.DropTable(name: "AspNetUserRoles");
        migrationBuilder.DropTable(name: "AspNetUserLogins");
        migrationBuilder.DropTable(name: "AspNetUserClaims");
        migrationBuilder.DropTable(name: "AspNetRoleClaims");
        migrationBuilder.DropTable(name: "AspNetUsers");
        migrationBuilder.DropTable(name: "AspNetRoles");
    }
}
