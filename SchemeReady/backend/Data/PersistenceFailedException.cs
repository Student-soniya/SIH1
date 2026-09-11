namespace SchemeReady.Api.Data;

/// <summary>
/// Thrown when a write through <see cref="ISchemeRepository"/> did not commit.
///
/// Every write in <see cref="EfSchemeRepository"/> is a single <c>SaveChangesAsync</c>, so
/// it is one transaction: it either applies in full or leaves every stored record exactly
/// as it was, with no partial column or collection update. This exception is how that
/// failure is surfaced to the caller instead of being swallowed (R1.17).
/// </summary>
public class PersistenceFailedException : Exception
{
    public PersistenceFailedException(string message, Exception inner) : base(message, inner)
    {
    }
}
