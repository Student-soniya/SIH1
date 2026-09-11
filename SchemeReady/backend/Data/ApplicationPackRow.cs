namespace SchemeReady.Api.Data;

/// <summary>
/// Storage shape for an <see cref="Models.ApplicationPack"/>: promoted header columns for
/// querying and authorisation, plus one <c>jsonb</c> column holding the whole dossier
/// (<c>Profile</c>, <c>SelectedScheme</c>, <c>EligibilityReasons</c>,
/// <c>DocumentChecklist</c>, <c>ProjectReport</c>, <c>EmiPlan</c>, <c>NearestPartner</c>,
/// <c>NextSteps</c>, <c>Disclaimer</c>).
///
/// This type is never serialised onto a response. <c>EfSchemeRepository</c> is the only
/// code that sees it, and it converts to and from <see cref="Models.ApplicationPack"/> at
/// the seam — which is why the API response schema is untouched (R1.4).
/// </summary>
public class ApplicationPackRow
{
    public string ApplicationId { get; set; } = string.Empty;

    public DateTime GeneratedDate { get; set; }

    /// <summary>Authenticated user identifier of the requester that generated the pack
    /// (R4.17). Null for packs created before authentication ships in Phase C.</summary>
    public string? OwnerUserId { get; set; }

    /// <summary>Routed <c>nearestPartner.Id</c>, used for officer access (R4.18).</summary>
    public string? AssignedPartnerId { get; set; }

    public string SelectedSchemeId { get; set; } = string.Empty;

    public string TrackingStatus { get; set; } = string.Empty;

    public string HandoffReferenceNumber { get; set; } = string.Empty;

    /// <summary>Promoted from <c>Profile.BusinessType</c> for the admin category aggregate.</summary>
    public string ApplicantBusinessType { get; set; } = string.Empty;

    /// <summary>Promoted from <c>Profile.Location</c> for the admin district aggregate.</summary>
    public string District { get; set; } = string.Empty;

    /// <summary>Promoted from the dossier's document checklist: the titles of the mandatory
    /// items still missing. Backs the admin <c>CommonMissingDocuments</c> aggregate.</summary>
    public List<string> MissingDocuments { get; set; } = new();

    /// <summary>The complete dossier, serialised. Column type <c>jsonb</c>.</summary>
    public string FullDossierJson { get; set; } = "{}";
}
