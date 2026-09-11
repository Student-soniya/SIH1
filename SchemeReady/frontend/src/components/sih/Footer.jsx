import React from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ExternalLink, 
  ShieldCheck,
  Heart
} from 'lucide-react';

export default function Footer({ onOpenLogin, onOpenRegister, onSwitchToSchemeReady }) {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 space-y-12">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand & Ministry Details (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-emerald-700 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-xs text-white">
                  SIH
                </div>
              </div>
              <div>
                <div className="text-white font-black text-base tracking-tight">
                  SMART INDIA HACKATHON 2026
                </div>
                <p className="text-[10px] text-slate-400">
                  Ministry of Education's Innovation Cell &amp; AICTE
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Smart India Hackathon is a nationwide initiative to provide students with a platform to solve some of the pressing problems we face in our daily lives, and thus inculcate a culture of product innovation and a mindset of problem-solving.
            </p>

            <div className="space-y-1 text-slate-400 text-[11px]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>AICTE Headquarters, Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>sih2026@aicte-india.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Helpline: +91 11 2958 1333 / 1338</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#home" className="hover:text-orange-400 transition-colors">Home Portal</a></li>
              <li><a href="#about" className="hover:text-orange-400 transition-colors">About SIH 2026</a></li>
              <li><a href="#themes" className="hover:text-orange-400 transition-colors">Innovation Themes</a></li>
              <li><a href="#problems" className="hover:text-orange-400 transition-colors">Problem Statements</a></li>
              <li><a href="#process" className="hover:text-orange-400 transition-colors">6-Phase Process</a></li>
              <li><a href="#events" className="hover:text-orange-400 transition-colors">Key Milestones</a></li>
            </ul>
          </div>

          {/* Column 3: Portals & Logins */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">User Portals</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={onOpenLogin} className="hover:text-orange-400 transition-colors cursor-pointer">Student Team Login</button></li>
              <li><button onClick={onOpenLogin} className="hover:text-orange-400 transition-colors cursor-pointer">College SPOC Login</button></li>
              <li><button onClick={onOpenLogin} className="hover:text-orange-400 transition-colors cursor-pointer">Ministry Evaluator Portal</button></li>
              <li><button onClick={onOpenRegister} className="hover:text-orange-400 transition-colors cursor-pointer">New Team Registration</button></li>
              <li>
                <button 
                  onClick={onSwitchToSchemeReady} 
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <span>SchemeReady AI Solution</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Guidelines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Guidelines &amp; Policy</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#faqs" className="hover:text-orange-400 transition-colors">Eligibility Rules</a></li>
              <li><a href="#faqs" className="hover:text-orange-400 transition-colors">Team Composition Mandate</a></li>
              <li><a href="#faqs" className="hover:text-orange-400 transition-colors">Internal Hackathon SOP</a></li>
              <li><a href="#faqs" className="hover:text-orange-400 transition-colors">IP Ownership Declaration</a></li>
              <li><a href="#faqs" className="hover:text-orange-400 transition-colors">Code of Conduct</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center sm:text-left">
          <div>
            &copy; 2026 <strong>Smart India Hackathon</strong>. Ministry of Education's Innovation Cell (MIC) &amp; AICTE, Government of India.
          </div>
          <div className="flex items-center space-x-4">
            <a href="#home" className="hover:underline">Privacy Policy</a>
            <span>&bull;</span>
            <a href="#home" className="hover:underline">Terms of Service</a>
            <span>&bull;</span>
            <a href="#home" className="hover:underline">Hyperlinking Policy</a>
            <span>&bull;</span>
            <span className="text-slate-400">Sovereign GovTech Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}