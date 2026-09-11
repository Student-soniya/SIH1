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
import { SUPPORTED_LANGUAGES } from '../languageCatalog';

export default function EntrepreneurLanding({ 
  onStartOnboarding, 
  onExploreSchemes, 
  onLoadPersona, 
  onOpenAuth,
  onQuickFind,
  lang = 'en',
  setLang
}) {
  const isHindi = lang === 'hi';
  const isKannada = lang === 'kn';

  const localized = {
    channel: isHindi ? 'PM-SURAJ एवं NSFDC चैनल वित्त' : isKannada ? 'PM-SURAJ ಮತ್ತು NSFDC ಚಾನೆಲ್ ಹಣಕಾಸು' : 'PM-SURAJ & NSFDC CHANNEL FINANCE',
    ministries: isHindi ? 'सामाजिक न्याय और अधिकारिता मंत्रालय • एमएसएमई मंत्रालय' : isKannada ? 'ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಸಬಲೀಕರಣ ಸಚಿವಾಲಯ • MSME ಸಚಿವಾಲಯ' : 'Ministry of Social Justice & Empowerment • Ministry of MSME',
    govt: isHindi ? 'भारत सरकार' : isKannada ? 'ಭಾರತ ಸರ್ಕಾರ' : 'Government of India',
    demo: isHindi ? 'रवि प्रोफाइल लोड करें' : isKannada ? 'ರವಿ ಪ್ರೊಫೈಲ್ ಲೋಡ್ ಮಾಡಿ' : 'Load Ravi Persona',
    title: isHindi ? 'स्कीम रेडी' : isKannada ? 'ಸ್ಕೀಮ್ ರೆಡಿ' : 'SchemeReady',
    badge: isHindi ? 'उद्यम सारथी AI' : isKannada ? 'ಉದ್ಯಮ ಸಾರಥಿ AI' : 'Udyam Saarthi AI',
    subtitle: isHindi ? 'राष्ट्रीय रियायती उद्यमिता एवं ऋण पोर्टल' : isKannada ? 'ರಾಷ್ಟ್ರೀಯ ರಿಯಾಯಿತಿ ಉದ್ಯಮಶೀಲತೆ ಮತ್ತು ಸಾಲ ಪೋರ್ಟಲ್' : 'National Concessional Entrepreneurship & Credit Portal',
    schemes: isHindi ? 'योजना निर्देशिका' : isKannada ? 'ಯೋಜನೆಗಳ ಪಟ್ಟಿ' : 'Schemes Directory',
    process: isHindi ? 'यह कैसे काम करता है' : isKannada ? 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ' : 'How It Works',
    viability: isHindi ? 'एआई व्यवहार्यता इंजन' : isKannada ? 'AI ಕಾರ್ಯಸಾಧ್ಯತೆ ಎಂಜಿನ್' : 'AI Viability Engine',
    partners: isHindi ? 'चैनल पार्टनर्स' : isKannada ? 'ಚಾನಲ್ ಪಾಲುದಾರರು' : 'Channel Partners',
    faqs: isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : isKannada ? 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು' : 'FAQs',
    start: isHindi ? 'आवेदन शुरू करें' : isKannada ? 'ಅರ್ಜಿ ಪ್ರಾರಂಭಿಸಿ' : 'Start Application',
    signIn: isHindi ? 'साइन इन' : isKannada ? 'ಸೈನ್ ಇನ್' : 'Sign In',
    income: isHindi ? 'वार्षिक पारिवारिक आय सीमा' : isKannada ? 'ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ ಮಿತಿ' : 'Annual Family Income Ceiling',
    rates: isHindi ? 'रियायती ब्याज दरें' : isKannada ? 'ರಿಯಾಯಿತಿ ಬಡ್ಡಿ ದರಗಳು' : 'Subsidized Concessional Rates',
    financed: isHindi ? 'सरकार द्वारा वित्तपोषित परियोजना लागत' : isKannada ? 'ಸರ್ಕಾರಿ ಹಣಕಾಸು ಪಡೆದ ಯೋಜನಾ ವೆಚ್ಚ' : 'Project Cost Financed by Govt',
    partnerCount: isHindi ? 'राज्य SCA एवं बैंक शाखाएँ' : isKannada ? 'ರಾಜ್ಯ SCA ಮತ್ತು ಬ್ಯಾಂಕ್ ಶಾಖೆಗಳು' : 'State SCAs & Bank Branches'
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="bg-slate-950 text-slate-300 text-[11px] py-1.5 px-4 border-b border-white/10 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3 font-medium">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /><span>{localized.channel}</span></span><span className="text-slate-500">|</span><span className="hidden sm:inline">{localized.ministries}</span><span className="text-slate-400 font-mono text-[10px] hidden md:inline">{localized.govt}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onLoadPersona} className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/80 px-2.5 py-0.5 rounded border border-amber-500/40 transition-all cursor-pointer" title="Load demo entrepreneur persona"><UserCheck className="w-3 h-3 text-amber-400" /><span>{localized.demo}</span></button>
            <div className="flex items-center space-x-1 text-slate-400 border-l border-slate-700 pl-3"><Globe2 className="w-3 h-3 text-slate-400" /><select value={lang} onChange={(e) => setLang && setLang(e.target.value)} className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer text-[11px]" aria-label="Select website language">{SUPPORTED_LANGUAGES.map(({ code, label }) => <option key={code} value={code} className="text-slate-900">{label}</option>)}</select></div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-500/20">SR</div><div><div className="flex items-center space-x-2"><span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">{localized.title}</span><span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded">{localized.badge}</span></div><p className="text-[10px] text-slate-500 font-medium tracking-wide">{localized.subtitle}</p></div></div>
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-slate-600"><a href="#schemes" className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors">{localized.schemes}</a><a href="#process" className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors">{localized.process}</a><a href="#viability" className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors">{localized.viability}</a><a href="#partners" className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors">{localized.partners}</a><a href="#faqs" className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-slate-100 transition-colors">{localized.faqs}</a></nav>
          <div className="flex items-center space-x-3"><button onClick={onStartOnboarding} className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"><Sparkles className="w-3.5 h-3.5 text-amber-300" /><span>{localized.start}</span></button><button onClick={onOpenAuth} className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 transition-all cursor-pointer"><Lock className="w-3.5 h-3.5 text-slate-600" /><span>{localized.signIn}</span></button></div>
        </div>
      </header>

      <LandingHero onStartOnboarding={onStartOnboarding} onExploreSchemes={onExploreSchemes} onQuickFind={onQuickFind} lang={appLanguage === 'en' || appLanguage === 'hi' || appLanguage === 'kn' ? appLanguage : 'en'} />

      <section className="relative -mt-8 z-30 max-w-7xl mx-auto px-4 sm:px-6"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-4"><div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><Coins className="w-6 h-6" /></div><div><div className="text-2xl font-black text-slate-900 font-mono">₹5.00 {isHindi ? 'लाख' : 'Lakhs'}</div><p className="text-xs text-slate-500 font-medium">{localized.income}</p></div></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-4"><div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0"><Calculator className="w-6 h-6" /></div><div><div className="text-2xl font-black text-slate-900 font-mono">4.0% - 8.0%</div><p className="text-xs text-slate-500 font-medium">{localized.rates}</p></div></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-4"><div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0"><CheckCircle2 className="w-6 h-6" /></div><div><div className="text-2xl font-black text-slate-900 font-mono">{isHindi ? '90% तक' : 'Up to 90%'}</div><p className="text-xs text-slate-500 font-medium">{localized.financed}</p></div></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-4"><div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0"><Building2 className="w-6 h-6" /></div><div><div className="text-2xl font-black text-slate-900 font-mono">100+ {isHindi ? 'पार्टनर्स' : isKannada ? 'ಪಾಲುದಾರರು' : 'Partners'}</div><p className="text-xs text-slate-500 font-medium">{localized.partnerCount}</p></div></div>
      </div></section>

      <ProblemSolutionSection onStartOnboarding={onStartOnboarding} />
      <div id="schemes"><SchemesShowcase onSelectScheme={(scheme) => { if (onExploreSchemes) onExploreSchemes(scheme); else onStartOnboarding(); }} /></div>
      <div id="viability"><AiViabilityPreview onTestIdea={onStartOnboarding} /></div>
      <div id="process"><ProcessWalkthrough onStartOnboarding={onStartOnboarding} /></div>
      <ChannelPartnersMap onSelectPartner={() => onStartOnboarding()} />
      <SuccessStories />
      <LandingFaq />
      <LandingFooter onStartOnboarding={onStartOnboarding} onExploreSchemes={onExploreSchemes} />
    </div>
  );
}
