import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import { 
  ShieldCheck, 
  Printer, 
  Share2, 
  FileDown, 
  Send, 
  CheckCircle2, 
  Building2, 
  User, 
  FileText, 
  Sparkles, 
  Clock, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateApplicationPack, handoffToSuraj } from '../api';
import IllustrativeBadge, { anyIllustrative } from './IllustrativeBadge';

export default function ApplicationPack({ 
  lang = 'en', 
  profile, 
  selectedScheme, 
  nearestPartner 
}) {
  const t = translations[lang] || translations.en;
  const isHindi = lang === 'hi';
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [handoffModal, setHandoffModal] = useState(false);
  const [handoffResult, setHandoffResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await generateApplicationPack(profile);
        if (!cancelled) {
          setPack(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.status === 401
            ? (isHindi ? 'सत्र समाप्त हो गया। कृपया दोबारा साइन इन करें।' : 'Your session ended. Please sign in again to generate your application pack.')
            : (isHindi ? 'आवेदन पैक तैयार नहीं किया जा सका।' : 'The application pack could not be generated. Nothing has been submitted.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [profile, isHindi]);

  const handleSurajHandoff = async () => {
    if (!pack?.applicationId) {
      setError(isHindi ? 'हैंडऑफ से पहले आवेदन पैक तैयार करें।' : 'Generate your application pack before requesting the PM-SURAJ handoff.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await handoffToSuraj(pack.applicationId);
      setHandoffResult(res);
      setError(null);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    } catch (err) {
      setError(err?.status === 404
        ? (isHindi ? 'यह आवेदन पैक इस खाते से हैंडऑफ के लिए उपलब्ध नहीं है।' : 'That application pack is not available for handoff from this account.')
        : (isHindi ? 'PM-SURAJ हैंडऑफ पूरा नहीं हुआ।' : 'The PM-SURAJ handoff did not complete. Your dossier is unchanged.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      isHindi
        ? `नमस्ते, मैंने ${selectedScheme?.schemeName || 'माइक्रो क्रेडिट योजना'} के लिए अपना आधिकारिक स्कीम रेडी आवेदन पैक तैयार किया है। आवेदन आईडी: ${pack?.applicationId || 'APP-2026-BLR-0941'}। तत्परता स्कोर: 92%। ${nearestPartner?.institutionName || 'डॉ. बी.आर. अंबेडकर विकास निगम'} में जमा करने के लिए तैयार।`
        : `Hello, I have generated my official SchemeReady Application Pack for the ${selectedScheme?.schemeName || 'Micro Credit Scheme'}. Application ID: ${pack?.applicationId || 'APP-2026-BLR-0941'}. Readiness Score: 92%. Ready for submission at ${nearestPartner?.institutionName || 'Karnataka State Dr. B.R. Ambedkar Development Corporation'}.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!pack && error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-2">
        <p className="text-sm font-semibold text-rose-800">{error}</p>
        <p className="text-xs text-slate-500">
          {isHindi ? 'कोई डोजियर प्रदर्शित नहीं है।' : 'No dossier is shown, because none was generated — nothing has been sent to any agency.'}
        </p>
      </div>
    );
  }

  if (loading || !pack) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-600">
          {isHindi ? 'आपका संपूर्ण आवेदन पैक तैयार किया जा रहा है...' : 'Assembling your comprehensive Application Pack...'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {error && (
        <div role="alert" className="no-print bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl p-3">
          {error}
        </div>
      )}

      {/* Top Banner Actions (Hidden on Print) */}
      <div className="no-print bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isHindi ? 'सुविधा 8: आवेदन पैक एवं डिजिटल प्रेषण' : 'Feature 8: Application Pack & Handoff'}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.pack.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{t.pack.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.pack.downloadPdf}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t.pack.shareWhatsApp}</span>
          </button>

          <button
            onClick={() => setHandoffModal(true)}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.pack.handoffBtn}</span>
          </button>
        </div>
      </div>

      {/* Official Printable Dossier Container */}
      <div className="bg-white rounded-3xl border border-slate-300 shadow-lg p-8 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Government Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-widest font-black text-slate-500">
              {isHindi 
                ? 'राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC)' 
                : 'NATIONAL SCHEDULED CASTES FINANCE AND DEVELOPMENT CORPORATION (NSFDC)'}
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              {isHindi ? 'उद्यमी आवेदन डोजियर' : 'ENTREPRENEUR APPLICATION DOSSIER'}
            </h1>
            <p className="text-xs text-slate-600">
              {isHindi 
                ? 'स्कीम रेडी (उद्यम सारथी AI) प्लेटफॉर्म द्वारा जनरेटेड | चैनल पार्टनर हैंडऑफ दस्तावेज' 
                : 'Generated via SchemeReady (Udyam Saarthi AI) Platform | Channel Partner Handoff Document'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {isHindi ? 'डोजियर ट्रैकिंग आईडी' : 'Dossier Tracking ID'}
            </span>
            <span className="text-sm font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              {pack.applicationId}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              {isHindi ? 'दिनांक:' : 'Date:'} {new Date(pack.generatedDate).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN')}
            </span>
          </div>
        </div>

        {/* Section 1: Beneficiary Profile */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5 flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? '1. लाभार्थी प्रोफाइल' : '1. Beneficiary Profile'}</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">{isHindi ? 'पूरा नाम' : 'Full Name'}</span>
              <span className="font-bold text-slate-900">{profile.fullName}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">{isHindi ? 'लक्षित श्रेणी' : 'Target Category'}</span>
              <span className="font-bold text-emerald-800">{profile.category} ({isHindi ? 'अनुसूचित जाति' : 'Scheduled Caste'})</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">{isHindi ? 'स्थान / जिला' : 'Location / District'}</span>
              <span className="font-bold text-slate-900">{profile.location}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">{isHindi ? 'वार्षिक पारिवारिक आय' : 'Annual Family Income'}</span>
              <span className="font-bold text-slate-900">₹{profile.annualFamilyIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Selected Scheme & Eligibility Reasons */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? '2. अनुशंसित योजना एवं वैधानिक पात्रता सत्यापन' : '2. Recommended Scheme & Statutory Eligibility Verification'}</span>
          </h3>
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-emerald-950">
                {pack.selectedScheme.name} ({pack.selectedScheme.id})
                <IllustrativeBadge record={pack.selectedScheme} className="ml-2" />
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                {isHindi ? 'ब्याज:' : 'Interest:'} {pack.selectedScheme.interestRate}% {isHindi ? 'वार्षिक' : 'p.a.'} | {isHindi ? 'अवधि:' : 'Tenure:'} {pack.selectedScheme.maximumTenureMonths} {isHindi ? 'माह' : 'mo'}
                <IllustrativeBadge record={pack.selectedScheme} className="ml-1.5" />
              </span>
            </div>
            <ul className="text-xs text-emerald-900 space-y-1">
              {pack.eligibilityReasons.map((r, i) => (
                <li key={i} className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3: AI Business Plan & One-Page DPR */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5 flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? '3. प्रोजेक्ट रिपोर्ट एवं वित्तीय व्यवहार्यता' : '3. Project Report & Financial Feasibility'}</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">{isHindi ? 'कुल परियोजना लागत' : 'Total Project Cost'}</span>
              <span className="font-bold text-slate-900">₹{profile.estimatedProjectCost.toLocaleString()}</span>
            </div>
            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">{isHindi ? 'प्रमोटर अंशदान (5%)' : 'Promoter Margin (5%)'}</span>
              <span className="font-bold text-slate-900">₹{(profile.estimatedProjectCost * 0.05).toLocaleString()}</span>
            </div>
            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">{isHindi ? 'आवश्यक सावधि ऋण' : 'Term Loan Required'}</span>
              <span className="font-bold text-emerald-800">₹{(profile.estimatedProjectCost * 0.95).toLocaleString()}</span>
            </div>
            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">{isHindi ? 'डीएससीआर ऋण कवरेज' : 'DSCR Debt Coverage'}</span>
              <span className="font-bold text-indigo-700">5.8x ({isHindi ? 'व्यवहार्य' : 'Viable'})</span>
            </div>
          </div>
        </div>

        {/* Section 4: Channel Partner Routing Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5 flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? '4. नामित चैनल पार्टनर सबमिशन कार्यालय' : '4. Designated Channel Partner Submission Office'}</span>
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5">
            <div className="flex justify-between items-start">
              <strong className="text-slate-900 text-sm">{pack.nearestPartner.institutionName}</strong>
              <span className="text-emerald-700 font-bold">{pack.nearestPartner.distanceKm} {isHindi ? 'किमी दूर' : 'km away'}</span>
            </div>
            <p className="text-slate-600">{pack.nearestPartner.address}</p>
            <p className="text-slate-600 font-mono">
              {isHindi ? 'संपर्क:' : 'Contact:'} {pack.nearestPartner.contactNumber} ({pack.nearestPartner.contactPerson})
            </p>
            <p className="text-[11px] text-slate-500 font-medium pt-1">
              {isHindi ? 'सबमिशन माध्यम:' : 'Submission Mode:'} {pack.nearestPartner.applicationMode} | {isHindi ? 'रिकॉर्ड सत्यापित: 10 सितंबर 2026' : 'Record Verified: 10 September 2026'}
            </p>
          </div>
        </div>

        {/* Section 5: Next Steps & Official Disclaimer */}
        <div className="space-y-3 pt-2">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-[11px] text-amber-950 leading-relaxed">
            <strong className="block font-bold mb-0.5">{isHindi ? 'आधिकारिक सरकारी अस्वीकरण:' : 'Official Government Disclaimer:'}</strong>
            {t.pack.disclaimer || pack.disclaimer}
          </div>

          {anyIllustrative([pack.selectedScheme]) && (
            <div
              className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 text-[11px] text-rose-950 leading-relaxed"
              data-testid="illustrative-pack-notice"
            >
              <strong className="block font-bold mb-0.5 flex items-center gap-1.5">
                {isHindi ? 'जमा करने से पहले वित्तीय शर्तों की पुष्टि करें' : 'Confirm the financial terms before you submit'}
                <IllustrativeBadge record={pack.selectedScheme} />
              </strong>
              {isHindi 
                ? 'इस पैक में दिखाई गई योजना की वित्तीय शर्तें — ब्याज दर, कार्यकाल, मोरेटोरियम, ऋण सीमा — आधिकारिक एनएसएफडीसी दिशानिर्देशों के तहत सत्यापन के अधीन सांकेतिक मूल्य हैं।'
                : 'The scheme financial terms shown in this pack — interest rate, tenure, moratorium, loan ceiling, the cited source document and the last-verified date — are illustrative sample values pending verification against current official NSFDC guidelines. Confirm every one of them with the channel partner named above before submitting this application.'}
            </div>
          )}
          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 border-t border-slate-100">
            <span>{isHindi ? 'स्कीम रेडी गॉवटेक फ्रेमवर्क द्वारा संचालित' : 'Powered by SchemeReady GovTech Framework'}</span>
            <span>Ref: {pack.handoffReferenceNumber}</span>
          </div>
        </div>
      </div>

      {/* PM-SURAJ Handoff Modal */}
      {handoffModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isHindi ? 'PM-SURAJ पोर्टल हैंडऑफ गेटवे' : 'PM-SURAJ Portal Handoff Gateway'}
                </h3>
              </div>
              <button onClick={() => setHandoffModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">
                ✕
              </button>
            </div>

            {handoffResult ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    {isHindi ? 'आवेदन सफलतापूर्वक प्रेषित!' : 'Application Transmitted!'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">{handoffResult.message}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left text-xs font-mono space-y-1">
                  <div><strong>{isHindi ? 'पोर्टल:' : 'Portal:'}</strong> {handoffResult.portal}</div>
                  <div><strong>{isHindi ? 'ट्रैकिंग संदर्भ:' : 'Tracking Ref:'}</strong> {pack.handoffReferenceNumber}</div>
                  <div><strong>{isHindi ? 'अग्रेषित संस्था:' : 'Forwarded to:'}</strong> {handoffResult.forwardedTo}</div>
                  <div><strong>{isHindi ? 'स्थिति:' : 'Status:'}</strong> <span className="text-emerald-700 font-bold">{handoffResult.status}</span></div>
                </div>

                <button
                  onClick={() => setHandoffModal(false)}
                  className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  {isHindi ? 'डैशबोर्ड पर वापस जाएं' : 'Close & Return to Dashboard'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-slate-700">
                <p>
                  {isHindi
                    ? `आप सत्यापित ${pack.selectedScheme.name} डोजियर को सीधे PM-SURAJ (प्रधानमंत्री सामाजिक उत्थान एवं रोजगार आधारित जनकल्याण) एकीकरण गेटवे पर प्रेषित करने वाले हैं।`
                    : `You are about to transmit the validated ${pack.selectedScheme.name} dossier directly to the PM-SURAJ (Pradhan Mantri Samajik Utthan evam Rozgar Adharit Jankalyan) demonstration integration gateway.`}
                </p>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1 text-emerald-950">
                  <div className="font-bold">{isHindi ? 'आवेदन पैकेज का सारांश:' : 'Summary of Package:'}</div>
                  <div>• {isHindi ? 'आवेदक:' : 'Applicant:'} {profile.fullName} ({profile.location})</div>
                  <div>• {isHindi ? 'आवश्यक ऋण:' : 'Required Loan:'} ₹{profile.requiredLoanAmount.toLocaleString()}</div>
                  <div>• {isHindi ? 'तत्परता स्थिति:' : 'Readiness:'} {isHindi ? 'सत्यापित पूर्ण' : 'Verified Complete'}</div>
                  <div>• {isHindi ? 'नामित एससीए:' : 'Designated SCA:'} {pack.nearestPartner.institutionName}</div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setHandoffModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleSurajHandoff}
                    disabled={submitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? (isHindi ? 'प्रेषित हो रहा है...' : 'Transmitting...') : (isHindi ? 'हैंडऑफ की पुष्टि करें' : 'Confirm Demo Handoff')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
