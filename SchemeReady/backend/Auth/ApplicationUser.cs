using Microsoft.AspNetCore.Identity;

namespace SchemeReady.Api.Auth;

/// <summary>
/// Identity principal for the SchemeReady API.
///
/// Phase A declares only the persistence shape, because R1.6 requires the initial
/// EF migration to create the identity tables alongside the domain tables. The signup,
/// login, lockout and role behaviour that consumes this type arrives in Phase C
/// (tasks 9.1–9.4); nothing in Phase A reads or writes it.
///
/// No password or password hash is ever projected onto a response body (R4.1) — the
/// inherited <c>PasswordHash</c> is read only by the Identity password hasher.
/// </summary>
public class ApplicationUser : IdentityUser
{
    /// <summary>Display name collected at signup, 1–100 characters (R4.2).</summary>
    public string DisplayName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
