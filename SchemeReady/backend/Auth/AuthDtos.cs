namespace SchemeReady.Api.Auth;

/// <summary>
/// Request and response shapes for the five auth endpoints of design C6. These are new
/// endpoints, so no existing request or response schema is affected (R1.4).
///
/// No shape here carries a password hash, a refresh-token hash, or any account state
/// beyond what R4 requires (R4.1, R4.3).
/// </summary>
public record SignupRequest(string? Email, string? Password, string? DisplayName);

public record LoginRequest(string? Email, string? Password);

public record RefreshRequest(string? RefreshToken);

/// <summary>Exactly one access token and exactly one refresh token (R4.5, R4.10).</summary>
public record TokenPairResponse(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpiresAt,
    DateTime RefreshTokenExpiresAt);

public record MeResponse(string UserId, string DisplayName, IReadOnlyList<string> Roles, string? PartnerId);

/// <summary>
/// The single failure shape. <c>errors</c> names every unmet rule for a 400 (R4.4); it is
/// absent for the fixed-message 401 of R4.6.
/// </summary>
public record AuthErrorResponse(string Error, IReadOnlyList<string>? Errors = null);
