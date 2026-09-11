import React, { useState } from 'react';
import { 
  Coins, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  Tag, 
  Layers, 
  UserCheck, 
  Filter 
} from 'lucide-react';

export default function SchemesShowcase({ onSelectScheme, lang = 'en' }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const isHindi = lang === 'hi';

  const schemes = [
    {
      id: 'NSFDC-MCS-01',
      name: isHindi ? 'माइक्रो क्रेडिट योजना (MCS)' : 'Micro Credit Scheme (MCS)',
      authority: isHindi 
        ? 'राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC)' 
        : 'National Scheduled Castes Finance & Development Corporation (NSFDC)',
      category: 'micro',
      maxLoan: isHindi ? '₹1,50,000' : '₹1,50,000',
      maxLoanNum: 150000,
      interestRate: isHindi ? '5.0% वार्षिक' : '5.0% p.a.',
      interestRateNum: 5.0,
      tenure: isHindi ? '36 महीने तक' : 'Up to 36 Months',
      moratorium: isHindi ? '3 महीने की छूट' : '3 Months Gestation',
      subsidy: isHindi ? '90% परियोजना लागत वित्तपोषित' : '90% Project Cost Financed',
      bestFor: isHindi 
        ? 'सिलाई, मोबाइल रिपेयरिंग, चाय / फास्ट फूड, किराना स्टोर, छोटे कारीगर' 
        : 'Tailoring, Mobile Repair, Tea / Fast Food, Kirana Stores, Small Artisans',
      guidelines: 'NSFDC Operational Guidelines Clause 4.2',
      badge: isHindi ? 'सूक्ष्म व्यवसाय हेतु सर्वाधिक लोकप्रिय' : 'MOST POPULAR FOR MICRO',
      accent: 'border-emerald-500 bg-emerald-50/60 text-emerald-900',
      pillColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'NSFDC-MSY-02',
      name: isHindi ? 'महिला समृद्धि योजना (MSY)' : 'Mahila Samriddhi Yojana (MSY)',
      authority: isHindi 
        ? 'सामाजिक न्याय और अधिकारिता मंत्रालय (MoSJE)' 
        : 'Ministry of Social Justice & Empowerment (MoSJE)',
      category: 'women',
      maxLoan: isHindi ? '₹1,40,000' : '₹1,40,000',
      maxLoanNum: 140000,
      interestRate: isHindi ? '4.0% वार्षिक' : '4.0% p.a.',
      interestRateNum: 4.0,
      tenure: isHindi ? '36 महीने तक' : 'Up to 36 Months',
      moratorium: isHindi ? '3 महीने की छूट' : '3 Months Gestation',
      subsidy: isHindi ? '90% लागत + विशेष महिला ब्याज छूट' : '90% Cost + Special Women Subvention',
      bestFor: isHindi 
        ? 'महिला उद्यमी, स्वयं सहायता समूह (SHG), ब्यूटी पार्लर, हथकरघा, खाद्य पैकेजिंग' 
        : 'Women Entrepreneurs, Self-Help Groups (SHGs), Beauty Salons, Handlooms, Food Packaging',
      guidelines: 'NSFDC Guidelines Section 5.1 (Women Exclusive)',
      badge: isHindi ? 'न्यूनतम ब्याज (4.0%)' : 'LOWEST INTEREST (4.0%)',
      accent: 'border-rose-400 bg-rose-50/60 text-rose-900',
      pillColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'NSFDC-TL-03',
      name: isHindi ? 'मियादी ऋण (डबल डेकर) योजना' : 'Term Loan (Double Decker) Scheme',
      authority: isHindi 
        ? 'एनएसएफडीसी एवं राज्य चैनलाइजिंग एजेंसियां (SCAs)' 
        : 'NSFDC & State Channelizing Agencies (SCAs)',
      category: 'commercial',
      maxLoan: isHindi ? '₹50,00,000' : '₹50,00,000',
      maxLoanNum: 5000000,
      interestRate: isHindi ? '6.0% - 8.0% वार्षिक' : '6.0% - 8.0% p.a.',
      interestRateNum: 6.5,
      tenure: isHindi ? '60 महीने तक' : 'Up to 60 Months',
      moratorium: isHindi ? '6-12 महीने की छूट' : '6-12 Months Gestation',
      subsidy: isHindi ? '₹50,000 तक पूंजी सब्सिडी' : 'Up to ₹50,000 Capital Subsidy',
      bestFor: isHindi 
        ? 'सीएनसी वर्कशॉप, लघु विनिर्माण, कोल्ड स्टोरेज, डेयरी फार्म, वाणिज्यिक वाहन' 
        : 'CNC Workshops, Light Manufacturing, Cold Storage, Dairy Farms, Commercial Vehicles',
      guidelines: 'NSFDC Term Loan Schedule 2024-26',
      badge: isHindi ? '₹50 लाख तक ऋण' : 'UP TO ₹50 LAKHS',
      accent: 'border-blue-500 bg-blue-50/60 text-blue-900',
      pillColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'NSFDC-GBS-04',
      name: isHindi ? 'ग्रीन बिजनेस योजना (GBS)' : 'Green Business Scheme (GBS)',
      authority: isHindi 
        ? 'सामाजिक न्याय मंत्रालय - हरित संक्रमण पहल' 
        : 'MoSJE Green Transition Initiative',
      category: 'green',
      maxLoan: isHindi ? '₹30,00,000' : '₹30,00,000',
      maxLoanNum: 3000000,
      interestRate: isHindi ? '6.0% वार्षिक' : '6.0% p.a.',
      interestRateNum: 6.0,
      tenure: isHindi ? '60 महीने तक' : 'Up to 60 Months',
      moratorium: isHindi ? '6 महीने की छूट' : '6 Months Gestation',
      subsidy: isHindi ? 'सब्सिडीयुक्त ईवी और सौर ऊर्जा बदलाव' : 'Subsidized EV & Solar Transition',
      bestFor: isHindi 
        ? 'ई-रिक्शा, सोलर रूफटॉप सेवा, जैव-अपशिष्ट प्रसंस्करण, बैटरी स्वैपिंग स्टेशन' 
        : 'E-Rickshaws, Solar Rooftop Service, Bio-Waste Processing, Battery Swapping Stations',
      guidelines: 'Green Business Policy Document Clause 7',
      badge: isHindi ? 'ग्रीन टेक सब्सिडी' : 'GREEN TECH SUBSIDY',
      accent: 'border-teal-500 bg-teal-50/60 text-teal-900',
      pillColor: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'SUI-PMEGP-05',
      name: isHindi ? 'स्टैंड-अप इंडिया / पीएमईजीपी अभिसरण' : 'Stand-Up India / PMEGP Convergence',
      authority: isHindi 
        ? 'एमएसएमई मंत्रालय और सिडबी / सरकारी बैंक' 
        : 'Ministry of MSME & SIDBI / Public Sector Banks',
      category: 'commercial',
      maxLoan: isHindi ? '₹10 लाख - ₹1 करोड़' : '₹10,00,000 - ₹1 Crore',
      maxLoanNum: 2500000,
      interestRate: isHindi ? 'एमसीएलआर + 1.5% (बिना गारंटी)' : 'MCLR + 1.5% (Collateral-Free)',
      interestRateNum: 8.0,
      tenure: isHindi ? '84 महीने तक' : 'Up to 84 Months',
      moratorium: isHindi ? '12 महीने की छूट' : '12 Months Gestation',
      subsidy: isHindi ? '25% - 35% मार्जिन मनी सब्सिडी' : '25% - 35% Margin Money Subsidy',
      bestFor: isHindi 
        ? 'ग्रीनफील्ड उद्यम, कृषि-प्रसंस्करण इकाइयां, परिधान निर्यात, हार्डवेयर लैब' 
        : 'Greenfield Ventures, Agri-Processing Units, Export Apparel, Tech Hardware Labs',
      guidelines: 'Stand-Up India Guidelines for SC/ST/Women',
      badge: isHindi ? 'बिना गारंटी सीजीटीएमएसई कवर' : 'COLLATERAL-FREE CGTMSE',
      accent: 'border-amber-500 bg-amber-50/60 text-amber-900',
      pillColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'NSFDC-EL-06',
      name: isHindi ? 'शैक्षणिक रियायती ऋण योजना' : 'Educational Concessional Loan Scheme',
      authority: isHindi 
        ? 'एनएसएफडीसी उच्च कौशल प्रभाग' 
        : 'NSFDC High-Skilling Division',
      category: 'education',
      maxLoan: isHindi ? '₹20 लाख (भारत) / ₹30 लाख (विदेश)' : '₹20L (India) / ₹30L (Abroad)',
      maxLoanNum: 2000000,
      interestRate: isHindi ? '4.0% वार्षिक (महिलाओं को 0.5% छूट)' : '4.0% p.a. (0.5% Women Rebate)',
      interestRateNum: 4.0,
      tenure: isHindi ? '120 महीने तक' : 'Up to 120 Months',
      moratorium: isHindi ? 'कोर्स अवधि + 1 वर्ष' : 'Course Period + 1 Year',
      subsidy: isHindi ? '100% कोर्स एवं रहने का खर्च' : '100% Course & Living Expenses',
      bestFor: isHindi 
        ? 'इंजीनियरिंग, मेडिकल, एमसीए, बायोटेक्नोलॉजी, पॉलिटेक्निक और व्यावसायिक प्रशिक्षण' 
        : 'Engineering, Medicine, MCA, Biotechnology, Polytechnic & Advanced Vocational Training',
      guidelines: 'Education Scheme Circular 2024-25',
      badge: isHindi ? '4% ब्याज दर + 1 वर्ष बफर' : '4% RATE + 1 YEAR BUFFER',
      accent: 'border-purple-500 bg-purple-50/60 text-purple-900',
      pillColor: 'bg-purple-100 text-purple-800'
    }
  ];

  const filterPills = isHindi ? [
    { id: 'all', label: 'सभी रियायती योजनाएं (6)' },
    { id: 'micro', label: 'माइक्रो क्रेडिट (< ₹1.5 लाख)' },
    { id: 'women', label: 'महिला विशेष (4.0% MSY)' },
    { id: 'commercial', label: 'मियादी ऋण (₹50 लाख तक)' },
    { id: 'green', label: 'ग्रीन टेक और सोलर' }
  ] : [
    { id: 'all', label: 'All Concessional Schemes (6)' },
    { id: 'micro', label: 'Micro Credit (< ₹1.5L)' },
    { id: 'women', label: 'Women Special (4.0% MSY)' },
    { id: 'commercial', label: 'Term Loans (Up to ₹50L)' },
    { id: 'green', label: 'Green Tech & Solar' }
  ];

  const filteredSchemes = schemes.filter(s => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'micro') return s.category === 'micro';
    if (activeFilter === 'women') return s.category === 'women';
    if (activeFilter === 'commercial') return s.category === 'commercial';
    if (activeFilter === 'green') return s.category === 'green';
    return true;
  });

  return (
    <section id="schemes" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? 'आधिकारिक सरकारी वित्तीय उत्पाद' : 'Official Government Financial Products'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {isHindi ? 'उद्यमिता के लिए राष्ट्रीय रियायती योजनाएं' : 'National Concessional Schemes for Entrepreneurship'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {isHindi 
              ? 'वार्षिक पारिवारिक आय ₹5.00 लाख तक वाले लाभार्थी भारी रियायती ब्याज दरों पर 90% तक परियोजना लागत कवरेज के पात्र हैं। नीचे आधिकारिक योजनाएं देखें।' 
              : 'Beneficiaries with annual family income up to ₹5.00 Lakhs are entitled to up to 90% project cost coverage at heavily subsidized concessional rates. Explore official products below.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filterPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === pill.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Schemes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group hover:border-emerald-500/50"
            >
              <div className="space-y-4">
                {/* Top Badge & Code */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-md border ${scheme.pillColor}`}>
                    {scheme.id}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    {scheme.badge}
                  </span>
                </div>

                {/* Scheme Title & Authority */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {scheme.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    {scheme.authority}
                  </p>
                </div>

                {/* Key Financial Specifications Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      {isHindi ? 'अधिकतम ऋण' : 'Max Financing'}
                    </span>
                    <span className="text-sm font-black text-slate-900 font-mono">{scheme.maxLoan}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      {isHindi ? 'ब्याज दर' : 'Interest Rate'}
                    </span>
                    <span className="text-sm font-black text-emerald-700 font-mono">{scheme.interestRate}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      {isHindi ? 'पुनर्भुगतान अवधि' : 'Repayment Tenure'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">{scheme.tenure}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      {isHindi ? 'अधिस्थगन (छूट)' : 'Moratorium'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">{scheme.moratorium}</span>
                  </div>
                </div>

                {/* Best Suited For */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {isHindi ? 'अनुशंसित व्यवसाय:' : 'Recommended Businesses:'}
                  </span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {scheme.bestFor}
                  </p>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{scheme.subsidy}</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectScheme ? onSelectScheme(scheme) : null}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer active:scale-95"
                >
                  <span>{isHindi ? 'स्कीम रेडी एआई के साथ आवेदन करें' : 'Apply With SchemeReady AI'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
