namespace SchemeReady.Api.Options;

/// <summary>Configuration for Decentro's DigiLocker APIs.</summary>
public sealed class DecentroOptions
{
    public const string SectionName = "Decentro";

    public string BaseUrl { get; set; } = "https://in.staging.decentro.tech";
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;

    // Keep this for Decentro KYC/onboarding APIs that explicitly require it. The documented
    // DigiLocker SSO endpoints use client_id and client_secret only.
    public string ModuleSecret { get; set; } = string.Empty;
    public string RedirectUri { get; set; } = string.Empty;
    public string ConsentPurpose { get; set; } = "To retrieve DigiLocker documents for scheme application verification.";
}
