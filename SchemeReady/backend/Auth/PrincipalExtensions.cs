using System.Security.Claims;

namespace SchemeReady.Api.Auth;

/// <summary>
/// Claim readers used by every authorisation decision, so no controller reaches into
/// <see cref="ClaimsPrincipal"/> by hand and disagrees about which claim carries the user id.
///
/// Inbound claim mapping is disabled in <c>Program.cs</c>, so the claim types are exactly the
/// ones written into the token: <c>sub</c>, <c>name</c>, <c>role</c>, <c>partner_id</c>. The
/// <see cref="ClaimTypes"/> fallbacks keep these readers correct if mapping is ever re-enabled.
/// </summary>
public static class PrincipalExtensions
{
    public const string RoleClaimType = "role";
    public const string NameClaimType = "name";
    public const string SubjectClaimType = "sub";

    public static string? UserId(this ClaimsPrincipal? principal) =>
        principal?.FindFirst(SubjectClaimType)?.Value
        ?? principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    public static string? DisplayName(this ClaimsPrincipal? principal) =>
        principal?.FindFirst(NameClaimType)?.Value
        ?? principal?.FindFirst(ClaimTypes.Name)?.Value;

    public static string? PartnerId(this ClaimsPrincipal? principal) =>
        principal?.FindFirst(SchemeReadyClaims.PartnerId)?.Value;

    public static IReadOnlyList<string> Roles(this ClaimsPrincipal? principal) =>
        principal?.FindAll(RoleClaimType).Select(c => c.Value)
            .Concat(principal.FindAll(ClaimTypes.Role).Select(c => c.Value))
            .Distinct(StringComparer.Ordinal)
            .ToList()
        ?? (IReadOnlyList<string>)Array.Empty<string>();

    public static bool HasRole(this ClaimsPrincipal? principal, string role) =>
        principal.Roles().Contains(role, StringComparer.Ordinal);

    public static bool IsAdmin(this ClaimsPrincipal? principal) => principal.HasRole(RoleNames.Admin);

    public static bool IsOfficer(this ClaimsPrincipal? principal) => principal.HasRole(RoleNames.Officer);
}
