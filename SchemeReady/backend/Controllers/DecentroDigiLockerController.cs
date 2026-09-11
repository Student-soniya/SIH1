using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchemeReady.Api.Models;
using SchemeReady.Api.Services;

namespace SchemeReady.Api.Controllers;

[ApiController]
[Route("api/decentro/digilocker")]
public sealed class DecentroDigiLockerController : ControllerBase
{
    private readonly IDecentroDigiLockerService _decentro;

    public DecentroDigiLockerController(IDecentroDigiLockerService decentro) => _decentro = decentro;

    [Authorize]
    [HttpPost("session/me")]
    public async Task<IActionResult> StartUserSession(CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized(new { error = "A signed-in user is required." });
        try
        {
            var response = await _decentro.StartSessionAsync(Reference("session", userId), ct);
            if (!string.Equals(response.Status, "SUCCESS", StringComparison.OrdinalIgnoreCase) || string.IsNullOrWhiteSpace(response.Data?.AuthorizationUrl)) return BadRequest(new { error = response.Message ?? "Decentro did not create a DigiLocker session.", response.ResponseCode });
            return Ok(new { decentroTransactionId = response.DecentroTransactionId, authorizationUrl = response.Data.AuthorizationUrl });
        }
        catch (DecentroApiException ex) { return StatusCode((int)ex.StatusCode, new { error = ex.Message }); }
        catch (InvalidOperationException ex) { return Problem(statusCode: 500, detail: ex.Message); }
    }

    [HttpPost("session")]
    public async Task<IActionResult> StartSession([FromBody] StartDecentroDigiLockerSessionRequest request, CancellationToken ct)
    {
        if (request.BeneficiaryId <= 0) return BadRequest(new { error = "beneficiaryId must be a positive integer." });
        try
        {
            var response = await _decentro.StartSessionAsync(Reference("session", request.BeneficiaryId.ToString()), ct);
            if (!string.Equals(response.Status, "SUCCESS", StringComparison.OrdinalIgnoreCase) || string.IsNullOrWhiteSpace(response.Data?.AuthorizationUrl)) return BadRequest(new { error = response.Message ?? "Decentro did not create a DigiLocker session.", response.ResponseCode });
            return Ok(new { decentroTransactionId = response.DecentroTransactionId, authorizationUrl = response.Data.AuthorizationUrl });
        }
        catch (DecentroApiException ex) { return StatusCode((int)ex.StatusCode, new { error = ex.Message }); }
        catch (InvalidOperationException ex) { return Problem(statusCode: 500, detail: ex.Message); }
    }

    [Authorize]
    [HttpPost("documents")]
    public async Task<IActionResult> GetDocuments([FromBody] DecentroDocumentRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.InitialDecentroTransactionId)) return BadRequest(new { error = "initialDecentroTransactionId is required." });
        try { return Ok(await _decentro.GetIssuedFilesAsync(request.InitialDecentroTransactionId, Reference("files", request.InitialDecentroTransactionId), ct)); }
        catch (DecentroApiException ex) { return StatusCode((int)ex.StatusCode, new { error = ex.Message }); }
        catch (InvalidOperationException ex) { return Problem(statusCode: 500, detail: ex.Message); }
    }

    [Authorize]
    [HttpPost("documents/download")]
    public async Task<IActionResult> DownloadDocument([FromBody] DecentroDocumentRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.InitialDecentroTransactionId) || string.IsNullOrWhiteSpace(request.FileUrn)) return BadRequest(new { error = "initialDecentroTransactionId and fileUrn are required." });
        try { return Ok(await _decentro.DownloadFileAsync(request.InitialDecentroTransactionId, request.FileUrn, Reference("download", request.InitialDecentroTransactionId), ct)); }
        catch (DecentroApiException ex) { return StatusCode((int)ex.StatusCode, new { error = ex.Message }); }
        catch (InvalidOperationException ex) { return Problem(statusCode: 500, detail: ex.Message); }
    }

    [AllowAnonymous]
    [HttpGet("callback")]
    [Produces("text/html")]
    public ContentResult Callback()
    {
        var transactionId = Request.Query["decentroTxnId"].FirstOrDefault() ?? Request.Query["decentro_transaction_id"].FirstOrDefault() ?? Request.Query["transactionId"].FirstOrDefault() ?? Request.Query["txnId"].FirstOrDefault();
        var status = Request.Query["status"].FirstOrDefault();
        var error = Request.Query["error"].FirstOrDefault();
        var payload = JsonSerializer.Serialize(new { type = "SCHEMEREADY_DIGILOCKER_CALLBACK", transactionId, status, error });
        var safePayload = payload.Replace("<", "\\u003c").Replace(">", "\\u003e").Replace("&", "\\u0026");
        var html = $"<!doctype html><html><head><meta charset='utf-8'><title>SchemeReady DigiLocker</title></head><body style='font-family:system-ui;padding:32px;text-align:center'><h2>DigiLocker verification</h2><p>You can return to SchemeReady.</p><script>window.opener?.postMessage({safePayload}, '*'); window.close();</script></body></html>";
        return Content(html, "text/html");
    }

    private static string Reference(string action, string subject) => $"schemeready-{action}-{subject}-{Guid.NewGuid():N}";
}
