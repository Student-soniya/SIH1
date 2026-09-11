using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using SchemeReady.Api.Models;

namespace SchemeReady.Baseline;

/// <summary>
/// Root of <c>tests/baseline/MatchingBaseline.json</c>.
/// </summary>
public sealed class BaselineDocument
{
    public int SchemaVersion { get; set; } = 1;

    /// <summary>UTC timestamp of the recording run; null while the file is hand-derived.</summary>
    public string? RecordedAt { get; set; }

    /// <summary>
    /// True while the expected values were traced by hand rather than recorded from a
    /// running process. <c>BaselineEqualityTests</c> emits a loud warning in its failure
    /// message while this is true, because a hand-derived file that disagrees with the
    /// code is as likely to be wrong itself as to have caught a regression.
    /// </summary>
    public bool HandDerived { get; set; }

    public string Notes { get; set; } = string.Empty;

    public List<BaselineProfileRecord> Profiles { get; set; } = new();
}

public sealed class BaselineProfileRecord
{
    public string Key { get; set; } = string.Empty;
    public string Coverage { get; set; } = string.Empty;
    public BeneficiaryProfile Profile { get; set; } = new();

    /// <summary>The full result list in the exact order the service returned it.</summary>
    public List<BaselineResultRecord> Results { get; set; } = new();
}

/// <summary>
/// One <c>SchemeMatchResult</c>, reduced to the fields R3.7 makes the oracle: identity,
/// score, recommendation flag, and the three explanation string lists in order. Ordering
/// itself is carried by the position of this record inside <see cref="BaselineProfileRecord.Results"/>.
///
/// <c>PartnerAvailability</c> is included because it is engine output, not a passthrough.
///
/// Deliberately excluded: <c>SchemeName</c>, <c>SchemeType</c>, <c>MaxLoanEligible</c>,
/// <c>InterestRate</c>, <c>TenureMonths</c>, <c>OfficialUrl</c>, <c>SourceDocument</c>,
/// <c>LastVerifiedDate</c>, <c>IsIllustrative</c> and <c>DataProvenance</c> — every one is
/// a verbatim projection of a <c>Scheme</c> column, so pinning them here would turn the
/// oracle into a copy of <c>SeedData</c> and would fail on any harmless catalogue edit
/// (a corrected URL, a re-verification date) that Phase E is not supposed to freeze.
/// </summary>
public sealed class BaselineResultRecord
{
    public string SchemeId { get; set; } = string.Empty;
    public int MatchScore { get; set; }
    public bool IsRecommended { get; set; }
    public List<string> PositiveReasons { get; set; } = new();
    public List<string> NegativeReasons { get; set; } = new();
    public List<string> MissingDocuments { get; set; } = new();
    public string PartnerAvailability { get; set; } = string.Empty;

    /// <summary>
    /// Indicative EMI. Null in the hand-derived file: the EMI formula raises
    /// <c>(1 + r)</c> to the tenure power in <c>double</c> and rounds the result, which
    /// cannot be reproduced by hand at the bit level. The recorder fills it in, and
    /// <c>BaselineEqualityTests</c> asserts it only when it is present.
    /// </summary>
    public decimal? EstimatedEmi { get; set; }
}

public static class BaselineJson
{
    /// <summary>
    /// Shared by the recorder and the test so a formatting difference can never be
    /// mistaken for a behavioural one. <see cref="UnsafeRelaxedJsonEscaping"/> keeps the
    /// U+2019 apostrophe in "applicant’s district" literal in the file rather than
    /// escaping it to <c>\u2019</c>, which makes the baseline reviewable in a diff.
    /// </summary>
    public static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        WriteIndented = true,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        DefaultIgnoreCondition = JsonIgnoreCondition.Never
    };
}
