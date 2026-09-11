using System.Globalization;
using SchemeReady.Api.Data;
using SchemeReady.Api.Matching;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Services;

public interface ISchemeMatchingService
{
    /// <summary>
    /// Scores every scheme for one profile.
    /// </summary>
    /// <param name="ruleOverride">
    /// Normally null, meaning "use the Rule_Store snapshot the provider serves". The admin rule
    /// editor's preview passes a snapshot built from *pending, unsaved* values so R7.11 can show
    /// pending-versus-stored explanations without persisting anything. It is an optional argument
    /// rather than a second engine because there must be exactly one implementation of the
    /// scoring rules — a preview computed by a reimplementation would be free to disagree with
    /// the thing it claims to preview.
    /// </param>
    Task<List<SchemeMatchResult>> MatchSchemesAsync(BeneficiaryProfile profile, MatchingRuleSetSnapshot? ruleOverride = null);
}

public class SchemeMatchingService : ISchemeMatchingService
{
    /// <summary>
    /// Every interpolated number in a reason string is formatted through this, never
    /// through the ambient culture (R3.3, R3.6).
    ///
    /// A reason string that reads "Rs 150,000" on a developer's machine and
    /// "Rs 150.000" on a de-DE server cannot be a stable baseline, and R3.7 demands
    /// byte-for-byte equality. The frontend formats independently with en-IN grouping
    /// (R8.11); the API stays invariant. That asymmetry is deliberate.
    ///
    /// No reason string *template* changes here — only the formatter behind the
    /// interpolation holes. The U+2019 apostrophe in "applicant’s district" and the
    /// "Rs " prefix are untouched.
    /// </summary>
    private static readonly CultureInfo Inv = CultureInfo.InvariantCulture;

    private readonly ISchemeRepository _repository;
    private readonly IEmiCalculatorService _emiService;
    private readonly IRuleSetProvider _rules;

    public SchemeMatchingService(
        ISchemeRepository repository,
        IEmiCalculatorService emiService,
        IRuleSetProvider rules)
    {
        _repository = repository;
        _emiService = emiService;
        _rules = rules;
    }

    public async Task<List<SchemeMatchResult>> MatchSchemesAsync(BeneficiaryProfile profile, MatchingRuleSetSnapshot? ruleOverride = null)
    {
        // One snapshot for the whole pass (R7.3, R7.4). Taken before any scheme is scored, so a
        // concurrent admin save cannot make result 1 use the old income limit and result 4 the
        // new one. A store that cannot be read throws here — the request fails whole, and no
        // hard-coded threshold stands in (R7.5).
        var ruleSet = ruleOverride ?? await _rules.GetAsync();

        var schemes = await _repository.GetAllSchemesAsync();
        var partners = await _repository.GetAllPartnersAsync();
        var results = new List<SchemeMatchResult>();

        foreach (var scheme in schemes)
        {
            // Every threshold and every weight below is read from this record by name. A scheme
            // with no rule row fails the request naming the scheme (R3.8).
            var rules = ruleSet.ForScheme(scheme.Id);

            var positiveReasons = new List<string>();
            var negativeReasons = new List<string>();
            var missingDocs = new List<string>();

            // 1. Eligibility Check (weight from Rule_Store: Eligibility)
            int eligibilityScore = 0;

            // Was `Category == "SC" || Category == "Safai Karamchari"` — the same two values, now
            // an editable list per scheme (R7.3). Ordinal-ignore-case, exactly as the two
            // Equals calls it replaces, so "sc" still matches and no culture can widen the set.
            bool categoryMatch = rules.EligibleCategories.Contains(profile.Category, StringComparer.OrdinalIgnoreCase);

            if (categoryMatch)
            {
                eligibilityScore += Awards.EligibilityCategory(rules.Weights.Eligibility);
                positiveReasons.Add("Applicant belongs to the target community (Scheduled Caste).");
            }
            else
            {
                negativeReasons.Add("Applicant category does not match scheme SC targeted window.");
            }

            if (profile.AnnualFamilyIncome <= rules.IncomeLimit)
            {
                eligibilityScore += Awards.EligibilityIncome(rules.Weights.Eligibility);
                positiveReasons.Add($"Declared family income (Rs {profile.AnnualFamilyIncome.ToString("N0", Inv)}) is within the configured threshold of Rs {rules.IncomeLimit.ToString("N0", Inv)}.");
            }
            else
            {
                negativeReasons.Add($"Family income (Rs {profile.AnnualFamilyIncome.ToString("N0", Inv)}) exceeds the configured limit (Rs {rules.IncomeLimit.ToString("N0", Inv)}).");
            }

            // 2. Project Cost Fit (weight from Rule_Store: ProjectCostFit)
            int costScore = 0;
            if (profile.EstimatedProjectCost >= rules.MinimumProjectCost && profile.EstimatedProjectCost <= rules.MaximumProjectCost)
            {
                costScore = Awards.CostInRange(rules.Weights.ProjectCostFit);
                positiveReasons.Add($"Project cost (Rs {profile.EstimatedProjectCost.ToString("N0", Inv)}) fits the scheme limit (Rs {rules.MinimumProjectCost.ToString("N0", Inv)} - Rs {rules.MaximumProjectCost.ToString("N0", Inv)}).");
            }
            else if (profile.EstimatedProjectCost < rules.MinimumProjectCost)
            {
                costScore = Awards.CostBelowMin(rules.Weights.ProjectCostFit);
                negativeReasons.Add($"Required amount (Rs {profile.EstimatedProjectCost.ToString("N0", Inv)}) is lower than the recommended minimum of Rs {rules.MinimumProjectCost.ToString("N0", Inv)}.");
            }
            else
            {
                costScore = Awards.CostAboveMax(rules.Weights.ProjectCostFit);
                negativeReasons.Add($"Project cost (Rs {profile.EstimatedProjectCost.ToString("N0", Inv)}) exceeds the maximum scheme ceiling of Rs {rules.MaximumProjectCost.ToString("N0", Inv)}.");
            }

            // 3. Document Readiness (weight from Rule_Store: DocumentReadiness)
            int docScore = 0;
            if (profile.HasCasteCertificate) docScore += Awards.DocCaste(rules.Weights.DocumentReadiness);
            else missingDocs.Add("Caste certificate (RD Number)");

            if (profile.HasIncomeCertificate) docScore += Awards.DocIncome(rules.Weights.DocumentReadiness);
            else missingDocs.Add("Income certificate");

            if (missingDocs.Any())
            {
                negativeReasons.Add($"Mandatory statutory documents pending: {string.Join(", ", missingDocs)}.");
            }
            else
            {
                positiveReasons.Add("Statutory community and income verification documents attached.");
            }

            // 4. Partner Availability (weight from Rule_Store: PartnerAvailability)
            int partnerScore = 0;
            var localPartners = partners.Where(p =>
                (p.District.Contains(profile.Location, StringComparison.OrdinalIgnoreCase) ||
                 p.State.Contains(profile.State, StringComparison.OrdinalIgnoreCase)) &&
                p.SupportedSchemes.Contains(scheme.Id)).ToList();

            if (localPartners.Any())
            {
                partnerScore = Awards.PartnerPresent(rules.Weights.PartnerAvailability);
                var p = localPartners.OrderBy(x => x.DistanceKm).First();
                // DistanceKm is a double, so it needs Inv for the same reason the rupee
                // amounts do — "4.2 km" must not become "4,2 km" on a comma-decimal host.
                positiveReasons.Add($"Suitable partner ({p.InstitutionName}) is available in the applicant’s district ({profile.Location}, {p.DistanceKm.ToString(Inv)} km).");
            }
            else
            {
                partnerScore = Awards.PartnerAbsent(rules.Weights.PartnerAvailability);
                negativeReasons.Add($"No direct SCA / bank branch tagged for this scheme in {profile.Location}; regional office routing needed.");
            }

            // 5. Business Type & User Preference (weight from Rule_Store: BusinessTypePreference)
            //
            // The bidirectional Contains is preserved exactly: "tailoring unit" matches a profile
            // of "tailoring" and vice versa. Only the source of the list moved.
            int prefScore = 0;
            bool businessSupported = rules.EligibleBusinessTypes.Any(b =>
                profile.BusinessType.Contains(b, StringComparison.OrdinalIgnoreCase) ||
                b.Contains(profile.BusinessType, StringComparison.OrdinalIgnoreCase));

            if (businessSupported)
            {
                prefScore = Awards.BusinessMatch(rules.Weights.BusinessTypePreference);
                positiveReasons.Add($"Business type '{profile.BusinessType}' is actively promoted under this scheme.");
            }
            else
            {
                prefScore = Awards.BusinessMismatch(rules.Weights.BusinessTypePreference);
                negativeReasons.Add($"Business type '{profile.BusinessType}' may require special committee evaluation under generalized trade category.");
            }

            // Gender restriction declared by the scheme (R3.5).
            //
            // This replaces `scheme.Id == "NSFDC-MSY-03" && profile.FullName.Contains("Ravi")`.
            // That expression was wrong twice over: it hard-coded one scheme identifier, and
            // it inferred gender from a name substring — so "Ravi Sharma" (any gender) was
            // barred from a women-only scheme while every other applicant, women-only scheme
            // or not, sailed through. No eligibility, scoring or reason-generation path in
            // this method reads FullName any more.
            //
            // ONE SOURCE OF TRUTH, and it is the Rule_Store (Phase E).
            //
            // Two columns now spell "GenderRestriction": Scheme.GenderRestriction, which Phase B
            // added and set to "Female" on NSFDC-MSY-03, and SchemeRules.GenderRestriction, which
            // the seeder copies from it. Matching reads *only* rules.GenderRestriction. The
            // Rule_Store wins for one reason: it is the row an administrator can edit through
            // POST /api/admin/rules without a redeployment, which is the entire purpose of
            // Requirement 7. If matching kept reading Scheme.GenderRestriction, an admin who
            // widened MSY-03 to "Any" would watch the save succeed and the restriction stay in
            // force — the exact failure mode this phase exists to remove.
            //
            // Scheme.GenderRestriction survives as descriptive data on the unchanged
            // GET /api/schemes response, and as the value the seeder derives the rule row from on
            // a fresh database. No eligibility, scoring or reason-generation path reads it. (Nor
            // does any path read FullName — Phase B's deletion stands.)
            //
            // An undeclared or empty profile gender does not satisfy a restriction, so the
            // penalty applies — a restricted scheme is not silently opened up by an omitted
            // field.
            bool schemeRestrictsGender = !string.IsNullOrWhiteSpace(rules.GenderRestriction) &&
                                         !rules.GenderRestriction.Equals("Any", StringComparison.OrdinalIgnoreCase);

            if (schemeRestrictsGender &&
                !rules.GenderRestriction.Equals(profile.Gender, StringComparison.OrdinalIgnoreCase))
            {
                // "women entrepreneurs" is the existing string, preserved character-for-character
                // for the Female restriction that is the only one seeded (R3.3). A Male
                // restriction gets the parallel wording rather than a factually wrong one.
                negativeReasons.Add(rules.GenderRestriction.Equals("Male", StringComparison.OrdinalIgnoreCase)
                    ? "Scheme is exclusively reserved for men entrepreneurs."
                    : "Scheme is exclusively reserved for women entrepreneurs.");

                eligibilityScore = Math.Max(0, eligibilityScore - Awards.GenderPenalty(rules.Weights.Eligibility));
            }

            // Academic threshold declared by the scheme (education / skill schemes).
            //
            // Merged from main's education-loan rule, which read
            // `scheme.Id == "NSFDC-EDU-03"`. Keyed off the row instead, for the same reason
            // the gender rule above stopped hard-coding an identifier — and here the literal
            // was already dead on arrival: the two branches renumbered slot 03 differently
            // (Mahila Samriddhi here, Educational Loan on main), so no seeded scheme has
            // that id.
            //
            // Unlike every threshold above it, this one is read from Scheme rather than from
            // the Rule_Store: MinAcademicPercentage has no SchemeRules column yet, so there is
            // nothing for an admin to edit. It belongs in the Rule_Store the moment a scheme
            // that actually declares an academic gate is seeded. Until then the default of 0
            // means "no gate declared" and this block never runs, so it cannot shift a score.
            // It only ever appends an explanation — no scoring adjustment either way.
            if (scheme.MinAcademicPercentage > 0)
            {
                double bestAcademicPercentage = Math.Max(profile.TenthMarksPercentage, profile.TwelfthMarksPercentage);

                // Inv on every interpolated number: under de-DE an unpinned double renders
                // "78,5" and drifts the reason strings (R3.3).
                if (bestAcademicPercentage >= scheme.MinAcademicPercentage)
                {
                    positiveReasons.Add($"Academic score (10th: {profile.TenthMarksPercentage.ToString(Inv)}%, 12th: {profile.TwelfthMarksPercentage.ToString(Inv)}%) satisfies educational loan admission norms.");
                }
                else
                {
                    negativeReasons.Add($"Academic percentage falls below the {scheme.MinAcademicPercentage.ToString(Inv)}% threshold for priority educational loan sanction.");
                }
            }

            int totalMatchScore = eligibilityScore + costScore + docScore + partnerScore + prefScore;
            totalMatchScore = Math.Clamp(totalMatchScore, MatchScoreBounds.ClampMin, MatchScoreBounds.ClampMax);

            // Calculate estimated EMI. The ceiling, rate, tenure and moratorium come from the
            // Rule_Store for the same reason the thresholds do: an admin correcting an interest
            // rate must see the quoted EMI move with it.
            decimal loanPortion = Math.Min(profile.RequiredLoanAmount, rules.MaximumProjectCost * EmiProjection.MaximumFinancedShareOfCeiling);
            var emiCalc = _emiService.CalculateEmi(new EmiRequest
            {
                LoanAmount = loanPortion,
                AnnualInterestRate = rules.InterestRate,
                TenureMonths = Math.Min(EmiProjection.MaximumProjectedTenureMonths, rules.MaximumTenureMonths),
                MoratoriumMonths = rules.MoratoriumMonths
            });

            results.Add(new SchemeMatchResult
            {
                SchemeId = scheme.Id,
                SchemeName = scheme.Name,
                SchemeType = scheme.SchemeType,
                MatchScore = totalMatchScore,
                IsRecommended = totalMatchScore >= MatchScoreBounds.RecommendedAtOrAbove,
                PositiveReasons = positiveReasons,
                NegativeReasons = negativeReasons,
                MissingDocuments = missingDocs,
                // Same values, same source as the EMI above — the response cannot quote a ceiling
                // the score was not computed against.
                MaxLoanEligible = rules.MaximumProjectCost,
                InterestRate = rules.InterestRate,
                TenureMonths = rules.MaximumTenureMonths,
                EstimatedEmi = emiCalc.MonthlyEmi,
                OfficialUrl = scheme.OfficialUrl,
                SourceDocument = scheme.SourceDocument,
                LastVerifiedDate = scheme.LastVerifiedDate,
                PartnerAvailability = localPartners.FirstOrDefault()?.InstitutionName ?? "State Channelizing Agency Available",

                // Provenance projection only — no scoring or reason-string change (R2.2).
                // DataProvenance is null when the row is verified, so it is omitted entirely.
                IsIllustrative = scheme.IsIllustrative,
                DataProvenance = DataProvenance.For(scheme.IsIllustrative)
            });
        }

        // Ties broken by scheme identifier in ascending ordinal order (R3.4). Without the
        // tie-break, OrderByDescending's stability made the result order depend on the
        // repository's row order, which PostgreSQL does not guarantee — two identical
        // requests could disagree, and a baseline could never be frozen (R3.6, R3.7).
        // StringComparer.Ordinal, not the current culture: identifiers are opaque ASCII keys.
        return results
            .OrderByDescending(r => r.MatchScore)
            .ThenBy(r => r.SchemeId, StringComparer.Ordinal)
            .ToList();
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

        // Provenance projection only — routing order is untouched (R2.2).
        return DataProvenance.Project(query.ToList());
    }
}
