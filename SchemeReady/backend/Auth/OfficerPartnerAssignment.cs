namespace SchemeReady.Api.Auth;

/// <summary>
/// Associates an Officer principal with the ChannelPartner whose dossiers they may read.
/// Projected into the <c>partner_id</c> access-token claim at issue time so authorisation
/// needs no extra query (R4.18).
///
/// Phase A declares only the persistence shape so the initial migration can create the
/// table (R1.6). The claim projection and access checks arrive in Phase C (tasks 9.3, 10.2).
/// </summary>
public class OfficerPartnerAssignment
{
    /// <summary>Primary key — one assignment per officer.</summary>
    public string UserId { get; set; } = string.Empty;

    public string PartnerId { get; set; } = string.Empty;

    public DateTime AssignedAt { get; set; }
}
