import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import { getOnboardingQuestions, l10n, t as tText } from '../l10n';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Bot, 
  Code2, 
  Globe2, 
  Briefcase 
} from 'lucide-react';

export default function ConversationalOnboarding({ 
  lang = 'en', 
  setLang,
  profile, 
  setProfile, 
  onProceedToMatching 
}) {
  const t = translations[lang] || translations.en;
  const isHindi = lang === 'hi';

  const [currentStep, setCurrentStep] = useState(0);
  const [customBusiness, setCustomBusiness] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const [extractedJson, setExtractedJson] = useState({
    preferred_language: profile?.preferredLanguage || lang,
    business_type: profile?.businessType || '',
    location: profile?.location || '',
    required_amount: profile?.requiredLoanAmount || 0,
    user_type: profile?.userType || 'new_entrepreneur'
  });

  useEffect(() => {
    setExtractedJson({
      preferred_language: profile?.preferredLanguage || lang,
      business_type: profile?.businessType || '',
      location: profile?.location || '',
      required_amount: profile?.requiredLoanAmount || 0,
      user_type: profile?.userType || 'new_entrepreneur'
    });
  }, [profile, lang]);

  // Comprehensive 7-language localized questions
  const questions = getOnboardingQuestions(lang);
  const currentQ = questions[currentStep] || questions[0];

  const handleSelectOption = (field, val) => {
    if (field === 'preferredLanguage') {
      if (setLang) setLang(val);
      setProfile(prev => ({ ...prev, preferredLanguage: val }));
      setExtractedJson(prev => ({ ...prev, preferred_language: val }));
      setCurrentStep(prev => prev + 1);
      return;
    }

    if (field === 'businessType' && val === 'other') {
      setIsOtherSelected(true);
      return;
    }

    setIsOtherSelected(false);
    setProfile(prev => ({ ...prev, [field]: val }));
    
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

  const handleConfirmCustomBusiness = () => {
    const chosen = customBusiness.trim() || tText({
      en: 'Custom Enterprise',
      hi: 'कस्टम उद्यम',
      kn: 'ಕಸ್ಟಮ್ ಉದ್ಯಮ',
      ta: 'தனிப்பயன் தொழில்',
      te: 'కస్టమ్ పరిశ్రమ',
      mr: 'कस्टम उद्योग',
      bn: 'কাস্টম উদ্যোগ'
    }, lang);

    setProfile(prev => ({ ...prev, businessType: chosen }));
    setExtractedJson(prev => ({ ...prev, business_type: chosen }));
    setIsOtherSelected(false);
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Localized business display name in summary card
  const getBusinessDisplay = (type) => {
    const businessNames = {
      'tailoring': { en: 'Tailoring / Garments Workshop', hi: 'सिलाई / परिधान कार्यशाला', kn: 'தையல் / ಉಡುಪು ಕಾರ್ಯಾಗಾರ', ta: 'தையல் / ஆடை பட்டறை', te: 'టైలరింగ్ / దుస్తుల వర్క్‌షాప్', mr: 'शिलाई / कपडे कार्यशाळा', bn: 'দর্জি / পোশাক কর্মশালা' },
      'mobile repair': { en: 'Mobile & Electronics Repair Lab', hi: 'मोबाइल एवं इलेक्ट्रॉनिक्स रिपेयर लैब', kn: 'ಮೊಬೈಲ್ ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ರಿಪೇರಿ ಲ್ಯಾಬ್', ta: 'மொபைல் மற்றும் எலக்ட்ரானிக்ஸ் பழுதுபார்க்கும் லேப்', te: 'మొబైల్ & ఎలక్ట్రానిక్స్ రిపేర్ ల్యాబ్', mr: 'मोबाईल आणि इलेक्ट्रॉनिक्स दुरुस्ती लॅब', bn: 'মোবাইল ও ইলেকট্রনিক্স মেরামতের ল্যাব' },
      'food stall': { en: 'Food Cart / Bakery / Tea Stall', hi: 'फूड कार्ट / बेकरी / टी स्टॉल', kn: 'ಆಹಾರ ಕಾರ್ಟ್ / ಬೇಕರಿ / ಟೀ ಸ್ಟಾಲ್', ta: 'உணவு வண்டி / பேக்கரி / டீ கடை', te: 'ఫుడ్ కార్ట్ / బేకరీ / టీ స్టాల్', mr: 'फूड कार्ट / बेकरी / टी स्टॉल', bn: 'ফুড কার্ট / বেকারি / চায়ের স্টল' },
      'e-rickshaw': { en: 'E-Rickshaw / Passenger Transport', hi: 'ई-रिक्शा यात्री परिवहन', kn: 'ಇ-ರಿಕ್ಷಾ / ಸಾರಿಗೆ ಸೇವೆ', ta: 'இ-ரிக்ஷா / பயணிகள் போக்குவரத்து', te: 'ఇ-రిక్షా / ప్రయాణీకుల రవాణా', mr: 'ई-रिक्षा / प्रवासी वाहतूक', bn: 'ই-রিকশা / যাত্রী পরিবহন' },
      'grocery': { en: 'Grocery / Kirana / Provision Store', hi: 'किराना / प्रोविजन स्टोर', kn: 'ಕಿರಾಣಿ / ಪ್ರಾವಿಷನ್ ಸ್ಟೋರ್', ta: 'மளிகை கடை / பிராவிஷன் ஸ்டோர்', te: 'కిరాణా / ప్రొవిజన్ స్టోర్', mr: 'किराणा / प्रोव्हिजन स्टोअर', bn: 'মুদি দোকান / প্রোভিশন স্টোর' },
      'carpentry': { en: 'Carpentry / Wooden Furniture', hi: 'बढ़ईगीरी / लकड़ी का फर्नीचर', kn: 'ಮರಗೆಲಸ / ಪೀಠೋಪಕರಣಗಳು', ta: 'மரவேலை / மர தளபாடங்கள்', te: 'చెక్క పని / చెక్క ఫర్నిచర్', mr: 'सुतारकाम / लाकडी फर्निचर', bn: 'ছুতোর কাজ / কাঠের আসবাব' },
      'beauty salon': { en: 'Beauty Parlour / Hair Salon', hi: 'ब्यूटी पार्लर / हेयर सैलून', kn: 'ಬ್ಯೂಟಿ ಪಾರ್ಲರ್ / ಹೇರ್ ಸಲೂನ್', ta: 'பியூட்டி பார்லர் / சலூன்', te: 'బ్యూటీ పార్లర్ / హెయిర్ సెలూన్', mr: 'ब्युटी पार्लर / हेअर सलून', bn: 'বিউটি পার্লার / হেয়ার সেলুন' },
      'dairy': { en: 'Dairy / Poultry / Agro Processing', hi: 'डेयरी / पोल्ट्री / कृषि प्रसंस्करण', kn: 'ಡೈರಿ / ಕೋಳಿ ಸಾಕಾಣಿಕೆ / ಕೃಷಿ ಸಂಸ್ಕರಣೆ', ta: 'பால் பண்ணை / கோழி பண்ணை / வேளாண்மை', te: 'డైరీ / పౌల్ట్రీ / వ్యవసాయ ప్రాసెసింగ్', mr: 'डेअरी / पोल्ट्री / कृषी प्रक्रिया', bn: 'দুগ্ধ খামার / পোল্ট্রি / কৃষি প্রক্রিয়াকরণ' },
      'leather craft': { en: 'Leather Crafts / Footwear Unit', hi: 'चर्म शिल्प / जूता निर्माण', kn: 'ಚರ್ಮದ ಕರಕುಶಲ / ಪಾದರಕ್ಷೆಗಳ ಘಟಕ', ta: 'தோல் கைவினை / காலணி பிரிவு', te: 'తోలు హస్తకళలు / పాదరక్షల యూనిట్', mr: 'चर्मकला / पादत्राणे उत्पादन', bn: 'চামড়ার কারুশিল্প / পাদুকা ইউনিট' }
    };
    return businessNames[type] ? tText(businessNames[type], lang) : type;
  };

  const getLocationDisplay = (loc) => {
    const locNames = {
      'Bengaluru': { en: 'Bengaluru (Urban)', hi: 'बेंगलुरु (शहरी)', kn: 'ಬೆಂಗಳೂರು (ನಗರ)', ta: 'பெங்களூரு (நகர்ப்புறம்)', te: 'బెంగళూరు (పట్టణ)', mr: 'बंगळुरू (शहरी)', bn: 'বেঙ্গালুরু (শহুরে)' },
      'Bengaluru Rural': { en: 'Bengaluru Rural', hi: 'बेंगलुरु ग्रामीण', kn: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ', ta: 'பெங்களூரு ஊரகம்', te: 'బెంగళూరు గ్రామీణ', mr: 'बंगळुरू ग्रामीण', bn: 'বেঙ্গালুরু গ্রামীণ' },
      'Mysuru': { en: 'Mysuru', hi: 'मैसूरु', kn: 'ಮೈಸೂರು', ta: 'மைசூரு', te: 'మైసూరు', mr: 'म्हैसूर', bn: 'মহীশূর' },
      'Hubballi-Dharwad': { en: 'Hubballi-Dharwad', hi: 'हुबली-धारवाड़', kn: 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ', ta: 'ஹூப்ளி-தார்வாட்', te: 'హుబ్లీ-ధార్వాడ్', mr: 'हुबळी-धारवाड', bn: 'হুবলি-ধারওয়াদ' },
      'Belagavi': { en: 'Belagavi', hi: 'बेलगावी', kn: 'ಬೆಳಗಾವಿ', ta: 'பெலகாவி', te: 'బెల్గాం', mr: 'बेळगाव', bn: 'বেলগাভি' },
      'Kalaburagi': { en: 'Kalaburagi', hi: 'कलबुर्गी', kn: 'ಕಲಬುರಗಿ', ta: 'கலபுரகி', te: 'కలబురగి', mr: 'कलबुर्गी', bn: 'কলবুরগি' }
    };
    return locNames[loc] ? tText(locNames[loc], lang) : loc;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 font-sans">
      
      {/* Header Info - Fully Localized */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span>{tText(l10n.onboardingBadge, lang)}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            {tText(l10n.onboardingHeading, lang)}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal leading-relaxed">
            {tText(l10n.onboardingSubheading, lang)}
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-600">
          <Globe2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{tText(l10n.currentLangLabel, lang)}</span>
          <span className="font-mono font-bold uppercase text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
            {lang}
          </span>
        </div>
      </div>

      {/* Main Questionnaire Card & Live Extraction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Question Area (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between min-h-[440px]">
          <div>
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span className="font-bold text-slate-700">
                {tText(l10n.questionProgress, lang)} {currentStep + 1} {tText(l10n.ofTotal, lang)} {questions.length}
              </span>
              <span className="font-mono text-emerald-700 font-bold">
                {Math.round(((currentStep + 1) / questions.length) * 100)}% {tText(l10n.completedStatus, lang)}
              </span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Current Question */}
            <div className="mb-5 text-left">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                  {tText(l10n.stepLabel, lang)} {currentStep + 1}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {currentQ.subTitle}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                {currentQ.question}
              </h3>
            </div>

            {/* Custom Business Input Field */}
            {isOtherSelected && currentQ.id === 'businessType' && (
              <div className="mb-4 p-4 bg-emerald-50/90 border border-emerald-200 rounded-xl space-y-2 text-left animate-in fade-in">
                <label className="text-xs font-bold text-emerald-950 block">
                  {tText(l10n.customBusinessPrompt, lang)}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customBusiness}
                    onChange={(e) => setCustomBusiness(e.target.value)}
                    placeholder={tText(l10n.customBusinessPlaceholder, lang)}
                    className="flex-1 px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmCustomBusiness();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleConfirmCustomBusiness}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                  >
                    {tText(l10n.confirmAndContinue, lang)}
                  </button>
                </div>
              </div>
            )}

            {/* Question Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = profile[currentQ.id] === opt.value || 
                                  (currentQ.id === 'preferredLanguage' && (profile.preferredLanguage || lang) === opt.value);
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQ.id, opt.value)}
                    className={`p-3.5 rounded-xl border text-left flex items-start space-x-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{opt.icon || '📌'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs leading-snug flex items-center justify-between">
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-1">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      {opt.hint && (
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{opt.hint}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setIsOtherSelected(false);
                setCurrentStep(prev => Math.max(0, prev - 1));
              }}
              disabled={currentStep === 0}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{tText(l10n.prevButton, lang)}</span>
            </button>

            {currentStep < questions.length - 1 ? (
              <button
                onClick={() => {
                  setIsOtherSelected(false);
                  setCurrentStep(prev => prev + 1);
                }}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <span>{tText(l10n.nextButton, lang)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onProceedToMatching}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
              >
                <span>{tText(l10n.finishOnboardingBtn, lang)}</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        </div>

        {/* Live Extraction JSON Preview Card (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between shadow-md text-left">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {tText(l10n.liveDossierTitle, lang)}
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                {tText(l10n.autoExtractingBadge, lang)}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              {tText({
                en: "Profile parameters configured for deterministic scheme matching:",
                hi: "योजना मिलान हेतु कॉन्फ़िगर किए गए प्रोफाइल पैरामीटर:",
                kn: "ಯೋಜನೆ ಹೊಂದಾಣಿಕೆಗಾಗಿ ಕಾನ್ಫಿಗರ್ ಮಾಡಲಾದ ಪ್ರೊಫೈಲ್ ನಿಯತಾಂಕಗಳು:",
                ta: "திட்ட பொருத்தத்திற்கு கட்டமைக்கப்பட்ட சுயவிவர அளவுருக்கள்:",
                te: "పథకం సరిపోలిక కోసం కాన్ఫిగర్ చేయబడిన ప్రొఫైల్ పారామితులు:",
                mr: "योजना जुळणीसाठी कॉन्फिगर केलेले प्रोफाइल पॅरामीटर्स:",
                bn: "স্কিম মেলানোর জন্য কনফিগার করা প্রোফাইল প্যারামিটার:"
              }, lang)}
            </p>

            {/* Formatted Summary Box */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">
                  {tText({
                    en: "Selected Language:",
                    hi: "चयनित भाषा:",
                    kn: "ಆಯ್ಕೆಮಾಡಿದ ಭಾಷೆ:",
                    ta: "தேர்ந்தெடுக்கப்பட்ட மொழி:",
                    te: "ఎంచుకున్న భాష:",
                    mr: "निवडलेली भाषा:",
                    bn: "নির্বাচিত ভাষা:"
                  }, lang)}
                </span>
                <span className="font-bold text-amber-400 uppercase font-mono">{profile.preferredLanguage || lang}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">
                  {tText({
                    en: "Business Venture:",
                    hi: "व्यावसायिक उद्यम:",
                    kn: "ವ್ಯಾಪಾರ ಉದ್ಯಮ:",
                    ta: "வணிகத் தொழில்:",
                    te: "వ్యాపార పరిశ్రమ:",
                    mr: "व्यावसायिक उद्योग:",
                    bn: "বাণিজ্যিক উদ্যোগ:"
                  }, lang)}
                </span>
                <span className="font-bold text-white capitalize truncate ml-2 max-w-[170px]" title={profile.businessType}>
                  {getBusinessDisplay(profile.businessType)}
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">
                  {tText({
                    en: "Location / District:",
                    hi: "स्थान / जिला:",
                    kn: "ಸ್ಥಳ / ಜಿಲ್ಲೆ:",
                    ta: "இடம் / மாவட்டம்:",
                    te: "ప్రదేశం / జిల్లా:",
                    mr: "स्थान / जिल्हा:",
                    bn: "অবস্থান / জেলা:"
                  }, lang)}
                </span>
                <span className="font-bold text-white">{getLocationDisplay(profile.location)}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">
                  {tText({
                    en: "Required Loan:",
                    hi: "आवश्यक ऋण:",
                    kn: "ಅಗತ್ಯವಿರುವ ಸಾಲ:",
                    ta: "தேவையான கடன்:",
                    te: "అవసరమైన రుణం:",
                    mr: "आवश्यक कर्ज:",
                    bn: "প্রয়োজনীয় ঋণ:"
                  }, lang)}
                </span>
                <span className="font-bold text-emerald-400 font-mono">₹{profile.requiredLoanAmount.toLocaleString()}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">
                  {tText({
                    en: "Annual Family Income:",
                    hi: "वार्षिक पारिवारिक आय:",
                    kn: "ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ:",
                    ta: "ஆண்டு குடும்ப வருமானம்:",
                    te: "వార్షిక కుటుంబ ఆదాయం:",
                    mr: "वार्षिक कौटुंबिक उत्पन्न:",
                    bn: "বার্ষিক পারিবারিক আয়:"
                  }, lang)}
                </span>
                <span className="font-bold text-white font-mono">₹{profile.annualFamilyIncome.toLocaleString()}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">
                  {tText({
                    en: "Caste Certificate:",
                    hi: "जाति प्रमाण पत्र:",
                    kn: "ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ:",
                    ta: "சாதி சான்றிதழ்:",
                    te: "కుల ధృవీకరణ పత్రం:",
                    mr: "जातीचे प्रमाणपत्र:",
                    bn: "জাতিগত শংসাপত্র:"
                  }, lang)}
                </span>
                <span className={`font-bold ${profile.hasCasteCertificate ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {profile.hasCasteCertificate 
                    ? tText({
                        en: "RD Verified",
                        hi: "आरडी सत्यापित",
                        kn: "RD ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
                        ta: "RD சரிபார்க்கப்பட்டது",
                        te: "RD ధృవీకరించబడింది",
                        mr: "RD सत्यापित",
                        bn: "RD যাচাইকৃত"
                      }, lang)
                    : tText({
                        en: "Missing / In-Progress",
                        hi: "अनुपलब्ध / प्रक्रियाधीन",
                        kn: "ಲಭ್ಯವಿಲ್ಲ / ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ",
                        ta: "இல்லை / செயல்பாட்டில் உள்ளது",
                        te: "లేదు / పురోగతిలో ఉంది",
                        mr: "अनुपलब्ध / प्रक्रियेत आहे",
                        bn: "অনুপস্থিত / প্রক্রিয়াধীন"
                      }, lang)
                  }
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onProceedToMatching}
            className="w-full mt-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
          >
            <span>
              {tText({
                en: "Match Concessional Schemes",
                hi: "रियायती योजनाओं का मिलान करें",
                kn: "ರಿಯಾಯಿತಿ ಯೋಜನೆಗಳನ್ನು ಹೊಂದಿಸಿ",
                ta: "சலுகைத் திட்டங்களைப் பொருத்துங்கள்",
                te: "రాయితీ పథకాలను సరిపోల్చండి",
                mr: "सवलतीच्या योजना जुळवा",
                bn: "রেয়াতযোগ্য স্কিমগুলি মেলান"
              }, lang)}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
