import React, { useState } from 'react';
import { translations } from '../translations';
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
    preferred_language: profile.preferredLanguage || lang,
    business_type: profile.businessType,
    location: profile.location,
    required_amount: profile.requiredLoanAmount,
    user_type: profile.userType
  });

  // Comprehensive localized questions
  const questions = [
    {
      id: 'preferredLanguage',
      title: isHindi ? 'अपनी पसंदीदा भाषा चुनें' : 'Choose Your Preferred Language',
      subTitle: isHindi ? 'जिस भाषा में आप काम करना चाहते हैं उसे चुनें' : 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Choose portal language',
      question: isHindi ? 'स्कीम रेडी में आप किस भाषा में आगे बढ़ना चाहते हैं?' : 'In which language would you like to proceed with SchemeReady?',
      options: [
        { label: 'ಕನ್ನಡ (Kannada)', value: 'kn', icon: '🟡', hint: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು' },
        { label: 'English (EN)', value: 'en', icon: '🔵', hint: isHindi ? 'राष्ट्रीय मानक पोर्टल' : 'National Portal Standard' },
        { label: 'हिन्दी (Hindi)', value: 'hi', icon: '🟠', hint: isHindi ? 'राष्ट्रीय योजनाएं (सक्रिय)' : 'राष्ट्रीय योजनाएं' },
        { label: 'தமிழ் (Tamil)', value: 'ta', icon: '🟢', hint: 'அரசு மானியத் திட்டங்கள்' },
        { label: 'తెలుగు (Telugu)', value: 'te', icon: '🟣', hint: 'ప్రభుత్వ పథకాలు' },
        { label: 'मराठी (Marathi)', value: 'mr', icon: '🔴', hint: 'शासकीय योजना' },
        { label: 'বাংলা (Bengali)', value: 'bn', icon: '🟤', hint: 'সরকারি ঋণ প্রকল্প' }
      ]
    },
    {
      id: 'businessType',
      title: isHindi ? 'प्रस्तावित व्यवसाय या उद्यम' : 'Proposed Business or Enterprise',
      subTitle: isHindi ? 'आप कौन सा उद्यम शुरू या विस्तार करना चाहते हैं?' : 'ನೀವು ಯಾವ ವ್ಯವಹಾರವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಬಯಸುತ್ತೀರಿ?',
      question: isHindi ? 'आप किस प्रकार का व्यवसाय या परियोजना शुरू करना चाहते हैं?' : 'What type of business or project do you want to start and pursue?',
      options: [
        { 
          label: isHindi ? 'सिलाई / परिधान कार्यशाला' : 'Tailoring / Garments Workshop', 
          value: 'tailoring', 
          icon: '🧵', 
          hint: isHindi ? 'NSFDC MSY एवं MCS संरेखित' : 'NSFDC MSY & MCS Aligned' 
        },
        { 
          label: isHindi ? 'मोबाइल एवं इलेक्ट्रॉनिक्स रिपेयर लैब' : 'Mobile & Electronics Repair Lab', 
          value: 'mobile repair', 
          icon: '📱', 
          hint: isHindi ? 'उच्च मार्जिन सूक्ष्म इकाई' : 'High Margin Micro Unit' 
        },
        { 
          label: isHindi ? 'फूड कार्ट / बेकरी / टी स्टॉल' : 'Food Cart / Bakery / Tea Stall', 
          value: 'food stall', 
          icon: '🍲', 
          hint: isHindi ? 'दैनिक नकद प्रवाह व्यवसाय' : 'Daily Cash Flow Business' 
        },
        { 
          label: isHindi ? 'ई-रिक्शा / यात्री परिवहन' : 'E-Rickshaw / Passenger Transport', 
          value: 'e-rickshaw', 
          icon: '🛺', 
          hint: isHindi ? 'हरित व्यापार योजना (6% ब्याज)' : 'Green Business Scheme 6%' 
        },
        { 
          label: isHindi ? 'किराना / प्रोविजन स्टोर' : 'Grocery / Kirana / Provision Store', 
          value: 'grocery', 
          icon: '🛒', 
          hint: isHindi ? 'आवश्यक दैनिक खुदरा स्टोर' : 'Essential Retail Store' 
        },
        { 
          label: isHindi ? 'बढ़ईगीरी / लकड़ी का फर्नीचर' : 'Carpentry / Wooden Furniture', 
          value: 'carpentry', 
          icon: '🪚', 
          hint: isHindi ? 'कुशल कारीगर कार्यशाला' : 'Skilled Artisan Workshop' 
        },
        { 
          label: isHindi ? 'ब्यूटी पार्लर / हेयर सैलून' : 'Beauty Parlour / Hair Salon', 
          value: 'beauty salon', 
          icon: '✂️', 
          hint: isHindi ? 'महिला उद्यमी विशेष योजना' : 'Women Entrepreneur Focus' 
        },
        { 
          label: isHindi ? 'डेयरी / पोल्ट्री / कृषि प्रसंस्करण' : 'Dairy / Poultry / Agro Processing', 
          value: 'dairy', 
          icon: '🥛', 
          hint: isHindi ? 'ग्रामीण आजीविका योजना' : 'Rural Livelihood Scheme' 
        },
        { 
          label: isHindi ? 'चर्म शिल्प / जूता निर्माण इकाई' : 'Leather Crafts / Footwear Unit', 
          value: 'leather craft', 
          icon: '👞', 
          hint: isHindi ? 'पारंपरिक कारीगर रियायती ऋण' : 'Traditional Artisan Credit' 
        },
        { 
          label: isHindi ? 'अन्य व्यवसाय (कस्टम नाम दर्ज करें)' : 'Other Business (Enter Custom)', 
          value: 'other', 
          icon: '✨', 
          hint: isHindi ? 'अपना अनूठा उद्यम निर्दिष्ट करें' : 'Specify your unique venture' 
        }
      ]
    },
    {
      id: 'location',
      title: isHindi ? 'लक्षित जिला / स्थान' : 'Target District / Location',
      subTitle: isHindi ? 'आपकी व्यावसायिक इकाई का स्थान' : 'ನಿಮ್ಮ ವ್ಯಾಪಾರ ಸ್ಥಳ',
      question: isHindi ? 'आपका व्यवसाय या परियोजना कहाँ स्थित होगी?' : 'Where will your business or project be located?',
      options: [
        { label: isHindi ? 'बेंगलुरु (शहरी)' : 'Bengaluru (Urban)', value: 'Bengaluru', icon: '🏙️' },
        { label: isHindi ? 'बेंगलुरु ग्रामीण' : 'Bengaluru Rural', value: 'Bengaluru Rural', icon: '🌳' },
        { label: isHindi ? 'मैसूरु' : 'Mysuru', value: 'Mysuru', icon: '🏰' },
        { label: isHindi ? 'हुबली-धारवाड़' : 'Hubballi-Dharwad', value: 'Hubballi-Dharwad', icon: '🏭' },
        { label: isHindi ? 'बेलगावी' : 'Belagavi', value: 'Belagavi', icon: '🏛️' },
        { label: isHindi ? 'कलबुर्गी' : 'Kalaburagi', value: 'Kalaburagi', icon: '🌾' }
      ]
    },
    {
      id: 'estimatedProjectCost',
      title: isHindi ? 'अनुमानित कुल परियोजना लागत' : 'Estimated Total Project Cost',
      subTitle: isHindi ? 'मशीनरी, उपकरण एवं कच्चा माल लागत' : 'ಅಂದಾಜು ಯೋಜನಾ ವೆಚ್ಚ',
      question: isHindi ? 'मशीनरी और स्टॉक के लिए अनुमानित कुल सेटअप लागत क्या है?' : 'What is the estimated total setup cost for machinery and stock?',
      options: [
        { label: isHindi ? '₹1.0 लाख (सूक्ष्म इकाई)' : '₹1.0 Lakh (Micro)', value: 100000 },
        { label: isHindi ? '₹1.2 लाख (सिलाई / खाद्य)' : '₹1.2 Lakh (Tailoring / Food)', value: 120000 },
        { label: isHindi ? '₹1.8 लाख (मोबाइल लैब - मानक)' : '₹1.8 Lakh (Mobile Lab - Standard)', value: 180000 },
        { label: isHindi ? '₹2.5 लाख (परिवहन / वर्कशॉप)' : '₹2.5 Lakh (Transport / Workshop)', value: 250000 },
        { label: isHindi ? '₹5.0 लाख (लघु उद्यम)' : '₹5.0 Lakh (Small Enterprise)', value: 500000 },
        { label: isHindi ? '₹10.0 लाख+ (विनिर्माण)' : '₹10.0 Lakh+ (Manufacturing)', value: 1000000 }
      ]
    },
    {
      id: 'annualFamilyIncome',
      title: isHindi ? 'वार्षिक पारिवारिक घरेलू आय' : 'Annual Family Household Income',
      subTitle: isHindi ? 'परिवार के सभी सदस्यों की कुल आय' : 'ವಾರ್ಷಿಕ ಕುಟುಂಬದ ಆದಾಯ',
      question: isHindi ? 'सभी स्रोतों से आपकी कुल वार्षिक पारिवारिक आय कितनी है?' : 'What is your total annual household income from all sources?',
      options: [
        { label: isHindi ? '₹1.5 लाख से कम (बीपीएल प्राथमिकता)' : 'Under ₹1.5 Lakh (BPL Priority)', value: 150000 },
        { label: isHindi ? '₹2.5 लाख' : '₹2.5 Lakh', value: 250000 },
        { label: isHindi ? '₹3.6 लाख (रवि कुमार प्रोफाइल)' : '₹3.6 Lakh (Ravi Kumar Persona)', value: 360000 },
        { label: isHindi ? '₹4.5 लाख (पात्र सीमा)' : '₹4.5 Lakh (Eligible)', value: 450000 },
        { label: isHindi ? '₹5.0 लाख से अधिक (सामान्य एमएसएमई)' : 'Above ₹5.0 Lakh (General MSME)', value: 550000 }
      ]
    },
    {
      id: 'userType',
      title: isHindi ? 'उद्यमशीलता अनुभव' : 'Entrepreneurial Experience',
      subTitle: isHindi ? 'व्यावसायिक अनुभव का स्तर' : 'ಅನುಭವದ ವಿವರ',
      question: isHindi ? 'व्यवसाय में आपकी वर्तमान स्थिति का सबसे अच्छा वर्णन क्या है?' : 'What best describes your current stage in business?',
      options: [
        { label: isHindi ? 'पहली बार उद्यमी (नया व्यवसाय)' : 'First-time Entrepreneur', value: 'new_entrepreneur', icon: '🌱' },
        { label: isHindi ? 'मौजूदा लघु व्यवसाय स्वामी' : 'Existing Small Business Owner', value: 'existing_entrepreneur', icon: '💼' },
        { label: isHindi ? 'छात्र / व्यावसायिक प्रशिक्षु' : 'Student / Vocational Trainee', value: 'student', icon: '📚' }
      ]
    },
    {
      id: 'hasCasteCertificate',
      title: isHindi ? 'सामुदायिक जाति प्रमाण पत्र' : 'Community Caste Certificate',
      subTitle: isHindi ? 'राजस्व विभाग प्रमाण पत्र' : 'ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ',
      question: isHindi ? 'क्या आपके पास तहसीलदार द्वारा जारी वैध जाति प्रमाण पत्र (आरडी नंबर) है?' : 'Do you possess a valid Caste Certificate issued by the Tahsildar (RD Number)?',
      options: [
        { label: isHindi ? 'हाँ, वैध आरडी नंबर प्रमाण पत्र उपलब्ध है' : 'Yes, Have Valid RD Number Certificate', value: true, icon: '✅' },
        { label: isHindi ? 'नहीं / प्रक्रियाधीन (अनुपलब्ध)' : 'No / In-Progress (Missing)', value: false, icon: '⚠️' }
      ]
    },
    {
      id: 'hasIncomeCertificate',
      title: isHindi ? 'आय प्रमाण पत्र स्थिति' : 'Income Certificate Status',
      subTitle: isHindi ? 'सक्षम प्राधिकारी द्वारा सत्यापित' : 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ',
      question: isHindi ? 'क्या आपके पास तहसीलदार द्वारा सत्यापित वर्तमान आय प्रमाण पत्र है?' : 'Do you have a current Tahsildar-attested Income Certificate?',
      options: [
        { label: isHindi ? 'हाँ, हालिया आय प्रमाण पत्र उपलब्ध है' : 'Yes, Have Recent Income Certificate', value: true, icon: '✅' },
        { label: isHindi ? 'नहीं / समाप्त हो गया' : 'No / Expired', value: false, icon: '⚠️' }
      ]
    },
    {
      id: 'requiredLoanAmount',
      title: isHindi ? 'रियायती ऋण की आवश्यकता' : 'Concessional Loan Required',
      subTitle: isHindi ? 'चैनल पार्टनर से वित्तीय सहायता' : 'ಅಗತ್ಯವಿರುವ ಸಾಲದ ಮೊತ್ತ',
      question: isHindi ? 'चैनल भागीदारों से आपको कितनी रियायती ऋण सहायता की आवश्यकता है?' : 'How much subsidized credit assistance do you need from Channel Partners?',
      options: [
        { label: isHindi ? '₹1.0 लाख' : '₹1.0 Lakh', value: 100000 },
        { label: isHindi ? '₹1.2 लाख (सिलाई)' : '₹1.2 Lakh (Tailoring)', value: 120000 },
        { label: isHindi ? '₹1.5 लाख (मोबाइल रिपेयर लैब)' : '₹1.5 Lakh (Mobile Repair Lab)', value: 150000 },
        { label: isHindi ? '₹2.2 लाख' : '₹2.2 Lakh', value: 220000 },
        { label: isHindi ? '₹4.0 लाख (पूर्ण पैमाना)' : '₹4.0 Lakh (Full Scale)', value: 400000 }
      ]
    },
    {
      id: 'supportPreference',
      title: isHindi ? 'आवेदन चैनल प्राथमिकता' : 'Application Channel Preference',
      subTitle: isHindi ? 'आवेदन जमा करने का माध्यम' : 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಆದ್ಯತೆ',
      question: isHindi ? 'आप अपना ऋण आवेदन कैसे जमा और अनुवर्ती कार्रवाई करना पसंद करेंगे?' : 'How would you prefer to submit and follow up on your loan application?',
      options: [
        { label: isHindi ? 'ऑफलाइन एससीए / निगम कार्यालय सहायता' : 'Offline SCA / Corporation Office Support', value: 'offline', icon: '🏛️' },
        { label: isHindi ? 'ऑनलाइन / बैंक डिजिटल प्रोसेसिंग' : 'Online / Bank Digital Processing', value: 'online', icon: '💻' },
        { label: isHindi ? 'दोनों / हाइब्रिड चैनल रूटिंग' : 'Either / Hybrid Channel Routing', value: 'any', icon: '🤝' }
      ]
    }
  ];

  const currentQ = questions[currentStep];

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
    const chosen = customBusiness.trim() || (isHindi ? 'कस्टम उद्यम' : 'Custom Enterprise');
    setProfile(prev => ({ ...prev, businessType: chosen }));
    setExtractedJson(prev => ({ ...prev, business_type: chosen }));
    setIsOtherSelected(false);
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Localized business display name in summary card
  const getBusinessDisplay = (type) => {
    if (!isHindi) return type;
    const map = {
      'tailoring': 'सिलाई / परिधान कार्यशाला',
      'mobile repair': 'मोबाइल एवं इलेक्ट्रॉनिक्स रिपेयर लैब',
      'food stall': 'फूड कार्ट / बेकरी / टी स्टॉल',
      'e-rickshaw': 'ई-रिक्शा यात्री परिवहन',
      'grocery': 'किराना / प्रोविजन स्टोर',
      'carpentry': 'बढ़ईगीरी / लकड़ी का फर्नीचर',
      'beauty salon': 'ब्यूटी पार्लर / हेयर सैलून',
      'dairy': 'डेयरी / पोल्ट्री / कृषि प्रसंस्करण',
      'leather craft': 'चर्म शिल्प / जूता निर्माण'
    };
    return map[type] || type;
  };

  const getLocationDisplay = (loc) => {
    if (!isHindi) return loc;
    const map = {
      'Bengaluru': 'बेंगलुरु (शहरी)',
      'Bengaluru Rural': 'बेंगलुरु ग्रामीण',
      'Mysuru': 'मैसूरु',
      'Hubballi-Dharwad': 'हुबली-धारवाड़',
      'Belagavi': 'बेलगावी',
      'Kalaburagi': 'कलबुर्गी'
    };
    return map[loc] || loc;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 font-sans">
      
      {/* Header Info - Fully Localized */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? 'स्मार्ट निर्देशित ऑनबोर्डिंग' : 'Smart Guided Onboarding'}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            {isHindi ? 'हमें अपनी उद्यमशीलता परियोजना के बारे में बताएं' : 'Tell Us About Your Entrepreneurial Project'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal leading-relaxed">
            {isHindi 
              ? 'सटीक योजना पात्रता, सब्सिडी सीमा और बैंक तत्परता निर्धारित करने के लिए कुछ सरल प्रश्नों के उत्तर दें।'
              : 'Answer a few simple questions to determine exact scheme eligibility, subsidy limits, and bank readiness.'
            }
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-600">
          <Globe2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{isHindi ? 'वर्तमान भाषा:' : 'Current Language:'}</span>
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
                {isHindi ? `प्रश्न ${currentStep + 1} / ${questions.length}` : `Question ${currentStep + 1} of ${questions.length}`}
              </span>
              <span className="font-mono text-emerald-700 font-bold">
                {Math.round(((currentStep + 1) / questions.length) * 100)}% {isHindi ? 'पूर्ण' : 'Completed'}
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
                  {isHindi ? `चरण ${currentStep + 1}` : `Step ${currentStep + 1}`}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {currentQ.title}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-2 tracking-tight">
                {currentQ.question}
              </h3>
              {currentQ.subTitle && (
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {currentQ.subTitle}
                </p>
              )}
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = currentQ.id === 'preferredLanguage' 
                  ? (profile.preferredLanguage === opt.value || lang === opt.value)
                  : (isOtherSelected && opt.value === 'other') || (!isOtherSelected && profile[currentQ.id] === opt.value);
                
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, opt.value)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-xs ring-1 ring-emerald-500/40'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {opt.icon && <span className="text-base shrink-0">{opt.icon}</span>}
                      <div className="truncate">
                        <span className="block truncate">{opt.label}</span>
                        {opt.hint && <span className="block text-[10px] font-normal text-slate-400">{opt.hint}</span>}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Interactive "Others" Custom Business Input */}
            {currentQ.id === 'businessType' && isOtherSelected && (
              <div className="mt-4 p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3 text-left animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-slate-800">
                  {isHindi ? 'अपने व्यवसाय या उद्यम का नाम दर्ज करें:' : 'Enter your business or project name:'}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customBusiness}
                    onChange={(e) => setCustomBusiness(e.target.value)}
                    placeholder={isHindi ? 'उदा. सोलर रूफटॉप, मिट्टी के बर्तन, मोमबत्ती निर्माण, बेकरी...' : 'e.g. Solar rooftop installation, Pottery, Candle making, Bakery...'}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmCustomBusiness}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    {isHindi ? 'पुष्टि करें और आगे बढ़ें →' : 'Confirm & Proceed →'}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-6">
            <button
              disabled={currentStep === 0}
              onClick={() => {
                setIsOtherSelected(false);
                setCurrentStep(prev => Math.max(0, prev - 1));
              }}
              className={`flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentStep === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isHindi ? 'पीछे' : 'Back'}</span>
            </button>

            {currentStep < questions.length - 1 ? (
              <button
                onClick={() => {
                  setIsOtherSelected(false);
                  setCurrentStep(prev => prev + 1);
                }}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <span>{isHindi ? 'आगे बढ़ें' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onProceedToMatching}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
              >
                <span>{isHindi ? 'योजना मिलान पर आगे बढ़ें' : 'Proceed to Scheme Matcher'}</span>
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
                  {isHindi ? 'लाइव लाभार्थी प्रोफाइल' : 'Live Beneficiary Profile'}
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                {isHindi ? 'सत्यापित' : 'Verified'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              {isHindi ? 'योजना मिलान हेतु कॉन्फ़िगर किए गए प्रोफाइल पैरामीटर:' : 'Profile parameters configured for deterministic scheme matching:'}
            </p>

            {/* Formatted Summary Box */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">{isHindi ? 'चयनित भाषा:' : 'Selected Language:'}</span>
                <span className="font-bold text-amber-400 uppercase font-mono">{profile.preferredLanguage || lang}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">{isHindi ? 'व्यावसायिक उद्यम:' : 'Business Venture:'}</span>
                <span className="font-bold text-white capitalize truncate ml-2 max-w-[170px]" title={profile.businessType}>
                  {getBusinessDisplay(profile.businessType)}
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">{isHindi ? 'स्थान / जिला:' : 'Location / District:'}</span>
                <span className="font-bold text-white">{getLocationDisplay(profile.location)}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">{isHindi ? 'आवश्यक ऋण:' : 'Required Loan:'}</span>
                <span className="font-bold text-emerald-400 font-mono">₹{profile.requiredLoanAmount.toLocaleString()}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">{isHindi ? 'वार्षिक पारिवारिक आय:' : 'Annual Family Income:'}</span>
                <span className="font-bold text-white font-mono">₹{profile.annualFamilyIncome.toLocaleString()}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">{isHindi ? 'जाति प्रमाण पत्र:' : 'Caste Certificate:'}</span>
                <span className={`font-bold ${profile.hasCasteCertificate ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {profile.hasCasteCertificate 
                    ? (isHindi ? 'आरडी सत्यापित' : 'RD Verified') 
                    : (isHindi ? 'अनुपलब्ध / प्रक्रियाधीन' : 'Missing / In-Progress')
                  }
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onProceedToMatching}
            className="w-full mt-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
          >
            <span>{isHindi ? 'रियायती योजनाओं का मिलान करें' : 'Match Concessional Schemes'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
