import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../translations';
import {
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Info,
  ArrowRight,
  Sparkles,
  FileText,
  Loader2,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getReadiness, uploadDocument } from '../api';

/** The four document keys the server accepts (R6.1). Checklist rows outside this set are
 *  derived, not uploaded, so they get no file control. */
const UPLOADABLE_KEYS = ['identity', 'caste_cert', 'income_cert', 'quotation'];

/** Mirrors the server's accepted extensions and 5 MiB ceiling so an obviously wrong file gets
 *  instant feedback. The server re-checks everything — including the magic bytes, which a browser
 *  cannot see — so this is a courtesy, never the guarantee. */
const ACCEPTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const MAX_BYTES = 5 * 1024 * 1024;

export default function ReadinessDashboard({
  lang,
  profile,
  setProfile,
  onProceedToBusinessPlan
}) {
  const t = translations[lang] || translations.en;
  const [readinessData, setReadinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // One upload at a time, with an explicit phase so the UI can show progress, then an
  // unmistakable success or failure state.
  const [upload, setUpload] = useState({ key: null, phase: 'idle', message: null, fileName: null });

  const fileInputs = useRef({});

  useEffect(() => {
    let cancelled = false;

    async function fetchReadiness() {
      setLoading(true);
      try {
        const data = await getReadiness(profile);
        if (!cancelled) {
          setReadinessData(data);
          setLoadError(null);
        }
      } catch (err) {
        // R5.11 — the readiness endpoint is protected and has no fallback. Previously loaded
        // data stays on screen; the banner says the refresh failed rather than inventing one.
        if (!cancelled) {
          setLoadError(
            err?.status === 401
              ? 'Your session ended before the checklist could refresh. Please sign in again.'
              : 'The readiness checklist could not be refreshed. The figures below may be out of date.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReadiness();
    return () => { cancelled = true; };
  }, [profile]);

  /** Local pre-check. Returns null when the file looks acceptable. */
  const preCheck = (file) => {
    const name = file.name || '';
    const dot = name.lastIndexOf('.');
    const extension = dot >= 0 ? name.slice(dot).toLowerCase() : '';

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      return `Choose a ${ACCEPTED_EXTENSIONS.join(', ')} file. “${name}” is not one of these.`;
    }
    if (file.size === 0) {
      return 'That file is empty. Please choose the scanned document itself.';
    }
    if (file.size > MAX_BYTES) {
      return `That file is ${(file.size / (1024 * 1024)).toFixed(1)} MB. The limit is 5 MB — try a lower-resolution scan.`;
    }
    return null;
  };

  const handleFileChosen = async (key, event) => {
    const file = event.target.files?.[0];
    event.target.value = '';                 // allow re-picking the same file after a failure
    if (!file) return;

    const localFailure = preCheck(file);
    if (localFailure) {
      setUpload({ key, phase: 'error', message: localFailure, fileName: file.name });
      return;
    }

    setUpload({ key, phase: 'uploading', message: null, fileName: file.name });

    try {
      const result = await uploadDocument(file, key, profile.id);

      setUpload({
        key,
        phase: 'success',
        message: `Uploaded — readiness is now ${result.readinessScore}%.`,
        fileName: result.originalFileName
      });

      // The score in the 201 body is the authority; the local profile is updated to match so
      // the header meter and the checklist agree.
      setProfile((prev) => {
        const next = { ...prev };
        if (key === 'caste_cert') next.hasCasteCertificate = true;
        if (key === 'income_cert') next.hasIncomeCertificate = true;

        const label = {
          identity: 'Aadhaar/KYC',
          caste_cert: 'Caste certificate',
          income_cert: 'Income certificate',
          quotation: 'Business quotation'
        }[key];

        next.uploadedDocs = prev.uploadedDocs.includes(label)
          ? prev.uploadedDocs
          : [...prev.uploadedDocs, label];

        return next;
      });

      confetti({ particleCount: 55, spread: 55, origin: { y: 0.6 } });
    } catch (err) {
      setUpload({
        key,
        phase: 'error',
        message: err?.status === 401
          ? 'Your session ended before the upload finished. Please sign in and try again.'
          : (err?.message || 'The upload was rejected. Nothing was saved — please try again.'),
        fileName: file.name
      });
    }
  };

  if (loading && !readinessData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-600">Calculating Application Readiness Score...</p>
      </div>
    );
  }

  if (!readinessData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-3">
        <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <p className="text-sm font-semibold text-slate-800">
          {loadError || 'The readiness checklist is unavailable right now.'}
        </p>
        <p className="text-xs text-slate-500">
          Nothing has been lost — reload once you are signed in and your checklist will reappear.
        </p>
      </div>
    );
  }

  const score = readinessData.overallScore;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Feature 3: Application Readiness Score</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.readiness.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{t.readiness.subtitle}</p>
        </div>

        {/* Big Meter Badge */}
        <div className="flex items-center space-x-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-md">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="#334155" strokeWidth="4" fill="transparent" />
              <circle
                cx="24" cy="24" r="20"
                stroke="#10b981"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute font-black text-xs text-white">{score}%</span>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Overall Status</div>
            <div className="text-sm font-bold">{score >= 80 ? 'High Submission Readiness' : 'Action Required'}</div>
          </div>
        </div>
      </div>

      {loadError && (
        <div role="alert" className="bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl p-3 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Upload guidance — stated once, up front, so no row has to repeat it */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start space-x-2">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800 text-sm">How to upload a document</p>
          <p>
            Use the <strong>Upload</strong> button on any row below and pick the file from your phone or computer.
            Accepted formats are <strong>PDF, JPG and PNG</strong>, up to <strong>5 MB</strong> each. A clear photo of
            the full page is fine.
          </p>
          <p>
            Uploading again for the same row replaces the earlier file. Your documents are stored privately and are
            visible only to you and the channel partner handling your application.
          </p>
        </div>
      </div>

      {/* Recommended Next Action Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-emerald-950 text-xs sm:text-sm">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span><strong>Next Recommended Action:</strong> {readinessData.nextRecommendedAction}</span>
        </div>
        <button
          onClick={onProceedToBusinessPlan}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center space-x-1.5"
        >
          <span>AI Project Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Itemized Readiness Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-700">
          <span>Requirement &amp; Verification Item</span>
          <span>Status &amp; Remediation Action</span>
        </div>

        <div className="divide-y divide-slate-100">
          {readinessData.items.map((item) => {
            const isComplete = item.status === 'Complete' || item.status === 'Verified';
            const isMissing = item.status === 'Missing';
            const canUpload = UPLOADABLE_KEYS.includes(item.key);
            const rowUpload = upload.key === item.key ? upload : null;

            return (
              <div key={item.key} className="p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Left details */}
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                      {item.isMandatory ? (
                        <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          Optional
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>{t.readiness.whyReq}</strong> {item.whyRequired}
                    </p>

                    {/* How to obtain banner if missing */}
                    {isMissing && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-900 space-y-1">
                        <div className="font-semibold flex items-center space-x-1">
                          <Info className="w-3.5 h-3.5 text-amber-600" />
                          <span>{t.readiness.howTo}</span>
                        </div>
                        <p>{item.howToObtain}</p>
                        <div className="text-[11px] text-amber-700">
                          <span>Accepted formats: {item.acceptedFormats}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Status & Upload Actions */}
                  <div className="flex flex-col items-end gap-2 w-full md:w-auto shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1.5 ${
                      isComplete
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isMissing
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {isComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      <span>{item.status}</span>
                    </span>

                    {canUpload && (
                      <>
                        {/* The real control. A hidden native input keeps the styled button while
                            the browser's own file picker does the choosing — there is no simulated
                            upload path left in this component. */}
                        <input
                          ref={(el) => { fileInputs.current[item.key] = el; }}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                          className="hidden"
                          onChange={(event) => handleFileChosen(item.key, event)}
                        />

                        <button
                          type="button"
                          onClick={() => fileInputs.current[item.key]?.click()}
                          disabled={rowUpload?.phase === 'uploading'}
                          aria-label={`Upload ${item.title} — PDF, JPG or PNG up to 5 MB`}
                          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95"
                        >
                          {rowUpload?.phase === 'uploading'
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                            : <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>
                            {rowUpload?.phase === 'uploading'
                              ? 'Uploading…'
                              : isComplete ? 'Replace file' : t.readiness.uploadBtn}
                          </span>
                        </button>

                        <p className="text-[10px] text-slate-400">PDF, JPG or PNG · up to 5 MB</p>
                      </>
                    )}

                    {/* Progress. Deliberately indeterminate: a percentage would have to be
                        invented, since the response arrives only once the whole file has been
                        sent and validated. */}
                    {rowUpload?.phase === 'uploading' && (
                      <div className="w-full md:w-56 space-y-1" role="status" aria-live="polite">
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full w-1/3 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                        <p className="text-[11px] text-slate-500 text-right">
                          Sending {rowUpload.fileName} and checking it…
                        </p>
                      </div>
                    )}

                    {rowUpload?.phase === 'success' && (
                      <div
                        role="status"
                        aria-live="polite"
                        className="w-full md:w-64 flex items-start space-x-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-semibold rounded-lg p-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rowUpload.message}</span>
                      </div>
                    )}

                    {rowUpload?.phase === 'error' && (
                      <div
                        role="alert"
                        className="w-full md:w-64 flex items-start space-x-1.5 bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-semibold rounded-lg p-2"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{rowUpload.message}</span>
                      </div>
                    )}

                    {/* Rendered as a text child, so markup characters in a client-supplied
                        filename appear as characters (R6.8). */}
                    {isComplete && item.uploadedFileName && (
                      <span className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span>{item.uploadedFileName}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
