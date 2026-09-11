using SchemeReady.Api.Matching;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Data;

/// <summary>
/// Baseline rows inserted by <see cref="DatabaseSeeder"/>.
///
/// These are the six <see cref="Scheme"/> and six <see cref="ChannelPartner"/> object
/// initialisers that previously lived in <c>SchemeRepository.SeedSchemes()</c> and
/// <c>SchemeRepository.SeedPartners()</c>, moved here verbatim. The only addition is
/// <c>IsIllustrative = true</c> on every row (R2.1): the clause numbers, interest rates
/// and last-verified dates below are sample values that nobody has checked against
/// current official NSFDC guidelines, so every response carrying them is labelled.
///
/// A new <see cref="Scheme"/> / <see cref="ChannelPartner"/> instance is constructed on
/// every property read so a caller that mutates a returned entity — or an EF change
/// tracker that attaches one — can never corrupt the baseline for a later seeder run.
/// </summary>
public static partial class SeedData
{
    public static IReadOnlyList<Scheme> Schemes => new List<Scheme>
    {
        new()
        {
            Id = "NSFDC-MCS-01",
            Name = "Micro Credit Scheme (MCS)",
            SchemeType = "Micro Credit",
            TargetGroup = "Scheduled Caste / Micro Entrepreneurs",
            MinimumAge = 18,
            MaximumAge = 60,
            IncomeLimit = 300000, // INR 3 Lakh annual family income
            MinimumProjectCost = 10000,
            MaximumProjectCost = 150000, // Up to 1.5 Lakh
            EligibleBusinessTypes = new() { "tailoring", "mobile repair", "grocery", "tea stall", "carpentry", "leather craft", "barber shop", "vegetable vending", "handicrafts", "food cart" },
            InterestRate = 5.0m, // 5% per annum
            MaximumTenureMonths = 36,
            MoratoriumMonths = 3,
            RequiredDocuments = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Bank account proof", "Business quotation" },
            SupportedDistricts = new() { "Bengaluru", "Bengaluru Rural", "Mysuru", "Hubballi-Dharwad", "Belagavi", "Kalaburagi", "Mangaluru", "Tumakuru" },
            ApplicationMode = "Offline",
            OfficialUrl = "https://nsfdc.nic.in/schemes/micro-credit-scheme",
            SourceDocument = "NSFDC Operational Guidelines 2024-26, Clause 4.2",
            LastVerifiedDate = new DateTime(2026, 9, 10),
            Status = "Verified",
            Description = "Low-interest collateral-free micro credit up to Rs 1.5 Lakh tailored for quick disbursement through SCAs and NBFC-MFIs.",
            IsIllustrative = true
        },
        new()
        {
            Id = "NSFDC-TLS-02",
            Name = "Term Loan Scheme (TLS)",
            SchemeType = "Term Loan",
            TargetGroup = "Scheduled Caste Entrepreneurs",
            MinimumAge = 18,
            MaximumAge = 55,
            IncomeLimit = 500000, // Up to 5 Lakh for term loans
            MinimumProjectCost = 200000,
            MaximumProjectCost = 1500000, // Up to 15 Lakh
            EligibleBusinessTypes = new() { "manufacturing", "transport", "mobile repair", "auto workshop", "food processing", "tailoring unit", "garment boutique", "dairy unit", "solar equipment" },
            InterestRate = 6.0m, // 6% per annum
            MaximumTenureMonths = 60,
            MoratoriumMonths = 6,
            RequiredDocuments = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Bank account proof", "Business plan / DPR", "Equipment quotation", "Premises agreement" },
            SupportedDistricts = new() { "Bengaluru", "Mysuru", "Hubballi-Dharwad", "Belagavi", "Kalaburagi", "Mangaluru" },
            ApplicationMode = "Hybrid",
            OfficialUrl = "https://nsfdc.nic.in/schemes/term-loan-scheme",
            SourceDocument = "NSFDC Lending Policy Master Circular 2025-26",
            LastVerifiedDate = new DateTime(2026, 9, 10),
            Status = "Verified",
            Description = "Medium-term capital financing for machinery, commercial vehicles, and established workshops requiring higher capital investment.",
            IsIllustrative = true
        },
        new()
        {
            Id = "NSFDC-MSY-03",
            Name = "Mahila Samriddhi Yojana (MSY)",
            SchemeType = "Women Entrepreneurship",
            TargetGroup = "Scheduled Caste Women Entrepreneurs",
            MinimumAge = 18,
            MaximumAge = 60,
            IncomeLimit = 300000,
            MinimumProjectCost = 10000,
            MaximumProjectCost = 140000,
            EligibleBusinessTypes = new() { "tailoring", "embroidery", "beauty parlour", "food stall", "handloom", "spices packaging", "dairy", "pottery" },
            InterestRate = 4.0m, // Concessional 4% p.a.
            MaximumTenureMonths = 42,
            MoratoriumMonths = 4,
            RequiredDocuments = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Bank account proof", "Self-help group endorsement / Quotation" },
            SupportedDistricts = new() { "Bengaluru", "Bengaluru Rural", "Mysuru", "Hubballi-Dharwad", "Belagavi", "Kalaburagi", "Kolar", "Mandya" },
            ApplicationMode = "Offline",
            OfficialUrl = "https://nsfdc.nic.in/schemes/mahila-samriddhi-yojana",
            SourceDocument = "NSFDC Women Empowerment Window Guidelines 2026",
            LastVerifiedDate = new DateTime(2026, 9, 10),
            Status = "Verified",
            Description = "Highly subsidized credit program with 4% p.a. interest rate exclusively for women entrepreneurs and SHG members.",
            IsIllustrative = true,

            // The one row in this file that is not a verbatim carry-over from the
            // in-memory repository (R3.5).
            //
            // Mahila Samriddhi Yojana is women-only — the TargetGroup, Description and
            // SourceDocument above all say so. Until Phase B that rule was enforced
            // nowhere in the data: it lived in Services.cs as
            // `profile.FullName.Contains("Ravi")`. Deleting that gate without setting this
            // field would have silently dropped the restriction, which is why the two
            // changes ship together. Migration 20260102000000 backfills databases that
            // were seeded before this line existed — the seeder itself never updates an
            // existing row.
            GenderRestriction = "Female"
        },
        new()
        {
            Id = "NSFDC-LUY-04",
            Name = "Laghu Udhyami Yojana (LUY)",
            SchemeType = "Small Enterprise",
            TargetGroup = "First-time & Youth SC Entrepreneurs",
            MinimumAge = 20,
            MaximumAge = 45,
            IncomeLimit = 350000,
            MinimumProjectCost = 100000,
            MaximumProjectCost = 500000,
            EligibleBusinessTypes = new() { "mobile repair", "digital printing", "fabrication", "electrical repairs", "catering", "two-wheeler repair", "plumbing enterprise" },
            InterestRate = 5.5m,
            MaximumTenureMonths = 48,
            MoratoriumMonths = 3,
            RequiredDocuments = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Technical certificate / Skill proof", "Equipment quotation" },
            SupportedDistricts = new() { "Bengaluru", "Mysuru", "Hubballi-Dharwad", "Belagavi" },
            ApplicationMode = "Hybrid",
            OfficialUrl = "https://nsfdc.nic.in/schemes/laghu-udhyami",
            SourceDocument = "Ministry of Social Justice & Empowerment Notification 2025",
            LastVerifiedDate = new DateTime(2026, 8, 25),
            Status = "Verified",
            Description = "Bridging capital scheme targeted at technically qualified or experienced youth establishing small commercial service units.",
            IsIllustrative = true
        },
        new()
        {
            Id = "NSFDC-GBS-05",
            Name = "Green Business Scheme (GBS)",
            SchemeType = "Green Economy",
            TargetGroup = "Scheduled Caste Individuals / Groups",
            MinimumAge = 18,
            MaximumAge = 55,
            IncomeLimit = 350000,
            MinimumProjectCost = 50000,
            MaximumProjectCost = 300000,
            EligibleBusinessTypes = new() { "e-rickshaw", "battery charging station", "solar lighting kit", "solid waste composting", "polyhouse farming" },
            InterestRate = 5.0m,
            MaximumTenureMonths = 48,
            MoratoriumMonths = 6,
            RequiredDocuments = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Driving license (for vehicles)", "Equipment quotation" },
            SupportedDistricts = new() { "Bengaluru", "Mysuru", "Hubballi-Dharwad", "Belagavi", "Kalaburagi" },
            ApplicationMode = "Offline",
            OfficialUrl = "https://nsfdc.nic.in/schemes/green-business",
            SourceDocument = "National Climate Adaptation & Clean Tech Livelihoods Mandate 2025",
            LastVerifiedDate = new DateTime(2026, 9, 05),
            Status = "Verified",
            Description = "Promotes environmentally sustainable micro-businesses such as electric passenger vehicles and solar installations.",
            IsIllustrative = true
        },
        new()
        {
            Id = "NSFDC-SLS-06",
            Name = "Skill & Education Loan Scheme (SLS)",
            SchemeType = "Education & Skill",
            TargetGroup = "SC Students & Vocational Trainees",
            MinimumAge = 17,
            MaximumAge = 35,
            IncomeLimit = 450000,
            MinimumProjectCost = 50000,
            MaximumProjectCost = 400000,
            EligibleBusinessTypes = new() { "student", "vocational training", "it certification", "paramedical", "aviation technician" },
            InterestRate = 4.0m,
            MaximumTenureMonths = 60,
            MoratoriumMonths = 12, // Course duration + 6 months
            RequiredDocuments = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Admission letter", "Fee structure breakdown" },
            SupportedDistricts = new() { "Bengaluru", "Mysuru", "Hubballi-Dharwad", "Belagavi", "Kalaburagi", "Mangaluru" },
            ApplicationMode = "Online",
            OfficialUrl = "https://nsfdc.nic.in/schemes/education-loan",
            SourceDocument = "NSFDC Human Capital Development Guidelines 2025",
            LastVerifiedDate = new DateTime(2026, 9, 01),
            Status = "Verified",
            Description = "Concessional education credit for professional and skill certification courses with extended moratorium.",
            IsIllustrative = true
        }
    };

    public static IReadOnlyList<ChannelPartner> Partners => new List<ChannelPartner>
    {
        new()
        {
            Id = "PART-SCA-01",
            InstitutionName = "Karnataka State Dr. B.R. Ambedkar Development Corporation (SCA)",
            InstitutionType = "SCA",
            District = "Bengaluru",
            State = "Karnataka",
            DistanceKm = 4.2,
            ContactNumber = "+91 80 2286 4521 / +91 94808 12345",
            ContactPerson = "Shri M. Nagaraj (District Manager)",
            Address = "No. 9 & 10, Vishweshwaraiah Towers, 9th Floor, Dr. Ambedkar Veedhi, Bengaluru - 560001",
            ApplicationMode = "Offline",
            SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-TLS-02", "NSFDC-MSY-03", "NSFDC-LUY-04", "NSFDC-GBS-05" },
            DocumentRequirements = new() { "Aadhaar copy", "Caste certificate (RD number)", "Income certificate", "Bank passbook copy", "Two passport photos", "Quotation" },
            LastVerifiedDate = new DateTime(2026, 9, 10),
            IsOnlineSubmissionAvailable = false,
            Pincode = "560001",
            Latitude = 12.9791,
            Longitude = 77.5913,
            IsIllustrative = true
        },
        new()
        {
            Id = "PART-PSB-02",
            InstitutionName = "Canara Bank - MSME & Financial Inclusion Hub",
            InstitutionType = "PSB",
            District = "Bengaluru",
            State = "Karnataka",
            DistanceKm = 6.8,
            ContactNumber = "+91 80 2558 7720",
            ContactPerson = "Ms. Sunita Rao (Chief Manager MSME)",
            Address = "MG Road Branch, Near Trinity Metro Station, Bengaluru - 560001",
            ApplicationMode = "Hybrid",
            SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-TLS-02", "NSFDC-LUY-04" },
            DocumentRequirements = new() { "KYC docs", "Caste certificate", "ITR/Income declaration", "Business DPR", "Vendor quotation" },
            LastVerifiedDate = new DateTime(2026, 9, 08),
            IsOnlineSubmissionAvailable = true,
            Pincode = "560001",
            Latitude = 12.9734,
            Longitude = 77.6200,
            IsIllustrative = true
        },
        new()
        {
            Id = "PART-RRB-03",
            InstitutionName = "Karnataka Gramin Bank (RRB Head Office Region)",
            InstitutionType = "RRB",
            District = "Bengaluru Rural",
            State = "Karnataka",
            DistanceKm = 14.5,
            ContactNumber = "+91 80 2793 1102",
            ContactPerson = "Shri Ramesh Kulkarni (Agri & Microcredit Officer)",
            Address = "Doddaballapur Main Road, Yelahanka Sub-hub, Bengaluru - 560064",
            ApplicationMode = "Offline",
            SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-MSY-03", "NSFDC-GBS-05" },
            DocumentRequirements = new() { "Aadhaar", "Ration card", "Caste cert", "Local panchayat NOC", "Quotation" },
            LastVerifiedDate = new DateTime(2026, 9, 05),
            IsOnlineSubmissionAvailable = false,
            Pincode = "560064",
            Latitude = 13.1007,
            Longitude = 77.5963,
            IsIllustrative = true
        },
        new()
        {
            Id = "PART-MFI-04",
            InstitutionName = "Grameen Koota Financial Services (NBFC-MFI Channel Partner)",
            InstitutionType = "NBFC-MFI",
            District = "Bengaluru",
            State = "Karnataka",
            DistanceKm = 5.4,
            ContactNumber = "1800 103 4567 / +91 80 4125 8899",
            ContactPerson = "Ms. Kavitha Gowda (Branch Coordinator)",
            Address = "Jayanagar 4th Block, Near BDA Complex, Bengaluru - 560011",
            ApplicationMode = "Hybrid",
            SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-MSY-03" },
            DocumentRequirements = new() { "Aadhaar Card", "Voter ID", "Bank statement", "Self-declaration of income" },
            LastVerifiedDate = new DateTime(2026, 9, 09),
            IsOnlineSubmissionAvailable = true,
            Pincode = "560011",
            Latitude = 12.9299,
            Longitude = 77.5824,
            IsIllustrative = true
        },
        new()
        {
            Id = "PART-SCA-05",
            InstitutionName = "Dr. Babu Jagjivan Ram Leather Industries Development Corporation (LIDKAR)",
            InstitutionType = "SCA",
            District = "Bengaluru",
            State = "Karnataka",
            DistanceKm = 8.1,
            ContactNumber = "+91 80 2334 0982",
            ContactPerson = "Shri Suresh Babu (Marketing & Credit GM)",
            Address = "LIDKAR Bhavan, 1st Cross, Sampige Road, Malleshwaram, Bengaluru - 560003",
            ApplicationMode = "Offline",
            SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-TLS-02" },
            DocumentRequirements = new() { "Aadhaar", "Caste certificate", "Artisan registration/Quotation" },
            LastVerifiedDate = new DateTime(2026, 8, 30),
            IsOnlineSubmissionAvailable = false,
            Pincode = "560003",
            Latitude = 12.9988,
            Longitude = 77.5714,
            IsIllustrative = true
        },
        new()
        {
            Id = "PART-PSB-06",
            InstitutionName = "State Bank of India - SME City Credit Center (SMECCC)",
            InstitutionType = "PSB",
            District = "Mysuru",
            State = "Karnataka",
            DistanceKm = 142.0,
            ContactNumber = "+91 821 242 3311",
            ContactPerson = "Shri Anand V. (Assistant General Manager)",
            Address = "Devaraj Urs Road, Near Suburb Bus Stand, Mysuru - 570001",
            ApplicationMode = "Hybrid",
            SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-TLS-02", "NSFDC-LUY-04" },
            DocumentRequirements = new() { "KYC", "Caste cert", "Income proof", "Project estimate" },
            LastVerifiedDate = new DateTime(2026, 9, 02),
            IsOnlineSubmissionAvailable = true,
            Pincode = "570001",
            Latitude = 12.3051,
            Longitude = 76.6552,
            IsIllustrative = true
        }
    };
}


/// <summary>
/// Rule_Store baseline rows (R7.9). Split into its own partial so the scheme and partner
/// initialisers above stay a verbatim carry-over that is easy to diff.
///
/// THE WHOLE POINT OF THIS FILE. R3.7 freezes <c>tests/baseline/MatchingBaseline.json</c>
/// against the behaviour of the pre-Phase-E engine, and R7.9 requires the seeded rules to
/// equal the literals that engine used. Rather than retype those numbers — where a single
/// transposed digit would be a silent behaviour change that only the baseline test could
/// catch — every threshold below is *projected from the very same
/// <see cref="SeedData.Schemes"/> object initialiser the engine used to read*, and every
/// weight is projected from <c>SeededWeights</c>, which is the class Phase B moved those
/// literals into. Equality is therefore structural, not transcribed.
/// </summary>
public static partial class SeedData
{
    /// <summary>
    /// The applicant categories the engine previously hard-coded as
    /// <c>Category == "SC" || Category == "Safai Karamchari"</c> — one list, applied to every
    /// scheme, exactly as the deleted expression was applied to every scheme.
    /// </summary>
    private static readonly string[] SeededEligibleCategories = { "SC", "Safai Karamchari" };

    /// <summary>
    /// One <see cref="SchemeRuleRow"/> per seeded <see cref="Scheme"/>, thresholds copied
    /// field-for-field off the scheme row.
    ///
    /// ONE DEVIATION, and it is deliberate. <c>NSFDC-SLS-06</c> declares
    /// <c>MinimumAge = 17</c>, which lies outside R7.1's 18–75 bound and would be rejected by
    /// the <c>CHECK</c> constraint this phase adds. The value is clamped to the bound here
    /// rather than the bound being widened to fit the data. That is safe to assert rather than
    /// hope: no eligibility check, no score component and no reason string in
    /// <c>SchemeMatchingService</c> reads <c>MinimumAge</c> or <c>MaximumAge</c> at all — the
    /// engine has never scored age — so the clamp cannot move a <c>MatchScore</c> or a reason
    /// string, and <c>MatchingBaseline.json</c> is unaffected. <see cref="Scheme.MinimumAge"/>
    /// on the scheme row keeps its 17 for display.
    /// </summary>
    public static IReadOnlyList<SchemeRuleRow> MatchingRules => Schemes
        .Select(s => new SchemeRuleRow
        {
            SchemeId = s.Id,

            MinimumAge = Math.Clamp(s.MinimumAge, RuleBounds.MinAge, RuleBounds.MaxAge),
            MaximumAge = Math.Clamp(s.MaximumAge, RuleBounds.MinAge, RuleBounds.MaxAge),

            // Read by the eligibility component.
            IncomeLimit = s.IncomeLimit,

            // Read by the project-cost-fit component.
            MinimumProjectCost = s.MinimumProjectCost,
            MaximumProjectCost = s.MaximumProjectCost,

            // Read by the business-type-preference component. A copy, not the same list
            // instance: an EF change tracker attaching this row must not be able to reach the
            // scheme's collection.
            EligibleBusinessTypes = new List<string>(s.EligibleBusinessTypes),

            EligibleCategories = new List<string>(SeededEligibleCategories),

            // Carried from the scheme row at seed time; from here on the Rule_Store is the
            // authority the engine reads (see SchemeRuleRow's remarks). "Female" for
            // NSFDC-MSY-03, "Any" for the rest.
            GenderRestriction = s.GenderRestriction,

            // Not scoring inputs — the EMI projection attached to each result.
            InterestRate = s.InterestRate,
            MaximumTenureMonths = s.MaximumTenureMonths,
            MoratoriumMonths = s.MoratoriumMonths
        })
        .ToList();

    /// <summary>
    /// The five weight rows of R7.2, seeded 40/25/15/10/10 — taken from <c>SeededWeights</c>,
    /// the class Phase B extracted those literals into, so the seeded value and the
    /// pre-Phase-E literal are the same declaration and cannot drift apart.
    /// </summary>
    public static IReadOnlyList<ScoringWeight> MatchingWeights => new List<ScoringWeight>
    {
        new() { ComponentName = ScoringWeights.Components.Eligibility,            Weight = SeededWeights.Eligibility },
        new() { ComponentName = ScoringWeights.Components.ProjectCostFit,         Weight = SeededWeights.ProjectCost },
        new() { ComponentName = ScoringWeights.Components.DocumentReadiness,      Weight = SeededWeights.Documents },
        new() { ComponentName = ScoringWeights.Components.PartnerAvailability,    Weight = SeededWeights.Partner },
        new() { ComponentName = ScoringWeights.Components.BusinessTypePreference, Weight = SeededWeights.BusinessType }
    };

    /// <summary>
    /// The stored sample profile the admin rule editor previews against (R7.11). A checked-in
    /// constant rather than an arbitrary live dossier, so two admins comparing a pending edit
    /// are comparing the same thing, and so the preview reveals nobody's application data.
    ///
    /// These are the <see cref="BeneficiaryProfile"/> property defaults — the profile the
    /// baseline recorder's "typical applicant" case uses.
    /// </summary>
    public static BeneficiaryProfile SamplePreviewProfile => new()
    {
        Id = "SAMPLE01",
        FullName = "Sample Applicant",
        BusinessType = "tailoring",
        Location = "Bengaluru",
        EstimatedProjectCost = 120000,
        AnnualFamilyIncome = 250000,
        UserType = "new_entrepreneur",
        Category = "SC",
        HasCasteCertificate = false,
        HasIncomeCertificate = true,
        RequiredLoanAmount = 120000,
        SupportPreference = "offline",
        PreferredLanguage = "en",
        Age = 28,
        UploadedDocs = new() { "Aadhaar/KYC", "Income certificate" },
        Gender = "Any"
    };
}
