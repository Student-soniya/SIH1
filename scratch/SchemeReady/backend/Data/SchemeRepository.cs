using System.Text.Json;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Data;

public interface ISchemeRepository
{
    Task<List<Scheme>> GetAllSchemesAsync();
    Task<Scheme?> GetSchemeByIdAsync(string id);
    Task<Scheme> AddOrUpdateSchemeAsync(Scheme scheme);
    Task<List<ChannelPartner>> GetAllPartnersAsync();
    Task<ChannelPartner?> GetPartnerByIdAsync(string id);
    Task<ChannelPartner> AddOrUpdatePartnerAsync(ChannelPartner partner);
    Task<List<ApplicationPack>> GetAllApplicationsAsync();
    Task<ApplicationPack> SaveApplicationAsync(ApplicationPack pack);
    Task<AdminStatsResponse> GetAdminStatsAsync();
}

public class SchemeRepository : ISchemeRepository
{
    private static readonly object _lock = new();
    private static readonly List<Scheme> _schemes = new();
    private static readonly List<ChannelPartner> _partners = new();
    private static readonly List<ApplicationPack> _applications = new();

    static SchemeRepository()
    {
        SeedSchemes();
        SeedPartners();
        SeedSampleApplications();
    }

    private static void SeedSchemes()
    {
        _schemes.AddRange(new List<Scheme>
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
                Description = "Low-interest collateral-free micro credit up to Rs 1.5 Lakh tailored for quick disbursement through SCAs and NBFC-MFIs."
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
                Description = "Medium-term capital financing for machinery, commercial vehicles, and established workshops requiring higher capital investment."
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
                Description = "Highly subsidized credit program with 4% p.a. interest rate exclusively for women entrepreneurs and SHG members."
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
                Description = "Bridging capital scheme targeted at technically qualified or experienced youth establishing small commercial service units."
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
                Description = "Promotes environmentally sustainable micro-businesses such as electric passenger vehicles and solar installations."
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
                Description = "Concessional education credit for professional and skill certification courses with extended moratorium."
            }
        });
    }

    private static void SeedPartners()
    {
        _partners.AddRange(new List<ChannelPartner>
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
                Longitude = 77.5913
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
                Longitude = 77.6200
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
                Longitude = 77.5963
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
                Longitude = 77.5824
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
                Longitude = 77.5714
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
                Longitude = 76.6552
            }
        });
    }

    private static void SeedSampleApplications()
    {
        _applications.Add(new ApplicationPack
        {
            ApplicationId = "APP-2026-BLR-0941",
            GeneratedDate = DateTime.UtcNow.AddDays(-1),
            Profile = new BeneficiaryProfile
            {
                FullName = "Ravi Kumar",
                BusinessType = "Mobile repair shop",
                Location = "Bengaluru",
                EstimatedProjectCost = 180000,
                AnnualFamilyIncome = 360000,
                UserType = "new_entrepreneur",
                Category = "SC",
                HasCasteCertificate = false,
                HasIncomeCertificate = true,
                RequiredLoanAmount = 150000,
                PreferredLanguage = "kn"
            },
            SelectedScheme = _schemes[0],
            EligibilityReasons = new()
            {
                "Applicant belongs to the target Scheduled Caste community.",
                "Declared family income (Rs 3.6L) is within the eligible threshold.",
                "Project cost (Rs 1.8L) aligns with the micro-credit capital range.",
                "Suitable verified State Channelizing Agency is available in Bengaluru."
            },
            TrackingStatus = "Ready for Handoff",
            HandoffReferenceNumber = "SURAJ-2026-DEMO-7729"
        });
    }

    public Task<List<Scheme>> GetAllSchemesAsync() => Task.FromResult(_schemes.ToList());

    public Task<Scheme?> GetSchemeByIdAsync(string id) =>
        Task.FromResult(_schemes.FirstOrDefault(s => s.Id.Equals(id, StringComparison.OrdinalIgnoreCase)));

    public Task<Scheme> AddOrUpdateSchemeAsync(Scheme scheme)
    {
        lock (_lock)
        {
            if (string.IsNullOrWhiteSpace(scheme.Id))
            {
                scheme.Id = $"NSFDC-CUSTOM-{Guid.NewGuid().ToString("N")[..6].ToUpper()}";
            }
            var idx = _schemes.FindIndex(s => s.Id == scheme.Id);
            if (idx >= 0)
            {
                _schemes[idx] = scheme;
            }
            else
            {
                _schemes.Add(scheme);
            }
            return Task.FromResult(scheme);
        }
    }

    public Task<List<ChannelPartner>> GetAllPartnersAsync() => Task.FromResult(_partners.ToList());

    public Task<ChannelPartner?> GetPartnerByIdAsync(string id) =>
        Task.FromResult(_partners.FirstOrDefault(p => p.Id.Equals(id, StringComparison.OrdinalIgnoreCase)));

    public Task<ChannelPartner> AddOrUpdatePartnerAsync(ChannelPartner partner)
    {
        lock (_lock)
        {
            if (string.IsNullOrWhiteSpace(partner.Id))
            {
                partner.Id = $"PART-{partner.InstitutionType}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}";
            }
            var idx = _partners.FindIndex(p => p.Id == partner.Id);
            if (idx >= 0)
            {
                _partners[idx] = partner;
            }
            else
            {
                _partners.Add(partner);
            }
            return Task.FromResult(partner);
        }
    }

    public Task<List<ApplicationPack>> GetAllApplicationsAsync() => Task.FromResult(_applications.ToList());

    public Task<ApplicationPack> SaveApplicationAsync(ApplicationPack pack)
    {
        lock (_lock)
        {
            if (string.IsNullOrWhiteSpace(pack.ApplicationId))
            {
                pack.ApplicationId = $"APP-2026-{pack.Profile.Location[..Math.Min(3, pack.Profile.Location.Length)].ToUpper()}-{Random.Shared.Next(1000, 9999)}";
            }
            pack.GeneratedDate = DateTime.UtcNow;
            if (string.IsNullOrWhiteSpace(pack.HandoffReferenceNumber))
            {
                pack.HandoffReferenceNumber = $"SURAJ-2026-DEMO-{Random.Shared.Next(1000, 9999)}";
            }
            var idx = _applications.FindIndex(a => a.ApplicationId == pack.ApplicationId);
            if (idx >= 0)
            {
                _applications[idx] = pack;
            }
            else
            {
                _applications.Insert(0, pack);
            }
            return Task.FromResult(pack);
        }
    }

    public Task<AdminStatsResponse> GetAdminStatsAsync()
    {
        var response = new AdminStatsResponse
        {
            TotalSchemes = _schemes.Count,
            TotalVerifiedPartners = _partners.Count(p => p.LastVerifiedDate.Year >= 2026),
            TotalApplicationsPrepared = Math.Max(_applications.Count, 148), // realistic hackathon metric demo
            PopularBusinessCategories = new()
            {
                { "Mobile Repair & Electronics", 52 },
                { "Tailoring & Garments", 44 },
                { "Food Stall & Catering", 28 },
                { "Green Transport (E-Rickshaw)", 18 },
                { "Leathercraft & Artisans", 12 }
            },
            ApplicationsByDistrict = new()
            {
                { "Bengaluru Urban", 68 },
                { "Bengaluru Rural", 29 },
                { "Mysuru", 24 },
                { "Hubballi-Dharwad", 18 },
                { "Belagavi", 15 }
            },
            CommonMissingDocuments = new()
            {
                { "Caste Certificate (RD No)", 58 },
                { "Business Quotation", 42 },
                { "Income Certificate", 29 },
                { "Bank Account Proof", 11 }
            }
        };

        return Task.FromResult(response);
    }
}
