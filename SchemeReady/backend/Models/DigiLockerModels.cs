using System.Text.Json.Serialization;

namespace SchemeReady.Api.Models;

public sealed record DigiLockerAuthorizationState(string UserId, string CodeVerifier, long ExpiresAtUnix);

public sealed class DigiLockerTokenResponse
{
    [JsonPropertyName("access_token")] public string? AccessToken { get; set; }
    [JsonPropertyName("expires_in")] public int ExpiresIn { get; set; }
    [JsonPropertyName("token_type")] public string? TokenType { get; set; }
    [JsonPropertyName("scope")] public string? Scope { get; set; }
    [JsonPropertyName("refresh_token")] public string? RefreshToken { get; set; }
    [JsonPropertyName("digilockerid")] public string? DigiLockerId { get; set; }
    [JsonPropertyName("name")] public string? Name { get; set; }
}

public sealed class DigiLockerIssuedDocumentsResponse
{
    [JsonPropertyName("items")] public List<DigiLockerIssuedDocument> Items { get; set; } = [];
}

public sealed class DigiLockerIssuedDocument
{
    [JsonPropertyName("name")] public string? Name { get; set; }
    [JsonPropertyName("type")] public string? Type { get; set; }
    [JsonPropertyName("size")] public object? Size { get; set; }
    [JsonPropertyName("date")] public string? Date { get; set; }
    [JsonPropertyName("mime")] public object? Mime { get; set; }
    [JsonPropertyName("uri")] public string? Uri { get; set; }
    [JsonPropertyName("doctype")] public string? DocumentType { get; set; }
    [JsonPropertyName("description")] public string? Description { get; set; }
    [JsonPropertyName("issuerid")] public string? IssuerId { get; set; }
    [JsonPropertyName("issuer")] public string? Issuer { get; set; }
}
