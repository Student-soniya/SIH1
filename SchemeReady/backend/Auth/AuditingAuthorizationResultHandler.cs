using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Authorization.Policy;
using SchemeReady.Api.Models;
using SchemeReady.Api.Services;

namespace SchemeReady.Api.Auth;

/// <summary>
/// R4.21: a valid token that lacks a required role must yield 403, change no stored data, and
/// record exactly one audit event.
///
/// The audit event is written here rather than in a controller or an MVC filter because the
/// authorization middleware short-circuits the pipeline before either runs — a role failure
/// never reaches an action, which is precisely why no stored data changes.
/// <see cref="IAuthorizationMiddlewareResultHandler"/> is the one seam that sees the decision.
///
/// Only the forbidden case is audited. A challenge (401 — no token, or a token failing issuer,
/// audience, signature or expiry validation) is left to the default handler: R4.20 asks for the
/// status and for no part of the operation to be performed, not for an audit row, and auditing
/// every unauthenticated probe would let an anonymous caller inflate the audit table at will.
/// </summary>
public static class AuditingAuthorizationRegistration
{
    /// <summary>
    /// Registered from this file rather than inline in Program.cs: naming
    /// <see cref="IAuthorizationMiddlewareResultHandler"/> there failed to bind (CS0234
    /// fully-qualified, CS0246 via a using) even though it binds here. Pre-existing break,
    /// unrelated to the main merge — this keeps the registration where the type resolves.
    /// </summary>
    public static IServiceCollection AddAuditingAuthorizationResultHandler(this IServiceCollection services)
        => services.AddSingleton<IAuthorizationMiddlewareResultHandler, AuditingAuthorizationResultHandler>();
}

public class AuditingAuthorizationResultHandler : IAuthorizationMiddlewareResultHandler
{
    private readonly AuthorizationMiddlewareResultHandler _default = new();
    private readonly IAuditWriter _audit;

    public AuditingAuthorizationResultHandler(IAuditWriter audit)
    {
        _audit = audit;
    }

    public async Task HandleAsync(
        RequestDelegate next,
        HttpContext context,
        AuthorizationPolicy policy,
        PolicyAuthorizationResult authorizeResult)
    {
        if (authorizeResult.Forbidden)
        {
            await _audit.WriteAsync(new AuditEvent
            {
                OccurredAt = DateTime.UtcNow,
                ActorId = context.User.UserId() ?? "anonymous",
                ActionType = "AuthorizationDenied",
                EntityType = "Endpoint",
                EntityId = context.Request.Path.Value ?? string.Empty,
                SourceIpAddress = context.Connection?.RemoteIpAddress?.ToString() ?? string.Empty,
                Outcome = "Failure",
                Detail = JsonSerializer.Serialize(new
                {
                    method = context.Request.Method,
                    heldRoles = context.User.Roles(),
                    requiredRoles = policy.Requirements
                        .OfType<RolesAuthorizationRequirement>()
                        .SelectMany(r => r.AllowedRoles)
                        .Distinct(StringComparer.Ordinal)
                        .ToList()
                })
            }, context.RequestAborted);
        }

        await _default.HandleAsync(next, context, policy, authorizeResult);
    }
}
