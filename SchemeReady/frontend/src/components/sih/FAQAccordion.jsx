import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Who is eligible to participate in Smart India Hackathon 2026?',
      a: 'Regular students pursuing higher education degrees (B.Tech, B.E., M.Tech, MCA, B.Sc, BCA, M.Sc, MBA, Ph.D.) from any recognized Indian institution or university approved by AICTE, UGC, or State Boards are eligible.'
    },
    {
      q: 'What is the mandatory team composition rule?',
      a: 'Each team must strictly comprise exactly 6 student members from the same institution. To encourage female participation in STEM, every team must mandate at least ONE female team member.'
    },
    {
      q: 'What is the role of the College SPOC (Single Point of Contact)?',
      a: 'The Single Point of Contact (SPOC) is a designated faculty member responsible for hosting internal college hackathons, validating student identity, authenticating consent letters, and officially nominating shortlisted campus teams on the national portal.'
    },
    {
      q: 'What is the difference between Hardware and Software editions?',
      a: 'The Software edition focuses on digital architectures (AI/ML, mobile apps, web frameworks, algorithms), tested through a 36-hour coding sprint. The Hardware edition requires physical working prototypes (mechatronics, IoT circuits, robotics, sensors) evaluated over a 5-day continuous finale.'
    },
    {
      q: 'Who owns the Intellectual Property (IP) of the developed prototypes?',
      a: 'The student innovators and their mentor institution retain full ownership of the developed intellectual property. Government ministries receive non-exclusive royalty-free rights to pilot and deploy the solution for public welfare.'
    },
    {
      q: 'What are the prizes and grant opportunities for winning teams?',
      a: 'Each Problem Statement carries a cash award of ₹1,00,000 for the winning team. In addition, Ministry-vetted winning prototypes qualify for fast-track DST/AICTE seed grants of up to ₹10 Lakhs to incorporate DPIIT startups.'
    },
    {
      q: 'How does the evaluation process work?',
      a: 'Evaluation is conducted in three stages: (1) Internal campus hackathon screening, (2) Blind technical review by ministry evaluators and domain scientists, and (3) Continuous 36-hour physical live evaluation by jury members during the Grand Finale.'
    }
  ];

  return (
    <section id="faqs" className="py-20 bg-slate-50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 border border-orange-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-sm text-slate-600 font-normal">
            Find answers to common questions about guidelines, team eligibility, and competition procedures.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  <span className="flex items-center space-x-3">
                    <span className="font-mono text-xs text-orange-500 font-black">0{idx + 1}.</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-normal">
                      {faq.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}