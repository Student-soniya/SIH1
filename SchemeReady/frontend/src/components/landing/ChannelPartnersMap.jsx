import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  ExternalLink 
} from 'lucide-react';

export default function ChannelPartnersMap({ onSelectPartner, lang = 'en' }) {
  const isHindi = lang === 'hi';
  const [selectedState, setSelectedState] = useState('Karnataka');

  const stateNames = isHindi ? {
    'Karnataka': 'कर्नाटक',
    'Maharashtra': 'महाराष्ट्र',
    'Uttar Pradesh': 'उत्तर प्रदेश',
    'Tamil Nadu': 'तमिलनाडु',
    'West Bengal': 'पश्चिम बंगाल'
  } : {
    'Karnataka': 'Karnataka',
    'Maharashtra': 'Maharashtra',
    'Uttar Pradesh': 'Uttar Pradesh',
    'Tamil Nadu': 'Tamil Nadu',
    'West Bengal': 'West Bengal'
  };

  const partnersData = {
    'Karnataka': [
      {
        name: isHindi ? 'कर्नाटक राज्य डॉ. बी.आर. अंबेडकर विकास निगम (SCA)' : 'Karnataka State Dr. B.R. Ambedkar Development Corporation (SCA)',
        district: isHindi ? 'बेंगलुरु शहरी एवं ग्रामीण' : 'Bengaluru Urban & Rural',
        address: isHindi 
          ? 'नं. 9 और 10, विश्वेश्वरैया टावर्स, 9वीं मंजिल, डॉ. अंबेडकर वीथि, बेंगलुरु - 560001' 
          : 'No. 9 & 10, Vishweshwaraiah Towers, 9th Floor, Dr. Ambedkar Veedhi, Bengaluru - 560001',
        contact: isHindi ? 'श्री एम. नागराज (जिला प्रबंधक) | +91 80 2286 4521' : 'Shri M. Nagaraj (District Manager) | +91 80 2286 4521',
        status: isHindi ? 'सक्रिय विंडो' : 'Active Window',
        overdueRate: isHindi ? '0.0% अतिदेय' : '0.0% Overdue',
        rating: isHindi ? 'AAA शीर्ष प्रदर्शन' : 'AAA Top Performing',
        allocation: isHindi ? '₹18.40 करोड़ उपलब्ध' : '₹18.40 Cr Available',
        mode: isHindi ? 'ऑफलाइन एवं डिजिटल हैंडऑफ' : 'Offline & Digital Handoff'
      },
      {
        name: isHindi ? 'कर्नाटक ग्रामीण बैंक (RRB)' : 'Karnataka Gramin Bank (RRB)',
        district: isHindi ? 'बल्लारी, कोप्पल और रायचूर' : 'Ballari, Koppal & Raichur',
        address: isHindi ? 'प्रधान कार्यालय, गांधी नगर, बल्लारी - 583103' : 'Head Office, Gandhi Nagar, Ballari - 583103',
        contact: isHindi ? 'मुख्य प्रबंधक (प्राथमिकता ऋण) | +91 8392 278000' : 'Chief Manager (Priority Credit) | +91 8392 278000',
        status: isHindi ? 'सक्रिय विंडो' : 'Active Window',
        overdueRate: isHindi ? '0.0% अतिदेय' : '0.0% Overdue',
        rating: isHindi ? 'AA उच्च वितरण' : 'AA High Disbursal',
        allocation: isHindi ? '₹12.20 करोड़ उपलब्ध' : '₹12.20 Cr Available',
        mode: isHindi ? 'प्रत्यक्ष शाखा' : 'Branch Direct'
      }
    ],
    'Maharashtra': [
      {
        name: isHindi ? 'महात्मा फुले पिछड़ा वर्ग विकास निगम (MPBCDC)' : 'Mahatma Phule Backward Class Development Corporation (MPBCDC)',
        district: isHindi ? 'मुंबई एवं ठाणे' : 'Mumbai & Thane',
        address: isHindi ? 'जुहू सुप्रीम शॉपिंग सेंटर, गुलमोहर क्रॉस रोड नं. 9, जुहू, मुंबई - 400049' : 'Juhu Supreme Shopping Centre, Gulmohar Cross Rd No 9, Juhu, Mumbai - 400049',
        contact: isHindi ? 'श्रीमती अंजलि शिंदे (जीएम ऑपरेशंस) | +91 22 2620 4578' : 'Smt. Anjali Shinde (GM Operations) | +91 22 2620 4578',
        status: isHindi ? 'सक्रिय विंडो' : 'Active Window',
        overdueRate: isHindi ? '0.0% अतिदेय' : '0.0% Overdue',
        rating: isHindi ? 'AAA शीर्ष प्रदर्शन' : 'AAA Top Performing',
        allocation: isHindi ? '₹24.50 करोड़ उपलब्ध' : '₹24.50 Cr Available',
        mode: isHindi ? 'ऑफलाइन एवं डिजिटल हैंडऑफ' : 'Offline & Digital Handoff'
      },
      {
        name: isHindi ? 'महाराष्ट्र ग्रामीण बैंक' : 'Maharashtra Gramin Bank',
        district: isHindi ? 'औरंगाबाद एवं नांदेड़' : 'Aurangabad & Nanded',
        address: isHindi ? 'गोलवाड़ी, वालुज महानगर, औरंगाबाद - 431136' : 'Golwadi, Waluj Mahanagar, Aurangabad - 431136',
        contact: isHindi ? 'जोनल हेड (समावेशी ऋण) | +91 240 248 1000' : 'Zonal Head (Inclusive Credit) | +91 240 248 1000',
        status: isHindi ? 'सक्रिय विंडो' : 'Active Window',
        overdueRate: isHindi ? '0.2% अतिदेय' : '0.2% Overdue',
        rating: isHindi ? 'AA उच्च वितरण' : 'AA High Disbursal',
        allocation: isHindi ? '₹9.80 करोड़ उपलब्ध' : '₹9.80 Cr Available',
        mode: isHindi ? 'प्रत्यक्ष शाखा' : 'Branch Direct'
      }
    ],
    'Uttar Pradesh': [
      {
        name: isHindi ? 'यूपी अनुसूचित जाति वित्त एवं विकास निगम (UPSCDC)' : 'UP Scheduled Castes Finance & Development Corp (UPSCDC)',
        district: isHindi ? 'लखनऊ एवं बाराबंकी' : 'Lucknow & Barabanki',
        address: isHindi ? 'बी-ब्लॉक, दूसरी मंजिल, इंदिरा भवन, अशोक मार्ग, लखनऊ - 226001' : 'B-Block, 2nd Floor, Indira Bhawan, Ashok Marg, Lucknow - 226001',
        contact: isHindi ? 'श्री आर.के. वर्मा (उप निदेशक) | +91 522 228 6789' : 'Shri R.K. Verma (Dy. Director) | +91 522 228 6789',
        status: isHindi ? 'सक्रिय विंडो' : 'Active Window',
        overdueRate: isHindi ? '0.0% अतिदेय' : '0.0% Overdue',
        rating: isHindi ? 'AAA शीर्ष प्रदर्शन' : 'AAA Top Performing',
        allocation: isHindi ? '₹32.00 करोड़ उपलब्ध' : '₹32.00 Cr Available',
        mode: isHindi ? 'ऑफलाइन एवं डिजिटल हैंडऑफ' : 'Offline & Digital Handoff'
      },
      {
        name: isHindi ? 'आर्यावर्त बैंक (RRB)' : 'Aryavart Bank (RRB)',
        district: isHindi ? 'लखनऊ एवं अयोध्या क्षेत्र' : 'Lucknow & Ayodhya Region',
        address: isHindi ? 'प्रधान कार्यालय, ए-2/46, विजय खंड, गोमती नगर, लखनऊ - 226010' : 'Head Office, A-2/46, Vijay Khand, Gomti Nagar, Lucknow - 226010',
        contact: isHindi ? 'महाप्रबंधक (ऋण) | +91 522 239 8871' : 'General Manager (Credit) | +91 522 239 8871',
        status: isHindi ? 'सक्रिय विंडो' : 'Active Window',
        overdueRate: isHindi ? '0.1% अतिदेय' : '0.1% Overdue',
        rating: isHindi ? 'AA उच्च वितरण' : 'AA High Disbursal',
        allocation: isHindi ? '₹15.60 करोड़ उपलब्ध' : '₹15.60 Cr Available',
        mode: isHindi ? 'प्रत्यक्ष शाखा' : 'Branch Direct'
      }
    ],
    'Tamil Nadu': [
      {
        name: isHindi ? 'तमिलनाडु आदि द्रविड़ आवास एवं विकास निगम (TAHDCO)' : 'Tamil Nadu Adi Dravidar Housing & Dev Corp (TAHDCO)',
        district: isHindi ? 'चेन्नई एवं कांचीपुरम' : 'Chennai & Kanchipuram',
        address: isHindi ? 'नं. 31, सेनोटैफ रोड, तेनामपेट, चेन्नई - 600018' : 'No. 31, Cenotaph Road, Teynampet, Chennai - 600018',
        contact: isHindi ? 'जिला प्रबंधक (ऋण) | +91 44 2434 2205' : 'District Manager (Credit) | +91 44 2434 2205',
        status: isHindi ? 'सक्रिय विंडो' : 'Active Window',
        overdueRate: isHindi ? '0.0% अतिदेय' : '0.0% Overdue',
        rating: isHindi ? 'AAA शीर्ष प्रदर्शन' : 'AAA Top Performing',
        allocation: isHindi ? '₹21.00 करोड़ उपलब्ध' : '₹21.00 Cr Available',
        mode: isHindi ? 'ऑफलाइन एवं डिजिटल हैंडऑफ' : 'Offline & Digital Handoff'
      }
    ],
    'West Bengal': [
      {
        name: isHindi ? 'पश्चिम बंगाल एससी, एसटी एवं ओबीसी विकास निगम' : 'West Bengal SC, ST & OBC Development Corporation',
        district: isHindi ? 'कोलकाता एवं उत्तर 24 परगना' : 'Kolkata & North 24 Parganas',
        address: isHindi ? 'सीएफ-217/ए/1, सेक्टर-I, साल्ट लेक, कोलकाता - 700064' : 'CF-217/A/1, Sector-I, Salt Lake, Kolkata - 700064',
        contact: isHindi ? 'प्रबंध निदेशक सचिवालय | +91 33 2321 0012' : 'Managing Director Secretariat | +91 33 2321 0012',
        status: isHindi ? 'सक्रिय विंडो' : 'Active Window',
        overdueRate: isHindi ? '0.0% अतिदेय' : '0.0% Overdue',
        rating: isHindi ? 'AAA शीर्ष प्रदर्शन' : 'AAA Top Performing',
        allocation: isHindi ? '₹14.80 करोड़ उपलब्ध' : '₹14.80 Cr Available',
        mode: isHindi ? 'ऑफलाइन एवं डिजिटल हैंडऑफ' : 'Offline & Digital Handoff'
      }
    ]
  };

  const activePartners = partnersData[selectedState] || [];

  return (
    <section id="partners" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? '100+ अधिकृत चैनल पार्टनर्स नेटवर्क' : '100+ Authorized Channel Partners Network'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {isHindi ? 'अधिकृत चैनल पार्टनर्स से सीधे जुड़ें' : 'Connect Directly to Authorized Channel Partners'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {isHindi 
              ? 'सरकारी आदेश के अनुसार, खुदरा आवेदकों को कभी भी सीधे ऋण वितरित नहीं किया जाता — यह केवल राज्य चैनलाइजिंग एजेंसियों (SCAs), क्षेत्रीय ग्रामीण बैंकों (RRBs) और सरकारी बैंकों के माध्यम से होता है। स्कीम रेडी आपको 0% अतिदेय वाली सक्रिय शाखाओं से जोड़ता है।' 
              : 'By government mandate, concessional funds are never disbursed directly to retail applicants—they route exclusively through State Channelizing Agencies (SCAs), RRBs, and Public Sector Banks. SchemeReady matches you to active branches with 0% overdue.'}
          </p>
        </div>

        {/* State Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.keys(partnersData).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedState === st
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {stateNames[st] || st}
            </button>
          ))}
        </div>

        {/* Partner Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activePartners.map((partner, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    {partner.overdueRate}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {partner.rating}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 leading-snug">
                  {partner.name}
                </h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{partner.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{partner.contact}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">
                      {isHindi ? 'वर्तमान ऋण आवंटन' : 'Current Lending Allocation'}
                    </span>
                    <span className="font-bold text-emerald-700 font-mono">{partner.allocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">
                      {isHindi ? 'आवेदन सबमिशन माध्यम' : 'Application Submission Mode'}
                    </span>
                    <span className="font-bold text-slate-800">{partner.mode}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectPartner ? onSelectPartner(partner) : null}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-900 border border-slate-300 hover:border-emerald-600 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>{isHindi ? 'आवेदन को इस पार्टनर के लिए रूट करें' : 'Route Application to This Partner'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
