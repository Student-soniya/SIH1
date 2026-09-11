using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchemeReady.Api.Auth;
using SchemeReady.Api.Data;
using SchemeReady.Api.Models;
using SchemeReady.Api.Services;

namespace SchemeReady.Api.Controllers;

/// <summary>
/// Signup, login, refresh rotation, logout and <c>/me</c> — the five endpoints of design C6.
/// All are new routes; nothing existing changes shape (R1.4).
/// </summary>
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    /// <summary>
    /// The single 401 body for login. R4.6 requires an unknown email and a wrong password to
    /// be byte-identical, which is only guaranteed if both take this one constant through one
    /// code path — see <see cref="Login"/>.
    /// </summary>
    private const string InvalidCredentialsMessage = "Email address or password is incorrect.";

    private const string LockedOutMessage =
        "Too many failed sign-in attempts. This account is temporarily locked. Try again later.";

    private const string DuplicateEmailMessage = "That email address cannot be used for a new account.";

    private const string InvalidRefreshMessage = "The refresh token is not valid.";

    private readonly UserManager<ApplicationUser> _users;
    private readonly SchemeReadyDbContext _db;
    private readonly ITokenService _tokens;
    private readonly IAuditWriter _audit;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<ApplicationUser> users,
        SchemeReadyDbContext db,
        ITokenService tokens,
        IAuditWriter audit,
        ILogger<AuthController> logger)
    {
        _users = users;
        _db = db;
        _tokens = tokens;
        _audit = audit;
        _logger = logger;
    }

    // ------------------------------------------------------------------- signup

    /// <summary>
    /// R4.2–R4.4. Validation collects <em>every</em> unmet rule rather than short-circuiting,
    /// because R4.4 requires the message to name each of them.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request, CancellationToken ct)
    {
        var errors = ValidateSignup(request);
        if (errors.Count > 0)
        {
            await WriteAuthAudit("Failure", "signup-validation", request?.Email);
            return BadRequest(new AuthErrorResponse("The signup request is not valid.", errors));
        }

        var email = request!.Email!.Trim();

        // Identity normalises the stored email to upper-invariant, so this lookup is the
        // case-insensitive comparison R4.3 asks for.
        var existing = await _users.FindByEmailAsync(email);
        if (existing is not null)
        {
            // 409 with a fixed message: nothing here reveals the existing account's role,
            // lockout state or password state (R4.3).
            await WriteAuthAudit("Failure", "signup-duplicate", email);
            return Conflict(new AuthErrorResponse(DuplicateEmailMessage));
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid().ToString("N"),
            UserName = email,
            Email = email,
            DisplayName = request.DisplayName!.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        var created = await _users.CreateAsync(user, request.Password!);
        if (!created.Succeeded)
        {
            // Identity's own password/user validators. Their descriptions name the unmet rule
            // and disclose no account state.
            await WriteAuthAudit("Failure", "signup-rejected", email);
            return BadRequest(new AuthErrorResponse(
                "The signup request is not valid.",
                created.Errors.Select(e => e.Description).ToList()));
        }

        var roleAssigned = await _users.AddToRoleAsync(user, RoleNames.Beneficiary);
        if (!roleAssigned.Succeeded)
        {
            // An account without its role could reach protected endpoints in an undefined
            // state, so the account is removed and the caller sees a clean failure.
            await _users.DeleteAsync(user);
            _logger.LogError("Role assignment failed for a new account; the account was removed.");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new AuthErrorResponse("The account could not be created. Please try again."));
        }

        await WriteAuthAudit("Success", "signup", email, user.Id);

        // 201 with no token pair and, crucially, no password or hash (R4.1, R4.2).
        return StatusCode(StatusCodes.Status201Created, new
        {
            userId = user.Id,
            displayName = user.DisplayName,
            roles = new[] { RoleNames.Beneficiary }
        });
    }

    // -------------------------------------------------------------------- login

    /// <summary>
    /// R4.5–R4.7. The lockout check precedes password verification, so a correct password
    /// during lockout still gets 423; and the unknown-email and wrong-password outcomes leave
    /// through one <c>return</c> with one constant, making them byte-identical.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var email = request?.Email?.Trim() ?? string.Empty;
        var password = request?.Password ?? string.Empty;

        var user = string.IsNullOrEmpty(email) ? null : await _users.FindByEmailAsync(email);

        if (user is not null && await _users.IsLockedOutAsync(user))
        {
            await WriteAuthAudit("Failure", "login-locked", email, user.Id);
            return StatusCode(StatusCodes.Status423Locked, new AuthErrorResponse(LockedOutMessage));
        }

        var passwordOk = user is not null && await _users.CheckPasswordAsync(user, password);

        if (!passwordOk)
        {
            if (user is not null)
            {
                // Increments the counter and applies the lockout on the fifth failure, using
                // the MaxFailedAccessAttempts/DefaultLockoutTimeSpan configured in Program.cs.
                await _users.AccessFailedAsync(user);
            }

            await WriteAuthAudit("Failure", "login", email, user?.Id);
            return Unauthorized(new AuthErrorResponse(InvalidCredentialsMessage));   // one path, one constant
        }

        await _users.ResetAccessFailedCountAsync(user!);                              // R4.5

        var pair = await IssueTokenPairAsync(user!, ct);
        await WriteAuthAudit("Success", "login", email, user!.Id);
        return Ok(pair);
    }

    // ------------------------------------------------------------------ refresh

    /// <summary>
    /// Rotation with replay detection, in the exact order of the design C6 sequence diagram.
    ///
    /// The ordering is the whole mechanism:
    /// <list type="number">
    /// <item>one transaction, opened before the lookup;</item>
    /// <item><c>SELECT ... FOR UPDATE</c>, so a concurrent presentation of the same token
    ///       blocks here instead of racing;</item>
    /// <item>an already-revoked row means replay: revoke the whole family and audit;</item>
    /// <item>otherwise a <em>conditional</em> <c>UPDATE ... WHERE "RevokedAt" IS NULL</c> whose
    ///       rows-affected must be 1 — the concurrency guard, so the loser of a race cannot
    ///       also succeed;</item>
    /// <item>the replacement row is inserted inside that same transaction, so revocation and
    ///       replacement commit together or not at all.</item>
    /// </list>
    /// </summary>
    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request, CancellationToken ct)
    {
        var presented = request?.RefreshToken;
        if (string.IsNullOrWhiteSpace(presented))
        {
            return Unauthorized(new AuthErrorResponse(InvalidRefreshMessage));
        }

        var hash = _tokens.HashRefreshToken(presented);

        await using var tx = await _db.Database.BeginTransactionAsync(ct);

        // FromSqlInterpolated parameterises the hash; FOR UPDATE takes the row lock.
        var row = await _db.RefreshTokens
            .FromSqlInterpolated($"SELECT * FROM \"RefreshTokens\" WHERE \"TokenHash\" = {hash} FOR UPDATE")
            .FirstOrDefaultAsync(ct);

        if (row is null || row.ExpiresAt <= DateTime.UtcNow)
        {
            await tx.RollbackAsync(ct);
            return Unauthorized(new AuthErrorResponse(InvalidRefreshMessage));        // R4.12
        }

        if (row.RevokedAt is not null)
        {
            // Replay (R4.11): the entire family dies, exactly one audit event is written, and
            // no token pair is issued.
            var revokedCount = await _db.Database.ExecuteSqlInterpolatedAsync(
                $"UPDATE \"RefreshTokens\" SET \"RevokedAt\" = now() WHERE \"UserId\" = {row.UserId} AND \"RevokedAt\" IS NULL",
                ct);

            await tx.CommitAsync(ct);

            await _audit.WriteAsync(new AuditEvent
            {
                OccurredAt = DateTime.UtcNow,
                ActorId = row.UserId,
                ActionType = "SuspectedTokenReplay",
                EntityType = "RefreshToken",
                EntityId = row.Id.ToString(),
                SourceIpAddress = SourceIp(),
                Outcome = "Failure",
                Detail = JsonSerializer.Serialize(new
                {
                    reason = "A refresh token already marked revoked was presented again.",
                    familyTokensRevoked = revokedCount
                })
            }, ct);

            return Unauthorized(new AuthErrorResponse(InvalidRefreshMessage));
        }

        var user = await _users.FindByIdAsync(row.UserId);
        if (user is null)
        {
            await tx.RollbackAsync(ct);
            return Unauthorized(new AuthErrorResponse(InvalidRefreshMessage));
        }

        var (plaintext, replacement) = _tokens.CreateRefreshToken(row.UserId);

        // The conditional WHERE is the guard: if a concurrent transaction already consumed
        // this row, this affects zero rows and we abandon without issuing anything.
        var affected = await _db.Database.ExecuteSqlInterpolatedAsync(
            $"UPDATE \"RefreshTokens\" SET \"RevokedAt\" = now(), \"ReplacedByHash\" = {replacement.TokenHash} WHERE \"Id\" = {row.Id} AND \"RevokedAt\" IS NULL",
            ct);

        if (affected != 1)
        {
            await tx.RollbackAsync(ct);
            return Unauthorized(new AuthErrorResponse(InvalidRefreshMessage));
        }

        _db.RefreshTokens.Add(replacement);
        await _db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);

        var (accessToken, accessExpiry) = await _tokens.IssueAccessTokenAsync(user, ct);

        // Plaintext leaves the server exactly once, here (R4.9).
        return Ok(new TokenPairResponse(accessToken, plaintext, accessExpiry, replacement.ExpiresAt));
    }

    // ------------------------------------------------------------------- logout

    /// <summary>R4.13 — every refresh token for the caller is revoked; 204, no body.</summary>
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        var userId = User.UserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await _db.Database.ExecuteSqlInterpolatedAsync(
            $"UPDATE \"RefreshTokens\" SET \"RevokedAt\" = now() WHERE \"UserId\" = {userId} AND \"RevokedAt\" IS NULL",
            ct);

        await WriteAuthAudit("Success", "logout", User.DisplayName(), userId);
        return NoContent();
    }

    // ----------------------------------------------------------------------- me

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User.UserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _users.FindByIdAsync(userId);
        if (user is null) return Unauthorized();

        var roles = await _users.GetRolesAsync(user);
        return Ok(new MeResponse(user.Id, user.DisplayName, roles.ToList(), User.PartnerId()));
    }

    // -------------------------------------------------------------------- rules

    private const int EmailMinLength = 5;
    private const int EmailMaxLength = 254;
    private const int PasswordMinLength = 12;
    private const int PasswordMaxLength = 128;
    private const int DisplayNameMinLength = 1;
    private const int DisplayNameMaxLength = 100;

    /// <summary>
    /// Every bound of R4.2, evaluated independently so the 400 body can name each unmet rule
    /// (R4.4). Returns an empty list when the credential space of R4.2 is satisfied exactly.
    /// </summary>
    private static List<string> ValidateSignup(SignupRequest? request)
    {
        var errors = new List<string>();

        var email = request?.Email?.Trim() ?? string.Empty;
        var password = request?.Password ?? string.Empty;
        var displayName = request?.DisplayName?.Trim() ?? string.Empty;

        if (email.Length < EmailMinLength || email.Length > EmailMaxLength)
        {
            errors.Add($"email must be between {EmailMinLength} and {EmailMaxLength} characters.");
        }

        var atCount = email.Count(c => c == '@');
        if (atCount != 1)
        {
            errors.Add("email must contain exactly one '@'.");
        }
        else
        {
            var at = email.IndexOf('@');
            if (at == 0 || at == email.Length - 1)
            {
                errors.Add("email must have at least one character on each side of the '@'.");
            }
        }

        if (password.Length < PasswordMinLength || password.Length > PasswordMaxLength)
        {
            errors.Add($"password must be between {PasswordMinLength} and {PasswordMaxLength} characters.");
        }

        if (!password.Any(char.IsLetter))
        {
            errors.Add("password must contain at least one letter.");
        }

        if (!password.Any(char.IsDigit))
        {
            errors.Add("password must contain at least one digit.");
        }

        if (displayName.Length < DisplayNameMinLength || displayName.Length > DisplayNameMaxLength)
        {
            errors.Add($"displayName must be between {DisplayNameMinLength} and {DisplayNameMaxLength} characters.");
        }

        return errors;
    }

    // ------------------------------------------------------------------ helpers

    private async Task<TokenPairResponse> IssueTokenPairAsync(ApplicationUser user, CancellationToken ct)
    {
        var (accessToken, accessExpiry) = await _tokens.IssueAccessTokenAsync(user, ct);
        var (plaintext, row) = _tokens.CreateRefreshToken(user.Id);

        _db.RefreshTokens.Add(row);
        await _db.SaveChangesAsync(ct);

        return new TokenPairResponse(accessToken, plaintext, accessExpiry, row.ExpiresAt);
    }

    private string SourceIp() => HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? string.Empty;

    /// <summary>
    /// One audit event per authentication attempt. The detail carries the stage and the email
    /// only — never a password, a token, or a hash (R9.3).
    /// </summary>
    private Task WriteAuthAudit(string outcome, string stage, string? email, string? userId = null) =>
        _audit.WriteAsync(new AuditEvent
        {
            OccurredAt = DateTime.UtcNow,
            ActorId = userId ?? "anonymous",
            ActionType = "AuthAttempt",
            EntityType = "ApplicationUser",
            EntityId = userId ?? string.Empty,
            SourceIpAddress = SourceIp(),
            Outcome = outcome,
            Detail = JsonSerializer.Serialize(new { stage, email })
        });
}
