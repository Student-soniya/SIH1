using System.Security.Cryptography;

namespace SchemeReady.Api.Services;

/// <summary>
/// The on-disk layout of design C8, resolved once at startup from
/// <c>SCHEMEREADY_DOCUMENT_ROOT</c>:
///
/// <code>
/// $SCHEMEREADY_DOCUMENT_ROOT/
///   documents/{ownerUserId}/{32-hex}.pdf     ← 128 bits from RandomNumberGenerator
///   tmp/{guid}.part                          ← same volume, so File.Move is atomic
/// </code>
///
/// The root is deliberately <em>not</em> under <c>wwwroot</c> — this API serves no static
/// files at all, and nothing here is ever added to a static-file middleware path, so no
/// static-content URL can resolve to a document's bytes (R6.9).
///
/// A future deployment that wants object storage would implement an alternative behind this
/// class's three methods; the spec's approved design requires a private local root, so no
/// remote-storage client is wired here.
/// </summary>
public class DocumentStorage
{
    public const string RootConfigKey = "SCHEMEREADY_DOCUMENT_ROOT";

    private readonly string _root;

    public DocumentStorage(string root)
    {
        _root = root;
        Directory.CreateDirectory(DocumentsRoot);
        Directory.CreateDirectory(TempRoot);
    }

    public string DocumentsRoot => Path.Combine(_root, "documents");

    public string TempRoot => Path.Combine(_root, "tmp");

    public static DocumentStorage FromConfigurationOrThrow(IConfiguration cfg)
    {
        var root = cfg[RootConfigKey];
        if (string.IsNullOrWhiteSpace(root))
        {
            throw new InvalidOperationException(
                $"Missing required configuration: {RootConfigKey}. See docs/local-build-and-migrations.md.");
        }

        return new DocumentStorage(Path.GetFullPath(root));
    }

    /// <summary>A fresh path under <c>tmp/</c>, on the same volume as <c>documents/</c>.</summary>
    public string NewTempPath() => Path.Combine(TempRoot, $"{Guid.NewGuid():N}.part");

    /// <summary>
    /// 32 hexadecimal characters — 128 bits from <see cref="RandomNumberGenerator"/> — plus the
    /// already-validated extension. Derived with no reference whatsoever to any client-supplied
    /// value (R6.7).
    /// </summary>
    public static string NewStoredFileName(string validatedExtension) =>
        Convert.ToHexString(RandomNumberGenerator.GetBytes(16)).ToLowerInvariant() + validatedExtension;

    /// <summary>Absolute path of a stored document. Composed from the database row only —
    /// no request parameter reaches this method (R6.12).</summary>
    public string PathFor(string ownerUserId, string storedFileName) =>
        Path.Combine(DocumentsRoot, ownerUserId, storedFileName);

    public void EnsureOwnerDirectory(string ownerUserId) =>
        Directory.CreateDirectory(Path.Combine(DocumentsRoot, ownerUserId));

    /// <summary>
    /// Name for the <c>Content-Disposition</c> header: quotes, backslashes and control
    /// characters removed so the header value cannot be split or escaped (R6.17).
    /// </summary>
    public static string HeaderSafeFileName(string original) =>
        new(original.Where(c => !char.IsControl(c) && c != '"' && c != '\\').ToArray());

    public void DeleteQuietly(string? path)
    {
        if (string.IsNullOrWhiteSpace(path)) return;
        try
        {
            if (File.Exists(path)) File.Delete(path);
        }
        catch (IOException)
        {
            // A byte file that cannot be removed must not turn a successful metadata
            // operation into a failure; the row is already marked deleted either way.
        }
        catch (UnauthorizedAccessException)
        {
        }
    }
}
