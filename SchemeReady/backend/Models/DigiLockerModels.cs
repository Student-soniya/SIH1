using System.Text.Json.Serialization;

namespace SchemeReady.Api.Models;

public class DigiLockerTokenResponse
{
    [JsonPropertyName("access_token")] public string AccessToken { get; set; } = string.Empty;
    [JsonPropertyName("token_type")] public string TokenType { get; set; } = string.Empty;
    [JsonPropertyName("expires_in")] public int ExpiresIn { get; set; }
    [JsonPropertyName("refresh_token")] public string? RefreshToken { get; set; }
    [JsonPropertyName("digilockerid")] public string? DigiLockerId { get; set; }
    [JsonPropertyName("eaadhaar")] public string? EAadhaar { get; set; }
    [JsonPropertyName("name")] public string? Name { get; set; }
}

public class DigiLockerIssuedFile
{
    [JsonPropertyName("name")] public string Name { get; set; } = string.Empty;
    [JsonPropertyName("type")] public string Type { get; set; } = string.Empty;
    [JsonPropertyName("uri")] public string Uri { get; set; } = string.Empty;
    [JsonPropertyName("date")] public string? Date { get; set; }
    [JsonPropertyName("size")] public long? Size { get; set; }
    [JsonPropertyName("mime")] public string? Mime { get; set; }
    [JsonPropertyName("parent")] public string? Parent { get; set; }
    [JsonPropertyName("doctype")] public string? DocType { get; set; }
    [JsonPropertyName("issuerid")] public string? IssuerId { get; set; }
    [JsonPropertyName("issuer")] public string? Issuer { get; set; }
}

public class DigiLockerIssuedFilesResponse
{
    [JsonPropertyName("items")] public List<DigiLockerIssuedFile> Items { get; set; } = new();
}

/// <summary>Data model for an encrypted, persisted DigiLocker account link.</summary>
public class DigiLockerLinkedAccount
{
    public int Id { get; set; }
    public int BeneficiaryId { get; set; }
    public string DigiLockerId { get; set; } = string.Empty;
    public string AccessTokenEncrypted { get; set; } = string.Empty;
    public string? RefreshTokenEncrypted { get; set; }
    public DateTime TokenExpiresAtUtc { get; set; }
    public DateTime LinkedAtUtc { get; set; } = DateTime.UtcNow;
}
