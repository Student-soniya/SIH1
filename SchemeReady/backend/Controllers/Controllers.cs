using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using SchemeReady.Api.Data;
using SchemeReady.Api.Models;
using SchemeReady.Api.Services;

namespace SchemeReady.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OnboardingController : ControllerBase
{
    [HttpPost("extract")]
    public ActionResult<ConversationalExtractResponse> ExtractEntities([FromBody] ConversationalExtractRequest request)
    {
        string text = request.UserSpeechOrText ?? string.Empty;
        var response = new ConversationalExtractResponse
        {
            RawInput = text,
            BusinessType = "general_micro_enterprise",
            Location = "Bengaluru",
            RequiredAmount = 100000,
            UserType = "new_entrepreneur",
            Category = "SC"
        };

        string lower = text.ToLowerInvariant();

        if (lower.Contains("tailor") || lower.Contains("stitching") || lower.Contains("garment") || lower.Contains("ಬಟ್ಟೆ ಹೊಲಿಗೆ"))
            response.BusinessType = "tailoring";
        else if (lower.Contains("mobile") || lower.Contains("phone") || lower.Contains("electronics") || lower.Contains("ಮೊಬೈಲ್"))
            response.BusinessType = "mobile repair";
        else if (lower.Contains("food") || lower.Contains("stall") || lower.Contains("tea") || lower.Contains("cart") || lower.Contains("ಹೋಟೆಲ್"))
            response.BusinessType = "food stall";
        else if (lower.Contains("rickshaw") || lower.Contains("auto") || lower.Contains("driver") || lower.Contains("ಆಟೋ"))
            response.BusinessType = "e-rickshaw";
        else if (lower.Contains("carpenter") || lower.Contains("wood") || lower.Contains("ಬಡಗಿ"))
            response.BusinessType = "carpentry";
        else if (lower.Contains("leather") || lower.Contains("shoe") || lower.Contains("ಚರ್ಮ"))
            response.BusinessType = "leather craft";
        else if (lower.Contains("grocery") || lower.Contains("shop") || lower.Contains("ಅಂಗಡಿ"))
            response.BusinessType = "grocery";

        if (lower.Contains("bengaluru") || lower.Contains("bangalore") || lower.Contains("ಬೆಂಗಳೂರು"))
            response.Location = "Bengaluru";
        else if (lower.Contains("mysuru") || lower.Contains("mysore") || lower.Contains("ಮೈಸೂರು"))
            response.Location = "Mysuru";
        else if (lower.Contains("hubballi") || lower.Contains("dharwad") || lower.Contains("ಹುಬ್ಬಳ್ಳಿ"))
            response.Location = "Hubballi-Dharwad";
        else if (lower.Contains("belagavi") || lower.Contains("belgaum") || lower.Contains("ಬೆಳಗಾವಿ"))
            response.Location = "Belagavi";
        else if (lower.Contains("kalaburagi") || lower.Contains("gulbarga") || lower.Contains("ಕಲಬುರಗಿ"))
            response.Location = "Kalaburagi";

        var lakhMatch = Regex.Match(lower, @"(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|ಲಕ್ಷ)", RegexOptions.IgnoreCase);
        if (lakhMatch.Success && decimal.TryParse(lakhMatch.Groups[1].Value, out decimal lakhs))
        {
            response.RequiredAmount = lakhs * 100000m;
        }
        else
        {
            var numMatch = Regex.Match(lower, @"(?:₹|rs\.?|inr)?\s*(\d{4,7})", RegexOptions.IgnoreCase);
            if (numMatch.Success && decimal.TryParse(numMatch.Groups[1].Value, out decimal directAmt))
            {
                response.RequiredAmount = directAmt;
            }
        }

        if (lower.Contains("student") || lower.Contains("college") || lower.Contains("ವಿದ್ಯಾರ್ಥಿ"))
            response.UserType = "student";
        else if (lower.Contains("existing") || lower.Contains("expand") || lower.Contains("already running"))
            response.UserType = "existing_entrepreneur";
        else
            response.UserType = "new_entrepreneur";

        response.LocalizedSummary = new Dictionary<string, string>
        {
            { "en", $"Identified: {response.BusinessType} in {response.Location} requiring Rs {response.RequiredAmount:N0} ({response.UserType})" },
            { "kn", $"ಗುರುತಿಸಲಾಗಿದೆ: {response.Location} ನಲ್ಲಿ {response.BusinessType} ಉದ್ಯಮ, ಅಗತ್ಯವಿರುವ ಸಾಲ ಮೊತ್ತ ₹{response.RequiredAmount:N0}" },
            { "hi", $"पहचान की गई: {response.Location} में {response.BusinessType} व्यवसाय, ऋण आवश्यकता ₹{response.RequiredAmount:N0}" }
        };

        return Ok(response);
    }
}

[ApiController]
[Route("api/[controller]")]
public class SchemesController : ControllerBase
{
    private readonly ISchemeRepository _repository;
    private readonly ISchemeMatchingService _matchingService;

    public SchemesController(ISchemeRepository repository, ISchemeMatchingService matchingService)
    {
        _repository = repository;
        _matchingService = matchingService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Scheme>>> GetAll()
    {
        var schemes = await _repository.GetAllSchemesAsync();
        return Ok(DataProvenance.Project(schemes));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Scheme>> GetById(string id)
    {
        var scheme = await _repository.GetSchemeByIdAsync(id);
        if (scheme == null) return NotFound();
        return Ok(DataProvenance.Project(scheme));
    }

    [HttpPost("match")]
    public async Task<ActionResult<List<SchemeMatchResult>>> MatchSchemes([FromBody] BeneficiaryProfile profile)
    {
        var results = await _matchingService.MatchSchemesAsync(profile);
        return Ok(results);
    }
}

[ApiController]
[Route("api/[controller]")]
public class ReadinessController : ControllerBase
{
    private readonly IReadinessService _readinessService;
    private readonly ISchemeRepository _repository;

    public ReadinessController(IReadinessService readinessService, ISchemeRepository repository)
    {
        _readinessService = readinessService;
        _repository = repository;
    }

    [HttpPost("calculate")]
    public async Task<ActionResult<ApplicationReadiness>> Calculate([FromBody] BeneficiaryProfile profile)
    {
        var readiness = _readinessService.CalculateReadiness(profile);

        // The checklist quotes scheme-derived certificate thresholds, so it carries the
        // notice while any stored scheme row is still illustrative (R2.2). Additive field;
        // the readiness service itself is untouched.
        var schemes = await _repository.GetAllSchemesAsync();
        readiness.DataProvenance = DataProvenance.For(schemes.Any(x => x.IsIllustrative));
        return Ok(readiness);
    }

    [HttpPost("upload-doc")]
    public ActionResult<ApplicationReadiness> UploadDocument([FromForm] string docKey, [FromForm] string profileId)
    {
        var profile = new BeneficiaryProfile
        {
            Id = profileId,
            HasCasteCertificate = docKey == "caste_cert" || true,
            HasIncomeCertificate = true,
            UploadedDocs = new() { "Aadhaar/KYC", "Income certificate", "Business quotation", "Caste certificate" }
        };

        var readiness = _readinessService.CalculateReadiness(profile);
        return Ok(readiness);
    }
}

[ApiController]
[Route("api/business-plan")]
[Route("api/businessplan")]
public class BusinessPlanController : ControllerBase
{
    private readonly IBusinessPlanService _planService;

    public BusinessPlanController(IBusinessPlanService planService)
    {
        _planService = planService;
    }

    [HttpPost("generate")]
    public ActionResult<BusinessPlanReport> GeneratePlan([FromBody] BusinessPlanRequest request)
    {
        var report = _planService.GeneratePlan(request);
        return Ok(report);
    }
}

[ApiController]
[Route("api/[controller]")]
public class EmiController : ControllerBase
{
    private readonly IEmiCalculatorService _emiService;

    public EmiController(IEmiCalculatorService emiService)
    {
        _emiService = emiService;
    }

    [HttpPost("calculate")]
    public ActionResult<EmiCalculationResult> Calculate([FromBody] EmiRequest request)
    {
        var result = _emiService.CalculateEmi(request);
        return Ok(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class PartnersController : ControllerBase
{
    private readonly IPartnerRoutingService _partnerService;
    private readonly ISchemeRepository _repository;

    public PartnersController(IPartnerRoutingService partnerService, ISchemeRepository repository)
    {
        _partnerService = partnerService;
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<ChannelPartner>>> GetAll()
    {
        var partners = await _repository.GetAllPartnersAsync();
        return Ok(DataProvenance.Project(partners));
    }

    [HttpGet("route")]
    public async Task<ActionResult<List<ChannelPartner>>> RoutePartners([FromQuery] string district = "Bengaluru", [FromQuery] string? schemeId = null)
    {
        var routed = await _partnerService.GetRecommendedPartnersAsync(district, schemeId);
        return Ok(DataProvenance.Project(routed));
    }
}

[ApiController]
[Route("api/application-pack")]
[Route("api/applicationpack")]
public class ApplicationPackController : ControllerBase
{
    private readonly ISchemeRepository _repository;
    private readonly ISchemeMatchingService _matchingService;
    private readonly IBusinessPlanService _businessPlanService;
    private readonly IEmiCalculatorService _emiService;
    private readonly IReadinessService _readinessService;
    private readonly IPartnerRoutingService _partnerService;

    public ApplicationPackController(
        ISchemeRepository repository,
        ISchemeMatchingService matchingService,
        IBusinessPlanService businessPlanService,
        IEmiCalculatorService emiService,
        IReadinessService readinessService,
        IPartnerRoutingService partnerService)
    {
        _repository = repository;
        _matchingService = matchingService;
        _businessPlanService = businessPlanService;
        _emiService = emiService;
        _readinessService = readinessService;
        _partnerService = partnerService;
    }

    [HttpPost("generate")]
    public async Task<ActionResult<ApplicationPack>> GeneratePack([FromBody] BeneficiaryProfile profile)
    {
        var matched = await _matchingService.MatchSchemesAsync(profile);
        var bestSchemeMatch = matched.FirstOrDefault() ?? new SchemeMatchResult();
        var scheme = await _repository.GetSchemeByIdAsync(bestSchemeMatch.SchemeId) ?? (await _repository.GetAllSchemesAsync()).First();

        var readiness = _readinessService.CalculateReadiness(profile);
        var projectReport = _businessPlanService.GeneratePlan(new BusinessPlanRequest
        {
            BusinessType = profile.BusinessType,
            Location = profile.Location,
            EstimatedInvestment = profile.EstimatedProjectCost,
            ExpectedMonthlySales = profile.EstimatedProjectCost * 0.35m
        });

        var emiPlan = _emiService.CalculateEmi(new EmiRequest
        {
            LoanAmount = projectReport.BankLoanRequired,
            AnnualInterestRate = scheme.InterestRate,
            TenureMonths = scheme.MaximumTenureMonths,
            MoratoriumMonths = scheme.MoratoriumMonths
        });

        var partners = await _partnerService.GetRecommendedPartnersAsync(profile.Location, scheme.Id);
        var nearestPartner = partners.FirstOrDefault() ?? (await _repository.GetAllPartnersAsync()).First();

        var pack = new ApplicationPack
        {
            ApplicationId = $"APP-2026-{profile.Location[..Math.Min(3, profile.Location.Length)].ToUpper()}-{Random.Shared.Next(1000, 9999)}",
            GeneratedDate = DateTime.UtcNow,
            Profile = profile,
            SelectedScheme = scheme,
            EligibilityReasons = bestSchemeMatch.PositiveReasons,
            DocumentChecklist = readiness.Items,
            ProjectReport = projectReport,
            EmiPlan = emiPlan,
            NearestPartner = nearestPartner,
            NextSteps = $"1. Visit {nearestPartner.InstitutionName} ({nearestPartner.Address}) with printed copy of this Application Pack.\n2. Submit documents for offline physical verification.\n3. Digital tracking token assigned for direct PM-SURAJ portal linking.",
            TrackingStatus = "Ready for Submission",
            HandoffReferenceNumber = $"SURAJ-2026-DEMO-{Random.Shared.Next(1000, 9999)}"
        };

        await _repository.SaveApplicationAsync(pack);

        // Projected after the save so the notice is a response concern only and never
        // becomes part of the stored dossier (R2.2, R2.8).
        return Ok(DataProvenance.Project(pack));
    }

    [HttpPost("handoff/{id}")]
    public async Task<ActionResult<object>> HandoffToSuraj(string id)
    {
        var apps = await _repository.GetAllApplicationsAsync();
        var app = apps.FirstOrDefault(a => a.ApplicationId == id);
        if (app != null)
        {
            app.TrackingStatus = "Transferred to PM-SURAJ Portal";
        }

        return Ok(new
        {
            Success = true,
            ApplicationId = id,
            Portal = "PM-SURAJ (Pradhan Mantri Samajik Utthan evam Rozgar Adharit Jankalyan)",
            Status = "Transferred to PM-SURAJ Portal",
            ForwardedTo = "Karnataka State Dr. B.R. Ambedkar Development Corporation (SCA)",
            Timestamp = DateTime.UtcNow,
            Message = "Application dossier successfully transmitted to PM-SURAJ portal demonstration gateway."
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationPack>> GetById(string id)
    {
        var apps = await _repository.GetAllApplicationsAsync();
        var app = apps.FirstOrDefault(a => a.ApplicationId == id);
        if (app == null) return NotFound();
        return Ok(DataProvenance.Project(app));
    }
}

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly ISchemeRepository _repository;
    private readonly IAuditWriter _audit;

    public AdminController(ISchemeRepository repository, IAuditWriter audit)
    {
        _repository = repository;
        _audit = audit;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<AdminStatsResponse>> GetStats()
    {
        var stats = await _repository.GetAdminStatsAsync();
        return Ok(stats);
    }

    [HttpPost("schemes")]
    public async Task<ActionResult<Scheme>> SaveScheme([FromBody] Scheme scheme)
    {
        // A full-row save must not become a back door around the verification rules: if the
        // body tries to clear the flag, it faces the same checks as the dedicated endpoint,
        // and on failure the stored flag stays true (R2.6).
        if (!scheme.IsIllustrative)
        {
            var failure = ValidateVerification(scheme.VerificationSourceReference, scheme.VerifiedOn);
            if (failure is not null)
            {
                await AuditFlagChange("Scheme", scheme.Id, "Failure", scheme.VerificationSourceReference, failure);
                scheme.IsIllustrative = true;
                return BadRequest(new { error = failure });
            }
        }

        scheme.LastVerifiedDate = DateTime.UtcNow;
        var saved = await _repository.AddOrUpdateSchemeAsync(scheme);
        return Ok(DataProvenance.Project(saved));
    }

    [HttpPost("partners")]
    public async Task<ActionResult<ChannelPartner>> SavePartner([FromBody] ChannelPartner partner)
    {
        if (!partner.IsIllustrative)
        {
            var failure = ValidateVerification(partner.VerificationSourceReference, partner.VerifiedOn);
            if (failure is not null)
            {
                await AuditFlagChange("ChannelPartner", partner.Id, "Failure", partner.VerificationSourceReference, failure);
                partner.IsIllustrative = true;
                return BadRequest(new { error = failure });
            }
        }

        partner.LastVerifiedDate = DateTime.UtcNow;
        var saved = await _repository.AddOrUpdatePartnerAsync(partner);
        return Ok(DataProvenance.Project(saved));
    }

    [HttpPost("verify-partner/{id}")]
    public async Task<ActionResult<ChannelPartner>> VerifyPartner(string id)
    {
        var partner = await _repository.GetPartnerByIdAsync(id);
        if (partner == null) return NotFound();

        partner.LastVerifiedDate = DateTime.UtcNow;
        var updated = await _repository.AddOrUpdatePartnerAsync(partner);
        return Ok(DataProvenance.Project(updated));
    }

    // ------------------------------------------------- illustrative-flag verification

    /// <summary>
    /// Clears (or restores) a scheme's Illustrative_Flag. Accepting <c>false</c> requires a
    /// 1–300 character source reference and a verification date no later than today; any
    /// shortfall returns 400 naming the failed condition and leaves the stored flag
    /// untouched (R2.5, R2.6). One audit event is written whichever way it goes (R2.7).
    /// </summary>
    [HttpPost("schemes/{id}/verification")]
    public async Task<ActionResult<Scheme>> SetSchemeVerification(string id, [FromBody] VerificationRequest request)
    {
        var scheme = await _repository.GetSchemeByIdAsync(id);
        if (scheme == null) return NotFound();

        if (!request.IsIllustrative)
        {
            var failure = ValidateVerification(request.VerificationSourceReference, request.VerifiedOn);
            if (failure is not null)
            {
                await AuditFlagChange("Scheme", scheme.Id, "Failure", request.VerificationSourceReference, failure);
                return BadRequest(new { error = failure });                  // stored flag unchanged
            }

            scheme.IsIllustrative = false;
            scheme.VerificationSourceReference = request.VerificationSourceReference!.Trim();
            scheme.VerifiedOn = request.VerifiedOn;
        }
        else
        {
            scheme.IsIllustrative = true;
            scheme.VerificationSourceReference = null;
            scheme.VerifiedOn = null;
        }

        var saved = await _repository.AddOrUpdateSchemeAsync(scheme);
        await AuditFlagChange("Scheme", saved.Id, "Success", saved.VerificationSourceReference, null);
        return Ok(DataProvenance.Project(saved));
    }

    /// <summary>
    /// The ChannelPartner counterpart. A separate route from the existing
    /// <c>verify-partner/{id}</c>, whose verb, route and response schema are untouched.
    /// </summary>
    [HttpPost("partners/{id}/verification")]
    public async Task<ActionResult<ChannelPartner>> SetPartnerVerification(string id, [FromBody] VerificationRequest request)
    {
        var partner = await _repository.GetPartnerByIdAsync(id);
        if (partner == null) return NotFound();

        if (!request.IsIllustrative)
        {
            var failure = ValidateVerification(request.VerificationSourceReference, request.VerifiedOn);
            if (failure is not null)
            {
                await AuditFlagChange("ChannelPartner", partner.Id, "Failure", request.VerificationSourceReference, failure);
                return BadRequest(new { error = failure });
            }

            partner.IsIllustrative = false;
            partner.VerificationSourceReference = request.VerificationSourceReference!.Trim();
            partner.VerifiedOn = request.VerifiedOn;
        }
        else
        {
            partner.IsIllustrative = true;
            partner.VerificationSourceReference = null;
            partner.VerifiedOn = null;
        }

        var saved = await _repository.AddOrUpdatePartnerAsync(partner);
        await AuditFlagChange("ChannelPartner", saved.Id, "Success", saved.VerificationSourceReference, null);
        return Ok(DataProvenance.Project(saved));
    }

    private const int ReferenceMinLength = 1;
    private const int ReferenceMaxLength = 300;

    /// <summary>
    /// Returns null when the evidence is acceptable, otherwise the message naming the single
    /// condition that failed. Checks run in a fixed order so the message is deterministic.
    ///
    /// The Admin_Role requirement of R2.6 is enforced by the authorization attributes added
    /// in Phase C, task 10.1 — this phase ships no authentication, so there is no principal
    /// to inspect yet.
    /// </summary>
    private static string? ValidateVerification(string? reference, DateTime? verifiedOn)
    {
        if (string.IsNullOrWhiteSpace(reference))
        {
            return "verificationSourceReference is required when isIllustrative is false.";
        }

        var trimmed = reference.Trim();
        if (trimmed.Length < ReferenceMinLength || trimmed.Length > ReferenceMaxLength)
        {
            return $"verificationSourceReference must be between {ReferenceMinLength} and {ReferenceMaxLength} characters; received {trimmed.Length}.";
        }

        if (!verifiedOn.HasValue)
        {
            return "verifiedOn is required when isIllustrative is false.";
        }

        if (verifiedOn.Value.Date > DateTime.UtcNow.Date)
        {
            return "verifiedOn must not be later than the current date.";
        }

        return null;
    }

    private Task AuditFlagChange(string entityType, string entityId, string outcome, string? reference, string? failure) =>
        _audit.WriteAsync(new AuditEvent
        {
            OccurredAt = DateTime.UtcNow,
            ActorId = User?.Identity?.Name ?? "anonymous",
            ActionType = "IllustrativeFlagChange",
            EntityType = entityType,
            EntityId = entityId ?? string.Empty,
            SourceIpAddress = HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? string.Empty,
            Outcome = outcome,
            Detail = JsonSerializer.Serialize(new
            {
                verificationSourceReference = reference,
                validationFailure = failure
            })
        });
}
