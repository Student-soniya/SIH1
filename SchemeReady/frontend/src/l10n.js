/**
 * SchemeReady - National Multi-Language Localization Engine (7 Indian Languages)
 */

export const supportedLanguages = [
  { code: "en", name: "English", native: "English", flag: "🔵" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🟠" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🟡" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🟢" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🟣" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🔴" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🟤" }
];

export function t(translationsObj, lang = "en") {
  if (!translationsObj || typeof translationsObj !== "object") return "";
  return translationsObj[lang] || translationsObj.en || translationsObj.hi || Object.values(translationsObj)[0] || "";
}

export const l10n = {
  "topGovBanner": {
    "en": "PM-SURAJ & NSFDC CHANNEL FINANCE",
    "hi": "PM-SURAJ एवं NSFDC चैनल वित्त",
    "kn": "PM-SURAJ ಮತ್ತು NSFDC ಚಾನಲ್ ಹಣಕಾಸು",
    "ta": "PM-SURAJ & NSFDC சேனல் நிதி",
    "te": "PM-SURAJ & NSFDC ఛానల్ ఫైనాన్స్",
    "mr": "PM-SURAJ आणि NSFDC चॅनेल फायनान्स",
    "bn": "PM-SURAJ ও NSFDC চ্যানেল ফাইন্যান্স"
  },
  "ministries": {
    "en": "Ministry of Social Justice & Empowerment • Ministry of MSME",
    "hi": "सामाजिक न्याय और अधिकारिता मंत्रालय • एमएसएमई मंत्रालय",
    "kn": "ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಸಬಲೀಕರಣ ಸಚಿವಾಲಯ • MSME ಸಚಿವಾಲಯ",
    "ta": "சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம் • MSME அமைச்சகம்",
    "te": "సామాజిక న్యాయం & సాధికారత మంత్రిత్వ శాఖ • MSME మంత్రిత్వ శాఖ",
    "mr": "सामाजिक न्याय आणि अधिकारिता मंत्रालय • सूक्ष्म, लघु आणि मध्यम उद्योग मंत्रालय",
    "bn": "সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রক • এমএসএমই মন্ত্রক"
  },
  "govtOfIndia": {
    "en": "Government of India",
    "hi": "भारत सरकार",
    "kn": "ಭಾರತ ಸರ್ಕಾರ",
    "ta": "இந்திய அரசு",
    "te": "భారత ప్రభుత్వం",
    "mr": "भारत सरकार",
    "bn": "ভারত সরকার"
  },
  "portalName": {
    "en": "SchemeReady",
    "hi": "स्कीम रेडी",
    "kn": "ಸ್ಕೀಮ್ ರೆಡಿ",
    "ta": "ஸ்கீம் ரெடி",
    "te": "స్కీమ్ రెడీ",
    "mr": "स्कीम रेडी",
    "bn": "স্কিম রেডি"
  },
  "subPortalName": {
    "en": "Udyam Saarthi AI",
    "hi": "उद्यम सारथी AI",
    "kn": "ಉದ್ಯಮ್ ಸಾರಥಿ AI",
    "ta": "உத்யம் சாரதி AI",
    "te": "ఉద్యమ్ సారథి AI",
    "mr": "उद्यम सारथी AI",
    "bn": "উদ্যম সারথি AI"
  },
  "portalTagline": {
    "en": "National Concessional Entrepreneurship & Credit Portal",
    "hi": "राष्ट्रीय रियायती उद्यमिता एवं ऋण पोर्टल",
    "kn": "ರಾಷ್ಟ್ರೀಯ ರಿಯಾಯಿತಿ ಉದ್ಯಮಶೀಲತೆ ಮತ್ತು ಸಾಲ ಪೋರ್ಟಲ್",
    "ta": "தேசிய சலுகை தொழில்முனைவோர் மற்றும் கடன் தளம்",
    "te": "జాతీయ రాయితీ వ్యవస్థాపకత మరియు రుణ పోర్టಲ್",
    "mr": "राष्ट्रीय सवलतीचे उद्योजकता आणि कर्ज पोर्टल",
    "bn": "জাতীয় রেয়াতযোগ্য উদ্যোক্তা ও ঋণ পোর্টাল"
  },
  "navSchemes": {
    "en": "Schemes Directory",
    "hi": "योजना निर्देशिका",
    "kn": "ಯೋಜನೆಗಳ ಡೈರೆಕ್ಟರಿ",
    "ta": "திட்டங்கள் அடைவு",
    "te": "పథకాల డైరెక్టరీ",
    "mr": "योजना निर्देशिका",
    "bn": "স্কিম ডিরেক্টরি"
  },
  "navHowItWorks": {
    "en": "How It Works",
    "hi": "यह कैसे काम करता है",
    "kn": "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    "ta": "எவ்வாறு செயல்படுகிறது",
    "te": "ఇది ఎలా పనిచేస్తుంది",
    "mr": "हे कसे कार्य करते",
    "bn": "এটি কীভাবে কাজ করে"
  },
  "navViability": {
    "en": "AI Viability Engine",
    "hi": "एआई व्यवहार्यता इंजन",
    "kn": "AI ಕಾರ್ಯಸಾಧ್ಯತಾ ಎಂಜಿನ್",
    "ta": "AI சாத்தியக்கூறு இயந்திரம்",
    "te": "AI సాధ్యత ఇంజిన్",
    "mr": "AI व्यवहार्यता इंजिन",
    "bn": "এআই সম্ভাব্যতা ইঞ্জিন"
  },
  "navPartners": {
    "en": "Channel Partners",
    "hi": "चैनल पार्टनर्स",
    "kn": "ಚಾನಲ್ ಪಾಲುದಾರರು",
    "ta": "சேனல் கூட்டாளர்கள்",
    "te": "ఛానల్ భాగస్వాములు",
    "mr": "चॅनेल भागीदार",
    "bn": "চ্যানেল পার্টনার"
  },
  "navFaqs": {
    "en": "FAQs",
    "hi": "अक्सर पूछे जाने वाले प्रश्न",
    "kn": "ಪ್ರಶ್ನೋತ್ತರಗಳು",
    "ta": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    "te": "తరచుగా అడిగే ప్రశ్నలు",
    "mr": "वारंवार विचारले जाणारे प्रश्न",
    "bn": "সাধারণ জিজ্ঞাসা"
  },
  "startApplicationBtn": {
    "en": "Start Application",
    "hi": "आवेदन शुरू करें",
    "kn": "ಅರ್ಜಿ ಪ್ರಾರಂಭಿಸಿ",
    "ta": "விண்ணப்பத்தைத் தொடங்குங்கள்",
    "te": "దరఖాస్తు ప్రారంభించండి",
    "mr": "अर्ज सुरू करा",
    "bn": "আবেদন শুরু করুন"
  },
  "signInBtn": {
    "en": "Sign In",
    "hi": "साइन इन",
    "kn": "ಸೈನ್ ಇನ್",
    "ta": "உள்நுழையவும்",
    "te": "సైన్ ఇన్",
    "mr": "साइन इन करा",
    "bn": "সাইন ইন"
  },
  "statCeiling": {
    "en": "Annual Family Income Ceiling",
    "hi": "वार्षिक पारिवारिक आय सीमा",
    "kn": "ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ ಮಿತಿ",
    "ta": "ஆண்டு குடும்ப வருமான உச்சவரம்பு",
    "te": "వార్షిక కుటుంబ ఆదాయ పరిమితి",
    "mr": "वार्षिक कौटुंबिक उत्पन्न मर्यादा",
    "bn": "বার্ষিক পারিবারিক আয়ের ঊর্ধ্বসীমা"
  },
  "statRates": {
    "en": "Subsidized Concessional Rates",
    "hi": "रियायती रियायती ब्याज दरें",
    "kn": "ರಿಯಾಯಿತಿ ಬಡ್ಡಿದರಗಳು",
    "ta": "மானிய சலுகை வட்டி விகிதங்கள்",
    "te": "రాయితీ వడ్డీ రేట్లు",
    "mr": "सवलतीचे व्याजदर",
    "bn": "ভর্তুকিযুক্ত রেয়াতযোগ্য সুদের হার"
  },
  "statCoverage": {
    "en": "Project Cost Financed by Govt",
    "hi": "सरकार द्वारा वित्तपोषित परियोजना लागत",
    "kn": "ಸರ್ಕಾರದಿಂದ ಹಣಕಾಸು ನೆರವು ಪಡೆಯುವ ಯೋಜನಾ ವೆಚ್ಚ",
    "ta": "அரசாங்கத்தால் நிதியளிக்கப்படும் திட்டச் செலவு",
    "te": "ప్రభుత్వం ద్వారా నిధులు సమకూర్చబడిన ప్రాజెక్ట్ వ్యయం",
    "mr": "शासनाकडून वित्तपुरवठा केलेला प्रकल्प खर्च",
    "bn": "সরকার কর্তৃক অর্থায়নকৃত প্রকল্প ব্যয়"
  },
  "statPartners": {
    "en": "State SCAs & Bank Branches",
    "hi": "राज्य एससीए एवं बैंक शाखाएं",
    "kn": "ರಾಜ್ಯ SCA ಗಳು ಮತ್ತು ಬ್ಯಾಂಕ್ ಶಾಖೆಗಳು",
    "ta": "மாநில SCA-கள் மற்றும் வங்கி கிளைகள்",
    "te": "రాష్ట్ర SCAలు మరియు బ్యాంక్ శాఖలు",
    "mr": "राज्य एससीए आणि बँक शाखा",
    "bn": "রাজ্য এসসিএ এবং ব্যাংক শাখা"
  },
  "lakhs": {
    "en": "Lakhs",
    "hi": "लाख",
    "kn": "ಲಕ್ಷ",
    "ta": "லட்சம்",
    "te": "లక్షలు",
    "mr": "लाख",
    "bn": "লাখ"
  },
  "upTo90": {
    "en": "Up to 90%",
    "hi": "90% तक",
    "kn": "90% ವರೆಗೆ",
    "ta": "90% வரை",
    "te": "90% వరకు",
    "mr": "90% पर्यंत",
    "bn": "৯০% পর্যন্ত"
  },
  "partners100": {
    "en": "100+ Partners",
    "hi": "100+ पार्टनर्स",
    "kn": "100+ ಪಾಲುದಾರರು",
    "ta": "100+ கூட்டாளர்கள்",
    "te": "100+ భాగస్వాములు",
    "mr": "100+ भागीदार",
    "bn": "১০০+ অংশীদার"
  },
  "onboardingBadge": {
    "en": "Smart Guided Onboarding",
    "hi": "स्मार्ट निर्देशित ऑनबोर्डिंग",
    "kn": "ಸ್ಮಾರ್ಟ್ ಮಾರ್ಗದರ್ಶಿ ಆನ್‌ಬೋರ್ಡಿಂಗ್",
    "ta": "ஸ்மார்ட் வழிகாட்டப்பட்ட ஆன்போர்டிங்",
    "te": "స్మార్ట్ గైడెడ్ ఆన్‌బోర్డింగ్",
    "mr": "स्मार्ट मार्गदर्शित ऑनबोर्डिंग",
    "bn": "স্মার্ট নির্দেশিত অনবোর্ডিং"
  },
  "onboardingHeading": {
    "en": "Tell Us About Your Entrepreneurial Project",
    "hi": "हमें अपनी उद्यमशीलता परियोजना के बारे में बताएं",
    "kn": "ನಿಮ್ಮ ಉದ್ಯಮಶೀಲತಾ ಯೋಜನೆಯ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ",
    "ta": "உங்கள் தொழில்முனைவோர் திட்டம் பற்றி எங்களிடம் கூறுங்கள்",
    "te": "మీ వ్యవస్థాపక ప్రాజెక్ట్ గురించి మాకు చెప్పండి",
    "mr": "आम्हाला तुमच्या उद्योजकता प्रकल्पाबद्दल सांगा",
    "bn": "আমাদের আপনার উদ্যোগ প্রকল্প সম্পর্কে বলুন"
  },
  "onboardingSubheading": {
    "en": "Answer a few simple questions to determine exact scheme eligibility, subsidy limits, and bank readiness.",
    "hi": "सटीक योजना पात्रता, सब्सिडी सीमा और बैंक तत्परता निर्धारित करने के लिए कुछ सरल प्रश्नों के उत्तर दें।",
    "kn": "ನಿಖರವಾದ ಯೋಜನೆ ಅರ್ಹತೆ, ಸಬ್ಸಿಡಿ ಮಿತಿ ಮತ್ತು ಬ್ಯಾಂಕ್ ಸನ್ನದ್ಧತೆಯನ್ನು ನಿರ್ಧರಿಸಲು ಕೆಲವು ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.",
    "ta": "சரியான திட்டத் தகுதி, மானிய வரம்பு மற்றும் வங்கித் தயார்நிலையைத் தீர்மானிக்க சில எளிய கேள்விகளுக்குப் பதிலளிக்கவும்.",
    "te": "ఖచ్చితమైన పథకం అర్హత, సబ్సిడీ పరిమితి మరియు బ్యాంక్ సంసిద్ధతను నిర్ణయించడానికి కొన్ని సాధారణ ప్రశ్నలకు సమాధానం ఇవ్వండి.",
    "mr": "अचूक योजना पात्रता, सबसिडी मर्यादा आणि बँक सज्जता निश्चित करण्यासाठी काही सोप्या प्रश्नांची उत्तरे द्या.",
    "bn": "সঠিক স্কিম যোগ্যতা, ভর্তুকি সীমা এবং ব্যাংক প্রস্তুতি নির্ধারণ করতে কয়েকটি সহজ প্রশ্নের উত্তর দিন।"
  },
  "currentLangLabel": {
    "en": "Current Language:",
    "hi": "वर्तमान भाषा:",
    "kn": "ಪ್ರಸ್ತುತ ಭಾಷೆ:",
    "ta": "தற்போதைய மொழி:",
    "te": "ప్రస్తుత భాష:",
    "mr": "सध्याची भाषा:",
    "bn": "বর্তমান ভাষা:"
  },
  "questionProgress": {
    "en": "Question",
    "hi": "प्रश्न",
    "kn": "ಪ್ರಶ್ನೆ",
    "ta": "கேள்வி",
    "te": "ప్రశ్న",
    "mr": "प्रश्न",
    "bn": "প্রশ্ন"
  },
  "ofTotal": {
    "en": "of",
    "hi": "/",
    "kn": "ರ",
    "ta": "/",
    "te": "/",
    "mr": "/",
    "bn": "এর"
  },
  "completedStatus": {
    "en": "Completed",
    "hi": "पूर्ण",
    "kn": "ಪೂರ್ಣಗೊಂಡಿದೆ",
    "ta": "முடிந்தது",
    "te": "పూర్తయింది",
    "mr": "पूर्ण झाले",
    "bn": "সম্পূর্ণ"
  },
  "stepLabel": {
    "en": "Step",
    "hi": "चरण",
    "kn": "ಹಂತ",
    "ta": "படி",
    "te": "దశ",
    "mr": "टप्पा",
    "bn": "ধাপ"
  },
  "customBusinessPrompt": {
    "en": "Enter your custom business or venture idea:",
    "hi": "अपना विशिष्ट व्यवसाय या उद्यम विचार दर्ज करें:",
    "kn": "ನಿಮ್ಮ ಕಸ್ಟಮ್ ವ್ಯಾಪಾರ ಕಲ್ಪನೆಯನ್ನು ನಮೂದಿಸಿ:",
    "ta": "உங்கள் தனிப்பயன் வணிக யோசனையை உள்ளிடவும்:",
    "te": "మీ వ్యాపార ఆలోచనను నమోదు చేయండి:",
    "mr": "तुमची व्यवसाय कल्पना प्रविष्ट करा:",
    "bn": "আপনার অনন্য ব্যবসার ধারণা লিখুন:"
  },
  "customBusinessPlaceholder": {
    "en": "e.g. Solar panel installation, CNC woodworking, cloud kitchen...",
    "hi": "उदा. सौर पैनल स्थापना, सीएनसी वुडवर्किंग, क्लाउड किचन...",
    "kn": "ಉದಾ. ಸೌರ ಫಲಕ ಸ್ಥಾಪನೆ, ಮರಗೆಲಸ, ಕ್ಲೌಡ್ ಕಿಚನ್...",
    "ta": "எ.கா. சோலார் பேனல் பொருத்துதல், மரவேலை, கிளவுட் கிச்சன்...",
    "te": "ఉదా. సోలార్ ప్యానెల్ ఇన్‌స్టాలేషన్, చెక్క పని, క్లౌడ్ కిచెన్...",
    "mr": "उदा. सौर पॅनेल बसवणे, लाकूडकाम, क्लाउड किचन...",
    "bn": "যেমন সোলার প্যানেল স্থাপন, কাঠের কাজ, ক্লাউড কিচেন..."
  },
  "confirmAndContinue": {
    "en": "Confirm & Continue",
    "hi": "पुष्टि करें और आगे बढ़ें",
    "kn": "ಖಚಿತಪಡಿಸಿ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ",
    "ta": "உறுதிசெய்து தொடரவும்",
    "te": "ధృవీకరించి కొనసాగించండి",
    "mr": "निश्चित करा आणि पुढे जा",
    "bn": "নিশ্চিত করুন ও এগিয়ে যান"
  },
  "prevButton": {
    "en": "Previous",
    "hi": "पिछला",
    "kn": "ಹಿಂದಿನದು",
    "ta": "முந்தைய",
    "te": "మునుపటి",
    "mr": "मागील",
    "bn": "আগেরটি"
  },
  "nextButton": {
    "en": "Next",
    "hi": "आगे",
    "kn": "ಮುಂದಿನದು",
    "ta": "அடுத்து",
    "te": "తదుపరి",
    "mr": "पुढे",
    "bn": "পরবর্তী"
  },
  "finishOnboardingBtn": {
    "en": "Finish & Check Eligibility",
    "hi": "समाप्त करें और योजना पात्रता देखें",
    "kn": "ಮುಗಿಸಿ ಮತ್ತು ಯೋಜನೆ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ",
    "ta": "முடித்து திட்டத் தகுதியைச் சரிபார்க்கவும்",
    "te": "ముగించి పథకం అర్హతను తనిఖీ చేయండి",
    "mr": "पूर्ण करा आणि योजना पात्रता तपासा",
    "bn": "সম্পূর্ণ করুন ও স্কিম যোগ্যতা দেখুন"
  },
  "liveDossierTitle": {
    "en": "Live Profile Dossier",
    "hi": "लाइव प्रोफाइल डोजियर",
    "kn": "ಲೈವ್ ಪ್ರೊಫೈಲ್ ಡೋಸಿಯರ್",
    "ta": "நேரலை சுயவிவர ஆவணம்",
    "te": "లైవ్ ప్రొఫైల్ డోసియర్",
    "mr": "थेट प्रोफाइल डोसियर",
    "bn": "লাইভ প্রোফাইল ডসিয়ার"
  },
  "autoExtractingBadge": {
    "en": "AI Auto-Extracting",
    "hi": "एआई स्वतः-निष्कर्षण",
    "kn": "AI ಸ್ವಯಂ-ಹೊರತೆಗೆಯುವಿಕೆ",
    "ta": "AI தானியங்கி பிரித்தெடுத்தல்",
    "te": "AI ఆటో-ఎక్స్‌ట్రాక్టింగ్",
    "mr": "AI स्वयंचलित निष्कर्षण",
    "bn": "এআই স্বয়ংক্রিয় নিষ্কাশন"
  },
  "officialVerificationNotice": {
    "en": "Official Government Portal Verified",
    "hi": "आधिकारिक सरकारी पोर्टल द्वारा सत्यापित",
    "kn": "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ನಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    "ta": "அதிகாரப்பூர்வ அரசு போர்டல் சரிபார்க்கப்பட்டது",
    "te": "అధికారిక ప్రభుత్వ పోర్టల్ ద్వారా ధృవీకరించబడింది",
    "mr": "अधिकृत सरकारी पोर्टलद्वारे सत्यापित",
    "bn": "সরকারি পোর্টাল দ্বারা যাচাইকৃত"
  },
  "dossierTrackingLabel": {
    "en": "Dossier Tracking ID:",
    "hi": "डोजियर ट्रैकिंग आईडी:",
    "kn": "ಡೋಸಿಯರ್ ಟ್ರ್ಯಾಕಿಂಗ್ ID:",
    "ta": "ஆவண கண்காணிப்பு ஐடி:",
    "te": "డోసియర్ ట్రాకింగ్ ID:",
    "mr": "डोसियर ट्रॅकिंग आयडी:",
    "bn": "ডসিয়ার ট্র্যাকিং আইডি:"
  },
  "dateLabel": {
    "en": "Date:",
    "hi": "दिनांक:",
    "kn": "ದಿನಾಂಕ:",
    "ta": "தேதி:",
    "te": "తేదీ:",
    "mr": "दिनांक:",
    "bn": "তারিখ:"
  },
  "downloadPdfBtn": {
    "en": "Download PDF Dossier",
    "hi": "पीडीएफ डोजियर डाउनलोड करें",
    "kn": "PDF ಡೋಸಿಯರ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    "ta": "PDF ஆவணத்தை பதிவிறக்கவும்",
    "te": "PDF డోసియర్‌ను డౌన్‌లోడ్ చేయండి",
    "mr": "पीडीएफ डोसियर डाउनलोड करा",
    "bn": "পিডিএফ ডসিয়ার ডাউনলোড করুন"
  },
  "printBtn": {
    "en": "Print Dossier",
    "hi": "डोजियर प्रिंट करें",
    "kn": "ಡೋಸಿಯರ್ ಮುದ್ರಿಸಿ",
    "ta": "ஆவணத்தை அச்சிடுக",
    "te": "డోసియర్‌ను ముద్రించండి",
    "mr": "डोसियर मुद्रित करा",
    "bn": "ডসিয়ার প্রিন্ট করুন"
  }
};

export function getOnboardingQuestions(lang = 'en') {
  const isHi = lang === 'hi';
  const isKn = lang === 'kn';
  const isTa = lang === 'ta';
  const isTe = lang === 'te';
  const isMr = lang === 'mr';
  const isBn = lang === 'bn';

  return [
    {
      id: 'preferredLanguage',
      title: isKn ? 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ' :
             isTa ? 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்' :
             isTe ? 'మీ ప్రాధాన్య భాషను ఎంచుకోండి' :
             isMr ? 'तुमची पसंतीची भाषा निवडा' :
             isBn ? 'আপনার পছন্দের ভাষা নির্বাচন করুন' :
             isHi ? 'अपनी पसंदीदा भाषा चुनें' :
             'Choose Your Preferred Language',
      subTitle: isKn ? 'ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಮುಂದುವರಿಯಲು ಭಾಷೆ' :
                isTa ? 'போர்ட்டலில் தொடர மொழி' :
                isTe ? 'పోర్టల్‌లో కొనసాగడానికి భాష' :
                isMr ? 'पोर्टलवर सुरू ठेवण्यासाठी भाषा' :
                isBn ? 'পোর্টালে এগিয়ে যাওয়ার ভাষা' :
                isHi ? 'जिस भाषा में आप काम करना चाहते हैं उसे चुनें' :
                'Choose portal language',
      question: isKn ? 'ಸ್ಕೀಮ್ ರೆಡಿಯಲ್ಲಿ ನೀವು ಯಾವ ಭಾಷೆಯಲ್ಲಿ ಮುಂದುವರಿಯಲು ಬಯಸುತ್ತೀರಿ?' :
                isTa ? 'ஸ்கீம் ரெடியில் எந்த மொழியில் தொடர விரும்புகிறீர்கள்?' :
                isTe ? 'స్కీమ్ రెడీలో మీరు ఏ భాషలో కొనసాగాలనుకుంటున్నారు?' :
                isMr ? 'स्कीम रेडीमध्ये तुम्ही कोणत्या भाषेत पुढे जाऊ इच्छिता?' :
                isBn ? 'স্কিম রেডিতে আপনি কোন ভাষায় এগিয়ে যেতে চান?' :
                isHi ? 'स्कीम रेडी में आप किस भाषा में आगे बढ़ना चाहते हैं?' :
                'In which language would you like to proceed with SchemeReady?',
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
      title: isKn ? 'ಪ್ರಸ್ತಾಪಿತ ವ್ಯವಹಾರ ಅಥವಾ ಉದ್ಯಮ' :
             isTa ? 'முன்மொழியப்பட்ட வணிகம் அல்லது தொழில்' :
             isTe ? 'ప్రతిపాదిత వ్యాపారం లేదా పరిశ్రమ' :
             isMr ? 'प्रस्तावित व्यवसाय किंवा उद्योग' :
             isBn ? 'প্রস্তাবিত ব্যবসা বা উদ্যোগ' :
             isHi ? 'प्रस्तावित व्यवसाय या उद्यम' :
             'Proposed Business or Enterprise',
      subTitle: isKn ? 'ನೀವು ಯಾವ ವ್ಯವಹಾರವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಬಯಸುತ್ತೀರಿ?' :
                isTa ? 'நீங்கள் எந்த வணிகத்தைத் தொடங்க விரும்புகிறீர்கள்?' :
                isTe ? 'మీరు ఏ వ్యాపారాన్ని ప్రారంభించాలనుకుంటున్నారు?' :
                isMr ? 'तुम्हाला कोणता व्यवसाय सुरू करायचा आहे?' :
                isBn ? 'আপনি কোন ব্যবসা শুরু করতে চান?' :
                isHi ? 'आप कौन सा उद्यम शुरू या विस्तार करना चाहते हैं?' :
                'What type of business do you want to pursue?',
      question: isKn ? 'ನೀವು ಯಾವ ರೀತಿಯ ವ್ಯವಹಾರ ಅಥವಾ ಯೋಜನೆಯನ್ನು ಪ್ರಾರಂಭಿಸಲು ಬಯಸುತ್ತೀರಿ?' :
                isTa ? 'நீங்கள் எந்த வகையான வணிகம் அல்லது திட்டத்தைத் தொடங்க விரும்புகிறீர்கள்?' :
                isTe ? 'మీరు ఏ రకమైన వ్యాపారం లేదా ప్రాజెక్ట్‌ను ప్రారంభించాలనుకుంటున్నారు?' :
                isMr ? 'तुम्हाला कोणत्या प्रकारचा व्यवसाय किंवा प्रकल्प सुरू करायचा आहे?' :
                isBn ? 'আপনি কী ধরণের ব্যবসা বা প্রকল্প শুরু করতে চান?' :
                isHi ? 'आप किस प्रकार का व्यवसाय या परियोजना शुरू करना चाहते हैं?' :
                'What type of business or project do you want to start and pursue?',
      options: [
        {
          label: isKn ? 'தையல் / ಉಡುಪು ಕಾರ್ಯಾಗಾರ' :
                 isTa ? 'தையல் / ஆடை பட்டறை' :
                 isTe ? 'టైలరింగ్ / దుస్తుల వర్క్‌షాప్' :
                 isMr ? 'शिलाई / कपडे कार्यशाळा' :
                 isBn ? 'দর্জি / পোশাক কর্মশালা' :
                 isHi ? 'सिलाई / परिधान कार्यशाला' :
                 'Tailoring / Garments Workshop',
          value: 'tailoring',
          icon: '🧵',
          hint: 'NSFDC MSY & MCS Aligned (4% - 5%)'
        },
        {
          label: isKn ? 'ಮೊಬೈಲ್ ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ರಿಪೇರಿ ಲ್ಯಾಬ್' :
                 isTa ? 'மொபைல் மற்றும் எலக்ட்ரானிக்ஸ் பழுதுபார்க்கும் லேப்' :
                 isTe ? 'మొబైల్ & ఎలక్ట్రానిక్స్ రిపేర్ ల్యాబ్' :
                 isMr ? 'मोबाईल आणि इलेक्ट्रॉनिक्स दुरुस्ती लॅब' :
                 isBn ? 'মোবাইল ও ইলেকট্রনিক্স মেরামতের ল্যাব' :
                 isHi ? 'मोबाइल एवं इलेक्ट्रॉनिक्स रिपेयर लैब' :
                 'Mobile & Electronics Repair Lab',
          value: 'mobile repair',
          icon: '📱',
          hint: 'High Margin Micro Enterprise'
        },
        {
          label: isKn ? 'ಆಹಾರ ಕಾರ್ಟ್ / ಬೇಕರಿ / ಟೀ ಸ್ಟಾಲ್' :
                 isTa ? 'உணவு வண்டி / பேக்கரி / டீ கடை' :
                 isTe ? 'ఫుడ్ కార్ట్ / బేకరీ / టీ స్టాల్' :
                 isMr ? 'फूड कार्ट / बेकरी / टी स्टॉल' :
                 isBn ? 'ফুড কার্ট / বেকারি / চায়ের স্টল' :
                 isHi ? 'फूड कार्ट / बेकरी / टी स्टॉल' :
                 'Food Cart / Bakery / Tea Stall',
          value: 'food stall',
          icon: '🍲',
          hint: 'Daily Cash Flow Business'
        },
        {
          label: isKn ? 'ಇ-ರಿಕ್ಷಾ / ಸಾರಿಗೆ ಸೇವೆ' :
                 isTa ? 'இ-ரிக்ஷா / பயணிகள் போக்குவரத்து' :
                 isTe ? 'ఇ-రిక్షా / ప్రయాణీకుల రవాణా' :
                 isMr ? 'ई-रिक्षा / प्रवासी वाहतूक' :
                 isBn ? 'ই-রিকশা / যাত্রী পরিবহন' :
                 isHi ? 'ई-रिक्शा / यात्री परिवहन' :
                 'E-Rickshaw / Passenger Transport',
          value: 'e-rickshaw',
          icon: '🛺',
          hint: 'Green Business Scheme (6%)'
        },
        {
          label: isKn ? 'ಕಿರಾಣಿ / ಪ್ರಾವಿಷನ್ ಸ್ಟೋರ್' :
                 isTa ? 'மளிகை கடை / பிராவிஷன் ஸ்டோர்' :
                 isTe ? 'కిరాణా / ప్రొవిజన్ స్టోర్' :
                 isMr ? 'किराणा / प्रोव्हिजन स्टोअर' :
                 isBn ? 'মুদি দোকান / প্রোভিশন স্টোর' :
                 isHi ? 'किराना / प्रोविजन स्टोर' :
                 'Grocery / Kirana / Provision Store',
          value: 'grocery',
          icon: '🛒',
          hint: 'Essential Retail Business'
        },
        {
          label: isKn ? 'ಮರಗೆಲಸ / ಪೀಠೋಪಕರಣಗಳು' :
                 isTa ? 'மரவேலை / மர தளபாடங்கள்' :
                 isTe ? 'చెక్క పని / చెక్క ఫర్నిచర్' :
                 isMr ? 'सुतारकाम / लाकडी फर्निचर' :
                 isBn ? 'ছুতোর কাজ / কাঠের আসবাব' :
                 isHi ? 'बढ़ईगीरी / लकड़ी का फर्नीचर' :
                 'Carpentry / Wooden Furniture',
          value: 'carpentry',
          icon: '🪚',
          hint: 'Artisan Concessional Credit'
        },
        {
          label: isKn ? 'ಬ್ಯೂಟಿ ಪಾರ್ಲರ್ / ಹೇರ್ ಸಲೂನ್' :
                 isTa ? 'பியூட்டி பார்லர் / சலூன்' :
                 isTe ? 'బ్యూటీ పార్లర్ / హెయిర్ సెలూన్' :
                 isMr ? 'ब्युटी पार्लर / हेअर सलून' :
                 isBn ? 'বিউটি পার্লার / হেয়ার সেলুন' :
                 isHi ? 'ब्यूटी पार्लर / हेयर सैलून' :
                 'Beauty Parlour / Hair Salon',
          value: 'beauty salon',
          icon: '✂️',
          hint: 'Women Entrepreneur Special'
        },
        {
          label: isKn ? 'ಡೈರಿ / ಕೋಳಿ ಸಾಕಾಣಿಕೆ / ಕೃಷಿ ಸಂಸ್ಕರಣೆ' :
                 isTa ? 'பால் பண்ணை / கோழி பண்ணை / வேளாண்மை' :
                 isTe ? 'డైరీ / పౌల్ట్రీ / వ్యవసాయ ప్రాసెసింగ్' :
                 isMr ? 'डेअरी / पोल्ट्री / कृषी प्रक्रिया' :
                 isBn ? 'দুগ্ধ খামার / পোল্ট্রি / কৃষি প্রক্রিয়াকরণ' :
                 isHi ? 'डेयरी / पोल्ट्री / कृषि प्रसंस्करण' :
                 'Dairy / Poultry / Agro Processing',
          value: 'dairy',
          icon: '🥛',
          hint: 'Rural Livelihood Scheme'
        },
        {
          label: isKn ? 'ಚರ್ಮದ ಕರಕುಶಲ / ಪಾದರಕ್ಷೆಗಳ ಘಟಕ' :
                 isTa ? 'தோல் கைவினை / காலணி பிரிவு' :
                 isTe ? 'తోలు హస్తకళలు / పాదరక్షల యూనిట్' :
                 isMr ? 'चर्मकला / पादत्राणे उत्पादन' :
                 isBn ? 'চামড়ার কারুশিল্প / পাদুকা ইউনিট' :
                 isHi ? 'चर्म शिल्प / जूता निर्माण इकाई' :
                 'Leather Crafts / Footwear Unit',
          value: 'leather craft',
          icon: '👞',
          hint: 'Traditional Artisan Credit'
        },
        {
          label: isKn ? 'ಇತರ ವ್ಯಾಪಾರ (ಕಸ್ಟಮ್ ಹೆಸರು ನಮೂದಿಸಿ)' :
                 isTa ? 'மற்ற வணிகம் (பெயரை உள்ளிடவும்)' :
                 isTe ? 'ఇతర వ్యాపారం (పేరు నమోదు చేయండి)' :
                 isMr ? 'इतर व्यवसाय (नाव प्रविष्ट करा)' :
                 isBn ? 'অন্যান্য ব্যবসা (নাম লিখুন)' :
                 isHi ? 'अन्य व्यवसाय (कस्टम नाम दर्ज करें)' :
                 'Other Business (Enter Custom)',
          value: 'other',
          icon: '✨',
          hint: 'Specify your unique venture'
        }
      ]
    },
    {
      id: 'location',
      title: isKn ? 'ಗುರಿ ಜಿಲ್ಲೆ / ಸ್ಥಳ' :
             isTa ? 'இலக்கு மாவட்டம் / இடம்' :
             isTe ? 'లక్ష్య జిల్లా / ప్రదేశం' :
             isMr ? 'लक्ष्यित जिल्हा / स्थान' :
             isBn ? 'টার্গেট জেলা / অবস্থান' :
             isHi ? 'लक्षित जिला / स्थान' :
             'Target District / Location',
      subTitle: isKn ? 'ನಿಮ್ಮ ವ್ಯಾಪಾರ ಘಟಕದ ಸ್ಥಳ' :
                isTa ? 'உங்கள் வணிகப் பிரிவின் இடம்' :
                isTe ? 'మీ వ్యాపార యూనిట్ ప్రదేశం' :
                isMr ? 'तुमच्या व्यावसायिक घटकाचे स्थान' :
                isBn ? 'আপনার বাণিজ্যিক ইউনিটের অবস্থান' :
                isHi ? 'आपकी व्यावसायिक इकाई का स्थान' :
                'Location of your business enterprise',
      question: isKn ? 'ನಿಮ್ಮ ವ್ಯಾಪಾರ ಅಥವಾ ಯೋಜನೆ ಎಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾಗುವುದು?' :
                isTa ? 'உங்கள் வணிகம் அல்லது திட்டம் எங்கு அமைக்கப்படும்?' :
                isTe ? 'మీ వ్యాపారం లేదా ప్రాజెక్ట్ ఎక్కడ ఉంటుంది?' :
                isMr ? 'तुमचा व्यवसाय किंवा प्रकल्प कुठे असेल?' :
                isBn ? 'আপনার ব্যবসা বা প্রকল্প কোথায় অবস্থিত হবে?' :
                isHi ? 'आपका व्यवसाय या परियोजना कहाँ स्थित होगी?' :
                'Where will your business or project be located?',
      options: [
        { label: isKn ? 'ಬೆಂಗಳೂರು (ನಗರ)' : isTa ? 'பெங்களூரு (நகர்ப்புறம்)' : isTe ? 'బెంగళూరు (పట్టణ)' : isMr ? 'बंगळुरू (शहरी)' : isBn ? 'বেঙ্গালুরু (শহুরে)' : isHi ? 'बेंगलुरु (शहरी)' : 'Bengaluru (Urban)', value: 'Bengaluru', icon: '🏙️' },
        { label: isKn ? 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ' : isTa ? 'பெங்களூரு ஊரகம்' : isTe ? 'బెంగళూరు గ్రామీణ' : isMr ? 'बंगळुरू ग्रामीण' : isBn ? 'বেঙ্গালুরু গ্রামীণ' : isHi ? 'बेंगलुरु ग्रामीण' : 'Bengaluru Rural', value: 'Bengaluru Rural', icon: '🌳' },
        { label: isKn ? 'ಮೈಸೂರು' : isTa ? 'மைசூரு' : isTe ? 'మైసూరు' : isMr ? 'म्हैसूर' : isBn ? 'মহীশূর' : isHi ? 'मैसूरु' : 'Mysuru', value: 'Mysuru', icon: '🏰' },
        { label: isKn ? 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ' : isTa ? 'ஹூப்ளி-தார்வாட்' : isTe ? 'హుబ్లీ-ధార్వాడ్' : isMr ? 'हुबळी-धारवाड' : isBn ? 'হুবলি-ধারওয়াদ' : isHi ? 'हुबली-धारवाड़' : 'Hubballi-Dharwad', value: 'Hubballi-Dharwad', icon: '🏭' },
        { label: isKn ? 'ಬೆಳಗಾವಿ' : isTa ? 'பெலகாவி' : isTe ? 'బెల్గాం' : isMr ? 'बेळगाव' : isBn ? 'বেলগাভি' : isHi ? 'बेलगावी' : 'Belagavi', value: 'Belagavi', icon: '🏛️' },
        { label: isKn ? 'ಕಲಬುರಗಿ' : isTa ? 'கலபுரகி' : isTe ? 'కలబురగి' : isMr ? 'कलबुर्गी' : isBn ? 'কলবুরগি' : isHi ? 'कलबुर्गी' : 'Kalaburagi', value: 'Kalaburagi', icon: '🌾' }
      ]
    },
    {
      id: 'estimatedProjectCost',
      title: isKn ? 'ಅಂದಾಜು ಒಟ್ಟು ಯೋಜನಾ ವೆಚ್ಚ' :
             isTa ? 'மதிப்பிடப்பட்ட மொத்த திட்டச் செலவு' :
             isTe ? 'అంచనా వేసిన మొత్తం ప్రాజెక్ట్ వ్యయం' :
             isMr ? 'अंदाजे एकूण प्रकल्प खर्च' :
             isBn ? 'আনুমানিক মোট প্রকল্প ব্যয়' :
             isHi ? 'अनुमानित कुल परियोजना लागत' :
             'Estimated Total Project Cost',
      subTitle: isKn ? 'ಯಂತ್ರೋಪಕರಣಗಳು ಮತ್ತು ಕಚ್ಚಾ ವಸ್ತುಗಳ ವೆಚ್ಚ' :
                isTa ? 'இயந்திரங்கள் மற்றும் மூலப்பொருள் செலவு' :
                isTe ? 'యంత్రాలు & ముడిసరుకు వ్యయం' :
                isMr ? 'यंत्रसामग्री आणि कच्च्या मालाचा खर्च' :
                isBn ? 'যন্ত্রপাতি ও কাঁচামালের খরচ' :
                isHi ? 'मशीनरी, उपकरण एवं कच्चा माल लागत' :
                'Machinery, tooling, and setup capital',
      question: isKn ? 'ಯಂತ್ರೋಪಕರಣಗಳು ಮತ್ತು ಆರಂಭಿಕ ವೆಚ್ಚಕ್ಕಾಗಿ ಅಂದಾಜು ಬಂಡವಾಳ ಎಷ್ಟು?' :
                isTa ? 'இயந்திரங்கள் மற்றும் தொடக்கத்திற்கான மொத்த செலவு என்ன?' :
                isTe ? 'యంత్రాలు మరియు స్టాక్ కోసం మొత్తం సెటప్ ఖర్చు ఎంత?' :
                isMr ? 'यंत्रसामग्री आणि सुरुवातीच्या खर्चासाठी अंदाजे भांडवल किती?' :
                isBn ? 'যন্ত্রপাতি ও প্রাথমিক সেটআপের আনুমানিক খরচ কত?' :
                isHi ? 'मशीनरी और स्टॉक के लिए अनुमानित कुल सेटअप लागत क्या है?' :
                'What is the estimated total setup cost for machinery and stock?',
      options: [
        { label: '₹1.0 Lakh (Micro)', value: 100000 },
        { label: '₹1.2 Lakh (Tailoring / Food)', value: 120000 },
        { label: '₹1.8 Lakh (Mobile Lab - Standard)', value: 180000 },
        { label: '₹2.5 Lakh (Transport / Workshop)', value: 250000 },
        { label: '₹5.0 Lakh (Small Enterprise)', value: 500000 },
        { label: '₹10.0 Lakh+ (Commercial)', value: 1000000 }
      ]
    },
    {
      id: 'annualFamilyIncome',
      title: isKn ? 'ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ' :
             isTa ? 'ஆண்டு குடும்ப வருமானம்' :
             isTe ? 'వార్షిక కుటుంబ ఆదాయం' :
             isMr ? 'वार्षिक कौटुंबिक उत्पन्न' :
             isBn ? 'বার্ষিক পারিবারিক আয়' :
             isHi ? 'वार्षिक पारिवारिक घरेलू आय' :
             'Annual Family Household Income',
      subTitle: isKn ? 'ಎಲ್ಲಾ ಮೂಲಗಳಿಂದ ಕುಟುಂಬದ ಒಟ್ಟು ಆದಾಯ' :
                isTa ? 'அனைத்து ஆதாரங்களிலிருந்தும் குடும்ப வருமானம்' :
                isTe ? 'అన్ని వనరుల నుండి కుటుంబ మొత్తం ఆదాయం' :
                isMr ? 'सर्व स्रोतांमधून कुटुंबाचे एकूण उत्पन्न' :
                isBn ? 'সমস্ত উৎস থেকে পরিবারের মোট আয়' :
                isHi ? 'परिवार के सभी सदस्यों की कुल आय' :
                'Total household income from all sources',
      question: isKn ? 'ಎಲ್ಲಾ ಮೂಲಗಳಿಂದ ನಿಮ್ಮ ಒಟ್ಟು ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ ಎಷ್ಟು?' :
                isTa ? 'உங்கள் மொத்த ஆண்டு குடும்ப வருமானம் எவ்வளவு?' :
                isTe ? 'అన్ని వనరుల నుండి మీ వార్షిక కుటుంబ ఆదాయం ఎంత?' :
                isMr ? 'तुमचे एकूण वार्षिक कौटुंबिक उत्पन्न किती आहे?' :
                isBn ? 'সমস্ত উৎস থেকে আপনার মোট বার্ষিক পারিবারিক আয় কত?' :
                isHi ? 'सभी स्रोतों से आपकी कुल वार्षिक पारिवारिक आय कितनी है?' :
                'What is your total annual household income from all sources?',
      options: [
        { label: 'Under ₹1.5 Lakh (Priority BPL)', value: 150000 },
        { label: '₹2.5 Lakh', value: 250000 },
        { label: '₹3.6 Lakh (Standard)', value: 360000 },
        { label: '₹4.5 Lakh (Eligible)', value: 450000 },
        { label: 'Above ₹5.0 Lakh (General MSME)', value: 550000 }
      ]
    },
    {
      id: 'userType',
      title: isKn ? 'ಉದ್ಯಮಶೀಲತೆಯ ಅನುಭವ' :
             isTa ? 'தொழில்முனைவோர் அனுபவம்' :
             isTe ? 'వ్యాపార అనుభవం' :
             isMr ? 'उद्योजकतेचा अनुभव' :
             isBn ? 'উদ্যোক্তা অভিজ্ঞতা' :
             isHi ? 'उद्यमशीलता अनुभव' :
             'Entrepreneurial Experience',
      subTitle: isKn ? 'ವ್ಯವಹಾರ ಅನುಭವದ ಮಟ್ಟ' :
                isTa ? 'வணிக அனுபவத்தின் நிலை' :
                isTe ? 'వ్యాపార అనుభవ స్థాయి' :
                isMr ? 'व्यवसायिक अनुभवाची पातळी' :
                isBn ? 'ব্যবসায়িক অভিজ্ঞতার স্তর' :
                isHi ? 'व्यावसायिक अनुभव का स्तर' :
                'Stage of business experience',
      question: isKn ? 'ವ್ಯವಹಾರದಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿಯನ್ನು ಯಾವುದು ವಿವರಿಸುತ್ತದೆ?' :
                isTa ? 'வணிகத்தில் உங்கள் தற்போதைய நிலையை எது விவரிக்கிறது?' :
                isTe ? 'వ్యాపారంలో మీ ప్రస్తుత స్థితిని ఏది ఉత్తమంగా వివరిస్తుంది?' :
                isMr ? 'व्यवसायातील तुमच्या सद्यस्थितीचे वर्णन काय आहे?' :
                isBn ? 'ব্যবসায়ে আপনার বর্তমান পর্যায় কোনটি সবচেয়ে ভালো বর্ণনা করে?' :
                isHi ? 'व्यवसाय में आपकी वर्तमान स्थिति का सबसे अच्छा वर्णन क्या है?' :
                'What best describes your current stage in business?',
      options: [
        { label: isKn ? 'ಮೊದಲ ಬಾರಿಯ ಉದ್ಯಮಿ (ಹೊಸ ವ್ಯವಹಾರ)' : isTa ? 'முதல் முறை தொழில்முனைவோர்' : isTe ? 'మొదటిసారి వ్యవస్థాపకుడు' : isMr ? 'पहिल्यांदाच उद्योजक (नवीन व्यवसाय)' : isBn ? 'প্রথমবারের উদ্যোক্তা' : isHi ? 'पहली बार उद्यमी (नया व्यवसाय)' : 'First-time Entrepreneur', value: 'new_entrepreneur', icon: '🌱' },
        { label: isKn ? 'ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಸಣ್ಣ ವ್ಯಾಪಾರ ಮಾಲೀಕರು' : isTa ? 'தற்போதுள்ள சிறு வணிக உரிமையாளர்' : isTe ? 'ఇప్పటికే ఉన్న చిన్న వ్యాపార యజమాని' : isMr ? 'विद्यमान लहान व्यवसाय मालक' : isBn ? 'বিদ্যমান ক্ষুদ্র ব্যবসায়ী' : isHi ? 'मौजूदा लघु व्यवसाय स्वामी' : 'Existing Small Business Owner', value: 'existing_entrepreneur', icon: '💼' },
        { label: isKn ? 'ವಿದ್ಯಾರ್ಥಿ / ವೃತ್ತಿಪರ ತರಬೇತಿದಾರ' : isTa ? 'மாணவர் / தொழிற்பயிற்சி பெறுபவர்' : isTe ? 'విద్యార్థి / వృత్తి శిక్షణార్థి' : isMr ? 'विद्यार्थी / व्यावसायिक प्रशिक्षणार्थी' : isBn ? 'শিক্ষার্থী / বৃত্তিমূলক প্রশিক্ষণার্থী' : isHi ? 'छात्र / व्यावसायिक प्रशिक्षु' : 'Student / Vocational Trainee', value: 'student', icon: '📚' }
      ]
    },
    {
      id: 'hasCasteCertificate',
      title: isKn ? 'ಸಮುದಾಯ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ' :
             isTa ? 'சமூக சாதி சான்றிதழ்' :
             isTe ? 'కుల ధృవీకరణ పత్రం' :
             isMr ? 'जातीचे प्रमाणपत्र' :
             isBn ? 'জাতিগত শংসাপত্র' :
             isHi ? 'सामुदायिक जाति प्रमाण पत्र' :
             'Community Caste Certificate',
      subTitle: isKn ? 'ಕಂದಾಯ ಇಲಾಖೆ ಪ್ರಮಾಣಪತ್ರ' :
                isTa ? 'வருவாய்த்துறை சான்றிதழ்' :
                isTe ? 'రెవెన్యూ శాఖ సర్టిఫికేట్' :
                isMr ? 'महसूल विभाग प्रमाणपत्र' :
                isBn ? 'রাজস্ব বিভাগীয় শংসাপত্র' :
                isHi ? 'राजस्व विभाग प्रमाण पत्र' :
                'Revenue authority certificate status',
      question: isKn ? 'ನಿಮ್ಮ ಬಳಿ ತಹಶೀಲ್ದಾರ್ ನೀಡಿದ ಮಾನ್ಯ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ (RD ಸಂಖ್ಯೆ) ಇದೆಯೇ?' :
                isTa ? 'வட்டாட்சியர் வழங்கிய செல்லுபடியாகும் சாதி சான்றிதழ் (RD எண்) உள்ளதா?' :
                isTe ? 'మీ వద్ద తహశీల్దార్ జారీ చేసిన కుల ధృవీకరణ పత్రం (RD నంబర్) ఉందా?' :
                isMr ? 'तुमच्याकडे तहसीलदारांनी जारी केलेले वैध जात प्रमाणपत्र (RD क्रमांक) आहे का?' :
                isBn ? 'আপনার কাছে কি তহশিলদার কর্তৃক জারি করা বৈধ জাতিগত শংসাপত্র (RD নম্বর) আছে?' :
                isHi ? 'क्या आपके पास तहसीलदार द्वारा जारी वैध जाति प्रमाण पत्र (आरडी नंबर) है?' :
                'Do you possess a valid Caste Certificate issued by the Tahsildar (RD Number)?',
      options: [
        { label: isKn ? 'ಹೌದು, ಮಾನ್ಯ RD ಸಂಖ್ಯೆ ಪ್ರಮಾಣಪತ್ರ ಲಭ್ಯವಿದೆ' : isTa ? 'ஆம், செல்லுபடியாகும் RD எண் உள்ளது' : isTe ? 'అవును, చెల్లుబాటు అయ్యే RD సర్టిఫికేట్ ఉంది' : isMr ? 'होय, वैध RD क्रमांक प्रमाणपत्र उपलब्ध आहे' : isBn ? 'হ্যাঁ, বৈধ RD নম্বর শংসাপত্র আছে' : isHi ? 'हाँ, वैध आरडी नंबर प्रमाण पत्र उपलब्ध है' : 'Yes, Have Valid RD Number Certificate', value: true, icon: '✅' },
        { label: isKn ? 'ಇಲ್ಲ / ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ' : isTa ? 'இல்லை / செயல்பாட்டில் உள்ளது' : isTe ? 'లేదు / పురోగతిలో ఉంది' : isMr ? 'नाही / प्रक्रियेत आहे' : isBn ? 'না / প্রক্রিয়াধীন' : isHi ? 'नहीं / प्रक्रियाधीन (अनुपलब्ध)' : 'No / In-Progress (Missing)', value: false, icon: '⚠️' }
      ]
    },
    {
      id: 'hasIncomeCertificate',
      title: isKn ? 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಸ್ಥಿತಿ' :
             isTa ? 'வருமான சான்றிதழ் நிலை' :
             isTe ? 'ఆదాయ ధృవీకరణ పత్రం' :
             isMr ? 'उत्पन्न प्रमाणपत्र स्थिती' :
             isBn ? 'আয় শংসাপত্র স্থিতি' :
             isHi ? 'आय प्रमाण पत्र स्थिति' :
             'Income Certificate Status',
      subTitle: isKn ? 'ಸಕ್ಷಮ ಪ್ರಾಧಿಕಾರದಿಂದ ದೃಢೀಕರಿಸಲಾಗಿದೆ' :
                isTa ? 'அதிகாரப்பூர்வமாக சான்றளிக்கப்பட்டது' :
                isTe ? 'సమర్థ అధికారి ద్వారా ధృవీకరించబడింది' :
                isMr ? 'सक्षम प्राधिकाऱ्याने प्रमाणित केलेले' :
                isBn ? 'সক্ষম কর্তৃপক্ষ দ্বারা প্রত্যয়িত' :
                isHi ? 'सक्षम प्राधिकारी द्वारा सत्यापित' :
                'Authority-attested verification',
      question: isKn ? 'ನಿಮ್ಮ ಬಳಿ ಪ್ರಸ್ತುತ ಮಾನ್ಯ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಇದೆಯೇ?' :
                isTa ? 'உங்களிடம் தற்போதைய வருமான சான்றிதழ் உள்ளதா?' :
                isTe ? 'మీ వద్ద ప్రస్తుత ఆదాయ ధృవీకరణ పత్రం ఉందా?' :
                isMr ? 'तुमच्याकडे सध्याचे उत्पन्न प्रमाणपत्र आहे का?' :
                isBn ? 'আপনার কাছে কি বর্তমান বৈধ আয় শংসাপত্র আছে?' :
                isHi ? 'क्या आपके पास तहसीलदार द्वारा सत्यापित वर्तमान आय प्रमाण पत्र है?' :
                'Do you have a current Tahsildar-attested Income Certificate?',
      options: [
        { label: isKn ? 'ಹೌದು, ಇತ್ತೀಚಿನ ಪ್ರಮಾಣಪತ್ರ ಲಭ್ಯವಿದೆ' : isTa ? 'ஆம், சான்றிதழ் உள்ளது' : isTe ? 'అవును, సర్టిఫికేట్ ఉంది' : isMr ? 'होय, अलीकडील प्रमाणपत्र उपलब्ध आहे' : isBn ? 'হ্যাঁ, সাম্প্রতিক শংসাপত্র আছে' : isHi ? 'हाँ, हालिया आय प्रमाण पत्र उपलब्ध है' : 'Yes, Have Recent Income Certificate', value: true, icon: '✅' },
        { label: isKn ? 'ಇಲ್ಲ / ಅವಧಿ ಮುಗಿದಿದೆ' : isTa ? 'இல்லை / காலாவதியானது' : isTe ? 'లేదు / గడువు ముగిసింది' : isMr ? 'नाही / मुदत संपली' : isBn ? 'না / মেয়াদোত্তীর্ণ' : isHi ? 'नहीं / समाप्त हो गया' : 'No / Expired', value: false, icon: '⚠️' }
      ]
    },
    {
      id: 'requiredLoanAmount',
      title: isKn ? 'ಅಗತ್ಯವಿರುವ ರಿಯಾಯಿತಿ ಸಾಲ' :
             isTa ? 'தேவையான சலுகைக் கடன்' :
             isTe ? 'అవసరమైన రాయితీ రుణం' :
             isMr ? 'आवश्यक सवलतीचे कर्ज' :
             isBn ? 'প্রয়োজনীয় রেয়াতযোগ্য ঋণ' :
             isHi ? 'रियायती ऋण की आवश्यकता' :
             'Concessional Loan Required',
      subTitle: isKn ? 'ಚಾನಲ್ ಪಾಲುದಾರರಿಂದ ಹಣಕಾಸಿನ ನೆರವು' :
                isTa ? 'சேனல் கூட்டாளர்களிடமிருந்து நிதி உதவி' :
                isTe ? 'ఛానల్ భాగస్వాముల నుండి ఆర్థిక సహాయం' :
                isMr ? 'चॅनेल भागीदारांकडून आर्थिक मदत' :
                isBn ? 'চ্যানেল পার্টনারদের আর্থিক সহায়তা' :
                isHi ? 'चैनल पार्टनर से वित्तीय सहायता' :
                'Subsidized credit from partners',
      question: isKn ? 'ಚಾನಲ್ ಪಾಲುದಾರರಿಂದ ನಿಮಗೆ ಎಷ್ಟು ಸಾಲದ ನೆರವು ಬೇಕು?' :
                isTa ? 'சேனல் கூட்டாளர்களிடமிருந்து எவ்வளவு கடன் உதவி தேவை?' :
                isTe ? 'ఛానల్ భాగస్వాముల నుండి మీకు ఎంత రుణ సహాయం అవసరం?' :
                isMr ? 'चॅनेल भागीदारांकडून तुम्हाला किती कर्ज मदतीची आवश्यकता आहे?' :
                isBn ? 'চ্যানেল পার্টনারদের থেকে আপনার কত ঋণ সহায়তা প্রয়োজন?' :
                isHi ? 'चैनल भागीदारों से आपको कितनी रियायती ऋण सहायता की आवश्यकता है?' :
                'How much subsidized credit assistance do you need from Channel Partners?',
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
      title: isKn ? 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಚಾನಲ್ ಆದ್ಯತೆ' :
             isTa ? 'விண்ணப்ப சேனல் முன்னுரிமை' :
             isTe ? 'దరఖాస్తు ఛానల్ ప్రాధాన్యత' :
             isMr ? 'अर्ज चॅनेल प्राधान्य' :
             isBn ? 'আবেদন চ্যানেল অগ্রাধিকার' :
             isHi ? 'आवेदन चैनल प्राथमिकता' :
             'Application Channel Preference',
      subTitle: isKn ? 'ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ' :
                isTa ? 'விண்ணப்ப சமர்ப்பிக்கும் முறை' :
                isTe ? 'దరఖాస్తు సమర్పించే విధానం' :
                isMr ? 'अर्ज सादर करण्याचे माध्यम' :
                isBn ? 'আবেদন জমা দেওয়ার মাধ্যম' :
                isHi ? 'आवेदन जमा करने का माध्यम' :
                'Submission & assistance channel',
      question: isKn ? 'ನಿಮ್ಮ ಸಾಲದ ಅರ್ಜಿಯನ್ನು ಹೇಗೆ ಸಲ್ಲಿಸಲು ಬಯಸುತ್ತೀರಿ?' :
                isTa ? 'உங்கள் கடன் விண்ணப்பத்தை எவ்வாறு சமர்ப்பிக்க விரும்புகிறீர்கள்?' :
                isTe ? 'మీ రుణ దరఖాస్తును ఎలా సమర్పించాలనుకుంటున్నారు?' :
                isMr ? 'तुम्ही तुमचा कर्ज अर्ज कसा सादर करू इच्छिता?' :
                isBn ? 'আপনি আপনার ঋণ আবেদন কীভাবে জমা দিতে পছন্দ করবেন?' :
                isHi ? 'आप अपना ऋण आवेदन कैसे जमा और अनुवर्ती कार्रवाई करना पसंद करेंगे?' :
                'How would you prefer to submit and follow up on your loan application?',
      options: [
        { label: isKn ? 'ಆಫ್‌ಲೈನ್ SCA / ನಿಗಮ ಕಚೇರಿ ಬೆಂಬಲ' : isTa ? 'நேரடி SCA / கார்ப்பரேஷன் அலுவலக உதவி' : isTe ? 'ఆఫ్‌లైన్ SCA / కార్పొరేషన్ కార్యాలయ మద్దతు' : isMr ? 'ऑफलाइन एससीए / महामंडळ कार्यालय मदत' : isBn ? 'অফলাইন এসসিএ / কর্পোরেশন অফিস সহায়তা' : isHi ? 'ऑफलाइन एससीए / निगम कार्यालय सहायता' : 'Offline SCA / Corporation Office Support', value: 'offline', icon: '🏛️' },
        { label: isKn ? 'ಆನ್‌ಲೈನ್ / ಬ್ಯಾಂಕ್ ಡಿಜಿಟಲ್ ಪ್ರಕ್ರಿಯೆ' : isTa ? 'ஆன்லைன் / வங்கி டிஜிட்டல் செயலாக்கம்' : isTe ? 'ఆన్‌లైన్ / బ్యాంక్ డిజిటల్ ప్రాసెసింగ్' : isMr ? 'ऑनलाइन / बँक डिजिटल प्रक्रिया' : isBn ? 'অনলাইন / ব্যাংক ডিজিটাল প্রসেসিং' : isHi ? 'ऑनलाइन / बैंक डिजिटल प्रोसेसिंग' : 'Online / Bank Digital Processing', value: 'online', icon: '💻' },
        { label: isKn ? 'ಎರಡೂ / ಹೈಬ್ರಿಡ್ ಚಾನಲ್' : isTa ? 'இரண்டும் / கலப்பின சேனல்' : isTe ? 'రెండు / హైబ్రిడ్ ఛానల్' : isMr ? 'दोन्ही / हायब्रिड चॅनेल' : isBn ? 'উভয় / হাইব্রিড চ্যানেল' : isHi ? 'दोनों / हाइब्रिड चैनल रूटिंग' : 'Either / Hybrid Channel Routing', value: 'any', icon: '🤝' }
      ]
    }
  ];
}


export const phrases = {
  "Generate your application pack before requesting the PM-SURAJ handoff.": {
    "en": "Generate your application pack before requesting the PM-SURAJ handoff.",
    "hi": "हैंडऑफ से पहले आवेदन पैक तैयार करें।",
    "kn": "Generate your application pack before requesting the PM-SURAJ handoff.",
    "ta": "Generate your application pack before requesting the PM-SURAJ handoff.",
    "te": "Generate your application pack before requesting the PM-SURAJ handoff.",
    "mr": "हैंडऑफ से पहले आवेदन पैक तैयार करें।",
    "bn": "Generate your application pack before requesting the PM-SURAJ handoff."
  },
  "That application pack is not available for handoff from this account.": {
    "en": "That application pack is not available for handoff from this account.",
    "hi": "यह आवेदन पैक इस खाते से हैंडऑफ के लिए उपलब्ध नहीं है।",
    "kn": "That application pack is not available for handoff from this account.",
    "ta": "That application pack is not available for handoff from this account.",
    "te": "That application pack is not available for handoff from this account.",
    "mr": "यह आवेदन पैक इस खाते से हैंडऑफ के लिए उपलब्ध नहीं है।",
    "bn": "That application pack is not available for handoff from this account."
  },
  "The PM-SURAJ handoff did not complete. Your dossier is unchanged.": {
    "en": "The PM-SURAJ handoff did not complete. Your dossier is unchanged.",
    "hi": "PM-SURAJ हैंडऑफ पूरा नहीं हुआ।",
    "kn": "The PM-SURAJ handoff did not complete. Your dossier is unchanged.",
    "ta": "The PM-SURAJ handoff did not complete. Your dossier is unchanged.",
    "te": "The PM-SURAJ handoff did not complete. Your dossier is unchanged.",
    "mr": "PM-SURAJ हैंडऑफ पूरा नहीं हुआ।",
    "bn": "The PM-SURAJ handoff did not complete. Your dossier is unchanged."
  },
  "No dossier is shown, because none was generated — nothing has been sent to any agency.": {
    "en": "No dossier is shown, because none was generated — nothing has been sent to any agency.",
    "hi": "कोई डोजियर प्रदर्शित नहीं है।",
    "kn": "No dossier is shown, because none was generated — nothing has been sent to any agency.",
    "ta": "No dossier is shown, because none was generated — nothing has been sent to any agency.",
    "te": "No dossier is shown, because none was generated — nothing has been sent to any agency.",
    "mr": "कोई डोजियर प्रदर्शित नहीं है।",
    "bn": "No dossier is shown, because none was generated — nothing has been sent to any agency."
  },
  "Assembling your comprehensive Application Pack...": {
    "en": "Assembling your comprehensive Application Pack...",
    "hi": "आपका संपूर्ण आवेदन पैक तैयार किया जा रहा है...",
    "kn": "Assembling your comprehensive Application Pack...",
    "ta": "Assembling your comprehensive Application Pack...",
    "te": "Assembling your comprehensive Application Pack...",
    "mr": "आपका संपूर्ण आवेदन पैक तैयार किया जा रहा है...",
    "bn": "Assembling your comprehensive Application Pack..."
  },
  "Feature 8: Application Pack & Handoff": {
    "en": "Feature 8: Application Pack & Handoff",
    "hi": "सुविधा 8: आवेदन पैक एवं डिजिटल प्रेषण",
    "kn": "ವೈಶಿಷ್ಟ್ಯ 8: ಅರ್ಜಿ ಪ್ಯಾಕ್ ಮತ್ತು ಹಸ್ತಾಂತರ",
    "ta": "அம்சம் 8: விண்ணப்ப பேக் & ஒப்படைப்பு",
    "te": "ఫీచర్ 8: దరఖాస్తు ప్యాక్ & బదిలీ",
    "mr": "वैशिष्ट्य 8: अर्ज पॅक आणि हस्तांतरण",
    "bn": "বৈশিষ্ট্য ৮: আবেদন প্যাক ও হস্তান্তর"
  },
  "NATIONAL SCHEDULED CASTES FINANCE AND DEVELOPMENT CORPORATION (NSFDC)": {
    "en": "NATIONAL SCHEDULED CASTES FINANCE AND DEVELOPMENT CORPORATION (NSFDC)",
    "hi": "राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC)",
    "kn": "NATIONAL SCHEDULED CASTES FINANCE AND DEVELOPMENT CORPORATION (NSFDC)",
    "ta": "NATIONAL SCHEDULED CASTES FINANCE AND DEVELOPMENT CORPORATION (NSFDC)",
    "te": "NATIONAL SCHEDULED CASTES FINANCE AND DEVELOPMENT CORPORATION (NSFDC)",
    "mr": "राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC)",
    "bn": "NATIONAL SCHEDULED CASTES FINANCE AND DEVELOPMENT CORPORATION (NSFDC)"
  },
  "ENTREPRENEUR APPLICATION DOSSIER": {
    "en": "ENTREPRENEUR APPLICATION DOSSIER",
    "hi": "उद्यमी आवेदन डोजियर",
    "kn": "ಉದ್ಯಮಿ ಅರ್ಜಿ ಡೋಸಿಯರ್",
    "ta": "தொழில்முனைவோர் விண்ணப்ப ஆவணம்",
    "te": "వ్యవస్థాపక దరఖాస్తు డోసియర్",
    "mr": "उद्योजक अर्ज डोसियर",
    "bn": "উদ্যোক্তা আবেদন ডসিয়ার"
  },
  "Generated via SchemeReady (Udyam Saarthi AI) Platform | Channel Partner Handoff Document": {
    "en": "Generated via SchemeReady (Udyam Saarthi AI) Platform | Channel Partner Handoff Document",
    "hi": "स्कीम रेडी (उद्यम सारथी AI) प्लेटफॉर्म द्वारा जनरेटेड | चैनल पार्टनर हैंडऑफ दस्तावेज",
    "kn": "Generated via SchemeReady (Udyam Saarthi AI) Platform | Channel Partner Handoff Document",
    "ta": "Generated via SchemeReady (Udyam Saarthi AI) Platform | Channel Partner Handoff Document",
    "te": "Generated via SchemeReady (Udyam Saarthi AI) Platform | Channel Partner Handoff Document",
    "mr": "स्कीम रेडी (उद्यम सारथी AI) प्लेटफॉर्म द्वारा जनरेटेड | चैनल पार्टनर हैंडऑफ दस्तावेज",
    "bn": "Generated via SchemeReady (Udyam Saarthi AI) Platform | Channel Partner Handoff Document"
  },
  "Dossier Tracking ID": {
    "en": "Dossier Tracking ID",
    "hi": "डोजियर ट्रैकिंग आईडी",
    "kn": "ಡೋಸಿಯರ್ ಟ್ರ್ಯಾಕಿಂಗ್ ID",
    "ta": "ஆவண கண்காணிப்பு ஐடி",
    "te": "డోసియర్ ట్రాకింగ్ ID",
    "mr": "डोसियर ट्रॅकिंग आयडी",
    "bn": "ডসিয়ার ট্র্যাকিং আইডি"
  },
  "Date:": {
    "en": "Date:",
    "hi": "दिनांक:",
    "kn": "ದಿನಾಂಕ:",
    "ta": "தேதி:",
    "te": "తేదీ:",
    "mr": "दिनांक:",
    "bn": "তারিখ:"
  },
  "en-IN": {
    "en": "en-IN",
    "hi": "hi-IN",
    "kn": "en-IN",
    "ta": "en-IN",
    "te": "en-IN",
    "mr": "hi-IN",
    "bn": "en-IN"
  },
  "1. Beneficiary Profile": {
    "en": "1. Beneficiary Profile",
    "hi": "1. लाभार्थी प्रोफाइल",
    "kn": "1. ಫಲಾನುಭವಿ ಪ್ರೊಫೈಲ್",
    "ta": "1. பயனாளி சுயவிவரம்",
    "te": "1. లబ్ధిదారుల ప్రొఫైల్",
    "mr": "1. लाभार्थी प्रोफाइल",
    "bn": "১. সুবিধাভোগী প্রোফাইল"
  },
  "Full Name": {
    "en": "Full Name",
    "hi": "पूरा नाम",
    "kn": "ಪೂರ್ಣ ಹೆಸರು",
    "ta": "முழு பெயர்",
    "te": "పూర్తి పేరు",
    "mr": "पूर्ण नाव",
    "bn": "পুরো নাম"
  },
  "Target Category": {
    "en": "Target Category",
    "hi": "लक्षित श्रेणी",
    "kn": "ಗುರಿ ವರ್ಗ",
    "ta": "இலக்கு பிரிவு",
    "te": "లక్ష్య వర్గం",
    "mr": "लक्ष्यित प्रवर्ग",
    "bn": "টার্গেট বিভাগ"
  },
  "Scheduled Caste": {
    "en": "Scheduled Caste",
    "hi": "अनुसूचित जाति",
    "kn": "ಪರಿಶಿಷ್ಟ ಜಾತಿ",
    "ta": "பட்டியலிடப்பட்ட சாதி",
    "te": "షెడ్యూల్డ్ కులం",
    "mr": "अनुसूचित जाती",
    "bn": "তফসিলি জাতি"
  },
  "Location / District": {
    "en": "Location / District",
    "hi": "स्थान / जिला",
    "kn": "ಸ್ಥಳ / ಜಿಲ್ಲೆ",
    "ta": "இடம் / மாவட்டம்",
    "te": "ప్రదేశం / జిల్లా",
    "mr": "स्थान / जिल्हा",
    "bn": "অবস্থান / জেলা"
  },
  "Annual Family Income": {
    "en": "Annual Family Income",
    "hi": "वार्षिक पारिवारिक आय",
    "kn": "ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ",
    "ta": "ஆண்டு குடும்ப வருமானம்",
    "te": "వార్షిక కుటుంబ ఆదాయం",
    "mr": "वार्षिक कौटुंबिक उत्पन्न",
    "bn": "বার্ষিক পারিবারিক আয়"
  },
  "2. Recommended Scheme & Statutory Eligibility Verification": {
    "en": "2. Recommended Scheme & Statutory Eligibility Verification",
    "hi": "2. अनुशंसित योजना एवं वैधानिक पात्रता सत्यापन",
    "kn": "2. Recommended Scheme & Statutory Eligibility Verification",
    "ta": "2. Recommended Scheme & Statutory Eligibility Verification",
    "te": "2. Recommended Scheme & Statutory Eligibility Verification",
    "mr": "2. अनुशंसित योजना एवं वैधानिक पात्रता सत्यापन",
    "bn": "2. Recommended Scheme & Statutory Eligibility Verification"
  },
  "Interest:": {
    "en": "Interest:",
    "hi": "ब्याज:",
    "kn": "Interest:",
    "ta": "Interest:",
    "te": "Interest:",
    "mr": "ब्याज:",
    "bn": "Interest:"
  },
  "p.a.": {
    "en": "p.a.",
    "hi": "वार्षिक",
    "kn": "p.a.",
    "ta": "p.a.",
    "te": "p.a.",
    "mr": "वार्षिक",
    "bn": "p.a."
  },
  "Tenure:": {
    "en": "Tenure:",
    "hi": "अवधि:",
    "kn": "Tenure:",
    "ta": "Tenure:",
    "te": "Tenure:",
    "mr": "अवधि:",
    "bn": "Tenure:"
  },
  "mo": {
    "en": "mo",
    "hi": "माह",
    "kn": "mo",
    "ta": "mo",
    "te": "mo",
    "mr": "माह",
    "bn": "mo"
  },
  "3. Project Report & Financial Feasibility": {
    "en": "3. Project Report & Financial Feasibility",
    "hi": "3. प्रोजेक्ट रिपोर्ट एवं वित्तीय व्यवहार्यता",
    "kn": "3. Project Report & Financial Feasibility",
    "ta": "3. Project Report & Financial Feasibility",
    "te": "3. Project Report & Financial Feasibility",
    "mr": "3. प्रोजेक्ट रिपोर्ट एवं वित्तीय व्यवहार्यता",
    "bn": "3. Project Report & Financial Feasibility"
  },
  "Total Project Cost": {
    "en": "Total Project Cost",
    "hi": "कुल परियोजना लागत",
    "kn": "Total Project Cost",
    "ta": "Total Project Cost",
    "te": "Total Project Cost",
    "mr": "कुल परियोजना लागत",
    "bn": "Total Project Cost"
  },
  "Promoter Margin (5%)": {
    "en": "Promoter Margin (5%)",
    "hi": "प्रवर्तक मार्जिन (5%)",
    "kn": "Promoter Margin (5%)",
    "ta": "Promoter Margin (5%)",
    "te": "Promoter Margin (5%)",
    "mr": "प्रवर्तक मार्जिन (5%)",
    "bn": "Promoter Margin (5%)"
  },
  "Term Loan Required": {
    "en": "Term Loan Required",
    "hi": "आवश्यक सावधि ऋण",
    "kn": "Term Loan Required",
    "ta": "Term Loan Required",
    "te": "Term Loan Required",
    "mr": "आवश्यक सावधि ऋण",
    "bn": "Term Loan Required"
  },
  "DSCR Debt Coverage": {
    "en": "DSCR Debt Coverage",
    "hi": "डीएससीआर ऋण कवरेज",
    "kn": "DSCR Debt Coverage",
    "ta": "DSCR Debt Coverage",
    "te": "DSCR Debt Coverage",
    "mr": "डीएससीआर ऋण कवरेज",
    "bn": "DSCR Debt Coverage"
  },
  "Viable": {
    "en": "Viable",
    "hi": "व्यवहार्य",
    "kn": "Viable",
    "ta": "Viable",
    "te": "Viable",
    "mr": "व्यवहार्य",
    "bn": "Viable"
  },
  "4. Designated Channel Partner Submission Office": {
    "en": "4. Designated Channel Partner Submission Office",
    "hi": "4. नामित चैनल पार्टनर सबमिशन कार्यालय",
    "kn": "4. Designated Channel Partner Submission Office",
    "ta": "4. Designated Channel Partner Submission Office",
    "te": "4. Designated Channel Partner Submission Office",
    "mr": "4. नामित चैनल पार्टनर सबमिशन कार्यालय",
    "bn": "4. Designated Channel Partner Submission Office"
  },
  "km away": {
    "en": "km away",
    "hi": "किमी दूर",
    "kn": "km away",
    "ta": "km away",
    "te": "km away",
    "mr": "किमी दूर",
    "bn": "km away"
  },
  "Contact:": {
    "en": "Contact:",
    "hi": "संपर्क:",
    "kn": "Contact:",
    "ta": "Contact:",
    "te": "Contact:",
    "mr": "संपर्क:",
    "bn": "Contact:"
  },
  "Submission Mode:": {
    "en": "Submission Mode:",
    "hi": "सबमिशन माध्यम:",
    "kn": "Submission Mode:",
    "ta": "Submission Mode:",
    "te": "Submission Mode:",
    "mr": "सबमिशन माध्यम:",
    "bn": "Submission Mode:"
  },
  "Record Verified: 10 September 2026": {
    "en": "Record Verified: 10 September 2026",
    "hi": "रिकॉर्ड सत्यापित: 10 सितंबर 2026",
    "kn": "Record Verified: 10 September 2026",
    "ta": "Record Verified: 10 September 2026",
    "te": "Record Verified: 10 September 2026",
    "mr": "रिकॉर्ड सत्यापित: 10 सितंबर 2026",
    "bn": "Record Verified: 10 September 2026"
  },
  "Official Government Disclaimer:": {
    "en": "Official Government Disclaimer:",
    "hi": "आधिकारिक सरकारी अस्वीकरण:",
    "kn": "Official Government Disclaimer:",
    "ta": "Official Government Disclaimer:",
    "te": "Official Government Disclaimer:",
    "mr": "आधिकारिक सरकारी अस्वीकरण:",
    "bn": "Official Government Disclaimer:"
  },
  "Confirm the financial terms before you submit": {
    "en": "Confirm the financial terms before you submit",
    "hi": "जमा करने से पहले वित्तीय शर्तों की पुष्टि करें",
    "kn": "Confirm the financial terms before you submit",
    "ta": "Confirm the financial terms before you submit",
    "te": "Confirm the financial terms before you submit",
    "mr": "जमा करने से पहले वित्तीय शर्तों की पुष्टि करें",
    "bn": "Confirm the financial terms before you submit"
  },
  "The scheme financial terms shown in this pack — interest rate, tenure, moratorium, loan ceiling, the cited source document and the last-verified date — are illustrative sample values pending verification against current official NSFDC guidelines. Confirm every one of them with the channel partner named above before submitting this application.": {
    "en": "The scheme financial terms shown in this pack — interest rate, tenure, moratorium, loan ceiling, the cited source document and the last-verified date — are illustrative sample values pending verification against current official NSFDC guidelines. Confirm every one of them with the channel partner named above before submitting this application.",
    "hi": "इस पैक में दिखाई गई योजना की वित्तीय शर्तें — ब्याज दर, कार्यकाल, मोरेटोरियम, ऋण सीमा — आधिकारिक एनएसएफडीसी दिशानिर्देशों के तहत सत्यापन के अधीन सांकेतिक मूल्य हैं।",
    "kn": "The scheme financial terms shown in this pack — interest rate, tenure, moratorium, loan ceiling, the cited source document and the last-verified date — are illustrative sample values pending verification against current official NSFDC guidelines. Confirm every one of them with the channel partner named above before submitting this application.",
    "ta": "The scheme financial terms shown in this pack — interest rate, tenure, moratorium, loan ceiling, the cited source document and the last-verified date — are illustrative sample values pending verification against current official NSFDC guidelines. Confirm every one of them with the channel partner named above before submitting this application.",
    "te": "The scheme financial terms shown in this pack — interest rate, tenure, moratorium, loan ceiling, the cited source document and the last-verified date — are illustrative sample values pending verification against current official NSFDC guidelines. Confirm every one of them with the channel partner named above before submitting this application.",
    "mr": "इस पैक में दिखाई गई योजना की वित्तीय शर्तें — ब्याज दर, कार्यकाल, मोरेटोरियम, ऋण सीमा — आधिकारिक एनएसएफडीसी दिशानिर्देशों के तहत सत्यापन के अधीन सांकेतिक मूल्य हैं।",
    "bn": "The scheme financial terms shown in this pack — interest rate, tenure, moratorium, loan ceiling, the cited source document and the last-verified date — are illustrative sample values pending verification against current official NSFDC guidelines. Confirm every one of them with the channel partner named above before submitting this application."
  },
  "Powered by SchemeReady GovTech Framework": {
    "en": "Powered by SchemeReady GovTech Framework",
    "hi": "स्कीम रेडी गॉवटेक फ्रेमवर्क द्वारा संचालित",
    "kn": "Powered by SchemeReady GovTech Framework",
    "ta": "Powered by SchemeReady GovTech Framework",
    "te": "Powered by SchemeReady GovTech Framework",
    "mr": "स्कीम रेडी गॉवटेक फ्रेमवर्क द्वारा संचालित",
    "bn": "Powered by SchemeReady GovTech Framework"
  },
  "PM-SURAJ Portal Handoff Gateway": {
    "en": "PM-SURAJ Portal Handoff Gateway",
    "hi": "PM-SURAJ पोर्टल हैंडऑफ गेटवे",
    "kn": "PM-SURAJ Portal Handoff Gateway",
    "ta": "PM-SURAJ Portal Handoff Gateway",
    "te": "PM-SURAJ Portal Handoff Gateway",
    "mr": "PM-SURAJ पोर्टल हैंडऑफ गेटवे",
    "bn": "PM-SURAJ Portal Handoff Gateway"
  },
  "Application Transmitted!": {
    "en": "Application Transmitted!",
    "hi": "आवेदन सफलतापूर्वक प्रेषित!",
    "kn": "Application Transmitted!",
    "ta": "Application Transmitted!",
    "te": "Application Transmitted!",
    "mr": "आवेदन सफलतापूर्वक प्रेषित!",
    "bn": "Application Transmitted!"
  },
  "Portal:": {
    "en": "Portal:",
    "hi": "पोर्टल:",
    "kn": "Portal:",
    "ta": "Portal:",
    "te": "Portal:",
    "mr": "पोर्टल:",
    "bn": "Portal:"
  },
  "Tracking Ref:": {
    "en": "Tracking Ref:",
    "hi": "ट्रैकिंग संदर्भ:",
    "kn": "Tracking Ref:",
    "ta": "Tracking Ref:",
    "te": "Tracking Ref:",
    "mr": "ट्रैकिंग संदर्भ:",
    "bn": "Tracking Ref:"
  },
  "Forwarded to:": {
    "en": "Forwarded to:",
    "hi": "अग्रेषित संस्था:",
    "kn": "Forwarded to:",
    "ta": "Forwarded to:",
    "te": "Forwarded to:",
    "mr": "अग्रेषित संस्था:",
    "bn": "Forwarded to:"
  },
  "Status:": {
    "en": "Status:",
    "hi": "स्थिति:",
    "kn": "Status:",
    "ta": "Status:",
    "te": "Status:",
    "mr": "स्थिति:",
    "bn": "Status:"
  },
  "Close & Return to Dashboard": {
    "en": "Close & Return to Dashboard",
    "hi": "डैशबोर्ड पर वापस जाएं",
    "kn": "Close & Return to Dashboard",
    "ta": "Close & Return to Dashboard",
    "te": "Close & Return to Dashboard",
    "mr": "डैशबोर्ड पर वापस जाएं",
    "bn": "Close & Return to Dashboard"
  },
  "Summary of Package:": {
    "en": "Summary of Package:",
    "hi": "आवेदन पैकेज का सारांश:",
    "kn": "Summary of Package:",
    "ta": "Summary of Package:",
    "te": "Summary of Package:",
    "mr": "आवेदन पैकेज का सारांश:",
    "bn": "Summary of Package:"
  },
  "Applicant:": {
    "en": "Applicant:",
    "hi": "आवेदक:",
    "kn": "Applicant:",
    "ta": "Applicant:",
    "te": "Applicant:",
    "mr": "आवेदक:",
    "bn": "Applicant:"
  },
  "Required Loan:": {
    "en": "Required Loan:",
    "hi": "आवश्यक ऋण:",
    "kn": "Required Loan:",
    "ta": "Required Loan:",
    "te": "Required Loan:",
    "mr": "आवश्यक ऋण:",
    "bn": "Required Loan:"
  },
  "Readiness:": {
    "en": "Readiness:",
    "hi": "तत्परता स्थिति:",
    "kn": "Readiness:",
    "ta": "Readiness:",
    "te": "Readiness:",
    "mr": "तत्परता स्थिति:",
    "bn": "Readiness:"
  },
  "Verified Complete": {
    "en": "Verified Complete",
    "hi": "सत्यापित पूर्ण",
    "kn": "Verified Complete",
    "ta": "Verified Complete",
    "te": "Verified Complete",
    "mr": "सत्यापित पूर्ण",
    "bn": "Verified Complete"
  },
  "Designated SCA:": {
    "en": "Designated SCA:",
    "hi": "नामित एससीए:",
    "kn": "Designated SCA:",
    "ta": "Designated SCA:",
    "te": "Designated SCA:",
    "mr": "नामित एससीए:",
    "bn": "Designated SCA:"
  },
  "Cancel": {
    "en": "Cancel",
    "hi": "रद्द करें",
    "kn": "Cancel",
    "ta": "Cancel",
    "te": "Cancel",
    "mr": "रद्द करें",
    "bn": "Cancel"
  },
  "Transmitting...": {
    "en": "Transmitting...",
    "hi": "प्रेषित हो रहा है...",
    "kn": "Transmitting...",
    "ta": "Transmitting...",
    "te": "Transmitting...",
    "mr": "प्रेषित हो रहा है...",
    "bn": "Transmitting..."
  },
  "Confirm Demo Handoff": {
    "en": "Confirm Demo Handoff",
    "hi": "हैंडऑफ की पुष्टि करें",
    "kn": "Confirm Demo Handoff",
    "ta": "Confirm Demo Handoff",
    "te": "Confirm Demo Handoff",
    "mr": "हैंडऑफ की पुष्टि करें",
    "bn": "Confirm Demo Handoff"
  },
  "Feature 4: AI Business-Plan Builder": {
    "en": "Feature 4: AI Business-Plan Builder",
    "hi": "सुविधा 4: AI बिजनेस-प्लान एवं प्रोजेक्ट रिपोर्ट बिल्डर",
    "kn": "Feature 4: AI Business-Plan Builder",
    "ta": "Feature 4: AI Business-Plan Builder",
    "te": "Feature 4: AI Business-Plan Builder",
    "mr": "सुविधा 4: AI बिजनेस-प्लान एवं प्रोजेक्ट रिपोर्ट बिल्डर",
    "bn": "Feature 4: AI Business-Plan Builder"
  },
  "Print Report": {
    "en": "Print Report",
    "hi": "रिपोर्ट प्रिंट करें",
    "kn": "Print Report",
    "ta": "Print Report",
    "te": "Print Report",
    "mr": "रिपोर्ट प्रिंट करें",
    "bn": "Print Report"
  },
  "Project Inputs & Parameters": {
    "en": "Project Inputs & Parameters",
    "hi": "परियोजना इनपुट एवं वित्तीय पैरामीटर",
    "kn": "Project Inputs & Parameters",
    "ta": "Project Inputs & Parameters",
    "te": "Project Inputs & Parameters",
    "mr": "परियोजना इनपुट एवं वित्तीय पैरामीटर",
    "bn": "Project Inputs & Parameters"
  },
  "Deterministic Ratios": {
    "en": "Deterministic Ratios",
    "hi": "निश्चित अनुपात",
    "kn": "Deterministic Ratios",
    "ta": "Deterministic Ratios",
    "te": "Deterministic Ratios",
    "mr": "निश्चित अनुपात",
    "bn": "Deterministic Ratios"
  },
  "Business Type": {
    "en": "Business Type",
    "hi": "व्यवसाय का प्रकार",
    "kn": "Business Type",
    "ta": "Business Type",
    "te": "Business Type",
    "mr": "व्यवसाय का प्रकार",
    "bn": "Business Type"
  },
  "Location": {
    "en": "Location",
    "hi": "स्थान / जिला",
    "kn": "Location",
    "ta": "Location",
    "te": "Location",
    "mr": "स्थान / जिला",
    "bn": "Location"
  },
  "Employees": {
    "en": "Employees",
    "hi": "कर्मचारी संख्या",
    "kn": "Employees",
    "ta": "Employees",
    "te": "Employees",
    "mr": "कर्मचारी संख्या",
    "bn": "Employees"
  },
  "Equipment Required": {
    "en": "Equipment Required",
    "hi": "आवश्यक उपकरण एवं मशीनरी",
    "kn": "Equipment Required",
    "ta": "Equipment Required",
    "te": "Equipment Required",
    "mr": "आवश्यक उपकरण एवं मशीनरी",
    "bn": "Equipment Required"
  },
  "Project Investment (₹)": {
    "en": "Project Investment (₹)",
    "hi": "परियोजना निवेश (₹)",
    "kn": "Project Investment (₹)",
    "ta": "Project Investment (₹)",
    "te": "Project Investment (₹)",
    "mr": "परियोजना निवेश (₹)",
    "bn": "Project Investment (₹)"
  },
  "Monthly Sales (₹)": {
    "en": "Monthly Sales (₹)",
    "hi": "मासिक बिक्री (₹)",
    "kn": "Monthly Sales (₹)",
    "ta": "Monthly Sales (₹)",
    "te": "Monthly Sales (₹)",
    "mr": "मासिक बिक्री (₹)",
    "bn": "Monthly Sales (₹)"
  },
  "Raw Material / Spares (₹)": {
    "en": "Raw Material / Spares (₹)",
    "hi": "कच्चा माल / स्पेयर (₹)",
    "kn": "Raw Material / Spares (₹)",
    "ta": "Raw Material / Spares (₹)",
    "te": "Raw Material / Spares (₹)",
    "mr": "कच्चा माल / स्पेयर (₹)",
    "bn": "Raw Material / Spares (₹)"
  },
  "Shop Rent & Power (₹)": {
    "en": "Shop Rent & Power (₹)",
    "hi": "दुकान किराया एवं बिजली (₹)",
    "kn": "Shop Rent & Power (₹)",
    "ta": "Shop Rent & Power (₹)",
    "te": "Shop Rent & Power (₹)",
    "mr": "दुकान किराया एवं बिजली (₹)",
    "bn": "Shop Rent & Power (₹)"
  },
  "Calculating Viability...": {
    "en": "Calculating Viability...",
    "hi": "व्यवहार्यता की गणना हो रही है...",
    "kn": "Calculating Viability...",
    "ta": "Calculating Viability...",
    "te": "Calculating Viability...",
    "mr": "व्यवहार्यता की गणना हो रही है...",
    "bn": "Calculating Viability..."
  },
  "One-Page Detailed Project Report (DPR)": {
    "en": "One-Page Detailed Project Report (DPR)",
    "hi": "एक-पेज विस्तृत परियोजना रिपोर्ट (डीपीआर)",
    "kn": "One-Page Detailed Project Report (DPR)",
    "ta": "One-Page Detailed Project Report (DPR)",
    "te": "One-Page Detailed Project Report (DPR)",
    "mr": "एक-पेज विस्तृत परियोजना रिपोर्ट (डीपीआर)",
    "bn": "One-Page Detailed Project Report (DPR)"
  },
  "Bank-Ready Format": {
    "en": "Bank-Ready Format",
    "hi": "बैंक-स्वीकृत प्रारूप",
    "kn": "Bank-Ready Format",
    "ta": "Bank-Ready Format",
    "te": "Bank-Ready Format",
    "mr": "बैंक-स्वीकृत प्रारूप",
    "bn": "Bank-Ready Format"
  },
  "Bank Loan Needed": {
    "en": "Bank Loan Needed",
    "hi": "आवश्यक बैंक ऋण",
    "kn": "Bank Loan Needed",
    "ta": "Bank Loan Needed",
    "te": "Bank Loan Needed",
    "mr": "आवश्यक बैंक ऋण",
    "bn": "Bank Loan Needed"
  },
  "95% of Total Cost": {
    "en": "95% of Total Cost",
    "hi": "कुल लागत का 95%",
    "kn": "95% of Total Cost",
    "ta": "95% of Total Cost",
    "te": "95% of Total Cost",
    "mr": "कुल लागत का 95%",
    "bn": "95% of Total Cost"
  },
  "Net Monthly Profit": {
    "en": "Net Monthly Profit",
    "hi": "शुद्ध मासिक लाभ",
    "kn": "Net Monthly Profit",
    "ta": "Net Monthly Profit",
    "te": "Net Monthly Profit",
    "mr": "शुद्ध मासिक लाभ",
    "bn": "Net Monthly Profit"
  },
  "After all expenses": {
    "en": "After all expenses",
    "hi": "सभी खर्चों के बाद",
    "kn": "After all expenses",
    "ta": "After all expenses",
    "te": "After all expenses",
    "mr": "सभी खर्चों के बाद",
    "bn": "After all expenses"
  },
  "DSCR Coverage": {
    "en": "DSCR Coverage",
    "hi": "डीएससीआर कवरेज",
    "kn": "DSCR Coverage",
    "ta": "DSCR Coverage",
    "te": "DSCR Coverage",
    "mr": "डीएससीआर कवरेज",
    "bn": "DSCR Coverage"
  },
  "Bank Norm > 1.5x": {
    "en": "Bank Norm > 1.5x",
    "hi": "बैंक मानक > 1.5x",
    "kn": "Bank Norm > 1.5x",
    "ta": "Bank Norm > 1.5x",
    "te": "Bank Norm > 1.5x",
    "mr": "बैंक मानक > 1.5x",
    "bn": "Bank Norm > 1.5x"
  },
  "1. Executive Summary:": {
    "en": "1. Executive Summary:",
    "hi": "1. कार्यकारी सारांश:",
    "kn": "1. Executive Summary:",
    "ta": "1. Executive Summary:",
    "te": "1. Executive Summary:",
    "mr": "1. कार्यकारी सारांश:",
    "bn": "1. Executive Summary:"
  },
  "2. Purpose of Loan:": {
    "en": "2. Purpose of Loan:",
    "hi": "2. ऋण का उद्देश्य:",
    "kn": "2. Purpose of Loan:",
    "ta": "2. Purpose of Loan:",
    "te": "2. Purpose of Loan:",
    "mr": "2. ऋण का उद्देश्य:",
    "bn": "2. Purpose of Loan:"
  },
  "Financial Component": {
    "en": "Financial Component",
    "hi": "वित्तीय घटक",
    "kn": "Financial Component",
    "ta": "Financial Component",
    "te": "Financial Component",
    "mr": "वित्तीय घटक",
    "bn": "Financial Component"
  },
  "Amount (₹)": {
    "en": "Amount (₹)",
    "hi": "राशि (₹)",
    "kn": "Amount (₹)",
    "ta": "Amount (₹)",
    "te": "Amount (₹)",
    "mr": "राशि (₹)",
    "bn": "Amount (₹)"
  },
  "Notes": {
    "en": "Notes",
    "hi": "टिप्पणी",
    "kn": "Notes",
    "ta": "Notes",
    "te": "Notes",
    "mr": "टिप्पणी",
    "bn": "Notes"
  },
  "Equipment & Tools": {
    "en": "Equipment & Tools",
    "hi": "उपकरण एवं मशीनरी",
    "kn": "Equipment & Tools",
    "ta": "Equipment & Tools",
    "te": "Equipment & Tools",
    "mr": "उपकरण एवं मशीनरी",
    "bn": "Equipment & Tools"
  },
  "Capital Asset": {
    "en": "Capital Asset",
    "hi": "पूंजीगत संपत्ति",
    "kn": "Capital Asset",
    "ta": "Capital Asset",
    "te": "Capital Asset",
    "mr": "पूंजीगत संपत्ति",
    "bn": "Capital Asset"
  },
  "Working Capital & Spares": {
    "en": "Working Capital & Spares",
    "hi": "कार्यशील पूंजी एवं स्पेयर",
    "kn": "Working Capital & Spares",
    "ta": "Working Capital & Spares",
    "te": "Working Capital & Spares",
    "mr": "कार्यशील पूंजी एवं स्पेयर",
    "bn": "Working Capital & Spares"
  },
  "30% Gestation Buffer": {
    "en": "30% Gestation Buffer",
    "hi": "30% प्रारंभिक बफर",
    "kn": "30% Gestation Buffer",
    "ta": "30% Gestation Buffer",
    "te": "30% Gestation Buffer",
    "mr": "30% प्रारंभिक बफर",
    "bn": "30% Gestation Buffer"
  },
  "Total Project Outlay": {
    "en": "Total Project Outlay",
    "hi": "कुल परियोजना परिव्यय",
    "kn": "Total Project Outlay",
    "ta": "Total Project Outlay",
    "te": "Total Project Outlay",
    "mr": "कुल परियोजना परिव्यय",
    "bn": "Total Project Outlay"
  },
  "100% Outlay": {
    "en": "100% Outlay",
    "hi": "100% परिव्यय",
    "kn": "100% Outlay",
    "ta": "100% Outlay",
    "te": "100% Outlay",
    "mr": "100% परिव्यय",
    "bn": "100% Outlay"
  },
  "Own Funds": {
    "en": "Own Funds",
    "hi": "स्वयं का अंशदान",
    "kn": "Own Funds",
    "ta": "Own Funds",
    "te": "Own Funds",
    "mr": "स्वयं का अंशदान",
    "bn": "Own Funds"
  },
  "Net Term Loan Under Scheme": {
    "en": "Net Term Loan Under Scheme",
    "hi": "योजना के तहत शुद्ध ऋण",
    "kn": "Net Term Loan Under Scheme",
    "ta": "Net Term Loan Under Scheme",
    "te": "Net Term Loan Under Scheme",
    "mr": "योजना के तहत शुद्ध ऋण",
    "bn": "Net Term Loan Under Scheme"
  },
  "95% Concessional": {
    "en": "95% Concessional",
    "hi": "95% रियायती",
    "kn": "95% Concessional",
    "ta": "95% Concessional",
    "te": "95% Concessional",
    "mr": "95% रियायती",
    "bn": "95% Concessional"
  },
  "Repayment Assessment:": {
    "en": "Repayment Assessment:",
    "hi": "पुनर्भुगतान क्षमता मूल्यांकन:",
    "kn": "Repayment Assessment:",
    "ta": "Repayment Assessment:",
    "te": "Repayment Assessment:",
    "mr": "पुनर्भुगतान क्षमता मूल्यांकन:",
    "bn": "Repayment Assessment:"
  },
  "Locate Channel Partners": {
    "en": "Locate Channel Partners",
    "hi": "चैनल पार्टनर खोजें",
    "kn": "Locate Channel Partners",
    "ta": "Locate Channel Partners",
    "te": "Locate Channel Partners",
    "mr": "चैनल पार्टनर खोजें",
    "bn": "Locate Channel Partners"
  },
  "Verified (Uploaded)": {
    "en": "Verified (Uploaded)",
    "hi": "सत्यापित (अपलोड किया गया)",
    "kn": "Verified (Uploaded)",
    "ta": "Verified (Uploaded)",
    "te": "Verified (Uploaded)",
    "mr": "सत्यापित (अपलोड किया गया)",
    "bn": "Verified (Uploaded)"
  },
  "Verified (DigiLocker)": {
    "en": "Verified (DigiLocker)",
    "hi": "सत्यापित (डिजिलॉकर)",
    "kn": "Verified (DigiLocker)",
    "ta": "Verified (DigiLocker)",
    "te": "Verified (DigiLocker)",
    "mr": "सत्यापित (डिजिलॉकर)",
    "bn": "Verified (DigiLocker)"
  },
  "Document Checklist & Verification": {
    "en": "Document Checklist & Verification",
    "hi": "दस्तावेज चेकलिस्ट एवं सत्यापन",
    "kn": "Document Checklist & Verification",
    "ta": "Document Checklist & Verification",
    "te": "Document Checklist & Verification",
    "mr": "दस्तावेज चेकलिस्ट एवं सत्यापन",
    "bn": "Document Checklist & Verification"
  },
  "Government Document Dossier": {
    "en": "Government Document Dossier",
    "hi": "सरकारी दस्तावेज डोजियर",
    "kn": "Government Document Dossier",
    "ta": "Government Document Dossier",
    "te": "Government Document Dossier",
    "mr": "सरकारी दस्तावेज डोजियर",
    "bn": "Government Document Dossier"
  },
  "Fetching...": {
    "en": "Fetching...",
    "hi": "प्राप्त कर रहे हैं...",
    "kn": "Fetching...",
    "ta": "Fetching...",
    "te": "Fetching...",
    "mr": "प्राप्त कर रहे हैं...",
    "bn": "Fetching..."
  },
  "1-Click DigiLocker Sync": {
    "en": "1-Click DigiLocker Sync",
    "hi": "1-क्लिक डिजिलॉकर सिंक",
    "kn": "1-Click DigiLocker Sync",
    "ta": "1-Click DigiLocker Sync",
    "te": "1-Click DigiLocker Sync",
    "mr": "1-क्लिक डिजिलॉकर सिंक",
    "bn": "1-Click DigiLocker Sync"
  },
  "✓ PDF, JPG, PNG accepted": {
    "en": "✓ PDF, JPG, PNG accepted",
    "hi": "✓ पीडीएफ, जेपीजी, पीएनजी समर्थित",
    "kn": "✓ PDF, JPG, PNG accepted",
    "ta": "✓ PDF, JPG, PNG accepted",
    "te": "✓ PDF, JPG, PNG accepted",
    "mr": "✓ पीडीएफ, जेपीजी, पीएनजी समर्थित",
    "bn": "✓ PDF, JPG, PNG accepted"
  },
  "Channel Partners require verified documentation before loan appraisal. Click below to select and upload from your computer:": {
    "en": "Channel Partners require verified documentation before loan appraisal. Click below to select and upload from your computer:",
    "hi": "ऋण मूल्यांकन से पहले चैनल पार्टनर्स को सत्यापित दस्तावेजों की आवश्यकता होती है। अपने कंप्यूटर से चुनने और अपलोड करने के लिए नीचे क्लिक करें:",
    "kn": "Channel Partners require verified documentation before loan appraisal. Click below to select and upload from your computer:",
    "ta": "Channel Partners require verified documentation before loan appraisal. Click below to select and upload from your computer:",
    "te": "Channel Partners require verified documentation before loan appraisal. Click below to select and upload from your computer:",
    "mr": "ऋण मूल्यांकन से पहले चैनल पार्टनर्स को सत्यापित दस्तावेजों की आवश्यकता होती है। अपने कंप्यूटर से चुनने और अपलोड करने के लिए नीचे क्लिक करें:",
    "bn": "Channel Partners require verified documentation before loan appraisal. Click below to select and upload from your computer:"
  },
  "Choose File": {
    "en": "Choose File",
    "hi": "फ़ाइल चुनें",
    "kn": "Choose File",
    "ta": "Choose File",
    "te": "Choose File",
    "mr": "फ़ाइल चुनें",
    "bn": "Choose File"
  },
  "All Required Documents Verified! Ready for Immediate Channel Partner Submission.": {
    "en": "All Required Documents Verified! Ready for Immediate Channel Partner Submission.",
    "hi": "सभी आवश्यक दस्तावेज सत्यापित! तत्काल चैनल पार्टनर सबमिशन के लिए तैयार।",
    "kn": "All Required Documents Verified! Ready for Immediate Channel Partner Submission.",
    "ta": "All Required Documents Verified! Ready for Immediate Channel Partner Submission.",
    "te": "All Required Documents Verified! Ready for Immediate Channel Partner Submission.",
    "mr": "सभी आवश्यक दस्तावेज सत्यापित! तत्काल चैनल पार्टनर सबमिशन के लिए तैयार।",
    "bn": "All Required Documents Verified! Ready for Immediate Channel Partner Submission."
  },
  "100% Bank Ready": {
    "en": "100% Bank Ready",
    "hi": "100% बैंक तैयार",
    "kn": "100% Bank Ready",
    "ta": "100% Bank Ready",
    "te": "100% Bank Ready",
    "mr": "100% बैंक तैयार",
    "bn": "100% Bank Ready"
  },
  "Document Title": {
    "en": "Document Title",
    "hi": "दस्तावेज शीर्षक",
    "kn": "Document Title",
    "ta": "Document Title",
    "te": "Document Title",
    "mr": "दस्तावेज शीर्षक",
    "bn": "Document Title"
  },
  "Requirement": {
    "en": "Requirement",
    "hi": "आवश्यकता",
    "kn": "Requirement",
    "ta": "Requirement",
    "te": "Requirement",
    "mr": "आवश्यकता",
    "bn": "Requirement"
  },
  "Status": {
    "en": "Status",
    "hi": "सत्यापन स्थिति",
    "kn": "Status",
    "ta": "Status",
    "te": "Status",
    "mr": "सत्यापन स्थिति",
    "bn": "Status"
  },
  "Attached File": {
    "en": "Attached File",
    "hi": "संलग्न फ़ाइल",
    "kn": "Attached File",
    "ta": "Attached File",
    "te": "Attached File",
    "mr": "संलग्न फ़ाइल",
    "bn": "Attached File"
  },
  "Actions": {
    "en": "Actions",
    "hi": "कार्रवाई",
    "kn": "Actions",
    "ta": "Actions",
    "te": "Actions",
    "mr": "कार्रवाई",
    "bn": "Actions"
  },
  "Mandatory": {
    "en": "Mandatory",
    "hi": "अनिवार्य",
    "kn": "Mandatory",
    "ta": "Mandatory",
    "te": "Mandatory",
    "mr": "अनिवार्य",
    "bn": "Mandatory"
  },
  "Optional / As Required": {
    "en": "Optional / As Required",
    "hi": "वैकल्पिक / आवश्यक होने पर",
    "kn": "Optional / As Required",
    "ta": "Optional / As Required",
    "te": "Optional / As Required",
    "mr": "वैकल्पिक / आवश्यक होने पर",
    "bn": "Optional / As Required"
  },
  "Click to view document": {
    "en": "Click to view document",
    "hi": "दस्तावेज देखने के लिए क्लिक करें",
    "kn": "Click to view document",
    "ta": "Click to view document",
    "te": "Click to view document",
    "mr": "दस्तावेज देखने के लिए क्लिक करें",
    "bn": "Click to view document"
  },
  "No file uploaded": {
    "en": "No file uploaded",
    "hi": "कोई फ़ाइल अपलोड नहीं की गई",
    "kn": "No file uploaded",
    "ta": "No file uploaded",
    "te": "No file uploaded",
    "mr": "कोई फ़ाइल अपलोड नहीं की गई",
    "bn": "No file uploaded"
  },
  "Upload File": {
    "en": "Upload File",
    "hi": "फ़ाइल अपलोड करें",
    "kn": "Upload File",
    "ta": "Upload File",
    "te": "Upload File",
    "mr": "फ़ाइल अपलोड करें",
    "bn": "Upload File"
  },
  "View": {
    "en": "View",
    "hi": "देखें",
    "kn": "View",
    "ta": "View",
    "te": "View",
    "mr": "देखें",
    "bn": "View"
  },
  "Upload a new file to replace this document": {
    "en": "Upload a new file to replace this document",
    "hi": "इस दस्तावेज को बदलने के लिए नई फ़ाइल अपलोड करें",
    "kn": "Upload a new file to replace this document",
    "ta": "Upload a new file to replace this document",
    "te": "Upload a new file to replace this document",
    "mr": "इस दस्तावेज को बदलने के लिए नई फ़ाइल अपलोड करें",
    "bn": "Upload a new file to replace this document"
  },
  "Replace": {
    "en": "Replace",
    "hi": "बदलें",
    "kn": "Replace",
    "ta": "Replace",
    "te": "Replace",
    "mr": "बदलें",
    "bn": "Replace"
  },
  "Print / Save DPR": {
    "en": "Print / Save DPR",
    "hi": "डीपीआर प्रिंट / सहेजें",
    "kn": "Print / Save DPR",
    "ta": "Print / Save DPR",
    "te": "Print / Save DPR",
    "mr": "डीपीआर प्रिंट / सहेजें",
    "bn": "Print / Save DPR"
  },
  "View Application Pack →": {
    "en": "View Application Pack →",
    "hi": "आवेदन पैक देखें →",
    "kn": "View Application Pack →",
    "ta": "View Application Pack →",
    "te": "View Application Pack →",
    "mr": "आवेदन पैक देखें →",
    "bn": "View Application Pack →"
  },
  "Verified Beneficiary Document | SchemeReady Portal": {
    "en": "Verified Beneficiary Document | SchemeReady Portal",
    "hi": "सत्यापित लाभार्थी दस्तावेज | स्कीम रेडी पोर्टल",
    "kn": "Verified Beneficiary Document | SchemeReady Portal",
    "ta": "Verified Beneficiary Document | SchemeReady Portal",
    "te": "Verified Beneficiary Document | SchemeReady Portal",
    "mr": "सत्यापित लाभार्थी दस्तावेज | स्कीम रेडी पोर्टल",
    "bn": "Verified Beneficiary Document | SchemeReady Portal"
  },
  "File:": {
    "en": "File:",
    "hi": "फ़ाइल:",
    "kn": "File:",
    "ta": "File:",
    "te": "File:",
    "mr": "फ़ाइल:",
    "bn": "File:"
  },
  "GOVERNMENT VERIFIED": {
    "en": "GOVERNMENT VERIFIED",
    "hi": "भारत सरकार द्वारा सत्यापित",
    "kn": "GOVERNMENT VERIFIED",
    "ta": "GOVERNMENT VERIFIED",
    "te": "GOVERNMENT VERIFIED",
    "mr": "भारत सरकार द्वारा सत्यापित",
    "bn": "GOVERNMENT VERIFIED"
  },
  "Revenue Department • Concessional Finance Channel System": {
    "en": "Revenue Department • Concessional Finance Channel System",
    "hi": "राजस्व विभाग • रियायती वित्त चैनल प्रणाली",
    "kn": "Revenue Department • Concessional Finance Channel System",
    "ta": "Revenue Department • Concessional Finance Channel System",
    "te": "Revenue Department • Concessional Finance Channel System",
    "mr": "राजस्व विभाग • रियायती वित्त चैनल प्रणाली",
    "bn": "Revenue Department • Concessional Finance Channel System"
  },
  "Beneficiary Name": {
    "en": "Beneficiary Name",
    "hi": "लाभार्थी का नाम",
    "kn": "Beneficiary Name",
    "ta": "Beneficiary Name",
    "te": "Beneficiary Name",
    "mr": "लाभार्थी का नाम",
    "bn": "Beneficiary Name"
  },
  "Parents": {
    "en": "Parents",
    "hi": "माता-पिता का नाम",
    "kn": "Parents",
    "ta": "Parents",
    "te": "Parents",
    "mr": "माता-पिता का नाम",
    "bn": "Parents"
  },
  "Reference / Certificate ID": {
    "en": "Reference / Certificate ID",
    "hi": "प्रमाण पत्र / संदर्भ संख्या",
    "kn": "Reference / Certificate ID",
    "ta": "Reference / Certificate ID",
    "te": "Reference / Certificate ID",
    "mr": "प्रमाण पत्र / संदर्भ संख्या",
    "bn": "Reference / Certificate ID"
  },
  "Verification Statement:": {
    "en": "Verification Statement:",
    "hi": "सत्यापन विवरण:",
    "kn": "Verification Statement:",
    "ta": "Verification Statement:",
    "te": "Verification Statement:",
    "mr": "सत्यापन विवरण:",
    "bn": "Verification Statement:"
  },
  "Digitally authenticated document. Verified for concessional loan interest rates (4.0% - 8.0%) under NSFDC and Ministry guidelines.": {
    "en": "Digitally authenticated document. Verified for concessional loan interest rates (4.0% - 8.0%) under NSFDC and Ministry guidelines.",
    "hi": "डिजिटल रूप से प्रमाणित दस्तावेज। एनएसएफडीसी और मंत्रालय के दिशानिर्देशों के तहत रियायती ऋण ब्याज दरों (4.0% - 8.0%) के लिए सत्यापित।",
    "kn": "Digitally authenticated document. Verified for concessional loan interest rates (4.0% - 8.0%) under NSFDC and Ministry guidelines.",
    "ta": "Digitally authenticated document. Verified for concessional loan interest rates (4.0% - 8.0%) under NSFDC and Ministry guidelines.",
    "te": "Digitally authenticated document. Verified for concessional loan interest rates (4.0% - 8.0%) under NSFDC and Ministry guidelines.",
    "mr": "डिजिटल रूप से प्रमाणित दस्तावेज। एनएसएफडीसी और मंत्रालय के दिशानिर्देशों के तहत रियायती ऋण ब्याज दरों (4.0% - 8.0%) के लिए सत्यापित।",
    "bn": "Digitally authenticated document. Verified for concessional loan interest rates (4.0% - 8.0%) under NSFDC and Ministry guidelines."
  },
  "Digital Authority: Certifying Tahsildar / Authorized Bank Partner": {
    "en": "Digital Authority: Certifying Tahsildar / Authorized Bank Partner",
    "hi": "डिजिटल प्राधिकरण: प्रमाणित तहसीलदार / अधिकृत बैंक पार्टनर",
    "kn": "Digital Authority: Certifying Tahsildar / Authorized Bank Partner",
    "ta": "Digital Authority: Certifying Tahsildar / Authorized Bank Partner",
    "te": "Digital Authority: Certifying Tahsildar / Authorized Bank Partner",
    "mr": "डिजिटल प्राधिकरण: प्रमाणित तहसीलदार / अधिकृत बैंक पार्टनर",
    "bn": "Digital Authority: Certifying Tahsildar / Authorized Bank Partner"
  },
  "Timestamp: September 2026": {
    "en": "Timestamp: September 2026",
    "hi": "समय: सितंबर 2026",
    "kn": "Timestamp: September 2026",
    "ta": "Timestamp: September 2026",
    "te": "Timestamp: September 2026",
    "mr": "समय: सितंबर 2026",
    "bn": "Timestamp: September 2026"
  },
  "Upload different file from device": {
    "en": "Upload different file from device",
    "hi": "डिवाइस से दूसरी फ़ाइल अपलोड करें",
    "kn": "Upload different file from device",
    "ta": "Upload different file from device",
    "te": "Upload different file from device",
    "mr": "डिवाइस से दूसरी फ़ाइल अपलोड करें",
    "bn": "Upload different file from device"
  },
  "Print": {
    "en": "Print",
    "hi": "प्रिंट",
    "kn": "ಮುದ್ರಿಸಿ",
    "ta": "அச்சிடுக",
    "te": "ముద్రించండి",
    "mr": "मुद्रित करा",
    "bn": "প্রিন্ট করুন"
  },
  "Done": {
    "en": "Done",
    "hi": "संपन्न",
    "kn": "Done",
    "ta": "Done",
    "te": "Done",
    "mr": "संपन्न",
    "bn": "Done"
  },
  "Feature 7: EMI & Repayment Simulator": {
    "en": "Feature 7: EMI & Repayment Simulator",
    "hi": "सुविधा 7: EMI एवं पुनर्भुगतान सिम्युलेटर",
    "kn": "ವೈಶಿಷ್ಟ್ಯ 7: EMI ಮತ್ತು ಮರುಪಾವತಿ ಸಿಮ್ಯುಲೇಟರ್",
    "ta": "அம்சம் 7: EMI & திருப்பிச் செலுத்தும் சிமுலேட்டர்",
    "te": "ఫీచర్ 7: EMI & తిరిగి చెల్లించే సిమ్యులేటర్",
    "mr": "वैशिष्ट्य 7: ईएमआय आणि परतफेड सिम्युलेटर",
    "bn": "বৈশিষ্ট্য ৭: ইএমআই ও পরিশোধ সিমুলেটর"
  },
  "MCS Preset (5%, 36mo)": {
    "en": "MCS Preset (5%, 36mo)",
    "hi": "MCS प्रीसेट (5%, 36 माह)",
    "kn": "MCS Preset (5%, 36mo)",
    "ta": "MCS Preset (5%, 36mo)",
    "te": "MCS Preset (5%, 36mo)",
    "mr": "MCS प्रीसेट (5%, 36 माह)",
    "bn": "MCS Preset (5%, 36mo)"
  },
  "TLS Preset (6%, 60mo)": {
    "en": "TLS Preset (6%, 60mo)",
    "hi": "TLS प्रीसेट (6%, 60 माह)",
    "kn": "TLS Preset (6%, 60mo)",
    "ta": "TLS Preset (6%, 60mo)",
    "te": "TLS Preset (6%, 60mo)",
    "mr": "TLS प्रीसेट (6%, 60 माह)",
    "bn": "TLS Preset (6%, 60mo)"
  },
  "MSY Women (4%, 42mo)": {
    "en": "MSY Women (4%, 42mo)",
    "hi": "MSY महिला (4%, 42 माह)",
    "kn": "MSY Women (4%, 42mo)",
    "ta": "MSY Women (4%, 42mo)",
    "te": "MSY Women (4%, 42mo)",
    "mr": "MSY महिला (4%, 42 माह)",
    "bn": "MSY Women (4%, 42mo)"
  },
  "Configurable Parameters": {
    "en": "Configurable Parameters",
    "hi": "कॉन्फ़िगर करने योग्य वित्तीय पैरामीटर",
    "kn": "Configurable Parameters",
    "ta": "Configurable Parameters",
    "te": "Configurable Parameters",
    "mr": "कॉन्फ़िगर करने योग्य वित्तीय पैरामीटर",
    "bn": "Configurable Parameters"
  },
  "Loan Amount (P):": {
    "en": "Loan Amount (P):",
    "hi": "ऋण राशि (P):",
    "kn": "Loan Amount (P):",
    "ta": "Loan Amount (P):",
    "te": "Loan Amount (P):",
    "mr": "ऋण राशि (P):",
    "bn": "Loan Amount (P):"
  },
  "Annual Interest Rate (r):": {
    "en": "Annual Interest Rate (r):",
    "hi": "वार्षिक ब्याज दर (r):",
    "kn": "Annual Interest Rate (r):",
    "ta": "Annual Interest Rate (r):",
    "te": "Annual Interest Rate (r):",
    "mr": "वार्षिक ब्याज दर (r):",
    "bn": "Annual Interest Rate (r):"
  },
  "3% (Subsidized)": {
    "en": "3% (Subsidized)",
    "hi": "3% (रियायती)",
    "kn": "3% (Subsidized)",
    "ta": "3% (Subsidized)",
    "te": "3% (Subsidized)",
    "mr": "3% (रियायती)",
    "bn": "3% (Subsidized)"
  },
  "6% (Standard)": {
    "en": "6% (Standard)",
    "hi": "6% (मानक)",
    "kn": "6% (Standard)",
    "ta": "6% (Standard)",
    "te": "6% (Standard)",
    "mr": "6% (मानक)",
    "bn": "6% (Standard)"
  },
  "12% (Commercial)": {
    "en": "12% (Commercial)",
    "hi": "12% (वाणिज्यिक)",
    "kn": "12% (Commercial)",
    "ta": "12% (Commercial)",
    "te": "12% (Commercial)",
    "mr": "12% (वाणिज्यिक)",
    "bn": "12% (Commercial)"
  },
  "Repayment Tenure (n):": {
    "en": "Repayment Tenure (n):",
    "hi": "पुनर्भुगतान अवधि (n):",
    "kn": "Repayment Tenure (n):",
    "ta": "Repayment Tenure (n):",
    "te": "Repayment Tenure (n):",
    "mr": "पुनर्भुगतान अवधि (n):",
    "bn": "Repayment Tenure (n):"
  },
  "12 Months": {
    "en": "12 Months",
    "hi": "12 माह",
    "kn": "12 Months",
    "ta": "12 Months",
    "te": "12 Months",
    "mr": "12 माह",
    "bn": "12 Months"
  },
  "36 Months": {
    "en": "36 Months",
    "hi": "36 माह",
    "kn": "36 Months",
    "ta": "36 Months",
    "te": "36 Months",
    "mr": "36 माह",
    "bn": "36 Months"
  },
  "84 Months": {
    "en": "84 Months",
    "hi": "84 माह",
    "kn": "84 Months",
    "ta": "84 Months",
    "te": "84 Months",
    "mr": "84 माह",
    "bn": "84 Months"
  },
  "Moratorium / Gestation Buffer:": {
    "en": "Moratorium / Gestation Buffer:",
    "hi": "मोरेटोरियम / प्रारंभिक राहत अवधि:",
    "kn": "Moratorium / Gestation Buffer:",
    "ta": "Moratorium / Gestation Buffer:",
    "te": "Moratorium / Gestation Buffer:",
    "mr": "मोरेटोरियम / प्रारंभिक राहत अवधि:",
    "bn": "Moratorium / Gestation Buffer:"
  },
  "0 (Immediate)": {
    "en": "0 (Immediate)",
    "hi": "0 (तत्काल)",
    "kn": "0 (Immediate)",
    "ta": "0 (Immediate)",
    "te": "0 (Immediate)",
    "mr": "0 (तत्काल)",
    "bn": "0 (Immediate)"
  },
  "3 Months": {
    "en": "3 Months",
    "hi": "3 माह",
    "kn": "3 Months",
    "ta": "3 Months",
    "te": "3 Months",
    "mr": "3 माह",
    "bn": "3 Months"
  },
  "Government Subsidy / Promoter Contribution:": {
    "en": "Government Subsidy / Promoter Contribution:",
    "hi": "सरकारी सब्सिडी / प्रमोटर अंशदान:",
    "kn": "Government Subsidy / Promoter Contribution:",
    "ta": "Government Subsidy / Promoter Contribution:",
    "te": "Government Subsidy / Promoter Contribution:",
    "mr": "सरकारी सब्सिडी / प्रमोटर अंशदान:",
    "bn": "Government Subsidy / Promoter Contribution:"
  },
  "Repayment Projection": {
    "en": "Repayment Projection",
    "hi": "पुनर्भुगतान प्रक्षेपण",
    "kn": "Repayment Projection",
    "ta": "Repayment Projection",
    "te": "Repayment Projection",
    "mr": "पुनर्भुगतान प्रक्षेपण",
    "bn": "Repayment Projection"
  },
  "Formula Verified": {
    "en": "Formula Verified",
    "hi": "सत्यापित सूत्र",
    "kn": "Formula Verified",
    "ta": "Formula Verified",
    "te": "Formula Verified",
    "mr": "सत्यापित सूत्र",
    "bn": "Formula Verified"
  },
  "Calculated Monthly Installment (EMI)": {
    "en": "Calculated Monthly Installment (EMI)",
    "hi": "गणना की गई मासिक किस्त (EMI)",
    "kn": "Calculated Monthly Installment (EMI)",
    "ta": "Calculated Monthly Installment (EMI)",
    "te": "Calculated Monthly Installment (EMI)",
    "mr": "गणना की गई मासिक किस्त (EMI)",
    "bn": "Calculated Monthly Installment (EMI)"
  },
  "Effective Principal:": {
    "en": "Effective Principal:",
    "hi": "प्रभावी मूलधन:",
    "kn": "Effective Principal:",
    "ta": "Effective Principal:",
    "te": "Effective Principal:",
    "mr": "प्रभावी मूलधन:",
    "bn": "Effective Principal:"
  },
  "Total Interest Payable": {
    "en": "Total Interest Payable",
    "hi": "देय कुल ब्याज",
    "kn": "Total Interest Payable",
    "ta": "Total Interest Payable",
    "te": "Total Interest Payable",
    "mr": "देय कुल ब्याज",
    "bn": "Total Interest Payable"
  },
  "Total Amount Repaid": {
    "en": "Total Amount Repaid",
    "hi": "कुल चुकाई जाने वाली राशि",
    "kn": "Total Amount Repaid",
    "ta": "Total Amount Repaid",
    "te": "Total Amount Repaid",
    "mr": "कुल चुकाई जाने वाली राशि",
    "bn": "Total Amount Repaid"
  },
  "Effect of Moratorium:": {
    "en": "Effect of Moratorium:",
    "hi": "मोरेटोरियम का प्रभाव:",
    "kn": "Effect of Moratorium:",
    "ta": "Effect of Moratorium:",
    "te": "Effect of Moratorium:",
    "mr": "मोरेटोरियम का प्रभाव:",
    "bn": "Effect of Moratorium:"
  },
  "Standard Banking Amortization Formula:": {
    "en": "Standard Banking Amortization Formula:",
    "hi": "मानक बैंकिंग ऋण परिशोधन सूत्र:",
    "kn": "Standard Banking Amortization Formula:",
    "ta": "Standard Banking Amortization Formula:",
    "te": "Standard Banking Amortization Formula:",
    "mr": "मानक बैंकिंग ऋण परिशोधन सूत्र:",
    "bn": "Standard Banking Amortization Formula:"
  },
  "P = Principal, r = Monthly Interest Rate, n = Months": {
    "en": "P = Principal, r = Monthly Interest Rate, n = Months",
    "hi": "P = मूलधन, r = मासिक ब्याज दर, n = महीने",
    "kn": "P = Principal, r = Monthly Interest Rate, n = Months",
    "ta": "P = Principal, r = Monthly Interest Rate, n = Months",
    "te": "P = Principal, r = Monthly Interest Rate, n = Months",
    "mr": "P = मूलधन, r = मासिक ब्याज दर, n = महीने",
    "bn": "P = Principal, r = Monthly Interest Rate, n = Months"
  },
  "Hide Amortization Table": {
    "en": "Hide Amortization Table",
    "hi": "परिशोधन तालिका छुपाएं",
    "kn": "Hide Amortization Table",
    "ta": "Hide Amortization Table",
    "te": "Hide Amortization Table",
    "mr": "परिशोधन तालिका छुपाएं",
    "bn": "Hide Amortization Table"
  },
  "View Monthly Amortization Table": {
    "en": "View Monthly Amortization Table",
    "hi": "मासिक ऋण परिशोधन तालिका देखें",
    "kn": "View Monthly Amortization Table",
    "ta": "View Monthly Amortization Table",
    "te": "View Monthly Amortization Table",
    "mr": "मासिक ऋण परिशोधन तालिका देखें",
    "bn": "View Monthly Amortization Table"
  },
  "Generate Application Pack": {
    "en": "Generate Application Pack",
    "hi": "आवेदन पैक तैयार करें",
    "kn": "Generate Application Pack",
    "ta": "Generate Application Pack",
    "te": "Generate Application Pack",
    "mr": "आवेदन पैक तैयार करें",
    "bn": "Generate Application Pack"
  },
  "Monthly Amortization Schedule (First 24 Months)": {
    "en": "Monthly Amortization Schedule (First 24 Months)",
    "hi": "मासिक परिशोधन अनुसूची (पहले 24 महीने)",
    "kn": "Monthly Amortization Schedule (First 24 Months)",
    "ta": "Monthly Amortization Schedule (First 24 Months)",
    "te": "Monthly Amortization Schedule (First 24 Months)",
    "mr": "मासिक परिशोधन अनुसूची (पहले 24 महीने)",
    "bn": "Monthly Amortization Schedule (First 24 Months)"
  },
  "Month": {
    "en": "Month",
    "hi": "माह",
    "kn": "Month",
    "ta": "Month",
    "te": "Month",
    "mr": "माह",
    "bn": "Month"
  },
  "Opening (₹)": {
    "en": "Opening (₹)",
    "hi": "प्रारंभिक शेष (₹)",
    "kn": "Opening (₹)",
    "ta": "Opening (₹)",
    "te": "Opening (₹)",
    "mr": "प्रारंभिक शेष (₹)",
    "bn": "Opening (₹)"
  },
  "Principal (₹)": {
    "en": "Principal (₹)",
    "hi": "मूलधन (₹)",
    "kn": "Principal (₹)",
    "ta": "Principal (₹)",
    "te": "Principal (₹)",
    "mr": "मूलधन (₹)",
    "bn": "Principal (₹)"
  },
  "Interest (₹)": {
    "en": "Interest (₹)",
    "hi": "ब्याज (₹)",
    "kn": "Interest (₹)",
    "ta": "Interest (₹)",
    "te": "Interest (₹)",
    "mr": "ब्याज (₹)",
    "bn": "Interest (₹)"
  },
  "Total EMI (₹)": {
    "en": "Total EMI (₹)",
    "hi": "कुल ईएमआई (₹)",
    "kn": "Total EMI (₹)",
    "ta": "Total EMI (₹)",
    "te": "Total EMI (₹)",
    "mr": "कुल ईएमआई (₹)",
    "bn": "Total EMI (₹)"
  },
  "Closing (₹)": {
    "en": "Closing (₹)",
    "hi": "अंतिम शेष (₹)",
    "kn": "Closing (₹)",
    "ta": "Closing (₹)",
    "te": "Closing (₹)",
    "mr": "अंतिम शेष (₹)",
    "bn": "Closing (₹)"
  },
  "Type": {
    "en": "Type",
    "hi": "प्रकार",
    "kn": "Type",
    "ta": "Type",
    "te": "Type",
    "mr": "प्रकार",
    "bn": "Type"
  },
  "Moratorium": {
    "en": "Moratorium",
    "hi": "मोरेटोरियम",
    "kn": "Moratorium",
    "ta": "Moratorium",
    "te": "Moratorium",
    "mr": "मोरेटोरियम",
    "bn": "Moratorium"
  },
  "Regular EMI": {
    "en": "Regular EMI",
    "hi": "नियमित EMI",
    "kn": "Regular EMI",
    "ta": "Regular EMI",
    "te": "Regular EMI",
    "mr": "नियमित EMI",
    "bn": "Regular EMI"
  },
  "Not recorded": {
    "en": "Not recorded",
    "hi": "दर्ज नहीं",
    "kn": "Not recorded",
    "ta": "Not recorded",
    "te": "Not recorded",
    "mr": "दर्ज नहीं",
    "bn": "Not recorded"
  },
  "Feature 2: Explainable Scheme Engine": {
    "en": "Feature 2: Explainable Scheme Engine",
    "hi": "सुविधा 2: स्पष्टीकरण योग्य योजना मिलान इंजन",
    "kn": "Feature 2: Explainable Scheme Engine",
    "ta": "Feature 2: Explainable Scheme Engine",
    "te": "Feature 2: Explainable Scheme Engine",
    "mr": "सुविधा 2: स्पष्टीकरण योग्य योजना मिलान इंजन",
    "bn": "Feature 2: Explainable Scheme Engine"
  },
  "Deterministic scoring: 40% Eligibility + 25% Project Cost + 15% Docs + 10% Partner + 10% Fit": {
    "en": "Deterministic scoring: 40% Eligibility + 25% Project Cost + 15% Docs + 10% Partner + 10% Fit",
    "hi": "निश्चित स्कोरिंग: 40% पात्रता + 25% परियोजना लागत + 15% दस्तावेज + 10% पार्टनर + 10% उपयुक्तता",
    "kn": "Deterministic scoring: 40% Eligibility + 25% Project Cost + 15% Docs + 10% Partner + 10% Fit",
    "ta": "Deterministic scoring: 40% Eligibility + 25% Project Cost + 15% Docs + 10% Partner + 10% Fit",
    "te": "Deterministic scoring: 40% Eligibility + 25% Project Cost + 15% Docs + 10% Partner + 10% Fit",
    "mr": "निश्चित स्कोरिंग: 40% पात्रता + 25% परियोजना लागत + 15% दस्तावेज + 10% पार्टनर + 10% उपयुक्तता",
    "bn": "Deterministic scoring: 40% Eligibility + 25% Project Cost + 15% Docs + 10% Partner + 10% Fit"
  },
  "Evaluating schemes against statutory eligibility criteria...": {
    "en": "Evaluating schemes against statutory eligibility criteria...",
    "hi": "वैधानिक पात्रता मानदंडों के अनुसार योजनाओं का मूल्यांकन किया जा रहा है...",
    "kn": "Evaluating schemes against statutory eligibility criteria...",
    "ta": "Evaluating schemes against statutory eligibility criteria...",
    "te": "Evaluating schemes against statutory eligibility criteria...",
    "mr": "वैधानिक पात्रता मानदंडों के अनुसार योजनाओं का मूल्यांकन किया जा रहा है...",
    "bn": "Evaluating schemes against statutory eligibility criteria..."
  },
  "Top Recommendation": {
    "en": "Top Recommendation",
    "hi": "सर्वश्रेष्ठ सिफारिश",
    "kn": "Top Recommendation",
    "ta": "Top Recommendation",
    "te": "Top Recommendation",
    "mr": "सर्वश्रेष्ठ सिफारिश",
    "bn": "Top Recommendation"
  },
  "Match": {
    "en": "Match",
    "hi": "मिलान",
    "kn": "Match",
    "ta": "Match",
    "te": "Match",
    "mr": "मिलान",
    "bn": "Match"
  },
  "Interest Rate": {
    "en": "Interest Rate",
    "hi": "ब्याज दर",
    "kn": "ಬಡ್ಡಿದರ",
    "ta": "வட்டி விகிதம்",
    "te": "వడ్డీ రేటు",
    "mr": "व्याजदर",
    "bn": "সুদের হার"
  },
  "Max Loan": {
    "en": "Max Loan",
    "hi": "अधिकतम ऋण",
    "kn": "Max Loan",
    "ta": "Max Loan",
    "te": "Max Loan",
    "mr": "अधिकतम ऋण",
    "bn": "Max Loan"
  },
  "L": {
    "en": "L",
    "hi": "लाख",
    "kn": "L",
    "ta": "L",
    "te": "L",
    "mr": "लाख",
    "bn": "L"
  },
  "Est. EMI": {
    "en": "Est. EMI",
    "hi": "अनुमानित EMI",
    "kn": "Est. EMI",
    "ta": "Est. EMI",
    "te": "Est. EMI",
    "mr": "अनुमानित EMI",
    "bn": "Est. EMI"
  },
  "Select This Scheme": {
    "en": "Select This Scheme",
    "hi": "यह योजना चुनें",
    "kn": "Select This Scheme",
    "ta": "Select This Scheme",
    "te": "Select This Scheme",
    "mr": "यह योजना चुनें",
    "bn": "Select This Scheme"
  },
  "not recorded": {
    "en": "not recorded",
    "hi": "दर्ज नहीं",
    "kn": "not recorded",
    "ta": "not recorded",
    "te": "not recorded",
    "mr": "दर्ज नहीं",
    "bn": "not recorded"
  },
  "SIH Innovation: Channel Partner Fund Router": {
    "en": "SIH Innovation: Channel Partner Fund Router",
    "hi": "नवाचार: चैनल पार्टनर फंड एवं कार्यालय राउटर",
    "kn": "SIH Innovation: Channel Partner Fund Router",
    "ta": "SIH Innovation: Channel Partner Fund Router",
    "te": "SIH Innovation: Channel Partner Fund Router",
    "mr": "नवाचार: चैनल पार्टनर फंड एवं कार्यालय राउटर",
    "bn": "SIH Innovation: Channel Partner Fund Router"
  },
  "All Categories (SCA, PSB, RRB, MFI)": {
    "en": "All Categories (SCA, PSB, RRB, MFI)",
    "hi": "सभी श्रेणियां (SCA, PSB, RRB, MFI)",
    "kn": "All Categories (SCA, PSB, RRB, MFI)",
    "ta": "All Categories (SCA, PSB, RRB, MFI)",
    "te": "All Categories (SCA, PSB, RRB, MFI)",
    "mr": "सभी श्रेणियां (SCA, PSB, RRB, MFI)",
    "bn": "All Categories (SCA, PSB, RRB, MFI)"
  },
  "State Channelizing Agency (SCA)": {
    "en": "State Channelizing Agency (SCA)",
    "hi": "राज्य चैनलिंग एजेंसी (SCA)",
    "kn": "State Channelizing Agency (SCA)",
    "ta": "State Channelizing Agency (SCA)",
    "te": "State Channelizing Agency (SCA)",
    "mr": "राज्य चैनलिंग एजेंसी (SCA)",
    "bn": "State Channelizing Agency (SCA)"
  },
  "Public Sector Bank (PSB)": {
    "en": "Public Sector Bank (PSB)",
    "hi": "सार्वजनिक क्षेत्र का बैंक (PSB)",
    "kn": "Public Sector Bank (PSB)",
    "ta": "Public Sector Bank (PSB)",
    "te": "Public Sector Bank (PSB)",
    "mr": "सार्वजनिक क्षेत्र का बैंक (PSB)",
    "bn": "Public Sector Bank (PSB)"
  },
  "Regional Rural Bank (RRB)": {
    "en": "Regional Rural Bank (RRB)",
    "hi": "क्षेत्रीय ग्रामीण बैंक (RRB)",
    "kn": "Regional Rural Bank (RRB)",
    "ta": "Regional Rural Bank (RRB)",
    "te": "Regional Rural Bank (RRB)",
    "mr": "क्षेत्रीय ग्रामीण बैंक (RRB)",
    "bn": "Regional Rural Bank (RRB)"
  },
  "Micro Finance Institution (MFI)": {
    "en": "Micro Finance Institution (MFI)",
    "hi": "सूक्ष्म वित्त संस्थान (MFI)",
    "kn": "Micro Finance Institution (MFI)",
    "ta": "Micro Finance Institution (MFI)",
    "te": "Micro Finance Institution (MFI)",
    "mr": "सूक्ष्म वित्त संस्थान (MFI)",
    "bn": "Micro Finance Institution (MFI)"
  },
  "SIH Fund Utilization & NPA Filter:": {
    "en": "SIH Fund Utilization & NPA Filter:",
    "hi": "फंड उपयोगिता एवं एनपीए फ़िल्टर:",
    "kn": "SIH Fund Utilization & NPA Filter:",
    "ta": "SIH Fund Utilization & NPA Filter:",
    "te": "SIH Fund Utilization & NPA Filter:",
    "mr": "फंड उपयोगिता एवं एनपीए फ़िल्टर:",
    "bn": "SIH Fund Utilization & NPA Filter:"
  },
  "Applications are strictly routed to partners verified for active fund disbursals with low NPAs to eliminate offline delays.": {
    "en": "Applications are strictly routed to partners verified for active fund disbursals with low NPAs to eliminate offline delays.",
    "hi": "आवेदनों को सक्रिय निधि वितरण और कम एनपीए वाले सत्यापित भागीदारों को भेजा जाता है।",
    "kn": "Applications are strictly routed to partners verified for active fund disbursals with low NPAs to eliminate offline delays.",
    "ta": "Applications are strictly routed to partners verified for active fund disbursals with low NPAs to eliminate offline delays.",
    "te": "Applications are strictly routed to partners verified for active fund disbursals with low NPAs to eliminate offline delays.",
    "mr": "आवेदनों को सक्रिय निधि वितरण और कम एनपीए वाले सत्यापित भागीदारों को भेजा जाता है।",
    "bn": "Applications are strictly routed to partners verified for active fund disbursals with low NPAs to eliminate offline delays."
  },
  "100+ Channel Partners Indexed": {
    "en": "100+ Channel Partners Indexed",
    "hi": "100+ चैनल पार्टनर अनुक्रमित",
    "kn": "100+ Channel Partners Indexed",
    "ta": "100+ Channel Partners Indexed",
    "te": "100+ Channel Partners Indexed",
    "mr": "100+ चैनल पार्टनर अनुक्रमित",
    "bn": "100+ Channel Partners Indexed"
  },
  "Smart Routing Recommendation:": {
    "en": "Smart Routing Recommendation:",
    "hi": "स्मार्ट रूटिंग सिफारिश:",
    "kn": "Smart Routing Recommendation:",
    "ta": "Smart Routing Recommendation:",
    "te": "Smart Routing Recommendation:",
    "mr": "स्मार्ट रूटिंग सिफारिश:",
    "bn": "Smart Routing Recommendation:"
  },
  "Distance from applicant:": {
    "en": "Distance from applicant:",
    "hi": "आवेदक से दूरी:",
    "kn": "Distance from applicant:",
    "ta": "Distance from applicant:",
    "te": "Distance from applicant:",
    "mr": "आवेदक से दूरी:",
    "bn": "Distance from applicant:"
  },
  "Select & Open Financial Calculator": {
    "en": "Select & Open Financial Calculator",
    "hi": "चुनें और वित्तीय कैलकुलेटर खोलें",
    "kn": "Select & Open Financial Calculator",
    "ta": "Select & Open Financial Calculator",
    "te": "Select & Open Financial Calculator",
    "mr": "चुनें और वित्तीय कैलकुलेटर खोलें",
    "bn": "Select & Open Financial Calculator"
  },
  "NPA Audit:": {
    "en": "NPA Audit:",
    "hi": "एनपीए ऑडिट:",
    "kn": "NPA Audit:",
    "ta": "NPA Audit:",
    "te": "NPA Audit:",
    "mr": "एनपीए ऑडिट:",
    "bn": "NPA Audit:"
  },
  "Schemes Processed:": {
    "en": "Schemes Processed:",
    "hi": "संसाधित योजनाएं:",
    "kn": "Schemes Processed:",
    "ta": "Schemes Processed:",
    "te": "Schemes Processed:",
    "mr": "संसाधित योजनाएं:",
    "bn": "Schemes Processed:"
  },
  "Verified Clean Disbursal": {
    "en": "Verified Clean Disbursal",
    "hi": "सत्यापित स्वच्छ वितरण",
    "kn": "Verified Clean Disbursal",
    "ta": "Verified Clean Disbursal",
    "te": "Verified Clean Disbursal",
    "mr": "सत्यापित स्वच्छ वितरण",
    "bn": "Verified Clean Disbursal"
  },
  "Mode": {
    "en": "Mode",
    "hi": "मोड",
    "kn": "Mode",
    "ta": "Mode",
    "te": "Mode",
    "mr": "मोड",
    "bn": "Mode"
  },
  "That file is empty. Please choose the scanned document itself.": {
    "en": "That file is empty. Please choose the scanned document itself.",
    "hi": "वह फ़ाइल खाली है। कृपया स्कैन किया गया दस्तावेज चुनें।",
    "kn": "That file is empty. Please choose the scanned document itself.",
    "ta": "That file is empty. Please choose the scanned document itself.",
    "te": "That file is empty. Please choose the scanned document itself.",
    "mr": "वह फ़ाइल खाली है। कृपया स्कैन किया गया दस्तावेज चुनें।",
    "bn": "That file is empty. Please choose the scanned document itself."
  },
  "Your session ended before the upload finished. Please sign in and try again.": {
    "en": "Your session ended before the upload finished. Please sign in and try again.",
    "hi": "सत्र समाप्त हो गया। कृपया साइन इन करें और पुनः प्रयास करें।",
    "kn": "Your session ended before the upload finished. Please sign in and try again.",
    "ta": "Your session ended before the upload finished. Please sign in and try again.",
    "te": "Your session ended before the upload finished. Please sign in and try again.",
    "mr": "सत्र समाप्त हो गया। कृपया साइन इन करें और पुनः प्रयास करें।",
    "bn": "Your session ended before the upload finished. Please sign in and try again."
  },
  "The upload was rejected. Nothing was saved — please try again.": {
    "en": "The upload was rejected. Nothing was saved — please try again.",
    "hi": "अपलोड अस्वीकार कर दिया गया। कृपया पुनः प्रयास करें।",
    "kn": "The upload was rejected. Nothing was saved — please try again.",
    "ta": "The upload was rejected. Nothing was saved — please try again.",
    "te": "The upload was rejected. Nothing was saved — please try again.",
    "mr": "अपलोड अस्वीकार कर दिया गया। कृपया पुनः प्रयास करें।",
    "bn": "The upload was rejected. Nothing was saved — please try again."
  },
  "Calculating Application Readiness Score...": {
    "en": "Calculating Application Readiness Score...",
    "hi": "आवेदन तत्परता स्कोर की गणना की जा रही है...",
    "kn": "Calculating Application Readiness Score...",
    "ta": "Calculating Application Readiness Score...",
    "te": "Calculating Application Readiness Score...",
    "mr": "आवेदन तत्परता स्कोर की गणना की जा रही है...",
    "bn": "Calculating Application Readiness Score..."
  },
  "The readiness checklist is unavailable right now.": {
    "en": "The readiness checklist is unavailable right now.",
    "hi": "तत्परता चेकलिस्ट अभी उपलब्ध नहीं है।",
    "kn": "The readiness checklist is unavailable right now.",
    "ta": "The readiness checklist is unavailable right now.",
    "te": "The readiness checklist is unavailable right now.",
    "mr": "तत्परता चेकलिस्ट अभी उपलब्ध नहीं है।",
    "bn": "The readiness checklist is unavailable right now."
  },
  "Nothing has been lost — reload once you are signed in and your checklist will reappear.": {
    "en": "Nothing has been lost — reload once you are signed in and your checklist will reappear.",
    "hi": "साइन इन करने के बाद पुनः लोड करें और आपकी चेकलिस्ट फिर से दिखाई देगी।",
    "kn": "Nothing has been lost — reload once you are signed in and your checklist will reappear.",
    "ta": "Nothing has been lost — reload once you are signed in and your checklist will reappear.",
    "te": "Nothing has been lost — reload once you are signed in and your checklist will reappear.",
    "mr": "साइन इन करने के बाद पुनः लोड करें और आपकी चेकलिस्ट फिर से दिखाई देगी।",
    "bn": "Nothing has been lost — reload once you are signed in and your checklist will reappear."
  },
  "Feature 3: Application Readiness Score": {
    "en": "Feature 3: Application Readiness Score",
    "hi": "सुविधा 3: आवेदन तत्परता स्कोर",
    "kn": "Feature 3: Application Readiness Score",
    "ta": "Feature 3: Application Readiness Score",
    "te": "Feature 3: Application Readiness Score",
    "mr": "सुविधा 3: आवेदन तत्परता स्कोर",
    "bn": "Feature 3: Application Readiness Score"
  },
  "Overall Status": {
    "en": "Overall Status",
    "hi": "समग्र स्थिति",
    "kn": "Overall Status",
    "ta": "Overall Status",
    "te": "Overall Status",
    "mr": "समग्र स्थिति",
    "bn": "Overall Status"
  },
  "How to upload a document": {
    "en": "How to upload a document",
    "hi": "दस्तावेज कैसे अपलोड करें",
    "kn": "How to upload a document",
    "ta": "How to upload a document",
    "te": "How to upload a document",
    "mr": "दस्तावेज कैसे अपलोड करें",
    "bn": "How to upload a document"
  },
  "Next Recommended Action:": {
    "en": "Next Recommended Action:",
    "hi": "अगली अनुशंसित कार्रवाई:",
    "kn": "Next Recommended Action:",
    "ta": "Next Recommended Action:",
    "te": "Next Recommended Action:",
    "mr": "अगली अनुशंसित कार्रवाई:",
    "bn": "Next Recommended Action:"
  },
  "AI Project Report": {
    "en": "AI Project Report",
    "hi": "AI प्रोजेक्ट रिपोर्ट",
    "kn": "AI Project Report",
    "ta": "AI Project Report",
    "te": "AI Project Report",
    "mr": "AI प्रोजेक्ट रिपोर्ट",
    "bn": "AI Project Report"
  },
  "Requirement & Verification Item": {
    "en": "Requirement & Verification Item",
    "hi": "आवश्यकता एवं सत्यापन वस्तु",
    "kn": "Requirement & Verification Item",
    "ta": "Requirement & Verification Item",
    "te": "Requirement & Verification Item",
    "mr": "आवश्यकता एवं सत्यापन वस्तु",
    "bn": "Requirement & Verification Item"
  },
  "Status & Remediation Action": {
    "en": "Status & Remediation Action",
    "hi": "स्थिति एवं सुधारात्मक कार्रवाई",
    "kn": "Status & Remediation Action",
    "ta": "Status & Remediation Action",
    "te": "Status & Remediation Action",
    "mr": "स्थिति एवं सुधारात्मक कार्रवाई",
    "bn": "Status & Remediation Action"
  },
  "Optional": {
    "en": "Optional",
    "hi": "वैकल्पिक",
    "kn": "Optional",
    "ta": "Optional",
    "te": "Optional",
    "mr": "वैकल्पिक",
    "bn": "Optional"
  },
  "Uploading…": {
    "en": "Uploading…",
    "hi": "अपलोड हो रहा है…",
    "kn": "Uploading…",
    "ta": "Uploading…",
    "te": "Uploading…",
    "mr": "अपलोड हो रहा है…",
    "bn": "Uploading…"
  },
  "Replace file": {
    "en": "Replace file",
    "hi": "फ़ाइल बदलें",
    "kn": "Replace file",
    "ta": "Replace file",
    "te": "Replace file",
    "mr": "फ़ाइल बदलें",
    "bn": "Replace file"
  },
  "PDF, JPG or PNG · up to 5 MB": {
    "en": "PDF, JPG or PNG · up to 5 MB",
    "hi": "पीडीएफ, जेपीजी या पीएनजी · अधिकतम 5 एमबी",
    "kn": "PDF, JPG or PNG · up to 5 MB",
    "ta": "PDF, JPG or PNG · up to 5 MB",
    "te": "PDF, JPG or PNG · up to 5 MB",
    "mr": "पीडीएफ, जेपीजी या पीएनजी · अधिकतम 5 एमबी",
    "bn": "PDF, JPG or PNG · up to 5 MB"
  }
};

export function tPhrase(text, lang = "en") {
  if (!text) return "";
  const entry = phrases[text];
  if (entry && entry[lang]) return entry[lang];
  return text;
}

export function localizeTernary(hi, en, lang) {
  if (lang === "en") return en;
  if (lang === "hi") return hi;
  const translated = tPhrase(en, lang);
  if (translated && translated !== en) return translated;
  return hi || en;
}
