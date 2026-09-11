namespace SchemeReady.Api.Auth;

/// <summary>
/// The three roles of R4.14–R4.16, as constants so no attribute or check spells one by hand.
/// </summary>
public static class RoleNames
{
    public const string Beneficiary = "Beneficiary";
    public const string Officer = "Officer";
    public const string Admin = "Admin";

    /// <summary>The three-role set required by R4.15 for dossier and document endpoints.</summary>
    public const string AnySignedIn = Beneficiary + "," + Officer + "," + Admin;

    public static readonly string[] All = { Beneficiary, Officer, Admin };
}

/// <summary>Non-role claim types issued in the access token (design C6).</summary>
public static class SchemeReadyClaims
{
    /// <summary>The ChannelPartner an Officer may read dossiers for (R4.18).</summary>
    public const string PartnerId = "partner_id";
}
