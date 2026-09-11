namespace SchemeReady.Api.Models;

public class Scheme
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string SchemeType { get; set; } = string.Empty;
    public string TargetGroup { get; set; } = string.Empty;
    public int MinimumAge { get; set; } = 18;
    public int MaximumAge { get; set; } = 60;
    public decimal IncomeLimit { get; set; }
    public decimal MinimumProjectCost { get; set; }
    public decimal MaximumProjectCost { get; set; }
    public List<string> EligibleBusinessTypes { get; set; } = new();
    public decimal InterestRate { get; set; }
    public int MaximumTenureMonths { get; set; }
    public int MoratoriumMonths { get; set; }
    public List<string> RequiredDocuments { get; set; } = new();
    public List<string> SupportedDistricts { get; set; } = new();
    public string ApplicationMode { get; set; } = "Offline";
    public string OfficialUrl { get; set; } = string.Empty;
    public string SourceDocument { get; set; } = string.Empty;
    public DateTime LastVerifiedDate { get; set; }
    public string Status { get; set; } = "Verified";
    public string Description { get; set; } = string.Empty;
}

public class ChannelPartner
{
    public string Id { get; set; } = string.Empty;
    public string InstitutionName { get; set; } = string.Empty;
    public string InstitutionType { get; set; } = string.Empty; // SCA, PSB, RRB, NBFC-MFI
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = "Karnataka";
    public double DistanceKm { get; set; }
    public string ContactNumber { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ApplicationMode { get; set; } = "Offline"; // Online, Offline, Hybrid
    public List<string> SupportedSchemes { get; set; } = new();
    public List<string> DocumentRequirements { get; set; } = new();
    public DateTime LastVerifiedDate { get; set; }
    public bool IsOnlineSubmissionAvailable { get; set; }
    public string Pincode { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public class BeneficiaryProfile
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N")[..8].ToUpper();
    public string FullName { get; set; } = "Ravi Kumar";
    public string BusinessType { get; set; } = "tailoring";
    public string Location { get; set; } = "Bengaluru";
    public decimal EstimatedProjectCost { get; set; } = 120000;
    public decimal AnnualFamilyIncome { get; set; } = 250000;
    public string UserType { get; set; } = "new_entrepreneur"; // new_entrepreneur, existing_entrepreneur, student
    public string Category { get; set; } = "SC"; // SC, Safai Karamchari, OBC, General
    public bool HasCasteCertificate { get; set; } = false;
    public bool HasIncomeCertificate { get; set; } = true;
    public decimal RequiredLoanAmount { get; set; } = 120000;
    public string SupportPreference { get; set; } = "offline"; // online, offline, any
    public string PreferredLanguage { get; set; } = "kn"; // en, kn, hi
    public int Age { get; set; } = 28;
    public List<string> UploadedDocs { get; set; } = new() { "Aadhaar/KYC", "Income certificate" };
}

public class SchemeMatchResult
{
    public string SchemeId { get; set; } = string.Empty;
    public string SchemeName { get; set; } = string.Empty;
    public string SchemeType { get; set; } = string.Empty;
    public int MatchScore { get; set; }
    public bool IsRecommended { get; set; }
    public List<string> PositiveReasons { get; set; } = new();
    public List<string> NegativeReasons { get; set; } = new();
    public List<string> MissingDocuments { get; set; } = new();
    public decimal MaxLoanEligible { get; set; }
    public decimal InterestRate { get; set; }
    public int TenureMonths { get; set; }
    public decimal EstimatedEmi { get; set; }
    public string OfficialUrl { get; set; } = string.Empty;
    public string SourceDocument { get; set; } = string.Empty;
    public DateTime LastVerifiedDate { get; set; }
    public string PartnerAvailability { get; set; } = "Available in District";
}

public class ApplicationReadiness
{
    public int OverallScore { get; set; }
    public List<ReadinessItem> Items { get; set; } = new();
    public string NextRecommendedAction { get; set; } = string.Empty;
}

public class ReadinessItem
{
    public string Key { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Status { get; set; } = "Missing"; // Complete, Partially complete, Missing, Verified, Pending review
    public bool IsMandatory { get; set; } = true;
    public string WhyRequired { get; set; } = string.Empty;
    public string HowToObtain { get; set; } = string.Empty;
    public string AcceptedFormats { get; set; } = "PDF, JPG, PNG (Max 5MB)";
    public string? UploadedFileName { get; set; }
    public DateTime? UploadedAt { get; set; }
}

public class BusinessPlanRequest
{
    public string BusinessType { get; set; } = "Mobile repair shop";
    public string Location { get; set; } = "Bengaluru";
    public string EquipmentRequired { get; set; } = "SMD rework station, digital multimeter, microscope, testing cables, screen separator";
    public decimal EstimatedInvestment { get; set; } = 180000;
    public decimal ExpectedMonthlySales { get; set; } = 55000;
    public int NumberOfEmployees { get; set; } = 1;
    public decimal RawMaterialCost { get; set; } = 15000;
    public decimal RentAndUtilitiesCost { get; set; } = 10000;
}

public class BusinessPlanReport
{
    public string BusinessSummary { get; set; } = string.Empty;
    public string PurposeOfLoan { get; set; } = string.Empty;
    public decimal EquipmentCost { get; set; }
    public decimal WorkingCapital { get; set; }
    public decimal TotalProjectCost { get; set; }
    public decimal MarginMoneyPromoterContribution { get; set; }
    public decimal BankLoanRequired { get; set; }
    public decimal ExpectedMonthlyRevenue { get; set; }
    public decimal RawMaterialExpense { get; set; }
    public decimal SalariesExpense { get; set; }
    public decimal RentAndUtilitiesExpense { get; set; }
    public decimal TotalMonthlyExpenses { get; set; }
    public decimal NetMonthlyProfit { get; set; }
    public decimal EstimatedMonthlyEmi { get; set; }
    public decimal DebtServiceCoverageRatio { get; set; }
    public string RepaymentCapacityAssessment { get; set; } = string.Empty;
    public string OnePageProjectReport { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}

public class EmiRequest
{
    public decimal LoanAmount { get; set; } = 150000;
    public decimal AnnualInterestRate { get; set; } = 5.0m;
    public int TenureMonths { get; set; } = 36;
    public int MoratoriumMonths { get; set; } = 3;
    public decimal SubsidyContribution { get; set; } = 15000;
    public int GracePeriodMonths { get; set; } = 1;
}

public class AmortizationMonth
{
    public int Month { get; set; }
    public decimal OpeningBalance { get; set; }
    public decimal PrincipalPaid { get; set; }
    public decimal InterestPaid { get; set; }
    public decimal TotalPayment { get; set; }
    public decimal ClosingBalance { get; set; }
    public bool IsMoratorium { get; set; }
}

public class EmiCalculationResult
{
    public decimal LoanAmount { get; set; }
    public decimal EffectivePrincipal { get; set; }
    public decimal MonthlyEmi { get; set; }
    public decimal TotalInterest { get; set; }
    public decimal TotalRepayment { get; set; }
    public DateTime RepaymentStartDate { get; set; }
    public string MoratoriumEffect { get; set; } = string.Empty;
    public List<AmortizationMonth> Schedule { get; set; } = new();
}

public class ApplicationPack
{
    public string ApplicationId { get; set; } = string.Empty;
    public DateTime GeneratedDate { get; set; }
    public BeneficiaryProfile Profile { get; set; } = new();
    public Scheme SelectedScheme { get; set; } = new();
    public List<string> EligibilityReasons { get; set; } = new();
    public List<ReadinessItem> DocumentChecklist { get; set; } = new();
    public BusinessPlanReport ProjectReport { get; set; } = new();
    public EmiCalculationResult EmiPlan { get; set; } = new();
    public ChannelPartner NearestPartner { get; set; } = new();
    public string NextSteps { get; set; } = string.Empty;
    public string Disclaimer { get; set; } = "This report is a preliminary assistance document. Final eligibility, loan approval, interest rate, and document acceptance are determined by the authorized government agency, bank, or channel partner.";
    public string TrackingStatus { get; set; } = "Ready for Handoff";
    public string HandoffReferenceNumber { get; set; } = string.Empty;
}

public class ConversationalExtractRequest
{
    public string UserSpeechOrText { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = "en";
}

public class ConversationalExtractResponse
{
    public string BusinessType { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal RequiredAmount { get; set; }
    public string UserType { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string RawInput { get; set; } = string.Empty;
    public Dictionary<string, string> LocalizedSummary { get; set; } = new();
}

public class AdminStatsResponse
{
    public int TotalSchemes { get; set; }
    public int TotalVerifiedPartners { get; set; }
    public int TotalApplicationsPrepared { get; set; }
    public Dictionary<string, int> PopularBusinessCategories { get; set; } = new();
    public Dictionary<string, int> ApplicationsByDistrict { get; set; } = new();
    public Dictionary<string, int> CommonMissingDocuments { get; set; } = new();
}
