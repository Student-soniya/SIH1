using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SchemeReady.Api.Data;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Services;

/// <summary>Outcome of an upload attempt: either a stored row plus a recalculated score, or the
/// message naming the first failed check.</summary>
public record UploadOutcome(StoredDocument? Document, int ReadinessScore, string? Error)
{
    public bool Succeeded => Document is not null;

    public static UploadOutcome Rejected(string error) => new(null, 0, error);
}

public interface IDocumentService
{
    Task<UploadOutcome> UploadAsync(
        IFormFile? file,
        string? documentKey,
        string ownerUserId,
        string? applicationPackId,
        string sourceIp,
        CancellationToken ct = default);

    Task<StoredDocument?> FindAsync(Guid id, CancellationToken ct = default);

    Task<List<StoredDocument>> ListLiveAsync(string ownerUserId, CancellationToken ct = default);

    /// <summary>Absolute path of the row's bytes. Composed from the row, never from a request.</summary>
    string PathFor(StoredDocument document);

    Task DeleteAsync(StoredDocument document, string actorId, string sourceIp, CancellationToken ct = default);

    /// <summary>The full readiness result over the owner's live documents, from the unmodified
    /// readiness service (R6.10).</summary>
    Task<ApplicationReadiness> RecalculateReadinessAsync(string ownerUserId, CancellationToken ct = default);

    Task WriteRetrievalAuditAsync(StoredDocument document, string actorId, string sourceIp, CancellationToken ct = default);
}

/// <summary>
/// Validation, storage, replacement, retrieval and deletion of beneficiary documents
/// (design C8, R6).
///
/// The single most important behaviour in this file is the <em>order</em> of validation:
/// extension, then content type, then magic bytes, then length. R6.6 requires the 400 message
/// to name the <b>first</b> failed check, so the checks are evaluated in that sequence and the
/// first failure returns immediately.
///
/// The second is that <b>no byte reaches disk until every check has passed</b>. Extension and
/// content type need no bytes at all. The magic-byte check needs only the leading 8 bytes,
/// which are read into memory. Only then is the stream copied to <c>tmp/</c>, capped one byte
/// above the limit so an oversized upload is detected without buffering it all; and if that
/// length check fails, the temp file is deleted before the response is written. A rejected
/// upload therefore leaves no partial artefact anywhere (R6.20).
/// </summary>
public class DocumentService : IDocumentService
{
    // ------------------------------------------------------------------- limits

    public const long MinBytes = 1;
    public const long MaxBytes = 5_242_880;              // 5 MiB inclusive (R6.5)

    private static readonly string[] AllowedExtensions = { ".pdf", ".jpg", ".jpeg", ".png" };

    private const string Pdf = "application/pdf";
    private const string Jpeg = "image/jpeg";
    private const string Png = "image/png";

    private static readonly string[] AllowedContentTypes = { Pdf, Jpeg, Png };

    /// <summary>The four checklist keys of R6.1. Ordinal, case-sensitive: these are protocol
    /// values, not user-facing text.</summary>
    public static readonly string[] AllowedDocumentKeys = { "identity", "caste_cert", "income_cert", "quotation" };

    private static readonly byte[] PdfSignature = { 0x25, 0x50, 0x44, 0x46 };
    private static readonly byte[] JpegSignature = { 0xFF, 0xD8, 0xFF };
    private static readonly byte[] PngSignature = { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };

    private const int SignatureProbeLength = 8;          // longest signature above

    // ----------------------------------------------------------------- services

    private readonly SchemeReadyDbContext _db;
    private readonly DocumentStorage _storage;
    private readonly IReadinessService _readiness;
    private readonly IAuditWriter _audit;

    public DocumentService(
        SchemeReadyDbContext db,
        DocumentStorage storage,
        IReadinessService readiness,
        IAuditWriter audit)
    {
        _db = db;
        _storage = storage;
        _readiness = readiness;
        _audit = audit;
    }

    // ------------------------------------------------------------------- upload

    public async Task<UploadOutcome> UploadAsync(
        IFormFile? file,
        string? documentKey,
        string ownerUserId,
        string? applicationPackId,
        string sourceIp,
        CancellationToken ct = default)
    {
        // R6.2 — request-shape failures, named by field, before any validation of content.
        if (file is null)
        {
            return await RejectAsync("file: exactly one file part is required.", ownerUserId, documentKey, sourceIp, ct);
        }

        if (string.IsNullOrWhiteSpace(documentKey))
        {
            return await RejectAsync("docKey: a document key is required.", ownerUserId, documentKey, sourceIp, ct);
        }

        if (!AllowedDocumentKeys.Contains(documentKey, StringComparer.Ordinal))
        {
            return await RejectAsync(
                $"docKey: must be one of {string.Join(", ", AllowedDocumentKeys)}.", ownerUserId, documentKey, sourceIp, ct);
        }

        // ---- check 1: extension (no bytes touched) ---------------------------
        var extension = Path.GetExtension(file.FileName ?? string.Empty).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension, StringComparer.Ordinal))
        {
            return await RejectAsync(
                $"file extension: must be one of {string.Join(", ", AllowedExtensions)}.", ownerUserId, documentKey, sourceIp, ct);
        }

        // ---- check 2: declared content type ---------------------------------
        var contentType = NormaliseContentType(file.ContentType);
        if (!AllowedContentTypes.Contains(contentType, StringComparer.Ordinal))
        {
            return await RejectAsync(
                $"content type: must be one of {string.Join(", ", AllowedContentTypes)}.", ownerUserId, documentKey, sourceIp, ct);
        }

        // ---- check 3: magic bytes, matched against the declared type --------
        await using var source = file.OpenReadStream();
        var probe = new byte[SignatureProbeLength];
        var probeLength = await ReadAtLeastAsync(source, probe, ct);

        if (!SignatureMatches(probe, probeLength, contentType))
        {
            return await RejectAsync(
                $"file content: the leading bytes are not a valid {contentType} signature.", ownerUserId, documentKey, sourceIp, ct);
        }

        // ---- check 4: length. The first disk write happens here, into tmp/. --
        var tempPath = _storage.NewTempPath();
        long byteLength;
        string sha256;

        try
        {
            (byteLength, sha256) = await BufferToTempAsync(source, probe, probeLength, tempPath, ct);

            if (byteLength < MinBytes || byteLength > MaxBytes)
            {
                _storage.DeleteQuietly(tempPath);                       // no partial artefact (R6.20)
                return await RejectAsync(
                    $"file length: must be between {MinBytes} and {MaxBytes} bytes; received {byteLength}.",
                    ownerUserId, documentKey, sourceIp, ct);
            }
        }
        catch
        {
            _storage.DeleteQuietly(tempPath);
            throw;
        }

        // ---- all four passed: move into place, then record metadata ----------
        var storedFileName = DocumentStorage.NewStoredFileName(extension);
        _storage.EnsureOwnerDirectory(ownerUserId);
        var finalPath = _storage.PathFor(ownerUserId, storedFileName);

        File.Move(tempPath, finalPath);                                  // same volume ⇒ atomic

        var row = new StoredDocument
        {
            Id = Guid.NewGuid(),
            OwnerUserId = ownerUserId,
            ApplicationPackId = string.IsNullOrWhiteSpace(applicationPackId) ? null : applicationPackId,
            DocumentKey = documentKey,
            OriginalFileName = SanitiseClientFileName(file.FileName),
            StoredFileName = storedFileName,
            ContentType = contentType,
            ByteLength = byteLength,
            Sha256 = sha256,
            UploadedAt = DateTime.UtcNow,
            DeletedAt = null
        };

        // Replacement and insert commit together (R6.11): the previous live row for this
        // (owner, key) is marked deleted in the same transaction that inserts the new one, so
        // the partial unique index can never see two live rows.
        await using var tx = await _db.Database.BeginTransactionAsync(ct);
        try
        {
            var superseded = await _db.StoredDocuments
                .Where(d => d.OwnerUserId == ownerUserId
                            && d.DocumentKey == documentKey
                            && d.DeletedAt == null)
                .ToListAsync(ct);

            foreach (var old in superseded)
            {
                old.DeletedAt = DateTime.UtcNow;
            }

            _db.StoredDocuments.Add(row);
            await _db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);

            // Bytes are removed only after the metadata transaction commits: a rollback must
            // not leave a live row pointing at a file that is already gone.
            foreach (var old in superseded)
            {
                _storage.DeleteQuietly(_storage.PathFor(old.OwnerUserId, old.StoredFileName));
            }
        }
        catch
        {
            await tx.RollbackAsync(ct);
            _storage.DeleteQuietly(finalPath);                           // no orphan bytes
            throw;
        }

        var readiness = await RecalculateReadinessAsync(ownerUserId, ct);

        await _audit.WriteAsync(new AuditEvent
        {
            OccurredAt = DateTime.UtcNow,
            ActorId = ownerUserId,
            ActionType = "DocumentUpload",
            EntityType = "StoredDocument",
            EntityId = row.Id.ToString(),
            SourceIpAddress = sourceIp,
            Outcome = "Success",
            Detail = JsonSerializer.Serialize(new
            {
                outcome = "AcceptedUpload",
                documentKey,
                byteLength,
                contentType
            })
        }, ct);

        return new UploadOutcome(row, readiness.OverallScore, null);
    }

    // ------------------------------------------------------- read / list / delete

    public async Task<StoredDocument?> FindAsync(Guid id, CancellationToken ct = default) =>
        await _db.StoredDocuments.FirstOrDefaultAsync(d => d.Id == id, ct);

    public async Task<List<StoredDocument>> ListLiveAsync(string ownerUserId, CancellationToken ct = default) =>
        await _db.StoredDocuments.AsNoTracking()
            .Where(d => d.OwnerUserId == ownerUserId && d.DeletedAt == null)
            .OrderBy(d => d.DocumentKey)
            .ToListAsync(ct);

    public string PathFor(StoredDocument document) =>
        _storage.PathFor(document.OwnerUserId, document.StoredFileName);

    public async Task DeleteAsync(StoredDocument document, string actorId, string sourceIp, CancellationToken ct = default)
    {
        document.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        _storage.DeleteQuietly(PathFor(document));                       // R6.18

        await _audit.WriteAsync(new AuditEvent
        {
            OccurredAt = DateTime.UtcNow,
            ActorId = actorId,
            ActionType = "DocumentDeletion",
            EntityType = "StoredDocument",
            EntityId = document.Id.ToString(),
            SourceIpAddress = sourceIp,
            Outcome = "Success",
            Detail = JsonSerializer.Serialize(new { outcome = "Deletion", documentKey = document.DocumentKey })
        }, ct);
    }

    public Task WriteRetrievalAuditAsync(StoredDocument document, string actorId, string sourceIp, CancellationToken ct = default) =>
        _audit.WriteAsync(new AuditEvent
        {
            OccurredAt = DateTime.UtcNow,
            ActorId = actorId,
            ActionType = "DocumentRetrieval",
            EntityType = "StoredDocument",
            EntityId = document.Id.ToString(),
            SourceIpAddress = sourceIp,
            Outcome = "Success",
            Detail = JsonSerializer.Serialize(new { outcome = "Retrieval", documentKey = document.DocumentKey })
        }, ct);

    // ------------------------------------------------------------- readiness

    /// <summary>
    /// Projects the owner's live documents onto the existing profile shape and calls the
    /// <b>unmodified</b> <see cref="IReadinessService"/> (R6.10). The mapping is exactly the
    /// design C8 table; no scoring logic lives here, so the score in a 201 body is the same
    /// number the readiness endpoint would return for that document set.
    /// </summary>
    public async Task<ApplicationReadiness> RecalculateReadinessAsync(string ownerUserId, CancellationToken ct = default)
    {
        var liveKeys = await _db.StoredDocuments.AsNoTracking()
            .Where(d => d.OwnerUserId == ownerUserId && d.DeletedAt == null)
            .Select(d => d.DocumentKey)
            .ToListAsync(ct);

        var profile = new BeneficiaryProfile
        {
            HasCasteCertificate = false,
            HasIncomeCertificate = false,
            UploadedDocs = new List<string>()
        };

        foreach (var key in liveKeys)
        {
            switch (key)
            {
                case "identity":
                    profile.UploadedDocs.Add("Aadhaar/KYC");
                    break;
                case "caste_cert":
                    profile.HasCasteCertificate = true;
                    profile.UploadedDocs.Add("Caste certificate");
                    break;
                case "income_cert":
                    profile.HasIncomeCertificate = true;
                    profile.UploadedDocs.Add("Income certificate");
                    break;
                case "quotation":
                    profile.UploadedDocs.Add("Business quotation");
                    break;
            }
        }

        return _readiness.CalculateReadiness(profile);
    }

    // --------------------------------------------------------------- internals

    /// <summary>Lower-cased, with anything from the first <c>;</c> onward discarded, so
    /// <c>image/jpeg; charset=binary</c> compares equal to <c>image/jpeg</c> (R6.3).</summary>
    private static string NormaliseContentType(string? declared)
    {
        var value = declared ?? string.Empty;
        var semicolon = value.IndexOf(';');
        if (semicolon >= 0) value = value[..semicolon];
        return value.Trim().ToLowerInvariant();
    }

    private static bool SignatureMatches(byte[] probe, int probeLength, string contentType)
    {
        var expected = contentType switch
        {
            Pdf => PdfSignature,
            Jpeg => JpegSignature,
            Png => PngSignature,
            _ => null
        };

        if (expected is null || probeLength < expected.Length) return false;

        return probe.AsSpan(0, expected.Length).SequenceEqual(expected);
    }

    private static async Task<int> ReadAtLeastAsync(Stream source, byte[] buffer, CancellationToken ct)
    {
        var total = 0;
        while (total < buffer.Length)
        {
            var read = await source.ReadAsync(buffer.AsMemory(total, buffer.Length - total), ct);
            if (read == 0) break;
            total += read;
        }
        return total;
    }

    /// <summary>
    /// Copies the already-probed leading bytes plus the remainder of the stream into
    /// <paramref name="tempPath"/>, hashing as it goes. The copy stops one byte past the limit:
    /// an oversized upload is detected without buffering the whole of it, and the caller deletes
    /// the temp file.
    /// </summary>
    private static async Task<(long ByteLength, string Sha256)> BufferToTempAsync(
        Stream source, byte[] probe, int probeLength, string tempPath, CancellationToken ct)
    {
        using var sha = SHA256.Create();
        await using var temp = new FileStream(tempPath, FileMode.CreateNew, FileAccess.Write, FileShare.None);

        long total = 0;

        if (probeLength > 0)
        {
            await temp.WriteAsync(probe.AsMemory(0, probeLength), ct);
            sha.TransformBlock(probe, 0, probeLength, null, 0);
            total = probeLength;
        }

        var buffer = new byte[81920];
        while (total <= MaxBytes)
        {
            // Never read past MaxBytes + 1: one byte over the limit is all it takes to know the
            // upload is oversized, and it bounds the memory and disk a rejected upload touches.
            var window = (int)Math.Min(buffer.Length, MaxBytes + 1 - total);
            var read = await source.ReadAsync(buffer.AsMemory(0, window), ct);
            if (read == 0) break;

            await temp.WriteAsync(buffer.AsMemory(0, read), ct);
            sha.TransformBlock(buffer, 0, read, null, 0);
            total += read;
        }

        sha.TransformFinalBlock(Array.Empty<byte>(), 0, 0);
        await temp.FlushAsync(ct);

        return (total, Convert.ToHexString(sha.Hash!));
    }

    /// <summary>
    /// Metadata only (R6.8): directory separators, the drive-letter colon and every control
    /// character are removed, then the result is truncated to 255 characters. React renders the
    /// stored value as a text child, so markup characters that survive appear as characters.
    /// </summary>
    internal static string SanitiseClientFileName(string? clientName)
    {
        var raw = clientName ?? string.Empty;

        var cleaned = new string(raw
            .Where(c => c != '/' && c != '\\' && c != ':' && !char.IsControl(c))
            .ToArray())
            .Trim();

        if (cleaned.Length > 255) cleaned = cleaned[..255];

        return cleaned.Length == 0 ? "document" : cleaned;
    }

    private async Task<UploadOutcome> RejectAsync(
        string error, string ownerUserId, string? documentKey, string sourceIp, CancellationToken ct)
    {
        await _audit.WriteAsync(new AuditEvent
        {
            OccurredAt = DateTime.UtcNow,
            ActorId = ownerUserId,
            ActionType = "DocumentUpload",
            EntityType = "StoredDocument",
            EntityId = string.Empty,
            SourceIpAddress = sourceIp,
            Outcome = "Failure",
            Detail = JsonSerializer.Serialize(new { outcome = "RejectedUpload", documentKey, error })
        }, ct);

        return UploadOutcome.Rejected(error);
    }
}
