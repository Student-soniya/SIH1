using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Services;

/// <summary>
/// Turns the two Rule_Store failure modes into responses, once, for every action that reaches
/// the matching engine (R3.8, R7.5).
///
/// Registered globally rather than wrapped around each call site because the engine is reached
/// from two controllers today — <c>POST /api/schemes/match</c> and
/// <c>POST /api/application-pack/generate</c> — and a third tomorrow. A per-controller
/// <c>try/catch</c> is a rule that a new controller can forget; a global filter is not. Neither
/// exception can produce a partial success: both are thrown before any result is written.
///
/// No route, verb, request schema or *success* response schema changes here. These are new
/// failure statuses on existing endpoints, which is the only way R7.5's "reject the request"
/// can be honoured at all.
/// </summary>
public sealed class RuleStoreExceptionFilter : IExceptionFilter
{
    private readonly ILogger<RuleStoreExceptionFilter> _logger;

    public RuleStoreExceptionFilter(ILogger<RuleStoreExceptionFilter> logger)
    {
        _logger = logger;
    }

    public void OnException(ExceptionContext context)
    {
        switch (context.Exception)
        {
            case RuleStoreUnavailableException unavailable:
                // 503, not 500: the condition is transient and a client may retry. The body says
                // rules are unavailable and carries no scores — R7.5 forbids partial results.
                _logger.LogError(unavailable, "Rejecting {Path}: rule store unavailable.", context.HttpContext.Request.Path);

                context.Result = new ObjectResult(new { error = unavailable.Message })
                {
                    StatusCode = StatusCodes.Status503ServiceUnavailable
                };
                context.ExceptionHandled = true;
                break;

            case RuleDataInvalidException invalid:
                // 500: the store answered, but with data no administrator could have intended.
                // That is a server-side data defect, not a client error, and the message names the
                // scheme (or weight component) and the field so it is actionable from the log line
                // alone.
                _logger.LogError(invalid,
                    "Rejecting {Path}: invalid rule data for {Target}, field {Field}.",
                    context.HttpContext.Request.Path, invalid.SchemeIdOrComponent, invalid.FieldName);

                context.Result = new ObjectResult(new
                {
                    error = invalid.Message,
                    target = invalid.SchemeIdOrComponent,
                    field = invalid.FieldName
                })
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
                context.ExceptionHandled = true;
                break;
        }
    }
}
