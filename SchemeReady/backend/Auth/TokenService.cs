using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SchemeReady.Api.Data;

namespace SchemeReady.Api.Auth;

public interface ITokenService
{
    /// <summary>
    /// Issues one access token for the user, carrying <c>sub</c>, <c>name</c>, every
    /// <c>role</c>, and — for an Officer with an assignment row — <c>partner_id</c> (R4.8).
    /// </summary>
    Task<(string Token, DateTime ExpiresAt)> IssueAccessTokenAsync(ApplicationUser user, CancellationToken ct = default);

    /// <summary>
    /// Generates a refresh token. The plaintext is returned to the caller — and thus to the
    /// client, exactly once — while only <see cref="RefreshToken.TokenHash"/> is persisted (R4.9).
    /// </summary>
    (string Plaintext, RefreshToken Row) CreateRefreshToken(string userId);

    /// <summary>SHA-256 of a presented plaintext, for the constant-shaped hash lookup of R4.10.</summary>
    string HashRefreshToken(string plaintext);
}

public class TokenService : ITokenService
{
    private readonly JwtSettings _jwt;
    private readonly UserManager<ApplicationUser> _users;
    private readonly SchemeReadyDbContext _db;

    public TokenService(JwtSettings jwt, UserManager<ApplicationUser> users, SchemeReadyDbContext db)
    {
        _jwt = jwt;
        _users = users;
        _db = db;
    }

    public async Task<(string Token, DateTime ExpiresAt)> IssueAccessTokenAsync(ApplicationUser user, CancellationToken ct = default)
    {
        var roles = await _users.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new(TokenClaimNames.Sub, user.Id),
            new(TokenClaimNames.Name, user.DisplayName),
            new(TokenClaimNames.Jti, Guid.NewGuid().ToString("N"))
        };

        // The claim type is the literal "role", not ClaimTypes.Role. Using the long URI would
        // leave the wire format at the mercy of JwtSecurityTokenHandler's outbound claim-type map,
        // and the JwtBearer RoleClaimType configured in Program.cs would then have to guess. This
        // way the type written is the type validated.
        foreach (var role in roles)
        {
            claims.Add(new Claim(PrincipalExtensions.RoleClaimType, role));
        }

        // Projected at issue time so an authorisation check never needs a second query (design C7).
        if (roles.Contains(RoleNames.Officer))
        {
            var partnerId = await _db.OfficerPartnerAssignments
                .Where(a => a.UserId == user.Id)
                .Select(a => a.PartnerId)
                .FirstOrDefaultAsync(ct);

            if (!string.IsNullOrWhiteSpace(partnerId))
            {
                claims.Add(new Claim(SchemeReadyClaims.PartnerId, partnerId));
            }
        }

        var now = DateTime.UtcNow;
        var expires = now.Add(JwtSettings.AccessTokenLifetime);

        var token = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            notBefore: now,
            expires: expires,
            signingCredentials: new SigningCredentials(_jwt.SecurityKey(), SecurityAlgorithms.HmacSha256));

        return (new JwtSecurityTokenHandler().WriteToken(token), expires);
    }

    public (string Plaintext, RefreshToken Row) CreateRefreshToken(string userId)
    {
        // 256 bits, URL-safe. Well above the 128-bit floor the document filenames use.
        var bytes = RandomNumberGenerator.GetBytes(32);
        var plaintext = Base64UrlEncoder.Encode(bytes);
        var now = DateTime.UtcNow;

        return (plaintext, new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = HashRefreshToken(plaintext),
            IssuedAt = now,
            ExpiresAt = now.Add(JwtSettings.RefreshTokenLifetime),
            RevokedAt = null,
            ReplacedByHash = null
        });
    }

    public string HashRefreshToken(string plaintext) =>
        Convert.ToHexString(SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(plaintext)));
}

/// <summary>
/// The three registered claim names used above. Named distinctly from the JWT package's
/// <c>JwtRegisteredClaimNames</c> so nothing here silently shadows that type.
/// </summary>
internal static class TokenClaimNames
{
    public const string Sub = "sub";
    public const string Name = "name";
    public const string Jti = "jti";
}
