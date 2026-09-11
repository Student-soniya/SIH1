namespace SchemeReady.Api.Matching;

/// <summary>
/// Engine invariants fixed by R3.4, not Rule_Store data.
///
/// These three numbers are deliberately *not* admin-editable. The clamp range and the
/// recommendation threshold define what a MatchScore means, so moving them would
/// silently redefine every historical score; the thresholds and weights that *are*
/// policy move to the Rule_Store in Phase E instead.
///
/// Extracted from <c>Services/Services.cs</c> unchanged: <c>Math.Clamp(total, 10, 98)</c>
/// and <c>total &gt;= 75</c>.
/// </summary>
internal static class MatchScoreBounds
{
    /// <summary>Lower inclusive bound of the clamped MatchScore (R3.4).</summary>
    internal const int ClampMin = 10;

    /// <summary>Upper inclusive bound of the clamped MatchScore (R3.4).</summary>
    internal const int ClampMax = 98;

    /// <summary>IsRecommended is true if and only if the clamped score is at least this (R3.4).</summary>
    internal const int RecommendedAtOrAbove = 75;
}
