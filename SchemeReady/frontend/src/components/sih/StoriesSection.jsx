import React from 'react';
import { Sparkles, ArrowRight, Award, ExternalLink, TrendingUp, Users } from 'lucide-react';

export default function StoriesSection({ onOpenSchemeReady }) {
  const stories = [
    {
      title: 'SchemeReady (Udyam Saarthi AI)',
      theme: 'FinTech & Social Empowerment',
      organization: 'Ministry of Social Justice & Empowerment',
      desc: 'Transforms raw citizen voice input into bank-ready loan dossiers under NSFDC guidelines, routing applications to 100+ performing channel partners with 0% overdue.',
      impact: '100% Paperwork Automation & Real-time DSCR Viability Evaluation',
      image: '/images/slide1_summit.jpg',
      badge: 'SIH 2026 FEATURED PROTOTYPE',
      isHero: true
    },
    {
      title: 'AgroDrona Multispectral Sprayer',
      theme: 'Agriculture & Drone Robotics',
      organization: 'Ministry of Agriculture',
      desc: 'Student innovators developed autonomous agricultural hexacopter with multispectral weed identification, now deployed across 45 Krishi Vigyan Kendras.',
      impact: '70% Pesticide Reduction & ₹80 Lakh Seed Grant Secured',
      image: '/images/slide2_students.webp',
      badge: 'DEPLOYED COMMERCIAL PRODUCT'
    },
    {
      title: 'VandeTrack Rail Hot-Box Acoustic Profiler',
      theme: 'Transportation & Edge IoT',
      organization: 'Ministry of Railways',
      desc: 'Engineered high-speed trackside acoustic listening pods detecting microscopic wheel spalls at 160 km/h, preventing catastrophic train derailments.',
      impact: 'Operational on Delhi-Varanasi Vande Bharat Express Corridor',
      image: '/images/slide3_team.jpg',
      badge: 'NATIONAL RAIL ADOPTION'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real-World Conversions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Innovation Success Stories
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Discover how student solutions evolved from 36-hour hackathon prototypes into sovereign national deployments.
          </p>
        </div>

        {/* 3 Large Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-orange-300 transition-all duration-300 flex flex-col group"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <span className="absolute top-4 left-4 bg-orange-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                  {story.badge}
                </span>

                <span className="absolute bottom-3 left-4 text-white text-xs font-semibold">
                  {story.theme}
                </span>
              </div>

              {/* Story Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {story.organization}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {story.desc}
                  </p>
                </div>

                {/* Impact Highlight Box */}
                <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 font-medium">
                  <strong>Impact:</strong> {story.impact}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {story.isHero ? (
                    <button
                      onClick={onOpenSchemeReady}
                      className="inline-flex items-center space-x-1 text-xs font-black text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      <span>Launch Solution Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500">
                      <span>Case Study Published</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-slate-400">Verified SIH Deploy</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}