import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  Layers, 
  Globe2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function SihNavbar({ 
  onOpenLogin, 
  onOpenRegister, 
  onSwitchToSchemeReady,
  activeSection = 'home'
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Themes', href: '#themes' },
    { label: 'Problem Statements', href: '#problems', badge: '240 LIVE' },
    { label: 'Process', href: '#process' },
    { label: 'Why Participate', href: '#benefits' },
    { label: 'Impact', href: '#impact' },
    { label: 'Events', href: '#events' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Topmost Government Strip */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-1 px-4 border-b border-white/10 z-50 relative">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3 font-medium">
            <span className="flex items-center space-x-1.5 text-amber-400 font-bold">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>SIH 2026 EDITION</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="hidden sm:inline">Ministry of Education's Innovation Cell (MIC) &amp; AICTE</span>
            <span className="text-slate-400 font-mono text-[10px] hidden md:inline">Government of India</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onSwitchToSchemeReady}
              className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/80 px-2.5 py-0.5 rounded border border-emerald-500/30 transition-all cursor-pointer"
              title="Open the SchemeReady Beneficiary Loan Assistant App"
            >
              <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>Launch SchemeReady AI (SIH Solution)</span>
            </button>
            <div className="flex items-center space-x-1 text-slate-400 border-l border-slate-700 pl-3">
              <Globe2 className="w-3 h-3 text-slate-400" />
              <span>English / हिन्दी</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-md py-3 shadow-xl shadow-slate-950/20 border-b border-slate-800' : 'bg-slate-900/80 backdrop-blur-sm py-4 border-b border-slate-800/60'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand & Logos Cluster */}
          <a href="#home" className="flex items-center space-x-3 group text-left">
            {/* National Emblem badge */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-emerald-700 p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-xs text-white">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-extrabold tracking-tighter">
                  SIH
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-white font-black text-lg tracking-tight leading-none">
                  SMART INDIA
                </span>
                <span className="text-orange-500 font-black text-lg tracking-tight leading-none">
                  HACKATHON
                </span>
                <span className="bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wider">
                  2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                World's Largest Open Innovation Initiative
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center space-x-1"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenLogin}
              className="relative inline-flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-950" />
              <span className="tracking-wide">LOGIN</span>
            </button>

            <button
              onClick={onOpenRegister}
              className="hidden sm:inline-flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-white/15 transition-all duration-200 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-orange-400" />
              <span>REGISTER</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 rounded">
                      {link.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                className="flex-1 bg-orange-500 text-slate-950 font-black text-xs py-2.5 rounded-xl text-center"
              >
                LOGIN
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}
                className="flex-1 bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl border border-white/10 text-center"
              >
                REGISTER
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}