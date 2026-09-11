import React, { useState } from 'react';
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
  UserCircle2,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { SUPPORTED_LANGUAGES } from '../languageCatalog';

export default function Navbar({ 
  lang, 
  setLang, 
  activeTab, 
  setActiveTab, 
  onLoadPersona, 
  readinessScore = 72,
  onGoToHome
}) {
  const t = translations[lang] || translations.en;
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // R5.9 — the admin entry is present only for an Admin session, so a non-admin never sees a
  // control that would only ever be refused.
  // Reordered sequence: Sign In -> Beneficiary Profile -> Smart Onboarding -> Schemes -> as usual
  const navItems = [
    { id: 'profile', label: `1. ${t.profileTab}`, icon: User },
    { id: 'onboarding', label: `2. ${t.tabs.onboarding}`, icon: Sparkles },
    { id: 'schemes', label: `3. ${t.tabs.schemes}`, icon: Compass },
    { id: 'readiness', label: `4. ${t.tabs.readiness} (${readinessScore}%)`, icon: CheckCircle2 },
    { id: 'businessPlan', label: `5. ${t.tabs.businessPlan}`, icon: FileText },
    { id: 'checklist', label: `6. ${t.tabs.checklist}`, icon: FolderCheck },
    { id: 'partners', label: `7. ${t.tabs.partners}`, icon: Building2 },
    { id: 'emi', label: `8. ${t.tabs.emi}`, icon: Calculator },
    { id: 'pack', label: `9. ${t.tabs.applicationPack}`, icon: ShieldCheck, highlight: true },
    ...(isAdmin ? [{ id: 'admin', label: t.tabs.admin, icon: Layers }] : [])
  ];

  const handleLogout = async () => {
    await logout();
    try {
      localStorage.removeItem('schemeready_profile');
    } catch (e) {}
    setActiveTab('login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-100 font-semibold text-xs tracking-wide">{t.navbar?.topBannerTitle || "National Concessional Entrepreneurship & Credit Platform"}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-200 text-[11px]">{t.navbar?.cleanBalanceSheet || "● Clean Balance Sheet & 0% Overdue Verified"}</span>
            <div className="flex items-center space-x-1 border-l border-emerald-700 pl-3">
              <Globe2 className="w-3.5 h-3.5 text-emerald-300" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs min-h-[36px]"
                aria-label={t.navbar?.languageLabel || 'Select website language'}
              >
                {SUPPORTED_LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code} className="text-slate-900">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('profile')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-bold text-xl">
            SR
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900">{t.appTitle}</h1>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                {t.navbar?.citizenPortal || "Citizen Portal"}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Header Actions & Session Control */}
        <div className="flex items-center space-x-3 ml-auto">
          {onGoToHome && (
            <button
              onClick={onGoToHome}
              className="flex items-center space-x-1.5 text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Return to the SchemeReady National Concessional Portal Front Page"
            >
              <span>{t.navbar?.homePortal || "🏠 Home / Portal"}</span>
            </button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="hidden md:flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg">
                <UserCircle2 className="w-4 h-4 text-slate-500" />
                <span className="truncate max-w-[120px]">{user?.displayName}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg transition-all active:scale-95 cursor-pointer min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t.navbar?.signOut || "Sign out"}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              aria-label="Sign in to SchemeReady"
              className="flex items-center space-x-1.5 text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/30 ring-2 ring-amber-300/60 active:scale-95 cursor-pointer min-h-[44px]"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.navbar?.signIn || t.loginBtn || "Sign in"}</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="md:hidden flex items-center justify-center p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200 min-h-[44px] min-w-[44px] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-xl p-3 max-h-[75vh] overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 mb-1">
            {t.navbar?.topBannerTitle || "Application Navigation"}
          </div>
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center space-x-3 w-full px-3.5 py-3 rounded-xl text-xs font-bold text-left transition-all min-h-[44px] cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : item.highlight
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-amber-700' : 'text-slate-500'}`} />
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop / Tablet Horizontal Navigation Tabs */}
      <nav className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto no-scrollbar hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all min-h-[40px] cursor-pointer ${
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
