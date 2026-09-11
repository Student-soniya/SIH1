import { localizeTernary } from "../l10n";
import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  RefreshCw, 
  TrendingUp, 
  Building, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { generateBusinessPlan } from '../api';

export default function BusinessPlanBuilder({ 
  lang = 'en', 
  profile, 
  onProceedToPartners 
}) {
  const t = translations[lang] || translations.en;
  const isHindi = lang === 'hi';
  
  const [formData, setFormData] = useState({
    businessType: profile.businessType === 'mobile repair' ? 'Mobile repair shop' : (profile.businessType || 'Tailoring and garment boutique'),
    location: profile.location || 'Bengaluru',
    equipmentRequired: profile.businessType === 'mobile repair' 
      ? 'SMD rework station, digital multimeter, microscope, testing cables, screen separator'
      : 'Heavy-duty electric sewing machines (2), overlock stitching unit, steam press, cutting table',
    estimatedInvestment: profile.estimatedProjectCost || 180000,
    expectedMonthlySales: 55000,
    numberOfEmployees: 1,
    rawMaterialCost: 15000,
    rentAndUtilitiesCost: 8000
  });

  const [report, setReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    const rep = await generateBusinessPlan(formData);
    setReport(rep);
    setGenerating(false);
  };

  useEffect(() => {
    handleGenerate();
  }, [profile]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{localizeTernary('सुविधा 4: AI बिजनेस-प्लान एवं प्रोजेक्ट रिपोर्ट बिल्डर', 'Feature 4: AI Business-Plan Builder', lang)}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.businessPlan.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{t.businessPlan.subtitle}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{localizeTernary('रिपोर्ट प्रिंट करें', 'Print Report', lang)}</span>
          </button>
        </div>
      </div>

      {/* Form and Generated Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              {localizeTernary('परियोजना इनपुट एवं वित्तीय पैरामीटर', 'Project Inputs & Parameters', lang)}
            </h3>
            <span className="text-[10px] bg-slate-100 font-mono text-slate-600 px-2 py-0.5 rounded">
              {localizeTernary('निश्चित अनुपात', 'Deterministic Ratios', lang)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {localizeTernary('व्यवसाय का प्रकार', 'Business Type', lang)}
            </label>
            <input
              type="text"
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {localizeTernary('स्थान / जिला', 'Location', lang)}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {localizeTernary('कर्मचारी संख्या', 'Employees', lang)}
              </label>
              <input
                type="number"
                value={formData.numberOfEmployees}
                onChange={(e) => setFormData({ ...formData, numberOfEmployees: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {localizeTernary('आवश्यक उपकरण एवं मशीनरी', 'Equipment Required', lang)}
            </label>
            <textarea
              rows={2}
              value={formData.equipmentRequired}
              onChange={(e) => setFormData({ ...formData, equipmentRequired: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {localizeTernary('परियोजना निवेश (₹)', 'Project Investment (₹)', lang)}
              </label>
              <input
                type="number"
                step="10000"
                value={formData.estimatedInvestment}
                onChange={(e) => setFormData({ ...formData, estimatedInvestment: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {localizeTernary('मासिक बिक्री (₹)', 'Monthly Sales (₹)', lang)}
              </label>
              <input
                type="number"
                step="5000"
                value={formData.expectedMonthlySales}
                onChange={(e) => setFormData({ ...formData, expectedMonthlySales: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {localizeTernary('कच्चा माल / स्पेयर (₹)', 'Raw Material / Spares (₹)', lang)}
              </label>
              <input
                type="number"
                value={formData.rawMaterialCost}
                onChange={(e) => setFormData({ ...formData, rawMaterialCost: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {localizeTernary('दुकान किराया एवं बिजली (₹)', 'Shop Rent & Power (₹)', lang)}
              </label>
              <input
                type="number"
                value={formData.rentAndUtilitiesCost}
                onChange={(e) => setFormData({ ...formData, rentAndUtilitiesCost: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
            <span>
              {generating 
                ? (localizeTernary('व्यवहार्यता की गणना हो रही है...', 'Calculating Viability...', lang)) 
                : t.businessPlan.generateBtn}
            </span>
          </button>
        </div>

        {/* Right Report Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          {report ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    {localizeTernary('एक-पेज विस्तृत परियोजना रिपोर्ट (डीपीआर)', 'One-Page Detailed Project Report (DPR)', lang)}
                  </h3>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  {localizeTernary('बैंक-स्वीकृत प्रारूप', 'Bank-Ready Format', lang)}
                </span>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    {localizeTernary('आवश्यक बैंक ऋण', 'Bank Loan Needed', lang)}
                  </span>
                  <span className="text-lg font-black text-emerald-950">₹{report.bankLoanRequired.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-700 block">
                    {localizeTernary('कुल लागत का 95%', '95% of Total Cost', lang)}
                  </span>
                </div>
                <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-teal-800 block">
                    {localizeTernary('शुद्ध मासिक लाभ', 'Net Monthly Profit', lang)}
                  </span>
                  <span className="text-lg font-black text-teal-950">₹{report.netMonthlyProfit.toLocaleString()}</span>
                  <span className="text-[10px] text-teal-700 block">
                    {localizeTernary('सभी खर्चों के बाद', 'After all expenses', lang)}
                  </span>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-indigo-800 block">
                    {localizeTernary('डीएससीआर कवरेज', 'DSCR Coverage', lang)}
                  </span>
                  <span className="text-lg font-black text-indigo-950">{report.debtServiceCoverageRatio}x</span>
                  <span className="text-[10px] text-indigo-700 block">
                    {localizeTernary('बैंक मानक > 1.5x', 'Bank Norm > 1.5x', lang)}
                  </span>
                </div>
              </div>

              {/* Narrative Sections */}
              <div className="space-y-3 text-xs text-slate-700">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block font-bold mb-0.5">
                    {localizeTernary('1. कार्यकारी सारांश:', '1. Executive Summary:', lang)}
                  </strong>
                  <p>
                    {isHindi
                      ? `${formData.location} में ${formData.businessType} इकाई की स्थापना। कुल परियोजना लागत ₹${report.totalProjectCost.toLocaleString()} है जिसमें ₹${report.equipmentCost.toLocaleString()} मशीनरी और ₹${report.workingCapital.toLocaleString()} कार्यशील पूंजी शामिल है।`
                      : report.businessSummary}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block font-bold mb-0.5">
                    {localizeTernary('2. ऋण का उद्देश्य:', '2. Purpose of Loan:', lang)}
                  </strong>
                  <p>
                    {isHindi
                      ? `आवश्यक उपकरण खरीदने और 3 महीने के परिचालन बफर को बनाए रखने के लिए ₹${report.bankLoanRequired.toLocaleString()} का सावधि ऋण।`
                      : report.purposeOfLoan}
                  </p>
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2.5">{localizeTernary('वित्तीय घटक', 'Financial Component', lang)}</th>
                      <th className="p-2.5 text-right">{localizeTernary('राशि (₹)', 'Amount (₹)', lang)}</th>
                      <th className="p-2.5 text-right">{localizeTernary('टिप्पणी', 'Notes', lang)}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 text-slate-800 font-medium">
                        {localizeTernary('उपकरण एवं मशीनरी', 'Equipment & Tools', lang)}
                      </td>
                      <td className="p-2.5 text-right font-bold">₹{report.equipmentCost.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-slate-500">
                        {localizeTernary('पूंजीगत संपत्ति', 'Capital Asset', lang)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-800 font-medium">
                        {localizeTernary('कार्यशील पूंजी एवं स्पेयर', 'Working Capital & Spares', lang)}
                      </td>
                      <td className="p-2.5 text-right font-bold">₹{report.workingCapital.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-slate-500">
                        {localizeTernary('30% प्रारंभिक बफर', '30% Gestation Buffer', lang)}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2.5 text-slate-900">
                        {localizeTernary('कुल परियोजना परिव्यय', 'Total Project Outlay', lang)}
                      </td>
                      <td className="p-2.5 text-right text-emerald-800">₹{report.totalProjectCost.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-slate-600">
                        {localizeTernary('100% परिव्यय', '100% Outlay', lang)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-800 font-medium">
                        {localizeTernary('प्रवर्तक मार्जिन (5%)', 'Promoter Margin (5%)', lang)}
                      </td>
                      <td className="p-2.5 text-right font-semibold">₹{report.marginMoneyPromoterContribution.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-slate-500">
                        {localizeTernary('स्वयं का अंशदान', 'Own Funds', lang)}
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/70 font-bold">
                      <td className="p-2.5 text-emerald-950">
                        {localizeTernary('योजना के तहत शुद्ध ऋण', 'Net Term Loan Under Scheme', lang)}
                      </td>
                      <td className="p-2.5 text-right text-emerald-900 font-black">₹{report.bankLoanRequired.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-emerald-800">
                        {localizeTernary('95% रियायती', '95% Concessional', lang)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Repayment Capacity Badge */}
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs flex items-start space-x-2 text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">
                    {localizeTernary('पुनर्भुगतान क्षमता मूल्यांकन:', 'Repayment Assessment:', lang)}
                  </strong>
                  <span>
                    {isHindi 
                      ? `मासिक शुद्ध लाभ ₹${report.netMonthlyProfit.toLocaleString()} से ₹3,889 मासिक ईएमआई का निर्बाध भुगतान संभव है। डीएससीआर अनुपात ${report.debtServiceCoverageRatio}x है, जो बैंक मानक 1.5x से अधिक है।`
                      : report.repaymentCapacityAssessment}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onProceedToPartners}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-2 cursor-pointer"
                >
                  <span>{localizeTernary('चैनल पार्टनर खोजें', 'Locate Channel Partners', lang)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              {localizeTernary('पैरामीटर भरें और "प्रोजेक्ट रिपोर्ट बनाएं" पर क्लिक करें।', 'Fill in the parameters and click "Generate Project Report".', lang)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
