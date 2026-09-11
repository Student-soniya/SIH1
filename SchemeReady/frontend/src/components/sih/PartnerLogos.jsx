import React from 'react';
import { Building2, ShieldCheck, Sparkles } from 'lucide-react';

export default function PartnerLogos() {
  const partners = [
    { name: 'Ministry of Education', role: 'Apex Organiser', tag: 'MIC' },
    { name: 'AICTE', role: 'Statutory Body', tag: 'Govt. of India' },
    { name: 'MyGov India', role: 'Citizen Engagement', tag: 'MeitY' },
    { name: 'Startup India', role: 'Incubation Partner', tag: 'DPIIT' },
    { name: 'ISRO', role: 'Problem Owner', tag: 'Space Tech' },
    { name: 'DRDO', role: 'Problem Owner', tag: 'Defense R&D' },
    { name: 'Amazon Web Services', role: 'Cloud Infrastructure', tag: 'AWS Cloud' },
    { name: 'Microsoft India', role: 'AI & Developer Tools', tag: 'Azure' },
    { name: 'Intel Technology', role: 'Edge & Hardware Labs', tag: 'AI Silicon' },
    { name: 'Cisco Networking', role: 'Security & IoT Partner', tag: 'Networking' }
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-1.5">
          <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">
            Collaborative Ecosystem
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Supported by Union Ministries &amp; Technology Leaders
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className="p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/70 hover:border-orange-300 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-200/70 group-hover:bg-orange-100 text-slate-600 group-hover:text-orange-600 flex items-center justify-center font-bold text-sm mb-2 transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                {p.name}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                {p.role}
              </div>
              <span className="text-[9px] font-mono text-orange-600 font-bold mt-2 bg-orange-50 px-2 py-0.5 rounded">
                {p.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}