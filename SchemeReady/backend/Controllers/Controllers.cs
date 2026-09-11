using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using SchemeReady.Api.Data;
using SchemeReady.Api.Models;
using SchemeReady.Api.Services;

namespace SchemeReady.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ISchemeRepository _repository;

    public AuthController(ISchemeRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("captcha")]
    public ActionResult<CaptchaResponse> GetCaptcha()
    {
        var captcha = _repository.GenerateCaptcha();
        return Ok(captcha);
    }

    [HttpPost("login")]
    public ActionResult<AuthResponse> Login([FromBody] AuthRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserIdOrEmail) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new AuthResponse { Success = false, Message = "User ID/Email and Password are required." });
        }

        var res = _repository.AuthenticateUser(request);
        if (!res.Success) return BadRequest(res);
        return Ok(res);
    }

    [HttpPost("signup")]
    public ActionResult<AuthResponse> SignUp([FromBody] AuthRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserIdOrEmail) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new AuthResponse { Success = false, Message = "User ID/Email and Password are required." });
        }

        if (request.Password.Length < 6)
        {
            return BadRequest(new AuthResponse { Success = false, Message = "Password must be at least 6 characters long." });
        }

        var res = _repository.RegisterUser(request);
        if (!res.Success) return BadRequest(res);
        return Ok(res);
    }
}

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
        else if (lower.Contains("student") || lower.Contains("college") || lower.Contains("study") || lower.Contains("ವಿದ್ಯಾರ್ಥಿ"))
            response.BusinessType = "education";

        if (lower.Contains("bengaluru") || lower.Contains("bangalore") || lower.Contains("ಬೆಂಗಳೂರು"))
            response.Location = "Bengaluru";
        else if (lower.Contains("mumbai") || lower.Contains("bombay") || lower.Contains("मुंबई"))
            response.Location = "Mumbai";
        else if (lower.Contains("lucknow") || lower.Contains("लखनउ"))
            response.Location = "Lucknow";
        else if (lower.Contains("chennai") || lower.Contains("madras"))
            response.Location = "Chennai";
        else if (lower.Contains("mysuru") || lower.Contains("mysore") || lower.Contains("ಮೈಸೂರು"))
            response.Location = "Mysuru";
        else if (lower.Contains("hubballi") || lower.Contains("dharwad") || lower.Contains("ಹುಬ್ಬಳ್ಳಿ"))
            response.Location = "Hubballi-Dharwad";

        var lakhMatch = Regex.Match(lower, @"(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|ಲಕ್ಷ|लाख)", RegexOptions.IgnoreCase);
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
        return Ok(schemes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Scheme>> GetById(string id)
    {
        var scheme = await _repository.GetSchemeByIdAsync(id);
        if (scheme == null) return NotFound();
        return Ok(scheme);
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

    public ReadinessController(IReadinessService readinessService)
    {
        _readinessService = readinessService;
    }

    [HttpPost("calculate")]
    public ActionResult<ApplicationReadiness> Calculate([FromBody] BeneficiaryProfile profile)
    {
        var readiness = _readinessService.CalculateReadiness(profile);
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
            UploadedDocs = new() { "Aadhaar/KYC", "Income certificate", "10th Marksheet", "12th Marksheet", "Caste certificate" }
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
        return Ok(partners);
    }

    [HttpGet("route")]
    public async Task<ActionResult<List<ChannelPartner>>> RoutePartners(
        [FromQuery] string district = "Bengaluru", 
        [FromQuery] string? state = "Karnataka", 
        [FromQuery] string? schemeId = null)
    {
        var routed = await _partnerService.GetRecommendedPartnersAsync(district, state, schemeId);
        return Ok(routed);
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

        var partners = await _partnerService.GetRecommendedPartnersAsync(profile.Location, profile.State, scheme.Id);
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
        return Ok(pack);
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
            ForwardedTo = "State Channelizing Agency (SCA)",
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
        return Ok(app);
    }
}

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly ISchemeRepository _repository;

    public AdminController(ISchemeRepository repository)
    {
        _repository = repository;
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
        scheme.LastVerifiedDate = DateTime.UtcNow;
        var saved = await _repository.AddOrUpdateSchemeAsync(scheme);
        return Ok(saved);
    }

    [HttpPost("partners")]
    public async Task<ActionResult<ChannelPartner>> SavePartner([FromBody] ChannelPartner partner)
    {
        partner.LastVerifiedDate = DateTime.UtcNow;
        var saved = await _repository.AddOrUpdatePartnerAsync(partner);
        return Ok(saved);
    }

    [HttpPost("verify-partner/{id}")]
    public async Task<ActionResult<ChannelPartner>> VerifyPartner(string id)
    {
        var partner = await _repository.GetPartnerByIdAsync(id);
        if (partner == null) return NotFound();

        partner.LastVerifiedDate = DateTime.UtcNow;
        var updated = await _repository.AddOrUpdatePartnerAsync(partner);
        return Ok(updated);
    }
}
