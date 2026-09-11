namespace SchemeReady.Api.Auth;

/// <summary>
/// Persisted refresh credential. Only the SHA-256 hash of the token is stored; the
/// plaintext exists exactly once, in the issuing response body (R4.9).
///
/// Phase A declares only the persistence shape so the initial migration can create the
/// table (R1.6). Rotation and replay detection arrive in Phase C (task 9.4).
/// </summary>
public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string UserId { get; set; } = string.Empty;

    /// <summary>SHA-256 of the plaintext token. Unique across the table.</summary>
    public string TokenHash { get; set; } = string.Empty;

    public DateTime IssuedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    /// <summary>Null means live. Any non-null value means consumed or revoked.</summary>
    public DateTime? RevokedAt { get; set; }

    /// <summary>Hash of the token that replaced this one, for replay forensics.</summary>
    public string? ReplacedByHash { get; set; }
}
