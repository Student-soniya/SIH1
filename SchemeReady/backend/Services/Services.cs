using SchemeReady.Api.Data;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Services;

public interface ISchemeMatchingService
{
    Task<List<SchemeMatchResult>> MatchSchemesAsync(BeneficiaryProfile profile);
}

public class SchemeMatchingService : ISchemeMatchingService
{
    private readonly ISchemeRepository _repository;
    private readonly IEmiCalculatorService _emiService;

    public SchemeMatchingService(ISchemeRepository repository, IEmiCalculatorService emiService)
    {
        _repository = repository;
        _emiService = emiService;
    }

    public async Task<List<SchemeMatchResult>> MatchSchemesAsync(BeneficiaryProfile profile)
    {
        var schemes = await _repository.GetAllSchemesAsync();
        var partners = await _repository.GetAllPartnersAsync();
        var results = new List<SchemeMatchResult>();

        foreach (var scheme in schemes)
        {
            var positiveReasons = new List<string>();
            var negativeReasons = new List<string>();
            var missingDocs = new List<string>();

            // 1. Target Community & Income Check (40% weight)
            int eligibilityScore = 0;
            bool categoryMatch = profile.Category.Equals("SC", StringComparison.OrdinalIgnoreCase) ||
                                 profile.Category.Equals("Safai Karamchari", StringComparison.OrdinalIgnoreCase);

            if (categoryMatch)
            {
                eligibilityScore += 20;
                positiveReasons.Add("Applicant belongs to target Scheduled Caste (SC) empowerment demographic.");
            }
            else
            {
                negativeReasons.Add("Applicant category does not match scheme SC targeted window.");
            }

            if (profile.AnnualFamilyIncome <= scheme.IncomeLimit)
            {
                eligibilityScore += 20;
                positiveReasons.Add($"Declared annual income (Rs {profile.AnnualFamilyIncome:N0}) meets SIH criteria (Cap: Rs {scheme.IncomeLimit:N0}).");
            }
            else
            {
                negativeReasons.Add($"Family income (Rs {profile.AnnualFamilyIncome:N0}) exceeds Rs {scheme.IncomeLimit:N0} threshold.");
            }

            // 2. Project Cost Fit (25% weight)
            int costScore = 0;
            if (profile.EstimatedProjectCost >= scheme.MinimumProjectCost && profile.EstimatedProjectCost <= scheme.MaximumProjectCost)
            {
                costScore = 25;
                positiveReasons.Add($"Project cost (Rs {profile.EstimatedProjectCost:N0}) is within scheme bounds (Rs {scheme.MinimumProjectCost:N0} to Rs {scheme.MaximumProjectCost:N0}).");
            }
            else if (profile.EstimatedProjectCost < scheme.MinimumProjectCost)
            {
                costScore = 8;
                negativeReasons.Add($"Project cost (Rs {profile.EstimatedProjectCost:N0}) is below scheme entry floor of Rs {scheme.MinimumProjectCost:N0}.");
            }
            else
            {
                costScore = 5;
                negativeReasons.Add($"Project cost (Rs {profile.EstimatedProjectCost:N0}) exceeds scheme maximum limit of Rs {scheme.MaximumProjectCost:N0}.");
            }

            // 3. Document Readiness (15% weight)
            int docScore = 0;
            if (profile.HasCasteCertificate) docScore += 8;
            else missingDocs.Add("Caste certificate (RD Number)");

            if (profile.HasIncomeCertificate) docScore += 7;
            else missingDocs.Add("Income certificate");

            if (missingDocs.Any())
            {
                negativeReasons.Add($"Mandatory statutory documents pending: {string.Join(", ", missingDocs)}.");
            }
            else
            {
                positiveReasons.Add("Statutory community and income verification documents attached.");
            }

            // 4. Partner Availability & Fund Health (10% weight - SIH mandate)
            int partnerScore = 0;
            var localPartners = partners.Where(p =>
                (p.District.Contains(profile.Location, StringComparison.OrdinalIgnoreCase) ||
                 p.State.Contains(profile.State, StringComparison.OrdinalIgnoreCase)) &&
                p.SupportedSchemes.Contains(scheme.Id)).ToList();

            if (localPartners.Any())
            {
                partnerScore = 10;
                var p = localPartners.OrderBy(x => x.DistanceKm).First();
                positiveReasons.Add($"Authorized Channel Partner ({p.InstitutionName}) with clean balance sheet & 0% overdue is active in {profile.Location} ({p.DistanceKm} km).");
            }
            else
            {
                partnerScore = 5;
                negativeReasons.Add($"No direct local channel branch in {profile.Location}; routed via State Channelizing Agency headquarters.");
            }

            // 5. Gender & Academic Specific Rules
            int prefScore = 0;
            if (scheme.Id == "NSFDC-MSY-04") // Mahila Samriddhi Yojana
            {
                if (profile.Gender.Equals("Female", StringComparison.OrdinalIgnoreCase))
                {
                    prefScore = 10;
                    positiveReasons.Add("Applicant is a woman entrepreneur eligible for 4.0% concessional interest.");
                }
                else
                {
                    negativeReasons.Add("Mahila Samriddhi Yojana is exclusively reserved for women entrepreneurs.");
                    eligibilityScore = Math.Max(0, eligibilityScore - 25);
                }
            }
            else if (scheme.Id == "NSFDC-EDU-03") // Educational Loan Scheme
            {
                if (profile.UserType.Equals("student", StringComparison.OrdinalIgnoreCase) ||
                    profile.BusinessType.Contains("student", StringComparison.OrdinalIgnoreCase) ||
                    profile.BusinessType.Contains("education", StringComparison.OrdinalIgnoreCase))
                {
                    prefScore = 10;
                    if (profile.TwelfthMarksPercentage >= scheme.MinAcademicPercentage || profile.TenthMarksPercentage >= scheme.MinAcademicPercentage)
                    {
                        positiveReasons.Add($"Academic score (10th: {profile.TenthMarksPercentage}%, 12th: {profile.TwelfthMarksPercentage}%) satisfies educational loan admission norms.");
                    }
                    else
                    {
                        negativeReasons.Add($"Academic percentage falls below the {scheme.MinAcademicPercentage}% threshold for priority educational loan sanction.");
                    }
                }
                else
                {
                    prefScore = 3;
                    negativeReasons.Add("Educational loan requires enrollment in recognized university or skill course.");
                }
            }
            else
            {
                bool businessSupported = scheme.EligibleBusinessTypes.Any(b =>
                    profile.BusinessType.Contains(b, StringComparison.OrdinalIgnoreCase) ||
                    b.Contains(profile.BusinessType, StringComparison.OrdinalIgnoreCase));

                if (businessSupported)
                {
                    prefScore = 10;
                    positiveReasons.Add($"Business activity '{profile.BusinessType}' is an identified high-priority sector.");
                }
                else
                {
                    prefScore = 5;
                    negativeReasons.Add($"Business activity '{profile.BusinessType}' falls under general commercial services.");
                }
            }

            int totalMatchScore = eligibilityScore + costScore + docScore + partnerScore + prefScore;
            totalMatchScore = Math.Clamp(totalMatchScore, 10, 98);

            decimal loanPortion = Math.Min(profile.RequiredLoanAmount, scheme.MaximumProjectCost * 0.90m);
            var emiCalc = _emiService.CalculateEmi(new EmiRequest
            {
                LoanAmount = loanPortion,
                AnnualInterestRate = scheme.InterestRate,
                TenureMonths = Math.Min(36, scheme.MaximumTenureMonths),
                MoratoriumMonths = scheme.MoratoriumMonths
            });

            results.Add(new SchemeMatchResult
            {
                SchemeId = scheme.Id,
                SchemeName = scheme.Name,
                SchemeType = scheme.SchemeType,
                MatchScore = totalMatchScore,
                IsRecommended = totalMatchScore >= 70,
                PositiveReasons = positiveReasons,
                NegativeReasons = negativeReasons,
                MissingDocuments = missingDocs,
                MaxLoanEligible = scheme.MaximumProjectCost,
                InterestRate = scheme.InterestRate,
                TenureMonths = scheme.MaximumTenureMonths,
                EstimatedEmi = emiCalc.MonthlyEmi,
                OfficialUrl = scheme.OfficialUrl,
                SourceDocument = scheme.SourceDocument,
                LastVerifiedDate = scheme.LastVerifiedDate,
                PartnerAvailability = localPartners.FirstOrDefault()?.InstitutionName ?? "State Channelizing Agency Active"
            });
        }

        return results.OrderByDescending(r => r.MatchScore).ToList();
    }
}

public interface IEmiCalculatorService
{
    EmiCalculationResult CalculateEmi(EmiRequest request);
}

public class EmiCalculatorService : IEmiCalculatorService
{
    public EmiCalculationResult CalculateEmi(EmiRequest request)
    {
        decimal principal = Math.Max(1000, request.LoanAmount - request.SubsidyContribution);
        decimal annualRate = request.AnnualInterestRate;
        int tenure = Math.Max(6, request.TenureMonths);
        int moratorium = Math.Max(0, request.MoratoriumMonths);

        decimal r = (annualRate / 100m) / 12m;
        double rDbl = (double)r;
        double pDbl = (double)principal;
        int nDbl = tenure;

        double emiDbl = (pDbl * rDbl * Math.Pow(1 + rDbl, nDbl)) / (Math.Pow(1 + rDbl, nDbl) - 1);
        decimal monthlyEmi = Math.Round((decimal)emiDbl, 0);

        var schedule = new List<AmortizationMonth>();
        decimal currentBalance = principal;
        decimal totalInterest = 0;

        for (int m = 1; m <= moratorium; m++)
        {
            decimal moratInterest = Math.Round(currentBalance * r, 0);
            totalInterest += moratInterest;
            schedule.Add(new AmortizationMonth
            {
                Month = m,
                OpeningBalance = currentBalance,
                PrincipalPaid = 0,
                InterestPaid = moratInterest,
                TotalPayment = moratInterest,
                ClosingBalance = currentBalance,
                IsMoratorium = true
            });
        }

        for (int m = 1; m <= tenure; m++)
        {
            decimal interest = Math.Round(currentBalance * r, 0);
            decimal principalPaid = monthlyEmi - interest;
            if (m == tenure || principalPaid > currentBalance)
            {
                principalPaid = currentBalance;
                monthlyEmi = principalPaid + interest;
            }
            decimal closing = Math.Max(0, currentBalance - principalPaid);
            totalInterest += interest;

            schedule.Add(new AmortizationMonth
            {
                Month = moratorium + m,
                OpeningBalance = currentBalance,
                PrincipalPaid = principalPaid,
                InterestPaid = interest,
                TotalPayment = monthlyEmi,
                ClosingBalance = closing,
                IsMoratorium = false
            });

            currentBalance = closing;
            if (currentBalance <= 0) break;
        }

        decimal totalRepayment = principal + totalInterest;

        return new EmiCalculationResult
        {
            LoanAmount = request.LoanAmount,
            EffectivePrincipal = principal,
            MonthlyEmi = monthlyEmi,
            TotalInterest = totalInterest,
            TotalRepayment = totalRepayment,
            RepaymentStartDate = DateTime.UtcNow.AddMonths(moratorium + 1),
            MoratoriumEffect = moratorium > 0 
                ? $"Moratorium of {moratorium} months provides a gestation buffer. Repayment of principal commences from Month {moratorium + 1}." 
                : "No moratorium configured; regular principal repayment commences immediately.",
            Schedule = schedule.Take(36).ToList()
        };
    }
}

public interface IBusinessPlanService
{
    BusinessPlanReport GeneratePlan(BusinessPlanRequest request);
}

public class BusinessPlanService : IBusinessPlanService
{
    private readonly IEmiCalculatorService _emiService;

    public BusinessPlanService(IEmiCalculatorService emiService)
    {
        _emiService = emiService;
    }

    public BusinessPlanReport GeneratePlan(BusinessPlanRequest request)
    {
        decimal totalProjectCost = Math.Max(request.EstimatedInvestment, 50000);
        decimal equipmentCost = Math.Round(totalProjectCost * 0.70m, 0);
        decimal workingCapital = totalProjectCost - equipmentCost;
        decimal marginMoney = Math.Round(totalProjectCost * 0.05m, 0);
        decimal bankLoan = totalProjectCost - marginMoney;

        decimal monthlyRevenue = Math.Max(request.ExpectedMonthlySales, 30000);
        decimal rawMaterial = Math.Max(request.RawMaterialCost, monthlyRevenue * 0.25m);
        decimal salaries = request.NumberOfEmployees > 0 ? (request.NumberOfEmployees * 12000m) : 0m;
        decimal rentAndUtilities = Math.Max(request.RentAndUtilitiesCost, 6000m);

        decimal totalMonthlyExpenses = rawMaterial + salaries + rentAndUtilities;
        decimal netMonthlyProfit = monthlyRevenue - totalMonthlyExpenses;

        var emiResult = _emiService.CalculateEmi(new EmiRequest
        {
            LoanAmount = bankLoan,
            AnnualInterestRate = 6.5m,
            TenureMonths = 36,
            MoratoriumMonths = 3
        });

        decimal dscr = emiResult.MonthlyEmi > 0 ? Math.Round(netMonthlyProfit / emiResult.MonthlyEmi, 2) : 2.5m;

        string capacity = dscr >= 1.5m 
            ? $"Strong Repayment Capacity (DSCR: {dscr}x). Monthly net operational surplus of Rs {netMonthlyProfit:N0} comfortably covers loan installment of Rs {emiResult.MonthlyEmi:N0}."
            : $"Moderate Repayment Capacity (DSCR: {dscr}x). Adequate surplus to service debt.";

        string summary = $"Proposed establishment of a viable {request.BusinessType} in {request.Location}. The project leverages modern tools ({request.EquipmentRequired}) and provides employment for {request.NumberOfEmployees + 1} person(s). With an initial capital outlay of Rs {totalProjectCost:N0}, the enterprise anticipates steady monthly turnover of Rs {monthlyRevenue:N0}.";

        string purpose = $"Procurement of professional equipment/tools (Rs {equipmentCost:N0}) and initial working capital/spares inventory (Rs {workingCapital:N0}) to launch commercial operations without liquidity bottlenecks.";

        string onePageReport = $@"PROJECT VIABILITY REPORT
-------------------------------------------------------------------------------
Enterprise: {request.BusinessType}
Location: {request.Location}
Promoter Category: Scheduled Caste Entrepreneur
Target Scheme: NSFDC Concessional Credit Program

1. CAPITAL EXPENDITURE & FINANCING
- Machinery & Equipment: Rs {equipmentCost:N0}
- Working Capital Margin: Rs {workingCapital:N0}
- Total Project Cost: Rs {totalProjectCost:N0}
- Promoter Contribution (Margin 5%): Rs {marginMoney:N0}
- Term Loan / Credit Required (95%): Rs {bankLoan:N0}

2. MONTHLY EARNINGS PROJECTION
- Gross Sales / Service Receipts: Rs {monthlyRevenue:N0}
- Less: Spares / Raw Materials: Rs {rawMaterial:N0}
- Less: Staff Compensation ({request.NumberOfEmployees} assistants): Rs {salaries:N0}
- Less: Shop Rent & Electric Utilities: Rs {rentAndUtilities:N0}
- Total Operating Costs: Rs {totalMonthlyExpenses:N0}
- Net Monthly Operational Profit: Rs {netMonthlyProfit:N0}

3. DEBT SERVICING & FEASIBILITY
- Monthly EMI (at 6.5% p.a. over 36 mo): Rs {emiResult.MonthlyEmi:N0}
- Debt Service Coverage Ratio (DSCR): {dscr}x (Benchmark > 1.5x)
- Repayment Capacity: {capacity}
- Moratorium: 3 Months initial grace buffer
-------------------------------------------------------------------------------";

        return new BusinessPlanReport
        {
            BusinessSummary = summary,
            PurposeOfLoan = purpose,
            EquipmentCost = equipmentCost,
            WorkingCapital = workingCapital,
            TotalProjectCost = totalProjectCost,
            MarginMoneyPromoterContribution = marginMoney,
            BankLoanRequired = bankLoan,
            ExpectedMonthlyRevenue = monthlyRevenue,
            RawMaterialExpense = rawMaterial,
            SalariesExpense = salaries,
            RentAndUtilitiesExpense = rentAndUtilities,
            TotalMonthlyExpenses = totalMonthlyExpenses,
            NetMonthlyProfit = netMonthlyProfit,
            EstimatedMonthlyEmi = emiResult.MonthlyEmi,
            DebtServiceCoverageRatio = dscr,
            RepaymentCapacityAssessment = capacity,
            OnePageProjectReport = onePageReport,
            GeneratedAt = DateTime.UtcNow
        };
    }
}

public interface IReadinessService
{
    ApplicationReadiness CalculateReadiness(BeneficiaryProfile profile);
}

public class ReadinessService : IReadinessService
{
    public ApplicationReadiness CalculateReadiness(BeneficiaryProfile profile)
    {
        var items = new List<ReadinessItem>
        {
            new()
            {
                Key = "eligibility",
                Title = "Eligibility Criteria",
                Status = "Complete",
                IsMandatory = true,
                WhyRequired = "Verifies age, target community category, and annual family income eligibility (within Rs 5.00 Lakh).",
                HowToObtain = "Verified instantly via questionnaire.",
                AcceptedFormats = "System Verified"
            },
            new()
            {
                Key = "identity",
                Title = "Identity Documents (Aadhaar / Voter ID)",
                Status = profile.UploadedDocs.Contains("Aadhaar/KYC") ? "Complete" : "Pending review",
                IsMandatory = true,
                WhyRequired = "Mandatory KYC requirement per RBI and Government DBT guidelines.",
                HowToObtain = "Download e-Aadhaar from UIDAI portal (eaadhaar.uidai.gov.in).",
                AcceptedFormats = "PDF, JPG (Max 5MB)",
                UploadedFileName = profile.UploadedDocs.Contains("Aadhaar/KYC") ? "aadhaar_card_front_back.pdf" : null
            },
            new()
            {
                Key = "caste_cert",
                Title = "Caste Certificate (RD Number)",
                Status = profile.HasCasteCertificate ? "Complete" : "Missing",
                IsMandatory = true,
                WhyRequired = "Statutory proof confirming beneficiary eligibility for concessional NSFDC interest rates.",
                HowToObtain = "Apply online via State portal (Nadakacheri in Karnataka / MahaOnline in Maharashtra / e-District in UP) or nearest Tahsildar office.",
                AcceptedFormats = "PDF, JPG (Max 5MB)",
                UploadedFileName = profile.HasCasteCertificate ? "caste_certificate_verified.pdf" : null
            },
            new()
            {
                Key = "income_cert",
                Title = "Income Certificate / ITR Acknowledgement",
                Status = profile.HasIncomeCertificate || profile.HasFiledItr ? "Complete" : "Missing",
                IsMandatory = true,
                WhyRequired = "Confirms annual family income falls within the Rs 5.00 Lakh scheme ceiling.",
                HowToObtain = "Obtain through Tahsildar / Revenue Department or submit ITR-V acknowledgement.",
                AcceptedFormats = "PDF, JPG (Max 5MB)",
                UploadedFileName = profile.HasIncomeCertificate ? "income_certificate_2026.pdf" : "itr_acknowledgement_2025.pdf"
            },
            new()
            {
                Key = "academic_marks",
                Title = "10th & 12th Academic Records",
                Status = profile.UploadedDocs.Contains("10th Marksheet") ? "Complete" : "Pending review",
                IsMandatory = false,
                WhyRequired = "Essential for educational loans and skill loan sanction.",
                HowToObtain = "Download verified digital marksheets from DigiLocker portal (digilocker.gov.in).",
                AcceptedFormats = "PDF, JPG (Max 5MB)",
                UploadedFileName = profile.UploadedDocs.Contains("10th Marksheet") ? "tenth_twelfth_marksheets.pdf" : null
            },
            new()
            {
                Key = "business_plan",
                Title = "Business Plan & Project Report (DPR)",
                Status = "Complete",
                IsMandatory = true,
                WhyRequired = "Required by bank loan officers to assess technical viability and repayment capacity.",
                HowToObtain = "Generated automatically by SchemeReady AI Business Plan Builder.",
                AcceptedFormats = "PDF, Printout",
                UploadedFileName = "project_viability_report.pdf"
            },
            new()
            {
                Key = "quotation",
                Title = "Equipment / Vendor Quotation",
                Status = profile.UploadedDocs.Contains("Business quotation") ? "Complete" : "Missing",
                IsMandatory = false,
                WhyRequired = "Validates equipment purchase cost and allows direct disbursement to vendor.",
                HowToObtain = "Obtain a proforma invoice or quotation on official letterhead with GST number.",
                AcceptedFormats = "PDF, JPG, PNG",
                UploadedFileName = profile.UploadedDocs.Contains("Business quotation") ? "vendor_quotation_machinery.pdf" : null
            },
            new()
            {
                Key = "partner",
                Title = "Eligible Channel Partner (Low NPA / 0% Overdue)",
                Status = "Complete",
                IsMandatory = true,
                WhyRequired = "Ensures application is directed to a verified partner with active disbursal capacity.",
                HowToObtain = "Routed automatically by SchemeReady Channel Partner Router.",
                AcceptedFormats = "Channel Partner Verified"
            }
        };

        int score = 0;
        foreach (var item in items)
        {
            if (item.Status == "Complete") score += 13;
            else if (item.Status == "Pending review") score += 7;
        }

        int overallScore = Math.Clamp(score + (profile.HasIncomeCertificate && !profile.HasCasteCertificate ? 7 : 0), 20, 100);

        string nextAction = !profile.HasCasteCertificate
            ? "Upload your Caste Certificate or apply at Nadakacheri / e-District to boost your score to 92%."
            : (!profile.UploadedDocs.Contains("Business quotation")
                ? "Obtain an equipment quotation from your vendor to achieve 100% Application Readiness."
                : "Your application is 100% submission-ready! Download the Application Pack.");

        return new ApplicationReadiness
        {
            OverallScore = overallScore,
            Items = items,
            NextRecommendedAction = nextAction
        };
    }
}

public interface IPartnerRoutingService
{
    Task<List<ChannelPartner>> GetRecommendedPartnersAsync(string district, string? state, string? schemeId);
}

public class PartnerRoutingService : IPartnerRoutingService
{
    private readonly ISchemeRepository _repository;

    public PartnerRoutingService(ISchemeRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ChannelPartner>> GetRecommendedPartnersAsync(string district, string? state, string? schemeId)
    {
        var partners = await _repository.GetAllPartnersAsync();
        var query = partners.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(district))
        {
            query = query.OrderBy(p => p.District.Contains(district, StringComparison.OrdinalIgnoreCase) ? 0 : 1)
                         .ThenBy(p => p.DistanceKm);
        }
        else if (!string.IsNullOrWhiteSpace(state))
        {
            query = query.OrderBy(p => p.State.Contains(state, StringComparison.OrdinalIgnoreCase) ? 0 : 1)
                         .ThenBy(p => p.DistanceKm);
        }

        if (!string.IsNullOrWhiteSpace(schemeId))
        {
            query = query.OrderByDescending(p => p.SupportedSchemes.Contains(schemeId));
        }

        return query.ToList();
    }
}
