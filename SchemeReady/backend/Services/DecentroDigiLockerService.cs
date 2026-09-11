using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using SchemeReady.Api.Models;
using SchemeReady.Api.Options;

namespace SchemeReady.Api.Services;

public interface IDecentroDigiLockerService
{
    Task<DecentroApiResponse<DecentroSessionData>> StartSessionAsync(string referenceId, CancellationToken ct = default);
    Task<DecentroApiResponse<List<DecentroIssuedFile>>> GetIssuedFilesAsync(string initialTransactionId, string referenceId, CancellationToken ct = default);
    Task<DecentroApiResponse<JsonElement>> DownloadFileAsync(string initialTransactionId, string fileUrn, string referenceId, CancellationToken ct = default);
}

public sealed class DecentroDigiLockerService : IDecentroDigiLockerService
{
    private const string SessionPath = "/v2/kyc/sso/digilocker/session";
    private const string IssuedFilesPath = "/v2/kyc/digilocker/issued_files";
    private const string DownloadPath = "/v2/kyc/digilocker/file";
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly HttpClient _http;
    private readonly DecentroOptions _options;
    private readonly ILogger<DecentroDigiLockerService> _logger;

    public DecentroDigiLockerService(HttpClient http, IOptions<DecentroOptions> options, ILogger<DecentroDigiLockerService> logger)
    {
        _http = http;
        _options = options.Value;
        _logger = logger;
        _http.BaseAddress ??= new Uri(_options.BaseUrl);
    }

    public Task<DecentroApiResponse<DecentroSessionData>> StartSessionAsync(string referenceId, CancellationToken ct = default) =>
        SendAsync<DecentroSessionData>(SessionPath, new
        {
            consent = true,
            consent_purpose = _options.ConsentPurpose,
            reference_id = referenceId,
            redirect_url = _options.RedirectUri
        }, ct);

    public Task<DecentroApiResponse<List<DecentroIssuedFile>>> GetIssuedFilesAsync(string initialTransactionId, string referenceId, CancellationToken ct = default) =>
        SendAsync<List<DecentroIssuedFile>>(IssuedFilesPath, new
        {
            initial_decentro_transaction_id = initialTransactionId,
            consent = true,
            consent_purpose = _options.ConsentPurpose,
            reference_id = referenceId
        }, ct);

    public Task<DecentroApiResponse<JsonElement>> DownloadFileAsync(string initialTransactionId, string fileUrn, string referenceId, CancellationToken ct = default) =>
        SendAsync<JsonElement>(DownloadPath, new
        {
            initial_decentro_transaction_id = initialTransactionId,
            file_urn = fileUrn,
            consent = true,
            consent_purpose = _options.ConsentPurpose,
            reference_id = referenceId
        }, ct);

    private async Task<DecentroApiResponse<T>> SendAsync<T>(string path, object body, CancellationToken ct)
    {
        EnsureConfigured();
        using var request = new HttpRequestMessage(HttpMethod.Post, path) { Content = JsonContent.Create(body) };
        request.Headers.Add("client_id", _options.ClientId);
        request.Headers.Add("client_secret", _options.ClientSecret);

        using var response = await _http.SendAsync(request, ct);
        var responseBody = await response.Content.ReadAsStringAsync(ct);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Decentro DigiLocker request failed with {Status}.", response.StatusCode);
            throw new DecentroApiException("Decentro DigiLocker request failed.", response.StatusCode, responseBody);
        }

        return JsonSerializer.Deserialize<DecentroApiResponse<T>>(responseBody, JsonOptions)
               ?? throw new DecentroApiException("Empty response from Decentro.", response.StatusCode, responseBody);
    }

    private void EnsureConfigured()
    {
        if (string.IsNullOrWhiteSpace(_options.ClientId) || string.IsNullOrWhiteSpace(_options.ClientSecret))
            throw new InvalidOperationException("Missing Decentro:ClientId or Decentro:ClientSecret configuration.");
        if (string.IsNullOrWhiteSpace(_options.RedirectUri))
            throw new InvalidOperationException("Missing Decentro:RedirectUri configuration.");
    }
}

public sealed class DecentroApiException(string message, System.Net.HttpStatusCode statusCode, string responseBody) : Exception(message)
{
    public System.Net.HttpStatusCode StatusCode { get; } = statusCode;
    public string ResponseBody { get; } = responseBody;
}
