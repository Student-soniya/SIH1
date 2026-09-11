import React, { useState } from 'react';
import { translations } from '../translations';
import { 
  FolderCheck, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileDown, 
  FileText, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DocumentChecklist({ 
  lang, 
  profile, 
  setProfile, 
  selectedScheme, 
  onProceedToPack 
}) {
  const t = translations[lang] || translations.en;

  const [docs, setDocs] = useState([
    {
      id: 'doc-aadhaar',
      name: 'Aadhaar / Voter ID (KYC)',
      status: 'Verified',
      statusType: 'verified',
      actionType: 'view',
      mandatory: true,
      fileName: 'aadhaar_card_scan.pdf'
    },
    {
      id: 'doc-caste',
      name: 'Caste Certificate (RD Number)',
      status: profile.hasCasteCertificate ? 'Verified' : 'Missing',
      statusType: profile.hasCasteCertificate ? 'verified' : 'missing',
      actionType: 'upload',
      mandatory: true,
      fileName: profile.hasCasteCertificate ? 'caste_cert_rd_9821.pdf' : null
    },
    {
      id: 'doc-income',
      name: 'Income Certificate',
      status: profile.hasIncomeCertificate ? 'Pending review' : 'Missing',
      statusType: profile.hasIncomeCertificate ? 'pending' : 'missing',
      actionType: 'upload',
      mandatory: true,
      fileName: profile.hasIncomeCertificate ? 'income_cert_2026.pdf' : null
    },
    {
      id: 'doc-bank',
      name: 'Bank Account Passbook / Proof',
      status: 'Uploaded',
      statusType: 'uploaded',
      actionType: 'view',
      mandatory: true,
      fileName: 'canara_bank_passbook.jpg'
    },
    {
      id: 'doc-quotation',
      name: 'Business / Machinery Quotation',
      status: profile.uploadedDocs.includes('Business quotation') ? 'Verified' : 'Missing',
      statusType: profile.uploadedDocs.includes('Business quotation') ? 'verified' : 'missing',
      actionType: 'template',
      mandatory: false,
      fileName: profile.uploadedDocs.includes('Business quotation') ? 'vendor_quotation_gst.pdf' : null
    },
    {
      id: 'doc-dpr',
      name: 'One-Page Project Report (DPR)',
      status: 'Generated',
      statusType: 'verified',
      actionType: 'download',
      mandatory: true,
      fileName: 'project_viability_report.pdf'
    }
  ]);

  const [uploadingId, setUploadingId] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [digiLockerSyncing, setDigiLockerSyncing] = useState(false);

  const handleUpload = (id, customFileName) => {
    setUploadingId(id);
    setTimeout(() => {
      setUploadingId(null);
      setDocs(prev => prev.map(d => {
        if (d.id === id) {
          return { 
            ...d, 
            status: 'Verified', 
            statusType: 'verified', 
            fileName: customFileName || `${id}_uploaded_sample.pdf` 
          };
        }
        return d;
      }));
      if (id === 'doc-caste') {
        setProfile(p => ({ ...p, hasCasteCertificate: true, casteCertificateNo: 'RD0038921029-SC-VERIFIED' }));
      }
      if (id === 'doc-income') {
        setProfile(p => ({ ...p, hasIncomeCertificate: true }));
      }
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, 700);
  };

  const handleDigiLockerBulkSync = () => {
    setDigiLockerSyncing(true);
    setTimeout(() => {
      setDigiLockerSyncing(false);
      setDocs(prev => prev.map(d => ({
        ...d,
        status: 'Verified (DigiLocker)',
        statusType: 'verified',
        fileName: d.fileName || `${d.id}_digilocker.pdf`
      })));
      setProfile(p => ({
        ...p,
        hasCasteCertificate: true,
        hasIncomeCertificate: true,
        casteCertificateNo: 'RD0038921029-SC-DIGILOCKER',
        uploadedDocs: ['Aadhaar/KYC', 'Income certificate', 'Caste certificate', 'Bank passbook']
      }));
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.4 } });
    }, 1200);
  };

  const pendingDocs = docs.filter(d => d.statusType === 'missing' || d.statusType === 'pending');

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <FolderCheck className="w-3.5 h-3.5" />
            <span>Feature 5: Dynamic Document Checklist</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Document Checklist &amp; Verification Status</h2>
          <p className="text-sm text-slate-600 mt-1">
            Dynamically configured for <strong>{selectedScheme?.schemeName || 'Micro Credit Scheme'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDigiLockerBulkSync}
            disabled={digiLockerSyncing}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{digiLockerSyncing ? 'Fetching from DigiLocker...' : 'Sync via DigiLocker'}</span>
          </button>
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs px-3.5 py-2 rounded-xl font-medium hidden sm:block">
            <span>✓ Accepted: PDF, JPG, PNG (Max 5MB)</span>
          </div>
        </div>
      </div>

      {/* Pending Checklist Banner */}
      {pendingDocs.length > 0 ? (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-amber-900 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Pending Document Remediation Checklist ({pendingDocs.length} Action Items Pending)</span>
          </div>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            Channel Partners require 100% verified documentation before loan appraisal. Please resolve the following pending items:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {pendingDocs.map(pd => (
              <span key={pd.id} className="bg-white border border-amber-300 text-amber-900 px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center space-x-1.5 shadow-2xs">
                <span>⚠️</span>
                <span>{pd.name}</span>
                <button
                  onClick={() => handleUpload(pd.id)}
                  className="text-emerald-700 hover:underline font-bold text-[10px] ml-1"
                >
                  [Upload Now]
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All Required Documents Verified! Ready for Immediate Channel Partner Submission.</span>
          </div>
          <span className="bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            100% Complete
          </span>
        </div>
      )}

      {/* Checklist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-4">Document</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">File Name</th>
              <th className="p-4 text-right">Action / View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map((doc) => {
              const isMissing = doc.statusType === 'missing';
              const isVerified = doc.statusType === 'verified';
              const isPending = doc.statusType === 'pending';

              return (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{doc.name}</span>
                  </td>
                  <td className="p-4">
                    {doc.mandatory ? (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        Mandatory
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                        Optional
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : isPending
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isVerified ? <CheckCircle2 className="w-3 h-3" /> : isPending ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>{doc.status}</span>
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-500">
                    {doc.fileName ? (
                      <button 
                        onClick={() => setViewingDoc(doc)}
                        className="text-emerald-700 hover:text-emerald-900 underline font-semibold flex items-center space-x-1"
                        title="Click to view PDF"
                      >
                        <span>{doc.fileName}</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 italic">None attached</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {isMissing ? (
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => handleUpload(doc.id)}
                          disabled={uploadingId === doc.id}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all inline-flex items-center space-x-1.5 shadow-xs"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{uploadingId === doc.id ? 'Processing...' : 'Upload'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all inline-flex items-center space-x-1"
                        >
                          <span>View PDF</span>
                        </button>
                        {doc.actionType === 'download' && (
                          <button
                            onClick={() => window.print()}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all"
                            title="Print / Save DPR"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onProceedToPack}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-2"
        >
          <span>View Application Pack</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* PDF Viewable Modal (GovTech Digital Document Viewer) */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setViewingDoc(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold text-lg"
            >
              ✕
            </button>

            {/* Document Header */}
            <div className="border-b border-slate-200 pb-4 text-center space-y-1">
              <div className="inline-flex items-center space-x-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>DigiLocker Certified e-Document | Govt. of India</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">{viewingDoc.name}</h3>
              <p className="text-xs text-slate-500 font-mono">File: {viewingDoc.fileName}</p>
            </div>

            {/* Realistic Document Preview Canvas */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50 relative overflow-hidden font-serif text-slate-800 space-y-4 shadow-inner">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-25deg] select-none text-5xl font-black uppercase text-slate-900">
                GOVERNMENT VERIFIED
              </div>

              <div className="flex justify-between items-start border-b border-slate-300 pb-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
                    GOVERNMENT OF {profile.state ? profile.state.toUpperCase() : 'KARNATAKA'}
                  </div>
                  <div className="text-[11px] text-slate-600 font-sans">
                    Revenue Department / National SC Finance Portal
                  </div>
                </div>
                <div className="w-12 h-12 bg-slate-200 border border-slate-300 rounded flex items-center justify-center font-mono text-[9px] text-slate-500 text-center">
                  QR CODE<br />VERIFIED
                </div>
              </div>

              <div className="space-y-2 text-xs font-sans">
                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Beneficiary Name</span>
                    <span className="font-bold text-slate-900">{profile.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Parents' Name</span>
                    <span className="font-semibold text-slate-800">{profile.parentsName || 'Shri M. Venkataram'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Unique Reference ID</span>
                    <span className="font-mono text-emerald-700 font-bold">{profile.casteCertificateNo || 'RD0038921029-SC'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Annual Family Income</span>
                    <span className="font-bold text-slate-900">₹{profile.annualFamilyIncome.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-[11px] text-emerald-900 font-medium">
                  <strong>Verification Statement:</strong> This is a digitally signed document verified via National DigiLocker API repository. Authenticated for concessional finance under NSFDC &amp; Ministry of Social Justice &amp; Empowerment guidelines.
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                <span>Digital Signer: Certifying Officer, Tahsildar Office</span>
                <span>Date: September 2026</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setViewingDoc(null)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
