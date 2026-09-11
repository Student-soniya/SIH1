import React from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  FileText, 
  XCircle, 
  TrendingUp, 
  ShieldCheck, 
  Bot, 
  Building2 
} from 'lucide-react';

export default function ProblemSolutionSection({ onStartOnboarding }) {
  const painPoints = [
    {
      title: 'Direct Applications Rejected',
      desc: 'NSFDC & Ministry corporations do not disburse direct retail loans. Over 80% of applicants who apply on corporate portals are summarily rejected without knowing why.',
      tag: 'Channel Finance Rule'
    },
    {
      title: 'Incomplete Bank Documents',
      desc: 'Commercial banks demand caste certificates, Tahsildar income proofs, 3-year ITRs, and equipment quotations. 65% of grassroots applicants get turned away at the inquiry counter.',
      tag: 'Document Bottleneck'
    },
    {
      title: 'No Business Feasibility (DPR)',
      desc: 'First-time entrepreneurs lack formal Detailed Project Reports (DPR), cash flow projections, and Debt Service Coverage Ratios (DSCR) required for credit appraisal.',
      tag: 'Appraisal Failure'
    },
    {
      title: 'Non-Performing Channel Partners',
      desc: 'Beneficiaries approach exhausted bank branches or inactive State Channelizing Agencies (SCAs) that have high NPAs or zero active lending allocations.',
      tag: 'Routing Mismatch'
    }
  ];

  const solutions = [
    {
      title: 'Active Channel Partner Routing',
      desc: 'We automatically map your business pin code to the highest-performing State Channelizing Agency (SCA) or Regional Rural Bank (RRB) with 0% overdue and active disbursement quotas.',
      tag: 'Guaranteed Handoff'
    },
    {
      title: 'DigiLocker 1-Click Verification',
      desc: 'Instant official pull of Tahsildar Caste & Income Certificates with government QR verification and watermarks, remediating document pendency before submission.',
      tag: 'Zero Missing Docs'
    },
    {
      title: 'AI Business Survival & DPR Engine',
      desc: 'Our AI model assesses your startup idea, computes 92% survival probability, benchmarks DSCR (>2.0), and generates a 1-click bank-ready Detailed Project Report.',
      tag: '92% Survival Forecast'
    },
    {
      title: 'Conversational Local Onboarding',
      desc: 'Replace 10-page bureaucratic forms with an empathetic 2-minute voice/text questionnaire in 7 Indian languages (English, Kannada, Hindi, Tamil, Telugu, Marathi, Bengali).',
      tag: 'Inclusive Access'
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-tech-grid-dark opacity-30 pointer-events-none" />
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>The Last-Mile Concessional Credit Challenge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Why 78% of Direct Loan Applications Fail — And How SchemeReady Fixes It
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
            The Government of India provides generous 4%–8% interest subsidies. Yet, thousands of deserving SC/OBC entrepreneurs never receive funds. Here is the operational bottleneck and our sovereign AI solution.
          </p>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: The Traditional Bottleneck (Red/Slate) */}
          <div className="bg-slate-950/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-rose-900/40 space-y-6">
            <div className="flex items-center justify-between border-b border-rose-900/30 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-rose-200">The Traditional Process</h3>
                  <p className="text-xs text-rose-400/80">Why applications get rejected at bank counters</p>
                </div>
              </div>
              <span className="bg-rose-950/80 text-rose-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-rose-800">
                78% Rejection Rate
              </span>
            </div>

            <div className="space-y-4">
              {painPoints.map((item, idx) => (
                <div key={idx} className="bg-slate-900/60 p-4 rounded-2xl border border-rose-950/60 space-y-2 hover:border-rose-800/80 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>{item.title}</span>
                    </h4>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: The SchemeReady Breakthrough (Emerald/Teal) */}
          <div className="bg-slate-950/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-emerald-500/40 space-y-6 shadow-xl shadow-emerald-950/30">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-emerald-200">The SchemeReady AI Engine</h3>
                  <p className="text-xs text-emerald-400/80">Proactive readiness & guaranteed bankable dossier</p>
                </div>
              </div>
              <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-emerald-600">
                94% Approval Readiness
              </span>
            </div>

            <div className="space-y-4">
              {solutions.map((item, idx) => (
                <div key={idx} className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-800/30 space-y-2 hover:border-emerald-500/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-100 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{item.title}</span>
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/40">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Callout Banner */}
        <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-900/60 rounded-2xl p-6 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">
                Don't apply blindly and face a 6-month rejection cooldown.
              </h4>
              <p className="text-xs text-slate-300">
                Check your readiness score, remediate missing certificates with DigiLocker, and download your bank dossier in 5 minutes.
              </p>
            </div>
          </div>

          <button
            onClick={onStartOnboarding}
            className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
          >
            <span>Start Free Readiness Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
