using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using SchemeReady.Api.Models;
using SchemeReady.Api.Options;

namespace SchemeReady.Api.Services;

public interface IDigiLockerService
{
    string CreateAuthorizationUrl(string userId, out string state);
    Task<(DigiLockerTokenResponse Token, List<DigiLockerIssuedDocument> Documents)> ExchangeCodeAsync(string code, DigiLockerAuthorizationState state, CancellationToken ct = default);
    bool TryUnprotectState(string protectedState, out DigiLockerAuthorizationState state);
}

public sealed class DigiLockerService : IDigiLockerService
{
    private const string AuthorizePath = "/public/oauth2/1/authorize";
    private const string TokenPath = "/public/oauth2/1/token";
    private const string IssuedDocumentsPath = "/public/oauth2/2/files/issued";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _http;
    private readonly DigiLockerOptions _options;
    private readonly IDataProtector _protector;
    private readonly ILogger<DigiLockerService> _logger;

    public DigiLockerService(HttpClient http, IOptions<DigiLockerOptions> options, IDataProtectionProvider protectionProvider, ILogger<DigiLockerService> logger)
    {
        _http = http;
        _options = options.Value;
        _protector = protectionProvider.CreateProtector("SchemeReady.DigiLocker.OAuth.v1");
        _logger = logger;
        _http.BaseAddress ??= new Uri(_options.BaseUrl);
    }

    public string CreateAuthorizationUrl(string userId, out string state)
    {
        EnsureConfigured();

        var verifierBytes = RandomNumberGenerator.GetBytes(32);
        var codeVerifier = WebEncoders.Base64UrlEncode(verifierBytes);
        var challengeBytes = SHA256.HashData(Encoding.UTF8.GetBytes(codeVerifier));
        var codeChallenge = WebEncoders.Base64UrlEncode(challengeBytes);
        var expiresAt = DateTimeOffset.UtcNow.AddMinutes(10).ToUnixTimeSeconds();

        state = _protector.Protect(JsonSerializer.Serialize(new DigiLockerAuthorizationState(userId, codeVerifier, expiresAt), JsonOptions));

        var query = new Dictionary<string, string?>
        {
            ["response_type"] = "code",
            ["client_id"] = _options.ClientId,
            ["redirect_uri"] = _options.RedirectUri,
            ["state"] = state,
            ["code_challenge"] = codeChallenge,
            ["code_challenge_method"] = "S256",
            ["purpose"] = string.IsNullOrWhiteSpace(_options.Purpose) ? "verification" : _options.Purpose
        };

        if (!string.IsNullOrWhiteSpace(_options.RequestedDocumentTypes))
            query["req_doctype"] = _options.RequestedDocumentTypes;

        return QueryHelpers.AddQueryString(new Uri(_http.BaseAddress!, AuthorizePath).ToString(), query);
    }

    public bool TryUnprotectState(string protectedState, out DigiLockerAuthorizationState state)
    {
        state = default!;
        try
        {
            var json = _protector.Unprotect(protectedState);
            var parsed = JsonSerializer.Deserialize<DigiLockerAuthorizationState>(json, JsonOptions);
            if (parsed is null || string.IsNullOrWhiteSpace(parsed.UserId) || string.IsNullOrWhiteSpace(parsed.CodeVerifier)) return false;
            if (parsed.ExpiresAtUnix < DateTimeOffset.UtcNow.ToUnixTimeSeconds()) return false;
            state = parsed;
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Invalid DigiLocker OAuth state received.");
            return false;
        }
    }

    public async Task<(DigiLockerTokenResponse Token, List<DigiLockerIssuedDocument> Documents)> ExchangeCodeAsync(string code, DigiLockerAuthorizationState state, CancellationToken ct = default)
    {
        EnsureConfigured();

        using var tokenRequest = new HttpRequestMessage(HttpMethod.Post, TokenPath)
        {
            Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["code"] = code,
                ["grant_type"] = "authorization_code",
                ["client_id"] = _options.ClientId,
                ["client_secret"] = _options.ClientSecret,
                ["redirect_uri"] = _options.RedirectUri,
                ["code_verifier"] = state.CodeVerifier
            })
        };
        tokenRequest.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");

        using var tokenResponse = await _http.SendAsync(tokenRequest, ct);
        var tokenBody = await tokenResponse.Content.ReadAsStringAsync(ct);
        if (!tokenResponse.IsSuccessStatusCode)
            throw new DigiLockerApiException("DigiLocker authorization failed.", tokenResponse.StatusCode, tokenBody);

        var token = JsonSerializer.Deserialize<DigiLockerTokenResponse>(tokenBody, JsonOptions)
                    ?? throw new DigiLockerApiException("DigiLocker returned an empty token response.", tokenResponse.StatusCode, tokenBody);

        if (string.IsNullOrWhiteSpace(token.AccessToken))
            throw new DigiLockerApiException("DigiLocker did not return an access token.", tokenResponse.StatusCode, tokenBody);

        using var docsRequest = new HttpRequestMessage(HttpMethod.Get, IssuedDocumentsPath);
        docsRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token.AccessToken);
        using var docsResponse = await _http.SendAsync(docsRequest, ct);
        var docsBody = await docsResponse.Content.ReadAsStringAsync(ct);
        if (!docsResponse.IsSuccessStatusCode)
            throw new DigiLockerApiException("DigiLocker issued-document retrieval failed.", docsResponse.StatusCode, docsBody);

        var docs = JsonSerializer.Deserialize<DigiLockerIssuedDocumentsResponse>(docsBody, JsonOptions)
                   ?? new DigiLockerIssuedDocumentsResponse();

        return (token, docs.Items ?? []);
    }

    private void EnsureConfigured()
    {
        if (string.IsNullOrWhiteSpace(_options.ClientId) || string.IsNullOrWhiteSpace(_options.ClientSecret))
            throw new InvalidOperationException("DigiLocker is not configured. Set DigiLocker:ClientId and DigiLocker:ClientSecret on the backend.");
        if (string.IsNullOrWhiteSpace(_options.RedirectUri))
            throw new InvalidOperationException("DigiLocker:RedirectUri is required.");
    }
}

public sealed class DigiLockerApiException(string message, System.Net.HttpStatusCode statusCode, string responseBody) : Exception(message)
{
    public System.Net.HttpStatusCode StatusCode { get; } = statusCode;
    public string ResponseBody { get; } = responseBody;
}
