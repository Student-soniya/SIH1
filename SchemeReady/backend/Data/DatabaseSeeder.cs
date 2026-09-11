using Microsoft.EntityFrameworkCore;

namespace SchemeReady.Api.Data;

/// <summary>
/// Inserts the baseline <see cref="SeedData.Schemes"/> and <see cref="SeedData.Partners"/>
/// rows. Existence-check-then-insert, never <c>Update</c>.
///
/// That single rule is what makes seeding safe to run on every startup: a second run
/// inserts nothing and touches nothing, so an admin who corrected an
/// <c>IncomeLimit</c> — or cleared an <c>IsIllustrative</c> flag with a verification
/// reference — keeps that edit across every subsequent restart (R1.13, R1.14).
/// </summary>
public class DatabaseSeeder
{
    private readonly SchemeReadyDbContext _db;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(SchemeReadyDbContext db, ILogger<DatabaseSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken ct = default)
    {
        int schemesAdded = 0;
        int partnersAdded = 0;

        foreach (var seed in SeedData.Schemes)                                   // 6 rows (R1.12)
        {
            if (!await _db.Schemes.AnyAsync(s => s.Id == seed.Id, ct))
            {
                _db.Schemes.Add(seed);                                          // insert only when PK absent
                schemesAdded++;
            }
        }

        foreach (var seed in SeedData.Partners)                                  // 6 rows (R1.12)
        {
            if (!await _db.ChannelPartners.AnyAsync(p => p.Id == seed.Id, ct))
            {
                _db.ChannelPartners.Add(seed);
                partnersAdded++;
            }
        }

        // Phase E adds the identical loop over SeedData.MatchingRules here.

        if (schemesAdded == 0 && partnersAdded == 0)
        {
            _logger.LogInformation("Seeder: database already seeded; no rows inserted, no rows modified.");
            return;
        }

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeder: inserted {Schemes} scheme row(s) and {Partners} channel partner row(s).",
            schemesAdded, partnersAdded);
    }
}
