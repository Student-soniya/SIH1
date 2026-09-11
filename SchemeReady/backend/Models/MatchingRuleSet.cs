namespace SchemeReady.Api.Models;

/// <summary>
/// The five score components of R3.1 as named fields.
///
/// A record of five named <c>int</c>s, deliberately not a dictionary: every read in
/// <c>SchemeMatchingService</c> is <c>rules.Weights.Eligibility</c>, resolved by the compiler.
/// A missing component is therefore impossible at the call site — it can only be missing in the
/// database, which is exactly where <see cref="Services.RuleSetProvider"/> catches it, at
/// startup and on every cache load (R7.8).
/// </summary>
/// <param name="Eligibility">Component 1 — seeded 40.</param>
/// <param name="ProjectCostFit">Component 2 — seeded 25.</param>
/// <param name="DocumentReadiness">Component 3 — seeded 15.</param>
/// <param name="PartnerAvailability">Component 4 — seeded 10.</param>
/// <param name="BusinessTypePreference">Component 5 — seeded 10.</param>
public sealed record ScoringWeights(
    int Eligibility,
    int ProjectCostFit,
    int DocumentReadiness,
    int PartnerAvailability,
    int BusinessTypePreference)
{
    public int Sum() =>
        Eligibility + ProjectCostFit + DocumentReadiness + PartnerAvailability + BusinessTypePreference;

    /// <summary>The five component names as stored in <c>ScoringWeights.ComponentName</c>.</summary>
    public static class Components
    {
        public const string Eligibility = "Eligibility";
        public const string ProjectCostFit = "ProjectCostFit";
        public const string DocumentReadiness = "DocumentReadiness";
        public const string PartnerAvailability = "PartnerAvailability";
        public const string BusinessTypePreference = "BusinessTypePreference";

        public static readonly string[] All =
        {
            Eligibility, ProjectCostFit, DocumentReadiness, PartnerAvailability, BusinessTypePreference
        };
    }

    public IReadOnlyDictionary<string, int> AsDictionary() => new Dictionary<string, int>(StringComparer.Ordinal)
    {
        [Components.Eligibility] = Eligibility,
        [Components.ProjectCostFit] = ProjectCostFit,
        [Components.DocumentReadiness] = DocumentReadiness,
        [Components.PartnerAvailability] = PartnerAvailability,
        [Components.BusinessTypePreference] = BusinessTypePreference
    };
}

/// <summary>
/// Every rule value <c>SchemeMatchingService</c> needs for one scheme, as named fields (design
/// C5). Each of the five component call sites reads one of these by name. There is no
/// reflection, no attribute lookup and no rule DSL anywhere in the matching path.
///
/// <see cref="Weights"/> is shared: the same <see cref="ScoringWeights"/> instance is attached
/// to every scheme's rule set, because R7.2 stores exactly five weight rows for the whole
/// engine, not five per scheme.
/// </summary>
public sealed record MatchingRuleSet(
    string SchemeId,
    int MinimumAge,
    int MaximumAge,
    decimal IncomeLimit,
    decimal MinimumProjectCost,
    decimal MaximumProjectCost,
    IReadOnlyList<string> EligibleBusinessTypes,
    IReadOnlyList<string> EligibleCategories,
    string GenderRestriction,
    decimal InterestRate,
    int MaximumTenureMonths,
    int MoratoriumMonths,
    ScoringWeights Weights);

/// <summary>
/// One immutable load of the whole Rule_Store: every scheme's rule set plus the five weights.
///
/// The design sketch in C5 shows the provider caching a single <see cref="MatchingRuleSet"/>.
/// It caches this instead, because R7.1 stores thresholds *per scheme* and matching iterates
/// every scheme in one request — caching per scheme would mean six loads behind one cache TTL
/// and no way to guarantee that a single request saw one consistent generation of the rules.
/// One snapshot per load, handed whole to the matching pass, makes a request atomic with
/// respect to an admin save: it either sees all the old values or all the new ones.
/// </summary>
public sealed record MatchingRuleSetSnapshot(
    IReadOnlyDictionary<string, MatchingRuleSet> BySchemeId,
    ScoringWeights Weights)
{
    /// <summary>
    /// The rule set for one scheme, or a hard failure naming the scheme and the missing field
    /// (R3.8, R7.5). It never returns a default: a scheme with no rule row cannot be scored,
    /// and scoring it from hard-coded fallbacks is precisely the behaviour this phase removes.
    /// </summary>
    public MatchingRuleSet ForScheme(string schemeId)
    {
        if (BySchemeId.TryGetValue(schemeId, out var set))
        {
            return set;
        }

        throw new RuleDataInvalidException(schemeId, "SchemeRules row",
            $"No Rule_Store row exists for scheme '{schemeId}'. Matching cannot proceed and no default threshold is substituted.");
    }
}

/// <summary>
/// The Rule_Store could not be read and no cached copy younger than the TTL exists (R7.5).
/// Surfaces as 503; never as a stale or defaulted rule value.
/// </summary>
public class RuleStoreUnavailableException : Exception
{
    public RuleStoreUnavailableException(string message, Exception? inner = null) : base(message, inner)
    {
    }
}

/// <summary>
/// The Rule_Store was read successfully but holds data that cannot be scored — a missing row,
/// a missing weight component, a value outside the declared bounds, or weights not summing to
/// 100 (R3.8, R7.5, R7.8). Names the scheme and the field, substitutes nothing, and yields no
/// partial results.
/// </summary>
public class RuleDataInvalidException : Exception
{
    public RuleDataInvalidException(string schemeIdOrComponent, string fieldName, string message)
        : base(message)
    {
        SchemeIdOrComponent = schemeIdOrComponent;
        FieldName = fieldName;
    }

    public string SchemeIdOrComponent { get; }

    public string FieldName { get; }
}
