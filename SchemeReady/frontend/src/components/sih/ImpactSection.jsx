import React from 'react';
import { 
  Globe2, 
  Users, 
  Building, 
  Rocket, 
  Award, 
  Sparkles, 
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function ImpactSection() {
  const impactMetrics = [
    {
      value: '10 Lakh+',
      label: 'Student Innovators',
      desc: 'Participating across tier 1, tier 2, and rural higher educational institutes nationwide.'
    },
    {
      value: '1,200+',
      label: 'Higher Ed Institutes',
      desc: 'Colleges and universities organizing dedicated internal college-level hackathons.'
    },
    {
      value: '50+',
      label: 'Union Ministries',
      desc: 'Direct central government departments adopting winning student technological code.'
    },
    {
      value: '150+',
      label: 'Startups Incubated',
      desc: 'Student prototypes funded through seed grants, venture incubators, and patent filings.'
    }
  ];

  return (
    <section id="impact" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Animated Blobs & Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-orange-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-float" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-300">
            <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Sovereign Scale &amp; Momentum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            From Ideas to <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">National Impact</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal">
            Bridging academia, governance, and industry to cultivate a self-reliant technological ecosystem (Atmanirbhar Bharat).
          </p>
        </div>

        {/* 4 Large Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactMetrics.map((m, idx) => (
            <div
              key={idx}
              className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all duration-300 space-y-3 relative group"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-transparent bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text tracking-tight">
                {m.value}
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                {m.label}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        {/* India Sovereign Network Visual Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950 p-6 sm:p-10 rounded-3xl border border-white/15 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-bold font-mono">
              <MapPin className="w-3.5 h-3.5" />
              <span>40+ NODAL FINALE HUBS NATIONWIDE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              Every Corner of Bharat Connected Through Innovation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              From IITs and NITs to state universities and polytechnics across Kashmir to Kanyakumari, SIH provides equitable access to high-impact government technology challenges.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="text-center bg-white/10 p-4 rounded-2xl border border-white/10 min-w-[130px]">
              <div className="text-2xl font-black text-amber-400 font-mono">28 States</div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Pan-India Reach</div>
            </div>
            <div className="text-center bg-white/10 p-4 rounded-2xl border border-white/10 min-w-[130px]">
              <div className="text-2xl font-black text-emerald-400 font-mono">8 UTs</div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Unified Platform</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}