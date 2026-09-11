using Microsoft.EntityFrameworkCore;
using SchemeReady.Api.Data;
using SchemeReady.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// A "--seed-only" run applies migrations, seeds, and exits without binding a listener.
// Documented in docs/local-build-and-migrations.md.
bool seedOnly = args.Contains("--seed-only");

// Add Controllers
builder.Services.AddControllers();

// Configure CORS for React UI
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
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

// Register Core Domain Services & Repository
// Scoped, not Singleton: the repository now shares the scoped DbContext lifetime.
builder.Services.AddScoped<ISchemeRepository, EfSchemeRepository>();
builder.Services.AddScoped<DatabaseSeeder>();
// Singleton: it resolves its own scope per write, so it never enlists in a request's
// transaction (design C9).
builder.Services.AddSingleton<IAuditWriter, AuditWriter>();
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
}

if (seedOnly)
{
    app.Logger.LogInformation("--seed-only: migrations applied and seed complete. Exiting without serving requests.");
    return;
}

// Enable Swagger UI always for development & judging demo
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SchemeReady API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");

app.UseRouting();

app.MapControllers();

// Root health & welcome redirect
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
