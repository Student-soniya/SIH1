using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace SchemeReady.Api.Auth;

/// <summary>
/// Signing material and the issuer/audience pair, read once at startup from configuration
/// (design C11). The signing key never appears in a log line or a response body.
/// </summary>
public class JwtSettings
{
    public const string SigningKeyConfigKey = "SCHEMEREADY_JWT_SIGNING_KEY";
    public const string IssuerConfigKey = "SCHEMEREADY_JWT_ISSUER";
    public const string AudienceConfigKey = "SCHEMEREADY_JWT_AUDIENCE";

    /// <summary>R4.8 — 15 minutes from issue.</summary>
    public static readonly TimeSpan AccessTokenLifetime = TimeSpan.FromMinutes(15);

    /// <summary>R4.9 — 7 days from issue.</summary>
    public static readonly TimeSpan RefreshTokenLifetime = TimeSpan.FromDays(7);

    /// <summary>R4.20 — at most 60 seconds; the JwtBearer default of five minutes violates it.</summary>
    public static readonly TimeSpan ClockSkew = TimeSpan.FromSeconds(60);

    public string SigningKey { get; init; } = string.Empty;
    public string Issuer { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;

    public SymmetricSecurityKey SecurityKey() => new(Encoding.UTF8.GetBytes(SigningKey));

    /// <summary>
    /// Reads the three keys, failing startup when any is absent. HMAC-SHA256 needs at least
    /// 256 bits of key material, so a short key is rejected here rather than at first login.
    /// </summary>
    public static JwtSettings LoadOrThrow(IConfiguration cfg)
    {
        var missing = new[] { SigningKeyConfigKey, IssuerConfigKey, AudienceConfigKey }
            .Where(k => string.IsNullOrWhiteSpace(cfg[k]))
            .ToArray();

        if (missing.Length > 0)
        {
            throw new InvalidOperationException(
                $"Missing required configuration: {string.Join(", ", missing)}. See docs/local-build-and-migrations.md.");
        }

        var key = cfg[SigningKeyConfigKey]!;
        if (Encoding.UTF8.GetByteCount(key) < 32)
        {
            throw new InvalidOperationException(
                $"{SigningKeyConfigKey} must supply at least 32 bytes (256 bits) of key material for HMAC-SHA256.");
        }

        return new JwtSettings
        {
            SigningKey = key,
            Issuer = cfg[IssuerConfigKey]!,
            Audience = cfg[AudienceConfigKey]!
        };
    }
}
