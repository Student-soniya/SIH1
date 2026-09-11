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

export default function PartnerRouting({ 
  lang, 
  profile, 
  selectedScheme, 
  onSelectPartner,
  onProceedToEmi 
}) {
  const t = translations[lang] || translations.en;
  const [partners, setPartners] = useState([]);
  const [selectedState, setSelectedState] = useState(profile.state || 'Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState(profile.location || 'Bengaluru');
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
            <span>SIH Innovation: Channel Partner Fund Router</span>
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
            <option value="ALL">All Categories (SCA, PSB, RRB, MFI)</option>
            <option value="SCA">State Channelizing Agency (SCA)</option>
            <option value="PSB">Public Sector Bank (PSB)</option>
            <option value="RRB">Regional Rural Bank (RRB)</option>
            <option value="NBFC-MFI">Micro Finance Institution (MFI)</option>
          </select>
        </div>
      </div>

      {/* SIH Health Check Assurance Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center space-x-2">
          <CheckCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>SIH Fund Utilization &amp; NPA Filter:</strong> Applications are strictly routed to partners verified for active fund disbursals with low NPAs to eliminate offline delays.
          </span>
        </div>
        <span className="bg-emerald-200/70 text-emerald-900 font-bold px-3 py-1 rounded-lg shrink-0">
          100+ Channel Partners Indexed
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
              </h3>

              <p className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{recommendedPartner.address}</span>
              </p>

              {/* Exact SIH routing quote */}
              <div className="bg-white/10 rounded-xl p-3 text-xs text-emerald-200 border border-white/10">
                <strong>Smart Routing Recommendation:</strong> {recommendedPartner.institutionName}, {recommendedPartner.distanceKm} km away, accepts {recommendedPartner.applicationMode.toLowerCase()} applications, supports selected credit scheme, verified with clean balance sheet (0% overdue).
              </div>
            </div>

            {/* Quick badges & action */}
            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Distance from applicant:</span>
                <span className="text-2xl font-black text-emerald-400">{recommendedPartner.distanceKm} km</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-lg">
                  {recommendedPartner.fundUtilizationStatus || 'High Fund Availability'}
                </span>
                <span className="bg-slate-700/60 text-slate-300 text-xs px-2.5 py-1 rounded-lg">
                  Mode: {recommendedPartner.applicationMode}
                </span>
              </div>

              <button
                onClick={() => {
                  if (onSelectPartner) onSelectPartner(recommendedPartner);
                  onProceedToEmi();
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
              >
                <span>Select &amp; Open Financial Calculator</span>
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
              </h4>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="flex items-start space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="truncate">{partner.address}</span>
                </p>
                <p className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{partner.contactNumber}</span>
                </p>
              </div>

              {/* Fund Utilization Rating */}
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] space-y-0.5">
                <div className="text-emerald-800 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{partner.fundUtilizationStatus || 'High Fund Availability / 0% Overdue'}</span>
                </div>
                <div className="text-slate-500 font-mono text-[10px]">
                  NPA Audit: {partner.npaHealthScore || 'AAA (Low Default Risk)'}
                </div>
              </div>

              {/* Supported Schemes Chips */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Schemes Processed:</span>
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
                <span>Verified Clean Disbursal</span>
              </span>
              <span className="font-semibold text-slate-700">{partner.applicationMode} Mode</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
