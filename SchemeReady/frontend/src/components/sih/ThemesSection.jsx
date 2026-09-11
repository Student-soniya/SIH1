import React from 'react';
import { 
  Cpu, 
  Bot, 
  HeartPulse, 
  Sprout, 
  Coins, 
  ShieldCheck, 
  Truck, 
  Car, 
  Leaf, 
  Crosshair, 
  GraduationCap, 
  Plane, 
  Link2, 
  AlertTriangle, 
  Recycle, 
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function ThemesSection({ onSelectTheme }) {
  const themes = [
    {
      id: 'ai-ml',
      name: 'AI / ML & Cognitive Systems',
      description: 'Generative AI, computer vision, multilingual NLP, and predictive sovereign analytics.',
      psCount: 28,
      icon: Bot,
      color: 'from-blue-500 to-indigo-600',
      badge: 'HIGH DEMAND'
    },
    {
      id: 'smart-automation',
      name: 'Smart Automation & Industry 4.0',
      description: 'Industrial IoT, smart manufacturing, telemetry, and automated quality control.',
      psCount: 22,
      icon: Cpu,
      color: 'from-orange-500 to-amber-600'
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Biomedical Tech',
      description: 'Telemedicine, non-invasive diagnostic tools, patient triage, and affordable medtech devices.',
      psCount: 24,
      icon: HeartPulse,
      color: 'from-rose-500 to-red-600',
      badge: 'TOP PRIORITY'
    },
    {
      id: 'agriculture',
      name: 'Agriculture, FoodTech & Rural Tech',
      description: 'Precision farming, smart irrigation, soil sensor networks, and post-harvest supply chain.',
      psCount: 20,
      icon: Sprout,
      color: 'from-emerald-500 to-green-600'
    },
    {
      id: 'fintech',
      name: 'FinTech & Inclusive Banking',
      description: 'Channel finance routing, UPI micro-credit, fraud mitigation, and credit scoring systems.',
      psCount: 16,
      icon: Coins,
      color: 'from-amber-500 to-yellow-600'
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity & Defense Tech',
      description: 'Threat detection, critical infrastructure shielding, zero-trust architectures, and data defense.',
      psCount: 18,
      icon: ShieldCheck,
      color: 'from-slate-700 to-slate-900',
      badge: 'CRITICAL'
    },
    {
      id: 'transportation',
      name: 'Transportation & Logistics',
      description: 'Smart freight tracking, route optimization, port logistics, and intelligent traffic control.',
      psCount: 15,
      icon: Truck,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'smart-vehicles',
      name: 'Smart Vehicles & EV Mobility',
      description: 'Battery management systems, EV charging grid intelligence, and autonomous navigation.',
      psCount: 14,
      icon: Car,
      color: 'from-teal-500 to-emerald-600'
    },
    {
      id: 'clean-green',
      name: 'Clean & Green Technology',
      description: 'Solar microgrids, air quality monitors, water purification, and carbon capture solutions.',
      psCount: 19,
      icon: Leaf,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'robotics-drones',
      name: 'Robotics & UAV Drones',
      description: 'Autonomous survey drones, disaster rescue robots, pipeline inspection, and assistive robotics.',
      psCount: 17,
      icon: Crosshair,
      color: 'from-violet-500 to-purple-600'
    },
    {
      id: 'education',
      name: 'Education & EdTech Solutions',
      description: 'Gamified regional pedagogy, skill training simulators, and accessible learning for rural schools.',
      psCount: 16,
      icon: GraduationCap,
      color: 'from-indigo-500 to-blue-600'
    },
    {
      id: 'travel-tourism',
      name: 'Travel & Heritage Tourism',
      description: 'AR/VR temple heritage guides, pilgrim crowd management, and eco-tourism promotion.',
      psCount: 12,
      icon: Plane,
      color: 'from-sky-500 to-indigo-500'
    },
    {
      id: 'blockchain',
      name: 'Blockchain & Web3 Governance',
      description: 'Land record transparency, tamper-proof academic credentials, and subsidy tracking.',
      psCount: 11,
      icon: Link2,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'disaster-management',
      name: 'Disaster Management & Safety',
      description: 'Early flood warning telemetry, landslide detection, and emergency rescue dispatch networks.',
      psCount: 14,
      icon: AlertTriangle,
      color: 'from-red-500 to-rose-600'
    },
    {
      id: 'sustainability',
      name: 'Sustainability & Circular Economy',
      description: 'E-waste segregation robotics, industrial water recycling, and biodegradable packaging.',
      psCount: 13,
      icon: Recycle,
      color: 'from-emerald-600 to-teal-700'
    },
    {
      id: 'emerging-tech',
      name: 'Emerging & Quantum Technologies',
      description: 'Quantum cryptography, edge computing fabrics, and next-generation wireless communications.',
      psCount: 10,
      icon: Sparkles,
      color: 'from-fuchsia-500 to-purple-600'
    }
  ];

  return (
    <section id="themes" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full">
              <span>National Innovation Verticals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Explore Innovation Themes
            </h2>
            <p className="text-sm text-slate-600">
              17 Hardware and 17 Software themes curated by government ministries and industry leaders to guide your project development.
            </p>
          </div>

          <a
            href="#problems"
            className="inline-flex items-center space-x-2 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2.5 rounded-xl border border-orange-200 transition-all self-start md:self-auto"
          >
            <span>View All 240+ Problem Statements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 16 Modern Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <div
                key={theme.id}
                onClick={() => onSelectTheme ? onSelectTheme(theme.name) : null}
                className="group relative p-6 bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-orange-400 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${theme.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {theme.badge ? (
                      <span className="text-[9px] font-black tracking-wider text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full">
                        {theme.badge}
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        {theme.psCount} Challenges
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2 leading-snug">
                    {theme.name}
                  </h3>

                  <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2 mb-4">
                    {theme.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-orange-600">
                  <span>Explore Problems</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}