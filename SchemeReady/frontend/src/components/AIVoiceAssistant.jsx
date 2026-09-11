import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Mic, MicOff, Send, Volume2, VolumeX, X } from 'lucide-react';
import { extractEntities, matchSchemes } from '../api';

const LANGUAGE_CONFIG = {
  en: {
    recognition: 'en-IN',
    label: 'English',
    greeting: 'Hi! I am SchemeReady Voice Assistant. I can explain schemes applicable to you, eligibility, benefits, documents, loan limits, and your next steps.',
    placeholder: 'Ask about your schemes, eligibility, documents…'
  },
  hi: {
    recognition: 'hi-IN',
    label: 'Hindi',
    greeting: 'नमस्ते! मैं SchemeReady Voice Assistant हूँ। मैं आपके लिए लागू योजनाएँ, पात्रता, लाभ, दस्तावेज़, ऋण सीमा और अगले कदम समझा सकता हूँ।',
    placeholder: 'योजना, पात्रता, दस्तावेज़ के बारे में पूछें…'
  },
  kn: {
    recognition: 'kn-IN',
    label: 'Kannada',
    greeting: 'ನಮಸ್ಕಾರ! ನಾನು SchemeReady Voice Assistant. ನಿಮಗೆ ಅನ್ವಯಿಸುವ ಯೋಜನೆಗಳು, ಅರ್ಹತೆ, ಪ್ರಯೋಜನಗಳು, ದಾಖಲೆಗಳು, ಸಾಲದ ಮಿತಿ ಮತ್ತು ಮುಂದಿನ ಹಂತಗಳನ್ನು ವಿವರಿಸುತ್ತೇನೆ.',
    placeholder: 'ಯೋಜನೆ, ಅರ್ಹತೆ, ದಾಖಲೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ…'
  }
};

const SUGGESTIONS = {
  en: ['Which schemes am I eligible for?', 'What are the benefits?', 'What documents do I need?', 'What should I do next?'],
  hi: ['मैं किन योजनाओं के लिए पात्र हूँ?', 'मुझे क्या लाभ मिलेंगे?', 'कौन से दस्तावेज़ चाहिए?', 'अगला कदम क्या है?'],
  kn: ['ನನಗೆ ಯಾವ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹತೆ ಇದೆ?', 'ನನಗೆ ಯಾವ ಪ್ರಯೋಜನಗಳು ಸಿಗುತ್ತವೆ?', 'ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?', 'ಮುಂದಿನ ಹಂತ ಏನು?']
};

const money = value => value == null || value === '' ? 'Not provided' : `₹${Number(value).toLocaleString('en-IN')}`;

function schemeFacts(scheme) {
  return {
    name: scheme.schemeName || scheme.name || 'Scheme',
    score: scheme.matchScore,
    maxLoan: scheme.maxLoanEligible || scheme.maxLoan || scheme.maximumLoan,
    interest: scheme.interestRate,
    tenure: scheme.tenureMonths || scheme.maximumTenureMonths,
    moratorium: scheme.moratoriumMonths,
    positives: scheme.positiveReasons || [],
    negatives: scheme.negativeReasons || [],
    documents: scheme.missingDocuments || [],
    mode: scheme.partnerAvailability,
    source: scheme.sourceDocument,
    verified: scheme.lastVerifiedDate,
    officialUrl: scheme.officialUrl
  };
}

function fallbackSchemes(profile) {
  const cost = Number(profile?.estimatedProjectCost || 0);
  const income = Number(profile?.annualFamilyIncome || profile?.householdAnnualIncome || 0);
  const categoryOk = String(profile?.category || '').toUpperCase() === 'SC';
  const incomeOk = income > 0 && income <= 500000;
  const casteDocOk = !!profile?.hasCasteCertificate;
  const results = [];

  if (categoryOk && incomeOk) {
    if (cost > 140000) {
      results.push({ schemeName: 'Term Loan', matchScore: 92, maxLoanEligible: 4500000, interestRate: 8, tenureMonths: 84, moratoriumMonths: 6, positiveReasons: ['SC category matches the target group.', 'Annual family income is within the current ₹5 lakh ceiling.', 'Project cost is above ₹1.40 lakh, which fits the larger-project band.'], negativeReasons: casteDocOk ? [] : ['Valid caste certificate is still required.'], missingDocuments: casteDocOk ? [] : ['Valid caste certificate'], officialUrl: 'https://nsfdc.nic.in/', sourceDocument: 'Current NSFDC scheme information', lastVerifiedDate: new Date().toISOString() });
    } else {
      results.push({ schemeName: 'Micro Finance Scheme (MFS)', matchScore: 94, maxLoanEligible: 125000, interestRate: 6.5, tenureMonths: 36, moratoriumMonths: 3, positiveReasons: ['SC category matches the target group.', 'Annual family income is within the current ₹5 lakh ceiling.', 'Project cost is within the micro-credit band.'], negativeReasons: casteDocOk ? [] : ['Valid caste certificate is still required.'], missingDocuments: casteDocOk ? [] : ['Valid caste certificate'], officialUrl: 'https://nsfdc.nic.in/', sourceDocument: 'Current NSFDC scheme information', lastVerifiedDate: new Date().toISOString() });
      results.push({ schemeName: 'Aajeevika Micro-Finance Yojana (AMY)', matchScore: 86, maxLoanEligible: 125000, interestRate: 15, tenureMonths: 36, moratoriumMonths: 3, positiveReasons: ['SC category matches the target group.', 'Income is within the current ₹5 lakh ceiling.', 'Project cost is in the supported micro-finance band.'], negativeReasons: ['Implemented through selected NBFC-MFIs.'], missingDocuments: casteDocOk ? [] : ['Valid caste certificate'], officialUrl: 'https://nsfdc.nic.in/', sourceDocument: 'Current NSFDC scheme information', lastVerifiedDate: new Date().toISOString() });
    }
    if (cost > 0 && cost <= 500000) {
      results.push({ schemeName: 'Udyam Nidhi Yojana (UNY)', matchScore: 80, maxLoanEligible: 450000, interestRate: 13, tenureMonths: 60, moratoriumMonths: 3, positiveReasons: ['SC category matches the target group.', 'Project cost is within the ₹5 lakh project limit.'], negativeReasons: ['Interest and implementation channel depend on the selected partner.'], missingDocuments: casteDocOk ? [] : ['Valid caste certificate'], officialUrl: 'https://nsfdc.nic.in/', sourceDocument: 'Current NSFDC scheme information', lastVerifiedDate: new Date().toISOString() });
    }
  }

  return results;
}

function buildEligibility(profile, lang) {
  const category = String(profile?.category || '').toUpperCase();
  const income = Number(profile?.annualFamilyIncome || profile?.householdAnnualIncome || 0);
  const categoryOk = category === 'SC';
  const incomeOk = income > 0 && income <= 500000;
  const casteDocOk = !!profile?.hasCasteCertificate;
  const business = profile?.businessType || 'your proposed activity';
  const cost = Number(profile?.estimatedProjectCost || 0);

  const common = {
    category,
    income,
    categoryOk,
    incomeOk,
    casteDocOk,
    business,
    cost,
    overall: categoryOk && incomeOk && casteDocOk
  };

  if (lang === 'kn') {
    return `${business}ಗಾಗಿ ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ಅರ್ಹತೆ: ${categoryOk ? 'SC ವರ್ಗ ಹೊಂದಿದೆ' : 'SC ವರ್ಗದ ಮಾಹಿತಿ ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ'}, ${incomeOk ? 'ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ ₹5 ಲಕ್ಷದೊಳಗೆ ಇದೆ' : 'ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ ₹5 ಲಕ್ಷ ಮಿತಿಯನ್ನು ಮೀರಿದೆ ಅಥವಾ ಮಾಹಿತಿ ಇಲ್ಲ'}, ${casteDocOk ? 'ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ದಾಖಲಾಗಿದೆ' : 'ಮಾನ್ಯ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಬಾಕಿಯಿದೆ'}.`;
  }
  if (lang === 'hi') {
    return `आपके ${business} के लिए प्रारंभिक पात्रता: ${categoryOk ? 'SC श्रेणी मेल खाती है' : 'SC श्रेणी की पुष्टि नहीं हुई'}, ${incomeOk ? 'वार्षिक पारिवारिक आय ₹5 लाख की सीमा के भीतर है' : 'वार्षिक पारिवारिक आय ₹5 लाख सीमा से अधिक है या उपलब्ध नहीं है'}, ${casteDocOk ? 'जाति प्रमाणपत्र दर्ज है' : 'वैध जाति प्रमाणपत्र लंबित है'}.`;
  }
  return `For ${business}, your preliminary eligibility is: ${categoryOk ? 'SC category matches' : 'SC category is not confirmed'}, ${incomeOk ? 'annual family income is within the current ₹5 lakh ceiling' : 'annual family income is above ₹5 lakh or not provided'}, and ${casteDocOk ? 'a caste certificate is recorded' : 'a valid caste certificate is still pending'}.`;
}

function getReply(text, lang, profile, schemes) {
  const normalized = String(text || '').toLowerCase();
  const name = profile?.fullName || 'there';
  const location = profile?.location || 'your location';
  const business = profile?.businessType || 'your business';
  const loan = money(profile?.requiredLoanAmount);

  const asksEligibility = /eligible|eligibility|eligible|ಪಾತ್ರ|ಅರ್ಹ|योग्य|पात्र|अर्ह|योजना.*लिए/.test(normalized) || normalized.includes('scheme');
  const asksBenefits = /benefit|benefits|लाभ|फायदा|ಪ್ರಯೋಜನ/.test(normalized);
  const asksDocuments = /document|documents|दस्तावेज|दस्तावेज़|ದಾಖಲೆ/.test(normalized);
  const asksNext = /next|अगला|अगले|ಮುಂದಿನ/.test(normalized);
  const asksLoan = /loan|ऋण|साल|सಾಲ/.test(normalized);
  const asksDetails = /detail|details|पूरी जानकारी|ವಿವರ|पूर्ण जानकारी/.test(normalized);

  if (lang === 'kn') {
    if (asksEligibility || asksDetails) {
      const top = schemes?.slice(0, 3).map(s => `${schemeFacts(s).name} (${schemeFacts(s).score || '—'}% match)`).join(', ');
      return `${name}, ನಿಮ್ಮ ${business} ಮತ್ತು ${location} ಮಾಹಿತಿಯ ಆಧಾರದಲ್ಲಿ ${buildEligibility(profile, lang)} ಈಗಿನ Scheme Matcher ಫಲಿತಾಂಶಗಳಲ್ಲಿ ${top || 'ಯಾವುದೇ ಯೋಜನೆ ದೃಢವಾಗಿ ಹೊಂದಿಕೆಯಾಗಿಲ್ಲ'}.`;
    }
    if (asksBenefits) {
      const s = schemeFacts(schemes?.[0] || {});
      return `${s.name} ನಿಮ್ಮಿಗೆ ಸೂಕ್ತವಾಗಿದ್ದರೆ, concessional finance ಮೂಲಕ ವ್ಯವಹಾರ ಆರಂಭ ಅಥವಾ ವಿಸ್ತರಣೆಗೆ ನೆರವು ಪಡೆಯಬಹುದು. ಪ್ರಸ್ತುತ ಗರಿಷ್ಠ ಸಾಲ ${money(s.maxLoan)}, ಬಡ್ಡಿ ಸುಮಾರು ${s.interest ?? 'ಅಗತ್ಯ ಪರಿಶೀಲನೆ'}, ಮತ್ತು ಅವಧಿ ${s.tenure ? `${s.tenure} ತಿಂಗಳು` : 'ಯೋಜನೆಯ ಪ್ರಕಾರ'}.`;
    }
    if (asksDocuments) return `ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ${profile?.uploadedDocs?.join(', ') || 'ಯಾವುದೇ ದಾಖಲೆಗಳು'} ಇವೆ. ಮಾನ್ಯ SC ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಮುಖ್ಯವಾಗಿದೆ. ನಂತರ ಸಂಬಂಧಿತ Channel Partner ಕೇಳುವ KYC, ಆದಾಯದ ಪುರಾವೆ ಮತ್ತು ಯೋಜನೆಗೆ ಬೇಕಾದ ಹೆಚ್ಚುವರಿ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ.`;
    if (asksLoan) return `ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸಾಲದ ಅಗತ್ಯ ${loan}. ಯೋಜನೆ ಆಯ್ಕೆ ಮತ್ತು ಗರಿಷ್ಠ ಮಿತಿಯನ್ನು ಆಧರಿಸಿ ಅಂತಿಮ ಅರ್ಹ ಸಾಲ ಮೊತ್ತವನ್ನು Channel Partner ಪರಿಶೀಲಿಸುತ್ತಾರೆ.`;
    if (asksNext) return `ಮುಂದಿನ ಹಂತ: ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ, ಅನ್ವಯಿಸುವ ಯೋಜನೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ಬಾಕಿ ದಾಖಲೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ, ನಂತರ PM-SURAJ ಅಥವಾ ಅಧಿಕೃತ Channel Partner ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.`;
    return `${name}, ನಾನು ನಿಮ್ಮ SchemeReady ಪ್ರೊಫೈಲ್ ಆಧಾರದಲ್ಲಿ ಅನ್ವಯಿಸುವ ಯೋಜನೆ, ಅರ್ಹತೆ, ಲಾಭ, ದಾಖಲೆಗಳು, ಸಾಲದ ಮಿತಿ ಮತ್ತು ಮುಂದಿನ ಹಂತಗಳನ್ನು ವಿವರಿಸಬಹುದು. “ನನಗೆ ಯಾವ ಯೋಜನೆ ಸೂಕ್ತ?” ಎಂದು ಕೇಳಿ.`;
  }

  if (lang === 'hi') {
    if (asksEligibility || asksDetails) {
      const top = schemes?.slice(0, 3).map(s => `${schemeFacts(s).name} (${schemeFacts(s).score || '—'}% match)`).join(', ');
      return `${name}, आपके ${business} और ${location} के आधार पर ${buildEligibility(profile, lang)} वर्तमान Scheme Matcher में ${top || 'कोई योजना स्पष्ट रूप से मेल नहीं खाती'}.`;
    }
    if (asksBenefits) {
      const s = schemeFacts(schemes?.[0] || {});
      return `${s.name} उपयुक्त होने पर रियायती वित्त के माध्यम से व्यवसाय शुरू या विस्तार करने में मदद कर सकती है। अधिकतम ऋण ${money(s.maxLoan)}, ब्याज लगभग ${s.interest ?? 'योजना/चैनल के अनुसार'}, और अवधि ${s.tenure ? `${s.tenure} महीने` : 'योजना के अनुसार'} है।`;
    }
    if (asksDocuments) return `आपकी प्रोफ़ाइल में ${profile?.uploadedDocs?.join(', ') || 'अभी कोई दस्तावेज़ नहीं'} दर्ज हैं। वैध SC जाति प्रमाणपत्र आवश्यक है। इसके बाद KYC, आय प्रमाण और आपके चुने हुए Channel Partner की अन्य आवश्यक दस्तावेज़ सूची पूरी करें.`;
    if (asksLoan) return `आपकी वर्तमान ऋण आवश्यकता ${loan} है। अंतिम पात्र ऋण राशि चुनी गई योजना और Channel Partner द्वारा सत्यापित की जाएगी.`;
    if (asksNext) return `अगला कदम: प्रोफ़ाइल पूरी करें, लागू योजना चुनें, लंबित दस्तावेज़ पूरे करें, फिर PM-SURAJ या अधिकृत Channel Partner के माध्यम से आवेदन करें.`;
    return `${name}, मैं आपके SchemeReady प्रोफ़ाइल के आधार पर लागू योजना, पात्रता, लाभ, दस्तावेज़, ऋण सीमा और अगले कदम समझा सकता हूँ। पूछें: “मैं किन योजनाओं के लिए पात्र हूँ?”`;
  }

  if (asksEligibility || asksDetails) {
    const top = schemes?.slice(0, 3).map(s => `${schemeFacts(s).name} (${schemeFacts(s).score || '—'}% match)`).join(', ');
    return `${name}, based on your ${business} in ${location}, ${buildEligibility(profile, lang)} The current Scheme Matcher results are ${top || 'not showing a confirmed match yet'}.`;
  }
  if (asksBenefits) {
    const s = schemeFacts(schemes?.[0] || {});
    return `${s.name} can help finance starting or expanding an income-generating activity. The current maximum loan shown is ${money(s.maxLoan)}, beneficiary interest is about ${s.interest ?? 'scheme/channel dependent'}, and tenure is ${s.tenure ? `${s.tenure} months` : 'scheme dependent'}.`;
  }
  if (asksDocuments) return `Your profile has ${profile?.uploadedDocs?.join(', ') || 'no uploaded documents yet'}. A valid SC caste certificate is essential for NSFDC credit eligibility. Then complete KYC, income proof and any additional documents required by the selected Channel Partner.`;
  if (asksLoan) return `Your current loan requirement is ${loan}. The final eligible loan amount depends on the selected scheme and the Channel Partner's verification.`;
  if (asksNext) return `Next: complete your profile, select the applicable scheme, finish missing documents, and apply through PM-SURAJ or an authorised Channel Partner. NSFDC does not take direct beneficiary loan applications.`;
  return `${name}, I can explain the schemes applicable to you, your eligibility, benefits, required documents, loan limit, application route, and next steps. Try asking: “Which schemes am I eligible for?”`;
}

export default function AIVoiceAssistant({ lang = 'en', profile, setProfile, onNavigate }) {
  const config = LANGUAGE_CONFIG[lang] || LANGUAGE_CONFIG.en;
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [input, setInput] = useState('');
  const [schemeState, setSchemeState] = useState({ status: 'idle', schemes: [] });
  const [messages, setMessages] = useState(() => [{ role: 'assistant', text: config.greeting }]);
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
    setMessages([{ role: 'assistant', text: config.greeting }]);
    setInput('');
    // Reset any unfinished recognition/speech when the site's language changes.
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
    const load = async () => {
      setSchemeState(prev => ({ ...prev, status: 'loading' }));
      try {
        const results = await matchSchemes(profile || {});
        if (!cancelled) setSchemeState({ status: 'ready', schemes: Array.isArray(results) ? results : [] });
      } catch (error) {
        if (!cancelled) setSchemeState({ status: 'fallback', schemes: fallbackSchemes(profile) });
      }
    };
    load();
    return () => { cancelled = true; };
  }, [profile]);

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
        ...(extracted.requiredAmount ? { requiredLoanAmount: extracted.requiredAmount, estimatedProjectCost: Math.round(Number(extracted.requiredAmount) * 1.15) } : {}),
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
    const profileForReply = extracted ? {
      ...profile,
      ...(extracted.businessType ? { businessType: extracted.businessType } : {}),
      ...(extracted.location ? { location: extracted.location } : {}),
      ...(extracted.requiredAmount ? { requiredLoanAmount: extracted.requiredAmount, estimatedProjectCost: Math.round(Number(extracted.requiredAmount) * 1.15) } : {}),
      ...(extracted.userType ? { userType: extracted.userType } : {})
    } : profile;
    let schemes = schemeState.schemes;
    try {
      const fresh = await matchSchemes(profileForReply || {});
      if (Array.isArray(fresh)) schemes = fresh;
    } catch {
      schemes = fallbackSchemes(profileForReply);
    }

    const reply = getReply(text, lang, profileForReply, schemes);
    setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    speak(reply);

    const lower = text.toLowerCase();
    const eligibilityIntent = /scheme|eligible|eligibility|योजना|पात्र|अर्ह|ಯೋಜನೆ|ಅರ್ಹ|ಪಾತ್ರ/.test(lower);
    if ((lower.includes('onboarding') || lower.includes('ಆನ್‌ಬೋರ್ಡಿಂಗ್') || lower.includes('ऑनबोर्डिंग')) && onNavigate) onNavigate('onboarding');
    else if (eligibilityIntent && onNavigate) onNavigate('schemes');
    else if ((lower.includes('readiness') || lower.includes('readiness dashboard')) && onNavigate) onNavigate('readiness');
    else if ((lower.includes('document') || lower.includes('ದಾಖಲೆ') || lower.includes('दस्तावेज')) && onNavigate) onNavigate('checklist');
  };

  const startListening = () => {
    if (!supported) {
      const reply = lang === 'kn' ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ speech recognition ಲಭ್ಯವಿಲ್ಲ. ಕೆಳಗಿನ ಪಠ್ಯ ಬಾಕ್ಸ್ ಬಳಸಿ.' : lang === 'hi' ? 'इस ब्राउज़र में speech recognition उपलब्ध नहीं है। नीचे दिए टेक्स्ट बॉक्स का उपयोग करें।' : 'Speech recognition is not available in this browser. Please use the text box below.';
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
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop?.();
    setListening(false);
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-5 bottom-5 z-50 flex items-center gap-3 rounded-full bg-emerald-600 px-5 py-3.5 text-white shadow-2xl hover:bg-emerald-700 transition-all"
          aria-label="Open SchemeReady AI Voice Assistant"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/15"><Bot className="h-5 w-5" />{listening && <span className="absolute inset-0 rounded-full animate-ping border border-white/60" />}</span>
          <span className="text-sm font-black">Ask SchemeReady</span>
        </button>
      )}

      {open && (
        <div className="fixed right-4 bottom-4 z-50 w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-950 to-emerald-900 px-4 py-3.5 text-white">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15"><Bot className="h-5 w-5" /></div><div><div className="text-sm font-black">SchemeReady AI Assistant</div><div className="text-[11px] text-emerald-200">{config.label} • scheme & eligibility guide</div></div></div>
            <div className="flex items-center gap-1"><button type="button" onClick={() => window.speechSynthesis?.cancel?.()} className="rounded-lg p-2 hover:bg-white/10" aria-label="Stop voice"><VolumeX className="h-4 w-4" /></button><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-white/10" aria-label="Close"><X className="h-4 w-4" /></button></div>
          </div>

          <div className="max-h-[430px] space-y-3 overflow-y-auto bg-slate-50 p-4">
            {schemeState.status === 'loading' && <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-800">Checking your profile against available SchemeReady matches…</div>}
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[86%] rounded-2xl px-3.5 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-800 shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              {suggestions.map(s => <button key={s} type="button" onClick={() => submit(s)} className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700">{s}</button>)}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={listening ? stopListening : startListening} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white transition ${listening ? 'bg-rose-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'}`} aria-label={listening ? 'Stop listening' : 'Start listening'}>{listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}</button>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder={config.placeholder} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              <button type="button" onClick={() => submit()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800" aria-label="Send"><Send className="h-4 w-4" /></button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400"><span>{speaking ? `Speaking in ${config.label}` : `Voice input: ${config.label}`}</span><button type="button" onClick={() => { setMessages([{ role: 'assistant', text: config.greeting }]); setInput(''); }} className="font-semibold text-emerald-700 hover:text-emerald-800">Reset chat</button></div>
          </div>
        </div>
      )}
    </>
  );
}
