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

export default function ChannelPartnersMap({ onSelectPartner }) {
  const [selectedState, setSelectedState] = useState('Karnataka');

  const partnersData = {
    'Karnataka': [
      {
        name: 'Karnataka State Dr. B.R. Ambedkar Development Corporation (SCA)',
        district: 'Bengaluru Urban & Rural',
        address: 'No. 9 & 10, Vishweshwaraiah Towers, 9th Floor, Dr. Ambedkar Veedhi, Bengaluru - 560001',
        contact: 'Shri M. Nagaraj (District Manager) | +91 80 2286 4521',
        status: 'Active Window',
        overdueRate: '0.0% Overdue',
        rating: 'AAA Top Performing',
        allocation: '₹18.40 Cr Available',
        mode: 'Offline & Digital Handoff'
      },
      {
        name: 'Karnataka Gramin Bank (RRB)',
        district: 'Ballari, Koppal & Raichur',
        address: 'Head Office, Gandhi Nagar, Ballari - 583103',
        contact: 'Chief Manager (Priority Credit) | +91 8392 278000',
        status: 'Active Window',
        overdueRate: '0.0% Overdue',
        rating: 'AA High Disbursal',
        allocation: '₹12.20 Cr Available',
        mode: 'Branch Direct'
      }
    ],
    'Maharashtra': [
      {
        name: 'Mahatma Phule Backward Class Development Corporation (MPBCDC)',
        district: 'Mumbai & Thane',
        address: 'Juhu Supreme Shopping Centre, Gulmohar Cross Rd No 9, Juhu, Mumbai - 400049',
        contact: 'Smt. Anjali Shinde (GM Operations) | +91 22 2620 4578',
        status: 'Active Window',
        overdueRate: '0.0% Overdue',
        rating: 'AAA Top Performing',
        allocation: '₹24.50 Cr Available',
        mode: 'Offline & Digital Handoff'
      },
      {
        name: 'Maharashtra Gramin Bank',
        district: 'Aurangabad & Nanded',
        address: 'Golwadi, Waluj Mahanagar, Aurangabad - 431136',
        contact: 'Zonal Head (Inclusive Credit) | +91 240 248 1000',
        status: 'Active Window',
        overdueRate: '0.2% Overdue',
        rating: 'AA High Disbursal',
        allocation: '₹9.80 Cr Available',
        mode: 'Branch Direct'
      }
    ],
    'Uttar Pradesh': [
      {
        name: 'UP Scheduled Castes Finance & Development Corp (UPSCDC)',
        district: 'Lucknow & Barabanki',
        address: 'B-Block, 2nd Floor, Indira Bhawan, Ashok Marg, Lucknow - 226001',
        contact: 'Shri R.K. Verma (Dy. Director) | +91 522 228 6789',
        status: 'Active Window',
        overdueRate: '0.0% Overdue',
        rating: 'AAA Top Performing',
        allocation: '₹32.00 Cr Available',
        mode: 'Offline & Digital Handoff'
      },
      {
        name: 'Aryavart Bank (RRB)',
        district: 'Lucknow & Ayodhya Region',
        address: 'Head Office, A-2/46, Vijay Khand, Gomti Nagar, Lucknow - 226010',
        contact: 'General Manager (Credit) | +91 522 239 8871',
        status: 'Active Window',
        overdueRate: '0.1% Overdue',
        rating: 'AA High Disbursal',
        allocation: '₹15.60 Cr Available',
        mode: 'Branch Direct'
      }
    ],
    'Tamil Nadu': [
      {
        name: 'Tamil Nadu Adi Dravidar Housing & Dev Corp (TAHDCO)',
        district: 'Chennai & Kanchipuram',
        address: 'No. 31, Cenotaph Road, Teynampet, Chennai - 600018',
        contact: 'District Manager (Credit) | +91 44 2434 2205',
        status: 'Active Window',
        overdueRate: '0.0% Overdue',
        rating: 'AAA Top Performing',
        allocation: '₹21.00 Cr Available',
        mode: 'Offline & Digital Handoff'
      }
    ],
    'West Bengal': [
      {
        name: 'West Bengal SC, ST & OBC Development Corporation',
        district: 'Kolkata & North 24 Parganas',
        address: 'CF-217/A/1, Sector-I, Salt Lake, Kolkata - 700064',
        contact: 'Managing Director Secretariat | +91 33 2321 0012',
        status: 'Active Window',
        overdueRate: '0.0% Overdue',
        rating: 'AAA Top Performing',
        allocation: '₹14.80 Cr Available',
        mode: 'Offline & Digital Handoff'
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
            <span>100+ Authorized Channel Partners Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Connect Directly to Authorized Channel Partners
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            By government mandate, concessional funds are never disbursed directly to retail applicants—they route exclusively through State Channelizing Agencies (SCAs), RRBs, and Public Sector Banks. SchemeReady matches you to active branches with 0% overdue.
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
              {st}
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
                    <span className="text-slate-400 block">Current Lending Allocation</span>
                    <span className="font-bold text-emerald-700 font-mono">{partner.allocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Application Submission Mode</span>
                    <span className="font-bold text-slate-800">{partner.mode}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectPartner ? onSelectPartner(partner) : null}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-900 border border-slate-300 hover:border-emerald-600 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Route Application to This Partner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
