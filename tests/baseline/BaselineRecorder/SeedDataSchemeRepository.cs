using SchemeReady.Api.Data;
using SchemeReady.Api.Models;

namespace SchemeReady.Baseline;

/// <summary>
/// The nine-member <see cref="ISchemeRepository"/> served from <see cref="SeedData"/>.
///
/// The baseline must be reproducible from a git checkout alone — no PostgreSQL, no Docker,
/// no network — so the recorder and <c>BaselineEqualityTests</c> read the seeded catalogue
/// directly instead of through <c>EfSchemeRepository</c>. That is sound because
/// <c>DatabaseSeeder</c> inserts these exact rows and never modifies them, so a freshly
/// seeded database returns the same catalogue; and because Phase B is about the *scoring*
/// code, not the data path, which Phase A's persistence round-trip property already covers.
///
/// Only the two read members matching needs are implemented. The rest throw rather than
/// returning something plausible, so a future test that wanders outside the baseline's
/// scope fails loudly instead of silently scoring against empty data.
/// </summary>
public sealed class SeedDataSchemeRepository : ISchemeRepository
{
    public Task<List<Scheme>> GetAllSchemesAsync() => Task.FromResult(SeedData.Schemes.ToList());

    public Task<List<ChannelPartner>> GetAllPartnersAsync() => Task.FromResult(SeedData.Partners.ToList());

    public Task<Scheme?> GetSchemeByIdAsync(string id) => throw NotPartOfTheBaseline();
    public Task<Scheme> AddOrUpdateSchemeAsync(Scheme scheme) => throw NotPartOfTheBaseline();
    public Task<ChannelPartner?> GetPartnerByIdAsync(string id) => throw NotPartOfTheBaseline();
    public Task<ChannelPartner> AddOrUpdatePartnerAsync(ChannelPartner partner) => throw NotPartOfTheBaseline();
    public Task<List<ApplicationPack>> GetAllApplicationsAsync() => throw NotPartOfTheBaseline();
    public Task<ApplicationPack> SaveApplicationAsync(ApplicationPack pack) => throw NotPartOfTheBaseline();
    public Task<AdminStatsResponse> GetAdminStatsAsync() => throw NotPartOfTheBaseline();

    private static NotSupportedException NotPartOfTheBaseline() =>
        new("The matching baseline reads only the scheme and partner catalogues. " +
            "If a test needs another repository member, use a real repository instead of this stub.");
}
