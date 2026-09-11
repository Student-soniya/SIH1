using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using SchemeReady.Api.Auth;
using SchemeReady.Api.Data;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Services;

/// <summary>
/// Ownership authorisation for dossiers and documents (design C7, R4.17–R4.19, R6.13–R6.16).
///
/// Two rules govern every method here:
///
/// * <b>Every negative outcome is 404 with an empty body.</b> "Absent", "soft-deleted" and
///   "exists but not yours" are indistinguishable to the caller, so a caller cannot probe for
///   the existence of another beneficiary's dossier. 403 is reserved for the single case R4.21
///   describes — a valid token lacking a required <em>role</em> — which the framework's
///   <c>[Authorize(Roles=...)]</c> handling produces, never this service.
/// * <b>Officer access is read-only.</b> An officer may read a dossier assigned to their
///   ChannelPartner; deletion and mutation stay with the owner (and Admin).
/// </summary>
public interface IApplicationPackAccessService
{
    /// <summary>
    /// The dossier when the principal may read it; null when it is absent <em>or</em> when the
    /// principal may not — the caller returns 404 either way and cannot tell them apart.
    /// </summary>
    Task<ApplicationPack?> GetReadablePackAsync(string applicationId, ClaimsPrincipal principal, CancellationToken ct = default);

    /// <summary>As <see cref="GetReadablePackAsync"/>, for operations that mutate the dossier
    /// (handoff): owner or Admin only.</summary>
    Task<ApplicationPack?> GetWritablePackAsync(string applicationId, ClaimsPrincipal principal, CancellationToken ct = default);

    /// <summary>True when the principal may read the document's bytes (R6.14, R6.15).</summary>
    Task<bool> CanReadDocumentAsync(StoredDocument document, ClaimsPrincipal principal, CancellationToken ct = default);

    /// <summary>True only for the owner and Admin (R6.16 — deletion is not an officer power).</summary>
    bool CanDeleteDocument(StoredDocument document, ClaimsPrincipal principal);

    /// <summary>
    /// Stamps the authenticated requester onto a freshly generated pack (R4.17). Written
    /// through the header column because <c>ISchemeRepository</c>'s nine members are frozen
    /// and <c>ApplicationPack</c>'s response schema must not gain a field.
    /// </summary>
    Task RecordOwnershipAsync(string applicationId, string ownerUserId, CancellationToken ct = default);
}

public class ApplicationPackAccessService : IApplicationPackAccessService
{
    private readonly SchemeReadyDbContext _db;
    private readonly ISchemeRepository _repository;

    public ApplicationPackAccessService(SchemeReadyDbContext db, ISchemeRepository repository)
    {
        _db = db;
        _repository = repository;
    }

    public Task<ApplicationPack?> GetReadablePackAsync(string applicationId, ClaimsPrincipal principal, CancellationToken ct = default) =>
        GetPackAsync(applicationId, principal, allowOfficer: true, ct);

    public Task<ApplicationPack?> GetWritablePackAsync(string applicationId, ClaimsPrincipal principal, CancellationToken ct = default) =>
        GetPackAsync(applicationId, principal, allowOfficer: false, ct);

    private async Task<ApplicationPack?> GetPackAsync(string applicationId, ClaimsPrincipal principal, bool allowOfficer, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(applicationId)) return null;

        var row = await _db.ApplicationPacks.AsNoTracking()
            .FirstOrDefaultAsync(a => a.ApplicationId == applicationId, ct);

        if (row is null) return null;                                  // absent → 404
        if (!IsPermitted(row.OwnerUserId, row.AssignedPartnerId, principal, allowOfficer)) return null;  // foreign → 404

        // Read back through the repository so the dossier is materialised exactly as every
        // other read path materialises it — one deserialisation, one shape.
        var packs = await _repository.GetAllApplicationsAsync();
        return packs.FirstOrDefault(p => p.ApplicationId == applicationId);
    }

    public async Task<bool> CanReadDocumentAsync(StoredDocument document, ClaimsPrincipal principal, CancellationToken ct = default)
    {
        if (document.DeletedAt is not null) return false;              // soft-deleted → 404
        if (principal.IsAdmin()) return true;

        var userId = principal.UserId();
        if (!string.IsNullOrEmpty(userId) && string.Equals(document.OwnerUserId, userId, StringComparison.Ordinal))
        {
            return true;                                               // R6.14
        }

        // R6.15: an officer may read a document that evidences a pack assigned to their partner.
        if (principal.IsOfficer() && !string.IsNullOrWhiteSpace(document.ApplicationPackId))
        {
            var partnerId = principal.PartnerId();
            if (string.IsNullOrWhiteSpace(partnerId)) return false;

            var assigned = await _db.ApplicationPacks.AsNoTracking()
                .Where(a => a.ApplicationId == document.ApplicationPackId)
                .Select(a => a.AssignedPartnerId)
                .FirstOrDefaultAsync(ct);

            return !string.IsNullOrWhiteSpace(assigned)
                   && string.Equals(assigned, partnerId, StringComparison.Ordinal);
        }

        return false;
    }

    public bool CanDeleteDocument(StoredDocument document, ClaimsPrincipal principal)
    {
        if (document.DeletedAt is not null) return false;
        if (principal.IsAdmin()) return true;

        var userId = principal.UserId();
        return !string.IsNullOrEmpty(userId)
               && string.Equals(document.OwnerUserId, userId, StringComparison.Ordinal);
    }

    public async Task RecordOwnershipAsync(string applicationId, string ownerUserId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(applicationId) || string.IsNullOrWhiteSpace(ownerUserId)) return;

        // Conditional on NULL: ownership is assigned once, at generation, and a later write can
        // never move a dossier to another owner (R4.17).
        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"UPDATE \"ApplicationPacks\" SET \"OwnerUserId\" = {ownerUserId} WHERE \"ApplicationId\" = {applicationId} AND \"OwnerUserId\" IS NULL",
            ct);
    }

    /// <summary>Admin, or owner, or (when reading) an officer whose partner matches — design C7.</summary>
    private static bool IsPermitted(string? ownerUserId, string? assignedPartnerId, ClaimsPrincipal principal, bool allowOfficer)
    {
        if (principal.IsAdmin()) return true;

        var userId = principal.UserId();
        if (!string.IsNullOrEmpty(userId) && string.Equals(ownerUserId, userId, StringComparison.Ordinal))
        {
            return true;
        }

        if (allowOfficer && principal.IsOfficer())
        {
            var partnerId = principal.PartnerId();
            return !string.IsNullOrWhiteSpace(partnerId)
                   && !string.IsNullOrWhiteSpace(assignedPartnerId)
                   && string.Equals(assignedPartnerId, partnerId, StringComparison.Ordinal);
        }

        return false;
    }
}
