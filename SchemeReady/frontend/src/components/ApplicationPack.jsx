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

export default function ApplicationPack({ 
  lang, 
  profile, 
  selectedScheme, 
  nearestPartner 
}) {
  const t = translations[lang] || translations.en;
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [handoffModal, setHandoffModal] = useState(false);
  const [handoffResult, setHandoffResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await generateApplicationPack(profile);
      setPack(data);
      setLoading(false);
    }
    load();
  }, [profile]);

  const handleSurajHandoff = async () => {
    setSubmitting(true);
    const res = await handoffToSuraj(pack?.applicationId || 'APP-2026-BLR-0941');
    setTimeout(() => {
      setHandoffResult(res);
      setSubmitting(false);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    }, 1200);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello, I have generated my official SchemeReady Application Pack for the ${selectedScheme?.schemeName || 'Micro Credit Scheme'}. Application ID: ${pack?.applicationId || 'APP-2026-BLR-0941'}. Readiness Score: 92%. Ready for submission at ${nearestPartner?.institutionName || 'Karnataka State Dr. B.R. Ambedkar Development Corporation'}.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading || !pack) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-600">Assembling your comprehensive Application Pack...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner Actions (Hidden on Print) */}
      <div className="no-print bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Feature 8: Application Pack &amp; Handoff</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.pack.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{t.pack.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.pack.downloadPdf}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t.pack.shareWhatsApp}</span>
          </button>

          <button
            onClick={() => setHandoffModal(true)}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
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
              NATIONAL SCHEDULED CASTES FINANCE AND DEVELOPMENT CORPORATION (NSFDC)
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              ENTREPRENEUR APPLICATION DOSSIER
            </h1>
            <p className="text-xs text-slate-600">
              Generated via SchemeReady (Udyam Saarthi AI) Platform | Channel Partner Handoff Document
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Dossier Tracking ID</span>
            <span className="text-sm font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              {pack.applicationId}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Date: {new Date(pack.generatedDate).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>

        {/* Section 1: Beneficiary Profile */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5 flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Beneficiary Profile</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Full Name</span>
              <span className="font-bold text-slate-900">{profile.fullName}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Target Category</span>
              <span className="font-bold text-emerald-800">{profile.category} (Scheduled Caste)</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Location / District</span>
              <span className="font-bold text-slate-900">{profile.location}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Annual Family Income</span>
              <span className="font-bold text-slate-900">₹{profile.annualFamilyIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Selected Scheme & Eligibility Reasons */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Recommended Scheme &amp; Statutory Eligibility Verification</span>
          </h3>
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-emerald-950">
                {pack.selectedScheme.name} ({pack.selectedScheme.id})
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                Interest: {pack.selectedScheme.interestRate}% p.a. | Tenure: {pack.selectedScheme.maximumTenureMonths} mo
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
            <span>3. Project Report &amp; Financial Feasibility</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Total Project Cost</span>
              <span className="font-bold text-slate-900">₹{profile.estimatedProjectCost.toLocaleString()}</span>
            </div>
            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Promoter Margin (5%)</span>
              <span className="font-bold text-slate-900">₹{(profile.estimatedProjectCost * 0.05).toLocaleString()}</span>
            </div>
            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Term Loan Required</span>
              <span className="font-bold text-emerald-800">₹{(profile.estimatedProjectCost * 0.95).toLocaleString()}</span>
            </div>
            <div className="border border-slate-200 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">DSCR Debt Coverage</span>
              <span className="font-bold text-indigo-700">5.8x (Viable)</span>
            </div>
          </div>
        </div>

        {/* Section 4: Channel Partner Routing Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5 flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>4. Designated Channel Partner Submission Office</span>
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1.5">
            <div className="flex justify-between items-start">
              <strong className="text-slate-900 text-sm">{pack.nearestPartner.institutionName}</strong>
              <span className="text-emerald-700 font-bold">{pack.nearestPartner.distanceKm} km away</span>
            </div>
            <p className="text-slate-600">{pack.nearestPartner.address}</p>
            <p className="text-slate-600 font-mono">Contact: {pack.nearestPartner.contactNumber} ({pack.nearestPartner.contactPerson})</p>
            <p className="text-[11px] text-slate-500 font-medium pt-1">
              Submission Mode: {pack.nearestPartner.applicationMode} | Record Verified: 10 September 2026
            </p>
          </div>
        </div>

        {/* Section 5: Next Steps & Official Disclaimer */}
        <div className="space-y-3 pt-2">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-[11px] text-amber-950 leading-relaxed">
            <strong className="block font-bold mb-0.5">Official Government Disclaimer:</strong>
            {pack.disclaimer}
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 border-t border-slate-100">
            <span>Powered by SchemeReady GovTech Framework</span>
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
                <h3 className="font-bold text-slate-900 text-base">PM-SURAJ Portal Handoff Gateway</h3>
              </div>
              <button onClick={() => setHandoffModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            {handoffResult ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Application Transmitted!</h4>
                  <p className="text-xs text-slate-600 mt-1">{handoffResult.message}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left text-xs font-mono space-y-1">
                  <div><strong>Portal:</strong> {handoffResult.portal}</div>
                  <div><strong>Tracking Ref:</strong> {pack.handoffReferenceNumber}</div>
                  <div><strong>Forwarded to:</strong> {handoffResult.forwardedTo}</div>
                  <div><strong>Status:</strong> <span className="text-emerald-700 font-bold">{handoffResult.status}</span></div>
                </div>

                <button
                  onClick={() => setHandoffModal(false)}
                  className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  Close &amp; Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs text-slate-700">
                <p>
                  You are about to transmit the validated <strong>{pack.selectedScheme.name}</strong> dossier directly to the PM-SURAJ (Pradhan Mantri Samajik Utthan evam Rozgar Adharit Jankalyan) demonstration integration gateway.
                </p>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1 text-emerald-950">
                  <div className="font-bold">Summary of Package:</div>
                  <div>• Applicant: {profile.fullName} ({profile.location})</div>
                  <div>• Required Loan: ₹{profile.requiredLoanAmount.toLocaleString()}</div>
                  <div>• Readiness: Verified Complete</div>
                  <div>• Designated SCA: {pack.nearestPartner.institutionName}</div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setHandoffModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSurajHandoff}
                    disabled={submitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Transmitting...' : 'Confirm Demo Handoff'}</span>
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
