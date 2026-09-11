import React from 'react';
import { 
  Compass, 
  Target, 
  Lightbulb, 
  Wrench, 
  Send, 
  Trophy, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ProcessTimeline() {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: 'Browse 240+ verified challenges across Hardware and Software verticals submitted by Government Ministries.',
      icon: Compass
    },
    {
      num: '02',
      title: 'Choose a Problem',
      desc: 'Form a balanced team of 6 members (with at least 1 female teammate) and select your target challenge.',
      icon: Target
    },
    {
      num: '03',
      title: 'Develop Your Idea',
      desc: 'Formulate an innovative, feasible solution architecture with technical workflow, tech stack, and user impact.',
      icon: Lightbulb
    },
    {
      num: '04',
      title: 'Build Your Prototype',
      desc: 'Create minimum viable products (MVPs), circuit schematics, simulation models, and functional software demos.',
      icon: Wrench
    },
    {
      num: '05',
      title: 'Submit & Review',
      desc: 'College SPOC authenticates the nomination before formal submission to the national evaluation jury.',
      icon: Send
    },
    {
      num: '06',
      title: 'Present & Innovate',
      desc: 'Shortlisted teams compete in the 36-hour continuous Grand Finale for ₹1.5 Cr+ grants and national deployment.',
      icon: Trophy
    }
  ];

  return (
    <section id="process" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>The Innovation Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            How Smart India Hackathon Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            A structured 6-phase journey from ideation to sovereign public sector implementation.
          </p>
        </div>

        {/* Step-by-Step Horizontal Grid with Connecting Accent */}
        <div className="relative">
          {/* Connecting Line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 -translate-y-6 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx}
                  className="bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-orange-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Step Number & Icon Circle */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black font-mono text-orange-500 group-hover:scale-110 transition-transform">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:bg-orange-500 group-hover:text-white text-slate-700 flex items-center justify-center shadow-xs transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-normal leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 mt-4 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Phase 0{idx + 1}</span>
                    <span className="text-emerald-600 font-bold">&bull; Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}