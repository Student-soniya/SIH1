using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SchemeReady.Api.Options;
using SchemeReady.Api.Services;

namespace SchemeReady.Api.Controllers;

[ApiController]
[Route("api/digilocker")]
public sealed class DigiLockerController : ControllerBase
{
    private readonly IDigiLockerService _digiLocker;
    private readonly DigiLockerOptions _options;

    public DigiLockerController(IDigiLockerService digiLocker, IOptions<DigiLockerOptions> options)
    {
        _digiLocker = digiLocker;
        _options = options.Value;
    }

    [Authorize]
    [HttpGet("authorize")]
    public IActionResult AuthorizeUser()
    {
        var userId = User.FindFirst("sub")?.Value
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized(new { error = "A signed-in user is required." });

        try
        {
            var url = _digiLocker.CreateAuthorizationUrl(userId, out _);
            return Ok(new { authorizationUrl = url });
        }
        catch (InvalidOperationException ex)
        {
            return Problem(statusCode: 500, detail: ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpGet("callback")]
    [Produces("text/html")]
    public async Task<ContentResult> Callback([FromQuery] string? code, [FromQuery] string? state, [FromQuery] string? error, [FromQuery(Name = "error_description")] string? errorDescription, CancellationToken ct)
    {
        var frontendOrigin = string.IsNullOrWhiteSpace(_options.FrontendOrigin) ? "http://localhost:5173" : _options.FrontendOrigin.TrimEnd('/');
        var payload = new Dictionary<string, object?>
        {
            ["type"] = "SCHEMEREADY_DIGILOCKER_CALLBACK",
            ["status"] = "error"
        };

        try
        {
            if (!string.IsNullOrWhiteSpace(error))
            {
                payload["error"] = errorDescription ?? error;
            }
            else if (string.IsNullOrWhiteSpace(code) || string.IsNullOrWhiteSpace(state) || !_digiLocker.TryUnprotectState(state, out var authState))
            {
                payload["error"] = "The DigiLocker authorization state is invalid or expired.";
            }
            else
            {
                var result = await _digiLocker.ExchangeCodeAsync(code, authState, ct);
                payload["status"] = result.Documents.Count > 0 ? "verified" : "empty";
                payload["documents"] = result.Documents;
                payload["digiLockerId"] = result.Token.DigiLockerId;
                payload["name"] = result.Token.Name;
            }
        }
        catch (DigiLockerApiException ex)
        {
            payload["error"] = ex.Message;
        }
        catch (InvalidOperationException ex)
        {
            payload["error"] = ex.Message;
        }
        catch (Exception)
        {
            payload["error"] = "DigiLocker verification could not be completed.";
        }

        var serialized = JsonSerializer.Serialize(payload)
            .Replace("<", "\\u003c")
            .Replace(">", "\\u003e")
            .Replace("&", "\\u0026");
        var safeOrigin = JsonSerializer.Serialize(frontendOrigin);
        var html = $"<!doctype html><html><head><meta charset='utf-8'><title>SchemeReady DigiLocker</title></head><body style='font-family:system-ui;padding:32px;text-align:center'><h2>DigiLocker verification</h2><p>You can return to SchemeReady.</p><script>const targetOrigin={safeOrigin};window.opener?.postMessage({serialized},targetOrigin);window.close();</script></body></html>";
        return Content(html, "text/html");
    }
}
