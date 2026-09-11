using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Options;
using SchemeReady.Api.Models;
using SchemeReady.Api.Options;

namespace SchemeReady.Api.Services;

public interface IDigiLockerService
{
    string BuildAuthorizeUrl(string state);
    Task<DigiLockerTokenResponse> ExchangeCodeForTokenAsync(string code, CancellationToken ct = default);
    Task<DigiLockerTokenResponse> RefreshTokenAsync(string refreshToken, CancellationToken ct = default);
    Task<List<DigiLockerIssuedFile>> GetIssuedFilesAsync(string accessToken, CancellationToken ct = default);
    Task<(byte[] Content, string MimeType)> DownloadFileAsync(string accessToken, string fileUri, CancellationToken ct = default);
}

public class DigiLockerService : IDigiLockerService
{
    private readonly HttpClient _http;
    private readonly DigiLockerOptions _options;
    private readonly ILogger<DigiLockerService> _logger;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public DigiLockerService(HttpClient http, IOptions<DigiLockerOptions> options, ILogger<DigiLockerService> logger)
    {
        _http = http;
        _options = options.Value;
        _logger = logger;
        _http.BaseAddress ??= new Uri(_options.BaseUrl);
    }

    public string BuildAuthorizeUrl(string state)
    {
        var query = new Dictionary<string, string?>
        {
            ["response_type"] = "code", ["client_id"] = _options.ClientId,
            ["redirect_uri"] = _options.RedirectUri, ["state"] = state
        };
        var encoded = string.Join("&", query.Select(pair =>
            $"{Uri.EscapeDataString(pair.Key)}={Uri.EscapeDataString(pair.Value ?? string.Empty)}"));
        return $"{_options.BaseUrl}{_options.AuthorizePath}?{encoded}";
    }

    public Task<DigiLockerTokenResponse> ExchangeCodeForTokenAsync(string code, CancellationToken ct = default) =>
        PostTokenRequestAsync(new Dictionary<string, string>
        {
            ["grant_type"] = "authorization_code", ["code"] = code,
            ["client_id"] = _options.ClientId, ["client_secret"] = _options.ClientSecret,
            ["redirect_uri"] = _options.RedirectUri
        }, ct);

    public Task<DigiLockerTokenResponse> RefreshTokenAsync(string refreshToken, CancellationToken ct = default) =>
        PostTokenRequestAsync(new Dictionary<string, string>
        {
            ["grant_type"] = "refresh_token", ["refresh_token"] = refreshToken,
            ["client_id"] = _options.ClientId, ["client_secret"] = _options.ClientSecret
        }, ct);

    private async Task<DigiLockerTokenResponse> PostTokenRequestAsync(Dictionary<string, string> form, CancellationToken ct)
    {
        using var response = await _http.PostAsync(_options.TokenPath, new FormUrlEncodedContent(form), ct);
        var body = await response.Content.ReadAsStringAsync(ct);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("DigiLocker token request failed: {Status} {Body}", response.StatusCode, body);
            throw new DigiLockerApiException("Token request failed.", response.StatusCode, body);
        }
        return JsonSerializer.Deserialize<DigiLockerTokenResponse>(body, JsonOptions)
               ?? throw new DigiLockerApiException("Empty token response from DigiLocker.", response.StatusCode, body);
    }

    public async Task<List<DigiLockerIssuedFile>> GetIssuedFilesAsync(string accessToken, CancellationToken ct = default)
    {
        using var request = AuthorizedRequest(HttpMethod.Get, _options.IssuedFilesPath, accessToken);
        using var response = await _http.SendAsync(request, ct);
        var body = await response.Content.ReadAsStringAsync(ct);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("DigiLocker issued-files request failed: {Status} {Body}", response.StatusCode, body);
            throw new DigiLockerApiException("Issued-files request failed.", response.StatusCode, body);
        }
        return JsonSerializer.Deserialize<DigiLockerIssuedFilesResponse>(body, JsonOptions)?.Items ?? [];
    }

    public async Task<(byte[] Content, string MimeType)> DownloadFileAsync(string accessToken, string fileUri, CancellationToken ct = default)
    {
        using var request = AuthorizedRequest(HttpMethod.Get, $"{_options.FileDownloadPath}/{Uri.EscapeDataString(fileUri)}", accessToken);
        using var response = await _http.SendAsync(request, ct);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(ct);
            _logger.LogError("DigiLocker file download failed: {Status} {Body}", response.StatusCode, body);
            throw new DigiLockerApiException("File download failed.", response.StatusCode, body);
        }
        return (await response.Content.ReadAsByteArrayAsync(ct), response.Content.Headers.ContentType?.MediaType ?? "application/octet-stream");
    }

    private static HttpRequestMessage AuthorizedRequest(HttpMethod method, string path, string accessToken)
    {
        var request = new HttpRequestMessage(method, path);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        return request;
    }
}

public class DigiLockerApiException(string message, System.Net.HttpStatusCode statusCode, string responseBody) : Exception(message)
{
    public System.Net.HttpStatusCode StatusCode { get; } = statusCode;
    public string ResponseBody { get; } = responseBody;
}
