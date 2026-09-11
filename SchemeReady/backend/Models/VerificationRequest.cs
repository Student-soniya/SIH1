namespace SchemeReady.Api.Models;

/// <summary>
/// Body of the admin verification endpoints. Clearing <see cref="IsIllustrative"/> is the
/// only operation that requires evidence, so the reference and date are nullable here and
/// validated in the controller — which lets the 400 name the condition that actually
/// failed rather than emitting a generic model-binding error (R2.6).
/// </summary>
public class VerificationRequest
{
    /// <summary>Target flag value. <c>false</c> asserts the row's regulatory details have
    /// been checked against current official guidelines.</summary>
    public bool IsIllustrative { get; set; }

    /// <summary>Required when clearing the flag: 1–300 characters naming the guideline,
    /// circular or notification consulted.</summary>
    public string? VerificationSourceReference { get; set; }

    /// <summary>Required when clearing the flag, and must not be later than today.</summary>
    public DateTime? VerifiedOn { get; set; }
}
