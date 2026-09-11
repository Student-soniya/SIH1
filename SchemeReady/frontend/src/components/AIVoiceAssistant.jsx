import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Mic, MicOff, Send, Volume2, VolumeX, X } from 'lucide-react';
import { extractEntities } from '../api';
import { localizeTernary } from '../l10n';

const LANGUAGE_CONFIG = {
  en: { recognition: 'en-IN', label: 'English', greeting: 'Hi! I am SchemeReady Voice Assistant. Tell me about your business idea, location, loan amount, or ask what to do next.' },
  hi: { recognition: 'hi-IN', label: 'हिन्दी', greeting: 'नमस्ते! मैं स्कीम रेडी वॉयस असिस्टेंट हूँ। अपने व्यवसाय के विचार, स्थान, ऋण राशि के बारे में बताइए, या अगला कदम पूछिए।' },
  kn: { recognition: 'kn-IN', label: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ! ನಾನು SchemeReady Voice Assistant. ನಿಮ್ಮ ವ್ಯವಹಾರ, ಸ್ಥಳ ಅಥವಾ ಸಾಲದ ಮೊತ್ತದ ಬಗ್ಗೆ ಹೇಳಿ, ಅಥವಾ ಮುಂದಿನ ಹಂತವನ್ನು ಕೇಳಿ.' },
  ta: { recognition: 'ta-IN', label: 'தமிழ்', greeting: 'வணக்கம்! நான் SchemeReady Voice Assistant. உங்கள் தொழில் யோசனை, இடம், கடன் தொகை பற்றி சொல்லுங்கள் அல்லது அடுத்த கட்டத்தை கேளுங்கள்.' },
  te: { recognition: 'te-IN', label: 'తెలుగు', greeting: 'నమస్కారం! నేను SchemeReady Voice Assistant. మీ వ్యాపార ఆలోచన, ప్రాంతం, లోన్ మొత్తం గురించి చెప్పండి లేదా తదుపరి దశను అడగండి.' },
  mr: { recognition: 'mr-IN', label: 'मराठी', greeting: 'नमस्कार! मी SchemeReady Voice Assistant आहे. तुमच्या व्यवसायाची कल्पना, ठिकाण, कर्जाची रक्कम सांगा किंवा पुढील पायरी विचारा.' },
  bn: { recognition: 'bn-IN', label: 'বাংলা', greeting: 'নমস্কার! আমি SchemeReady Voice Assistant. আপনার ব্যবসার পরিকল্পনা, অবস্থান, ঋণের পরিমাণ সম্পর্কে বলুন বা পরবর্তী পদক্ষেপ জিজ্ঞাসা করুন।' }
};

const SUGGESTIONS = {
  en: ['Start onboarding', 'What documents do I need?', 'How much loan do I need?', 'What should I do next?'],
  hi: ['ऑनबोर्डिंग शुरू करें', 'कौन से दस्तावेज़ चाहिए?', 'मुझे कितना ऋण चाहिए?', 'अगला कदम क्या है?'],
  kn: ['ಆನ್‌ಬೋರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ', 'ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?', 'ಎಷ್ಟು ಸಾಲ ಬೇಕು?', 'ಮುಂದಿನ ಹಂತ ಏನು?'],
  ta: ['ஆன்போர்டிங் தொடங்கவும்', 'என்ன ஆவணங்கள் தேவை?', 'எனக்கு எவ்வளவு கடன் தேவை?', 'அடுத்த கட்டம் என்ன?'],
  te: ['ఆన్‌బోర్డింగ్ ప్రారంభించండి', 'ఏ పత్రాలు అవసరం?', 'నాకు ఎంత రుణం కావాలి?', 'తదుపరి దశ ఏమిటి?'],
  mr: ['ऑनबोर्डिंग सुरू करा', 'कोणती कागदपत्रे लागतील?', 'मला किती कर्ज हवे?', 'पुढील पायरी काय आहे?'],
  bn: ['অনবোর্ডিং শুরু করুন', 'কী কী নথি লাগবে?', 'আমার কত ঋণ দরকার?', 'পরবর্তী পদক্ষেপ কী?']
};

function getReply(text, lang, profile) {
  const normalized = text.toLowerCase();
  const name = profile?.fullName || 'there';
  const location = profile?.location || 'your location';
  const business = profile?.businessType || 'your business';
  const loan = profile?.requiredLoanAmount ? `₹${Number(profile.requiredLoanAmount).toLocaleString('en-IN')}` : 'the amount you need';

  if (lang === 'kn') {
    if (normalized.includes('ದಾಖಲೆ') || normalized.includes('document')) return `ಪ್ರಸ್ತುತ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ Aadhaar/KYC ಮತ್ತು ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ದಾಖಲಾಗಿದೆ. ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಬಾಕಿ ಇದ್ದರೆ ಅದನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ನಂತರ Readiness ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ.`;
    if (normalized.includes('ಮುಂದಿನ') || normalized.includes('next')) return `ಮುಂದಿನ ಹಂತವಾಗಿ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ, ಹೊಂದುವ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನಂತರ Readiness Dashboard ಗೆ ಹೋಗಿ.`;
    if (normalized.includes('ಸಾಲ') || normalized.includes('loan')) return `ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಅಗತ್ಯ ${loan}. ಮೊತ್ತವನ್ನು ನಿಖರವಾಗಿ ಹೇಳಿದರೆ ನಾನು onboarding profile ಅನ್ನು update ಮಾಡುತ್ತೇನೆ.`;
    if (normalized.includes('ಯೋಜನೆ') || normalized.includes('scheme')) return `${name}, ನಿಮ್ಮ ${business} ವ್ಯವಹಾರ ಮತ್ತು ${location} ಆಧಾರದ ಮೇಲೆ Scheme Matcher ಹೊಂದುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸುತ್ತದೆ.`;
    return `${name}, ನಿಮ್ಮ ${business} ಯೋಜನೆ ${location} ನಲ್ಲಿ ಇದೆ ಎಂದು ನೋಡುತ್ತಿದ್ದೇನೆ. ನಾನು ನಿಮ್ಮ onboarding ಮಾಹಿತಿಯನ್ನು ಧ್ವನಿಯಿಂದ ತುಂಬಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.`;
  }

  if (lang === 'hi') {
    if (normalized.includes('document') || normalized.includes('दस्तावेज')) return `आपकी प्रोफ़ाइल में Aadhaar/KYC और आय प्रमाणपत्र दर्ज हैं। यदि जाति प्रमाणपत्र लंबित है, तो उसे पूरा करें और फिर Readiness Dashboard पर जाएँ।`;
    if (normalized.includes('next') || normalized.includes('अगला')) return `${name}, पहले अपनी प्रोफ़ाइल पूरी करें, फिर मिलान की गई योजनाएँ देखें और Readiness Dashboard पर जाएँ।`;
    if (normalized.includes('loan') || normalized.includes('ऋण')) return `आपकी वर्तमान आवश्यकता ${loan} है। सही राशि बताइए और मैं onboarding profile अपडेट कर दूँगा।`;
    if (normalized.includes('scheme') || normalized.includes('योजना')) return `${name}, आपके ${business} और ${location} के आधार पर Scheme Matcher उपयुक्त सरकारी योजनाएँ दिखाएगा।`;
    return `${name}, मैं देख रहा हूँ कि आपका ${business} व्यवसाय ${location} में है। मैं आपकी onboarding जानकारी आवाज़ से भरने में मदद कर सकता हूँ।`;
  }

  if (normalized.includes('document')) return `Your profile currently has Aadhaar/KYC and an income certificate. If the caste certificate is still pending, complete it and then open the Readiness Dashboard.`;
  if (normalized.includes('next')) return `${name}, complete your profile, review the matched schemes, and then continue to the Readiness Dashboard.`;
  if (normalized.includes('loan')) return `Your current loan requirement is ${loan}. Tell me the exact amount and I can update your onboarding profile.`;
  if (normalized.includes('scheme')) return `${name}, Scheme Matcher will use your ${business} and ${location} details to show suitable government schemes.`;
  return `${name}, I can help you fill the SchemeReady onboarding by voice. Tell me your business idea, location, project cost, family income, or loan requirement.`;
}

export default function AIVoiceAssistant({ lang = 'en', profile, setProfile, onNavigate }) {
  const config = LANGUAGE_CONFIG[lang] || LANGUAGE_CONFIG.en;
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => [{ role: 'assistant', text: (LANGUAGE_CONFIG[lang] || LANGUAGE_CONFIG.en).greeting }]);
  const recognitionRef = useRef(null);
  const voicesRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;
    const loadVoices = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  useEffect(() => {
    const message = { role: 'assistant', text: config.greeting };
    setMessages([message]);
    setInput('');
  }, [lang]);

  useEffect(() => () => {
    recognitionRef.current?.abort?.();
    window.speechSynthesis?.cancel?.();
  }, []);

  const suggestions = useMemo(() => SUGGESTIONS[lang] || SUGGESTIONS.en, [lang]);
  const supported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const speak = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = config.recognition;
    const prefix = lang === 'kn' ? 'kn' : lang === 'hi' ? 'hi' : 'en';
    const voice = voicesRef.current.find(v => v.lang?.toLowerCase().startsWith(prefix));
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const applyEntities = async (text) => {
    try {
      const extracted = await extractEntities(text, lang);
      if (!extracted) return extracted;
      setProfile?.(prev => ({
        ...prev,
        ...(extracted.businessType ? { businessType: extracted.businessType } : {}),
        ...(extracted.location ? { location: extracted.location } : {}),
        ...(extracted.requiredAmount ? {
          requiredLoanAmount: extracted.requiredAmount,
          estimatedProjectCost: Math.round(Number(extracted.requiredAmount) * 1.15)
        } : {}),
        ...(extracted.userType ? { userType: extracted.userType } : {})
      }));
      return extracted;
    } catch (error) {
      console.warn('Voice entity extraction failed:', error);
      return null;
    }
  };

  const submit = async (rawText) => {
    const text = (rawText || input).trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');

    const extracted = await applyEntities(text);
    const reply = extracted?.localizedSummary?.[lang] || getReply(text, lang, { ...profile, ...((extracted && {
      businessType: extracted.businessType,
      location: extracted.location,
      requiredLoanAmount: extracted.requiredAmount,
      userType: extracted.userType
    }) || {}) });

    setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    speak(reply);

    const lower = text.toLowerCase();
    if ((lower.includes('onboarding') || lower.includes('ಆನ್‌ಬೋರ್ಡಿಂಗ್') || lower.includes('ऑनबोर्डिंग')) && onNavigate) onNavigate('onboarding');
    else if ((lower.includes('scheme') || lower.includes('ಯೋಜನೆ') || lower.includes('योजना')) && onNavigate) onNavigate('schemes');
    else if ((lower.includes('readiness') || lower.includes('readiness dashboard')) && onNavigate) onNavigate('readiness');
  };

  const startListening = () => {
    if (!supported) {
      const reply = lang === 'kn' ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ speech recognition ಲಭ್ಯವಿಲ್ಲ. ಕೆಳಗಿನ ಪಠ್ಯ ಬಾಕ್ಸ್ ಬಳಸಿ.' : lang === 'hi' ? 'आपके ब्राउज़र में speech recognition उपलब्ध नहीं है। नीचे टेक्स्ट बॉक्स का उपयोग करें।' : 'Speech recognition is not available in this browser. Please use the text box below.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      speak(reply);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current?.abort?.();
    const recognition = new SpeechRecognition();
    recognition.lang = config.recognition;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onresult = event => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setListening(false);
      submit(transcript);
    };
    recognition.onerror = event => {
      console.warn('Speech recognition error:', event.error);
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <>
      <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 flex flex-col items-end gap-3">
        {open && (
          <div className="w-[min(94vw,400px)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15"><Bot className="h-5 w-5" /></div>
                <div>
                  <p className="font-bold text-sm leading-tight">{localizeTernary('स्कीम रेडी एआई सहायक', 'SchemeReady AI Assistant', lang)}</p>
                  <p className="text-[11px] text-emerald-50">{localizeTernary('वॉयस ऑनबोर्डिंग', 'Voice onboarding', lang)} · {config.label}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-xl p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/15 cursor-pointer" aria-label="Close assistant"><X className="h-4 w-4" /></button>
            </div>

            <div className="max-h-[52vh] space-y-3 overflow-y-auto bg-slate-50 p-4">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'bg-emerald-600 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {speaking && <div className="text-[11px] font-medium text-emerald-700">{localizeTernary('बोल रहे हैं…', 'Speaking…', lang)}</div>}
            </div>

            <div className="border-t border-slate-200 bg-white p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {suggestions.map(item => <button key={item} onClick={() => submit(item)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700 min-h-[32px] cursor-pointer">{item}</button>)}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={startListening} disabled={listening} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl cursor-pointer ${listening ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`} aria-label={listening ? 'Listening' : 'Start voice input'}>
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submit(); }} placeholder={localizeTernary('यहाँ टाइप करें...', 'Ask SchemeReady...', lang)} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                <button onClick={() => submit()} disabled={!input.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white disabled:opacity-40 cursor-pointer" aria-label="Send message"><Send className="h-4 w-4" /></button>
                <button onClick={() => speaking ? window.speechSynthesis?.cancel() : speak(messages[messages.length - 1]?.text || config.greeting)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer" aria-label={speaking ? 'Stop speaking' : 'Read latest answer aloud'}>
                  {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => setOpen(value => !value)} className="group flex items-center gap-3 rounded-full bg-slate-950 px-4 py-3 text-white shadow-xl ring-4 ring-white/80 hover:scale-[1.02] min-h-[48px] cursor-pointer" aria-label="Open SchemeReady AI Voice Assistant">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-md shrink-0"><Mic className="h-5 w-5" /></span>
          <span className="pr-1 text-left hidden sm:block"><span className="block text-xs font-bold">{localizeTernary('स्कीम रेडी से पूछें', 'Ask SchemeReady', lang)}</span><span className="block text-[11px] text-slate-300">{localizeTernary('वॉयस + एआई मार्गदर्शन', 'Voice + AI guidance', lang)}</span></span>
        </button>
      </div>
    </>
  );
}
