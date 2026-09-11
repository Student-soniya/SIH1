using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Data;

/// <summary>
/// PostgreSQL-backed <see cref="ISchemeRepository"/>. Replaces the static
/// <c>List&lt;&gt;</c> implementation; the interface is untouched (R1.1).
///
/// Registered <c>Scoped</c>, matching the <see cref="SchemeReadyDbContext"/> lifetime.
/// Every write is exactly one <c>SaveChangesAsync</c>, so it is all-or-nothing (R1.17).
/// </summary>
public class EfSchemeRepository : ISchemeRepository
{
    private readonly SchemeReadyDbContext _db;

    public EfSchemeRepository(SchemeReadyDbContext db)
    {
        _db = db;
    }

    // ---------------------------------------------------------------- Schemes

    public async Task<List<Scheme>> GetAllSchemesAsync() =>
        await _db.Schemes.AsNoTracking().OrderBy(s => s.Id).ToListAsync();

    public async Task<Scheme?> GetSchemeByIdAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id)) return null;                      // R1.2 — null, never throw

        // ToLower() on both sides, not string.Equals(..., StringComparison), because only the
        // former translates: Npgsql emits lower(s."Id") = lower(@p0), served by the functional
        // index ix_schemes_id_lower created in the migration.
        return await _db.Schemes.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id.ToLower() == id.ToLower());       // R1.2 — case-insensitive
    }

    public async Task<Scheme> AddOrUpdateSchemeAsync(Scheme scheme)
    {
        if (string.IsNullOrWhiteSpace(scheme.Id))
        {
            scheme.Id = $"NSFDC-CUSTOM-{Guid.NewGuid().ToString("N")[..6].ToUpper()}";   // unchanged
        }

        var existing = await _db.Schemes.FirstOrDefaultAsync(s => s.Id == scheme.Id);
        if (existing is null)
        {
            _db.Schemes.Add(scheme);
        }
        else
        {
            _db.Entry(existing).CurrentValues.SetValues(scheme);
            // SetValues copies scalars only, so the jsonb collections are assigned explicitly.
            // The ordered value comparer is what makes these assignments detectable (R1.10).
            existing.EligibleBusinessTypes = scheme.EligibleBusinessTypes;
            existing.RequiredDocuments = scheme.RequiredDocuments;
            existing.SupportedDistricts = scheme.SupportedDistricts;
        }

        await SaveAsync("scheme", scheme.Id);
        return scheme;
    }

    // --------------------------------------------------------------- Partners

    public async Task<List<ChannelPartner>> GetAllPartnersAsync() =>
        await _db.ChannelPartners.AsNoTracking().OrderBy(p => p.Id).ToListAsync();

    public async Task<ChannelPartner?> GetPartnerByIdAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id)) return null;                      // R1.2

        return await _db.ChannelPartners.AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id.ToLower() == id.ToLower());       // R1.2
    }

    public async Task<ChannelPartner> AddOrUpdatePartnerAsync(ChannelPartner partner)
    {
        if (string.IsNullOrWhiteSpace(partner.Id))
        {
            partner.Id = $"PART-{partner.InstitutionType}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}";
        }

        var existing = await _db.ChannelPartners.FirstOrDefaultAsync(p => p.Id == partner.Id);
        if (existing is null)
        {
            _db.ChannelPartners.Add(partner);
        }
        else
        {
            _db.Entry(existing).CurrentValues.SetValues(partner);
            existing.SupportedSchemes = partner.SupportedSchemes;
            existing.DocumentRequirements = partner.DocumentRequirements;
        }

        await SaveAsync("partner", partner.Id);
        return partner;
    }

    // ----------------------------------------------------------- Applications

    public async Task<List<ApplicationPack>> GetAllApplicationsAsync()
    {
        // Newest first, matching the old implementation's Insert(0, ...).
        var rows = await _db.ApplicationPacks.AsNoTracking()
            .OrderByDescending(a => a.GeneratedDate)
            .ThenBy(a => a.ApplicationId)
            .ToListAsync();

        return rows.Select(FromRow).ToList();
    }

    public async Task<ApplicationPack> SaveApplicationAsync(ApplicationPack pack)
    {
        if (string.IsNullOrWhiteSpace(pack.ApplicationId))
        {
            pack.ApplicationId = $"APP-2026-{pack.Profile.Location[..Math.Min(3, pack.Profile.Location.Length)].ToUpper()}-{Random.Shared.Next(1000, 9999)}";
        }
        pack.GeneratedDate = DateTime.UtcNow;
        if (string.IsNullOrWhiteSpace(pack.HandoffReferenceNumber))
        {
            pack.HandoffReferenceNumber = $"SURAJ-2026-DEMO-{Random.Shared.Next(1000, 9999)}";
        }

        var incoming = ToRow(pack);

        var existing = await _db.ApplicationPacks
            .FirstOrDefaultAsync(a => a.ApplicationId == pack.ApplicationId);

        if (existing is null)
        {
            _db.ApplicationPacks.Add(incoming);
        }
        else
        {
            // OwnerUserId is assigned once, at generation, and never reassigned by a later
            // save — a handoff must not be able to move a dossier to another owner (R4.17).
            incoming.OwnerUserId ??= existing.OwnerUserId;
            _db.Entry(existing).CurrentValues.SetValues(incoming);
            existing.MissingDocuments = incoming.MissingDocuments;
        }

        await SaveAsync("application pack", pack.ApplicationId);
        return pack;
    }

    // ------------------------------------------------------------ Admin stats

    /// <summary>
    /// Real aggregates over the stored rows. The response schema is exactly as before; only
    /// the values are now truthful. The old <c>Math.Max(_applications.Count, 148)</c> demo
    /// floor is gone, so an empty database honestly reports zero.
    /// </summary>
    public async Task<AdminStatsResponse> GetAdminStatsAsync()
    {
        var totalSchemes = await _db.Schemes.CountAsync();

        // Same predicate the in-memory implementation used.
        var verifiedPartners = await _db.ChannelPartners.CountAsync(p => p.LastVerifiedDate.Year >= 2026);

        var totalApplications = await _db.ApplicationPacks.CountAsync();

        // GROUP BY in SQL over the promoted header columns.
        var byBusiness = await _db.ApplicationPacks
            .GroupBy(a => a.ApplicantBusinessType)
            .Select(g => new { Key = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count).ThenBy(x => x.Key)
            .Take(5)
            .ToListAsync();

        var byDistrict = await _db.ApplicationPacks
            .GroupBy(a => a.District)
            .Select(g => new { Key = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count).ThenBy(x => x.Key)
            .Take(5)
            .ToListAsync();

        // Derived from the jsonb MissingDocumentsJson column: SQL projects the single column,
        // the counts are tallied here because the element-level tally is not expressible in LINQ.
        var missingLists = await _db.ApplicationPacks
            .Select(a => a.MissingDocuments)
            .ToListAsync();

        var missingCounts = missingLists
            .SelectMany(list => list)
            .GroupBy(doc => doc, StringComparer.Ordinal)
            .Select(g => new { Key = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count).ThenBy(x => x.Key, StringComparer.Ordinal)
            .Take(5)
            .ToList();

        return new AdminStatsResponse
        {
            TotalSchemes = totalSchemes,
            TotalVerifiedPartners = verifiedPartners,
            TotalApplicationsPrepared = totalApplications,
            PopularBusinessCategories = byBusiness.ToDictionary(x => x.Key, x => x.Count),
            ApplicationsByDistrict = byDistrict.ToDictionary(x => x.Key, x => x.Count),
            CommonMissingDocuments = missingCounts.ToDictionary(x => x.Key, x => x.Count)
        };
    }

    // ---------------------------------------------------------------- Helpers

    private async Task SaveAsync(string entityKind, string entityId)
    {
        try
        {
            await _db.SaveChangesAsync();   // one SaveChanges ⇒ one transaction ⇒ all-or-nothing
        }
        catch (DbUpdateException ex)
        {
            // The transaction rolled back, so nothing was applied. Detach the failed entries so
            // a later use of this scoped context cannot re-submit them.
            foreach (var entry in _db.ChangeTracker.Entries().ToList())
            {
                entry.State = EntityState.Detached;
            }

            throw new PersistenceFailedException(
                $"Persistence failed for {entityKind} '{entityId}'; no changes were applied.", ex);
        }
    }

    private static ApplicationPackRow ToRow(ApplicationPack pack) => new()
    {
        ApplicationId = pack.ApplicationId,
        GeneratedDate = pack.GeneratedDate,
        AssignedPartnerId = string.IsNullOrWhiteSpace(pack.NearestPartner.Id) ? null : pack.NearestPartner.Id,
        SelectedSchemeId = pack.SelectedScheme.Id,
        TrackingStatus = pack.TrackingStatus,
        HandoffReferenceNumber = pack.HandoffReferenceNumber,
        ApplicantBusinessType = pack.Profile.BusinessType,
        District = pack.Profile.Location,
        MissingDocuments = pack.DocumentChecklist
            .Where(i => i.IsMandatory && i.Status == "Missing")
            .Select(i => i.Title)
            .ToList(),
        FullDossierJson = JsonSerializer.Serialize(pack, SchemeReadyDbContext.JsonOpts)
    };

    private static ApplicationPack FromRow(ApplicationPackRow row)
    {
        var pack = JsonSerializer.Deserialize<ApplicationPack>(row.FullDossierJson, SchemeReadyDbContext.JsonOpts)
                   ?? new ApplicationPack();

        // The header columns are authoritative for the few fields a later write may change
        // without rewriting the dossier.
        pack.ApplicationId = row.ApplicationId;
        pack.GeneratedDate = row.GeneratedDate;
        pack.TrackingStatus = row.TrackingStatus;
        pack.HandoffReferenceNumber = row.HandoffReferenceNumber;
        return pack;
    }
}
