# Local Build and Migration Workflow

Everything in this document runs on **your machine**. The sandbox that wrote the
production-hardening code has no .NET SDK, no NuGet access, no PostgreSQL and no `npm`
install: it **compiled nothing and ran no migration**. Command groups 1–6 below all require
your machine — none of them has ever been executed. The EF migration in
`SchemeReady/backend/Migrations/` was hand-authored and is unverified until you run
group 2b.

## Prerequisites

| Component | Version | Notes |
|---|---|---|
| .NET SDK | **8** (8.0.x) | Matches `<TargetFramework>net8.0</TargetFramework>` in `SchemeReady.Api.csproj`. |
| PostgreSQL | **16** | The version the migration targets. Npgsql 8.0.11 supports server versions 12–17, so 16 is well inside range. |
| Node.js | 20 LTS or newer | For the Vite frontend. |
| EF Core CLI | 8.0.11 | Install with the command below. |

Install the EF Core command-line tool once, globally:

```bash
dotnet tool install --global dotnet-ef --version 8.0.11
```

*Working directory:* anywhere. *Success signal:* `dotnet ef --version` prints `8.0.11`.

Create the database once — database creation is **not** a migration step:

```bash
createdb schemeready
```

*Working directory:* anywhere. *Success signal:* the command exits silently, and
`psql -l` lists `schemeready`.

## NuGet packages

These four `PackageReference` entries were added by hand to
`SchemeReady/backend/SchemeReady.Api.csproj` and have never been restored. All are on the
`8.0.x` line, compatible with the `net8.0` target framework already declared in that file.

| Package | Version | Purpose |
|---|---|---|
| `Npgsql.EntityFrameworkCore.PostgreSQL` | 8.0.11 | EF Core provider for PostgreSQL — supports server versions 12 through 17. |
| `Microsoft.EntityFrameworkCore.Design` | 8.0.11 | Design-time services `dotnet ef` needs. Marked `PrivateAssets="all"`. |
| `Microsoft.AspNetCore.Identity.EntityFrameworkCore` | 8.0.11 | ASP.NET Core Identity with EF Core stores (Phase C). |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | 8.0.11 | JWT bearer authentication (Phase C). |

## npm packages

Phase A adds no npm dependency: the illustrative badge is a plain component and the locale
loader of Requirement 8 is Phase F. When Phase F lands, the locale bundles are static JSON
under `SchemeReady/frontend/public/locales/` fetched with the platform `fetch`, so the only
additions are dev-time:

| Package | Version | Purpose |
|---|---|---|
| `vitest` | ^2.1.0 | Test runner for the locale parity and resolver tests. |
| `fast-check` | ^3.22.0 | Property-based testing (design Testing Strategy). |
| `msw` | ^2.6.0 | `fetch` stubbing for the loader tests. |

Install them from `SchemeReady/frontend`:

```bash
npm install
```

*Working directory:* `SchemeReady/frontend`. *Success signal:* `node_modules/` exists and
`npm ls --depth=0` lists every dependency without an `UNMET DEPENDENCY` line.

## Environment variables

The Configuration_Loader reads these six. Every example below is a **non-functional
placeholder** — not a working credential, key or host. Substitute real values from your
secret store; never commit them. `appsettings.json` holds placeholders only.

| Variable | Placeholder example |
|---|---|
| `SCHEMEREADY_DB_CONNECTION` | `Host=localhost;Port=5432;Database=schemeready;Username=REPLACE_ME;Password=REPLACE_ME` |
| `SCHEMEREADY_JWT_SIGNING_KEY` | `REPLACE_ME_WITH_A_32_BYTE_MINIMUM_RANDOM_SECRET` |
| `SCHEMEREADY_JWT_ISSUER` | `https://replace-me.invalid/schemeready` |
| `SCHEMEREADY_JWT_AUDIENCE` | `https://replace-me.invalid/schemeready-api` |
| `SCHEMEREADY_CORS_ORIGINS` | `http://localhost:5173` |
| `SCHEMEREADY_DOCUMENT_ROOT` | `/replace/me/schemeready-documents` |

Export them before any command that touches the database or starts the API:

```bash
export SCHEMEREADY_DB_CONNECTION='Host=localhost;Port=5432;Database=schemeready;Username=REPLACE_ME;Password=REPLACE_ME'
export SCHEMEREADY_JWT_SIGNING_KEY='REPLACE_ME_WITH_A_32_BYTE_MINIMUM_RANDOM_SECRET'
export SCHEMEREADY_JWT_ISSUER='https://replace-me.invalid/schemeready'
export SCHEMEREADY_JWT_AUDIENCE='https://replace-me.invalid/schemeready-api'
export SCHEMEREADY_CORS_ORIGINS='http://localhost:5173'
export SCHEMEREADY_DOCUMENT_ROOT='/replace/me/schemeready-documents'
```

`SCHEMEREADY_JWT_*`, `SCHEMEREADY_CORS_ORIGINS` and `SCHEMEREADY_DOCUMENT_ROOT` are read
from Phase C and Phase D onward; Phase A needs only `SCHEMEREADY_DB_CONNECTION`.

---

## The six command groups, in execution order

Every group below **requires your machine**.

### 1. Restore dependencies

```bash
dotnet restore
```

*Working directory:* `SchemeReady/backend`
*Success signal:* `Restored .../SchemeReady.Api.csproj` and exit code 0, with no `NU1101`
(package not found) or `NU1102` (version not found) error. If a version is unavailable,
`dotnet list package --outdated` shows what the feed does have on the 8.0.x line.

Follow with a compile before touching the database — this is the first time the Phase A
code is compiled at all:

```bash
dotnet build
```

*Working directory:* `SchemeReady/backend`
*Success signal:* `Build succeeded.` with `0 Error(s)`.

### 2. Create the EF migration

The repository already contains a hand-authored `InitialPostgres` migration. Verify it
before creating anything new.

**2a — verify the hand-authored migration matches the model:**

```bash
dotnet ef migrations has-pending-model-changes
```

*Working directory:* `SchemeReady/backend`
*Success signal:* `No changes have been made to the model since the last migration.` That
sentence is the whole verification: it confirms the hand-written
`SchemeReadyDbContextModelSnapshot.cs` agrees with `SchemeReadyDbContext`.

**2b — if 2a reports pending changes, regenerate.** `SchemeReadyDbContext` is the source of
truth, not the transcription:

```bash
rm -rf Migrations
dotnet ef migrations add InitialPostgres
```

*Working directory:* `SchemeReady/backend`
*Success signal:* `Done. To undo this action, use 'ef migrations remove'`, and a new
`Migrations/` folder containing three files.

**2c — inspect the SQL before applying it:**

```bash
dotnet ef migrations script --output /tmp/initial-postgres.sql
grep -nE 'jsonb|numeric\(5,2\)|GENERATED BY DEFAULT AS IDENTITY' /tmp/initial-postgres.sql
grep -niE '\bGO\b|^USE |sys\.databases' /tmp/initial-postgres.sql
```

*Working directory:* `SchemeReady/backend`
*Success signal:* the first `grep` matches (jsonb collection columns, the `numeric(5,2)`
interest rate, the identity audit key); the second `grep` matches **nothing** and exits 1,
confirming no MS SQL batch separators, database-switch statements or system-catalogue
lookups survive from the deleted `Data/schema.sql`.

### 3. Apply the migration

```bash
dotnet ef database update
```

*Working directory:* `SchemeReady/backend`
*Success signal:* `Applying migration '20260101000000_InitialPostgres'` followed by `Done.`
Confirm the tables with `psql schemeready -c '\dt'`, which should list `Schemes`,
`ChannelPartners`, `ApplicationPacks`, `SchemeRules`, `ScoringWeights`, `RefreshTokens`,
`OfficerPartnerAssignments`, `StoredDocuments`, `AuditEvents` and the seven `AspNet*`
identity tables.

Two migrations exist as of Phase B, so expect two `Applying migration` lines:
`20260101000000_InitialPostgres` and `20260102000000_BackfillMsyGenderRestriction`.

#### 3a. Verify the MSY gender-restriction backfill (Phase B)

`20260102000000_BackfillMsyGenderRestriction` is a **data-only** migration and the reason
Phase B is safe to deploy against an existing database.

Phase B deleted the applicant-name gate in `SchemeMatchingService`
(`profile.FullName.Contains("Ravi")`) that was the only enforcement of Mahila Samriddhi
Yojana's women-only rule, and moved that rule onto the row as `Scheme.GenderRestriction`.
`SeedData` sets `"Female"` for `NSFDC-MSY-03`, which covers every fresh database — but the
seeder inserts only when a primary key is absent and never issues an `UPDATE`, so a
database seeded before Phase B would keep `"Any"` and **the women-only restriction would
silently disappear**. The migration backfills exactly that row, once, and is recorded in
`__EFMigrationsHistory` so it never re-applies over a later admin decision.

```bash
psql schemeready -c 'SELECT "Id", "GenderRestriction" FROM "Schemes" ORDER BY "Id";'
```

*Working directory:* anywhere
*Success signal:* `NSFDC-MSY-03` reads `Female`; the other five schemes read `Any`. If
MSY-03 still reads `Any`, the migration did not run — check
`SELECT * FROM "__EFMigrationsHistory";` for the `20260102000000` row.

This migration is hand-authored **without** a Designer/`BuildTargetModel` companion,
because it changes no schema and therefore contributes nothing to the model snapshot.
`dotnet ef database update` and `Database.Migrate()` need only the `[Migration]` attribute
and `Up`, both of which are present. If any `dotnet ef` command objects to the missing
target model, delete the file and regenerate the pair with:

```bash
dotnet ef migrations add BackfillMsyGenderRestriction
```

then paste the two guarded `UPDATE` statements from the deleted file into the generated
`Up` and `Down`.

### 4. Revert the most recently applied migration

```bash
dotnet ef database update 0
```

*Working directory:* `SchemeReady/backend`
*Success signal:* `Reverting migration '20260101000000_InitialPostgres'` then `Done.`, and
`psql schemeready -c '\dt'` reports only `__EFMigrationsHistory` (or `Did not find any
relations`).

With more than one migration applied, name the migration to roll back **to** instead —
`dotnet ef database update <PreviousMigrationName>`. Re-apply with group 3 before
continuing.

### 5. Run the seeder

```bash
dotnet run -- --seed-only
```

*Working directory:* `SchemeReady/backend`
*Success signal:* the log line
`Seeder: inserted 6 scheme row(s) and 6 channel partner row(s).` and the process exits
without binding a listener.

Run it a second time to confirm idempotence. *Success signal:*
`Seeder: database already seeded; no rows inserted, no rows modified.` Row counts stay at
six and six:

```bash
psql schemeready -c 'SELECT count(*) FROM "Schemes"; SELECT count(*) FROM "ChannelPartners";'
```

The seeder inserts only when a primary key is absent and never issues an `UPDATE`, so an
edit you make to a seeded row — a corrected `IncomeLimit`, or an `IsIllustrative` cleared
with a verification reference — survives every subsequent start.

### 6. Start the API

```bash
dotnet run
```

*Working directory:* `SchemeReady/backend`
*Success signal:* `Now listening on: http://localhost:5xxx` and
`Application started. Press Ctrl+C to shut down.` Open `/swagger` and call
`GET /api/schemes`: it returns six schemes, each carrying `"isIllustrative": true` and the
`dataProvenance` notice.

Startup applies pending migrations and runs the seeder itself, so groups 3 and 5 are only
needed when you want those steps in isolation.

Serve the frontend separately:

```bash
npm run dev
```

*Working directory:* `SchemeReady/frontend`
*Success signal:* `VITE ready in ... ms` with a `Local: http://localhost:5173/` URL, and the
scheme results view renders an `Illustrative data — not verified` badge beside every scheme
name, interest rate, source citation and last-verified date.

---

## What the sandbox could not do

| Step | Where it runs | Why not in the sandbox |
|---|---|---|
| `dotnet restore` / `dotnet build` | your machine | No .NET SDK; NuGet is unreachable. |
| `dotnet ef migrations *` | your machine | Needs the SDK, the design-time package and a reachable database. |
| `dotnet ef database update` | your machine | No PostgreSQL server. |
| `dotnet run` (including `--seed-only`) | your machine | No SDK. |
| `npm install` / `npm run dev` | your machine | No npm registry access. |
| Property and integration tests | your machine | Need the SDK plus Docker for Testcontainers. |

Consequences to keep in mind while reviewing Phase A:

- **No Phase A C# file has been compiled.** Expect to fix the odd `using` or nullable
  warning on the first `dotnet build`.
- **The migrations and the snapshot are hand-authored transcriptions.** Group 2a is the
  authoritative check; group 2b is the remedy. The Phase B data-only migration
  `20260102000000_BackfillMsyGenderRestriction` intentionally has no Designer companion —
  see group 3a.
- **`tests/baseline/MatchingBaseline.json` is hand-derived and is not yet a trustworthy
  oracle.** Its scores, flags, ordering and reason strings were traced by reading the
  scoring code, not recorded from a running process. Regenerate it before relying on it:

  ```bash
  dotnet run --project tests/baseline/BaselineRecorder
  ```

  *Working directory:* repository root
  *Success signal:* `Baseline written: 7 profile(s), 42 result(s)` and a `git diff` on
  `tests/baseline/MatchingBaseline.json` that changes **only** `recordedAt`,
  `handDerived` (true → false) and the `estimatedEmi` values (null → numbers). Any change
  to a score, flag, ordering or reason string is a hand-derivation error — commit the
  regenerated file and re-read Phase B before trusting `BaselineEqualityTests` as the
  Phase E merge gate.
- Two raw-SQL functional indexes (`ix_schemes_id_lower`, `ix_channel_partners_id_lower`)
  back the case-insensitive identifier lookups. Because EF Core 8 cannot express an
  expression index in the model, they live in `migrationBuilder.Sql` and deliberately do
  **not** appear in the model snapshot — group 2a will not complain about their absence.

This document is extended in each later phase as new commands, packages and environment
variables arrive.
