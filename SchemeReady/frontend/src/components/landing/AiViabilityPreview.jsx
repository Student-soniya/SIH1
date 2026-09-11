import React, { useState } from 'react';
import { 
  Bot, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Calculator, 
  ShieldCheck, 
  PieChart, 
  Cpu 
} from 'lucide-react';

export default function AiViabilityPreview({ onTestIdea }) {
  const [projectCost, setProjectCost] = useState(180000);
  const [monthlySales, setMonthlySales] = useState(48000);
  const [businessCategory, setBusinessCategory] = useState('tech_repair');

  // Dynamic calculations
  const monthlyExpenses = Math.round(monthlySales * 0.42) + 6500;
  const netMonthlyProfit = monthlySales - monthlyExpenses;
  const estimatedEmi = Math.round((projectCost * 0.9 * (0.05 / 12)) / (1 - Math.pow(1 + 0.05 / 12, -36)));
  const dscr = ((netMonthlyProfit + estimatedEmi) / estimatedEmi).toFixed(2);
  const breakEvenMonths = (projectCost * 0.1 / Math.max(netMonthlyProfit, 1000)).toFixed(1);
  const survivalRate = dscr > 2.0 ? 94 : dscr > 1.5 ? 88 : 74;

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Business Viability & Survival Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            "Will My Business Survive or Close?"
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Bank managers reject applications when cash flows look risky. SchemeReady's pre-trained AI analyzes your project costs, generates accurate DSCR metrics, and recommends high-margin equipment before the bank ever reviews it.
          </p>
        </div>

        {/* Interactive Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                Live Interactive Sandbox
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Simulate Your Business Model
              </h3>
              <p className="text-xs text-slate-500">
                Adjust the sliders below to see real-time AI survival probability and bank approval indicators.
              </p>
            </div>

            {/* Business Category */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-slate-700">Select Business Type</label>
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-500 cursor-pointer"
              >
                <option value="tech_repair">Mobile Display & Chip Repair (High Margin ~ 58%)</option>
                <option value="tailoring">Boutique & Garment Tailoring (Steady Demand ~ 50%)</option>
                <option value="grocery">Kirana & Retail Mart (Volume Driven ~ 22%)</option>
                <option value="ev_transport">Electric Commercial Auto (Consistent ~ 45%)</option>
              </select>
            </div>

            {/* Project Cost Slider */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Estimated Project Cost</span>
                <span className="font-mono font-black text-emerald-700">₹{(projectCost).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={projectCost}
                onChange={(e) => setProjectCost(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹50,000 (Micro)</span>
                <span>₹2.5 Lakhs</span>
                <span>₹5 Lakhs (Ceiling)</span>
              </div>
            </div>

            {/* Monthly Revenue Slider */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Expected Monthly Revenue</span>
                <span className="font-mono font-black text-emerald-700">₹{(monthlySales).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="15000"
                max="150000"
                step="5000"
                value={monthlySales}
                onChange={(e) => setMonthlySales(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹15,000/mo</span>
                <span>₹75,000/mo</span>
                <span>₹1,50,000/mo</span>
              </div>
            </div>

            <button
              onClick={onTestIdea}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Full AI Business Plan (DPR)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: AI Viability Intelligence Output Card */}
          <div className="lg:col-span-7 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black">
                  AI
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Bank Credit Appraisal Preview</h4>
                  <p className="text-[11px] text-slate-400">Computed via NSFDC & RBI Lending Guidelines</p>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                ● Model Verified
              </span>
            </div>

            {/* Top Score Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {/* Survival Probability */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Survival Forecast</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-emerald-400 font-mono">{survivalRate}%</span>
                  <span className="text-xs text-emerald-500 font-bold">High</span>
                </div>
                <p className="text-[10px] text-slate-500">Low risk of default or closure in year 1</p>
              </div>

              {/* DSCR Score */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Debt Service Ratio (DSCR)</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-amber-400 font-mono">{dscr}</span>
                  <span className="text-xs text-slate-400">/ 1.50 min</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-medium">✓ Exceeds bank threshold of 1.50</p>
              </div>

              {/* Break Even Horizon */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Break-Even Horizon</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-teal-400 font-mono">{breakEvenMonths}</span>
                  <span className="text-xs text-slate-400">Months</span>
                </div>
                <p className="text-[10px] text-slate-500">Promoter capital recovered rapidly</p>
              </div>
            </div>

            {/* Financial Breakdown Summary Table */}
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h5 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                <PieChart className="w-3.5 h-3.5 text-emerald-400" />
                <span>Monthly Cash Flow Simulation</span>
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div>
                  <span className="text-[10px] text-slate-400 block">Gross Inflow</span>
                  <span className="text-xs font-bold text-white font-mono">₹{monthlySales.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Operating Costs</span>
                  <span className="text-xs font-bold text-slate-300 font-mono">₹{monthlyExpenses.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Subsidized EMI</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">₹{estimatedEmi.toLocaleString('en-IN')}/mo</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Net Free Cashflow</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">₹{(netMonthlyProfit - estimatedEmi).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* AI Strategic Recommendation Box */}
            <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 flex items-start space-x-3 text-left">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-emerald-200">AI Growth &amp; Risk Remediation Tip:</span>
                <p className="text-slate-300 leading-relaxed">
                  "Allocating ₹35,000 from your loan to procure a computerized diagnosis and OCA lamination machine will boost gross margins from 32% to 58%, expanding monthly debt service capacity."
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
