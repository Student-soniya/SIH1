import React from 'react';
import { 
  MessageSquare, 
  ShieldCheck, 
  Coins, 
  FileText, 
  Building2, 
  Banknote, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';

export default function ProcessWalkthrough({ onStartOnboarding }) {
  const steps = [
    {
      step: '01',
      title: 'Conversational Onboarding',
      icon: MessageSquare,
      desc: 'Answer a friendly 2-minute questionnaire in your local language (English, Kannada, Hindi, Tamil, Telugu, Marathi, Bengali) with voice assistance. No confusing legal terms.',
      badge: '2 MINUTES'
    },
    {
      step: '02',
      title: 'DigiLocker Verification',
      icon: ShieldCheck,
      desc: 'Connect your DigiLocker to fetch verified Tahsildar Caste and Income certificates instantly, complete with government watermarks and QR code validation.',
      badge: 'INSTANT SYNC'
    },
    {
      step: '03',
      title: 'Explainable Scheme Fit',
      icon: Coins,
      desc: 'View transparent matching scores for NSFDC, MSY, and Term Loan schemes showing exact eligibility criteria met, interest rates, and loan limits.',
      badge: '4% - 8% RATES'
    },
    {
      step: '04',
      title: 'AI Business Plan (DPR)',
      icon: FileText,
      desc: 'Our AI generates a bankable Detailed Project Report with equipment quotations, monthly revenue models, DSCR calculation, and break-even timelines.',
      badge: 'BANK COMPLIANT'
    },
    {
      step: '05',
      title: 'Active Channel Routing',
      icon: Building2,
      desc: 'We map your application directly to an active State Channelizing Agency (SCA) or Regional Rural Bank (RRB) with 0% overdue and available lending quotas.',
      badge: '0% OVERDUE SCA'
    },
    {
      step: '06',
      title: 'Disbursal & Subsidized EMI',
      icon: Banknote,
      desc: 'Download your 1-click printable application dossier or transmit directly to the PM-SURAJ portal for fast sanction and subsidized monthly repayments.',
      badge: 'FAST DISBURSAL'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Beneficiary Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            How SchemeReady Gets You Funded
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            From your very first idea to the day funds hit your bank account—a clear, transparent, 6-step pathway designed to eliminate bureaucratic rejections.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-300 font-mono group-hover:text-emerald-500 transition-colors">
                        {item.step}
                      </span>
                      <span className="block text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-slate-400 group-hover:text-emerald-700 transition-colors">
                  <span>Step {item.step} in Pathway</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center CTA Button */}
        <div className="text-center pt-4">
          <button
            onClick={onStartOnboarding}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl shadow-emerald-600/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Start Step 01: Conversational Onboarding</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </section>
  );
}
