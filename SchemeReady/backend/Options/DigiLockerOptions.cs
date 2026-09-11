namespace SchemeReady.Api.Options;

/// <summary>Configuration for the DigiLocker OAuth2 and document APIs.</summary>
public class DigiLockerOptions
{
    public const string SectionName = "DigiLocker";

    // Set through user-secrets, environment variables, or a secret store. Never commit these.
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string RedirectUri { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://digilocker.meripehchaan.gov.in";
    public string AuthorizePath { get; set; } = "/public/oauth2/1/authorize";
    public string TokenPath { get; set; } = "/public/oauth2/1/token";
    public string IssuedFilesPath { get; set; } = "/public/oauth2/2/files/issued";
    public string FileDownloadPath { get; set; } = "/public/oauth2/1/file";
    public string UserInfoPath { get; set; } = "/public/oauth2/2/user";
}
