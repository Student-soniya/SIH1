import React from 'react';
import { ArrowRight, Sparkles, Rocket, Layers, ShieldCheck } from 'lucide-react';

export default function FinalCTA({ onOpenRegister, onExploreProblems }) {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-float" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
        {/* National Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>JOIN SMART INDIA HACKATHON 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Big Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Your Idea Could Be the <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
            Next Sovereign Breakthrough.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
          Turn real-world challenges into meaningful innovation. Collaborate with your college peers, build prototypes, and present directly to national leadership.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenRegister}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Register Now for SIH 2026</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>

          <a
            href="#problems"
            className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-200 transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Explore 240+ Challenges</span>
            <Layers className="w-5 h-5 text-amber-400" />
          </a>
        </div>

        {/* Trust markers */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <span>&bull; Ministry of Education Initiative</span>
          <span>&bull; Open to all College Students</span>
          <span>&bull; ₹1 Lakh Cash Award per PS</span>
          <span>&bull; Incubation Support</span>
        </div>
      </div>
    </section>
  );
}