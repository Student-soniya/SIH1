# Requirements Document

## Introduction

SchemeReady (Udyam Saarthi AI) currently runs as a demonstration build: the ASP.NET Core 8 API in `SchemeReady/backend/` stores everything in static in-memory `List<>` collections (`Data/SchemeRepository.cs`), every endpoint is anonymous, CORS accepts any origin, document upload is simulated in the React UI, eligibility thresholds and scoring weights are hard-coded in `Services/Services.cs`, and localization is a hand-maintained JS object covering three languages.

This feature hardens the application for production across five prioritized areas, plus audit logging, rate limiting, and secret/encryption posture as supporting concerns.

Scope is deliberately kept tight for fast implementation. Requirements are grouped so each one maps to a single focused change set that can be built, reviewed, and merged independently, in the order given below. Each phase leaves the application working.

Two constraints shape the whole effort:

**The explainability engine is preserved, not replaced.** The deterministic weighted scoring in `SchemeMatchingService` and its tailored human-readable reason strings survive intact. Only the *source* of thresholds and weights moves to the database. A generic reflection-based rule engine is not an acceptable substitute.

**The seeded scheme data is not trustworthy.** Seed records cite specific NSFDC clause numbers, interest rates, and a `LastVerifiedDate` of 2026-09-10 that nobody has checked against official guidelines. Until verified, that data must be visibly labelled as illustrative.

**Verification note:** The sandbox has no .NET SDK and no NuGet access, so compilation and `dotnet ef` migrations run on the developer's machine. Every criterion below is verifiable either by code and schema inspection or by a test the developer runs locally.

## Glossary

**SchemeReady_API**: The ASP.NET Core 8 Web API at `SchemeReady/backend/SchemeReady.Api.csproj`.

**Frontend_App**: The React 19 + Vite application at `SchemeReady/frontend/`.

**Scheme_Repository**: The implementation of the existing `ISchemeRepository` interface in `Data/SchemeRepository.cs`.

**Persistence_Layer**: The EF Core `DbContext`, entity configurations, and Npgsql provider registration backing the Scheme_Repository.

**Scheme**: The existing entity in `Models/Models.cs` with a string `Id` (for example `"NSFDC-MCS-01"`), a single decimal `InterestRate`, and `List<string>` collection properties.

**ChannelPartner**: The existing entity in `Models/Models.cs` representing an SCA, PSB, RRB, or NBFC-MFI.

**BeneficiaryProfile**: The existing profile type in `Models/Models.cs` submitted to matching, readiness, and application-pack endpoints.

**ApplicationPack**: The existing dossier aggregate in `Models/Models.cs`.

**Scheme_Matching_Service**: The existing `SchemeMatchingService` in `Services/Services.cs`.

**Match_Explanation**: The `PositiveReasons`, `NegativeReasons`, and `MissingDocuments` collections on a `SchemeMatchResult`.

**Scoring_Weight**: A named numeric contribution to a match score (eligibility, project-cost fit, document readiness, partner availability, business-type preference).

**Rule_Store**: The database-resident representation of scheme thresholds and Scoring_Weight values.

**EF_Migration**: An EF Core migration class plus its generated PostgreSQL SQL.

**Seeder**: The component inserting baseline Scheme and ChannelPartner rows.

**Illustrative_Flag**: A boolean on Scheme and ChannelPartner marking the record's regulatory details as unverified sample content.

**Auth_Service**: The SchemeReady_API component handling signup, login, logout, and token refresh.

**Access_Token**: A signed JWT presented as a bearer credential.

**Refresh_Token**: An opaque, single-use, persisted credential exchanged for a new token pair.

**Beneficiary_Role**, **Officer_Role**, **Admin_Role**: The three authorization roles.

**Document_Service**: The SchemeReady_API component accepting, validating, storing, and serving beneficiary documents.

**Stored_Document**: A persisted uploaded file plus its metadata row.

**Magic_Byte_Check**: Validation of a file's leading bytes against the signature expected for its declared type.

**Locale_Bundle**: A JSON file at `SchemeReady/frontend/public/locales/{lang}.json` holding one language's UI strings.

**Locale_Loader**: The Frontend_App component that fetches, caches, and resolves keys from Locale_Bundle files.

**Audit_Event**: A persisted record of timestamp, actor identifier, action type, entity type, entity identifier, source IP address, and outcome.

**Configuration_Loader**: The mechanism supplying connection strings, signing keys, and allowed origins to the SchemeReady_API.

## Requirements

### Requirement 1: PostgreSQL Persistence Behind the Existing Repository Seam

**User Story:** As a platform operator, I want data stored in PostgreSQL, so that restarting the service does not destroy applications entrepreneurs have already prepared.

#### Acceptance Criteria

1. THE Scheme_Repository SHALL implement the existing `ISchemeRepository` member set — `GetAllSchemesAsync`, `GetSchemeByIdAsync`, `AddOrUpdateSchemeAsync`, `GetAllPartnersAsync`, `GetPartnerByIdAsync`, `AddOrUpdatePartnerAsync`, `GetAllApplicationsAsync`, `SaveApplicationAsync`, and `GetAdminStatsAsync` — with the signatures those members already declare, adding no member to and removing no member from the interface.
2. THE Scheme_Repository SHALL read and write Scheme, ChannelPartner, and ApplicationPack records through EF Core using the Npgsql provider, SHALL resolve the identifier argument of `GetSchemeByIdAsync` and `GetPartnerByIdAsync` case-insensitively as the current in-memory implementation does, and SHALL return null rather than throwing when the identifier is empty, whitespace-only, or matches no stored row.
3. WHEN the SchemeReady_API process restarts, THE Scheme_Repository SHALL return every Scheme, ChannelPartner, and ApplicationPack record written before the restart, with every mapped property equal to its pre-restart value.
4. THE SchemeReady_API SHALL keep the route template, HTTP verb, request body schema, and success response body schema of every endpoint existing before this feature, adding the Requirement 2 provenance fields as additional response properties rather than replacements, and SHALL introduce no new required request-body property.
5. THE Persistence_Layer SHALL map `Scheme.Id` to a unique `text` primary key accepting the existing identifier format (1 to 64 characters), and SHALL map `Scheme.InterestRate` to a single `numeric(5,2)` column holding values from 0.00 through 99.99 inclusive.
6. THE EF_Migration SHALL create the tables for Scheme, ChannelPartner, ApplicationPack, identity, Refresh_Token, Stored_Document, Rule_Store, and Audit_Event data.
7. THE EF_Migration SHALL declare PostgreSQL types, mapping the `NVARCHAR(MAX)` columns of the existing `Data/schema.sql` to `text` for prose and `jsonb` for serialized `List<string>` and dossier payloads, and SHALL declare the Audit_Event key as `GENERATED BY DEFAULT AS IDENTITY` in place of `IDENTITY(1,1)`.
8. THE EF_Migration SHALL express every statement in PostgreSQL syntax without `GO` batch separators, `USE <database>` statements, or `sys.databases` lookups.
9. THE repository SHALL remove `SchemeReady/backend/Data/schema.sql`, whose MS SQL Server DDL the EF_Migration supersedes.
10. WHERE a `List<string>` property maps to `jsonb`, THE Persistence_Layer SHALL configure a value comparer so that change tracking detects element additions, removals, and reorderings, and so that saving after any of those three changes persists the modified collection.
11. THE `appsettings.json` `DefaultConnection` string SHALL use Npgsql keywords (`Host`, `Port`, `Database`, `Username`, `Password`) in place of the SQL Server keywords present today.
12. WHEN the Seeder runs against a database containing zero Scheme rows and zero ChannelPartner rows, THE Seeder SHALL insert exactly the six baseline Scheme rows currently defined in `SeedSchemes` (identifiers `NSFDC-MCS-01`, `NSFDC-TLS-02`, `NSFDC-MSY-03`, `NSFDC-LUY-04`, `NSFDC-GBS-05`, `NSFDC-SLS-06`) and exactly the six baseline ChannelPartner rows currently defined in `SeedPartners`.
13. WHEN the Seeder runs a second or subsequent time against an already-seeded database, THE Seeder SHALL match existing rows by primary key and SHALL leave the Scheme row count at six and the ChannelPartner row count at six, inserting no duplicate primary key.
14. WHILE a seeded Scheme or ChannelPartner row holds any mapped property value differing from the Seeder's baseline value for that row, THE Seeder SHALL leave every mapped property of that row unchanged on subsequent runs.
15. FOR ALL Scheme, ChannelPartner, and ApplicationPack instances — covering at minimum the six seeded Scheme rows, the six seeded ChannelPartner rows, and one ApplicationPack carrying a populated BeneficiaryProfile — writing an instance and reading the same identifier back SHALL produce an instance whose every mapped property equals the written value, including the element order and element contents of every `List<string>` property (round-trip property).
16. IF the PostgreSQL connection attempt fails or does not complete within 30 seconds, THEN THE SchemeReady_API SHALL respond with HTTP status 503, SHALL NOT return a success response body, and SHALL record exactly one Audit_Event describing the failed attempt.
17. IF a write through `AddOrUpdateSchemeAsync`, `AddOrUpdatePartnerAsync`, or `SaveApplicationAsync` fails before completing, THEN THE Scheme_Repository SHALL leave every stored record as it was immediately before the call, applying no partial column or collection update, and SHALL surface an error to the caller indicating that persistence failed.

### Requirement 2: Illustrative Labelling of Unverified Scheme Data

**User Story:** As a beneficiary relying on this platform for a loan decision, I want unverified sample data clearly marked, so that I never mistake an invented clause number or interest rate for official guidance.

#### Acceptance Criteria

1. THE Scheme entity and the ChannelPartner entity SHALL each carry a non-nullable Illustrative_Flag property that defaults to true, and every row inserted by the Seeder SHALL carry the value true.
2. WHERE a Scheme row carries an Illustrative_Flag value of true, THE SchemeReady_API SHALL include, in every response body that carries that row's scheme fields (match results, readiness results, application pack, partner routing, and admin scheme listings), both the Illustrative_Flag value and a `dataProvenance` property stating that the interest rate, the cited source document, and the last-verified date are illustrative sample values pending verification against current official NSFDC guidelines.
3. IF a Scheme record received by the Frontend_App carries an Illustrative_Flag value of true or omits the Illustrative_Flag property, THEN THE Frontend_App SHALL render a badge with the text "Illustrative data — not verified" within the same displayed field group as each of that record's scheme name, interest rate, source document citation, and last-verified date, on every view where those values appear.
4. IF a ChannelPartner record received by the Frontend_App carries an Illustrative_Flag value of true or omits the Illustrative_Flag property, THEN THE Frontend_App SHALL render that same badge within the same displayed field group as each of that record's institution name, contact number, and address.
5. WHEN an actor holding the Admin_Role submits a Scheme row or ChannelPartner row with the Illustrative_Flag set to false together with a non-empty verification source reference of 1 to 300 characters and a verification date that is not later than the current date, THE SchemeReady_API SHALL persist the false value, the verification source reference, and the verification date, and SHALL omit the `dataProvenance` property from later responses for that row.
6. IF a request to set an Illustrative_Flag to false omits the verification source reference, supplies a reference outside 1 to 300 characters, omits the verification date, supplies a verification date later than the current date, or is submitted by an actor not holding the Admin_Role, THEN THE SchemeReady_API SHALL reject the request, SHALL retain the stored Illustrative_Flag value of true unchanged, and SHALL return an error response indicating which validation condition failed.
7. WHEN an Illustrative_Flag change is accepted or rejected, THE SchemeReady_API SHALL record one Audit_Event capturing timestamp, actor identifier, action type, entity type, entity identifier, source IP address, outcome, and the supplied verification source reference.
8. WHEN THE Frontend_App renders an ApplicationPack containing at least one Scheme record whose Illustrative_Flag is true or absent, THE Frontend_App SHALL display the existing ApplicationPack disclaimer together with a statement that the scheme financial terms shown require confirmation with the channel partner before submission.
9. THE client-side fallback Scheme and ChannelPartner objects in `SchemeReady/frontend/src/api.js` SHALL each carry an Illustrative_Flag value of true and a `dataProvenance` value equivalent to the one the SchemeReady_API serves for an illustrative row, so that badge rendering is identical whether data originated from the SchemeReady_API or from the fallback.

### Requirement 3: Preservation of the Explainable Matching Engine

**User Story:** As a product owner, I want the existing weighted scoring logic and its wording preserved, so that the platform's transparency advantage survives the hardening work.

#### Acceptance Criteria

1. THE Scheme_Matching_Service SHALL compute each MatchScore as the sum of exactly five separately computed components — eligibility (maximum 40: 20 for target-category match plus 20 for family income at or below the scheme income limit), project-cost fit (25 when the estimated project cost is within the scheme minimum-to-maximum range inclusive, 8 when below the minimum, 5 when above the maximum), document readiness (maximum 15: 8 for the caste certificate plus 7 for the income certificate), partner availability (10 when at least one ChannelPartner in the applicant district supports the Scheme, otherwise 4), and business-type preference (10 when the applicant business type matches an eligible business type of the Scheme, otherwise 4) — each component being individually named and separately assertable in code rather than produced by a generic rule interpreter over unnamed attributes.
2. FOR EVERY evaluated Scheme, THE Scheme_Matching_Service SHALL return a Match_Explanation containing at least one string across PositiveReasons and NegativeReasons, SHALL emit at least one positive reason for every component awarded its maximum value, SHALL emit at least one negative reason for every component awarded less than its maximum value, and SHALL list in MissingDocuments one entry for each mandatory certificate the BeneficiaryProfile does not declare.
3. THE Scheme_Matching_Service SHALL retain every positive and negative reason string template currently emitted in `Services/Services.cs` character-for-character apart from interpolated values, preserving the interpolated rupee amounts with thousands separators and no decimal places, the named partner institution with its distance in kilometres, the applicant district, and the quoted business type.
4. THE Scheme_Matching_Service SHALL clamp each summed MatchScore to the inclusive range 10 through 98, SHALL then set IsRecommended to true if and only if the clamped MatchScore is greater than or equal to 75, and SHALL return results sorted by clamped MatchScore descending with ties broken by Scheme identifier in ascending ordinal order.
5. WHERE the Scheme declares a gender restriction, IF the gender value on the BeneficiaryProfile does not satisfy that restriction or is empty, THEN THE Scheme_Matching_Service SHALL reduce the eligibility component by 15 points with a floor of 0 and SHALL add a negative reason indicating the Scheme is reserved for the restricted gender; THE Scheme_Matching_Service SHALL NOT reference the applicant name in any eligibility, scoring, or reason-generation decision, and SHALL apply no gender adjustment when the Scheme declares no gender restriction.
6. FOR ALL BeneficiaryProfile inputs, given unchanged Rule_Store contents, THE Scheme_Matching_Service SHALL return identical MatchScore values, identical IsRecommended values, identical result ordering, and identical Match_Explanation string contents and ordering across at least three consecutive invocations within one process.
7. GIVEN Rule_Store contents equal to the threshold and Scoring_Weight values currently hard-coded in `Services/Services.cs`, THE Scheme_Matching_Service SHALL reproduce, with exact equality and no numeric tolerance, the MatchScore, IsRecommended, result ordering, and the exact strings and string order of PositiveReasons, NegativeReasons, and MissingDocuments recorded from the current implementation for a checked-in baseline of at least five BeneficiaryProfile inputs covering: all components at maximum, income above the scheme limit, project cost below the minimum, project cost above the maximum, no supporting ChannelPartner in the district, unmatched business type, and a gender-restricted Scheme.
8. IF a threshold or Scoring_Weight value required to score a Scheme is absent from the Rule_Store or falls outside its defined bounds, THEN THE Scheme_Matching_Service SHALL reject the matching request with an error indicating which Scheme and which value is invalid, SHALL NOT substitute a default value, and SHALL return no partial results.

### Requirement 4: Authentication, Authorization, and Restricted Origins

**User Story:** As a platform operator, I want authenticated accounts with role-scoped endpoints and locked-down CORS, so that beneficiary dossiers and administrative controls reach only entitled parties.

#### Acceptance Criteria

1. THE SchemeReady_API SHALL store accounts using ASP.NET Core Identity, SHALL store each password only as a hash produced by the Identity password hasher, and SHALL include no password or password hash in any response body.
2. WHEN a visitor submits a signup request with an email address of 5 to 254 characters containing exactly one `@` and at least one character on each side of it, a password of 12 to 128 characters containing at least one letter and at least one digit, and a display name of 1 to 100 characters, THE Auth_Service SHALL create the account, assign the Beneficiary_Role, and respond with HTTP status 201.
3. IF a signup request supplies an email address already present under case-insensitive comparison, THEN THE Auth_Service SHALL create no account, respond with HTTP status 409, and return a message that omits any indication of the existing account's password state, role, or lockout state.
4. IF a signup request supplies an email address, password, or display name violating any bound stated in criterion 2, THEN THE Auth_Service SHALL create no account, respond with HTTP status 400, and return a message naming each unmet rule.
5. WHEN a login request supplies an email address and password matching a stored account that is not currently locked, THE Auth_Service SHALL respond with HTTP status 200, exactly one Access_Token, and exactly one Refresh_Token, and SHALL reset that email address's failed-attempt counter to zero.
6. IF a login request supplies an unknown email address or a password failing hash verification, THEN THE Auth_Service SHALL increment that email address's failed-attempt counter, issue no tokens, and respond with HTTP status 401 and a message byte-identical for both cases.
7. WHEN the fifth failed login attempt for one email address occurs within a 15-minute window, THE Auth_Service SHALL lock that account for 15 minutes from that attempt and SHALL respond with HTTP status 423 to every login request for that address during the lockout, including requests presenting the correct password.
8. THE Auth_Service SHALL issue each Access_Token as a JWT signed with HMAC-SHA256 using a signing key supplied by the Configuration_Loader, with a lifetime of 15 minutes from issue, carrying the user identifier, display name, and assigned roles as claims.
9. THE Auth_Service SHALL store each Refresh_Token only as a hash, with a lifetime of 7 days from issue, alongside its user identifier, issue timestamp, expiry timestamp, and revocation state, and SHALL return the plaintext Refresh_Token to the client exactly once, at issue time.
10. WHEN a client presents an unexpired, unrevoked Refresh_Token to the refresh endpoint, THE Auth_Service SHALL mark the presented Refresh_Token as revoked before the response is returned, and SHALL respond with HTTP status 200, exactly one new Access_Token, and exactly one new Refresh_Token, so that a second presentation of the same Refresh_Token can never yield a token pair.
11. IF a client presents a Refresh_Token whose stored revocation state is revoked, THEN THE Auth_Service SHALL issue no tokens, revoke every Refresh_Token belonging to that user, respond with HTTP status 401, and record exactly one Audit_Event classifying the event as suspected token replay.
12. IF a client presents a Refresh_Token that is expired or matches no stored Refresh_Token hash, THEN THE Auth_Service SHALL issue no tokens and respond with HTTP status 401.
13. WHEN a client calls the logout endpoint with a valid Access_Token, THE Auth_Service SHALL revoke every Refresh_Token belonging to that user and respond with HTTP status 204.
14. THE SchemeReady_API SHALL require the Admin_Role for `POST /api/admin/schemes`, `POST /api/admin/partners`, `POST /api/admin/verify-partner/{id}`, and `GET /api/admin/stats`.
15. THE SchemeReady_API SHALL require the Beneficiary_Role, Officer_Role, or Admin_Role for `POST /api/application-pack/generate`, `GET /api/application-pack/{id}`, `POST /api/application-pack/handoff/{id}`, `POST /api/readiness/calculate`, and every document endpoint.
16. THE SchemeReady_API SHALL permit anonymous access to `GET /api/schemes`, `GET /api/schemes/{id}`, `GET /api/partners`, `GET /api/partners/route`, `POST /api/schemes/match`, `POST /api/emi/calculate`, `POST /api/business-plan/generate`, and `POST /api/onboarding/extract`.
17. THE SchemeReady_API SHALL associate every saved ApplicationPack with the authenticated user identifier of the requester that generated the ApplicationPack.
18. WHEN a requester holding the Officer_Role requests an ApplicationPack whose assigned ChannelPartner matches the requester's partner association, THE SchemeReady_API SHALL respond with HTTP status 200 and the dossier.
19. IF a requester holding the Beneficiary_Role requests an ApplicationPack associated with a different user identifier, or a requester holding the Officer_Role requests an ApplicationPack whose assigned ChannelPartner does not match the requester's partner association, THEN THE SchemeReady_API SHALL respond with HTTP status 404 and a body containing no dossier field values.
20. IF a request to an endpoint listed in criterion 14 or 15 arrives without an Access_Token, or with an Access_Token failing validation of issuer, audience, signature, or expiry against a clock-skew allowance of at most 60 seconds, THEN THE SchemeReady_API SHALL respond with HTTP status 401 and SHALL perform no part of the requested operation.
21. IF a request presents a valid Access_Token lacking the role required by criterion 14 or 15, THEN THE SchemeReady_API SHALL respond with HTTP status 403, leave all stored data unchanged, and record exactly one Audit_Event.
22. THE SchemeReady_API SHALL replace the current `AllowAnyOrigin` CORS policy with a policy permitting only the origins the Configuration_Loader supplies, permitting the `Authorization` header and credentialed requests, and restricting methods to GET, POST, PUT, DELETE, and OPTIONS.
23. IF a preflight request arrives from an origin absent from the configured origin list, THEN THE SchemeReady_API SHALL respond without the `Access-Control-Allow-Origin` header and SHALL perform no part of the requested operation.
24. IF the configured origin list is absent or empty at startup, THEN THE SchemeReady_API SHALL fail startup, log the missing configuration key name, and accept no requests.

### Requirement 5: Frontend Authentication Experience

**User Story:** As a beneficiary using the web application, I want to sign up and sign in, so that my saved progress is protected and restored.

#### Acceptance Criteria

1. THE Frontend_App SHALL present a signup form collecting an email address (maximum 254 characters), a password (8 to 128 characters), a password confirmation, and a display name (1 to 60 characters), and a login form collecting an email address (maximum 254 characters) and a password.
2. IF a submitted signup field is empty, violates its stated length bound, contains an email address without exactly one `@` separating a non-empty local part and a non-empty domain part, or has a password confirmation that differs from the password, THEN THE Frontend_App SHALL display an error message identifying the failing field, SHALL NOT send the signup request, and SHALL retain every entered value except the password and confirmation fields.
3. WHEN a login attempt succeeds, THE Frontend_App SHALL retain the Access_Token only in memory for the lifetime of the loaded page and SHALL retain the Refresh_Token in browser storage that survives page reload and browser restart.
4. WHEN the Frontend_App loads and a stored Refresh_Token is present, THE Frontend_App SHALL call the refresh endpoint exactly once before rendering any view that requires an authenticated session, and SHALL restore the authenticated session using the returned token pair.
5. WHILE an Access_Token is held in memory, THE Frontend_App SHALL attach it as an `Authorization: Bearer` header on every request to a protected endpoint and SHALL omit that header on every request to an endpoint that does not require an Access_Token.
6. WHEN a request to a protected endpoint receives HTTP status 401, THE Frontend_App SHALL call the refresh endpoint at most once — sharing a single in-flight refresh call across all requests that received 401 within that window and treating a refresh call that does not complete within 10 seconds as failed — and SHALL retry each original request exactly one time with the new Access_Token, performing no second refresh and no second retry.
7. IF a login request or a refresh request receives HTTP status 401, THEN THE Frontend_App SHALL discard the in-memory Access_Token and the stored Refresh_Token, SHALL display the login form with an error message that distinguishes unrecognized credentials from an ended session, and SHALL retain the entered email address while clearing the password field.
8. WHILE no authenticated session exists, THE Frontend_App SHALL permit navigation only to the onboarding, scheme matcher, EMI simulator, and business plan views, and SHALL replace any navigation attempt to another view with the login form without issuing a request to a protected endpoint.
9. WHERE the authenticated user holds the Admin_Role, THE Frontend_App SHALL display the admin portal navigation entry and permit navigation to the admin portal view, and SHALL omit that entry and replace direct navigation to that view with the readiness dashboard in every session without the Admin_Role.
10. WHEN the user activates the logout control, THE Frontend_App SHALL call the logout endpoint, SHALL clear the in-memory Access_Token and the stored Refresh_Token regardless of the logout endpoint outcome, and SHALL display the login form.
11. THE `api.js` module SHALL return its offline fallback responses only for endpoints that require no Access_Token, and for every protected endpoint SHALL surface an error indicating that the request failed, display no fabricated field values, and leave any previously loaded data unchanged, so that a fallback response never masquerades as persisted user data.

### Requirement 6: Secure Document Upload and Retrieval

**User Story:** As a beneficiary, I want to upload my caste certificate and vendor quotation safely and privately, so that my checklist reflects real evidence and my identity documents stay confidential.

#### Acceptance Criteria

1. WHEN a request presenting a valid Access_Token carrying the Beneficiary_Role submits a multipart upload containing exactly one `IFormFile` part and a document key equal to one of the existing checklist keys `identity`, `caste_cert`, `income_cert`, or `quotation`, THE Document_Service SHALL apply the extension, content-type, Magic_Byte_Check, and length validations of criteria 3 through 5 before writing any bytes to storage.
2. IF an upload request omits the file part, supplies more than one file part, omits the document key, or supplies a document key outside the set `identity`, `caste_cert`, `income_cert`, `quotation`, THEN THE Document_Service SHALL respond with HTTP status 400 and a message naming the offending field, and SHALL create no Stored_Document row and write no bytes to storage.
3. THE Document_Service SHALL accept only files whose filename extension, compared case-insensitively, is `.pdf`, `.jpg`, `.jpeg`, or `.png` and whose declared content type, compared case-insensitively and ignoring any parameters following a `;`, is `application/pdf`, `image/jpeg`, or `image/png`.
4. THE Document_Service SHALL perform a Magic_Byte_Check verifying leading bytes `25 50 44 46` for PDF, `FF D8 FF` for JPEG, and `89 50 4E 47 0D 0A 1A 0A` for PNG, and SHALL require the matched signature to correspond to the declared content type (`application/pdf` with PDF, `image/jpeg` with JPEG, `image/png` with PNG).
5. THE Document_Service SHALL accept only files whose byte length falls in the inclusive range 1 through 5,242,880 bytes (5 MiB), rejecting a zero-byte file and a file of 5,242,881 bytes or more.
6. IF an uploaded file fails the extension check, the content type check, the Magic_Byte_Check, or the length check, THEN THE Document_Service SHALL respond with HTTP status 400 and a message naming the first failed check in that evaluation order, and SHALL retain no bytes of the rejected file and create no Stored_Document row.
7. THE Document_Service SHALL generate each stored filename as a server-side random value with at least 128 bits of entropy plus the validated extension, derived independently of any client-supplied value.
8. THE Document_Service SHALL store the client-supplied filename as Stored_Document metadata after truncating it to at most 255 characters and removing directory separator, drive-letter, and control characters, and THE Frontend_App SHALL render that stored value as literal text so that markup characters appear as characters and no client-supplied markup is interpreted.
9. THE Document_Service SHALL store uploaded bytes outside the directory tree served as static web content, such that no static-content URL resolves to a Stored_Document's bytes.
10. WHEN an upload succeeds, THE Document_Service SHALL respond with HTTP status 201, the Stored_Document identifier, the document key, and the readiness score recalculated by the existing readiness calculation with that document key counted as present.
11. WHEN an upload succeeds for a document key that already has a non-deleted Stored_Document owned by the same user identifier, THE Document_Service SHALL remove the previous Stored_Document's stored bytes and mark its metadata row as deleted, leaving at most one non-deleted Stored_Document per owner identifier and document key.
12. THE Document_Service SHALL serve every Stored_Document through a controller action that identifies the document solely by its database identifier and accepts no request parameter conveying a filename or filesystem path.
13. IF a request to any Document_Service upload, retrieval, or deletion endpoint presents no Access_Token or an Access_Token failing signature or expiry validation, THEN THE Document_Service SHALL respond with HTTP status 401 and SHALL serve, store, or delete no bytes.
14. WHEN a requester holding the Beneficiary_Role requests a non-deleted Stored_Document whose owner identifier equals the requester's user identifier, THE Document_Service SHALL respond with HTTP status 200 and the file bytes.
15. WHEN a requester holding the Officer_Role requests a non-deleted Stored_Document belonging to an ApplicationPack assigned to the requester's associated ChannelPartner, THE Document_Service SHALL respond with HTTP status 200 and the file bytes.
16. IF an authenticated request targets a Stored_Document identifier that does not exist or is marked deleted, or is a retrieval request from a requester who is neither the owner nor an Officer_Role user whose associated ChannelPartner is assigned the owning ApplicationPack, or is a deletion request from a requester who is not the owner, THEN THE Document_Service SHALL respond with HTTP status 404 with a body that discloses neither the document's existence nor its owner, and SHALL leave all stored bytes and metadata rows unchanged.
17. THE Document_Service SHALL set `Content-Disposition` to `attachment` and `X-Content-Type-Options` to `nosniff` on every document response.
18. WHEN the owner requests deletion of a non-deleted Stored_Document, THE Document_Service SHALL remove the stored bytes, mark the metadata row as deleted, and respond with HTTP status 204.
19. THE Document_Service SHALL record one Audit_Event, whose outcome field distinguishes accepted upload, rejected upload, retrieval, and deletion, for each such operation.
20. FOR ALL byte sequences of length 0 through 5,242,881 bytes submitted to the upload endpoint with a valid Beneficiary_Role Access_Token and one of the four accepted document keys, THE Document_Service SHALL respond with either HTTP status 201 plus exactly one new non-deleted Stored_Document whose stored bytes equal the submitted bytes, or HTTP status 400 plus no new Stored_Document row and no new or partial file in the storage location; no other status SHALL result, and status 201 SHALL occur exactly when the checks in criteria 3 through 5 all pass (total-input coverage property).

### Requirement 7: Database-Driven Rules and Administrative Editing

**User Story:** As a scheme administrator, I want eligibility thresholds and scoring weights held in the database and editable from the admin portal, so that correcting a rule needs no developer, rebuild, or redeployment.

#### Acceptance Criteria

1. THE Rule_Store SHALL hold, per Scheme, the minimum age in whole years (18 to 75 inclusive), the maximum age in whole years (18 to 75 inclusive, not less than the minimum age), the annual family income limit in rupees (0.01 to 99,999,999.99, two decimal places), the minimum project cost in rupees (1,000.00 to 100,000,000.00), the maximum project cost in rupees (1,000.00 to 100,000,000.00), 1 to 20 eligible business types (each 1 to 100 characters), 1 to 10 eligible applicant categories (each 1 to 100 characters), a gender restriction taking one of the values `Any`, `Female`, or `Male`, the annual interest rate as a percentage (0.00 to 36.00, two decimal places), the maximum tenure in whole months (1 to 240), and the moratorium in whole months (0 to 60, not exceeding the maximum tenure).
2. THE Rule_Store SHALL hold exactly five named Scoring_Weight rows, one for each score component named in Requirement 3, criterion 1 (eligibility, project-cost fit, document readiness, partner availability, business-type preference), each holding a whole-number value from 0 to 100 inclusive.
3. WHEN the Scheme_Matching_Service receives a matching request, THE Scheme_Matching_Service SHALL obtain every eligibility threshold and every Scoring_Weight value from the Rule_Store contents, and `Services/Services.cs` SHALL contain no numeric eligibility threshold literal and no Scoring_Weight literal.
4. THE Scheme_Matching_Service SHALL serve Rule_Store contents from a cached copy no older than 60 seconds, and WHEN an administrator saves a Scheme rule row or a Scoring_Weight value, THE SchemeReady_API SHALL invalidate that cached copy before returning the save response, so that the first matching request accepted after the save response uses the saved values.
5. IF the Scheme_Matching_Service cannot read the Rule_Store and holds no cached copy younger than 60 seconds, THEN THE SchemeReady_API SHALL reject the matching request with an error response indicating that scheme rules are temporarily unavailable, SHALL NOT substitute default or previously hard-coded threshold or Scoring_Weight values, and SHALL NOT return partial match results.
6. IF a submitted Scoring_Weight update produces a set of five values whose sum is any value other than exactly 100, THEN THE SchemeReady_API SHALL reject the update with HTTP status 400 and a message stating the computed sum, and SHALL leave every stored Scoring_Weight value unchanged.
7. IF a submitted Scheme rule row supplies a minimum project cost exceeding its maximum project cost, a minimum age exceeding its maximum age, a moratorium exceeding its maximum tenure, or any value outside the bounds stated in criterion 1, THEN THE SchemeReady_API SHALL reject the row with HTTP status 400 and a message naming the offending field and the submitted value or values, and SHALL leave the stored row unchanged.
8. IF the Rule_Store is unreachable at startup, or holds no Scoring_Weight row for one or more of the five score components, or holds Scoring_Weight values not summing to exactly 100, THEN THE SchemeReady_API SHALL fail startup and log the unreachable-store condition or the name of each missing component together with the computed sum.
9. WHEN the EF_Migration and Seeder run against a database holding no Rule_Store rows, THE Seeder SHALL insert threshold values and Scoring_Weight values equal to the literals present in `Services/Services.cs` before this change, establishing the baseline that Requirement 3, criterion 7 verifies.
10. THE Frontend_App admin portal SHALL present an editable input for every Rule_Store field named in criterion 1 and for each of the five named Scoring_Weight values, SHALL display the running sum of the entered Scoring_Weight values after each keystroke, and SHALL keep the save control disabled while that running sum differs from 100 or while any entered value lies outside the bounds stated in criterion 1.
11. WHEN an administrator requests a preview of pending rule edits, THE Frontend_App admin portal SHALL display, for one stored sample BeneficiaryProfile and without persisting the pending values, the resulting MatchScore and the complete Match_Explanation computed from those pending values alongside the same values computed from the currently stored rules.
12. WHILE no authenticated session carrying the Admin_Role is present, THE Frontend_App admin portal SHALL render no rule-editing input, no Scoring_Weight input, and no save control.
13. WHEN a Scheme rule field value or a Scoring_Weight value is saved, THE SchemeReady_API SHALL record one Audit_Event per changed field capturing the actor identifier, the Scheme identifier or Scoring_Weight name, the field name, the previous value, and the new value.

### Requirement 8: Externalized Locales and Twelve-Language Coverage

**User Story:** As an entrepreneur who reads only my regional language, I want the interface in my language and translators able to add languages without touching source code, so that I can complete an application without an interpreter.

#### Acceptance Criteria

1. WHEN the Frontend_App first renders, THE Locale_Loader SHALL fetch the Locale_Bundle file at `public/locales/{lang}.json` for the language code persisted from a previous session, or for `en` when no code is persisted, and SHALL render every UI string from that bundle.
2. THE repository SHALL contain no file `SchemeReady/frontend/src/translations.js` and no source reference importing it.
3. FOR ALL key paths present in the `en`, `hi`, and `kn` objects of the removed `translations.js`, the Locale_Bundle for that code SHALL contain the identical key path — under the same `tabs`, `onboarding`, `schemes`, `readiness`, `businessPlan`, `partners`, `emi`, or `pack` group — carrying the same string value.
4. THE Frontend_App SHALL provide exactly twelve Locale_Bundle files, one for each of the language codes `en`, `hi`, `kn`, `ta`, `te`, `ml`, `mr`, `bn`, `gu`, `pa`, `or`, and `as`, and no Locale_Bundle for any other code.
5. WHEN a language is selected or restored, THE Locale_Loader SHALL fetch only that language's Locale_Bundle, SHALL issue at most one fetch per language code per browser session, and SHALL resolve all later key lookups for that language from the cached bundle.
6. THE Frontend_App SHALL present a language selector listing all twelve supported languages, each label written in that language's own script.
7. WHEN a visitor selects a language and its Locale_Bundle is available, THE Frontend_App SHALL render every UI string from that bundle, SHALL set the `lang` attribute of the document root element to the selected code, and SHALL persist the selected code so the same language is applied on the next page load in the same browser.
8. IF a requested key path is absent from the selected Locale_Bundle but present in the English Locale_Bundle, THEN THE Locale_Loader SHALL render the English value for that key path and SHALL leave every other string resolved from the selected Locale_Bundle unchanged.
9. IF a requested key path is absent from both the selected and the English Locale_Bundle, THEN THE Locale_Loader SHALL render the key path text itself and SHALL write exactly one console warning naming that key path per key path per session.
10. IF a Locale_Bundle fetch does not complete successfully within 5 seconds or returns content that does not parse as JSON, THEN THE Frontend_App SHALL render the English Locale_Bundle, SHALL display a notice indicating that the selected language is unavailable, and SHALL leave the language selector operable for a further selection.
11. THE Frontend_App SHALL format currency amounts using the `en-IN` Indian digit grouping convention — last three digits grouped, then groups of two, so that 150000 renders as `1,50,000` — for every selected language.
12. WHEN a request supplies any of the twelve supported language codes in the `PreferredLanguage` property of a BeneficiaryProfile or the `preferredLanguage` property of a `ConversationalExtractRequest`, THE SchemeReady_API SHALL accept the request and SHALL return a `LocalizedSummary` dictionary containing one entry keyed by the supplied code and one entry keyed by `en`.
13. IF a supplied language code is absent, empty, or outside the twelve supported codes, THEN THE SchemeReady_API SHALL apply the `en` code, SHALL return the `LocalizedSummary` keyed by `en`, and SHALL report the applied code in the response without returning an error.
14. THE build process SHALL run a key-parity check that lists every key path present in the English Locale_Bundle and absent from any other Locale_Bundle, and SHALL fail the build when that list is non-empty.
15. FOR ALL Locale_Bundle files, parsing the file as JSON and re-serializing the parsed value SHALL produce a value equal to the original parsed value (round-trip property).

### Requirement 9: Audit Logging, Rate Limiting, and Secret Posture

**User Story:** As a compliance reviewer, I want an immutable action trail, request limits, and secrets kept out of source control, so that abuse is detectable and a repository leak does not expose beneficiary records.

#### Acceptance Criteria

1. THE SchemeReady_API SHALL persist each Audit_Event with a UTC timestamp accurate to at least the second, an actor identifier (the authenticated user identifier, or the literal marker for an unauthenticated caller), an action type drawn from the closed set enumerated in criterion 2, an entity type, an entity identifier (or an explicit empty marker where the action has no target entity), the source IP address taken from the request, and an outcome valued exactly `Success` or `Failure`.
2. WHEN an authentication attempt, authorization denial, document upload, document retrieval, document deletion, Scheme change, ChannelPartner change, Scoring_Weight change, Illustrative_Flag change, or ApplicationPack handoff completes, THE SchemeReady_API SHALL record exactly one Audit_Event for that occurrence, including occurrences that end in failure.
3. THE SchemeReady_API SHALL exclude passwords, password hashes, Access_Token values, Refresh_Token values, and uploaded document bytes from every field of every Audit_Event.
4. WHEN a requester holding the Admin_Role queries Audit_Events, THE SchemeReady_API SHALL return the matching records; IF the requester does not hold the Admin_Role, THEN THE SchemeReady_API SHALL reject the query, return no Audit_Event data, and record an authorization-denial Audit_Event.
5. THE Persistence_Layer SHALL grant the application database role INSERT and SELECT privileges on the Audit_Event table and SHALL withhold UPDATE and DELETE privileges from that role, expressed in an EF_Migration whose generated PostgreSQL SQL contains the corresponding GRANT and REVOKE statements.
6. THE SchemeReady_API SHALL expose no operation that updates or deletes an Audit_Event, and SHALL retain each Audit_Event for at least 365 days from its timestamp.
7. IF an Audit_Event write fails, THEN THE SchemeReady_API SHALL complete the originating request with the same response it would have returned had the write succeeded and SHALL emit an error-level application log entry identifying the action type and the failure cause.
8. THE SchemeReady_API SHALL permit at most 10 requests per 15-minute window per source IP address across the login, signup, and refresh endpoints combined, counting every request to those endpoints regardless of outcome.
9. THE SchemeReady_API SHALL permit at most 20 document upload requests per 60-minute window per authenticated user identifier.
10. THE SchemeReady_API SHALL permit at most 100 requests per 60-second window per source IP address to anonymous read endpoints.
11. IF a request exceeds a limit stated in criteria 8 through 10, THEN THE SchemeReady_API SHALL respond with HTTP status 429 and a `Retry-After` header holding an integer number of seconds between 1 and the remaining length of the active window, and SHALL NOT perform the requested action or alter any stored entity.
12. THE SchemeReady_API SHALL read each rate limit count and window length in criteria 8 through 10 from the Configuration_Loader, and SHALL apply the values stated in those criteria when the corresponding setting is absent.
13. THE Configuration_Loader SHALL read the database connection string, JWT signing key, JWT issuer, JWT audience, allowed CORS origins, and document storage root from environment variables.
14. IF any environment variable listed in criterion 13 is absent or empty at startup, THEN THE SchemeReady_API SHALL terminate startup before accepting any request and SHALL emit an error-level log entry naming each absent or empty variable.
15. THE repository SHALL hold no real database password, JWT signing key, or document storage credential in any tracked file, and `appsettings.json` together with `appsettings.Development.json` SHALL supply, for each secret in criterion 13, a placeholder value that names the required environment variable and contains no usable credential.

### Requirement 10: Local Build and Migration Workflow

**User Story:** As the developer implementing this feature, I want the build and migration steps documented, so that work planned in a sandbox without a .NET SDK remains executable on my machine.

#### Acceptance Criteria

1. THE repository SHALL contain exactly one tracked Markdown document whose top-level heading identifies it as the local build and migration workflow, and THE document SHALL list, in execution order, the verbatim commands that restore dependencies, create the EF_Migration, apply the EF_Migration, revert the most recently applied EF_Migration, run the Seeder, and start the SchemeReady_API.
2. THE document SHALL state, for each listed command, the directory the command runs from expressed as a path relative to the repository root, and one observable outcome that indicates the command succeeded.
3. THE document SHALL list the NuGet packages the developer adds to `SchemeReady.Api.csproj`, covering the Npgsql EF Core provider, ASP.NET Core Identity with EF Core stores, and JWT bearer authentication, SHALL state a version for each package that is compatible with the `net8.0` target framework already declared in that file, and SHALL state the .NET SDK major version and the command that installs the EF Core command-line tool.
4. THE document SHALL list the npm packages the developer adds to `SchemeReady/frontend/package.json` for Locale_Bundle loading, SHALL state a version for each, and SHALL state the directory the install command runs from.
5. THE document SHALL state a single PostgreSQL major version number that the EF_Migration targets, and that number SHALL match the major version supported by the Npgsql EF Core provider version listed under criterion 3.
6. THE document SHALL list all six environment variable names the Configuration_Loader reads per Requirement 9, criterion 13 — database connection string, JWT signing key, JWT issuer, JWT audience, allowed CORS origins, and document storage root — each with one example value, and every example value SHALL be a non-functional placeholder rather than a working credential, key, or host.
7. THE document SHALL state that the sandbox environment compiles no code and runs no EF_Migration, SHALL identify the developer's machine as the location for those steps, and SHALL list which of its own commands require the developer's machine.
