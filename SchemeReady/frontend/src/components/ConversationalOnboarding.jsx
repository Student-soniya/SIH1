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

  // Questions configuration:
  // 1. Language FIRST as explicitly requested
  // 2. Business Type with 'Others' custom input
  // 3. Location, Project Cost, Income, etc.
  const questions = [
    {
      id: 'preferredLanguage',
      title: 'Choose Your Preferred Language',
      subTitle: 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / अपनी पसंदीदा भाषा चुनें',
      question: 'In which language would you like to proceed with SchemeReady?',
      options: [
        { label: 'ಕನ್ನಡ (Kannada)', value: 'kn', icon: '🟡', hint: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು' },
        { label: 'English (EN)', value: 'en', icon: '🔵', hint: 'National Portal Standard' },
        { label: 'हिन्दी (Hindi)', value: 'hi', icon: '🟠', hint: 'राष्ट्रीय योजनाएं' },
        { label: 'தமிழ் (Tamil)', value: 'ta', icon: '🟢', hint: 'அரசு மானியத் திட்டங்கள்' },
        { label: 'తెలుగు (Telugu)', value: 'te', icon: '🟣', hint: 'ప్రభుత్వ పథకాలు' },
        { label: 'मराठी (Marathi)', value: 'mr', icon: '🔴', hint: 'शासकीय योजना' },
        { label: 'বাংলা (Bengali)', value: 'bn', icon: '🟤', hint: 'সরকারি ঋণ প্রকল্প' }
      ]
    },
    {
      id: 'businessType',
      title: 'Proposed Business or Enterprise',
      subTitle: 'ನೀವು ಯಾವ ವ್ಯವಹಾರವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಬಯಸುತ್ತೀರಿ?',
      question: 'What type of business or project do you want to start and pursue?',
      options: [
        { label: 'Tailoring / Garments Workshop', value: 'tailoring', icon: '🧵', hint: 'NSFDC MSY & MCS Aligned' },
        { label: 'Mobile & Electronics Repair Lab', value: 'mobile repair', icon: '📱', hint: 'High Margin Micro Unit' },
        { label: 'Food Cart / Bakery / Tea Stall', value: 'food stall', icon: '🍲', hint: 'Daily Cash Flow Business' },
        { label: 'E-Rickshaw / Passenger Transport', value: 'e-rickshaw', icon: '🛺', hint: 'Green Business Scheme 6%' },
        { label: 'Grocery / Kirana / Provision Store', value: 'grocery', icon: '🛒', hint: 'Essential Retail Store' },
        { label: 'Carpentry / Wooden Furniture', value: 'carpentry', icon: '🪚', hint: 'Skilled Artisan Workshop' },
        { label: 'Beauty Parlour / Hair Salon', value: 'beauty salon', icon: '✂️', hint: 'Women Entrepreneur Focus' },
        { label: 'Dairy / Poultry / Agro Processing', value: 'dairy', icon: '🥛', hint: 'Rural Livelihood Scheme' },
        { label: 'Leather Crafts / Footwear Unit', value: 'leather craft', icon: '👞', hint: 'Traditional Artisan Credit' },
        { label: 'Other Business (Enter Custom)', value: 'other', icon: '✨', hint: 'Specify your unique venture' }
      ]
    },
    {
      id: 'location',
      title: 'Target District / Location',
      subTitle: 'ನಿಮ್ಮ ವ್ಯಾಪಾರ ಸ್ಥಳ',
      question: 'Where will your business or project be located?',
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
      title: 'Estimated Total Project Cost',
      subTitle: 'ಅಂದಾಜು ಯೋಜನಾ ವೆಚ್ಚ',
      question: 'What is the estimated total setup cost for machinery and stock?',
      options: [
        { label: '₹1.0 Lakh (Micro)', value: 100000 },
        { label: '₹1.2 Lakh (Tailoring / Food)', value: 120000 },
        { label: '₹1.8 Lakh (Mobile Lab - Standard)', value: 180000 },
        { label: '₹2.5 Lakh (Transport / Workshop)', value: 250000 },
        { label: '₹5.0 Lakh (Small Enterprise)', value: 500000 },
        { label: '₹10.0 Lakh+ (Manufacturing)', value: 1000000 }
      ]
    },
    {
      id: 'annualFamilyIncome',
      title: 'Annual Family Household Income',
      subTitle: 'ವಾರ್ಷಿಕ ಕುಟುಂಬದ ಆದಾಯ',
      question: 'What is your total annual household income from all sources?',
      options: [
        { label: 'Under ₹1.5 Lakh (BPL Priority)', value: 150000 },
        { label: '₹2.5 Lakh', value: 250000 },
        { label: '₹3.6 Lakh (Ravi Kumar Persona)', value: 360000 },
        { label: '₹4.5 Lakh (Eligible)', value: 450000 },
        { label: 'Above ₹5.0 Lakh (General MSME)', value: 550000 }
      ]
    },
    {
      id: 'userType',
      title: 'Entrepreneurial Experience',
      subTitle: 'ಅನುಭವದ ವಿವರ',
      question: 'What best describes your current stage in business?',
      options: [
        { label: 'First-time Entrepreneur', value: 'new_entrepreneur', icon: '🌱' },
        { label: 'Existing Small Business Owner', value: 'existing_entrepreneur', icon: '💼' },
        { label: 'Student / Vocational Trainee', value: 'student', icon: '📚' }
      ]
    },
    {
      id: 'hasCasteCertificate',
      title: 'Community Caste Certificate',
      subTitle: 'ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ',
      question: 'Do you possess a valid Caste Certificate issued by the Tahsildar (RD Number)?',
      options: [
        { label: 'Yes, Have Valid RD Number Certificate', value: true, icon: '✅' },
        { label: 'No / In-Progress (Missing)', value: false, icon: '⚠️' }
      ]
    },
    {
      id: 'hasIncomeCertificate',
      title: 'Income Certificate Status',
      subTitle: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ',
      question: 'Do you have a current Tahsildar-attested Income Certificate?',
      options: [
        { label: 'Yes, Have Recent Income Certificate', value: true, icon: '✅' },
        { label: 'No / Expired', value: false, icon: '⚠️' }
      ]
    },
    {
      id: 'requiredLoanAmount',
      title: 'Concessional Loan Required',
      subTitle: 'ಅಗತ್ಯವಿರುವ ಸಾಲದ ಮೊತ್ತ',
      question: 'How much subsidized credit assistance do you need from Channel Partners?',
      options: [
        { label: '₹1.0 Lakh', value: 100000 },
        { label: '₹1.2 Lakh (Tailoring)', value: 120000 },
        { label: '₹1.5 Lakh (Mobile Repair Lab)', value: 150000 },
        { label: '₹2.2 Lakh', value: 220000 },
        { label: '₹4.0 Lakh (Full Scale)', value: 400000 }
      ]
    },
    {
      id: 'supportPreference',
      title: 'Application Channel Preference',
      subTitle: 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಆದ್ಯತೆ',
      question: 'How would you prefer to submit and follow up on your loan application?',
      options: [
        { label: 'Offline SCA / Corporation Office Support', value: 'offline', icon: '🏛️' },
        { label: 'Online / Bank Digital Processing', value: 'online', icon: '💻' },
        { label: 'Either / Hybrid Channel Routing', value: 'any', icon: '🤝' }
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
    const chosen = customBusiness.trim() || 'Custom Enterprise';
    setProfile(prev => ({ ...prev, businessType: chosen }));
    setExtractedJson(prev => ({ ...prev, business_type: chosen }));
    setIsOtherSelected(false);
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 font-sans">
      
      {/* Header Info - Humanized, warm & welcoming without voice mic distraction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart Guided Onboarding</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Tell Us About Your Entrepreneurial Project
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal leading-relaxed">
            Answer a few simple questions to determine exact scheme eligibility, subsidy limits, and bank readiness.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-600">
          <Globe2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Current Language:</span>
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
              <span className="font-bold text-slate-700">Question {currentStep + 1} of {questions.length}</span>
              <span className="font-mono text-emerald-700 font-bold">{Math.round(((currentStep + 1) / questions.length) * 100)}% Completed</span>
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
                  Step {currentStep + 1}
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
                  Enter your business or project name:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customBusiness}
                    onChange={(e) => setCustomBusiness(e.target.value)}
                    placeholder="e.g. Solar rooftop installation, Pottery, Candle making, Bakery..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmCustomBusiness}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Confirm &amp; Proceed &rarr;
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
              <span>Back</span>
            </button>

            {currentStep < questions.length - 1 ? (
              <button
                onClick={() => {
                  setIsOtherSelected(false);
                  setCurrentStep(prev => prev + 1);
                }}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onProceedToMatching}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
              >
                <span>Proceed to Scheme Matcher</span>
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
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Beneficiary Profile</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                Verified
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Profile parameters configured for deterministic scheme matching:
            </p>

            {/* Formatted Summary Box */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Selected Language:</span>
                <span className="font-bold text-amber-400 uppercase font-mono">{profile.preferredLanguage || lang}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Business Venture:</span>
                <span className="font-bold text-white capitalize">{profile.businessType}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Location / District:</span>
                <span className="font-bold text-white">{profile.location}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Required Loan:</span>
                <span className="font-bold text-emerald-400 font-mono">₹{profile.requiredLoanAmount.toLocaleString()}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Annual Family Income:</span>
                <span className="font-bold text-white font-mono">₹{profile.annualFamilyIncome.toLocaleString()}</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Caste Certificate:</span>
                <span className={`font-bold ${profile.hasCasteCertificate ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {profile.hasCasteCertificate ? 'RD Verified' : 'Missing / In-Progress'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onProceedToMatching}
            className="w-full mt-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
          >
            <span>Match Concessional Schemes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
