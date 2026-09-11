import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ExternalLink, ShieldCheck, Loader2, AlertCircle, FileCheck2, RefreshCw } from 'lucide-react';
import { tokenFetchJson } from '../auth/tokenFetch';

export default function DigiLockerVerification({ lang = 'en', profile }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [issuedFiles, setIssuedFiles] = useState([]);
  const [digiLockerId, setDigiLockerId] = useState(null);
  const popupRef = useRef(null);
  const isHindi = lang === 'hi';
  const text = {
    title: isHindi ? 'DigiLocker दस्तावेज़ सत्यापन' : 'DigiLocker Document Verification',
    description: isHindi ? 'DigiLocker में लॉगिन करके सहमति दें। SchemeReady आधिकारिक DigiLocker Requester flow से जारी दस्तावेज़ प्राप्त करेगा।' : 'Sign in to DigiLocker and give consent. SchemeReady uses the official DigiLocker Requester flow to retrieve issued documents.',
    connect: isHindi ? 'DigiLocker से कनेक्ट करें' : 'Connect DigiLocker',
    connecting: isHindi ? 'DigiLocker खोल रहे हैं…' : 'Opening DigiLocker…',
    verified: isHindi ? 'DigiLocker से सत्यापित' : 'Verified via DigiLocker',
    noFiles: isHindi ? 'आपके DigiLocker में कोई जारी दस्तावेज़ नहीं मिला।' : 'No issued documents were returned from your DigiLocker account.',
    retry: isHindi ? 'फिर से प्रयास करें' : 'Try again',
    docs: isHindi ? 'DigiLocker से जारी दस्तावेज़' : 'Documents issued in DigiLocker'
  };

  useEffect(() => () => {
    if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
  }, []);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.source !== popupRef.current || event.data?.type !== 'SCHEMEREADY_DIGILOCKER_CALLBACK') return;
      const data = event.data;
      if (data.status === 'error') {
        setError(data.error || 'DigiLocker verification could not be completed.');
        setStatus('error');
        return;
      }
      const files = Array.isArray(data.documents) ? data.documents : [];
      setDigiLockerId(data.digiLockerId || null);
      setIssuedFiles(files);
      setStatus(files.length > 0 ? 'verified' : 'empty');
      if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const startVerification = async () => {
    setError(null);
    setIssuedFiles([]);
    setDigiLockerId(null);
    setStatus('starting');
    try {
      if (!profile?.id) throw new Error('Please sign in before connecting DigiLocker.');
      const response = await tokenFetchJson('digilocker/authorize', { method: 'GET' });
      if (!response?.authorizationUrl) throw new Error('DigiLocker authorization URL was not returned by the server.');
      const popup = window.open(response.authorizationUrl, 'schemeready-digilocker', 'width=520,height=760,resizable=yes,scrollbars=yes');
      if (!popup) {
        window.location.href = response.authorizationUrl;
        return;
      }
      popupRef.current = popup;
      setStatus('waiting');
    } catch (err) {
      setError(err?.message || 'Unable to start DigiLocker verification. Configure the official DigiLocker Requester credentials on the backend.');
      setStatus('error');
    }
  };

  return <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-blue-700" /></div>
        <div><h3 className="text-base font-black text-slate-900">{text.title}</h3><p className="text-xs text-slate-500 mt-1 max-w-2xl">{text.description}</p></div>
      </div>
      {status === 'verified' && <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-3.5 h-3.5" />{text.verified}</span>}
    </div>

    {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}

    {status !== 'verified' && status !== 'empty' && <button onClick={startVerification} disabled={['starting','waiting'].includes(status)} className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2">
      {['starting','waiting'].includes(status) ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
      <span>{status === 'starting' || status === 'waiting' ? text.connecting : text.connect}</span>
      {status === 'waiting' && <ExternalLink className="w-3.5 h-3.5" />}
    </button>}

    {status === 'error' && <button onClick={startVerification} className="bg-slate-100 border border-slate-300 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" />{text.retry}</button>}

    {status === 'empty' && <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs"><span className="font-semibold">{text.noFiles}</span><button onClick={startVerification} className="font-bold underline">{text.retry}</button></div>}

    {issuedFiles.length > 0 && <div className="space-y-2">
      <div className="text-xs font-black text-slate-800">{text.docs}</div>
      {issuedFiles.map((file, index) => <div key={`${file.uri || file.name || index}`} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/60">
        <div className="flex items-center gap-2 min-w-0"><FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0" /><div className="min-w-0"><div className="text-xs font-bold text-slate-900 truncate">{file.name || file.description || 'DigiLocker document'}</div><div className="text-[10px] text-slate-500 truncate">{file.issuer || file.issuerId || file.documentType || 'Issued document'}</div></div></div>
        <span className="text-[10px] font-bold text-emerald-800 whitespace-nowrap">DigiLocker ✓</span>
      </div>)}
    </div>}

    {digiLockerId && <p className="text-[10px] text-slate-400 font-mono">DigiLocker ID: {digiLockerId}</p>}
  </section>;
}
