using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchemeReady.Api.Auth;
using SchemeReady.Api.Services;

namespace SchemeReady.Api.Controllers;

/// <summary>
/// The document endpoints of design C8. Every action requires an authenticated session
/// (R6.13), and every negative authorisation outcome is <c>404</c> with an empty body — the
/// caller cannot distinguish "no such document" from "not yours" (R6.16).
/// </summary>
[ApiController]
[Route("api/documents")]
[Authorize(Roles = RoleNames.AnySignedIn)]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documents;
    private readonly IApplicationPackAccessService _access;

    public DocumentsController(IDocumentService documents, IApplicationPackAccessService access)
    {
        _documents = documents;
        _access = access;
    }

    /// <summary>
    /// R6.1–R6.10. <c>201</c> carries the identifier, the key and the readiness score
    /// recalculated by the unmodified readiness service over the now-live document set.
    /// </summary>
    [HttpPost]
    [RequestSizeLimit(6 * 1024 * 1024)]                  // a little above 5 MiB, so the length check owns the boundary
    public async Task<IActionResult> Upload(
        [FromForm] string? docKey,
        [FromForm] string? applicationPackId,
        CancellationToken ct)
    {
        var userId = User.UserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        // Read the file parts from the form rather than binding one IFormFile, so "more than
        // one file part" is a nameable 400 instead of a silently ignored extra part (R6.2).
        var files = Request.HasFormContentType ? Request.Form.Files : null;

        if (files is null || files.Count == 0)
        {
            return BadRequest(new { error = "file: exactly one file part is required." });
        }

        if (files.Count > 1)
        {
            return BadRequest(new { error = $"file: exactly one file part is required; received {files.Count}." });
        }

        var outcome = await _documents.UploadAsync(files[0], docKey, userId, applicationPackId, SourceIp(), ct);

        if (!outcome.Succeeded)
        {
            return BadRequest(new { error = outcome.Error });
        }

        var doc = outcome.Document!;
        return StatusCode(StatusCodes.Status201Created, new
        {
            id = doc.Id,
            documentKey = doc.DocumentKey,
            originalFileName = doc.OriginalFileName,
            byteLength = doc.ByteLength,
            uploadedAt = doc.UploadedAt,
            readinessScore = outcome.ReadinessScore
        });
    }

    /// <summary>
    /// R6.12, R6.14–R6.17. The route parameter is the database identifier and nothing else: no
    /// parameter here conveys a filename or a path, so there is no traversal surface.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Download(Guid id, CancellationToken ct)
    {
        var userId = User.UserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var doc = await _documents.FindAsync(id, ct);
        if (doc is null) return NotFound();

        if (!await _access.CanReadDocumentAsync(doc, User, ct)) return NotFound();

        var path = _documents.PathFor(doc);

        // System.IO.File spelled in full: inside a ControllerBase, the unqualified `File` is the
        // FileStreamResult helper used three lines down.
        if (!System.IO.File.Exists(path)) return NotFound();

        await _documents.WriteRetrievalAuditAsync(doc, userId, SourceIp(), ct);

        Response.Headers["X-Content-Type-Options"] = "nosniff";
        Response.Headers["Content-Disposition"] =
            $"attachment; filename=\"{DocumentStorage.HeaderSafeFileName(doc.OriginalFileName)}\"";

        var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read);
        return File(stream, doc.ContentType);   // ControllerBase.File — streams and disposes
    }

    /// <summary>The caller's own live documents. Metadata only — never a path or a stored name.</summary>
    [HttpGet("mine")]
    public async Task<IActionResult> Mine(CancellationToken ct)
    {
        var userId = User.UserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var docs = await _documents.ListLiveAsync(userId, ct);

        Response.Headers["X-Content-Type-Options"] = "nosniff";

        return Ok(docs.Select(d => new
        {
            id = d.Id,
            documentKey = d.DocumentKey,
            originalFileName = d.OriginalFileName,
            contentType = d.ContentType,
            byteLength = d.ByteLength,
            uploadedAt = d.UploadedAt
        }));
    }

    /// <summary>R6.18 — bytes removed, row marked deleted, 204. Owner (or Admin) only.</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var userId = User.UserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var doc = await _documents.FindAsync(id, ct);
        if (doc is null) return NotFound();

        if (!_access.CanDeleteDocument(doc, User)) return NotFound();     // never 403 here (R6.16)

        await _documents.DeleteAsync(doc, userId, SourceIp(), ct);
        return NoContent();
    }

    private string SourceIp() => HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? string.Empty;
}
