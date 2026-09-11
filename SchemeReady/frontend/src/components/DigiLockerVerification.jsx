import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ExternalLink, ShieldCheck, Loader2, AlertCircle, FileCheck2, RefreshCw } from 'lucide-react';
import { tokenFetch, tokenFetchJson } from '../auth/tokenFetch';

export default function DigiLockerVerification({ lang = 'en', profile }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [issuedFiles, setIssuedFiles] = useState([]);
  const popupRef = useRef(null);

  const isHindi = lang === 'hi';
  const text = {
    title: isHindi ? 'DigiLocker दस्तावेज़ सत्यापन' : 'DigiLocker Document Verification',
    description: isHindi
      ? 'DigiLocker से सहमति देकर जारी दस्तावेज़ प्राप्त करें। केवल DigiLocker से सफलतापूर्वक प्राप्त दस्तावेज़ को DigiLocker सत्यापित दिखाया जाएगा।'
      : 'Give consent through DigiLocker to retrieve your issued documents. A document is shown as DigiLocker verified only after a successful DigiLocker response.',
    connect: isHindi ? 'DigiLocker से कनेक्ट करें' : 'Connect DigiLocker',
    connecting: isHindi ? 'DigiLocker खोल रहे हैं…' : 'Opening DigiLocker…',
    retrieving: isHindi ? 'जारी दस्तावेज़ प्राप्त हो रहे हैं…' : 'Retrieving issued documents…',
    verified: isHindi ? 'DigiLocker से सत्यापित' : 'Verified via DigiLocker',
    noFiles: isHindi ? 'DigiLocker से कोई जारी दस्तावेज़ नहीं मिला।' : 'No issued documents were returned by DigiLocker.',
    retry: isHindi ? 'फिर से प्रयास करें' : 'Try again'
  };

  useEffect(() => () => {
    if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
  }, []);

  useEffect(() => {
    const onMessage = async (event) => {
      if (event.origin !== window.location.origin || event.data?.type !== 'SCHEMEREADY_DIGILOCKER_CALLBACK') return;
      const txn = event.data.transactionId;
      if (!txn) {
        setError(event.data.error || 'DigiLocker did not return a transaction ID.');
        setStatus('error');
        return;
      }
      setTransactionId(txn);
      setStatus('retrieving');
      try {
        const response = await tokenFetchJson('decentro/digilocker/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initialDecentroTransactionId: txn })
        });
        const files = Array.isArray(response) ? response : (Array.isArray(response?.data) ? response.data : []);
        setIssuedFiles(files);
        setStatus(files.length ? 'verified' : 'empty');
      } catch (err) {
        setError(err?.message || 'Unable to retrieve DigiLocker documents.');
        setStatus('error');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const startVerification = async () => {
    setError(null);
    setIssuedFiles([]);
    setStatus('starting');
    try {
      if (!profile?.id) throw new Error('Please sign in before connecting DigiLocker.');
      const session = await tokenFetchJson('decentro/digilocker/session/me', { method: 'POST' });
      if (!session?.authorizationUrl) throw new Error('DigiLocker authorization URL was not returned by the server.');
      setTransactionId(session.decentroTransactionId || null);
      const popup = window.open(session.authorizationUrl, 'schemeready-digilocker', 'width=520,height=720,resizable=yes,scrollbars=yes');
      if (!popup) {
        window.location.href = session.authorizationUrl;
        return;
      }
      popupRef.current = popup;
      setStatus('waiting');
    } catch (err) {
      setError(err?.message || 'Unable to start DigiLocker verification. Configure the Decentro credentials and redirect URI on the backend.');
      setStatus('error');
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-blue-700" /></div>
          <div><h3 className="text-base font-black text-slate-900">{text.title}</h3><p className="text-xs text-slate-500 mt-1 max-w-2xl">{text.description}</p></div>
        </div>
        {status === 'verified' && <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-3.5 h-3.5" />{text.verified}</span>}
      </div>

      {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}

      {status !== 'verified' && status !== 'empty' && (
        <button onClick={startVerification} disabled={['starting','waiting','retrieving'].includes(status)} className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2">
          {['starting','waiting','retrieving'].includes(status) ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          <span>{status === 'retrieving' ? text.retrieving : status === 'starting' || status === 'waiting' ? text.connecting : text.connect}</span>
          {status === 'waiting' && <ExternalLink className="w-3.5 h-3.5" />}
        </button>
      )}

      {status === 'error' && <button onClick={startVerification} className="bg-slate-100 border border-slate-300 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" />{text.retry}</button>}

      {status === 'empty' && <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs"><span className="font-semibold">{text.noFiles}</span><button onClick={startVerification} className="font-bold underline">{text.retry}</button></div>}

      {issuedFiles.length > 0 && <div className="space-y-2"><div className="text-xs font-black text-slate-800">DigiLocker issued documents</div>{issuedFiles.map((file, index) => <div key={`${file.uri || file.name || index}`} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/60"><div className="flex items-center gap-2 min-w-0"><FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0" /><div className="min-w-0"><div className="text-xs font-bold text-slate-900 truncate">{file.name || file.DocumentType || 'DigiLocker document'}</div><div className="text-[10px] text-slate-500 truncate">{file.issuer || file.issuerId || file.description || 'Issued document'}</div></div></div><span className="text-[10px] font-bold text-emerald-800 whitespace-nowrap">DigiLocker ✓</span></div>)}</div>}

      {transactionId && <p className="text-[10px] text-slate-400 font-mono">Transaction: {transactionId}</p>}
    </section>
  );
}
