import React, { useState } from 'react';
import { 
  Globe2, 
  Phone, 
  ShieldCheck, 
  ArrowLeft, 
  Eye, 
  SunMedium, 
  Type, 
  ExternalLink 
} from 'lucide-react';

export default function GovUtilityHeader({ 
  lang = 'en', 
  setLang, 
  onBackToPortal,
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast
}) {
  return (
    <header className="w-full bg-[#0D2A4A] text-slate-200 border-b border-white/10 relative z-50">
      {/* Top Tricolor Accent Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Official Government of India Endorsement */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold tracking-wide text-white text-[11px] sm:text-xs">
              GOVERNMENT OF INDIA
            </span>
          </div>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-300 font-medium hidden md:inline text-[11px]">
            Ministry of Social Justice &amp; Empowerment &bull; Ministry of MSME
          </span>
          <span className="text-amber-400 font-mono text-[10px] hidden lg:inline bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
            PM-SURAJ &amp; NSFDC Sovereign Portal
          </span>
        </div>

        {/* Right: Accessibility Controls, Helpline & Language */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* National Helpline */}
          <div className="hidden sm:flex items-center space-x-1.5 text-slate-300 text-[11px]">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Toll-Free Helpline:</span>
            <span className="font-mono font-bold text-white tracking-wide">1800-11-2026</span>
          </div>

          {/* Accessibility Font Size Buttons */}
          <div className="flex items-center space-x-1 bg-slate-900/80 px-2 py-1 rounded-lg border border-white/10 text-[10px] font-bold">
            <button
              onClick={() => setFontSize && setFontSize('sm')}
              className={`px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors ${fontSize === 'sm' ? 'text-amber-400 font-black' : 'text-slate-400'}`}
              title="Standard Font Size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize && setFontSize('md')}
              className={`px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors ${fontSize === 'md' ? 'text-amber-400 font-black' : 'text-slate-400'}`}
              title="Medium Font Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize && setFontSize('lg')}
              className={`px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors ${fontSize === 'lg' ? 'text-amber-400 font-black' : 'text-slate-400'}`}
              title="Large Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast && setHighContrast(!highContrast)}
            className={`p-1.5 rounded-lg border text-[11px] transition-colors flex items-center space-x-1 ${
              highContrast 
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold' 
                : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
            title="Toggle High Contrast Mode"
            aria-label="Toggle High Contrast Mode"
          >
            <SunMedium className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[10px]">Contrast</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 border-l border-slate-700 pl-3">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={lang}
              onChange={(e) => setLang && setLang(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-[11px]"
              aria-label="Select Portal Language"
            >
              <option value="en" className="text-slate-900">English</option>
              <option value="hi" className="text-slate-900">हिन्दी (Hindi)</option>
              <option value="kn" className="text-slate-900">ಕನ್ನಡ (Kannada)</option>
              <option value="ta" className="text-slate-900">தமிழ் (Tamil)</option>
              <option value="te" className="text-slate-900">తెలుగు (Telugu)</option>
              <option value="mr" className="text-slate-900">मराठी (Marathi)</option>
              <option value="bn" className="text-slate-900">বাংলা (Bengali)</option>
            </select>
          </div>

          {/* Back to Portal button */}
          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              className="inline-flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-white/15 transition-all cursor-pointer"
              title="Return to the Main Portal Homepage"
            >
              <ArrowLeft className="w-3 h-3 text-amber-400" />
              <span>Portal Home</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
