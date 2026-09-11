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
  lang, 
  profile, 
  onProceedToPartners 
}) {
  const t = translations[lang] || translations.en;
  
  const [formData, setFormData] = useState({
    businessType: profile.businessType === 'mobile repair' ? 'Mobile repair shop' : 'Tailoring and garment boutique',
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
            <span>Feature 4: AI Business-Plan Builder</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.businessPlan.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{t.businessPlan.subtitle}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Form and Generated Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Project Inputs &amp; Parameters</h3>
            <span className="text-[10px] bg-slate-100 font-mono text-slate-600 px-2 py-0.5 rounded">
              Deterministic Ratios
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Business Type</label>
            <input
              type="text"
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Employees</label>
              <input
                type="number"
                value={formData.numberOfEmployees}
                onChange={(e) => setFormData({ ...formData, numberOfEmployees: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Equipment Required</label>
            <textarea
              rows={2}
              value={formData.equipmentRequired}
              onChange={(e) => setFormData({ ...formData, equipmentRequired: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Investment (₹)</label>
              <input
                type="number"
                step="10000"
                value={formData.estimatedInvestment}
                onChange={(e) => setFormData({ ...formData, estimatedInvestment: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Sales (₹)</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Raw Material / Spares (₹)</label>
              <input
                type="number"
                value={formData.rawMaterialCost}
                onChange={(e) => setFormData({ ...formData, rawMaterialCost: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shop Rent &amp; Power (₹)</label>
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
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'Calculating Viability...' : t.businessPlan.generateBtn}</span>
          </button>
        </div>

        {/* Right Report Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          {report ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">One-Page Detailed Project Report (DPR)</h3>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  Bank-Ready Format
                </span>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Bank Loan Needed</span>
                  <span className="text-lg font-black text-emerald-950">₹{report.bankLoanRequired.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-700 block">95% of Total Cost</span>
                </div>
                <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-teal-800 block">Net Monthly Profit</span>
                  <span className="text-lg font-black text-teal-950">₹{report.netMonthlyProfit.toLocaleString()}</span>
                  <span className="text-[10px] text-teal-700 block">After all expenses</span>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-indigo-800 block">DSCR Coverage</span>
                  <span className="text-lg font-black text-indigo-950">{report.debtServiceCoverageRatio}x</span>
                  <span className="text-[10px] text-indigo-700 block">Bank Norm &gt; 1.5x</span>
                </div>
              </div>

              {/* Narrative Sections */}
              <div className="space-y-3 text-xs text-slate-700">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block font-bold mb-0.5">1. Executive Summary:</strong>
                  <p>{report.businessSummary}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block font-bold mb-0.5">2. Purpose of Loan:</strong>
                  <p>{report.purposeOfLoan}</p>
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2.5">Financial Component</th>
                      <th className="p-2.5 text-right">Amount (₹)</th>
                      <th className="p-2.5 text-right">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 text-slate-800 font-medium">Equipment &amp; Tools</td>
                      <td className="p-2.5 text-right font-bold">₹{report.equipmentCost.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-slate-500">Capital Asset</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-800 font-medium">Working Capital &amp; Spares</td>
                      <td className="p-2.5 text-right font-bold">₹{report.workingCapital.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-slate-500">30% Gestation Buffer</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2.5 text-slate-900">Total Project Outlay</td>
                      <td className="p-2.5 text-right text-emerald-800">₹{report.totalProjectCost.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-slate-600">100% Outlay</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-800 font-medium">Promoter Margin (5%)</td>
                      <td className="p-2.5 text-right font-semibold">₹{report.marginMoneyPromoterContribution.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-slate-500">Own Funds</td>
                    </tr>
                    <tr className="bg-emerald-50/70 font-bold">
                      <td className="p-2.5 text-emerald-950">Net Term Loan Under Scheme</td>
                      <td className="p-2.5 text-right text-emerald-900 font-black">₹{report.bankLoanRequired.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-emerald-800">95% Concessional</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Repayment Capacity Badge */}
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs flex items-start space-x-2 text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Repayment Assessment:</strong>
                  <span>{report.repaymentCapacityAssessment}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onProceedToPartners}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-2"
                >
                  <span>Locate Channel Partners</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Fill in the parameters and click "Generate Project Report".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
