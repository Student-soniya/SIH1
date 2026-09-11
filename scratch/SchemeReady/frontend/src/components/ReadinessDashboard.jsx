import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UploadCloud, 
  FileCheck2, 
  Info, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getReadiness } from '../api';

export default function ReadinessDashboard({ 
  lang, 
  profile, 
  setProfile, 
  onProceedToBusinessPlan 
}) {
  const t = translations[lang] || translations.en;
  const [readinessData, setReadinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [uploadingKey, setUploadingKey] = useState(null);

  useEffect(() => {
    async function fetchReadiness() {
      setLoading(true);
      const data = await getReadiness(profile);
      setReadinessData(data);
      setLoading(false);
    }
    fetchReadiness();
  }, [profile]);

  const handleSimulatedUpload = (key) => {
    setUploadingKey(key);
    setTimeout(() => {
      setUploadingKey(null);
      if (key === 'caste_cert') {
        setProfile(prev => ({
          ...prev,
          hasCasteCertificate: true,
          uploadedDocs: [...prev.uploadedDocs, 'Caste certificate']
        }));
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } else if (key === 'quotation') {
        setProfile(prev => ({
          ...prev,
          uploadedDocs: [...prev.uploadedDocs, 'Business quotation']
        }));
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      }
    }, 1000);
  };

  if (loading || !readinessData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-600">Calculating Application Readiness Score...</p>
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

                    {/* Action Upload button */}
                    {isMissing && (
                      <button
                        onClick={() => handleSimulatedUpload(item.key)}
                        disabled={uploadingKey === item.key}
                        className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{uploadingKey === item.key ? 'Verifying...' : t.readiness.uploadBtn}</span>
                      </button>
                    )}

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
