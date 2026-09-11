namespace SchemeReady.Api.Models;

/// <summary>
/// Metadata row for an uploaded beneficiary document. The bytes live on disk under
/// <c>SCHEMEREADY_DOCUMENT_ROOT</c>; <see cref="Id"/> is the only public handle, so no
/// request parameter ever conveys a filename or path (R6.12).
///
/// Phase A declares only the persistence shape so the initial migration can create the
/// table (R1.6). Validation, storage and the endpoints arrive in Phase D (tasks 13.1–13.4).
/// </summary>
public class StoredDocument
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string OwnerUserId { get; set; } = string.Empty;

    public string? ApplicationPackId { get; set; }

    /// <summary>One of <c>identity</c>, <c>caste_cert</c>, <c>income_cert</c>, <c>quotation</c>.</summary>
    public string DocumentKey { get; set; } = string.Empty;

    /// <summary>Sanitised client-supplied name, metadata only, at most 255 characters.</summary>
    public string OriginalFileName { get; set; } = string.Empty;

    /// <summary>32 random hex characters plus the validated extension. Independent of client input.</summary>
    public string StoredFileName { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;

    public long ByteLength { get; set; }

    public string Sha256 { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; }

    /// <summary>Soft delete. Null means live; a partial unique index keeps at most one
    /// live row per (OwnerUserId, DocumentKey) (R6.11).</summary>
    public DateTime? DeletedAt { get; set; }
}
