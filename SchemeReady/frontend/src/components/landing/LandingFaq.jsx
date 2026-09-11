import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function LandingFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Who is eligible for NSFDC and Government concessional entrepreneurship schemes?',
      a: 'Any Indian citizen belonging to Scheduled Castes (SC), Other Backward Classes (OBC), de-notified tribes, or Safai Karamchari families with total annual household income up to ₹5.00 Lakhs is eligible for concessional financial assistance.'
    },
    {
      q: 'Why does NSFDC reject direct applications on its central corporate website?',
      a: 'By national statutory design, NSFDC operates as an apex refinancing corporation rather than a retail branch bank. All funds are disbursed through a Channel Finance System comprising over 100 Channel Partners (State Channelizing Agencies - SCAs, RRBs, and Public Sector Banks). SchemeReady pre-qualifies you and routes your dossier directly to the active Channel Partner in your district.'
    },
    {
      q: 'Do I need collateral security or a third-party guarantor for my loan?',
      a: 'For micro loans under ₹1.50 Lakhs (Micro Credit Scheme and Mahila Samriddhi Yojana), no collateral security or third-party guarantee is required. For larger term loans up to ₹50 Lakhs, assets created out of the loan serve as primary hypothecation, backed by CGTMSE credit guarantee coverage.'
    },
    {
      q: 'How does DigiLocker integration prevent bank counter rejections?',
      a: 'Bank credit officers routinely reject applications due to suspected unverified photocopies or missing Tahsildar caste/income endorsements. SchemeReady connects directly to DigiLocker to fetch digitally signed certificates featuring official government QR verification and watermarks, establishing 100% data authenticity.'
    },
    {
      q: 'What are the interest rates and moratorium gestation periods?',
      a: 'Concessional rates are heavily subsidized: 4.0% p.a. for Mahila Samriddhi Yojana (women exclusive), 5.0% p.a. for Micro Credit, and 6.0%–8.0% p.a. for Term Loans. Beneficiaries receive a 3 to 12-month moratorium buffer during which no principal repayment is required while setting up the enterprise.'
    },
    {
      q: 'What if my caste certificate is pending at the Tahsildar revenue office?',
      a: 'SchemeReady flags pending certificates on your dynamic checklist, provides a state-specific tracking portal link, and allows uploading an interim revenue application acknowledgment slip so preliminary project appraisal can begin without delay.'
    },
    {
      q: 'How does the AI Business Survival & Viability score work?',
      a: 'Our machine learning model analyzes your project cost, working capital, and expected daily revenue against historical benchmark data of 10,000+ MSME enterprises. It validates that your Debt Service Coverage Ratio (DSCR) exceeds 1.50 and recommends high-margin tools so your business does not struggle with debt.'
    }
  ];

  return (
    <section id="faqs" className="py-20 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Beneficiary Assistance FAQs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 font-normal">
            Everything you need to know about eligibility, interest subsidies, Channel Partners, and document verification.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span className="flex items-center space-x-3">
                    <span className="font-mono text-xs text-emerald-600 font-black">0{idx + 1}.</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 animate-in fade-in duration-200">
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 font-normal">
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
