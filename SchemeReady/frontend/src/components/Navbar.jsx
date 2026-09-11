import React from 'react';
import { translations } from '../translations';
import { 
  Sparkles, 
  Globe2, 
  UserCheck, 
  FileText, 
  Building2, 
  Calculator, 
  FolderCheck, 
  ShieldCheck, 
  CheckCircle2,
  Compass,
  Layers
} from 'lucide-react';

export default function Navbar({ lang, setLang, activeTab, setActiveTab, onLoadPersona, readinessScore = 72 }) {
  const t = translations[lang] || translations.en;

  const navItems = [
    { id: 'onboarding', label: t.tabs.onboarding, icon: Sparkles },
    { id: 'schemes', label: t.tabs.schemes, icon: Compass },
    { id: 'readiness', label: `${t.tabs.readiness} (${readinessScore}%)`, icon: CheckCircle2, badge: `${readinessScore}%` },
    { id: 'businessPlan', label: t.tabs.businessPlan, icon: FileText },
    { id: 'checklist', label: t.tabs.checklist, icon: FolderCheck },
    { id: 'partners', label: t.tabs.partners, icon: Building2 },
    { id: 'emi', label: t.tabs.emi, icon: Calculator },
    { id: 'pack', label: t.tabs.applicationPack, icon: ShieldCheck, highlight: true },
    { id: 'admin', label: t.tabs.admin, icon: Layers }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2 font-medium">
            <span className="bg-emerald-500 text-slate-900 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
              GovTech Hackathon MVP
            </span>
            <span>Government of India &amp; NSFDC Channel Partner Ecosystem | PM-SURAJ Aligned</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-200">● Data Verified: 10 September 2026</span>
            <div className="flex items-center space-x-1 border-l border-emerald-700 pl-3">
              <Globe2 className="w-3.5 h-3.5 text-emerald-300" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="en" className="text-slate-900">English (EN)</option>
                <option value="kn" className="text-slate-900">ಕನ್ನಡ (Kannada)</option>
                <option value="hi" className="text-slate-900">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('onboarding')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-bold text-xl">
            SR
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900">{t.appTitle}</h1>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                v2.6
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Demo Persona Action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onLoadPersona}
            className="flex items-center space-x-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-2 rounded-lg transition-all shadow-xs active:scale-95"
            title="Auto-fill Ravi's persona (Bengaluru SC entrepreneur, Mobile repair shop, ₹1.8L cost)"
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>{t.demoPersonaBtn}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                    : item.highlight
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-amber-700' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
