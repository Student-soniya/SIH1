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

  const handleUpload = (id) => {
    setUploadingId(id);
    setTimeout(() => {
      setUploadingId(null);
      setDocs(prev => prev.map(d => {
        if (d.id === id) {
          return { ...d, status: 'Verified', statusType: 'verified', fileName: `${id}_uploaded_sample.pdf` };
        }
        return d;
      }));
      if (id === 'doc-caste') {
        setProfile(p => ({ ...p, hasCasteCertificate: true }));
      }
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, 800);
  };

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

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs px-4 py-2.5 rounded-xl font-medium">
          <span>✓ Accepted formats: PDF, JPG, PNG (Max 5MB per document)</span>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-4">Document</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">File Name</th>
              <th className="p-4 text-right">Action</th>
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
                    {doc.fileName ? doc.fileName : <span className="text-slate-400 italic">None attached</span>}
                  </td>
                  <td className="p-4 text-right">
                    {isMissing ? (
                      <button
                        onClick={() => handleUpload(doc.id)}
                        disabled={uploadingId === doc.id}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg font-bold text-[11px] transition-all inline-flex items-center space-x-1.5 shadow-xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{uploadingId === doc.id ? 'Processing...' : 'Upload'}</span>
                      </button>
                    ) : doc.actionType === 'download' ? (
                      <button
                        onClick={() => window.print()}
                        className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all inline-flex items-center space-x-1.5"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold text-[11px] inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Attached</span>
                      </span>
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
    </div>
  );
}
