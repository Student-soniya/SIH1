using System.Security.Cryptography;
using System.Text;
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
    
    // Auth & Captcha
    CaptchaResponse GenerateCaptcha();
    bool ValidateCaptcha(string token, string answer);
    AuthResponse AuthenticateUser(AuthRequest request);
    AuthResponse RegisterUser(AuthRequest request);
}

public class SchemeRepository : ISchemeRepository
{
    private static readonly object _lock = new();
    private static readonly List<Scheme> _schemes = new();
    private static readonly List<ChannelPartner> _partners = new();
    private static readonly List<ApplicationPack> _applications = new();
    private static readonly List<UserAccount> _users = new();
    private static readonly Dictionary<string, string> _activeCaptchas = new();

    static SchemeRepository()
    {
        SeedSchemes();
        SeedPartners();
        SeedSampleApplications();
        SeedUsers();
    }

    private static void SeedUsers()
    {
        _users.Add(new UserAccount
        {
            UserId = "ravi.kumar",
            Email = "ravi.kumar@example.gov.in",
            FullName = "Ravi Kumar",
            PasswordHash = HashPassword("Ravi@2026"),
            Role = "Beneficiary"
        });
        _users.Add(new UserAccount
        {
            UserId = "admin",
            Email = "admin@schemeready.gov.in",
            FullName = "SIH Nodal Officer",
            PasswordHash = HashPassword("Admin@2026"),
            Role = "Admin"
        });
    }

    private static string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password + "GovTechSalt2026");
        return Convert.ToBase64String(sha.ComputeHash(bytes));
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
                IncomeLimit = 500000, // SIH standard: up to Rs 5.00 Lakh
                MinimumProjectCost = 10000,
                MaximumProjectCost = 140000, // SIH: up to 1.40 Lakh
                EligibleBusinessTypes = new() { "tailoring", "mobile repair", "grocery", "tea stall", "carpentry", "leather craft", "barber shop", "vegetable vending", "food cart" },
                InterestRate = 5.0m,
                MaximumTenureMonths = 36,
                MoratoriumMonths = 3,
                RequiredDocuments = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Bank account proof", "Business quotation" },
                SupportedStates = new() { "Karnataka", "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Bihar", "West Bengal", "Rajasthan" },
                ApplicationMode = "Offline",
                OfficialUrl = "https://nsfdc.nic.in/schemes/micro-credit-scheme",
                SourceDocument = "NSFDC Operational Guidelines 2024-26, Clause 4.2",
                LastVerifiedDate = new DateTime(2026, 9, 10),
                Status = "Verified",
                Description = "Low-interest collateral-free micro credit up to Rs 1.40 Lakh tailored for quick disbursement through SCAs and NBFC-MFIs."
            },
            new()
            {
                Id = "NSFDC-TLS-02",
                Name = "Term Loan Scheme (TLS)",
                SchemeType = "Term Loan",
                TargetGroup = "Scheduled Caste Entrepreneurs (Pan-India)",
                MinimumAge = 18,
                MaximumAge = 55,
                IncomeLimit = 500000,
                MinimumProjectCost = 200000,
                MaximumProjectCost = 5000000, // SIH: up to 50.00 Lakh
                EligibleBusinessTypes = new() { "manufacturing", "transport", "mobile repair", "auto workshop", "food processing", "tailoring unit", "garment boutique", "dairy unit", "solar equipment" },
                InterestRate = 6.5m,
                MaximumTenureMonths = 60,
                MoratoriumMonths = 6,
                RequiredDocuments = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Bank account proof", "Detailed Project Report (DPR)", "Equipment quotation", "ITR Acknowledgement" },
                SupportedStates = new() { "Karnataka", "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Gujarat", "Delhi", "Telangana" },
                ApplicationMode = "Hybrid",
                OfficialUrl = "https://nsfdc.nic.in/schemes/term-loan-scheme",
                SourceDocument = "NSFDC Lending Policy Master Circular 2025-26",
                LastVerifiedDate = new DateTime(2026, 9, 10),
                Status = "Verified",
                Description = "Medium to large capital financing up to Rs 50 Lakh for capital equipment, workshop setup, and commercial fleets."
            },
            new()
            {
                Id = "NSFDC-EDU-03",
                Name = "Educational Loan Scheme (ELS)",
                SchemeType = "Education & Skill",
                TargetGroup = "Scheduled Caste Students & Scholars",
                MinimumAge = 17,
                MaximumAge = 35,
                IncomeLimit = 500000,
                MinimumProjectCost = 50000,
                MaximumProjectCost = 2000000, // Up to 20 Lakh in India, 30 Lakh Abroad
                EligibleBusinessTypes = new() { "student", "vocational training", "engineering", "medical", "it certification", "paramedical", "management" },
                InterestRate = 4.0m, // Concessional 4% for students, 3.5% for female students
                MaximumTenureMonths = 84,
                MoratoriumMonths = 12, // Course duration + 1 year moratorium
                MinAcademicPercentage = 60.0, // Academic eligibility benchmark
                RequiredDocuments = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "10th Marksheet", "12th Marksheet", "College Admission Letter", "Fee Structure" },
                SupportedStates = new() { "Karnataka", "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Bihar", "West Bengal", "Kerala" },
                ApplicationMode = "Online",
                OfficialUrl = "https://nsfdc.nic.in/schemes/educational-loan",
                SourceDocument = "NSFDC Education Credit Scheme Mandate 2026",
                LastVerifiedDate = new DateTime(2026, 9, 05),
                Status = "Verified",
                Description = "Concessional credit for professional higher education covering tuition, books, and living expenses with extended moratorium."
            },
            new()
            {
                Id = "NSFDC-MSY-04",
                Name = "Mahila Samriddhi Yojana (MSY)",
                SchemeType = "Women Entrepreneurship",
                TargetGroup = "Scheduled Caste Women Entrepreneurs",
                MinimumAge = 18,
                MaximumAge = 60,
                IncomeLimit = 500000,
                MinimumProjectCost = 10000,
                MaximumProjectCost = 140000,
                EligibleBusinessTypes = new() { "tailoring", "embroidery", "beauty parlour", "food stall", "handloom", "spices packaging", "dairy", "pottery" },
                InterestRate = 4.0m,
                MaximumTenureMonths = 42,
                MoratoriumMonths = 4,
                RequiredDocuments = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Bank account proof", "Self-help group endorsement / Quotation" },
                SupportedStates = new() { "Karnataka", "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Bihar" },
                ApplicationMode = "Offline",
                OfficialUrl = "https://nsfdc.nic.in/schemes/mahila-samriddhi-yojana",
                SourceDocument = "NSFDC Women Empowerment Window Guidelines 2026",
                LastVerifiedDate = new DateTime(2026, 9, 10),
                Status = "Verified",
                Description = "Highly subsidized credit program with 4% p.a. interest rate exclusively for women entrepreneurs and SHG members."
            },
            new()
            {
                Id = "NSFDC-GBS-05",
                Name = "Green Business Scheme (GBS)",
                SchemeType = "Green Economy",
                TargetGroup = "Scheduled Caste Individuals / Groups",
                MinimumAge = 18,
                MaximumAge = 55,
                IncomeLimit = 500000,
                MinimumProjectCost = 50000,
                MaximumProjectCost = 300000,
                EligibleBusinessTypes = new() { "e-rickshaw", "battery charging station", "solar lighting kit", "solid waste composting", "polyhouse farming" },
                InterestRate = 5.0m,
                MaximumTenureMonths = 48,
                MoratoriumMonths = 6,
                RequiredDocuments = new() { "Aadhaar/KYC", "Caste certificate", "Income certificate", "Driving license (for vehicles)", "Equipment quotation" },
                SupportedStates = new() { "Karnataka", "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Delhi" },
                ApplicationMode = "Offline",
                OfficialUrl = "https://nsfdc.nic.in/schemes/green-business",
                SourceDocument = "National Climate Adaptation & Clean Tech Livelihoods Mandate 2025",
                LastVerifiedDate = new DateTime(2026, 9, 05),
                Status = "Verified",
                Description = "Promotes environmentally sustainable micro-businesses such as electric passenger vehicles and solar installations."
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
                SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-TLS-02", "NSFDC-EDU-03", "NSFDC-MSY-04", "NSFDC-GBS-05" },
                DocumentRequirements = new() { "Aadhaar copy", "Caste certificate (RD number)", "Income certificate", "Bank passbook copy", "Quotation" },
                LastVerifiedDate = new DateTime(2026, 9, 10),
                IsOnlineSubmissionAvailable = false,
                Pincode = "560001",
                Latitude = 12.9791,
                Longitude = 77.5913,
                FundUtilizationStatus = "High Fund Availability / 0% Overdue",
                NpaHealthScore = "AAA (Zero Non-Performing Assets)"
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
                SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-TLS-02", "NSFDC-EDU-03" },
                DocumentRequirements = new() { "KYC docs", "Caste certificate", "Income declaration", "Business DPR", "Vendor quotation" },
                LastVerifiedDate = new DateTime(2026, 9, 08),
                IsOnlineSubmissionAvailable = true,
                Pincode = "560001",
                Latitude = 12.9734,
                Longitude = 77.6200,
                FundUtilizationStatus = "Active Disbursing Partner",
                NpaHealthScore = "AA+ (Compliant & Audited)"
            },
            new()
            {
                Id = "PART-SCA-03",
                InstitutionName = "Mahatma Phule Backward Class Development Corporation (MPBCDC)",
                InstitutionType = "SCA",
                District = "Mumbai",
                State = "Maharashtra",
                DistanceKm = 12.4,
                ContactNumber = "+91 22 2202 5481",
                ContactPerson = "Shri R. P. Shinde (Regional Director)",
                Address = "Administrative Building, Chembur, Mumbai - 400071",
                ApplicationMode = "Offline",
                SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-TLS-02", "NSFDC-EDU-03", "NSFDC-MSY-04" },
                DocumentRequirements = new() { "Aadhaar", "Caste validity certificate", "Income certificate", "Project DPR" },
                LastVerifiedDate = new DateTime(2026, 9, 09),
                IsOnlineSubmissionAvailable = false,
                Pincode = "400071",
                Latitude = 19.0600,
                Longitude = 72.8900,
                FundUtilizationStatus = "High Fund Availability / 0% Overdue",
                NpaHealthScore = "AAA (Low NPA - Priority Disbursal)"
            },
            new()
            {
                Id = "PART-SCA-04",
                InstitutionName = "UP Scheduled Castes Finance & Development Corporation (UPSCDC)",
                InstitutionType = "SCA",
                District = "Lucknow",
                State = "Uttar Pradesh",
                DistanceKm = 9.1,
                ContactNumber = "+91 522 2287 410",
                ContactPerson = "Shri Alok Verma (Joint Director)",
                Address = "B-2, Picup Bhawan, Vibhuti Khand, Gomti Nagar, Lucknow - 226010",
                ApplicationMode = "Offline",
                SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-TLS-02", "NSFDC-EDU-03" },
                DocumentRequirements = new() { "Aadhaar card", "Caste certificate", "Income cert", "Quotations" },
                LastVerifiedDate = new DateTime(2026, 9, 07),
                IsOnlineSubmissionAvailable = false,
                Pincode = "226010",
                Latitude = 26.8500,
                Longitude = 80.9900,
                FundUtilizationStatus = "High Fund Availability / 0% Overdue",
                NpaHealthScore = "AAA (Zero Overdues)"
            },
            new()
            {
                Id = "PART-SCA-05",
                InstitutionName = "Tamil Nadu Adi Dravidar Housing & Dev Corp (TAHDCO)",
                InstitutionType = "SCA",
                District = "Chennai",
                State = "Tamil Nadu",
                DistanceKm = 7.5,
                ContactNumber = "+91 44 2827 8421",
                ContactPerson = "Thiru K. Saravanan (Managing Director)",
                Address = "TNHB Building, 2nd Floor, Anna Salai, Chennai - 600002",
                ApplicationMode = "Hybrid",
                SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-TLS-02", "NSFDC-EDU-03", "NSFDC-MSY-04" },
                DocumentRequirements = new() { "Community certificate", "Family card/Aadhaar", "Income certificate", "Quotation" },
                LastVerifiedDate = new DateTime(2026, 9, 10),
                IsOnlineSubmissionAvailable = true,
                Pincode = "600002",
                Latitude = 13.0827,
                Longitude = 80.2707,
                FundUtilizationStatus = "High Fund Availability / 0% Overdue",
                NpaHealthScore = "AAA (Priority Channel Partner)"
            },
            new()
            {
                Id = "PART-RRB-06",
                InstitutionName = "Karnataka Gramin Bank (RRB Head Office Region)",
                InstitutionType = "RRB",
                District = "Bengaluru Rural",
                State = "Karnataka",
                DistanceKm = 14.5,
                ContactNumber = "+91 80 2793 1102",
                ContactPerson = "Shri Ramesh Kulkarni (Agri & Microcredit Officer)",
                Address = "Doddaballapur Main Road, Yelahanka Sub-hub, Bengaluru - 560064",
                ApplicationMode = "Offline",
                SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-MSY-04", "NSFDC-GBS-05" },
                DocumentRequirements = new() { "Aadhaar", "Ration card", "Caste cert", "Local panchayat NOC", "Quotation" },
                LastVerifiedDate = new DateTime(2026, 9, 05),
                IsOnlineSubmissionAvailable = false,
                Pincode = "560064",
                Latitude = 13.1007,
                Longitude = 77.5963,
                FundUtilizationStatus = "Active Disbursing Partner",
                NpaHealthScore = "AA+ (Clean Balance Sheet)"
            },
            new()
            {
                Id = "PART-MFI-07",
                InstitutionName = "Grameen Koota Financial Services (NBFC-MFI Channel Partner)",
                InstitutionType = "NBFC-MFI",
                District = "Bengaluru",
                State = "Karnataka",
                DistanceKm = 5.4,
                ContactNumber = "1800 103 4567 / +91 80 4125 8899",
                ContactPerson = "Ms. Kavitha Gowda (Branch Coordinator)",
                Address = "Jayanagar 4th Block, Near BDA Complex, Bengaluru - 560011",
                ApplicationMode = "Hybrid",
                SupportedSchemes = new() { "NSFDC-MCS-01", "NSFDC-MSY-04" },
                DocumentRequirements = new() { "Aadhaar Card", "Voter ID", "Bank statement", "Self-declaration of income" },
                LastVerifiedDate = new DateTime(2026, 9, 09),
                IsOnlineSubmissionAvailable = true,
                Pincode = "560011",
                Latitude = 12.9299,
                Longitude = 77.5824,
                FundUtilizationStatus = "High Fund Availability / 0% Overdue",
                NpaHealthScore = "AAA (Low Default Rate)"
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
                ParentsName = "Anand Kumar & Lakshmi Devi",
                Gender = "Male",
                BusinessType = "Mobile repair shop",
                ProjectDescription = "Mobile chip-level service and repair center",
                Location = "Bengaluru",
                State = "Karnataka",
                EstimatedProjectCost = 180000,
                AnnualFamilyIncome = 360000,
                HouseholdAnnualIncome = 360000,
                HasFiledItr = true,
                ItrAckNumber = "ITR-V-2025-8891042",
                TenthMarksPercentage = 78.5,
                TwelfthMarksPercentage = 74.0,
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
                "Declared family income (Rs 3.6L) is within the eligible threshold (Rs 5.0L).",
                "Project cost aligns with concessional capital range.",
                "Channel Partner possesses 0% overdue & priority fund availability."
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
            if (idx >= 0) _schemes[idx] = scheme;
            else _schemes.Add(scheme);
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
            if (idx >= 0) _partners[idx] = partner;
            else _partners.Add(partner);
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
            if (idx >= 0) _applications[idx] = pack;
            else _applications.Insert(0, pack);
            return Task.FromResult(pack);
        }
    }

    public Task<AdminStatsResponse> GetAdminStatsAsync()
    {
        var response = new AdminStatsResponse
        {
            TotalSchemes = _schemes.Count,
            TotalVerifiedPartners = _partners.Count,
            TotalApplicationsPrepared = Math.Max(_applications.Count, 162),
            PopularBusinessCategories = new()
            {
                { "Mobile Repair & Electronics", 58 },
                { "Tailoring & Garments", 44 },
                { "Higher & Vocational Education", 35 },
                { "Green Transport (E-Rickshaw)", 21 },
                { "Food Stall & Catering", 18 }
            },
            ApplicationsByDistrict = new()
            {
                { "Bengaluru Urban", 68 },
                { "Bengaluru Rural", 29 },
                { "Mumbai Suburban", 26 },
                { "Lucknow", 22 },
                { "Chennai", 17 }
            },
            CommonMissingDocuments = new()
            {
                { "Caste Certificate (RD No)", 58 },
                { "Business Quotation", 42 },
                { "Income Certificate", 29 },
                { "10th / 12th Marksheet", 16 },
                { "Bank Account Proof", 11 }
            }
        };

        return Task.FromResult(response);
    }

    // Auth & Captcha
    public CaptchaResponse GenerateCaptcha()
    {
        int num1 = Random.Shared.Next(10, 50);
        int num2 = Random.Shared.Next(1, 10);
        string token = Guid.NewGuid().ToString("N")[..8];
        string answer = (num1 + num2).ToString();

        lock (_lock)
        {
            _activeCaptchas[token] = answer;
        }

        return new CaptchaResponse
        {
            Token = token,
            Question = $"Solve: {num1} + {num2} = ?",
            ImageOrText = $"{num1} + {num2}"
        };
    }

    public bool ValidateCaptcha(string token, string answer)
    {
        if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(answer)) return false;
        lock (_lock)
        {
            if (_activeCaptchas.TryGetValue(token, out var expected))
            {
                _activeCaptchas.Remove(token);
                return string.Equals(expected.Trim(), answer.Trim(), StringComparison.OrdinalIgnoreCase);
            }
        }
        return false;
    }

    public AuthResponse AuthenticateUser(AuthRequest request)
    {
        if (!ValidateCaptcha(request.CaptchaToken, request.CaptchaAnswer))
        {
            return new AuthResponse { Success = false, Message = "Invalid or expired Captcha security code." };
        }

        var hash = HashPassword(request.Password);
        var user = _users.FirstOrDefault(u =>
            (u.UserId.Equals(request.UserIdOrEmail, StringComparison.OrdinalIgnoreCase) ||
             u.Email.Equals(request.UserIdOrEmail, StringComparison.OrdinalIgnoreCase)) &&
            u.PasswordHash == hash);

        if (user == null)
        {
            return new AuthResponse { Success = false, Message = "Invalid User ID/Email or Password." };
        }

        return new AuthResponse
        {
            Success = true,
            Message = "Authentication successful.",
            UserId = user.UserId,
            FullName = user.FullName,
            Token = $"SECURE-JWT-GOV-{Guid.NewGuid().ToString("N")}"
        };
    }

    public AuthResponse RegisterUser(AuthRequest request)
    {
        if (!ValidateCaptcha(request.CaptchaToken, request.CaptchaAnswer))
        {
            return new AuthResponse { Success = false, Message = "Invalid Captcha security code." };
        }

        lock (_lock)
        {
            if (_users.Any(u => u.UserId.Equals(request.UserIdOrEmail, StringComparison.OrdinalIgnoreCase) ||
                                u.Email.Equals(request.UserIdOrEmail, StringComparison.OrdinalIgnoreCase)))
            {
                return new AuthResponse { Success = false, Message = "User ID or Email is already registered." };
            }

            var newUser = new UserAccount
            {
                UserId = request.UserIdOrEmail.Contains("@") ? request.UserIdOrEmail.Split('@')[0] : request.UserIdOrEmail,
                Email = request.UserIdOrEmail.Contains("@") ? request.UserIdOrEmail : $"{request.UserIdOrEmail}@user.gov.in",
                FullName = string.IsNullOrWhiteSpace(request.FullName) ? "Citizen Beneficiary" : request.FullName,
                PasswordHash = HashPassword(request.Password),
                Role = "Beneficiary"
            };

            _users.Add(newUser);

            return new AuthResponse
            {
                Success = true,
                Message = "Account registered successfully.",
                UserId = newUser.UserId,
                FullName = newUser.FullName,
                Token = $"SECURE-JWT-GOV-{Guid.NewGuid().ToString("N")}"
            };
        }
    }
}
