import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Mic, MicOff, Send, Volume2, VolumeX, X } from 'lucide-react';
import { extractEntities, matchSchemes } from '../api';
import { CURRENT_NSFDC_GUIDANCE, applicableLocalSchemes } from './schemeGuidance';

const LANGUAGE_CONFIG = {
  en: { recognition: 'en-IN', label: 'English', greeting: 'Hi! I am SchemeReady Voice Assistant. Tell me about your business idea, location, loan amount, or ask what to do next.' },
  hi: { recognition: 'hi-IN', label: 'हिन्दी', greeting: 'नमस्ते! मैं स्कीम रेडी वॉयस असिस्टेंट हूँ। अपने व्यवसाय के विचार, स्थान, ऋण राशि के बारे में बताइए, या अगला कदम पूछिए।' },
  kn: { recognition: 'kn-IN', label: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ! ನಾನು SchemeReady Voice Assistant. ನಿಮ್ಮ ವ್ಯವಹಾರ, ಸ್ಥಳ ಅಥವಾ ಸಾಲದ ಮೊತ್ತದ ಬಗ್ಗೆ ಹೇಳಿ, ಅಥವಾ ಮುಂದಿನ ಹಂತವನ್ನು ಕೇಳಿ.' }
};

const SUGGESTIONS = {
  en: ['Which schemes am I eligible for?', 'Give me complete scheme details', 'What documents do I need?', 'How do I apply?'],
  hi: ['मैं किन योजनाओं के लिए पात्र हूँ?', 'मुझे पूरी योजना जानकारी दें', 'कौन से दस्तावेज़ चाहिए?', 'मैं आवेदन कैसे करूँ?'],
  kn: ['ನನಗೆ ಯಾವ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹತೆ ಇದೆ?', 'ಯೋಜನೆಯ ಸಂಪೂರ್ಣ ವಿವರ ನೀಡಿ', 'ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?', 'ನಾನು ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು?']
};

const money = value => value == null || value === '' ? 'Not provided' : `₹${Number(value).toLocaleString('en-IN')}`;
const lower = value => String(value || '').toLowerCase();

function facts(s) {
  return {
    name: s.schemeName || s.name || 'Scheme',
    score: s.matchScore,
    maxLoan: s.maxLoanEligible || s.loanMax || s.maxLoan,
    interest: s.interestRate || s.beneficiaryInterest || s.interest,
    tenure: s.tenureMonths || s.maximumTenureMonths || s.tenure,
    moratorium: s.moratoriumMonths || s.moratorium,
    positives: s.positiveReasons || [],
    negatives: s.negativeReasons || [],
    documents: s.missingDocuments || [],
    channel: s.partnerAvailability || s.channel,
    source: s.sourceDocument,
    verified: s.lastVerifiedDate,
    url: s.officialUrl
  };
}

function localDetails(profile) {
  return applicableLocalSchemes(profile).map(s => ({
    schemeName: s.name,
    matchScore: 80,
    maxLoanEligible: s.loanMax,
    interestRate: s.beneficiaryInterest || s.beneficiaryInterestRange,
    tenureMonths: s.tenureMonths,
    moratoriumMonths: s.moratoriumMonths,
    positiveReasons: [
      'SC community requirement matches when the profile category is SC.',
      'Annual family income is within the current ₹5 lakh ceiling.',
      'Project cost fits the scheme band.'
    ],
    negativeReasons: profile.hasCasteCertificate ? [] : ['Valid caste certificate is still required.'],
    missingDocuments: profile.hasCasteCertificate ? [] : ['Valid SC caste certificate'],
    partnerAvailability: s.channel,
    sourceDocument: 'Current NSFDC scheme information',
    lastVerifiedDate: CURRENT_NSFDC_GUIDANCE.updated
  }));
}

function fallbackMatches(profile) {
  const local = localDetails(profile);
  if (local.length) return local;
  const income = Number(profile?.annualFamilyIncome || profile?.householdAnnualIncome || 0);
  if (String(profile?.category || '').toUpperCase() !== 'SC' || income <= 0 || income > CURRENT_NSFDC_GUIDANCE.common.annualFamilyIncomeMax) return [];
  return [];
}

function eligibilityText(profile, lang) {
  const categoryOk = String(profile?.category || '').toUpperCase() === 'SC';
  const income = Number(profile?.annualFamilyIncome || profile?.householdAnnualIncome || 0);
  const incomeOk = income > 0 && income <= CURRENT_NSFDC_GUIDANCE.common.annualFamilyIncomeMax;
  const casteOk = !!profile?.hasCasteCertificate;
  const activity = profile?.businessType || 'your proposed activity';

  if (lang === 'kn') return `${activity}ಗಾಗಿ ಪ್ರಾಥಮಿಕ ಪರಿಶೀಲನೆ: ${categoryOk ? 'SC ವರ್ಗ ಹೊಂದಿದೆ' : 'SC ವರ್ಗ ದೃಢಪಟ್ಟಿಲ್ಲ'}, ${incomeOk ? 'ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ ₹5 ಲಕ್ಷದೊಳಗೆ ಇದೆ' : 'ಆದಾಯ ₹5 ಲಕ್ಷ ಮಿತಿಗಿಂತ ಹೆಚ್ಚು ಅಥವಾ ನೀಡಲಾಗಿಲ್ಲ'}, ಮತ್ತು ${casteOk ? 'ಮಾನ್ಯ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ದಾಖಲಾಗಿದೆ' : 'ಮಾನ್ಯ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಬಾಕಿಯಿದೆ'}.`;
  if (lang === 'hi') return `${activity} के लिए प्रारंभिक जांच: ${categoryOk ? 'SC श्रेणी मेल खाती है' : 'SC श्रेणी की पुष्टि नहीं हुई'}, ${incomeOk ? 'वार्षिक पारिवारिक आय ₹5 लाख के भीतर है' : 'आय ₹5 लाख सीमा से अधिक है या उपलब्ध नहीं है'}, और ${casteOk ? 'वैध जाति प्रमाणपत्र दर्ज है' : 'वैध जाति प्रमाणपत्र लंबित है'}.`;
  return `For ${activity}, the preliminary check is: ${categoryOk ? 'SC category matches' : 'SC category is not confirmed'}, ${incomeOk ? 'annual family income is within the current ₹5 lakh ceiling' : 'income is above ₹5 lakh or not provided'}, and ${casteOk ? 'a valid caste certificate is recorded' : 'a valid caste certificate is still pending'}.`;
}

function completeDetails(profile, schemes, lang) {
  const name = profile?.fullName || 'Applicant';
  const cost = money(profile?.estimatedProjectCost);
  const loan = money(profile?.requiredLoanAmount);
  const top = schemes.slice(0, 3).map((s, i) => {
    const f = facts(s);
    return `${i + 1}. ${f.name}${f.score ? ` (${f.score}% match)` : ''} — max loan ${money(f.maxLoan)}, interest ${f.interest ?? 'scheme/channel dependent'}, tenure ${typeof f.tenure === 'number' ? `${f.tenure} months` : f.tenure || 'scheme dependent'}, moratorium ${f.moratorium || 'as applicable'}, channel ${f.channel || 'authorised channelising agency'}.`;
  }).join(' ');

  if (lang === 'kn') return `${name}, ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪ್ರಕಾರ ಯೋಜನಾ ವೆಚ್ಚ ${cost} ಮತ್ತು ಸಾಲದ ಅಗತ್ಯ ${loan}. ${eligibilityText(profile, lang)} ಹೊಂದುವ ಯೋಜನೆಗಳು: ${top || 'ಈಗಿನ ಮಾಹಿತಿಯಿಂದ ಯಾವುದೇ ದೃಢವಾದ ಯೋಜನೆ ಕಂಡುಬಂದಿಲ್ಲ'}. ಎಲ್ಲಾ NSFDC ಕ್ರೆಡಿಟ್ ಅರ್ಜಿಗಳಿಗೆ ಮಾನ್ಯ SC ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ, ಆದಾಯದ ಪುರಾವೆ ಮತ್ತು KYC ಅಗತ್ಯ. ಅರ್ಜಿ PM-SURAJ ಅಥವಾ ಅಧಿಕೃತ Channelising Agency ಮೂಲಕ ಸಲ್ಲಿಸಬೇಕು; NSFDCಗೆ ನೇರ ಸಾಲ ಅರ್ಜಿ ಸ್ವೀಕರಿಸಲಾಗುವುದಿಲ್ಲ.`;
  if (lang === 'hi') return `${name}, आपके प्रोफ़ाइल में परियोजना लागत ${cost} और ऋण आवश्यकता ${loan} है। ${eligibilityText(profile, lang)} उपयुक्त योजनाएँ: ${top || 'वर्तमान जानकारी से कोई स्पष्ट योजना मेल नहीं खाती'}. NSFDC क्रेडिट के लिए वैध SC जाति प्रमाणपत्र, आय प्रमाण और KYC आवश्यक हैं। आवेदन PM-SURAJ या अधिकृत Channelising Agency के माध्यम से करना होता है; NSFDC सीधे ऋण आवेदन स्वीकार नहीं करता.`;
  return `${name}, your profile shows a project cost of ${cost} and a loan requirement of ${loan}. ${eligibilityText(profile, lang)} Applicable schemes: ${top || 'no confirmed scheme match from the current profile'}. NSFDC credit requires a valid SC caste certificate, income proof and KYC. Applications must be routed through PM-SURAJ or an authorised Channelising Agency; NSFDC does not accept direct beneficiary loan applications.`;
}

function getReply(text, lang, profile, schemes) {
  const t = lower(text);
  const eligibility = /eligible|eligibility|पात्र|योग्य|ಅರ್ಹ|ಪಾತ್ರ/.test(t);
  const details = /detail|details|complete|पूरी|विवर|ಸಂಪೂರ್ಣ|ವಿವರ/.test(t);
  const benefit = /benefit|benefits|लाभ|फायदा|ಪ್ರಯೋಜನ/.test(t);
  const docs = /document|documents|दस्तावेज|दस्तावेज़|ದಾಖಲೆ/.test(t);
  const apply = /apply|application|कैसे.*आवेदन|ಅರ್ಜಿ|ಆವেদন/.test(t);
  const loan = /loan|ऋण|साल|ಸಾಲ/.test(t);
  const next = /next|अगला|ಮುಂದಿನ/.test(t);

  if (eligibility || details) return completeDetails(profile, schemes, lang);

  if (benefit) {
    const f = facts(schemes[0] || {});
    if (lang === 'kn') return `${f.name} ಅನ್ವಯಿಸಿದರೆ ವ್ಯವಹಾರ ಪ್ರಾರಂಭಿಸಲು ಅಥವಾ ವಿಸ್ತರಿಸಲು ರಿಯಾಯಿತಿ ಹಣಕಾಸು ನೆರವು ಸಿಗಬಹುದು. ಪ್ರಸ್ತುತ ಗರಿಷ್ಠ ಸಾಲ ${money(f.maxLoan)}, ಬಡ್ಡಿ ${f.interest ?? 'ಯೋಜನೆ/ಚಾನಲ್ ಅವಲಂಬಿತ'}, ಮತ್ತು ಅವಧಿ ${typeof f.tenure === 'number' ? `${f.tenure} ತಿಂಗಳು` : f.tenure || 'ಯೋಜನೆಯ ಪ್ರಕಾರ'}.`;
    if (lang === 'hi') return `${f.name} लागू होने पर व्यवसाय शुरू या विस्तार करने के लिए रियायती वित्त सहायता मिल सकती है। वर्तमान अधिकतम ऋण ${money(f.maxLoan)}, ब्याज ${f.interest ?? 'योजना/चैनल के अनुसार'}, और अवधि ${typeof f.tenure === 'number' ? `${f.tenure} महीने` : f.tenure || 'योजना के अनुसार'} है.`;
    return `${f.name} can provide concessional finance for starting or expanding an income-generating activity. The current maximum loan shown is ${money(f.maxLoan)}, interest is ${f.interest ?? 'scheme/channel dependent'}, and tenure is ${typeof f.tenure === 'number' ? `${f.tenure} months` : f.tenure || 'scheme dependent'}.`;
  }

  if (docs) {
    const missing = schemes.flatMap(s => facts(s).documents).filter(Boolean);
    if (lang === 'kn') return `ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ${profile?.uploadedDocs?.join(', ') || 'ಯಾವುದೇ ಅಪ್‌ಲೋಡ್ ದಾಖಲೆಗಳಿಲ್ಲ'}. ಮುಖ್ಯವಾಗಿ ಮಾನ್ಯ SC ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ, ಆದಾಯದ ಪುರಾವೆ ಮತ್ತು KYC ಸಿದ್ಧವಾಗಿರಲಿ. ${missing.length ? `ಬಾಕಿ ದಾಖಲೆ: ${[...new Set(missing)].join(', ')}.` : 'ಆಯ್ಕೆ ಮಾಡಿದ Channel Partner ಕೇಳುವ ಹೆಚ್ಚುವರಿ ದಾಖಲೆಗಳನ್ನೂ ಸಿದ್ಧಪಡಿಸಿ.'}`;
    if (lang === 'hi') return `आपकी प्रोफ़ाइल में ${profile?.uploadedDocs?.join(', ') || 'अभी कोई अपलोड किए गए दस्तावेज़ नहीं'} हैं। मुख्य रूप से वैध SC जाति प्रमाणपत्र, आय प्रमाण और KYC तैयार रखें। ${missing.length ? `लंबित दस्तावेज़: ${[...new Set(missing)].join(', ')}.` : 'चुनी गई Channelising Agency की अतिरिक्त दस्तावेज़ सूची भी पूरी करें.'}`;
    return `Your profile has ${profile?.uploadedDocs?.join(', ') || 'no uploaded documents yet'}. Keep a valid SC caste certificate, income proof, and KYC ready. ${missing.length ? `Missing documents: ${[...new Set(missing)].join(', ')}.` : 'Also complete any additional documents required by the selected Channelising Agency.'}`;
  }

  if (apply) {
    if (lang === 'kn') return 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಮೊದಲು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ನಂತರ PM-SURAJ ಅಥವಾ ನಿಮ್ಮ ರಾಜ್ಯದ ಅಧಿಕೃತ Channelising Agency/Channel Partner ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ. NSFDCಗೆ ನೇರವಾಗಿ ಸಾಲ ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗುವುದಿಲ್ಲ.';
    if (lang === 'hi') return 'आवेदन से पहले अपनी प्रोफ़ाइल और दस्तावेज़ पूरे करें। फिर PM-SURAJ या अपने राज्य की अधिकृत Channelising Agency/Channel Partner के माध्यम से आवेदन करें। NSFDC को सीधे ऋण आवेदन नहीं दिया जा सकता।';
    return 'Complete your profile and documents first. Then apply through PM-SURAJ or an authorised State/other Channelising Agency or Channel Partner. You cannot submit a direct beneficiary loan application to NSFDC.';
  }

  if (loan) {
    const amount = money(profile?.requiredLoanAmount);
    if (lang === 'kn') return `ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸಾಲದ ಅಗತ್ಯ ${amount}. ಅಂತಿಮ ಅರ್ಹ ಸಾಲ ಮೊತ್ತವು ಆಯ್ಕೆ ಮಾಡಿದ ಯೋಜನೆ ಮತ್ತು Channel Partner ಪರಿಶೀಲನೆಯ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿರುತ್ತದೆ.`;
    if (lang === 'hi') return `आपकी वर्तमान ऋण आवश्यकता ${amount} है। अंतिम पात्र ऋण राशि चुनी गई योजना और Channel Partner की जांच पर निर्भर करेगी.`;
    return `Your current loan requirement is ${amount}. The final eligible loan amount depends on the selected scheme and the Channel Partner's verification.`;
  }

  if (next) {
    if (lang === 'kn') return 'ಮುಂದಿನ ಹಂತ: ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ, ಅನ್ವಯಿಸುವ ಯೋಜನೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ಬಾಕಿ ದಾಖಲೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ ಮತ್ತು ನಂತರ ಅಧಿಕೃತ ಅರ್ಜಿ ಮಾರ್ಗದ ಮೂಲಕ ಸಲ್ಲಿಸಿ.';
    if (lang === 'hi') return 'अगला कदम: प्रोफ़ाइल पूरी करें, लागू योजना चुनें, लंबित दस्तावेज़ पूरे करें और फिर अधिकृत आवेदन मार्ग से जमा करें.';
    return 'Next: complete your profile, select the applicable scheme, finish missing documents, and submit through the authorised application route.';
  }

  return lang === 'kn'
    ? 'ನಾನು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಆಧಾರದಲ್ಲಿ ಅನ್ವಯಿಸುವ ಯೋಜನೆ, ಅರ್ಹತೆ, ಪ್ರಯೋಜನಗಳು, ಸಾಲದ ಮಿತಿ, ದಾಖಲೆಗಳು ಮತ್ತು ಅರ್ಜಿ ವಿಧಾನವನ್ನು ವಿವರಿಸಬಹುದು. “ನನಗೆ ಯಾವ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹತೆ ಇದೆ?” ಎಂದು ಕೇಳಿ.'
    : lang === 'hi'
      ? 'मैं आपके प्रोफ़ाइल के आधार पर लागू योजना, पात्रता, लाभ, ऋण सीमा, दस्तावेज़ और आवेदन प्रक्रिया समझा सकता हूँ। पूछें: “मैं किन योजनाओं के लिए पात्र हूँ?”'
      : 'I can explain the schemes applicable to your profile, eligibility, benefits, loan limits, documents, application route, and next steps. Ask: “Which schemes am I eligible for?”';
}

export default function AIVoiceAssistant({ lang = 'en', profile, setProfile, onNavigate }) {
  const config = LANGUAGE_CONFIG[lang] || LANGUAGE_CONFIG.en;
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [input, setInput] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [messages, setMessages] = useState([{ role: 'assistant', text: config.greeting }]);
  const recognitionRef = useRef(null);
  const voicesRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;
    const load = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  useEffect(() => {
    setMessages([{ role: 'assistant', text: config.greeting }]);
    recognitionRef.current?.abort?.();
    setListening(false);
    window.speechSynthesis?.cancel?.();
    setSpeaking(false);
  }, [lang, config.greeting]);

  useEffect(() => () => {
    recognitionRef.current?.abort?.();
    window.speechSynthesis?.cancel?.();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadSchemes = async () => {
      try {
        const result = await matchSchemes(profile || {});
        if (!cancelled && Array.isArray(result)) {
          setSchemes(result);
          return;
        }
      } catch (error) {
        console.warn('Scheme guidance API unavailable:', error);
      }
      if (!cancelled) setSchemes(fallbackMatches(profile || {}));
    };
    loadSchemes();
    return () => { cancelled = true; };
  }, [profile]);

  const suggestions = useMemo(() => SUGGESTIONS[lang] || SUGGESTIONS.en, [lang]);
  const supported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const speak = text => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = config.recognition;
    const prefix = lang === 'kn' ? 'kn' : lang === 'hi' ? 'hi' : 'en';
    const voice = voicesRef.current.find(v => v.lang?.toLowerCase().startsWith(prefix));
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const applyEntities = async text => {
    try {
      const extracted = await extractEntities(text, lang);
      if (!extracted) return null;
      setProfile?.(prev => ({
        ...prev,
        ...(extracted.businessType ? { businessType: extracted.businessType } : {}),
        ...(extracted.location ? { location: extracted.location } : {}),
        ...(extracted.requiredAmount ? { requiredLoanAmount: extracted.requiredAmount, estimatedProjectCost: Math.round(Number(extracted.requiredAmount) * 1.15) } : {}),
        ...(extracted.userType ? { userType: extracted.userType } : {})
      }));
      return extracted;
    } catch (error) {
      console.warn('Voice entity extraction failed:', error);
      return null;
    }
  };

  const submit = async raw => {
    const text = String(raw || input).trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    const extracted = await applyEntities(text);
    const nextProfile = extracted ? {
      ...profile,
      ...(extracted.businessType ? { businessType: extracted.businessType } : {}),
      ...(extracted.location ? { location: extracted.location } : {}),
      ...(extracted.requiredAmount ? { requiredLoanAmount: extracted.requiredAmount, estimatedProjectCost: Math.round(Number(extracted.requiredAmount) * 1.15) } : {}),
      ...(extracted.userType ? { userType: extracted.userType } : {})
    } : profile;

    let currentSchemes = schemes;
    try {
      const fresh = await matchSchemes(nextProfile || {});
      if (Array.isArray(fresh)) currentSchemes = fresh;
    } catch {
      currentSchemes = fallbackMatches(nextProfile || {});
    }
    if (!currentSchemes.length) currentSchemes = localDetails(nextProfile || {});

    const reply = getReply(text, lang, nextProfile || {}, currentSchemes);
    setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    speak(reply);

    const t = lower(text);
    if ((t.includes('onboarding') || t.includes('ಆನ್‌ಬೋರ್ಡಿಂಗ್') || t.includes('ऑनबोर्डिंग')) && onNavigate) onNavigate('onboarding');
    else if ((t.includes('scheme') || t.includes('ಯೋಜನೆ') || t.includes('योजना') || /eligible|पात्र|ಅರ್ಹ/.test(t)) && onNavigate) onNavigate('schemes');
    else if ((t.includes('document') || t.includes('ದಾಖಲೆ') || t.includes('दस्तावेज')) && onNavigate) onNavigate('checklist');
  };

  const startListening = () => {
    if (!supported) {
      const msg = lang === 'kn' ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ speech recognition ಲಭ್ಯವಿಲ್ಲ. ಕೆಳಗಿನ ಪಠ್ಯ ಬಾಕ್ಸ್ ಬಳಸಿ.' : lang === 'hi' ? 'इस ब्राउज़र में speech recognition उपलब्ध नहीं है। नीचे टेक्स्ट बॉक्स का उपयोग करें।' : 'Speech recognition is not available in this browser. Please use the text box below.';
      setMessages(prev => [...prev, { role: 'assistant', text: msg }]);
      speak(msg);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current?.abort?.();
    const r = new SpeechRecognition();
    r.lang = config.recognition;
    r.continuous = false;
    r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = e => { setListening(false); submit(e.results?.[0]?.[0]?.transcript || ''); };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recognitionRef.current = r;
    r.start();
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {open && (
          <div className="w-[min(92vw,390px)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15"><Bot className="h-5 w-5" /></div>
                <div>
                  <p className="font-bold">{lang === 'hi' ? 'स्कीम रेडी एआई सहायक' : lang === 'kn' ? 'ಸ್ಕೀಮ್‌ರೆಡಿ ಎಐ ಸಹಾಯಕ' : 'SchemeReady AI Assistant'}</p>
                  <p className="text-[11px] text-emerald-50">{lang === 'hi' ? 'वॉयस ऑनबोर्डिंग' : lang === 'kn' ? 'ಧ್ವನಿ ಆನ್‌ಬೋರ್ಡಿಂಗ್' : 'Voice onboarding'} · {config.label}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/15" aria-label="Close assistant"><X className="h-4 w-4" /></button>
            </div>

            <div className="max-h-[52vh] space-y-3 overflow-y-auto bg-slate-50 p-4">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'bg-emerald-600 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {speaking && <div className="text-[11px] font-medium text-emerald-700">{lang === 'hi' ? 'बोल रहे हैं…' : lang === 'kn' ? 'ಮಾತನಾಡುತ್ತಿದ್ದಾರೆ…' : 'Speaking…'}</div>}
            </div>

            <div className="border-t border-slate-200 bg-white p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {suggestions.map(item => <button key={item} onClick={() => submit(item)} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700">{item}</button>)}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={startListening} disabled={listening} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${listening ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`} aria-label={listening ? 'Listening' : 'Start voice input'}>
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submit(); }} placeholder={lang === 'kn' ? 'ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...' : lang === 'hi' ? 'यहाँ टाइप करें...' : 'Ask SchemeReady...'} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                <button onClick={() => submit()} disabled={!input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white disabled:opacity-40" aria-label="Send message"><Send className="h-4 w-4" /></button>
                <button onClick={() => speaking ? window.speechSynthesis?.cancel() : speak(messages[messages.length - 1]?.text || config.greeting)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" aria-label={speaking ? 'Stop speaking' : 'Read latest answer aloud'}>
                  {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => setOpen(value => !value)} className="group flex items-center gap-3 rounded-full bg-slate-950 px-4 py-3 text-white shadow-xl ring-4 ring-white/80 hover:scale-[1.02]" aria-label="Open SchemeReady AI Voice Assistant">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-md"><Mic className="h-5 w-5" /></span>
          <span className="pr-1 text-left"><span className="block text-xs font-bold">{lang === 'hi' ? 'स्कीम रेडी से पूछें' : lang === 'kn' ? 'ಸ್ಕೀಮ್‌ರೆಡಿ ಕೇಳಿ' : 'Ask SchemeReady'}</span><span className="block text-[11px] text-slate-300">{lang === 'hi' ? 'वॉयस + एआई मार्गदर्शन' : lang === 'kn' ? 'ಧ್ವನಿ + ಎಐ ಮಾರ್ಗದರ್ಶನ' : 'Voice + AI guidance'}</span></span>
        </button>
      </div>
    </>
  );
}
