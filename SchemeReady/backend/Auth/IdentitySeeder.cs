using Microsoft.AspNetCore.Identity;

namespace SchemeReady.Api.Auth;

/// <summary>
/// Creates the three roles of R4.14–R4.16 if they are absent. Idempotent in the same sense
/// as <c>DatabaseSeeder</c>: it inserts what is missing and never updates what is present,
/// so repeated startups converge rather than churn (R1.13).
///
/// No user account is seeded. A first Admin is provisioned operationally — see
/// docs/local-build-and-migrations.md — because a checked-in administrator credential would
/// be a shipped secret.
/// </summary>
public class IdentitySeeder
{
    private readonly RoleManager<IdentityRole> _roles;
    private readonly ILogger<IdentitySeeder> _logger;

    public IdentitySeeder(RoleManager<IdentityRole> roles, ILogger<IdentitySeeder> logger)
    {
        _roles = roles;
        _logger = logger;
    }

    public async Task SeedRolesAsync()
    {
        foreach (var role in RoleNames.All)
        {
            if (await _roles.RoleExistsAsync(role)) continue;

            var result = await _roles.CreateAsync(new IdentityRole(role));
            if (!result.Succeeded)
            {
                throw new InvalidOperationException(
                    $"Could not create role '{role}': {string.Join("; ", result.Errors.Select(e => e.Description))}");
            }

            _logger.LogInformation("Seeded role {Role}.", role);
        }
    }
}
