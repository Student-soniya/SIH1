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

bool seedOnly = args.Contains("--seed-only");

builder.Services.AddControllers(options =>
{
    options.Filters.Add<RuleStoreExceptionFilter>();
});

const string CorsOriginsKey = "SCHEMEREADY_CORS_ORIGINS";
const string CorsPolicyName = "SchemeReadyOrigins";

var rawOriginsConfig = builder.Configuration[CorsOriginsKey];
if (string.IsNullOrWhiteSpace(rawOriginsConfig))
{
    rawOriginsConfig = "http://localhost:5173,http://localhost:3000,https://schemeready.onrender.com,https://schemeready-frontend.onrender.com";
}

var configuredOrigins = rawOriginsConfig
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    .Distinct(StringComparer.Ordinal)
    .ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        if (configuredOrigins.Contains("*"))
        {
            policy.SetIsOriginAllowed(_ => true)
                  .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                  .WithHeaders("Authorization", "Content-Type", "Accept")
                  .AllowCredentials();
        }
        else
        {
            policy.WithOrigins(configuredOrigins)
                  .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                  .WithHeaders("Authorization", "Content-Type", "Accept")
                  .AllowCredentials();
        }
    });
});

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

var rawConn = builder.Configuration["SCHEMEREADY_DB_CONNECTION"]
              ?? builder.Configuration["DATABASE_URL"]
              ?? builder.Configuration.GetConnectionString("DefaultConnection");

var connectionString = ParseDatabaseUrl(rawConn);

builder.Services.AddDbContext<SchemeReadyDbContext>(options =>
    options.UseNpgsql(connectionString ?? "Host=localhost;Port=5432;Database=schemeready;Username=postgres;Password=postgres", npgsql =>
    {
        npgsql.CommandTimeout(30);
    }));

builder.Services.AddIdentityCore<ApplicationUser>(options =>
{
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.AllowedForNewUsers = true;
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

var jwtSettings = JwtSettings.LoadOrThrow(builder.Configuration);
builder.Services.AddSingleton(jwtSettings);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
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
            ClockSkew = JwtSettings.ClockSkew,
            NameClaimType = PrincipalExtensions.NameClaimType,
            RoleClaimType = PrincipalExtensions.RoleClaimType
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddAuditingAuthorizationResultHandler();
builder.Services.AddSingleton(DocumentStorage.FromConfigurationOrThrow(builder.Configuration));

// Existing Decentro integration remains available for backwards compatibility.
builder.Services.Configure<DecentroOptions>(builder.Configuration.GetSection(DecentroOptions.SectionName));
builder.Services.AddHttpClient<IDecentroDigiLockerService, DecentroDigiLockerService>();

// Official DigiLocker Requester integration.
builder.Services.AddDataProtection();
builder.Services.Configure<DigiLockerOptions>(builder.Configuration.GetSection(DigiLockerOptions.SectionName));
builder.Services.AddHttpClient<IDigiLockerService, DigiLockerService>();

builder.Services.AddScoped<ISchemeRepository, EfSchemeRepository>();
builder.Services.AddScoped<DatabaseSeeder>();
builder.Services.AddScoped<IdentitySeeder>();
builder.Services.AddSingleton<IAuditWriter, AuditWriter>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IApplicationPackAccessService, ApplicationPackAccessService>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IRuleStore, EfRuleStore>();
builder.Services.AddSingleton<IRuleSetProvider, RuleSetProvider>();
builder.Services.AddScoped<IEmiCalculatorService, EmiCalculatorService>();
builder.Services.AddScoped<ISchemeMatchingService, SchemeMatchingService>();
builder.Services.AddScoped<IBusinessPlanService, BusinessPlanService>();
builder.Services.AddScoped<IReadinessService, ReadinessService>();
builder.Services.AddScoped<IPartnerRoutingService, PartnerRoutingService>();

var app = builder.Build();

try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<SchemeReadyDbContext>();
    await db.Database.MigrateAsync();
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
    var identitySeeder = scope.ServiceProvider.GetRequiredService<IdentitySeeder>();
    await identitySeeder.SeedRolesAsync();
}
catch (Exception ex)
{
    app.Logger.LogWarning(ex, "Initial database migration or seeding was skipped or encountered an issue. Proceeding with application startup.");
}

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
    app.Logger.LogCritical(ex, "FATAL: the rule store is unreachable. Scheme matching cannot be served and no hard-coded threshold or weight will be substituted. The API will not start.");
    throw;
}
catch (RuleDataInvalidException ex)
{
    app.Logger.LogCritical(ex, "FATAL: the rule store holds invalid data for {Target}, field {Field}: {Message} The API will not start.", ex.SchemeIdOrComponent, ex.FieldName, ex.Message);
    throw;
}

if (seedOnly)
{
    app.Logger.LogInformation("--seed-only: migrations applied and seed complete. Exiting without serving requests.");
    return;
}

app.Logger.LogInformation("CORS policy admits {Count} configured origin(s).", configuredOrigins.Length);
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SchemeReady API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors(CorsPolicyName);
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger"));
app.Run();

static string? ParseDatabaseUrl(string? conn)
{
    if (string.IsNullOrWhiteSpace(conn)) return conn;
    if (conn.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) || conn.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        try
        {
            var uri = new Uri(conn);
            var userInfo = uri.UserInfo.Split(':');
            var user = userInfo[0];
            var pass = userInfo.Length > 1 ? userInfo[1] : "";
            var host = uri.Host;
            var port = uri.Port > 0 ? uri.Port : 5432;
            var db = uri.AbsolutePath.TrimStart('/');
            return $"Host={host};Port={port};Database={db};Username={user};Password={pass};SSL Mode=Require;Trust Server Certificate=true";
        }
        catch
        {
            return conn;
        }
    }
    return conn;
}
