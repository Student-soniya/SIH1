import React, { useState, useRef } from 'react';
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
  ArrowRight,
  RefreshCw,
  FileCheck,
  Check,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DocumentChecklist({ 
  lang = 'en', 
  profile, 
  setProfile, 
  selectedScheme, 
  onProceedToPack 
}) {
  const t = translations[lang] || translations.en;
  const isHindi = lang === 'hi';
  const fileInputRef = useRef(null);
  const [activeUploadDocId, setActiveUploadDocId] = useState(null);
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState(null);

  const [docs, setDocs] = useState([
    {
      id: 'doc-aadhaar',
      name: 'Aadhaar / Voter ID (KYC)',
      status: 'Verified',
      statusType: 'verified',
      actionType: 'view',
      mandatory: true,
      fileName: 'aadhaar_card_scan.pdf',
      fileSize: '420 KB',
      previewUrl: null
    },
    {
      id: 'doc-caste',
      name: 'Caste Certificate (RD Number)',
      status: profile.hasCasteCertificate ? 'Verified' : 'Missing',
      statusType: profile.hasCasteCertificate ? 'verified' : 'missing',
      actionType: 'upload',
      mandatory: true,
      fileName: profile.hasCasteCertificate ? (profile.casteCertificateNo ? `${profile.casteCertificateNo}.pdf` : 'caste_cert_rd_9821.pdf') : null,
      fileSize: profile.hasCasteCertificate ? '350 KB' : null,
      previewUrl: null
    },
    {
      id: 'doc-income',
      name: 'Income Certificate',
      status: profile.hasIncomeCertificate ? 'Pending review' : 'Missing',
      statusType: profile.hasIncomeCertificate ? 'pending' : 'missing',
      actionType: 'upload',
      mandatory: true,
      fileName: profile.hasIncomeCertificate ? 'income_cert_2026.pdf' : null,
      fileSize: profile.hasIncomeCertificate ? '290 KB' : null,
      previewUrl: null
    },
    {
      id: 'doc-bank',
      name: 'Bank Account Passbook / Proof',
      status: 'Uploaded',
      statusType: 'uploaded',
      actionType: 'view',
      mandatory: true,
      fileName: 'canara_bank_passbook.jpg',
      fileSize: '510 KB',
      previewUrl: null
    },
    {
      id: 'doc-quotation',
      name: 'Business / Machinery Quotation',
      status: profile.uploadedDocs?.includes('Business quotation') ? 'Verified' : 'Missing',
      statusType: profile.uploadedDocs?.includes('Business quotation') ? 'verified' : 'missing',
      actionType: 'upload',
      mandatory: false,
      fileName: profile.uploadedDocs?.includes('Business quotation') ? 'vendor_quotation_gst.pdf' : null,
      fileSize: profile.uploadedDocs?.includes('Business quotation') ? '680 KB' : null,
      previewUrl: null
    },
    {
      id: 'doc-dpr',
      name: 'One-Page Project Report (DPR)',
      status: 'Generated',
      statusType: 'verified',
      actionType: 'download',
      mandatory: true,
      fileName: 'project_viability_report.pdf',
      fileSize: '185 KB',
      previewUrl: null
    }
  ]);

  const [viewingDoc, setViewingDoc] = useState(null);
  const [digiLockerSyncing, setDigiLockerSyncing] = useState(false);

  // Localization Helpers
  const getDocTitle = (id, fallback) => {
    if (!isHindi) return fallback;
    const map = {
      'doc-aadhaar': 'आधार / मतदाता पहचान पत्र (KYC)',
      'doc-caste': 'जाति प्रमाण पत्र (आरडी नंबर)',
      'doc-income': 'आय प्रमाण पत्र (तहसीलदार प्रमाणित)',
      'doc-bank': 'बैंक खाता पासबुक / प्रमाण',
      'doc-quotation': 'व्यावसायिक मशीनरी / स्टॉक कोटेशन',
      'doc-dpr': 'एक-पेज प्रोजेक्ट रिपोर्ट (डीपीआर)'
    };
    return map[id] || fallback;
  };

  const getStatusLabel = (statusType, rawStatus) => {
    if (!isHindi) return rawStatus;
    if (statusType === 'verified') return 'सत्यापित';
    if (statusType === 'pending') return 'समीक्षाधीन';
    if (statusType === 'missing') return 'अनुपलब्ध';
    if (statusType === 'uploaded') return 'अपलोड किया गया';
    return rawStatus;
  };

  // Trigger Native OS File Browser Dialog
  const triggerFileUpload = (docId) => {
    setActiveUploadDocId(docId);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  // Handle Real File Selection from User's Computer
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const id = activeUploadDocId;
    const realFileName = file.name;
    const realFileSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;
    const previewUrl = URL.createObjectURL(file);

    setDocs(prev => prev.map(d => {
      if (d.id === id) {
        return { 
          ...d, 
          status: isHindi ? 'सत्यापित (अपलोड किया गया)' : 'Verified (Uploaded)', 
          statusType: 'verified', 
          fileName: realFileName,
          fileSize: realFileSize,
          previewUrl: previewUrl,
          fileObj: file
        };
      }
      return d;
    }));

    // Update Profile Document States & Verification
    if (id === 'doc-caste') {
      setProfile(p => ({ 
        ...p, 
        hasCasteCertificate: true, 
        casteCertificateNo: p.casteCertificateNo || 'RD0038921029-SC-UPLOADED',
        uploadedDocs: Array.from(new Set([...(p.uploadedDocs || []), 'Caste certificate']))
      }));
    } else if (id === 'doc-income') {
      setProfile(p => ({ 
        ...p, 
        hasIncomeCertificate: true,
        uploadedDocs: Array.from(new Set([...(p.uploadedDocs || []), 'Income certificate']))
      }));
    } else if (id === 'doc-quotation') {
      setProfile(p => ({ 
        ...p, 
        uploadedDocs: Array.from(new Set([...(p.uploadedDocs || []), 'Business quotation']))
      }));
    } else if (id === 'doc-aadhaar') {
      setProfile(p => ({ 
        ...p, 
        uploadedDocs: Array.from(new Set([...(p.uploadedDocs || []), 'Aadhaar/KYC']))
      }));
    } else if (id === 'doc-bank') {
      setProfile(p => ({ 
        ...p, 
        uploadedDocs: Array.from(new Set([...(p.uploadedDocs || []), 'Bank passbook']))
      }));
    }

    setUploadSuccessNotice(
      isHindi 
        ? `आपके डिवाइस से "${realFileName}" (${realFileSize}) सफलतापूर्वक संलग्न किया गया!` 
        : `Successfully attached "${realFileName}" (${realFileSize}) from your device!`
    );
    setTimeout(() => setUploadSuccessNotice(null), 5000);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleDigiLockerBulkSync = () => {
    setDigiLockerSyncing(true);
    setTimeout(() => {
      setDigiLockerSyncing(false);
      setDocs(prev => prev.map(d => ({
        ...d,
        status: isHindi ? 'सत्यापित (डिजिलॉकर)' : 'Verified (DigiLocker)',
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
    }, 1000);
  };

  const pendingDocs = docs.filter(d => d.statusType === 'missing' || d.statusType === 'pending');

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 font-sans">
      
      {/* Hidden Native File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" 
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <FolderCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? 'दस्तावेज चेकलिस्ट एवं सत्यापन' : 'Document Checklist & Verification'}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isHindi ? 'सरकारी दस्तावेज डोजियर' : 'Government Document Dossier'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi ? (
              <>
                <strong>{selectedScheme?.schemeName || 'माइक्रो क्रेडिट योजना (MCS)'}</strong> के लिए कॉन्फ़िगर किया गया। सीधे अपने कंप्यूटर से फाइलें अपलोड करें या डिजिलॉकर से सिंक करें।
              </>
            ) : (
              <>
                Configured for <strong>{selectedScheme?.schemeName || 'Micro Credit Scheme (MCS)'}</strong>. Upload files directly from your computer or sync via DigiLocker.
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDigiLockerBulkSync}
            disabled={digiLockerSyncing}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>
              {digiLockerSyncing 
                ? (isHindi ? 'प्राप्त कर रहे हैं...' : 'Fetching...') 
                : (isHindi ? '1-क्लिक डिजिलॉकर सिंक' : '1-Click DigiLocker Sync')}
            </span>
          </button>
          
          <div className="bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl font-medium">
            <span>{isHindi ? '✓ पीडीएफ, जेपीजी, पीएनजी समर्थित' : '✓ PDF, JPG, PNG accepted'}</span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert Banner */}
      {uploadSuccessNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs flex items-center space-x-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">{uploadSuccessNotice}</span>
        </div>
      )}

      {/* Pending Checklist Banner */}
      {pendingDocs.length > 0 ? (
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-4 text-xs space-y-2 text-left">
          <div className="flex items-center space-x-2 text-amber-900 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isHindi 
                ? `लंबित दस्तावेज सुधार (${pendingDocs.length} कार्रवाइयां आवश्यक)` 
                : `Pending Document Remediation (${pendingDocs.length} Actions Needed)`}
            </span>
          </div>
          <p className="text-amber-800 text-[11px] leading-relaxed font-normal">
            {isHindi 
              ? 'ऋण मूल्यांकन से पहले चैनल पार्टनर्स को सत्यापित दस्तावेजों की आवश्यकता होती है। अपने कंप्यूटर से चुनने और अपलोड करने के लिए नीचे क्लिक करें:'
              : 'Channel Partners require verified documentation before loan appraisal. Click below to select and upload from your computer:'}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {pendingDocs.map(pd => (
              <span key={pd.id} className="bg-white border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center space-x-2 shadow-xs">
                <span>⚠️</span>
                <span>{getDocTitle(pd.id, pd.name)}</span>
                <button
                  onClick={() => triggerFileUpload(pd.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all cursor-pointer inline-flex items-center space-x-1"
                >
                  <UploadCloud className="w-3 h-3" />
                  <span>{isHindi ? 'फ़ाइल चुनें' : 'Choose File'}</span>
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {isHindi 
                ? 'सभी आवश्यक दस्तावेज सत्यापित! तत्काल चैनल पार्टनर सबमिशन के लिए तैयार।' 
                : 'All Required Documents Verified! Ready for Immediate Channel Partner Submission.'}
            </span>
          </div>
          <span className="bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            {isHindi ? '100% बैंक तैयार' : '100% Bank Ready'}
          </span>
        </div>
      )}

      {/* Document Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <th className="p-4">{isHindi ? 'दस्तावेज शीर्षक' : 'Document Title'}</th>
              <th className="p-4">{isHindi ? 'आवश्यकता' : 'Requirement'}</th>
              <th className="p-4">{isHindi ? 'सत्यापन स्थिति' : 'Status'}</th>
              <th className="p-4">{isHindi ? 'संलग्न फ़ाइल' : 'Attached File'}</th>
              <th className="p-4 text-right">{isHindi ? 'कार्रवाई' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map((doc) => {
              const isVerified = doc.statusType === 'verified';
              const isPending = doc.statusType === 'pending';
              const isMissing = doc.statusType === 'missing';

              return (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{getDocTitle(doc.id, doc.name)}</span>
                    </div>
                  </td>
                  
                  <td className="p-4 text-slate-600">
                    {doc.mandatory ? (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {isHindi ? 'अनिवार्य' : 'Mandatory'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {isHindi ? 'वैकल्पिक / आवश्यक होने पर' : 'Optional / As Required'}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : isPending
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isVerified ? <CheckCircle2 className="w-3 h-3" /> : isPending ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>{getStatusLabel(doc.statusType, doc.status)}</span>
                    </span>
                  </td>

                  <td className="p-4 font-mono text-[11px] text-slate-600">
                    {doc.fileName ? (
                      <div className="flex items-center space-x-1.5">
                        <button 
                          onClick={() => setViewingDoc(doc)}
                          className="text-emerald-700 hover:text-emerald-900 underline font-semibold cursor-pointer truncate max-w-[180px]"
                          title={isHindi ? "दस्तावेज देखने के लिए क्लिक करें" : "Click to view document"}
                        >
                          {doc.fileName}
                        </button>
                        {doc.fileSize && (
                          <span className="text-[10px] text-slate-400 font-sans">({doc.fileSize})</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">
                        {isHindi ? 'कोई फ़ाइल अपलोड नहीं की गई' : 'No file uploaded'}
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {isMissing ? (
                      <button
                        onClick={() => triggerFileUpload(doc.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all inline-flex items-center space-x-1.5 shadow-xs cursor-pointer active:scale-95"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'फ़ाइल अपलोड करें' : 'Upload File'}</span>
                      </button>
                    ) : (
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl font-bold text-xs transition-all inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{isHindi ? 'देखें' : 'View'}</span>
                        </button>
                        
                        {/* Re-upload / Replace file button */}
                        <button
                          onClick={() => triggerFileUpload(doc.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-all inline-flex items-center space-x-1 cursor-pointer"
                          title={isHindi ? "इस दस्तावेज को बदलने के लिए नई फ़ाइल अपलोड करें" : "Upload a new file to replace this document"}
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span className="hidden sm:inline">{isHindi ? 'बदलें' : 'Replace'}</span>
                        </button>

                        {doc.actionType === 'download' && (
                          <button
                            onClick={() => window.print()}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
                            title={isHindi ? "डीपीआर प्रिंट / सहेजें" : "Print / Save DPR"}
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

      <div className="flex justify-end pt-2">
        <button
          onClick={onProceedToPack}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-2 cursor-pointer active:scale-95"
        >
          <span>{isHindi ? 'आवेदन पैक देखें →' : 'View Application Pack →'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* PDF / File Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setViewingDoc(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            {/* Document Header */}
            <div className="border-b border-slate-200 pb-4 text-center space-y-1">
              <div className="inline-flex items-center space-x-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>
                  {isHindi 
                    ? 'सत्यापित लाभार्थी दस्तावेज | स्कीम रेडी पोर्टल' 
                    : 'Verified Beneficiary Document | SchemeReady Portal'}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">{getDocTitle(viewingDoc.id, viewingDoc.name)}</h3>
              <p className="text-xs text-slate-500 font-mono">
                {isHindi ? 'फ़ाइल:' : 'File:'} {viewingDoc.fileName} {viewingDoc.fileSize && `(${viewingDoc.fileSize})`}
              </p>
            </div>

            {/* Document Preview Display: Real File or Certified Vector Template */}
            {viewingDoc.previewUrl ? (
              <div className="border rounded-2xl overflow-hidden bg-slate-100 p-2 max-h-[55vh] flex items-center justify-center">
                {viewingDoc.fileName.toLowerCase().endsWith('.jpg') || 
                 viewingDoc.fileName.toLowerCase().endsWith('.jpeg') || 
                 viewingDoc.fileName.toLowerCase().endsWith('.png') ? (
                  <img 
                    src={viewingDoc.previewUrl} 
                    alt={viewingDoc.name} 
                    className="max-h-[50vh] w-auto mx-auto object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <iframe 
                    src={viewingDoc.previewUrl} 
                    title={viewingDoc.name}
                    className="w-full h-[50vh] rounded-xl border border-slate-300" 
                  />
                )}
              </div>
            ) : (
              /* Certified Digital Template */
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50 relative overflow-hidden font-serif text-slate-800 space-y-4 shadow-inner">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-25deg] select-none text-5xl font-black uppercase text-slate-900">
                  {isHindi ? 'भारत सरकार द्वारा सत्यापित' : 'GOVERNMENT VERIFIED'}
                </div>

                <div className="flex justify-between items-start border-b border-slate-300 pb-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
                      {isHindi ? 'कर्नाटक सरकार' : `GOVERNMENT OF ${profile.state ? profile.state.toUpperCase() : 'KARNATAKA'}`}
                    </div>
                    <div className="text-[11px] text-slate-600 font-sans">
                      {isHindi 
                        ? 'राजस्व विभाग • रियायती वित्त चैनल प्रणाली' 
                        : 'Revenue Department • Concessional Finance Channel System'}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-slate-200 border border-slate-300 rounded flex items-center justify-center font-mono text-[9px] text-slate-500 text-center">
                    QR CODE<br />VERIFIED
                  </div>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">
                        {isHindi ? 'लाभार्थी का नाम' : 'Beneficiary Name'}
                      </span>
                      <span className="font-bold text-slate-900">{profile.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">
                        {isHindi ? 'माता-पिता का नाम' : "Parents' Name"}
                      </span>
                      <span className="font-semibold text-slate-800">{profile.parentsName || 'Shri M. Venkataram'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">
                        {isHindi ? 'प्रमाण पत्र / संदर्भ संख्या' : 'Reference / Certificate ID'}
                      </span>
                      <span className="font-mono text-emerald-700 font-bold">{profile.casteCertificateNo || 'RD0038921029-SC'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">
                        {isHindi ? 'वार्षिक पारिवारिक आय' : 'Annual Family Income'}
                      </span>
                      <span className="font-bold text-slate-900 font-mono">₹{profile.annualFamilyIncome.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-[11px] text-emerald-900 font-medium">
                    <strong>{isHindi ? 'सत्यापन विवरण:' : 'Verification Statement:'}</strong>{' '}
                    {isHindi 
                      ? 'डिजिटल रूप से प्रमाणित दस्तावेज। एनएसएफडीसी और मंत्रालय के दिशानिर्देशों के तहत रियायती ऋण ब्याज दरों (4.0% - 8.0%) के लिए सत्यापित।' 
                      : 'Digitally authenticated document. Verified for concessional loan interest rates (4.0% - 8.0%) under NSFDC and Ministry guidelines.'}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-200">
                  <span>
                    {isHindi 
                      ? 'डिजिटल प्राधिकरण: प्रमाणित तहसीलदार / अधिकृत बैंक पार्टनर' 
                      : 'Digital Authority: Certifying Tahsildar / Authorized Bank Partner'}
                  </span>
                  <span>{isHindi ? 'समय: सितंबर 2026' : 'Timestamp: September 2026'}</span>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => triggerFileUpload(viewingDoc.id)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{isHindi ? 'डिवाइस से दूसरी फ़ाइल अपलोड करें' : 'Upload different file from device'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'प्रिंट' : 'Print'}</span>
                </button>
                <button
                  onClick={() => setViewingDoc(null)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer"
                >
                  {isHindi ? 'संपन्न' : 'Done'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
