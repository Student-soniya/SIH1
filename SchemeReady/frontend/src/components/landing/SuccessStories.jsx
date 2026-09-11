import { localizeTernary } from '../../l10n';
import React from 'react';
import { 
  Sparkles, 
  Quote, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  Briefcase 
} from 'lucide-react';

export default function SuccessStories({ lang = 'en' }) {
  const isHindi = lang === 'hi';

  const stories = isHindi ? [
    {
      name: 'रवि कुमार',
      role: 'संस्थापक, स्मार्टटेक माइक्रो रिपेयर लैब',
      location: 'बेंगलुरु, कर्नाटक',
      scheme: 'माइक्रो क्रेडिट योजना (MCS) - NSFDC',
      loanAmount: '₹1,50,000, 5.0% वार्षिक ब्याज पर',
      impact: 'मासिक शुद्ध लाभ: ₹42,000 | 0 चूक',
      quote: 'परियोजना दस्तावेज न होने के कारण बैंक ने दो बार मेरे आवेदन खारिज कर दिए थे। स्कीम रेडी ने 30 सेकंड में डिजिलॉकर से मेरे जाति प्रमाण पत्र का सत्यापन किया, एआई से विस्तृत परियोजना रिपोर्ट बनाई, और मुझे डॉ. बी.आर. अंबेडकर विकास निगम से जोड़ा। 18 दिनों के भीतर ऋण राशि मेरे खाते में आ गई।',
      badge: 'सूक्ष्म उद्यम',
      avatar: 'रवि'
    },
    {
      name: 'सविता देवी',
      role: 'मालिक, अनन्या हैंडलूम एवं गारमेंट्स',
      location: 'वाराणसी, उत्तर प्रदेश',
      scheme: 'महिला समृद्धि योजना (MSY)',
      loanAmount: '₹1,40,000, 4.0% वार्षिक ब्याज पर',
      impact: '4 स्थानीय महिलाओं को रोजगार | मासिक राजस्व: ₹65,000',
      quote: 'महिला सूक्ष्म उद्यमी के रूप में महिला समृद्धि योजना के तहत 4% ब्याज दर बहुत बड़ा संबल साबित हुई। मंच ने सभी कटौतियां पहले ही समझा दीं और मेरी स्थानीय भाषा में सहायता की। अब 3 महीने के अधिस्थगन के साथ मेरी मासिक ईएमआई केवल ₹4,130 है।',
      badge: 'महिला सशक्तिकरण',
      avatar: 'सवि'
    },
    {
      name: 'रामेश्वर सोलंकी',
      role: 'इको-लॉजिस्टिक्स संचालक',
      location: 'पुणे, महाराष्ट्र',
      scheme: 'ग्रीन बिजनेस योजना (GBS)',
      loanAmount: '₹3,20,000, 6.0% वार्षिक ब्याज पर',
      impact: 'वाणिज्यिक ईवी बेड़ा | शून्य ईंधन खर्च',
      quote: 'बिना गारंटी के इलेक्ट्रिक डिलीवरी तिपहिया वाहन खरीदना मुश्किल लग रहा था। स्कीम रेडी ने मुझे 6 महीने की छूट वाली ग्रीन बिजनेस स्कीम से जोड़ा। महात्मा फुले पिछड़ा वर्ग निगम ने बिना किसी आपत्ति के मेरा डोजियर स्वीकृत कर लिया।',
      badge: 'ग्रीन बिजनेस',
      avatar: 'राम'
    }
  ] : [
    {
      name: 'Ravi Kumar',
      role: 'Founder, SmartTech Micro Repair Lab',
      location: 'Bengaluru, Karnataka',
      scheme: 'Micro Credit Scheme (MCS) - NSFDC',
      loanAmount: '₹1,50,000 at 5.0% p.a.',
      impact: 'Monthly Net Profit: ₹42,000 | 0 Delinquencies',
      quote: 'Direct bank applications were rejected twice because I lacked formal project documentation. SchemeReady verified my caste certificate with DigiLocker in 30 seconds, generated an AI Detailed Project Report, and routed me to the Dr. B.R. Ambedkar Development Corp. Within 18 days, the funds were in my account.',
      badge: 'MICRO ENTERPRISE',
      avatar: 'RK'
    },
    {
      name: 'Savita Devi',
      role: 'Proprietor, Ananya Handloom & Garments',
      location: 'Varanasi, Uttar Pradesh',
      scheme: 'Mahila Samriddhi Yojana (MSY)',
      loanAmount: '₹1,40,000 at 4.0% p.a.',
      impact: 'Employs 4 local women | Revenue: ₹65,000/mo',
      quote: 'As a woman micro-entrepreneur, the 4% interest rate under Mahila Samriddhi Yojana was a game changer. The platform explained all deductions upfront and assisted me in my native language. Now my monthly EMI is only ₹4,130 with a 3-month gestation cushion.',
      badge: 'WOMEN EMPOWERMENT',
      avatar: 'SD'
    },
    {
      name: 'Rameshwar Solanki',
      role: 'Eco-Logistics Operator',
      location: 'Pune, Maharashtra',
      scheme: 'Green Business Scheme (GBS)',
      loanAmount: '₹3,20,000 at 6.0% p.a.',
      impact: 'Commercial EV Fleet | Zero Fuel Cost',
      quote: 'Transitioning to an electric delivery three-wheeler seemed difficult without collateral. SchemeReady matched me to the Green Business Scheme with a 6-month moratorium. The Mahatma Phule Backward Class Corp approved my dossier without a single objection.',
      badge: 'GREEN BUSINESS',
      avatar: 'RS'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{localizeTernary('जमीनी प्रभाव की कहानियां', 'Grassroots Impact Stories', lang)}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {localizeTernary('वास्तविक उद्यमी। वास्तविक रियायती प्रगति।', 'Real Entrepreneurs. Real Subsidized Growth.', lang)}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {localizeTernary('देखें कि कैसे नागरिकों ने असंगठित दैनिक श्रम से आत्मनिर्भर व्यवसाय के स्वामी बनने के लिए भारत सरकार के रियायती ऋण का लाभ उठाया।', 'See how grassroots citizens leveraged Government of India concessional credit to transition from unorganized daily labor to self-sustaining business owners.', lang)}
          </p>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Top Badge & Profile */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                  <Quote className="w-5 h-5 text-slate-300" />
                </div>

                {/* Testimonial Quote */}
                <p className="text-xs text-slate-600 leading-relaxed italic font-normal">
                  "{item.quote}"
                </p>

                {/* Loan & Impact Metrics Box */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">{localizeTernary('स्वीकृत योजना:', 'Scheme Sanctioned:', lang)}</span>
                    <span className="font-bold text-slate-800">{item.loanAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">{localizeTernary('परिणाम:', 'Outcome:', lang)}</span>
                    <span className="font-bold text-emerald-700">{item.impact}</span>
                  </div>
                </div>
              </div>

              {/* Profile Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shadow-md">
                  {item.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">{item.role}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">{item.location}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
