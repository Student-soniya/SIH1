import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  FileCheck, 
  Building, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  MapPin,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../translations';

export default function BeneficiaryProfileView({ 
  lang = 'en',
  profile, 
  setProfile, 
  onSaveDone 
}) {
  const t = translations[lang] || translations.en;
  const tProf = t.profile || {};
  const [formData, setFormData] = useState({ 
    cibilScore: profile.cibilScore ?? 745,
    businessScale: profile.businessScale || 'Micro (Up to ₹5 Lakhs)',
    casteCertificateNo: profile.casteCertificateNo || 'RD0038921029-SC',
    digilockerVerified: profile.digilockerVerified !== undefined ? profile.digilockerVerified : true,
    ...profile,
    cibilScore: profile.cibilScore ?? 745
  });
  const [saved, setSaved] = useState(false);
  const [digilockerLoading, setDigilockerLoading] = useState(false);

  const statesAndDistricts = {
    "Karnataka": ["Bengaluru", "Bengaluru Rural", "Mysuru", "Hubballi-Dharwad", "Belagavi", "Kalaburagi", "Mangaluru"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Solapur"],
    "Uttar Pradesh": ["Lucknow", "Varanasi", "Kanpur", "Prayagraj", "Agra", "Gorakhpur", "Meerut"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
    "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Asansol", "Durgapur", "Bardhaman"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur", "Ajmer"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"]
  };

  const handleDigiLockerFetch = () => {
    setDigilockerLoading(true);
    setTimeout(() => {
      setDigilockerLoading(false);
      setFormData(prev => ({
        ...prev,
        hasCasteCertificate: true,
        casteCertificateNo: 'RD0038921029-SC-VERIFIED',
        digilockerVerified: true
      }));
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    }, 1200);
  };

  const handleStateChange = (state) => {
    const defaultDistrict = statesAndDistricts[state]?.[0] || 'District Headquarter';
    setFormData(prev => ({
      ...prev,
      state,
      location: defaultDistrict
    }));
  };

  const handleCibilChange = (e) => {
    const rawValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      cibilScore: rawValue === '' ? '' : Number(rawValue)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cibilScore = formData.cibilScore === '' ? '' : Number(formData.cibilScore);

    if (cibilScore !== '' && (!Number.isFinite(cibilScore) || cibilScore < 300 || cibilScore > 900)) {
      return;
    }

    setProfile({
      ...formData,
      cibilScore
    });
    setSaved(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setSaved(false);
      if (onSaveDone) onSaveDone();
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" />
            <span>{tProf.headerBadge || "Beneficiary Comprehensive Profile (SIH Standard)"}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{tProf.headerTitle || "Personal, Academic & Project Dossier"}</h2>
          <p className="text-sm text-slate-600 mt-1">
            {tProf.headerSubtitle || "Complete profile data utilized for deterministic scheme matching and bank channel routing."}
          </p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2 rounded-xl font-bold flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{tProf.updatedBadge || "Profile Updated & Re-matched!"}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Personal & Identity Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">{tProf.sec1Title || "1. Personal & Family Identification"}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">{tProf.fullName || "Full Name"}</label>
              <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:outline-emerald-600" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">{tProf.parentsName || "Parents' Name (Father / Mother)"}</label>
              <input type="text" required value={formData.parentsName} onChange={(e) => setFormData({ ...formData, parentsName: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:outline-emerald-600" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">{tProf.gender || "Gender"}</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600">
                <option value="Male">{tProf.genderMale || "Male"}</option>
                <option value="Female">{tProf.genderFemale || "Female (Unlocks Mahila Samriddhi Yojana at 4%)"}</option>
                <option value="Transgender">{tProf.genderOther || "Transgender / Other"}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">{tProf.state || "Pan-India State"}</label>
              <select value={formData.state || 'Karnataka'} onChange={(e) => handleStateChange(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600">
                {Object.keys(statesAndDistricts).map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">{tProf.district || "District / City"}</label>
              <select value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600">
                {(statesAndDistricts[formData.state || 'Karnataka'] || []).map((dst) => <option key={dst} value={dst}>{dst}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">{tProf.category || "Social Category"}</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600">
                <option value="SC">{tProf.catSC || "Scheduled Caste (SC) - Targeted Beneficiary"}</option>
                <option value="Safai Karamchari">{tProf.catSafai || "Safai Karamchari / Scavenger Dependent"}</option>
                <option value="OBC">{tProf.catOBC || "OBC (Micro Enterprise Window)"}</option>
              </select>
            </div>
          </div>

          {/* Caste Certificate & DigiLocker Integration */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-emerald-900">{tProf.casteStatus || "Caste Certificate Status:"}</span>
                {formData.hasCasteCertificate ? <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold inline-flex items-center space-x-1"><span>{tProf.casteVerified || "✓ Verified via Govt Portal"}</span></span> : <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full font-bold">{tProf.castePending || "Pending Verification"}</span>}
              </div>
              <p className="text-[11px] text-emerald-700 font-mono mt-0.5">{tProf.casteRDNumber || "RD Number:"} {formData.casteCertificateNo || 'RD0038921029-SC'} {tProf.casteIssuedBy || "(Issued by Tahsildar / Nadakacheri)"}</p>
            </div>
            <button type="button" onClick={handleDigiLockerFetch} disabled={digilockerLoading} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center space-x-2 shrink-0 active:scale-95 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{digilockerLoading ? (tProf.connectingDigilocker || 'Connecting DigiLocker...') : (tProf.fetchDigilocker || 'Fetch via DigiLocker')}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Income, CIBIL Score & Taxation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">{tProf.sec2Title || "2. Income Verification, CIBIL & Credit Standing"}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">{tProf.annualIncome || "Annual Family Income (₹)"} <span className="text-emerald-700 font-bold font-mono">{tProf.incomeCap || "[Cap: ₹5L]"}</span></label>
              <input type="number" step="5000" required value={formData.annualFamilyIncome} onChange={(e) => setFormData({ ...formData, annualFamilyIncome: Number(e.target.value), householdAnnualIncome: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-emerald-800 focus:bg-white focus:outline-emerald-600" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">{tProf.cibilScore || "CIBIL / Credit Score"} <span className="text-emerald-600 font-bold">{tProf.cibilRange || "(300 - 900)"}</span></label>
              <div className="relative">
                <input type="number" min="300" max="900" inputMode="numeric" value={formData.cibilScore} onChange={handleCibilChange} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600" />
                {formData.cibilScore !== '' && (
                  <span className="absolute right-3 top-2 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {formData.cibilScore >= 750 ? (tProf.cibilExcellent || 'Excellent') : formData.cibilScore >= 680 ? (tProf.cibilGood || 'Good') : (tProf.cibilModerate || 'Moderate')}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">{tProf.hasFiledItr || "Has Filed ITR?"}</label>
              <select value={formData.hasFiledItr ? 'true' : 'false'} onChange={(e) => setFormData({ ...formData, hasFiledItr: e.target.value === 'true' })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:outline-emerald-600">
                <option value="true">{tProf.itrYes || "Yes, Filed ITR"}</option>
                <option value="false">{tProf.itrNo || "No, Self-Declaration / Tahsildar Cert"}</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">{tProf.itrAck || "ITR Ack Number"}</label>
              <input type="text" value={formData.itrAckNumber || ''} placeholder="e.g. ITR-V-2025-8891042" onChange={(e) => setFormData({ ...formData, itrAckNumber: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 focus:bg-white focus:outline-emerald-600" />
            </div>
          </div>
        </div>

        {/* Card 3: Academic Qualifications (10th & 12th Marks) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3"><GraduationCap className="w-4 h-4 text-emerald-600" /><h3 className="text-sm font-bold text-slate-900">{tProf.sec3Title || "3. Academic Performance (Crucial for Educational Loan Schemes)"}</h3></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"><span className="font-bold text-slate-900 block text-xs">{tProf.class10 || "Class 10th (Secondary School)"}</span><div><label className="block text-slate-600 font-medium mb-1">{tProf.marksPercentage || "Marks / Percentage (%)"}</label><input type="number" step="0.1" value={formData.tenthMarksPercentage} onChange={(e) => setFormData({ ...formData, tenthMarksPercentage: Number(e.target.value) })} className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-emerald-600" /></div><div><label className="block text-slate-600 font-medium mb-1">{tProf.schoolName || "School / Board Name"}</label><input type="text" value={formData.tenthSchoolName} onChange={(e) => setFormData({ ...formData, tenthSchoolName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-emerald-600" /></div></div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"><span className="font-bold text-slate-900 block text-xs">{tProf.class12 || "Class 12th / PUC / Diploma"}</span><div><label className="block text-slate-600 font-medium mb-1">{tProf.marksPercentage || "Marks / Percentage (%)"}</label><input type="number" step="0.1" value={formData.twelfthMarksPercentage} onChange={(e) => setFormData({ ...formData, twelfthMarksPercentage: Number(e.target.value) })} className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-emerald-600" /></div><div><label className="block text-slate-600 font-medium mb-1">{tProf.collegeName || "Junior College / High School Name"}</label><input type="text" value={formData.twelfthSchoolName} onChange={(e) => setFormData({ ...formData, twelfthSchoolName: e.target.value })} className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-emerald-600" /></div></div>
          </div>
        </div>

        {/* Card 4: Business Specifications & AI Viability Analysis */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3"><Briefcase className="w-4 h-4 text-emerald-600" /><h3 className="text-sm font-bold text-slate-900">{tProf.sec4Title || "4. Business Scale, Viability & Survival Assessment"}</h3></div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div><label className="block text-slate-700 font-bold mb-1">{tProf.businessScale || "Business Scale / Category"}</label><select value={formData.businessScale || 'Micro (Up to ₹5 Lakhs)'} onChange={(e) => setFormData({ ...formData, businessScale: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"><option value="Micro (Up to ₹5 Lakhs)">{tProf.scaleMicro || "Micro / Small (Up to ₹5 Lakhs)"}</option><option value="Intermediate (₹5L - ₹25L)">{tProf.scaleMedium || "Intermediate / Medium (₹5L - ₹25L)"}</option><option value="Large (₹25L - ₹50L)">{tProf.scaleLarge || "Large / Commercial (₹25L - ₹50L)"}</option></select></div>
            <div><label className="block text-slate-700 font-bold mb-1">{tProf.businessType || "Project / Business Type"}</label><input type="text" required value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600" /></div>
            <div><label className="block text-slate-700 font-bold mb-1">{tProf.projectCost || "Estimated Project Cost (₹)"}</label><input type="number" step="10000" required value={formData.estimatedProjectCost} onChange={(e) => setFormData({ ...formData, estimatedProjectCost: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-emerald-800 focus:bg-white focus:outline-emerald-600" /></div>
            <div><label className="block text-slate-700 font-bold mb-1">{tProf.loanAmount || "Loan Amount Requested (₹)"}</label><input type="number" step="10000" required value={formData.requiredLoanAmount} onChange={(e) => setFormData({ ...formData, requiredLoanAmount: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-emerald-800 focus:bg-white focus:outline-emerald-600" /></div>
          </div>
          <div className="text-xs"><label className="block text-slate-700 font-bold mb-1">{tProf.projectDescription || "Startup Idea & Operational Plan Description"}</label><textarea rows={3} required value={formData.projectDescription} onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-900 focus:bg-white focus:outline-emerald-600 leading-relaxed" /></div>
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-5 rounded-2xl border border-emerald-800/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center space-x-2"><span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{tProf.viabilityEngine || "AI Business Viability Engine"}</span><span className="text-emerald-200 text-xs">{tProf.viabilityForecast || "Feasibility & Market Survival Forecast"}</span></div></div>
          </div>
        </div>
      </form>
    </div>
  );
}
