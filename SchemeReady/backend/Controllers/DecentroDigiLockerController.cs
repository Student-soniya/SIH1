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

    /// <summary>Creates a Decentro DigiLocker session and returns its authorization URL.</summary>
    [HttpPost("session")]
    public async Task<IActionResult> StartSession([FromBody] StartDecentroDigiLockerSessionRequest request, CancellationToken ct)
    {
        if (request.BeneficiaryId <= 0)
            return BadRequest(new { error = "beneficiaryId must be a positive integer." });

        try
        {
            var response = await _decentro.StartSessionAsync(Reference("session", request.BeneficiaryId.ToString()), ct);
            if (!string.Equals(response.Status, "SUCCESS", StringComparison.OrdinalIgnoreCase) || string.IsNullOrWhiteSpace(response.Data?.AuthorizationUrl))
                return BadRequest(new { error = response.Message ?? "Decentro did not create a DigiLocker session.", response.ResponseCode });

            return Ok(new { decentroTransactionId = response.DecentroTransactionId, authorizationUrl = response.Data.AuthorizationUrl });
        }
        catch (DecentroApiException ex) { return StatusCode((int)ex.StatusCode, new { error = ex.Message }); }
        catch (InvalidOperationException ex) { return Problem(statusCode: 500, detail: ex.Message); }
    }

    [HttpPost("documents")]
    public async Task<IActionResult> GetDocuments([FromBody] DecentroDocumentRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.InitialDecentroTransactionId))
            return BadRequest(new { error = "initialDecentroTransactionId is required." });
        try
        {
            var response = await _decentro.GetIssuedFilesAsync(request.InitialDecentroTransactionId, Reference("files", request.InitialDecentroTransactionId), ct);
            return Ok(response);
        }
        catch (DecentroApiException ex) { return StatusCode((int)ex.StatusCode, new { error = ex.Message }); }
        catch (InvalidOperationException ex) { return Problem(statusCode: 500, detail: ex.Message); }
    }

    [HttpPost("documents/download")]
    public async Task<IActionResult> DownloadDocument([FromBody] DecentroDocumentRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.InitialDecentroTransactionId) || string.IsNullOrWhiteSpace(request.FileUrn))
            return BadRequest(new { error = "initialDecentroTransactionId and fileUrn are required." });
        try
        {
            var response = await _decentro.DownloadFileAsync(request.InitialDecentroTransactionId, request.FileUrn, Reference("download", request.InitialDecentroTransactionId), ct);
            return Ok(response);
        }
        catch (DecentroApiException ex) { return StatusCode((int)ex.StatusCode, new { error = ex.Message }); }
        catch (InvalidOperationException ex) { return Problem(statusCode: 500, detail: ex.Message); }
    }

    // Decentro requires a unique reference ID for every API request.
    private static string Reference(string action, string subject) => $"schemeready-{action}-{subject}-{Guid.NewGuid():N}";
}
