import { localizeTernary } from '../../l10n';
import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function LandingFaq({ lang = 'en' }) {
  const isHindi = lang === 'hi';
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = (lang === 'hi' || lang === 'mr') ? [
    {
      q: 'एनएसएफडीसी और सरकारी रियायती उद्यमिता योजनाओं के लिए कौन पात्र है?',
      a: 'अनुसूचित जाति (SC), अन्य पिछड़ा वर्ग (OBC), विमुक्त जनजातियों या सफाई कर्मचारी परिवारों से संबंधित कोई भी भारतीय नागरिक, जिनकी कुल वार्षिक पारिवारिक आय ₹5.00 लाख तक है, वे रियायती वित्तीय सहायता के पात्र हैं।'
    },
    {
      q: 'एनएसएफडीसी अपनी केंद्रीय वेबसाइट पर सीधे आवेदनों को क्यों खारिज करता है?',
      a: 'राष्ट्रीय वैधानिक व्यवस्था के तहत, एनएसएफडीसी एक खुदरा बैंक के बजाय एक शीर्ष पुनर्वित्त निगम के रूप में कार्य करता है। सभी ऋण 100 से अधिक चैनल पार्टनर्स (राज्य एससीए, क्षेत्रीय ग्रामीण बैंक और सरकारी बैंक) के चैनल वित्त तंत्र के माध्यम से वितरित किए जाते हैं। स्कीम रेडी आपको पूर्व-योग्य बनाता है और आपके डोजियर को सीधे आपके जिले के सक्रिय चैनल पार्टनर तक पहुंचाता है।'
    },
    {
      q: 'क्या मुझे अपने ऋण के लिए संपार्श्विक (गारंटी) या तीसरे पक्ष के गारंटर की आवश्यकता है?',
      a: '₹1.50 लाख से कम के सूक्ष्म ऋणों (माइक्रो क्रेडिट योजना और महिला समृद्धि योजना) के लिए किसी संपार्श्विक सुरक्षा या तीसरे पक्ष की गारंटी की आवश्यकता नहीं होती है। ₹50 लाख तक के बड़े मियादी ऋणों के लिए ऋण से खरीदी गई संपत्तियां प्राथमिक बंधक के रूप में कार्य करती हैं, जिसे सीजीटीएमएसई क्रेडिट गारंटी का समर्थन प्राप्त होता है।'
    },
    {
      q: 'डिजिलॉकर एकीकरण बैंक काउंटर पर होने वाली अस्वीकृति को कैसे रोकता है?',
      a: 'बैंक ऋण अधिकारी संदिग्ध या असत्यापित फोटोकॉपी के कारण आवेदनों को अस्वीकार कर देते हैं। स्कीम रेडी सरकारी क्यूआर सत्यापन और वॉटरमार्क वाले डिजिटल रूप से हस्ताक्षरित प्रमाण पत्र प्राप्त करने के लिए सीधे डिजिलॉकर से जुड़ता है, जिससे 100% प्रामाणिकता सिद्ध होती है।'
    },
    {
      q: 'ब्याज दरें और अधिस्थगन (मोरेटोरियम) अवधि क्या हैं?',
      a: 'रियायती दरें अत्यधिक सब्सिडीयुक्त हैं: महिला समृद्धि योजना (केवल महिलाओं के लिए) हेतु 4.0% वार्षिक, माइक्रो क्रेडिट हेतु 5.0% वार्षिक, और मियादी ऋण हेतु 6.0%–8.0% वार्षिक। लाभार्थियों को 3 से 12 महीने का अधिस्थगन बफर मिलता है जिसके दौरान दुकान स्थापित करते समय कोई मूलधन नहीं चुकाना पड़ता।'
    },
    {
      q: 'यदि मेरा जाति प्रमाण पत्र तहसीलदार कार्यालय में लंबित है तो क्या होगा?',
      a: 'स्कीम रेडी आपकी गतिशील चेकलिस्ट पर लंबित प्रमाण पत्रों को चिह्नित करता है, राज्य-विशिष्ट ट्रैकिंग पोर्टल लिंक प्रदान करता है, और एक अंतरिम राजस्व पावती पर्ची अपलोड करने की अनुमति देता है ताकि प्रारंभिक मूल्यांकन बिना देरी के शुरू हो सके।'
    },
    {
      q: 'एआई व्यवसाय उत्तरजीविता और व्यवहार्यता स्कोर कैसे काम करता है?',
      a: 'हमारा मशीन लर्निंग मॉडल 10,000+ एमएसएमई उद्यमों के ऐतिहासिक डेटा के आधार पर आपकी परियोजना लागत, कार्यशील पूंजी और अपेक्षित दैनिक आय का विश्लेषण करता है। यह पुष्टि करता है कि आपका ऋण सेवा कवरेज अनुपात (DSCR) 1.50 से अधिक है और उच्च-मार्जिन उपकरणों की सिफारिश करता है ताकि व्यवसाय ऋण के बोझ में न फंसे।'
    }
  ] : [
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
            <span>{localizeTernary('लाभार्थी सहायता संबंधी अक्सर पूछे जाने वाले प्रश्न', 'Beneficiary Assistance FAQs', lang)}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {localizeTernary('अक्सर पूछे जाने वाले प्रश्न', 'Frequently Asked Questions', lang)}
          </h2>
          <p className="text-sm text-slate-600 font-normal">
            {localizeTernary('पात्रता, ब्याज सब्सिडी, चैनल पार्टनर्स और दस्तावेज सत्यापन के बारे में आवश्यक सभी जानकारी।', 'Everything you need to know about eligibility, interest subsidies, Channel Partners, and document verification.', lang)}
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
