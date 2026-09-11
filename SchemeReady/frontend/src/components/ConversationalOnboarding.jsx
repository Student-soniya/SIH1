import React, { useState } from 'react';
import { translations } from '../translations';
import { 
  Mic, 
  MicOff, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Bot, 
  Volume2, 
  RefreshCw,
  Code2
} from 'lucide-react';
import { extractEntities } from '../api';

export default function ConversationalOnboarding({ 
  lang, 
  profile, 
  setProfile, 
  onProceedToMatching 
}) {
  const t = translations[lang] || translations.en;
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [extractedJson, setExtractedJson] = useState({
    business_type: profile.businessType,
    location: profile.location,
    required_amount: profile.requiredLoanAmount,
    user_type: profile.userType
  });

  const sampleVoicePhrases = [
    "I want to start a tailoring business in Bengaluru. I need ₹1.2 lakh.",
    "Mobile repair shop in Bengaluru requiring ₹1.8 lakh in equipment.",
    "I want to purchase an e-rickshaw in Hubballi with ₹2.5 lakh loan.",
    "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಬಟ್ಟೆ ಹೊಲಿಗೆ ಅಂಗಡಿ ಪ್ರಾರಂಭಿಸಲು ₹1.2 ಲಕ್ಷ ಸಾಲ ಬೇಕಾಗಿದೆ."
  ];

  const handleVoiceInputSim = async (phrase) => {
    setSpeechText(phrase);
    setIsListening(true);
    setTimeout(async () => {
      setIsListening(false);
      const res = await extractEntities(phrase, lang);
      setExtractedJson({
        business_type: res.businessType,
        location: res.location,
        required_amount: res.requiredAmount,
        user_type: res.userType
      });
      setProfile(prev => ({
        ...prev,
        businessType: res.businessType,
        location: res.location,
        estimatedProjectCost: res.requiredAmount * 1.15,
        requiredLoanAmount: res.requiredAmount,
        userType: res.userType
      }));
    }, 1200);
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Graceful fallback to demo phrase
      handleVoiceInputSim(sampleVoicePhrases[0]);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setSpeechText(transcript);
      setIsListening(false);
      const res = await extractEntities(transcript, lang);
      setExtractedJson({
        business_type: res.businessType,
        location: res.location,
        required_amount: res.requiredAmount,
        user_type: res.userType
      });
      setProfile(prev => ({
        ...prev,
        businessType: res.businessType,
        location: res.location,
        requiredLoanAmount: res.requiredAmount
      }));
    };
    recognition.onerror = () => {
      setIsListening(false);
      handleVoiceInputSim(sampleVoicePhrases[0]);
    };
    recognition.start();
  };

  // Questions configuration
  const questions = [
    {
      id: 'businessType',
      question: t.onboarding.q1,
      options: [
        { label: 'Tailoring / Garments', value: 'tailoring', icon: '🧵' },
        { label: 'Mobile Repair Shop', value: 'mobile repair', icon: '📱' },
        { label: 'Food Cart / Tea Stall', value: 'food stall', icon: '🍲' },
        { label: 'E-Rickshaw / Transport', value: 'e-rickshaw', icon: '🛺' },
        { label: 'Grocery / Kirana', value: 'grocery', icon: '🛒' },
        { label: 'Carpentry / Furniture', value: 'carpentry', icon: '🪚' },
        { label: 'Leather Crafts / Cobbler', value: 'leather craft', icon: '👞' },
        { label: 'Student / Vocational', value: 'student', icon: '🎓' }
      ]
    },
    {
      id: 'location',
      question: t.onboarding.q2,
      options: [
        { label: 'Bengaluru (Urban)', value: 'Bengaluru', icon: '🏙️' },
        { label: 'Bengaluru Rural', value: 'Bengaluru Rural', icon: '🌳' },
        { label: 'Mysuru', value: 'Mysuru', icon: '🏰' },
        { label: 'Hubballi-Dharwad', value: 'Hubballi-Dharwad', icon: '🏭' },
        { label: 'Belagavi', value: 'Belagavi', icon: '🏛️' },
        { label: 'Kalaburagi', value: 'Kalaburagi', icon: '🌾' }
      ]
    },
    {
      id: 'estimatedProjectCost',
      question: t.onboarding.q3,
      options: [
        { label: '₹1.0 Lakh', value: 100000 },
        { label: '₹1.2 Lakh', value: 120000 },
        { label: '₹1.8 Lakh (Standard)', value: 180000 },
        { label: '₹2.5 Lakh', value: 250000 },
        { label: '₹5.0 Lakh', value: 500000 },
        { label: '₹10.0 Lakh+', value: 1000000 }
      ]
    },
    {
      id: 'annualFamilyIncome',
      question: t.onboarding.q4,
      options: [
        { label: 'Under ₹1.5 Lakh', value: 150000 },
        { label: '₹2.5 Lakh', value: 250000 },
        { label: '₹3.6 Lakh (Ravi Persona)', value: 360000 },
        { label: '₹4.5 Lakh', value: 450000 },
        { label: 'Above ₹5.0 Lakh', value: 550000 }
      ]
    },
    {
      id: 'userType',
      question: t.onboarding.q5,
      options: [
        { label: 'First-time Entrepreneur', value: 'new_entrepreneur', icon: '🌱' },
        { label: 'Existing Small Business Owner', value: 'existing_entrepreneur', icon: '💼' },
        { label: 'Student / Vocational Trainee', value: 'student', icon: '📚' }
      ]
    },
    {
      id: 'hasCasteCertificate',
      question: t.onboarding.q6,
      options: [
        { label: 'Yes, Have Valid RD Number Certificate', value: true, icon: '✅' },
        { label: 'No / In-Progress (Missing)', value: false, icon: '⚠️' }
      ]
    },
    {
      id: 'hasIncomeCertificate',
      question: t.onboarding.q7,
      options: [
        { label: 'Yes, Have Recent Income Certificate', value: true, icon: '✅' },
        { label: 'No / Expired', value: false, icon: '⚠️' }
      ]
    },
    {
      id: 'requiredLoanAmount',
      question: t.onboarding.q8,
      options: [
        { label: '₹1.0 Lakh', value: 100000 },
        { label: '₹1.2 Lakh (Tailoring)', value: 120000 },
        { label: '₹1.5 Lakh (Mobile Repair)', value: 150000 },
        { label: '₹2.2 Lakh', value: 220000 },
        { label: '₹4.0 Lakh', value: 400000 }
      ]
    },
    {
      id: 'supportPreference',
      question: t.onboarding.q9,
      options: [
        { label: 'Offline SCA / Corporation Office Support', value: 'offline', icon: '🏛️' },
        { label: 'Online / Bank Digital Processing', value: 'online', icon: '💻' },
        { label: 'Either / Hybrid', value: 'any', icon: '🤝' }
      ]
    },
    {
      id: 'preferredLanguage',
      question: t.onboarding.q10,
      options: [
        { label: 'Kannada (ಕನ್ನಡ)', value: 'kn', icon: '🟡' },
        { label: 'English (EN)', value: 'en', icon: '🔵' },
        { label: 'Hindi (हिन्दी)', value: 'hi', icon: '🟠' }
      ]
    }
  ];

  const currentQ = questions[currentStep];

  const handleSelectOption = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
    // update extracted preview
    setExtractedJson(prev => ({
      ...prev,
      business_type: field === 'businessType' ? val : prev.business_type,
      location: field === 'location' ? val : prev.location,
      required_amount: field === 'requiredLoanAmount' ? val : prev.required_amount,
      user_type: field === 'userType' ? val : prev.user_type
    }));

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Main Page: WHY & WHAT Section (SIH Hackathon Problem Context) */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-md font-black uppercase tracking-wider text-[11px]">
              GovTech AI Platform
            </span>
            <span className="text-xs text-emerald-300 font-medium">
              National Scheduled Castes Finance &amp; Development Corporation (NSFDC)
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Ministry of Social Justice &amp; Empowerment | SIH 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* WHY Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-xs">
                WHY
              </span>
              <h3 className="font-black text-base text-white">Why SchemeReady is Needed?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              NSFDC empowers Scheduled Caste beneficiaries with family income up to <strong>₹5.00 Lakhs</strong> through concessional loans (4%–8% p.a.). However, <strong>direct loan applications are not entertained</strong>. Funds must route through 100+ Channel Partners (SCAs, Banks, RRBs).
            </p>
            <div className="text-[11px] text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded-xl p-3 space-y-1">
              <strong>The Bottleneck:</strong> First-time entrepreneurs face immediate rejection due to incomplete document dossiers, lack of viable project reports (DPRs), and approaching branches with exhausted credit allocations or high NPAs.
            </div>
          </div>

          {/* WHAT Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                WHAT
              </span>
              <h3 className="font-black text-base text-white">What SchemeReady Delivers?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              SchemeReady bridges the last-mile gap by transforming raw business ideas into 100% bank-appraised, viable loan applications with zero paperwork confusion.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-200">
              <div className="bg-emerald-950/50 border border-emerald-800/30 rounded-lg p-2">
                ✓ <strong>Conversational Onboarding:</strong> Local voice &amp; natural language entity extraction.
              </div>
              <div className="bg-emerald-950/50 border border-emerald-800/30 rounded-lg p-2">
                ✓ <strong>Explainable Matching:</strong> Clear reason codes &amp; criteria verification.
              </div>
              <div className="bg-emerald-950/50 border border-emerald-800/30 rounded-lg p-2">
                ✓ <strong>DigiLocker Integration:</strong> Instant fetch &amp; PDF preview for govt certs.
              </div>
              <div className="bg-emerald-950/50 border border-emerald-800/30 rounded-lg p-2">
                ✓ <strong>Channel Partner Routing:</strong> 0% overdue &amp; low-NPA branches with AAA priority.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Feature 1: Conversational Onboarding</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.onboarding.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{t.onboarding.subtitle}</p>
        </div>

        {/* Voice Trigger Button */}
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <button
            onClick={toggleMic}
            className={`flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/30'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? t.onboarding.listening : t.onboarding.voiceBtn}</span>
          </button>
        </div>
      </div>

      {/* Voice Quick-Picks / Examples */}
      <div className="bg-slate-100/80 rounded-xl p-3 border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-700 flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Quick voice examples:</span>
        </span>
        {sampleVoicePhrases.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => handleVoiceInputSim(phrase)}
            className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 hover:border-emerald-300 px-3 py-1.5 rounded-lg transition-all text-left"
          >
            "{phrase}"
          </button>
        ))}
      </div>

      {/* Main Questionnaire Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Area (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[420px]">
          <div>
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-3">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
              <div 
                className="bg-emerald-600 h-2 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Current Question */}
            <div className="mb-6">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step {currentStep + 1}</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{currentQ.question}</h3>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = profile[currentQ.id] === opt.value;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQ.id, opt.value)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition-all text-left ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {opt.icon && <span className="text-lg">{opt.icon}</span>}
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-xs font-semibold ${
                currentStep === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.onboarding.prevBtn}</span>
            </button>

            {currentStep < questions.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                <span>{t.onboarding.nextBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onProceedToMatching}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                <span>{t.onboarding.submitBtn}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live Extraction JSON Preview Card (1 col) */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Entity Extraction</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                JSON Engine
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Extracted automatically from speech or questionnaire answers per PRD specifications:
            </p>

            {/* Formatted JSON Box */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
              <pre>{JSON.stringify(extractedJson, null, 2)}</pre>
            </div>

            {/* Key Value Badges */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Business:</span>
                <span className="font-semibold text-white capitalize">{profile.businessType}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-white">{profile.location}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Required Amount:</span>
                <span className="font-semibold text-emerald-400">₹{profile.requiredLoanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Caste Certificate:</span>
                <span className={`font-semibold ${profile.hasCasteCertificate ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {profile.hasCasteCertificate ? 'Available' : 'Missing (72% Readiness)'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onProceedToMatching}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10"
          >
            <span>{t.onboarding.submitBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
