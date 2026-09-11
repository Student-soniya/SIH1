using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SchemeReady.Api.Auth;
using SchemeReady.Api.Data;
using SchemeReady.Api.Models;
using SchemeReady.Api.Options;
using SchemeReady.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// A "--seed-only" run applies migrations, seeds, and exits without binding a listener.
// Documented in docs/local-build-and-migrations.md.
bool seedOnly = args.Contains("--seed-only");

// Add Controllers.
//
// The Rule_Store exception filter is registered globally so every action that reaches the
// matching engine turns an unreadable store into 503 and invalid rule data into a named 500 —
// never into a score computed from a substituted default (R7.5).
builder.Services.AddControllers(options =>
{
    options.Filters.Add<RuleStoreExceptionFilter>();
});

// ---------------------------------------------------------------------- CORS
//
// R4.22–R4.24. The previous policy was AllowAnyOrigin + AllowAnyHeader + AllowAnyMethod,
// which cannot coexist with credentialed requests and admitted every origin on the internet.
// The replacement takes an explicit comma-separated list from configuration and fails startup
// when it is absent or empty, logging the key name (R4.24) — a deployment cannot accidentally
// fall back to a permissive policy.
const string CorsOriginsKey = "SCHEMEREADY_CORS_ORIGINS";
const string CorsPolicyName = "SchemeReadyOrigins";

var configuredOrigins = (builder.Configuration[CorsOriginsKey] ?? string.Empty)
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    .Distinct(StringComparer.Ordinal)
    .ToArray();

if (configuredOrigins.Length == 0)
{
    // Logged before the host is built, so the message survives even though no logger is wired yet.
    Console.Error.WriteLine(
        $"FATAL: required configuration {CorsOriginsKey} is absent or empty. " +
        "Supply a comma-separated list of permitted origins (for example " +
        "\"http://localhost:5173,https://schemeready.example.gov.in\"). The API will not start.");

    throw new InvalidOperationException($"Missing required configuration: {CorsOriginsKey}.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy.WithOrigins(configuredOrigins)                 // exact origins only — no wildcard
              .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
              .WithHeaders("Authorization", "Content-Type", "Accept")
              .AllowCredentials();
    });
});

// Configure Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "SchemeReady (Udyam Saarthi AI) API",
        Version = "v1",
        Description = "GovTech Platform API for Beneficiary Onboarding, Explainable Scheme Matching, Application Readiness Scoring, AI Business Plan Generation, Channel Partner Routing, and PM-SURAJ Handoff."
    });

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Paste the access token returned by POST /api/auth/login."
    });
});

// PostgreSQL persistence. The connection string comes from the environment in deployment;
// appsettings.json carries a non-functional placeholder only.
var connectionString = builder.Configuration["SCHEMEREADY_DB_CONNECTION"]
                       ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<SchemeReadyDbContext>(options =>
    options.UseNpgsql(connectionString, npgsql =>
    {
        // R1.16: a connection attempt that cannot complete inside 30 seconds fails rather
        // than hanging the request.
        npgsql.CommandTimeout(30);
    }));

// ------------------------------------------------------------------ Identity
//
// AddIdentityCore, not AddIdentity: this API issues bearer tokens and has no cookie sign-in
// surface, so the cookie handlers AddIdentity registers would be dead weight — and a second
// authentication scheme able to authenticate a request is exactly the kind of thing that
// quietly widens an authorization surface.
builder.Services.AddIdentityCore<ApplicationUser>(options =>
{
    // R4.7 — five failed attempts, then a 15-minute lock. The login handler maps IsLockedOut
    // to 423 *before* verifying the password, so a correct password during lockout still gets 423.
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.AllowedForNewUsers = true;

    // R4.2's credential space exactly: 12–128 characters with at least one letter and at least
    // one digit. Identity has no "at least one letter" switch, and its defaults would also
    // demand an uppercase character and a symbol — rules R4.2 does not state — so the
    // character-class requirements are turned off here and the full rule set is enforced by
    // AuthController.ValidateSignup, which can also name every unmet rule at once (R4.4).
    options.Password.RequiredLength = 12;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredUniqueChars = 1;

    options.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<SchemeReadyDbContext>()
.AddDefaultTokenProviders();

// ----------------------------------------------------------- JWT bearer auth
var jwtSettings = JwtSettings.LoadOrThrow(builder.Configuration);
builder.Services.AddSingleton(jwtSettings);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Inbound claim mapping renames "sub" to the long ClaimTypes.NameIdentifier URI and
        // "role" to the long role URI. Disabling it keeps the claim types identical on both
        // sides of the wire, which is what PrincipalExtensions reads.
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = jwtSettings.SecurityKey(),
            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256 },
            ValidateLifetime = true,

            // R4.20 — the default is five minutes, which would honour an expired token for
            // nearly five minutes longer than the 60-second allowance permits.
            ClockSkew = JwtSettings.ClockSkew,

            NameClaimType = PrincipalExtensions.NameClaimType,
            RoleClaimType = PrincipalExtensions.RoleClaimType
        };
    });

builder.Services.AddAuthorization();

// R4.21 — one audit event per role-based 403, written from the one seam that sees the decision.
builder.Services.AddAuditingAuthorizationResultHandler();

// ------------------------------------------------------------ document storage
// Resolved once, at startup, so a missing root fails the process rather than the first upload.
builder.Services.AddSingleton(DocumentStorage.FromConfigurationOrThrow(builder.Configuration));

// Decentro's DigiLocker session APIs. Credentials are supplied through user-secrets or
// environment variables; appsettings.json intentionally contains no credentials.
builder.Services.Configure<DecentroOptions>(
    builder.Configuration.GetSection(DecentroOptions.SectionName));
builder.Services.AddHttpClient<IDecentroDigiLockerService, DecentroDigiLockerService>();

// Register Core Domain Services & Repository
// Scoped, not Singleton: the repository now shares the scoped DbContext lifetime.
builder.Services.AddScoped<ISchemeRepository, EfSchemeRepository>();
builder.Services.AddScoped<DatabaseSeeder>();
builder.Services.AddScoped<IdentitySeeder>();
// Singleton: it resolves its own scope per write, so it never enlists in a request's
// transaction (design C9).
builder.Services.AddSingleton<IAuditWriter, AuditWriter>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IApplicationPackAccessService, ApplicationPackAccessService>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IRuleStore, EfRuleStore>();
// Singleton: the 60-second cache of R7.4 has to outlive a request to be a cache at all. It
// resolves its own scope per load rather than capturing the scoped DbContext.
builder.Services.AddSingleton<IRuleSetProvider, RuleSetProvider>();
builder.Services.AddScoped<IEmiCalculatorService, EmiCalculatorService>();
builder.Services.AddScoped<ISchemeMatchingService, SchemeMatchingService>();
builder.Services.AddScoped<IBusinessPlanService, BusinessPlanService>();
builder.Services.AddScoped<IReadinessService, ReadinessService>();
builder.Services.AddScoped<IPartnerRoutingService, PartnerRoutingService>();

var app = builder.Build();

// Apply migrations, then seed. The seeder only inserts rows whose primary key is absent,
// so this is safe on every start (R1.13, R1.14).
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SchemeReadyDbContext>();
    await db.Database.MigrateAsync();

    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();

    // The three roles of R4.14–R4.16. No user account is seeded — see IdentitySeeder.
    var identitySeeder = scope.ServiceProvider.GetRequiredService<IdentitySeeder>();
    await identitySeeder.SeedRolesAsync();
}

// ------------------------------------------------------------ Rule_Store startup gate
//
// R7.8. Load and validate the Rule_Store once, now, and refuse to start on any of the three
// stated conditions: an unreachable store, a missing weight component, or weights not summing to
// 100. The alternative — discovering it on the first beneficiary's matching request — means the
// process reports itself healthy while being incapable of doing the one thing it exists for.
//
// This runs after Migrate + Seed, so a first-ever start finds the baseline rows the seeder just
// inserted rather than an empty table.
try
{
    var ruleProvider = app.Services.GetRequiredService<IRuleSetProvider>();
    var startupRules = await ruleProvider.LoadAndValidateAsync();

    app.Logger.LogInformation(
        "Rule store validated: {SchemeCount} scheme rule row(s); weights {Weights} summing to {Sum}.",
        startupRules.BySchemeId.Count,
        string.Join(", ", startupRules.Weights.AsDictionary().Select(kv => $"{kv.Key}={kv.Value}")),
        startupRules.Weights.Sum());
}
catch (RuleStoreUnavailableException ex)
{
    app.Logger.LogCritical(ex,
        "FATAL: the rule store is unreachable. Scheme matching cannot be served and no hard-coded " +
        "threshold or weight will be substituted. The API will not start.");
    throw;
}
catch (RuleDataInvalidException ex)
{
    app.Logger.LogCritical(ex,
        "FATAL: the rule store holds invalid data for {Target}, field {Field}: {Message} The API will not start.",
        ex.SchemeIdOrComponent, ex.FieldName, ex.Message);
    throw;
}

if (seedOnly)
{
    app.Logger.LogInformation("--seed-only: migrations applied and seed complete. Exiting without serving requests.");
    return;
}

app.Logger.LogInformation("CORS policy admits {Count} configured origin(s).", configuredOrigins.Length);

// Enable Swagger UI always for development & judging demo
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SchemeReady API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors(CorsPolicyName);

app.UseRouting();

// Order matters: authentication populates HttpContext.User, authorization then evaluates the
// [Authorize] attributes against it.
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Root health & welcome redirect
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
