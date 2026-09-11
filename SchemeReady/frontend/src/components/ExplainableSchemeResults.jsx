import { localizeTernary } from "../l10n";
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
import IllustrativeBadge from './IllustrativeBadge';

function formatVerifiedDate(value, lang = 'en') {
  if (!value) return localizeTernary('दर्ज नहीं', 'Not recorded', lang);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return localizeTernary('दर्ज नहीं', 'Not recorded', lang);
  const localeMap = {
    hi: 'hi-IN',
    kn: 'kn-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    en: 'en-IN'
  };
  return parsed.toLocaleDateString(localeMap[lang] || 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ExplainableSchemeResults({ 
  lang = 'en', 
  profile, 
  selectedScheme, 
  setSelectedScheme, 
  onProceedToReadiness 
}) {
  const t = translations[lang] || translations.en;
  const isHindi = lang === 'hi';
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

  const translateReason = (text) => {
    if (!isHindi || !text) return text;
    if (text.includes('target community (Scheduled Caste)')) {
      return 'आवेदक लक्षित समुदाय (अनुसूचित जाति) से संबंधित है।';
    }
    if (text.includes('Declared family income') && text.includes('within configured threshold')) {
      return `घोषित पारिवारिक आय (₹${profile.annualFamilyIncome.toLocaleString('en-IN')}) निर्धारित सीमा (₹3,00,000) के भीतर है।`;
    }
    if (text.includes('Project cost') && text.includes('fits the micro-credit')) {
      return `परियोजना लागत (₹${profile.estimatedProjectCost.toLocaleString('en-IN')}) सूक्ष्म ऋण योजना सीमा में उपयुक्त है।`;
    }
    if (text.includes('Business type') && text.includes('is actively supported')) {
      return `व्यावसायिक श्रेणी '${profile.businessType}' योजना के तहत प्राथमिक क्षेत्र में शामिल है।`;
    }
    if (text.includes('Suitable partner') && text.includes('available in applicant district')) {
      return 'आवेदक के जिले में निकटतम अधिकृत चैनल पार्टनर (4.2 किमी) उपलब्ध है।';
    }
    if (text.includes('Caste Certificate') && text.includes('pending upload')) {
      return 'जाति प्रमाण पत्र (आरडी नंबर) अपलोड लंबित है।';
    }
    if (text.includes('Target community category matches')) {
      return 'लक्षित समुदाय श्रेणी मेल खाती है (अनुसूचित जाति)।';
    }
    if (text.includes('Applicant age is within permissible')) {
      return 'आवेदक की आयु अनुमत मियादी ऋण आयु सीमा के भीतर है।';
    }
    if (text.includes('Required amount') && text.includes('lower than the recommended minimum')) {
      return `अनुरोधित राशि (₹${profile.estimatedProjectCost.toLocaleString('en-IN')}) अनुशंसित न्यूनतम ₹2,00,000 से कम है।`;
    }
    if (text.includes('Higher documentation needed')) {
      return 'विस्तृत दस्तावेज आवश्यक: विस्तृत परियोजना रिपोर्ट (DPR) एवं दुकान अनुबंध।';
    }
    if (text.includes('Applicant is a first-time youth entrepreneur')) {
      return 'आवेदक पहली बार युवा उद्यमी श्रेणी में आता है।';
    }
    if (text.includes('Technical trade aligns with service unit financing')) {
      return 'तकनीकी व्यापार सेवा इकाई वित्तपोषण के अनुकूल है।';
    }
    if (text.includes('Income is below the Rs 3,50,000 limit')) {
      return 'पारिवारिक आय ₹3,50,000 की सीमा से कम है।';
    }
    if (text.includes('Skill certification or prior experience declaration required')) {
      return 'कौशल प्रमाणन या पूर्व अनुभव स्व-घोषणा आवश्यक है।';
    }
    return text;
  };

  const getSchemeName = (scheme) => {
    if (!isHindi) return scheme.schemeName;
    const map = {
      'NSFDC-MCS-01': 'माइक्रो क्रेडिट योजना (MCS)',
      'NSFDC-TLS-02': 'सावधि ऋण योजना (TLS)',
      'NSFDC-LUY-04': 'लघु उद्यमी योजना (LUY)'
    };
    return map[scheme.schemeId] || scheme.schemeName;
  };

  const getSchemeType = (type) => {
    if (!isHindi) return type;
    const map = {
      'Micro Credit': 'सूक्ष्म ऋण',
      'Term Loan': 'सावधि ऋण',
      'Small Enterprise': 'लघु उद्यम'
    };
    return map[type] || type;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{localizeTernary('सुविधा 2: स्पष्टीकरण योग्य योजना मिलान इंजन', 'Feature 2: Explainable Scheme Engine', lang)}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.schemes.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{t.schemes.subtitle}</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {localizeTernary('निश्चित स्कोरिंग: 40% पात्रता + 25% परियोजना लागत + 15% दस्तावेज + 10% पार्टनर + 10% उपयुक्तता', 'Deterministic scoring: 40% Eligibility + 25% Project Cost + 15% Docs + 10% Partner + 10% Fit', lang)}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600 font-medium">
            {localizeTernary('वैधानिक पात्रता मानदंडों के अनुसार योजनाओं का मूल्यांकन किया जा रहा है...', 'Evaluating schemes against statutory eligibility criteria...', lang)}
          </p>
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
                    <span>{localizeTernary('सर्वश्रेष्ठ सिफारिश', 'Top Recommendation', lang)}</span>
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
                        {getSchemeName(scheme)}
                        <IllustrativeBadge record={scheme} className="ml-2" />
                      </h3>
                      <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {getSchemeType(scheme.schemeType)}
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
                        <span className="text-[9px] font-medium uppercase mt-0.5">
                          {localizeTernary('मिलान', 'Match', lang)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Highlights */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        {localizeTernary('ब्याज दर', 'Interest Rate', lang)}
                      </span>
                      <span className="font-bold text-emerald-700">{scheme.interestRate}% {localizeTernary('वार्षिक', 'p.a.', lang)}</span>
                      <IllustrativeBadge record={scheme} className="mt-1" />
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        {localizeTernary('अधिकतम ऋण', 'Max Loan', lang)}
                      </span>
                      <span className="font-bold text-slate-800">₹{(scheme.maxLoanEligible / 100000).toFixed(1)}{localizeTernary(' लाख', 'L', lang)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        {localizeTernary('अनुमानित EMI', 'Est. EMI', lang)}
                      </span>
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
                          <span>{translateReason(reason)}</span>
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
                            <span>{translateReason(neg)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Verified Date & Official Citation */}
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      <span><strong>{t.schemes.verified}:</strong> {formatVerifiedDate(scheme.lastVerifiedDate, lang)}</span>
                      <IllustrativeBadge record={scheme} />
                    </div>
                    <div className="flex items-center space-x-1 flex-wrap gap-y-1 text-slate-400">
                      <span className="truncate">{scheme.sourceDocument}</span>
                      <IllustrativeBadge record={scheme} />
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
                    <span>{isSelected ? t.schemes.selectBtn : (localizeTernary('यह योजना चुनें', 'Select This Scheme', lang))}</span>
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
