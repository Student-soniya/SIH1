import React from 'react';
import { 
  Target, 
  Cpu, 
  Briefcase, 
  Users, 
  GraduationCap, 
  HeartHandshake, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function WhyParticipateSection() {
  const benefits = [
    {
      title: 'Solve Real Problems',
      desc: 'Work on actual ground-truth bottlenecks supplied by Union Ministries, Defense organizations, and public sector undertakings.',
      icon: Target,
      tag: 'Real-world impact'
    },
    {
      title: 'Work With Advanced Tech',
      desc: 'Build hands-on solutions with Generative AI, Edge Computing, Computer Vision, Robotics, LoRaWAN, and Sovereign Cloud.',
      icon: Cpu,
      tag: 'Next-gen skills'
    },
    {
      title: 'Build a Winning Portfolio',
      desc: 'A verified SIH finalist certificate is recognized by top multinational companies, government incubators, and premier tech labs.',
      icon: Briefcase,
      tag: 'Career accelerator'
    },
    {
      title: 'Collaborate With Diverse Teams',
      desc: 'Form multidisciplinary teams combining software developers, hardware engineers, domain specialists, and designers.',
      icon: Users,
      tag: 'Interdisciplinary'
    },
    {
      title: 'Learn From Ministry Experts',
      desc: 'Receive direct technical mentorship from senior ministry directors, ISRO/DRDO scientists, and industry CTOs.',
      icon: GraduationCap,
      tag: 'Elite mentorship'
    },
    {
      title: 'Create Nationwide Social Impact',
      desc: 'See your code and hardware deployed across hundreds of government schools, public health centers, and rural panchayats.',
      icon: HeartHandshake,
      tag: 'Nation building'
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 border border-orange-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Opportunities &amp; Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Why Participate in SIH 2026?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Beyond the ₹1 Lakh cash prize per problem statement, SIH is the launchpad for your entrepreneurial future.
          </p>
        </div>

        {/* 6 Benefit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-orange-400 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {b.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {b.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Opportunity</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}