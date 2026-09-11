import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  Percent, 
  Banknote, 
  Clock,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { matchSchemes } from '../api';

export default function ExplainableSchemeResults({ 
  lang, 
  profile, 
  selectedScheme, 
  setSelectedScheme, 
  onProceedToReadiness 
}) {
  const t = translations[lang] || translations.en;
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      const data = await matchSchemes(profile);
      setSchemes(data);
      if (data.length > 0 && !selectedScheme) {
        setSelectedScheme(data[0]);
      }
      setLoading(false);
    }
    fetchMatches();
  }, [profile]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feature 2: Explainable Scheme Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.schemes.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{t.schemes.subtitle}</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Deterministic scoring: 40% Eligibility + 25% Project Cost + 15% Docs + 10% Partner + 10% Fit</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600 font-medium">Evaluating schemes against statutory eligibility criteria...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {schemes.map((scheme, idx) => {
            const isSelected = selectedScheme?.schemeId === scheme.schemeId;
            const isTopMatch = idx === 0;

            return (
              <div
                key={scheme.schemeId}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-white shadow-lg'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Top Badge */}
                {isTopMatch && (
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold px-4 py-1.5 flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{t.schemes.recommended}</span>
                    </span>
                    <span>Top Recommendation</span>
                  </div>
                )}

                <div className="p-5 space-y-4">
                  {/* Title & Match Score Gauge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                        {scheme.schemeId}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5 leading-snug">
                        {scheme.schemeName}
                      </h3>
                      <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {scheme.schemeType}
                      </span>
                    </div>

                    {/* Circular Score Metric */}
                    <div className="text-center shrink-0">
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${
                        scheme.matchScore >= 85
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : scheme.matchScore >= 70
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        <span className="text-base leading-none">{scheme.matchScore}%</span>
                        <span className="text-[9px] font-medium uppercase mt-0.5">Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Highlights */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Interest Rate</span>
                      <span className="font-bold text-emerald-700">{scheme.interestRate}% p.a.</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Max Loan</span>
                      <span className="font-bold text-slate-800">₹{(scheme.maxLoanEligible / 100000).toFixed(1)}L</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Est. EMI</span>
                      <span className="font-bold text-slate-900">₹{scheme.estimatedEmi.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* "Why It Matches" Section */}
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800 flex items-center space-x-1 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.schemes.whyMatches}</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {scheme.positiveReasons.map((reason, rIdx) => (
                        <li key={rIdx} className="flex items-start space-x-2 bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100/60">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* "Why Not / Lower Score" Section */}
                  {scheme.negativeReasons && scheme.negativeReasons.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-600 flex items-center space-x-1 mb-2">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t.schemes.whyNot}</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {scheme.negativeReasons.map((neg, nIdx) => (
                          <li key={nIdx} className="flex items-start space-x-2 bg-amber-50/60 p-1.5 rounded-lg border border-amber-200/60 text-amber-950">
                            <span className="text-amber-600 font-bold shrink-0">!</span>
                            <span>{neg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Verified Date & Official Citation */}
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      <span><strong>{t.schemes.verified}:</strong> 10 September 2026 (NSFDC Portal)</span>
                    </div>
                    <div className="flex items-center space-x-1 truncate text-slate-400">
                      <span className="truncate">{scheme.sourceDocument}</span>
                    </div>
                  </div>
                </div>

                {/* Selection Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedScheme(scheme);
                      onProceedToReadiness(scheme);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      isSelected
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                    }`}
                  >
                    <span>{isSelected ? t.schemes.selectBtn : 'Select This Scheme'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
