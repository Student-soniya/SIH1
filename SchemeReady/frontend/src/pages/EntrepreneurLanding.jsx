import React, { useState } from 'react';
import LandingHero from '../components/landing/LandingHero';
import ProblemSolutionSection from '../components/landing/ProblemSolutionSection';
import SchemesShowcase from '../components/landing/SchemesShowcase';
import AiViabilityPreview from '../components/landing/AiViabilityPreview';
import ProcessWalkthrough from '../components/landing/ProcessWalkthrough';
import ChannelPartnersMap from '../components/landing/ChannelPartnersMap';
import SuccessStories from '../components/landing/SuccessStories';
import LandingFaq from '../components/landing/LandingFaq';
import LandingFooter from '../components/landing/LandingFooter';
import { 
  Sparkles, 
  Globe2, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  ArrowRight, 
  Phone,
  Coins,
  Building2,
  CheckCircle2,
  Calculator,
  Compass
} from 'lucide-react';

export default function EntrepreneurLanding({ 
  onStartOnboarding, 
  onExploreSchemes, 
  onLoadPersona, 
  onOpenAuth,
  onQuickFind,
  lang,
  setLang
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. National Official Top Banner */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-1.5 px-4 border-b border-white/10 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3 font-medium">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>PM-SURAJ &amp; NSFDC CHANNEL FINANCE</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="hidden sm:inline">Ministry of Social Justice &amp; Empowerment &bull; Ministry of MSME</span>
            <span className="text-slate-400 font-mono text-[10px] hidden md:inline">Government of India</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onLoadPersona}
              className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/80 px-2.5 py-0.5 rounded border border-amber-500/40 transition-all cursor-pointer"
              title="Auto-load Ravi Kumar demo persona (Bengaluru SC entrepreneur, Mobile repair shop, ₹1.8L cost)"
            >
              <UserCheck className="w-3 h-3 text-amber-400" />
              <span>Load Ravi Persona (₹1.8L Lab)</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center space-x-1 text-slate-400 border-l border-slate-700 pl-3">
              <Globe2 className="w-3 h-3 text-slate-400" />
              <select
                value={lang}
                onChange={(e) => setLang && setLang(e.target.value)}
                className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer text-[11px]"
              >
                <option value="en" className="text-slate-900">English</option>
                <option value="kn" className="text-slate-900">ಕನ್ನಡ (Kannada)</option>
                <option value="hi" className="text-slate-900">हिन्दी (Hindi)</option>
                <option value="ta" className="text-slate-900">தமிழ் (Tamil)</option>
                <option value="te" className="text-slate-900">తెలుగు (Telugu)</option>
                <option value="mr" className="text-slate-900">मराठी (Marathi)</option>
                <option value="bn" className="text-slate-900">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-500/20">
              SR
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">SchemeReady</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded">
                  Udyam Saarthi AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                National Concessional Entrepreneurship &amp; Credit Portal
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-slate-600">
            <a href="#schemes" className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors">
              Schemes Directory
            </a>
            <a href="#process" className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors">
              How It Works
            </a>
            <a href="#viability" className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors">
              AI Viability Engine
            </a>
            <a href="#partners" className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors">
              Channel Partners
            </a>
            <a href="#faqs" className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors">
              FAQs
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onStartOnboarding}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Start Application</span>
            </button>

            <button
              onClick={onOpenAuth}
              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>Sign In</span>
            </button>
          </div>

        </div>
      </header>

      {/* 3. Hero Carousel with Quick Eligibility Finder */}
      <LandingHero 
        onStartOnboarding={onStartOnboarding}
        onExploreSchemes={onExploreSchemes}
        onQuickFind={onQuickFind}
      />

      {/* 4. Four Key National Statistics Bar */}
      <section className="relative -mt-8 z-30 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">₹5.00 Lakhs</div>
              <p className="text-xs text-slate-500 font-medium">Annual Family Income Ceiling</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">4.0% - 8.0%</div>
              <p className="text-xs text-slate-500 font-medium">Subsidized Concessional Rates</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">Up to 90%</div>
              <p className="text-xs text-slate-500 font-medium">Project Cost Financed by Govt</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">100+ Partners</div>
              <p className="text-xs text-slate-500 font-medium">State SCAs &amp; Bank Branches</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Problem & Solution Breakdown */}
      <ProblemSolutionSection onStartOnboarding={onStartOnboarding} />

      {/* 6. Flagship Entrepreneurship Schemes Showcase */}
      <SchemesShowcase onSelectScheme={(scheme) => {
        if (onExploreSchemes) onExploreSchemes(scheme);
        else onStartOnboarding();
      }} />

      {/* 7. AI Business Viability Simulator */}
      <div id="viability">
        <AiViabilityPreview onTestIdea={onStartOnboarding} />
      </div>

      {/* 8. 6-Step Journey from Chat to Loan */}
      <div id="process">
        <ProcessWalkthrough onStartOnboarding={onStartOnboarding} />
      </div>

      {/* 9. Channel Partners Map & Directory */}
      <ChannelPartnersMap onSelectPartner={(partner) => {
        onStartOnboarding();
      }} />

      {/* 10. Real Beneficiary Success Stories */}
      <SuccessStories />

      {/* 11. Frequently Asked Questions */}
      <LandingFaq />

      {/* 12. National Footer */}
      <LandingFooter 
        onStartOnboarding={onStartOnboarding}
        onExploreSchemes={onExploreSchemes}
      />

    </div>
  );
}
