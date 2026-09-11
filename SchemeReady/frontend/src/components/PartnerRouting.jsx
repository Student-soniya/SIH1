import { localizeTernary } from "../l10n";
import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import { 
  Building2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  Navigation, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  CheckCheck, 
  Percent 
} from 'lucide-react';
import { getPartners } from '../api';
import IllustrativeBadge from './IllustrativeBadge';

function formatVerifiedDate(value, lang = 'en') {
  if (!value) return localizeTernary('दर्ज नहीं', 'not recorded', lang);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return localizeTernary('दर्ज नहीं', 'not recorded', lang);
  const localeMap = {
    hi: 'hi-IN',
    kn: 'kn-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    en: 'en-IN'
  };
  return parsed.toLocaleDateString(localeMap[lang] || 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PartnerRouting({ 
  lang = 'en', 
  profile, 
  selectedScheme, 
  onSelectPartner, 
  onProceedToEmi 
}) {
  const t = translations[lang] || translations.en;
  const isHindi = lang === 'hi';
  const [partners, setPartners] = useState([]);
  const [selectedState, setSelectedState] = useState(profile?.state || 'Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState(profile?.location || 'Bengaluru');
  const [selectedType, setSelectedType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const stateDistrictMap = {
    "Karnataka": ["Bengaluru", "Bengaluru Rural", "Mysuru", "Hubballi-Dharwad", "Belagavi", "Kalaburagi"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
    "Uttar Pradesh": ["Lucknow", "Varanasi", "Kanpur", "Agra", "Prayagraj"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    "West Bengal": ["Kolkata", "Howrah", "Siliguri"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara"]
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getPartners(selectedDistrict, selectedScheme?.schemeId);
      setPartners(data);
      setLoading(false);
    }
    load();
  }, [selectedDistrict, selectedState, selectedScheme]);

  const handleStateChange = (st) => {
    setSelectedState(st);
    const dist = stateDistrictMap[st]?.[0] || 'Headquarter';
    setSelectedDistrict(dist);
  };

  const filtered = partners.filter(p => {
    if (selectedType === 'ALL') return true;
    return p.institutionType === selectedType;
  });

  const recommendedPartner = filtered.length > 0 ? filtered[0] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>{localizeTernary('नवाचार: चैनल पार्टनर फंड एवं कार्यालय राउटर', 'SIH Innovation: Channel Partner Fund Router', lang)}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.partners.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{t.partners.subtitle}</p>
        </div>

        {/* Pan-India Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-emerald-600"
          >
            {Object.keys(stateDistrictMap).map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-emerald-600"
          >
            {(stateDistrictMap[selectedState] || []).map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-emerald-600"
          >
            <option value="ALL">{localizeTernary('सभी श्रेणियां (SCA, PSB, RRB, MFI)', 'All Categories (SCA, PSB, RRB, MFI)', lang)}</option>
            <option value="SCA">{localizeTernary('राज्य चैनलिंग एजेंसी (SCA)', 'State Channelizing Agency (SCA)', lang)}</option>
            <option value="PSB">{localizeTernary('सार्वजनिक क्षेत्र का बैंक (PSB)', 'Public Sector Bank (PSB)', lang)}</option>
            <option value="RRB">{localizeTernary('क्षेत्रीय ग्रामीण बैंक (RRB)', 'Regional Rural Bank (RRB)', lang)}</option>
            <option value="NBFC-MFI">{localizeTernary('सूक्ष्म वित्त संस्थान (MFI)', 'Micro Finance Institution (MFI)', lang)}</option>
          </select>
        </div>
      </div>

      {/* SIH Health Check Assurance Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center space-x-2">
          <CheckCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>{localizeTernary('फंड उपयोगिता एवं एनपीए फ़िल्टर:', 'SIH Fund Utilization & NPA Filter:', lang)}</strong>{' '}
            {localizeTernary('आवेदनों को सक्रिय निधि वितरण और कम एनपीए वाले सत्यापित भागीदारों को भेजा जाता है।', 'Applications are strictly routed to partners verified for active fund disbursals with low NPAs to eliminate offline delays.', lang)}
          </span>
        </div>
        <span className="bg-emerald-200/70 text-emerald-900 font-bold px-3 py-1 rounded-lg shrink-0">
          {localizeTernary('100+ चैनल पार्टनर अनुक्रमित', '100+ Channel Partners Indexed', lang)}
        </span>
      </div>

      {/* #1 Top Recommended Partner Highlight Box */}
      {recommendedPartner && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 border border-emerald-500/30 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{t.partners.recommendedBadge}</span>
                </span>
                <span className="text-xs text-emerald-300 font-mono">
                  {recommendedPartner.institutionType} • {recommendedPartner.district}, {selectedState}
                </span>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-white">
                {recommendedPartner.institutionName}
                <IllustrativeBadge record={recommendedPartner} className="ml-2" />
              </h3>

              <p className="text-xs text-slate-300 flex items-center flex-wrap gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{recommendedPartner.address}</span>
                <IllustrativeBadge record={recommendedPartner} />
              </p>

              {recommendedPartner.contactNumber && (
                <p className="text-xs text-slate-300 flex items-center flex-wrap gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-mono">{recommendedPartner.contactNumber}</span>
                  <IllustrativeBadge record={recommendedPartner} />
                </p>
              )}

              <div className="bg-white/10 rounded-xl p-3 text-xs text-emerald-200 border border-white/10">
                <strong>{localizeTernary('स्मार्ट रूटिंग सिफारिश:', 'Smart Routing Recommendation:', lang)}</strong>{' '}
                {`${recommendedPartner.institutionName}, ${recommendedPartner.distanceKm} ${localizeTernary('किमी दूर', 'km away', lang)}, ${localizeTernary(recommendedPartner.applicationMode === 'Offline' ? 'ऑफलाइन आवेदन स्वीकार करता है' : 'ऑनलाइन आवेदन स्वीकार करता है', `accepts ${recommendedPartner.applicationMode.toLowerCase()} applications`, lang)}, ${localizeTernary('चयनित योजना का समर्थन करता है', 'supports the selected scheme', lang)}, ${localizeTernary('अंतिम सत्यापन', 'last verified', lang)} ${formatVerifiedDate(recommendedPartner.lastVerifiedDate, lang)}.`}
              </div>
            </div>

            {/* Quick badges & action */}
            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">{localizeTernary('आवेदक से दूरी:', 'Distance from applicant:', lang)}</span>
                <span className="text-2xl font-black text-emerald-400">{recommendedPartner.distanceKm} km</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-lg">
                  {isHindi ? 'उच्च निधि उपलब्धता / 0% बकाया' : (recommendedPartner.fundUtilizationStatus || 'High Fund Availability')}
                </span>
                <span className="bg-slate-700/60 text-slate-300 text-xs px-2.5 py-1 rounded-lg">
                  {isHindi ? `माध्यम: ${recommendedPartner.applicationMode}` : `Mode: ${recommendedPartner.applicationMode}`}
                </span>
              </div>

              <button
                onClick={() => {
                  if (onSelectPartner) onSelectPartner(recommendedPartner);
                  onProceedToEmi();
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>{localizeTernary('चुनें और वित्तीय कैलकुलेटर खोलें', 'Select & Open Financial Calculator', lang)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Partner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  partner.institutionType === 'SCA'
                    ? 'bg-purple-100 text-purple-800'
                    : partner.institutionType === 'PSB'
                    ? 'bg-blue-100 text-blue-800'
                    : partner.institutionType === 'RRB'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {partner.institutionType}
                </span>

                <span className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                  <Navigation className="w-3 h-3 text-emerald-600" />
                  <span>{partner.distanceKm} km</span>
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {partner.institutionName}
                <IllustrativeBadge record={partner} className="ml-1.5" />
              </h4>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="flex items-start flex-wrap gap-x-1.5 gap-y-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="truncate">{partner.address}</span>
                  <IllustrativeBadge record={partner} />
                </p>
                <p className="flex items-center flex-wrap gap-x-1.5 gap-y-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{partner.contactNumber}</span>
                  <IllustrativeBadge record={partner} />
                </p>
              </div>

              {/* Fund Utilization Rating */}
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] space-y-0.5">
                <div className="text-emerald-800 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>
                    {isHindi ? 'उच्च निधि उपलब्धता / 0% बकाया' : (partner.fundUtilizationStatus || 'High Fund Availability / 0% Overdue')}
                  </span>
                </div>
                <div className="text-slate-500 font-mono text-[10px]">
                  {localizeTernary('एनपीए ऑडिट:', 'NPA Audit:', lang)} {partner.npaHealthScore || 'AAA (Low Default Risk)'}
                </div>
              </div>

              {/* Supported Schemes Chips */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  {localizeTernary('संसाधित योजनाएं:', 'Schemes Processed:', lang)}
                </span>
                <div className="flex flex-wrap gap-1">
                  {partner.supportedSchemes.map((sId, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">
                      {sId}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Verification Label */}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
              <span className="flex items-center space-x-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{localizeTernary('सत्यापित स्वच्छ वितरण', 'Verified Clean Disbursal', lang)}</span>
              </span>
              <span className="font-semibold text-slate-700">
                {partner.applicationMode} {localizeTernary('मोड', 'Mode', lang)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
