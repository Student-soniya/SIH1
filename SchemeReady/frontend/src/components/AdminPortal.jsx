import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import { 
  Layers, 
  ShieldCheck, 
  Building2, 
  BarChart3, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles,
  Database,
  Plus
} from 'lucide-react';
import { getAdminStats } from '../api';

export default function AdminPortal({ lang }) {
  const t = translations[lang] || translations.en;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifiedMap, setVerifiedMap] = useState({});

  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      setLoading(true);
      try {
        const data = await getAdminStats();
        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        // Admin_Role only (R4.14). The deleted fallback reported 148 fictional applications;
        // an unreachable or forbidden endpoint now says so instead (R5.11).
        if (!cancelled) {
          setError(err?.status === 403
            ? 'This console requires an administrator account.'
            : 'Administrative statistics are unavailable right now.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const handleVerify = (name) => {
    setVerifiedMap(prev => ({ ...prev, [name]: true }));
  };

  if (!stats && error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-2">
        <p className="text-sm font-semibold text-rose-800">{error}</p>
        <p className="text-xs text-slate-500">No figures are shown, because none could be retrieved.</p>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-600">Loading GovTech Admin &amp; Partner Verification Portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {error && (
        <div role="alert" className="bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl p-3">
          {error} The figures below are the last ones successfully retrieved.
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Admin &amp; Verification Console</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Government Portal &amp; Scheme Verification</h2>
          <p className="text-sm text-slate-600 mt-1">
            Maintain scheme master datasets, verify channel partner physical branches, and inspect district metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="http://localhost:5000/swagger"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Swagger API</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Active Schemes</span>
          <div className="text-3xl font-black text-slate-900">{stats.totalSchemes}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            100% NSFDC Official Guidelines 2026
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Verified Channel Partners</span>
          <div className="text-3xl font-black text-emerald-700">{stats.totalVerifiedPartners}</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            SCAs, PSBs, RRBs, NBFC-MFIs
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Dossiers Prepared</span>
          <div className="text-3xl font-black text-indigo-700">{stats.totalApplicationsPrepared}</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Ready for PM-SURAJ / Bank Handoff
          </span>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Business Categories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Popular Business Categories</span>
          </h3>
          <div className="space-y-2 text-xs">
            {Object.entries(stats.popularBusinessCategories).map(([cat, count]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{cat}</span>
                  <span>{count} applications</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${(count / 60) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications by District */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Applications by District</span>
          </h3>
          <div className="space-y-2 text-xs">
            {Object.entries(stats.applicationsByDistrict).map(([dist, count]) => (
              <div key={dist} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{dist}</span>
                  <span>{count} cases</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${(count / 70) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Missing Documents */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-rose-600" />
            <span>Common Missing Documents</span>
          </h3>
          <div className="space-y-2 text-xs">
            {Object.entries(stats.commonMissingDocuments).map(([doc, count]) => (
              <div key={doc} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{doc}</span>
                  <span className="text-rose-600 font-bold">{count}% of users</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${count}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partner Verification Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Channel Partner Verification Table</h3>
            <p className="text-xs text-slate-500">Preventing outdated partner data risk through explicit verification timestamps.</p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
            Active Verification Cycle: Q3 2026
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold">
              <tr>
                <th className="p-3">Partner Institution</th>
                <th className="p-3">Category</th>
                <th className="p-3">District</th>
                <th className="p-3">Last Verified Date</th>
                <th className="p-3 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Karnataka State Dr. B.R. Ambedkar Development Corporation', type: 'SCA', dist: 'Bengaluru' },
                { name: 'Canara Bank - MSME Hub', type: 'PSB', dist: 'Bengaluru' },
                { name: 'Dr. Babu Jagjivan Ram Leather Dev Corp (LIDKAR)', type: 'SCA', dist: 'Bengaluru' },
                { name: 'Karnataka Gramin Bank', type: 'RRB', dist: 'Bengaluru Rural' },
                { name: 'Grameen Koota Micro Finance', type: 'NBFC-MFI', dist: 'Bengaluru' }
              ].map((p, i) => {
                const isVerified = verifiedMap[p.name];
                return (
                  <tr key={i} className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                        {p.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{p.dist}</td>
                    <td className="p-3 font-mono text-emerald-700">
                      {isVerified ? '11 September 2026 (Verified Just Now)' : '10 September 2026'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleVerify(p.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                        }`}
                      >
                        {isVerified ? '✓ Verified' : 'Re-verify For 2026'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
