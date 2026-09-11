using System.Text.Json;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SchemeReady.Api.Auth;
using SchemeReady.Api.Models;

namespace SchemeReady.Api.Data;

/// <summary>
/// The single EF Core context for SchemeReady, backed by PostgreSQL 16 via Npgsql.
/// Derives from <see cref="IdentityDbContext{TUser}"/> so the initial migration creates the
/// identity tables together with the domain tables (R1.6).
/// </summary>
public class SchemeReadyDbContext : IdentityDbContext<ApplicationUser>
{
    public SchemeReadyDbContext(DbContextOptions<SchemeReadyDbContext> options) : base(options)
    {
    }

    public DbSet<Scheme> Schemes => Set<Scheme>();
    public DbSet<ChannelPartner> ChannelPartners => Set<ChannelPartner>();
    public DbSet<ApplicationPackRow> ApplicationPacks => Set<ApplicationPackRow>();
    public DbSet<SchemeRuleRow> SchemeRules => Set<SchemeRuleRow>();
    public DbSet<ScoringWeight> ScoringWeights => Set<ScoringWeight>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<OfficerPartnerAssignment> OfficerPartnerAssignments => Set<OfficerPartnerAssignment>();
    public DbSet<StoredDocument> StoredDocuments => Set<StoredDocument>();
    public DbSet<AuditEvent> AuditEvents => Set<AuditEvent>();

    /// <summary>
    /// Serialisation options for the <c>jsonb</c> columns. Pinned here — never taken from an
    /// ambient default — so the on-disk representation cannot drift with host configuration.
    /// </summary>
    internal static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    /// <summary>
    /// <c>List&lt;string&gt;</c> &lt;-&gt; <c>jsonb</c>. A null list deserialises to an empty
    /// list rather than null, so a collection property is never null after a read.
    /// </summary>
    private static readonly ValueConverter<List<string>, string> JsonListConverter = new(
        v => JsonSerializer.Serialize(v, JsonOpts),
        v => JsonSerializer.Deserialize<List<string>>(v, JsonOpts) ?? new List<string>());

    /// <summary>
    /// Order-sensitive, deep-copying comparer for the <c>jsonb</c> collection properties (R1.10).
    ///
    /// All three arguments are load-bearing:
    ///
    /// * <c>SequenceEqual(..., StringComparer.Ordinal)</c> — comparison is positional, so a pure
    ///   reorder (<c>["A","B"]</c> to <c>["B","A"]</c>) is a change; and ordinal, so <c>"SC"</c>
    ///   and <c>"sc"</c> stay distinct.
    /// * the ordinal aggregate hash — consistent with that equality.
    /// * <c>v =&gt; v.ToList()</c> — the snapshot is an independent copy. Without it EF snapshots
    ///   the list *reference*, so <c>scheme.SupportedDistricts.Add("Kolar")</c> mutates the very
    ///   object the snapshot points at, <c>DetectChanges</c> compares the list to itself, finds
    ///   nothing, and <c>SaveChanges</c> silently writes nothing — losing adds, removes and
    ///   reorders alike.
    /// </summary>
    private static readonly ValueComparer<List<string>> OrderedListComparer = new(
        (a, b) => a != null && b != null && a.SequenceEqual(b, StringComparer.Ordinal),
        v => v.Aggregate(0, (h, s) => HashCode.Combine(h, StringComparer.Ordinal.GetHashCode(s))),
        v => v.ToList());

    /// <summary>
    /// Forces <c>DateTimeKind.Utc</c> across the <c>timestamptz</c> boundary.
    ///
    /// Npgsql 6 and later reject a <see cref="DateTime"/> whose <c>Kind</c> is
    /// <c>Unspecified</c> or <c>Local</c> when the column is <c>timestamp with time zone</c>,
    /// and the seed rows use <c>new DateTime(2026, 9, 10)</c> — <c>Unspecified</c>. Ticks are
    /// unchanged for <c>Unspecified</c> (relabelled) and correctly shifted for <c>Local</c>, and
    /// <see cref="DateTime.Equals(DateTime)"/> ignores <c>Kind</c>, so the round-trip equality of
    /// R1.15 still holds.
    /// </summary>
    private static readonly ValueConverter<DateTime, DateTime> UtcDateTime = new(
        v => v.Kind == DateTimeKind.Local ? v.ToUniversalTime() : DateTime.SpecifyKind(v, DateTimeKind.Utc),
        v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

    private static readonly ValueConverter<DateTime?, DateTime?> UtcDateTimeNullable = new(
        v => v.HasValue
            ? (v.Value.Kind == DateTimeKind.Local ? v.Value.ToUniversalTime() : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc))
            : v,
        v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v);

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);

        ConfigureScheme(b);
        ConfigureChannelPartner(b);
        ConfigureApplicationPack(b);
        ConfigureRuleStore(b);
        ConfigureAuth(b);
        ConfigureStoredDocuments(b);
        ConfigureAuditEvents(b);

        // Every DateTime and DateTime? in the model lands on timestamptz through the
        // UTC-normalising converters above, applied once here so no mapping can be forgotten.
        ApplyUtcDateTimeConverters(b);
    }

    private static void ConfigureScheme(ModelBuilder b)
    {
        var scheme = b.Entity<Scheme>();
        scheme.ToTable("Schemes");
        scheme.HasKey(s => s.Id);

        scheme.Property(s => s.Id).HasColumnType("text").HasMaxLength(64).IsRequired();   // R1.5
        scheme.Property(s => s.Name).HasColumnType("text").IsRequired();
        scheme.Property(s => s.SchemeType).HasColumnType("text").IsRequired();
        scheme.Property(s => s.TargetGroup).HasColumnType("text").IsRequired();
        scheme.Property(s => s.IncomeLimit).HasColumnType("numeric(12,2)");
        scheme.Property(s => s.MinimumProjectCost).HasColumnType("numeric(12,2)");
        scheme.Property(s => s.MaximumProjectCost).HasColumnType("numeric(12,2)");
        scheme.Property(s => s.InterestRate).HasColumnType("numeric(5,2)");               // R1.5
        scheme.Property(s => s.ApplicationMode).HasColumnType("text").IsRequired();
        scheme.Property(s => s.OfficialUrl).HasColumnType("text").IsRequired();
        scheme.Property(s => s.SourceDocument).HasColumnType("text").IsRequired();
        scheme.Property(s => s.Status).HasColumnType("text").IsRequired();
        scheme.Property(s => s.Description).HasColumnType("text").IsRequired();

        scheme.Property(s => s.GenderRestriction)
              .HasColumnType("text").IsRequired().HasDefaultValue("Any");

        scheme.Property(s => s.IsIllustrative).HasDefaultValue(true);                     // R2.1
        scheme.Property(s => s.VerificationSourceReference).HasColumnType("text").HasMaxLength(300);

        foreach (var nav in new[] { nameof(Scheme.EligibleBusinessTypes),
                                    nameof(Scheme.RequiredDocuments),
                                    nameof(Scheme.SupportedDistricts) })
        {
            scheme.Property<List<string>>(nav)
                  .HasColumnType("jsonb")
                  .HasConversion(JsonListConverter, OrderedListComparer)                 // R1.10
                  .IsRequired();
        }
    }

    private static void ConfigureChannelPartner(ModelBuilder b)
    {
        var partner = b.Entity<ChannelPartner>();
        partner.ToTable("ChannelPartners");
        partner.HasKey(p => p.Id);

        partner.Property(p => p.Id).HasColumnType("text").HasMaxLength(64).IsRequired();
        partner.Property(p => p.InstitutionName).HasColumnType("text").IsRequired();
        partner.Property(p => p.InstitutionType).HasColumnType("text").IsRequired();
        partner.Property(p => p.District).HasColumnType("text").IsRequired();
        partner.Property(p => p.State).HasColumnType("text").IsRequired();
        partner.Property(p => p.ContactNumber).HasColumnType("text").IsRequired();
        partner.Property(p => p.ContactPerson).HasColumnType("text").IsRequired();
        partner.Property(p => p.Address).HasColumnType("text").IsRequired();
        partner.Property(p => p.ApplicationMode).HasColumnType("text").IsRequired();
        partner.Property(p => p.Pincode).HasColumnType("text").IsRequired();
        partner.Property(p => p.DistanceKm).HasColumnType("double precision");
        partner.Property(p => p.Latitude).HasColumnType("double precision");
        partner.Property(p => p.Longitude).HasColumnType("double precision");

        partner.Property(p => p.IsIllustrative).HasDefaultValue(true);                    // R2.1
        partner.Property(p => p.VerificationSourceReference).HasColumnType("text").HasMaxLength(300);

        foreach (var nav in new[] { nameof(ChannelPartner.SupportedSchemes),
                                    nameof(ChannelPartner.DocumentRequirements) })
        {
            partner.Property<List<string>>(nav)
                   .HasColumnType("jsonb")
                   .HasConversion(JsonListConverter, OrderedListComparer)                // R1.10
                   .IsRequired();
        }

        partner.HasIndex(p => p.District);
    }

    private static void ConfigureApplicationPack(ModelBuilder b)
    {
        var pack = b.Entity<ApplicationPackRow>();
        pack.ToTable("ApplicationPacks");
        pack.HasKey(a => a.ApplicationId);

        pack.Property(a => a.ApplicationId).HasColumnType("text").HasMaxLength(64).IsRequired();
        pack.Property(a => a.OwnerUserId).HasColumnType("text");
        pack.Property(a => a.AssignedPartnerId).HasColumnType("text").HasMaxLength(64);
        pack.Property(a => a.SelectedSchemeId).HasColumnType("text").HasMaxLength(64).IsRequired();
        pack.Property(a => a.TrackingStatus).HasColumnType("text").IsRequired();
        pack.Property(a => a.HandoffReferenceNumber).HasColumnType("text").IsRequired();
        pack.Property(a => a.ApplicantBusinessType).HasColumnType("text").IsRequired();
        pack.Property(a => a.District).HasColumnType("text").IsRequired();

        pack.Property(a => a.MissingDocuments)
            .HasColumnName("MissingDocumentsJson")
            .HasColumnType("jsonb")
            .HasConversion(JsonListConverter, OrderedListComparer)                        // R1.10
            .IsRequired();

        // The dossier itself. jsonb, not text, so the admin aggregates can reach into it.
        pack.Property(a => a.FullDossierJson).HasColumnType("jsonb").IsRequired();

        pack.HasIndex(a => a.OwnerUserId);
        pack.HasIndex(a => a.AssignedPartnerId);
        pack.HasIndex(a => a.GeneratedDate);
        pack.HasIndex(a => a.ApplicantBusinessType);
        pack.HasIndex(a => a.District);
    }

    private static void ConfigureRuleStore(ModelBuilder b)
    {
        // Phase A creates these tables because R1.6 requires the initial migration to do so.
        // Seeding, the CHECK constraints for the declared bounds, and every read of these
        // tables arrive in Phase E (tasks 15.1–15.4).
        var rule = b.Entity<SchemeRuleRow>();
        rule.ToTable("SchemeRules");
        rule.HasKey(r => r.SchemeId);
        rule.Property(r => r.SchemeId).HasColumnType("text").HasMaxLength(64).IsRequired();
        rule.Property(r => r.IncomeLimit).HasColumnType("numeric(12,2)");
        rule.Property(r => r.MinimumProjectCost).HasColumnType("numeric(12,2)");
        rule.Property(r => r.MaximumProjectCost).HasColumnType("numeric(12,2)");
        rule.Property(r => r.InterestRate).HasColumnType("numeric(5,2)");
        rule.Property(r => r.GenderRestriction).HasColumnType("text").IsRequired().HasDefaultValue("Any");
        rule.Property(r => r.EligibleBusinessTypes)
            .HasColumnType("jsonb").HasConversion(JsonListConverter, OrderedListComparer).IsRequired();
        rule.Property(r => r.EligibleCategories)
            .HasColumnType("jsonb").HasConversion(JsonListConverter, OrderedListComparer).IsRequired();

        rule.HasOne<Scheme>()
            .WithMany()
            .HasForeignKey(r => r.SchemeId)
            .OnDelete(DeleteBehavior.Cascade);

        var weight = b.Entity<ScoringWeight>();
        weight.ToTable("ScoringWeights");
        weight.HasKey(w => w.ComponentName);
        weight.Property(w => w.ComponentName).HasColumnType("text").HasMaxLength(64).IsRequired();
    }

    private static void ConfigureAuth(ModelBuilder b)
    {
        var token = b.Entity<RefreshToken>();
        token.ToTable("RefreshTokens");
        token.HasKey(t => t.Id);
        token.Property(t => t.UserId).HasColumnType("text").IsRequired();
        token.Property(t => t.TokenHash).HasColumnType("text").IsRequired();
        token.Property(t => t.ReplacedByHash).HasColumnType("text");

        token.HasIndex(t => t.TokenHash).IsUnique();

        // Family revocation becomes a single indexed statement (design C6).
        token.HasIndex(t => t.UserId)
             .HasDatabaseName("ix_refresh_tokens_user_live")
             .HasFilter("\"RevokedAt\" IS NULL");

        token.HasOne<ApplicationUser>()
             .WithMany()
             .HasForeignKey(t => t.UserId)
             .OnDelete(DeleteBehavior.Cascade);

        var assignment = b.Entity<OfficerPartnerAssignment>();
        assignment.ToTable("OfficerPartnerAssignments");
        assignment.HasKey(a => a.UserId);
        assignment.Property(a => a.UserId).HasColumnType("text").IsRequired();
        assignment.Property(a => a.PartnerId).HasColumnType("text").HasMaxLength(64).IsRequired();

        assignment.HasOne<ApplicationUser>()
                  .WithMany()
                  .HasForeignKey(a => a.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

        assignment.HasOne<ChannelPartner>()
                  .WithMany()
                  .HasForeignKey(a => a.PartnerId)
                  .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureStoredDocuments(ModelBuilder b)
    {
        var doc = b.Entity<StoredDocument>();
        doc.ToTable("StoredDocuments");
        doc.HasKey(d => d.Id);
        doc.Property(d => d.OwnerUserId).HasColumnType("text").IsRequired();
        doc.Property(d => d.ApplicationPackId).HasColumnType("text").HasMaxLength(64);
        doc.Property(d => d.DocumentKey).HasColumnType("text").HasMaxLength(32).IsRequired();
        doc.Property(d => d.OriginalFileName).HasColumnType("text").HasMaxLength(255).IsRequired();
        doc.Property(d => d.StoredFileName).HasColumnType("text").IsRequired();
        doc.Property(d => d.ContentType).HasColumnType("text").IsRequired();
        doc.Property(d => d.ByteLength).HasColumnType("bigint");
        doc.Property(d => d.Sha256).HasColumnType("text").IsRequired();

        // At most one live document per (owner, key), enforced by the database (R6.11).
        doc.HasIndex(d => new { d.OwnerUserId, d.DocumentKey })
           .HasDatabaseName("ux_stored_documents_owner_key_live")
           .HasFilter("\"DeletedAt\" IS NULL")
           .IsUnique();

        doc.HasOne<ApplicationUser>()
           .WithMany()
           .HasForeignKey(d => d.OwnerUserId)
           .OnDelete(DeleteBehavior.Cascade);

        doc.HasOne<ApplicationPackRow>()
           .WithMany()
           .HasForeignKey(d => d.ApplicationPackId)
           .OnDelete(DeleteBehavior.SetNull);
    }

    private static void ConfigureAuditEvents(ModelBuilder b)
    {
        var audit = b.Entity<AuditEvent>();
        audit.ToTable("AuditEvents");
        audit.HasKey(e => e.Id);

        // bigint GENERATED BY DEFAULT AS IDENTITY, replacing IDENTITY(1,1) (R1.7).
        audit.Property(e => e.Id).HasColumnType("bigint").UseIdentityByDefaultColumn();

        audit.Property(e => e.ActorId).HasColumnType("text").IsRequired();
        audit.Property(e => e.ActionType).HasColumnType("text").IsRequired();
        audit.Property(e => e.EntityType).HasColumnType("text").IsRequired();
        audit.Property(e => e.EntityId).HasColumnType("text").IsRequired();
        audit.Property(e => e.SourceIpAddress).HasColumnType("text").IsRequired();
        audit.Property(e => e.Outcome).HasColumnType("text").IsRequired();
        audit.Property(e => e.Detail).HasColumnType("jsonb");

        audit.HasIndex(e => e.OccurredAt).IsDescending();
    }

    private static void ApplyUtcDateTimeConverters(ModelBuilder b)
    {
        foreach (var entity in b.Model.GetEntityTypes())
        {
            foreach (var property in entity.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetColumnType("timestamp with time zone");
                    property.SetValueConverter(UtcDateTime);
                }
                else if (property.ClrType == typeof(DateTime?))
                {
                    property.SetColumnType("timestamp with time zone");
                    property.SetValueConverter(UtcDateTimeNullable);
                }
            }
        }
    }
}
