using SchemeReady.Api.Models;

namespace SchemeReady.Api.Services;

/// <summary>
/// The canonical provenance notice and the projection that attaches it.
///
/// The seeded scheme rows cite specific NSFDC clause numbers, interest rates and a
/// last-verified date that nobody has checked against official guidelines. Until an Admin
/// verifies a row and clears its flag, every response carrying that row's fields says so —
/// so a beneficiary can never mistake an invented clause number for official guidance.
/// </summary>
public static class DataProvenance
{
    /// <summary>
    /// One definition, used by the API and mirrored byte-for-byte by the client-side
    /// fallbacks in <c>src/api.js</c>, so a badge looks identical whichever produced the
    /// record (R2.2, R2.9).
    /// </summary>
    public const string Text =
        "Interest rate, cited source document and last-verified date are illustrative sample values pending verification against current official NSFDC guidelines.";

    /// <summary>Provenance text for an illustrative row; null — and therefore omitted from
    /// the response entirely — for a verified one (R2.5).</summary>
    public static string? For(bool isIllustrative) => isIllustrative ? Text : null;

    public static Scheme Project(Scheme scheme)
    {
        scheme.DataProvenance = For(scheme.IsIllustrative);
        return scheme;
    }

    public static ChannelPartner Project(ChannelPartner partner)
    {
        partner.DataProvenance = For(partner.IsIllustrative);
        return partner;
    }

    public static List<Scheme> Project(List<Scheme> schemes)
    {
        foreach (var scheme in schemes) Project(scheme);
        return schemes;
    }

    public static List<ChannelPartner> Project(List<ChannelPartner> partners)
    {
        foreach (var partner in partners) Project(partner);
        return partners;
    }

    /// <summary>
    /// Projects onto a whole dossier: the embedded scheme, the routed partner, and a
    /// top-level notice used by the frontend to decide whether the application pack needs
    /// the channel-partner confirmation statement of R2.8.
    /// </summary>
    public static ApplicationPack Project(ApplicationPack pack)
    {
        Project(pack.SelectedScheme);
        Project(pack.NearestPartner);
        return pack;
    }
}
