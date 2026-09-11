import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Sparkles, MapPin } from 'lucide-react';

export default function EventTimeline() {
  const events = [
    {
      date: 'July 15, 2026',
      name: 'Registration & Portal Launch',
      description: 'College SPOC registration and team onboarding opens across national portal.',
      status: 'Completed',
      statusType: 'completed'
    },
    {
      date: 'Aug 01 - Sep 30, 2026',
      name: 'Idea Submission Window',
      description: 'Teams draft technical architecture, methodology, and submit proposals for chosen PS.',
      status: 'Live & Active',
      statusType: 'active'
    },
    {
      date: 'October 15, 2026',
      name: 'Campus Internal Hackathons',
      description: 'Institutions host mandatory internal hackathons to shortlist top 30 nominated teams.',
      status: 'Upcoming',
      statusType: 'upcoming'
    },
    {
      date: 'November 10, 2026',
      name: 'National Jury Evaluation',
      description: 'Ministry evaluators review technical viability, novelty, and code prototypes.',
      status: 'Upcoming',
      statusType: 'upcoming'
    },
    {
      date: 'December 18-20, 2026',
      name: 'The Grand Finale (36h Non-stop)',
      description: 'Simultaneous 36-hour physical hackathon at 40+ national nodal centers with live judging.',
      status: 'Mega Event',
      statusType: 'finale'
    }
  ];

  return (
    <section id="events" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 border border-blue-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Important Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Key Dates &amp; Events Calendar
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Track your milestones to ensure compliance with national submission deadlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {events.map((evt, idx) => {
            const isActive = evt.statusType === 'active';
            const isCompleted = evt.statusType === 'completed';
            const isFinale = evt.statusType === 'finale';

            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  isActive 
                    ? 'bg-orange-50/50 border-orange-400 shadow-lg shadow-orange-500/10 ring-2 ring-orange-500/20' 
                    : isFinale
                    ? 'bg-slate-900 text-white border-slate-800 shadow-xl'
                    : isCompleted
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-orange-500 text-slate-950 animate-pulse' 
                        : isFinale 
                        ? 'bg-amber-400 text-slate-950 font-black' 
                        : isCompleted 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {evt.status}
                    </span>
                    <span className={`text-xs font-mono font-bold ${isFinale ? 'text-slate-400' : 'text-slate-400'}`}>
                      0{idx + 1}
                    </span>
                  </div>

                  <div className={`text-xs font-bold flex items-center space-x-1.5 ${isFinale ? 'text-amber-400' : isActive ? 'text-orange-600' : 'text-slate-500'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{evt.date}</span>
                  </div>

                  <h3 className={`text-sm font-bold leading-snug ${isFinale ? 'text-white' : 'text-slate-900'}`}>
                    {evt.name}
                  </h3>

                  <p className={`text-xs font-normal leading-relaxed ${isFinale ? 'text-slate-300' : 'text-slate-500'}`}>
                    {evt.description}
                  </p>
                </div>

                <div className={`pt-3 border-t text-[11px] font-medium flex items-center space-x-1 ${isFinale ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Sparkles className="w-3.5 h-3.5 text-orange-500" />}
                  <span>{isFinale ? 'National Finale' : isCompleted ? 'Closed' : 'Phase Window'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}