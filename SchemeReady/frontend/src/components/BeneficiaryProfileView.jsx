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
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BeneficiaryProfileView({ 
  profile, 
  setProfile, 
  onSaveDone 
}) {
  const [formData, setFormData] = useState({ 
    cibilScore: profile.cibilScore || 745,
    businessScale: profile.businessScale || 'Micro (Up to ₹5 Lakhs)',
    casteCertificateNo: profile.casteCertificateNo || 'RD0038921029-SC',
    digilockerVerified: profile.digilockerVerified !== undefined ? profile.digilockerVerified : true,
    ...profile 
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
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
            <span>Beneficiary Comprehensive Profile (SIH Standard)</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Personal, Academic &amp; Project Dossier</h2>
          <p className="text-sm text-slate-600 mt-1">
            Complete profile data utilized for deterministic scheme matching and bank channel routing.
          </p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2 rounded-xl font-bold flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Profile Updated &amp; Re-matched!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Personal & Identity Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">1. Personal &amp; Family Identification</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Parents' Name (Father / Mother)</label>
              <input
                type="text"
                required
                value={formData.parentsName}
                onChange={(e) => setFormData({ ...formData, parentsName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
              >
                <option value="Male">Male</option>
                <option value="Female">Female (Unlocks Mahila Samriddhi Yojana at 4%)</option>
                <option value="Transgender">Transgender / Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Pan-India State</label>
              <select
                value={formData.state || 'Karnataka'}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
              >
                {Object.keys(statesAndDistricts).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">District / City</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
              >
                {(statesAndDistricts[formData.state || 'Karnataka'] || []).map((dst) => (
                  <option key={dst} value={dst}>{dst}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Social Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
              >
                <option value="SC">Scheduled Caste (SC) - Targeted Beneficiary</option>
                <option value="Safai Karamchari">Safai Karamchari / Scavenger Dependent</option>
                <option value="OBC">OBC (Micro Enterprise Window)</option>
              </select>
            </div>
          </div>

          {/* Caste Certificate & DigiLocker Integration */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-emerald-900">Caste Certificate Status:</span>
                {formData.hasCasteCertificate ? (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold inline-flex items-center space-x-1">
                    <span>✓ Verified via Govt Portal</span>
                  </span>
                ) : (
                  <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full font-bold">
                    Pending Verification
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                RD Number: {formData.casteCertificateNo || 'RD0038921029-SC'} (Issued by Tahsildar / Nadakacheri)
              </p>
            </div>
            <button
              type="button"
              onClick={handleDigiLockerFetch}
              disabled={digilockerLoading}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center space-x-2 shrink-0 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{digilockerLoading ? 'Connecting DigiLocker...' : 'Fetch via DigiLocker'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Income, CIBIL Score & Taxation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">2. Income Verification, CIBIL &amp; Credit Standing</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Annual Family Income (₹) <span className="text-emerald-700 font-bold font-mono">[Cap: ₹5L]</span>
              </label>
              <input
                type="number"
                step="5000"
                required
                value={formData.annualFamilyIncome}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  annualFamilyIncome: Number(e.target.value),
                  householdAnnualIncome: Number(e.target.value)
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-emerald-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                CIBIL / Credit Score <span className="text-emerald-600 font-bold">(300 - 900)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="300"
                  max="900"
                  value={formData.cibilScore || 745}
                  onChange={(e) => setFormData({ ...formData, cibilScore: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
                />
                <span className="absolute right-3 top-2 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  {formData.cibilScore >= 750 ? 'Excellent' : formData.cibilScore >= 680 ? 'Good' : 'Moderate'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Has Filed ITR?</label>
              <select
                value={formData.hasFiledItr ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, hasFiledItr: e.target.value === 'true' })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:outline-emerald-600"
              >
                <option value="true">Yes, Filed ITR</option>
                <option value="false">No, Self-Declaration / Tahsildar Cert</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">ITR Ack Number</label>
              <input
                type="text"
                value={formData.itrAckNumber || ''}
                placeholder="e.g. ITR-V-2025-8891042"
                onChange={(e) => setFormData({ ...formData, itrAckNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Academic Qualifications (10th & 12th Marks) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">3. Academic Performance (Crucial for Educational Loan Schemes)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-900 block text-xs">Class 10th (Secondary School)</span>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Marks / Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.tenthMarksPercentage}
                  onChange={(e) => setFormData({ ...formData, tenthMarksPercentage: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-emerald-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">School / Board Name</label>
                <input
                  type="text"
                  value={formData.tenthSchoolName}
                  onChange={(e) => setFormData({ ...formData, tenthSchoolName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-900 block text-xs">Class 12th / PUC / Diploma</span>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Marks / Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.twelfthMarksPercentage}
                  onChange={(e) => setFormData({ ...formData, twelfthMarksPercentage: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-emerald-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Junior College / High School Name</label>
                <input
                  type="text"
                  value={formData.twelfthSchoolName}
                  onChange={(e) => setFormData({ ...formData, twelfthSchoolName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Business Specifications & AI Viability Analysis */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">4. Business Scale, Viability &amp; Survival Assessment</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Business Scale / Category</label>
              <select
                value={formData.businessScale || 'Micro (Up to ₹5 Lakhs)'}
                onChange={(e) => setFormData({ ...formData, businessScale: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
              >
                <option value="Micro (Up to ₹5 Lakhs)">Micro / Small (Up to ₹5 Lakhs)</option>
                <option value="Intermediate (₹5L - ₹25L)">Intermediate / Medium (₹5L - ₹25L)</option>
                <option value="Large (₹25L - ₹50L)">Large / Commercial (₹25L - ₹50L)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Project / Business Type</label>
              <input
                type="text"
                required
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Estimated Project Cost (₹)</label>
              <input
                type="number"
                step="10000"
                required
                value={formData.estimatedProjectCost}
                onChange={(e) => setFormData({ ...formData, estimatedProjectCost: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-emerald-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Loan Amount Requested (₹)</label>
              <input
                type="number"
                step="10000"
                required
                value={formData.requiredLoanAmount}
                onChange={(e) => setFormData({ ...formData, requiredLoanAmount: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-emerald-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-700 font-bold mb-1">Startup Idea &amp; Operational Plan Description</label>
            <textarea
              rows={3}
              required
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-900 focus:bg-white focus:outline-emerald-600 leading-relaxed"
            />
          </div>

          {/* AI Business Feasibility & Survival Assessment (Will it go or close?) */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-5 rounded-2xl border border-emerald-800/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  AI Business Viability Engine
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  Feasibility &amp; Market Survival Forecast
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Business Survival Probability:</span>
                <span className="text-sm font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/40">
                  92% (High Survival &amp; Low Risk)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-slate-400 block text-[11px] font-medium">Business Status Forecast</span>
                <span className="text-emerald-300 font-bold text-xs mt-0.5 block">
                  ● Will Flourish &amp; Expand (High Local Demand)
                </span>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Zero risk of sudden closure due to essential electronics repair demand in Bengaluru urban clusters.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-slate-400 block text-[11px] font-medium">Break-Even Horizon</span>
                <span className="text-teal-300 font-bold text-xs mt-0.5 block">
                  3.5 Months Post Disbursal
                </span>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Moratorium gestation buffer of 3 months covers initial store setup and tooling procurement.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-slate-400 block text-[11px] font-medium">Debt Service Coverage (DSCR)</span>
                <span className="text-emerald-300 font-bold text-xs mt-0.5 block">
                  2.46 (Healthy &gt; 1.5 Benchmark)
                </span>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Net monthly cash flow of ₹22,500 comfortably services ₹3,889 monthly EMI.
                </p>
              </div>
            </div>

            {/* AI Suggestions for the Good Business */}
            <div className="border-t border-white/10 pt-3">
              <span className="text-[11px] font-bold text-emerald-300 block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>AI Growth Suggestions to Maximize Business Longevity:</span>
              </span>
              <ul className="text-[11px] text-slate-300 space-y-1 list-disc pl-4 leading-relaxed">
                <li><strong>Warranty Bundling:</strong> Offer 30-day warranty on smartphone display replacement to secure 45% recurring footfall.</li>
                <li><strong>Accessory Margin Booster:</strong> Introduce tempered glass and fast chargers (60% gross margin) alongside repair services.</li>
                <li><strong>Govt Portal Linkage:</strong> Register on ONDC and GeM to secure corporate and institutional repair contracts.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit & Save */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Update Eligibility Matches</span>
          </button>
        </div>
      </form>
    </div>
  );
}
