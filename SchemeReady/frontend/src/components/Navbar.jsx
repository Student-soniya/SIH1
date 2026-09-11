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
  Layers,
  User,
  LogIn,
  LogOut,
  Lock
} from 'lucide-react';

export default function Navbar({ 
  lang, 
  setLang, 
  activeTab, 
  setActiveTab, 
  onLoadPersona, 
  readinessScore = 72,
  currentUser,
  onOpenAuth,
  onLogout,
  onBackToSih
}) {
  const t = translations[lang] || translations.en;

  const navItems = [
    { id: 'onboarding', label: t.tabs.onboarding, icon: Sparkles },
    { id: 'profile', label: t.profileTab, icon: User },
    { id: 'schemes', label: t.tabs.schemes, icon: Compass },
    { id: 'readiness', label: `${t.tabs.readiness} (${readinessScore}%)`, icon: CheckCircle2 },
    { id: 'businessPlan', label: t.tabs.businessPlan, icon: FileText },
    { id: 'checklist', label: t.tabs.checklist, icon: FolderCheck },
    { id: 'partners', label: t.tabs.partners, icon: Building2 },
    { id: 'emi', label: t.tabs.emi, icon: Calculator },
    { id: 'pack', label: t.tabs.applicationPack, icon: ShieldCheck, highlight: true },
    { id: 'admin', label: t.tabs.admin, icon: Layers }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2 font-medium">
            <span className="bg-emerald-500 text-slate-900 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
              SIH 2026 Innovation
            </span>
            <span>Government of India &amp; NSFDC Channel Finance System | PM-SURAJ Aligned</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-200 text-[11px]">● Clean Balance Sheet &amp; 0% Overdue Verified</span>
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
                <option value="ta" className="text-slate-900">தமிழ் (Tamil)</option>
                <option value="te" className="text-slate-900">తెలుగు (Telugu)</option>
                <option value="mr" className="text-slate-900">मराठी (Marathi)</option>
                <option value="bn" className="text-slate-900">বাংলা (Bengali)</option>
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
                SIH Edition
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right Action Cluster: User Auth & Demo Persona */}
        <div className="flex items-center space-x-2.5">
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px]">
                {currentUser.fullName.charAt(0)}
              </div>
              <span className="font-bold text-slate-800">{currentUser.fullName}</span>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-600 ml-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.loginBtn}</span>
            </button>
          )}

          <button
            onClick={onLoadPersona}
            className="flex items-center space-x-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-95"
            title="Auto-fill Ravi's persona (Bengaluru SC entrepreneur, Mobile repair shop, ₹1.8L cost)"
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">{t.demoPersonaBtn}</span>
            <span className="sm:hidden">Ravi Persona</span>
          </button>

          {onBackToSih && (
            <button
              onClick={onBackToSih}
              className="flex items-center space-x-1.5 text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Return to the Smart India Hackathon 2026 National Portal"
            >
              <span>🇮🇳 SIH 2026 Portal</span>
            </button>
          )}
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
