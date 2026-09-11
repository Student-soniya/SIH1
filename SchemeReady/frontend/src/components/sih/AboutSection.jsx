import React from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Target, 
  Users, 
  Rocket, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function AboutSection({ onExploreProblems }) {
  const highlights = [
    {
      title: 'Open Innovation Pipeline',
      desc: 'Connects directly with 50+ Union Ministries and industry leaders to tackle ground-truth public sector bottlenecks.',
      icon: Target
    },
    {
      title: 'Empowering Student Founders',
      desc: 'Converts student hackathon prototypes into commercial products, patents, and DPIIT-recognized startups.',
      icon: Rocket
    },
    {
      title: '36-Hour Non-stop Finale',
      desc: 'Nationwide simultaneous grand finale across 40+ nodal centers with round-the-clock live evaluation.',
      icon: Lightbulb
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-28 relative overflow-hidden bg-slate-50/50">
      {/* Decorative Grid and Background Blobs */}
      <div className="absolute inset-0 bg-tech-grid-dark opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative & Mission */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 border border-orange-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>National Innovation Movement</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              India's Innovation <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 bg-clip-text text-transparent">Starts With You</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Smart India Hackathon 2026 is a premier nationwide initiative by the <strong>Ministry of Education's Innovation Cell (MIC)</strong> and <strong>AICTE</strong> to provide students with a platform to solve pressing challenges faced by government departments, ministries, industries, and non-governmental organizations.
            </p>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              In its 9th consecutive edition, SIH fosters a culture of product innovation, problem-solving mindset, and practical technological leadership among 10 Lakh+ engineering, design, and management students across Bharat.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx}
                    className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-orange-50 group-hover:bg-orange-500 group-hover:text-white text-orange-600 flex items-center justify-center mb-3 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA row */}
            <div className="pt-4 flex items-center space-x-4">
              <a
                href="#problems"
                className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
              >
                <span>Browse National Challenges</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </a>
              <a
                href="#process"
                className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                Learn How It Works &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Visual & Floating Glass Cards */}
          <div className="lg:col-span-5 relative">
            {/* Center Circle Hub */}
            <div className="relative mx-auto w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-2 shadow-2xl flex items-center justify-center border-4 border-white/60">
              <div className="w-full h-full rounded-full border border-dashed border-white/20 flex flex-col items-center justify-center p-6 text-center text-white space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Award className="w-7 h-7 text-slate-950" />
                </div>
                <div className="text-2xl font-black tracking-tight">SIH 2026</div>
                <p className="text-xs text-slate-300 font-medium leading-tight">
                  Ministry of Education &bull; AICTE
                </p>
                <div className="text-[10px] text-amber-300 font-mono font-bold uppercase bg-white/10 px-2 py-0.5 rounded-full">
                  Direct Government Impact
                </div>
              </div>

              {/* Orbiting Satellite Dots */}
              <div className="absolute top-2 right-12 w-4 h-4 rounded-full bg-orange-400 shadow-md animate-ping" />
              <div className="absolute bottom-8 left-8 w-3 h-3 rounded-full bg-emerald-400 shadow-md" />
            </div>

            {/* Floating Glass Card 1: Non-stop Hackathon */}
            <div className="absolute -top-6 -left-4 sm:left-0 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xl max-w-[190px] animate-float">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                  36h
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Non-stop Code</div>
                  <div className="text-[10px] text-slate-500">Continuous Evaluation</div>
                </div>
              </div>
            </div>

            {/* Floating Glass Card 2: Ministries */}
            <div className="absolute -bottom-6 -right-2 sm:right-2 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xl max-w-[200px] animate-float-reverse">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  50+
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Union Ministries</div>
                  <div className="text-[10px] text-slate-500">Real Problem Owners</div>
                </div>
              </div>
            </div>

            {/* Floating Glass Card 3: Grant Money */}
            <div className="absolute top-1/2 -right-6 hidden sm:flex bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-lg items-center space-x-2.5 max-w-[180px]">
              <span className="text-base font-black text-amber-400 font-mono">₹1.5 Cr+</span>
              <span className="text-[10px] text-slate-300 leading-tight">Total Prize Money &amp; Grants</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}