namespace SchemeReady.Api.Options;

/// <summary>Configuration for the official DigiLocker Requester integration.</summary>
public sealed class DigiLockerOptions
{
    public const string SectionName = "DigiLocker";

    public string BaseUrl { get; set; } = "https://api.digitallocker.gov.in";
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string RedirectUri { get; set; } = "http://localhost:5242/api/digilocker/callback";
    public string FrontendOrigin { get; set; } = "http://localhost:5173";
    public string Purpose { get; set; } = "verification";
    public string RequestedDocumentTypes { get; set; } = string.Empty;
}
