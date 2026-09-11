using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchemeReady.Api.Auth;
using SchemeReady.Api.Data;
using SchemeReady.Api.Models;
using SchemeReady.Api.Services;

namespace SchemeReady.Api.Controllers;

// main's demo AuthController (SHA-256 + arithmetic captcha, in-memory user list) was
// removed here during the merge. Phase C+D superseded it: Controllers/AuthController.cs
// serves the same "api/auth" route with ASP.NET Identity, signed JWTs and refresh-token
// rotation. Keeping both would have been a duplicate class in this namespace and two
// controllers claiming one route.

[ApiController]
[Route("api/[controller]")]
public class OnboardingController : ControllerBase
{
    [AllowAnonymous]                                             // R4.16
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

    [AllowAnonymous]                                             // R4.16
    [HttpGet]
    public async Task<ActionResult<List<Scheme>>> GetAll()
    {
        var schemes = await _repository.GetAllSchemesAsync();
        return Ok(DataProvenance.Project(schemes));
    }

    [AllowAnonymous]                                             // R4.16
    [HttpGet("{id}")]
    public async Task<ActionResult<Scheme>> GetById(string id)
    {
        var scheme = await _repository.GetSchemeByIdAsync(id);
        if (scheme == null) return NotFound();
        return Ok(DataProvenance.Project(scheme));
    }

    [AllowAnonymous]                                             // R4.16
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
    private readonly IDocumentService _documents;

    public ReadinessController(
        IReadinessService readinessService,
        ISchemeRepository repository,
        IDocumentService documents)
    {
        _readinessService = readinessService;
        _repository = repository;
        _documents = documents;
    }

    [Authorize(Roles = RoleNames.AnySignedIn)]                   // R4.15
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

    /// <summary>
    /// The retained legacy upload route (R6, task 13.4). Route, verb and success response
    /// schema are exactly as before — still <c>POST /api/readiness/upload-doc</c> returning an
    /// <see cref="ApplicationReadiness"/> — but the body it returns is now earned.
    ///
    /// What was here before did no upload at all: it fabricated a profile in which
    /// <c>HasCasteCertificate = docKey == "caste_cert" || true</c> — an expression whose
    /// <c>|| true</c> makes it unconditionally true — and every other document present, then
    /// returned the score for that fiction. Any caller, uploading nothing, was told they were
    /// ready to submit. It now delegates to <see cref="IDocumentService"/>: the file is
    /// validated and stored, and the score is recalculated over the documents that actually
    /// exist for the caller.
    /// </summary>
    [Authorize(Roles = RoleNames.AnySignedIn)]                   // R4.15
    [HttpPost("upload-doc")]
    [RequestSizeLimit(6 * 1024 * 1024)]
    public async Task<ActionResult<ApplicationReadiness>> UploadDocument(
        [FromForm] string docKey,
        [FromForm] string profileId,
        CancellationToken ct)
    {
        var userId = User.UserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var files = Request.HasFormContentType ? Request.Form.Files : null;
        if (files is null || files.Count != 1)
        {
            return BadRequest(new { error = "file: exactly one file part is required." });
        }

        var sourceIp = HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? string.Empty;

        // profileId is retained in the signature so the request schema is unchanged; it names
        // the dossier the document evidences, which is what enables officer access (R6.15).
        var outcome = await _documents.UploadAsync(files[0], docKey, userId, profileId, sourceIp, ct);

        if (!outcome.Succeeded)
        {
            return BadRequest(new { error = outcome.Error });
        }

        var readiness = await _documents.RecalculateReadinessAsync(userId, ct);

        var schemes = await _repository.GetAllSchemesAsync();
        readiness.DataProvenance = DataProvenance.For(schemes.Any(x => x.IsIllustrative));

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

    [AllowAnonymous]                                             // R4.16
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

    [AllowAnonymous]                                             // R4.16
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

    [AllowAnonymous]                                             // R4.16
    [HttpGet]
    public async Task<ActionResult<List<ChannelPartner>>> GetAll()
    {
        var partners = await _repository.GetAllPartnersAsync();
        return Ok(DataProvenance.Project(partners));
    }

    [AllowAnonymous]                                             // R4.16
    [HttpGet("route")]
    public async Task<ActionResult<List<ChannelPartner>>> RoutePartners(
        [FromQuery] string district = "Bengaluru", 
        [FromQuery] string? state = "Karnataka", 
        [FromQuery] string? schemeId = null)
    {
        var routed = await _partnerService.GetRecommendedPartnersAsync(district, state, schemeId);
        return Ok(DataProvenance.Project(routed));
    }
}

[ApiController]
[Route("api/application-pack")]
[Route("api/applicationpack")]
[Authorize(Roles = RoleNames.AnySignedIn)]                       // R4.15 — all three actions
public class ApplicationPackController : ControllerBase
{
    private readonly ISchemeRepository _repository;
    private readonly ISchemeMatchingService _matchingService;
    private readonly IBusinessPlanService _businessPlanService;
    private readonly IEmiCalculatorService _emiService;
    private readonly IReadinessService _readinessService;
    private readonly IPartnerRoutingService _partnerService;
    private readonly IApplicationPackAccessService _access;
    private readonly IAuditWriter _audit;

    public ApplicationPackController(
        ISchemeRepository repository,
        ISchemeMatchingService matchingService,
        IBusinessPlanService businessPlanService,
        IEmiCalculatorService emiService,
        IReadinessService readinessService,
        IPartnerRoutingService partnerService,
        IApplicationPackAccessService access,
        IAuditWriter audit)
    {
        _repository = repository;
        _matchingService = matchingService;
        _businessPlanService = businessPlanService;
        _emiService = emiService;
        _readinessService = readinessService;
        _partnerService = partnerService;
        _access = access;
        _audit = audit;
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

        // R4.17 — the dossier is bound to the authenticated requester. AssignedPartnerId is
        // already persisted by the repository from NearestPartner.Id, which is the routed
        // partner this method computed; together they are what every later access check reads.
        var ownerUserId = User.UserId();
        if (!string.IsNullOrEmpty(ownerUserId))
        {
            await _access.RecordOwnershipAsync(pack.ApplicationId, ownerUserId);
        }

        // Projected after the save so the notice is a response concern only and never
        // becomes part of the stored dossier (R2.2, R2.8).
        return Ok(DataProvenance.Project(pack));
    }

    /// <summary>
    /// Marks a dossier transferred to the PM-SURAJ demonstration gateway.
    ///
    /// The previous implementation read every application into memory, set
    /// <c>TrackingStatus</c> on the detached list element, and returned success — the write
    /// went nowhere, so the very next read still reported "Ready for Submission" while the
    /// caller had been told the handoff completed. It now persists through
    /// <c>SaveApplicationAsync</c>, and only for a dossier the caller may actually act on:
    /// owner or Admin, with 404 for everything else (R4.19).
    /// </summary>
    [HttpPost("handoff/{id}")]
    public async Task<ActionResult<object>> HandoffToSuraj(string id)
    {
        var app = await _access.GetWritablePackAsync(id, User);
        if (app is null) return NotFound();                      // absent or foreign — indistinguishable

        app.TrackingStatus = "Transferred to PM-SURAJ Portal";
        await _repository.SaveApplicationAsync(app);

        await _audit.WriteAsync(new AuditEvent
        {
            OccurredAt = DateTime.UtcNow,
            ActorId = User.UserId() ?? "anonymous",
            ActionType = "ApplicationHandoff",
            EntityType = "ApplicationPack",
            EntityId = app.ApplicationId,
            SourceIpAddress = HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? string.Empty,
            Outcome = "Success",
            Detail = JsonSerializer.Serialize(new { trackingStatus = app.TrackingStatus })
        });

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

    /// <summary>
    /// R4.18, R4.19. Readable by the owner, by an Officer whose <c>partner_id</c> claim matches
    /// the dossier's assigned partner, and by an Admin. Every other outcome — no such dossier,
    /// or somebody else's — is the same 404 with no dossier field values, so the endpoint cannot
    /// be used to discover that an application id exists.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationPack>> GetById(string id)
    {
        var app = await _access.GetReadablePackAsync(id, User);
        if (app == null) return NotFound();
        return Ok(DataProvenance.Project(app));
    }
}

[ApiController]
[Route("api/[controller]")]
// R4.14 covers stats, schemes, partners and verify-partner; the two verification routes added in
// Phase A carry the Admin_Role requirement of R2.6, which had no principal to check until now.
// Declaring it once on the controller means a new admin action cannot be added unattributed.
[Authorize(Roles = RoleNames.Admin)]
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
