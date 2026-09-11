using SchemeReady.Api.Data;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Services;

public interface IAuditWriter
{
    Task WriteAsync(AuditEvent e, CancellationToken ct = default);
}

/// <summary>
/// Writes audit rows on their own scope and their own transaction.
///
/// That separation is the whole point. Writing through the request's DbContext would enlist
/// the audit row in the business transaction, so an audit failure would roll back the
/// business write, and a business rollback would erase a successful audit. Independent
/// scope, independent transaction, failure logged and swallowed: the originating request
/// returns exactly the response it would have returned anyway (R9.7).
///
/// Phase A needs this for the illustrative-flag events of R2.7. Phase G extends it with the
/// append-only database grants and the full closed action set.
/// </summary>
public class AuditWriter : IAuditWriter
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AuditWriter> _logger;

    public AuditWriter(IServiceScopeFactory scopeFactory, ILogger<AuditWriter> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async Task WriteAsync(AuditEvent e, CancellationToken ct = default)
    {
        try
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<SchemeReadyDbContext>();
            db.AuditEvents.Add(e);
            await db.SaveChangesAsync(ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Audit write failed for {ActionType} on {EntityType} {EntityId}",
                e.ActionType, e.EntityType, e.EntityId);
        }
    }
}
