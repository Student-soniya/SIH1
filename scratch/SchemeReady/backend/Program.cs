using SchemeReady.Api.Data;
using SchemeReady.Api.Services;

var builder = WebApplication.CreateBuilder(args);

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

// Register Core Domain Services & Repository
builder.Services.AddSingleton<ISchemeRepository, SchemeRepository>();
builder.Services.AddScoped<IEmiCalculatorService, EmiCalculatorService>();
builder.Services.AddScoped<ISchemeMatchingService, SchemeMatchingService>();
builder.Services.AddScoped<IBusinessPlanService, BusinessPlanService>();
builder.Services.AddScoped<IReadinessService, ReadinessService>();
builder.Services.AddScoped<IPartnerRoutingService, PartnerRoutingService>();

var app = builder.Build();

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
