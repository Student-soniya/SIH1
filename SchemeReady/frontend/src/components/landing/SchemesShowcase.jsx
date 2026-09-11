import React, { useState } from 'react';
import { 
  Coins, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  Tag, 
  Layers, 
  UserCheck, 
  Filter 
} from 'lucide-react';

export default function SchemesShowcase({ onSelectScheme }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const schemes = [
    {
      id: 'NSFDC-MCS-01',
      name: 'Micro Credit Scheme (MCS)',
      authority: 'National Scheduled Castes Finance & Development Corporation (NSFDC)',
      category: 'micro',
      maxLoan: '₹1,50,000',
      maxLoanNum: 150000,
      interestRate: '5.0% p.a.',
      interestRateNum: 5.0,
      tenure: 'Up to 36 Months',
      moratorium: '3 Months Gestation',
      subsidy: '90% Project Cost Financed',
      bestFor: 'Tailoring, Mobile Repair, Tea / Fast Food, Kirana Stores, Small Artisans',
      guidelines: 'NSFDC Operational Guidelines Clause 4.2',
      badge: 'MOST POPULAR FOR MICRO',
      accent: 'border-emerald-500 bg-emerald-50/60 text-emerald-900',
      pillColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'NSFDC-MSY-02',
      name: 'Mahila Samriddhi Yojana (MSY)',
      authority: 'Ministry of Social Justice & Empowerment (MoSJE)',
      category: 'women',
      maxLoan: '₹1,40,000',
      maxLoanNum: 140000,
      interestRate: '4.0% p.a.',
      interestRateNum: 4.0,
      tenure: 'Up to 36 Months',
      moratorium: '3 Months Gestation',
      subsidy: '90% Cost + Special Women Subvention',
      bestFor: 'Women Entrepreneurs, Self-Help Groups (SHGs), Beauty Salons, Handlooms, Food Packaging',
      guidelines: 'NSFDC Guidelines Section 5.1 (Women Exclusive)',
      badge: 'LOWEST INTEREST (4.0%)',
      accent: 'border-rose-400 bg-rose-50/60 text-rose-900',
      pillColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'NSFDC-TL-03',
      name: 'Term Loan (Double Decker) Scheme',
      authority: 'NSFDC & State Channelizing Agencies (SCAs)',
      category: 'commercial',
      maxLoan: '₹50,00,000',
      maxLoanNum: 5000000,
      interestRate: '6.0% - 8.0% p.a.',
      interestRateNum: 6.5,
      tenure: 'Up to 60 Months',
      moratorium: '6-12 Months Gestation',
      subsidy: 'Up to ₹50,000 Capital Subsidy',
      bestFor: 'CNC Workshops, Light Manufacturing, Cold Storage, Dairy Farms, Commercial Vehicles',
      guidelines: 'NSFDC Term Loan Schedule 2024-26',
      badge: 'UP TO ₹50 LAKHS',
      accent: 'border-blue-500 bg-blue-50/60 text-blue-900',
      pillColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'NSFDC-GBS-04',
      name: 'Green Business Scheme (GBS)',
      authority: 'MoSJE Green Transition Initiative',
      category: 'green',
      maxLoan: '₹30,00,000',
      maxLoanNum: 3000000,
      interestRate: '6.0% p.a.',
      interestRateNum: 6.0,
      tenure: 'Up to 60 Months',
      moratorium: '6 Months Gestation',
      subsidy: 'Subsidized EV & Solar Transition',
      bestFor: 'E-Rickshaws, Solar Rooftop Service, Bio-Waste Processing, Battery Swapping Stations',
      guidelines: 'Green Business Policy Document Clause 7',
      badge: 'GREEN TECH SUBSIDY',
      accent: 'border-teal-500 bg-teal-50/60 text-teal-900',
      pillColor: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'SUI-PMEGP-05',
      name: 'Stand-Up India / PMEGP Convergence',
      authority: 'Ministry of MSME & SIDBI / Public Sector Banks',
      category: 'commercial',
      maxLoan: '₹10,00,000 - ₹1 Crore',
      maxLoanNum: 2500000,
      interestRate: 'MCLR + 1.5% (Collateral-Free)',
      interestRateNum: 8.0,
      tenure: 'Up to 84 Months',
      moratorium: '12 Months Gestation',
      subsidy: '25% - 35% Margin Money Subsidy',
      bestFor: 'Greenfield Ventures, Agri-Processing Units, Export Apparel, Tech Hardware Labs',
      guidelines: 'Stand-Up India Guidelines for SC/ST/Women',
      badge: 'COLLATERAL-FREE CGTMSE',
      accent: 'border-amber-500 bg-amber-50/60 text-amber-900',
      pillColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'NSFDC-EL-06',
      name: 'Educational Concessional Loan Scheme',
      authority: 'NSFDC High-Skilling Division',
      category: 'education',
      maxLoan: '₹20L (India) / ₹30L (Abroad)',
      maxLoanNum: 2000000,
      interestRate: '4.0% p.a. (0.5% Women Rebate)',
      interestRateNum: 4.0,
      tenure: 'Up to 120 Months',
      moratorium: 'Course Period + 1 Year',
      subsidy: '100% Course & Living Expenses',
      bestFor: 'Engineering, Medicine, MCA, Biotechnology, Polytechnic & Advanced Vocational Training',
      guidelines: 'Education Scheme Circular 2024-25',
      badge: '4% RATE + 1 YEAR BUFFER',
      accent: 'border-purple-500 bg-purple-50/60 text-purple-900',
      pillColor: 'bg-purple-100 text-purple-800'
    }
  ];

  const filteredSchemes = schemes.filter(s => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'micro') return s.category === 'micro';
    if (activeFilter === 'women') return s.category === 'women';
    if (activeFilter === 'commercial') return s.category === 'commercial';
    if (activeFilter === 'green') return s.category === 'green';
    return true;
  });

  return (
    <section id="schemes" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Government Financial Products</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            National Concessional Schemes for Entrepreneurship
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Beneficiaries with annual family income up to ₹5.00 Lakhs are entitled to up to 90% project cost coverage at heavily subsidized concessional rates. Explore official products below.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Concessional Schemes (6)' },
            { id: 'micro', label: 'Micro Credit (< ₹1.5L)' },
            { id: 'women', label: 'Women Special (4.0% MSY)' },
            { id: 'commercial', label: 'Term Loans (Up to ₹50L)' },
            { id: 'green', label: 'Green Tech & Solar' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === pill.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Schemes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group hover:border-emerald-500/50"
            >
              <div className="space-y-4">
                {/* Top Badge & Code */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-md border ${scheme.pillColor}`}>
                    {scheme.id}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    {scheme.badge}
                  </span>
                </div>

                {/* Scheme Title & Authority */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {scheme.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    {scheme.authority}
                  </p>
                </div>

                {/* Key Financial Specifications Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Max Financing</span>
                    <span className="text-sm font-black text-slate-900 font-mono">{scheme.maxLoan}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Interest Rate</span>
                    <span className="text-sm font-black text-emerald-700 font-mono">{scheme.interestRate}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Repayment Tenure</span>
                    <span className="text-[11px] font-bold text-slate-700">{scheme.tenure}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Moratorium</span>
                    <span className="text-[11px] font-bold text-slate-700">{scheme.moratorium}</span>
                  </div>
                </div>

                {/* Best Suited For */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Recommended Businesses:
                  </span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {scheme.bestFor}
                  </p>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{scheme.subsidy}</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectScheme ? onSelectScheme(scheme) : null}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer active:scale-95"
                >
                  <span>Apply With SchemeReady AI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
