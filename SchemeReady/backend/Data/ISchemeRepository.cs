using SchemeReady.Api.Models;

namespace SchemeReady.Api.Data;

/// <summary>
/// The one data seam in the application. Every controller and service depends on this
/// interface, never on a concrete implementation, which is why swapping the in-memory
/// store for PostgreSQL touched one line of <c>Program.cs</c>.
///
/// The member set and every signature are exactly as they were declared in the deleted
/// <c>Data/SchemeRepository.cs</c>: nine members, nothing added, nothing removed (R1.1).
/// </summary>
public interface ISchemeRepository
{
    Task<List<Scheme>> GetAllSchemesAsync();
    Task<Scheme?> GetSchemeByIdAsync(string id);
    Task<Scheme> AddOrUpdateSchemeAsync(Scheme scheme);
    Task<List<ChannelPartner>> GetAllPartnersAsync();
    Task<ChannelPartner?> GetPartnerByIdAsync(string id);
    Task<ChannelPartner> AddOrUpdatePartnerAsync(ChannelPartner partner);
    Task<List<ApplicationPack>> GetAllApplicationsAsync();
    Task<ApplicationPack> SaveApplicationAsync(ApplicationPack pack);
    Task<AdminStatsResponse> GetAdminStatsAsync();
}
