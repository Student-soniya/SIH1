using System.Text.Json;
using System.Text.Json.Serialization;

namespace SchemeReady.Api.Models;

public sealed class DecentroApiResponse<T>
{
    [JsonPropertyName("decentroTxnId")] public string? DecentroTransactionId { get; set; }
    [JsonPropertyName("status")] public string? Status { get; set; }
    [JsonPropertyName("responseCode")] public string? ResponseCode { get; set; }
    [JsonPropertyName("message")] public string? Message { get; set; }
    [JsonPropertyName("responseKey")] public string? ResponseKey { get; set; }
    [JsonPropertyName("data")] public T? Data { get; set; }
}

public sealed class DecentroSessionData
{
    [JsonPropertyName("authorizationUrl")] public string? AuthorizationUrl { get; set; }
}

public sealed class DecentroIssuedFile
{
    [JsonPropertyName("name")] public string? Name { get; set; }
    [JsonPropertyName("type")] public string? Type { get; set; }
    [JsonPropertyName("size")] public JsonElement Size { get; set; }
    [JsonPropertyName("date")] public string? Date { get; set; }
    [JsonPropertyName("mime")] public JsonElement Mime { get; set; }
    [JsonPropertyName("uri")] public string? Uri { get; set; }
    [JsonPropertyName("doctype")] public string? DocumentType { get; set; }
    [JsonPropertyName("description")] public string? Description { get; set; }
    [JsonPropertyName("issuerid")] public string? IssuerId { get; set; }
    [JsonPropertyName("issuer")] public string? Issuer { get; set; }
}

public sealed record StartDecentroDigiLockerSessionRequest(int BeneficiaryId);
public sealed record DecentroDocumentRequest(string InitialDecentroTransactionId, string? FileUrn = null);
