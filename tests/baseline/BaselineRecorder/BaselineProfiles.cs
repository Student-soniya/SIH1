using SchemeReady.Api.Models;

namespace SchemeReady.Baseline;

/// <summary>
/// A named baseline case: one profile plus the reason it is in the set.
/// </summary>
public sealed record BaselineCase(string Key, string Coverage, BeneficiaryProfile Profile);

/// <summary>
/// The seven checked-in profiles that R3.7 requires the baseline to cover.
///
/// Shared by <see cref="Program"/> (which records them) and <c>BaselineEqualityTests</c>
/// (which replays them), so the recorded and asserted inputs can never drift apart.
///
/// Every profile keeps <c>Category = "SC"</c> and both certificates present unless the
/// case under test needs otherwise, so each case isolates one variable. Values are chosen
/// to hit their branch against *all six* seeded schemes at once — an income of 600,000
/// exceeds every scheme limit, a cost of 5,000 is below every minimum, a cost of
/// 2,000,000 is above every ceiling — which is what makes the expected values tractable
/// to review by hand.
/// </summary>
public static class BaselineProfiles
{
    public static IReadOnlyList<BaselineCase> All => new List<BaselineCase>
    {
        // 1. Every component at its maximum, at least for NSFDC-MCS-01 and NSFDC-MSY-03:
        //    target category, income within limit, cost in range, both certificates,
        //    a supporting partner in the district, and a promoted business type.
        //
        //    FullName is deliberately "Ravi Kumar" while Gender is "Female". Before Phase B
        //    the name substring "Ravi" was what barred an applicant from the women-only
        //    scheme, so this profile would have been penalised on MSY-03. It is not any
        //    more: the declared gender satisfies the restriction, and the name is read
        //    nowhere in scoring (R3.5).
        new("all-components-maximal",
            "All five components at maximum for MCS-01 and MSY-03; proves FullName no longer gates MSY.",
            new BeneficiaryProfile
            {
                Id = "BASE0001",
                FullName = "Ravi Kumar",
                Gender = "Female",
                BusinessType = "tailoring",
                Location = "Bengaluru",
                Category = "SC",
                Age = 28,
                AnnualFamilyIncome = 250000,
                EstimatedProjectCost = 120000,
                RequiredLoanAmount = 120000,
                HasCasteCertificate = true,
                HasIncomeCertificate = true,
                UploadedDocs = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Business quotation" }
            }),

        // 2. Income above every scheme's limit: eligibility loses its income half on all six.
        new("income-above-limit",
            "AnnualFamilyIncome exceeds the IncomeLimit of all six seeded schemes.",
            new BeneficiaryProfile
            {
                Id = "BASE0002",
                FullName = "Ravi Kumar",
                Gender = "Female",
                BusinessType = "tailoring",
                Location = "Bengaluru",
                Category = "SC",
                Age = 28,
                AnnualFamilyIncome = 600000,
                EstimatedProjectCost = 120000,
                RequiredLoanAmount = 120000,
                HasCasteCertificate = true,
                HasIncomeCertificate = true,
                UploadedDocs = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Business quotation" }
            }),

        // 3. Cost below every scheme's minimum (lowest seeded minimum is 10,000).
        new("cost-below-minimum",
            "EstimatedProjectCost below the MinimumProjectCost of all six seeded schemes.",
            new BeneficiaryProfile
            {
                Id = "BASE0003",
                FullName = "Ravi Kumar",
                Gender = "Female",
                BusinessType = "tailoring",
                Location = "Bengaluru",
                Category = "SC",
                Age = 28,
                AnnualFamilyIncome = 250000,
                EstimatedProjectCost = 5000,
                RequiredLoanAmount = 5000,
                HasCasteCertificate = true,
                HasIncomeCertificate = true,
                UploadedDocs = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Business quotation" }
            }),

        // 4. Cost above every scheme's ceiling (highest seeded ceiling is 1,500,000).
        new("cost-above-maximum",
            "EstimatedProjectCost above the MaximumProjectCost of all six seeded schemes.",
            new BeneficiaryProfile
            {
                Id = "BASE0004",
                FullName = "Ravi Kumar",
                Gender = "Female",
                BusinessType = "tailoring",
                Location = "Bengaluru",
                Category = "SC",
                Age = 28,
                AnnualFamilyIncome = 250000,
                EstimatedProjectCost = 2000000,
                RequiredLoanAmount = 2000000,
                HasCasteCertificate = true,
                HasIncomeCertificate = true,
                UploadedDocs = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Business quotation" }
            }),

        // 5. A district no seeded partner serves. Note the partner filter is a substring
        //    test, so "Bengaluru" would also match "Bengaluru Rural"; "Kalaburagi" appears
        //    in scheme SupportedDistricts but in no ChannelPartner.District.
        new("no-partner-in-district",
            "Location matches no ChannelPartner district, so the partner component drops to its floor for all six schemes.",
            new BeneficiaryProfile
            {
                Id = "BASE0005",
                FullName = "Ravi Kumar",
                Gender = "Female",
                BusinessType = "tailoring",
                Location = "Kalaburagi",
                Category = "SC",
                Age = 28,
                AnnualFamilyIncome = 250000,
                EstimatedProjectCost = 120000,
                RequiredLoanAmount = 120000,
                HasCasteCertificate = true,
                HasIncomeCertificate = true,
                UploadedDocs = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Business quotation" }
            }),

        // 6. A business type matching no scheme in either direction of the bidirectional
        //    Contains test, combined with a missing caste certificate so the baseline also
        //    pins MissingDocuments and the certificates-required negative reason.
        new("unmatched-business-type",
            "BusinessType matches no EligibleBusinessTypes entry either way; also exercises MissingDocuments via an absent caste certificate.",
            new BeneficiaryProfile
            {
                Id = "BASE0006",
                FullName = "Ravi Kumar",
                Gender = "Female",
                BusinessType = "astrology consultancy",
                Location = "Bengaluru",
                Category = "SC",
                Age = 28,
                AnnualFamilyIncome = 250000,
                EstimatedProjectCost = 120000,
                RequiredLoanAmount = 120000,
                HasCasteCertificate = false,
                HasIncomeCertificate = true,
                UploadedDocs = new() { "Aadhaar/KYC", "Income certificate", "Business quotation" }
            }),

        // 7. The gender-restricted scheme. Gender "Male" does not satisfy MSY-03's "Female"
        //    restriction, so eligibility loses the gender penalty and the reserved-gender
        //    negative reason appears — on that scheme only. FullName is a conventionally
        //    female name to make the point that the name is irrelevant: pre-Phase-B code
        //    would have applied *no* penalty here.
        new("gender-restricted-scheme",
            "Declared gender does not satisfy NSFDC-MSY-03's Female restriction; the other five schemes declare Any and are unaffected.",
            new BeneficiaryProfile
            {
                Id = "BASE0007",
                FullName = "Sunita Devi",
                Gender = "Male",
                BusinessType = "tailoring",
                Location = "Bengaluru",
                Category = "SC",
                Age = 28,
                AnnualFamilyIncome = 250000,
                EstimatedProjectCost = 120000,
                RequiredLoanAmount = 120000,
                HasCasteCertificate = true,
                HasIncomeCertificate = true,
                UploadedDocs = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Business quotation" }
            })
    };
}
