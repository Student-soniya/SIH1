using Microsoft.AspNetCore.Mvc;
using SchemeReady.Api.Services;

namespace SchemeReady.Api.Controllers;

[ApiController]
[Route("api/digilocker")]
public class DigiLockerController : ControllerBase
{
    private readonly IDigiLockerService _digiLocker;

    // Development-only callback state store. Replace with IMemoryCache, Redis, or persisted
    // state before running multiple API instances.
    private static readonly Dictionary<string, string> PendingStates = new();

    public DigiLockerController(IDigiLockerService digiLocker) => _digiLocker = digiLocker;

    /// <summary>Returns the consent URL for a beneficiary.</summary>
    [HttpGet("authorize")]
    public IActionResult Authorize([FromQuery] int beneficiaryId)
    {
        var state = Guid.NewGuid().ToString("N");
        PendingStates[state] = beneficiaryId.ToString();
        return Ok(new { authorizeUrl = _digiLocker.BuildAuthorizeUrl(state), state });
    }

    /// <summary>OAuth callback invoked by DigiLocker after consent.</summary>
    [HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(code) || !PendingStates.TryGetValue(state, out var beneficiaryId))
            return BadRequest(new { error = "Invalid or expired state/code." });

        PendingStates.Remove(state);
        try
        {
            var token = await _digiLocker.ExchangeCodeForTokenAsync(code, ct);
            // Persist encrypted tokens against beneficiaryId before enabling production use.
            return Ok(new { linked = true, beneficiaryId, digiLockerId = token.DigiLockerId, name = token.Name });
        }
        catch (DigiLockerApiException ex)
        {
            return StatusCode((int)ex.StatusCode, new { error = ex.Message });
        }
    }

    [HttpGet("documents")]
    public async Task<IActionResult> GetDocuments(
        [FromHeader(Name = "X-DigiLocker-AccessToken")] string accessToken, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
            return Unauthorized(new { error = "Missing DigiLocker access token." });
        try
        {
            return Ok(await _digiLocker.GetIssuedFilesAsync(accessToken, ct));
        }
        catch (DigiLockerApiException ex)
        {
            return StatusCode((int)ex.StatusCode, new { error = ex.Message });
        }
    }

    [HttpGet("documents/{*fileUri}/download")]
    public async Task<IActionResult> DownloadDocument(
        string fileUri,
        [FromHeader(Name = "X-DigiLocker-AccessToken")] string accessToken,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
            return Unauthorized(new { error = "Missing DigiLocker access token." });
        try
        {
            var (content, mime) = await _digiLocker.DownloadFileAsync(accessToken, fileUri, ct);
            return File(content, mime);
        }
        catch (DigiLockerApiException ex)
        {
            return StatusCode((int)ex.StatusCode, new { error = ex.Message });
        }
    }
}
