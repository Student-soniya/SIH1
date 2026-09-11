import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Calculator, 
  ShieldCheck, 
  Coins, 
  Building2, 
  TrendingUp, 
  MapPin, 
  Briefcase 
} from 'lucide-react';
import { t as tText } from '../../l10n';

export default function LandingHero({ 
  onStartOnboarding, 
  onExploreSchemes, 
  onQuickFind, 
  lang = 'en' 
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);

  // Quick Eligibility Finder state
  const [quickBusiness, setQuickBusiness] = useState('tailoring');
  const [quickLocation, setQuickLocation] = useState('Bengaluru');
  const [quickAmount, setQuickAmount] = useState('150000');

  const slides = [
    {
      id: 1,
      image: '/images/slide1_summit.jpg',
      tagline: tText({
        en: "MINISTRY OF SOCIAL JUSTICE & MSME | NATIONAL CONCESSIONAL CREDIT",
        hi: "सामाजिक न्याय एवं एमएसएमई मंत्रालय | राष्ट्रीय रियायती ऋण",
        kn: "ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು MSME ಸಚಿವಾಲಯ | ರಾಷ್ಟ್ರೀಯ ರಿಯಾಯಿತಿ ಸಾಲ",
        ta: "சமூக நீதி மற்றும் MSME அமைச்சகம் | தேசிய சலுகைக் கடன்",
        te: "సామాజిక న్యాయం & MSME మంత్రిత్వ శాఖ | జాతీయ రాయితీ రుణం",
        mr: "सामाजिक न्याय आणि एमएसएमई मंत्रालय | राष्ट्रीय सवलतीचे कर्ज",
        bn: "সামাজিক ন্যায়বিচার ও এমএসএমই মন্ত্রক | জাতীয় রেয়াতযোগ্য ঋণ"
      }, lang),
      headline: tText({
        en: "Empowering India's Grassroots Entrepreneurs With Concessional Capital",
        hi: "रियायती पूंजी के साथ भारत के जमीनी स्तर के उद्यमियों का सशक्तिकरण",
        kn: "ರಿಯಾಯಿತಿ ಬಂಡವಾಳದೊಂದಿಗೆ ಭಾರತದ ತಳಮಟ್ಟದ ಉದ್ಯಮಿಗಳ ಸಬಲೀಕರಣ",
        ta: "சலுகை மூலதனத்துடன் இந்தியாவின் அடிமட்ட தொழில்முனைவோருக்கு அதிகாரம் அளித்தல்",
        te: "రాయితీ మూలధనంతో భారతదేశ అట్టడుగు వ్యవస్థాపకులకు సాధికారత",
        mr: "सवलतीच्या भांडवलासह भारतातील तळागाळातील उद्योजकांचे सबलीकरण",
        bn: "রেয়াতযোগ্য মূলধনের মাধ্যমে ভারতের তৃণমূল পর্যায়ের উদ্যোক্তাদের ক্ষমতায়ন"
      }, lang),
      subheadline: tText({
        en: "Financial assistance up to ₹50 Lakhs at 4.0% to 8.0% interest rate covering up to 90% project cost for SC, OBC, Women & first-time business founders with family income up to ₹5.00 Lakhs.",
        hi: "अनुसूचित जाति, अन्य पिछड़ा वर्ग, महिला और नए उद्यमियों के लिए ₹5.00 लाख तक की पारिवारिक आय पर 4.0% से 8.0% ब्याज दर पर ₹50 लाख तक की वित्तीय सहायता (90% तक परियोजना लागत कवर)।",
        kn: "SC, OBC, ಮಹಿಳೆಯರು ಮತ್ತು ಮೊದಲ ಬಾರಿಯ ಸಂಸ್ಥಾಪಕರಿಗೆ ₹5.00 ಲಕ್ಷದವರೆಗಿನ ಆದಾಯದ ಮೇಲೆ 4.0% ರಿಂದ 8.0% ಬಡ್ಡಿದರದಲ್ಲಿ ₹50 ಲಕ್ಷದವರೆಗೆ ಆರ್ಥಿಕ ನೆರವು (90% ವರೆಗೆ ವೆಚ್ಚ ಭರಿಸಲಾಗುತ್ತದೆ).",
        ta: "SC, OBC, பெண்கள் மற்றும் புதிய தொழில்முனைவோருக்கு ₹5.00 லட்சம் வரையிலான குடும்ப வருமானத்தில் 4.0% முதல் 8.0% வட்டியில் ₹50 லட்சம் வரை நிதி உதவி (90% வரை திட்டச் செலவு).",
        te: "SC, OBC, మహిళలు మరియు మొదటిసారి వ్యవస్థాపకులకు ₹5.00 లక్షల వరకు ఆదాయంపై 4.0% నుండి 8.0% వడ్డీతో ₹50 లక్షల వరకు ఆర్థిక సహాయం (90% వరకు ప్రాజెక్ట్ వ్యయం).",
        mr: "अनुसूचित जाती, इतर मागासवर्गीय, महिला आणि नवीन संस्थापकांसाठी ₹5.00 लाखांपर्यंतच्या उत्पन्नावर 4.0% ते 8.0% व्याजाने ₹50 लाखांपर्यंत आर्थिक मदत (90% पर्यंत प्रकल्प खर्च).",
        bn: "তফসিলি জাতি, ওবিসি, মহিলা এবং নতুন উদ্যোক্তাদের জন্য ₹৫.০০ লাখ পর্যন্ত পারিবারিক আয়ে ৪.০% থেকে ৮.০% সুদে ₹৫০ লাখ পর্যন্ত আর্থিক সহায়তা (৯০% পর্যন্ত প্রকল্প ব্যয়)।"
      }, lang),
      badge: tText({
        en: "PM-SURAJ & NSFDC ALIGNED",
        hi: "PM-SURAJ एवं NSFDC संरेखित",
        kn: "PM-SURAJ ಮತ್ತು NSFDC ಸಂಯೋಜಿತ",
        ta: "PM-SURAJ & NSFDC ஒருங்கிணைக்கப்பட்டது",
        te: "PM-SURAJ & NSFDC సమలేఖనం",
        mr: "PM-SURAJ आणि NSFDC संरेखित",
        bn: "PM-SURAJ ও NSFDC সংযুক্ত"
      }, lang)
    },
    {
      id: 2,
      image: '/images/slide2_students.webp',
      tagline: tText({
        en: "FROM LOCAL SKILL TO PROFITABLE ENTERPRISE",
        hi: "स्थानीय हुनर से लाभदायक उद्यम की ओर",
        kn: "ಸ್ಥಳೀಯ ಕೌಶಲ್ಯದಿಂದ ಲಾಭದಾಯಕ ಉದ್ಯಮದತ್ತ",
        ta: "உள்ளூர் திறமையிலிருந்து லாபகரமான தொழிலை நோக்கி",
        te: "స్థానిక నైపుణ్యం నుండి లాభదాయకమైన పరిశ్రమ వైపు",
        mr: "स्थानिक कौशल्यातून फायदेशीर उद्योगाकडे",
        bn: "স্থানীয় দক্ষতা থেকে লাভজনক উদ্যোগের দিকে"
      }, lang),
      headline: tText({
        en: "Turn Your Business Dream Into Reality With Zero Collateral Hassles",
        hi: "बिना संपार्श्विक परेशानी के अपने व्यावसायिक सपने को साकार करें",
        kn: "ಶೂನ್ಯ ಮೇಲಾಧಾರ ತೊಂದರೆಗಳೊಂದಿಗೆ ನಿಮ್ಮ ವ್ಯಾಪಾರ ಕನಸನ್ನು ನನಸಾಗಿಸಿ",
        ta: "பிணைய தொந்தரவு இல்லாமல் உங்கள் வணிகக் கனவை நனவாக்குங்கள்",
        te: "ఎటువంటి తాకట్టు లేకుండా మీ వ్యాపార కలను సాకారం చేసుకోండి",
        mr: "कोणत्याही तारणाशिवाय तुमचे व्यावसायिक स्वप्न साकार करा",
        bn: "কোনো বন্ধক ঝামেলা ছাড়াই আপনার ব্যবসায়ের স্বপ্ন বাস্তবায়ন করুন"
      }, lang),
      subheadline: tText({
        en: "Whether starting a tailoring unit, mobile repair lab, solar venture, or food processing unit—get verified through DigiLocker, assess viability with AI, and access subsidized government credit.",
        hi: "चाहे सिलाई इकाई, मोबाइल रिपेयर लैब, सौर ऊर्जा उद्यम, या खाद्य प्रसंस्करण इकाई शुरू करनी हो—डिजिलॉकर से सत्यापित हों, एआई से व्यवहार्यता जांचें और सरकारी ऋण प्राप्त करें।",
        kn: "தையಲ್ ಘಟಕ, ಮೊಬೈಲ್ ರಿಪೇರಿ ಲ್ಯಾಬ್, ಸೌರ ಉದ್ಯಮ ಅಥವಾ ಆಹಾರ ಸಂಸ್ಕರಣಾ ಘಟಕವನ್ನು ಪ್ರಾರಂಭಿಸಲು—ಡಿಜಿಲಾಕರ್ ಮೂಲಕ ಪರಿಶೀಲನೆ ಪಡೆಯಿರಿ ಮತ್ತು ಸಬ್ಸಿಡಿ ಸಾಲವನ್ನು ಪಡೆಯಿರಿ.",
        ta: "தையல் பிரிவு, மொபைல் பழுதுபார்க்கும் ஆய்வகம், சோலார் தொழில் அல்லது உணவு பதப்படுத்தும் பிரிவு தொடங்க—டிஜிலாக்கர் மூலம் சரிபார்க்கப்பட்டு மானிய கடன் பெறுங்கள்.",
        te: "టైలరింగ్ యూనిట్, మొబైల్ రిపేర్ ల్యాబ్, సోలార్ లేదా ఫుడ్ ప్రాసెసింగ్ యూనిట్ ప్రారంభించడానికి—డిజిలాకర్ ద్వారా ధృవీకరించబడి రాయితీ రుణాన్ని పొందండి.",
        mr: "शिलाई युनिट, मोबाईल दुरुस्ती लॅब, सौर ऊर्जा किंवा अन्न प्रक्रिया युनिट सुरू करण्यासाठी—डिजीलॉकरद्वारे सत्यापित व्हा आणि अनुदानित कर्ज मिळवा.",
        bn: "দর্জি ইউনিট, মোবাইল মেরামতের ল্যাব, সৌর উদ্যোগ বা খাদ্য প্রক্রিয়াকরণ ইউনিট শুরু করতে—ডিজিলকারের মাধ্যমে যাচাই করে সরকারি ঋণ পান।"
      }, lang),
      badge: tText({
        en: "100% EXPLAINABLE MATCHING",
        hi: "100% स्पष्टीकरण योग्य मिलान",
        kn: "100% ವಿವರಣಾತ್ಮಕ ಹೊಂದಾಣಿಕೆ",
        ta: "100% விளக்கக்கூடிய பொருத்தம்",
        te: "100% వివరణాత్మక సరిపోలిక",
        mr: "100% स्पष्टीकरणात्मक जुळणी",
        bn: "১০০% ব্যাখ্যামূলক মিল"
      }, lang)
    },
    {
      id: 3,
      image: '/images/slide3_team.jpg',
      tagline: tText({
        en: "ZERO DIRECT REJECTIONS | ACTIVE CHANNEL FINANCE",
        hi: "शून्य प्रत्यक्ष अस्वीकृति | सक्रिय चैनल वित्त",
        kn: "ಶೂನ್ಯ ನೇರ ತಿರಸ್ಕಾರಗಳು | ಸಕ್ರಿಯ ಚಾನಲ್ ಹಣಕಾಸು",
        ta: "பூஜ்ஜிய நேரடி நிராகரிப்புகள் | செயலில் உள்ள சேனல் நிதி",
        te: "సున్నా ప్రత్యక్ష తిరస్కరణలు | చురుకైన ఛానల్ ఫైనాన్స్",
        mr: "शून्य थेट नकार | सक्रिय चॅनेल फायनान्स",
        bn: "শূন্য সরাসরি প্রত্যাখ্যান | সক্রিয় চ্যানেল অর্থায়ন"
      }, lang),
      headline: tText({
        en: "Direct Applications Get Rejected. We Make You 100% Bank Ready.",
        hi: "सीधे आवेदन अक्सर खारिज होते हैं। हम आपको 100% बैंक-तैयार बनाते हैं।",
        kn: "ನೇರ ಅರ್ಜಿಗಳು ತಿರಸ್ಕರಿಸಲ್ಪಡುತ್ತವೆ. ನಾವು ನಿಮ್ಮನ್ನು 100% ಬ್ಯಾಂಕ್-ಸಿದ್ಧಗೊಳಿಸುತ್ತೇವೆ.",
        ta: "நேரடி விண்ணப்பங்கள் நிராகரிக்கப்படுகின்றன. நாங்கள் உங்களை 100% வங்கி தயாராக்குகிறோம்.",
        te: "ప్రత్యక్ష దరఖాస్తులు తిరస్కరించబడతాయి. మేము మిమ్మల్ని 100% బ్యాంక్ సిద్ధం చేస్తాము.",
        mr: "थेट अर्ज फेटाळले जातात. आम्ही तुम्हाला 100% बँक-तयार बनवतो.",
        bn: "সরাসরি আবেদনগুলি প্রত্যাখ্যাত হয়। আমরা আপনাকে ১০০% ব্যাংক-প্রস্তুত করি।"
      }, lang),
      subheadline: tText({
        en: "National corporations route loans exclusively via 100+ Channel Partners (SCAs & Banks). SchemeReady prepares your bankable DPR, verifies compliance, and routes you to high-performing branches.",
        hi: "राष्ट्रीय निगम विशेष रूप से 100+ चैनल पार्टनर्स (एससीए और बैंकों) के माध्यम से ऋण वितरित करते हैं। स्कीम रेडी आपकी बैंक योग्य डीपीआर तैयार करता है और अनुपालन सुनिश्चित करता है।",
        kn: "ರಾಷ್ಟ್ರೀಯ ನಿಗಮಗಳು 100+ ಚಾನಲ್ ಪಾಲುದಾರರ ಮೂಲಕ ಸಾಲಗಳನ್ನು ವಿತರಿಸುತ್ತವೆ. ಸ್ಕೀಮ್ ರೆಡಿ ನಿಮ್ಮ ಡಿಪಿಆರ್ ಸಿದ್ಧಪಡಿಸುತ್ತದೆ ಮತ್ತು ಹೆಚ್ಚಿನ ಕಾರ್ಯಕ್ಷಮತೆಯ ಶಾಖೆಗಳಿಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.",
        ta: "தேசிய நிறுவனங்கள் 100+ சேனல் கூட்டாளர்கள் மூலம் கடன்களை வழங்குகின்றன. ஸ்கீம் ரெடி உங்கள் வங்கிக்குரிய DPR-ஐ தயார் செய்து வழிகாட்டுகிறது.",
        te: "జాతీయ కార్పొరేషన్లు 100+ ఛానల్ భాగస్వాముల ద్వారా రుణాలను అందజేస్తాయి. స్కీమ్ రెడీ మీ DPRను సిద్ధం చేస్తుంది మరియు బ్యాంకులకు రూట్ చేస్తుంది.",
        mr: "राष्ट्रीय महामंडळे 100+ चॅनेल भागीदारांमार्फत कर्जे वितरित करतात. स्कीम रेडी तुमचा बँक डीपिआर तयार करते आणि योग्य शाखेकडे मार्गदर्शन करते.",
        bn: "জাতীয় কর্পোরেশনগুলি ১০০+ চ্যানেল পার্টনারের মাধ্যমে ঋণ বিতরণ করে। স্কিম রেডি আপনার ডিপিআর প্রস্তুত করে এবং সফল শাখায় পৌঁছে দেয়।"
      }, lang),
      badge: tText({
        en: "ACTIVE CHANNEL ROUTING",
        hi: "सक्रिय चैनल रूटिंग",
        kn: "ಸಕ್ರಿಯ ಚಾನಲ್ ರೂಟಿಂಗ್",
        ta: "செயலில் உள்ள சேனல் ரூட்டிங்",
        te: "చురుకైన ఛానల్ రూటింగ్",
        mr: "सक्रिय चॅनेल मार्गनिर्देशन",
        bn: "সক্রিয় চ্যানেল রাউটিং"
      }, lang)
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isPaused) {
      autoplayRef.current = setInterval(() => {
        nextSlide();
      }, 5500);
    }
    return () => clearInterval(autoplayRef.current);
  }, [isPaused, currentSlide]);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (onQuickFind) {
      onQuickFind({
        businessType: quickBusiness,
        location: quickLocation,
        requiredLoanAmount: parseInt(quickAmount) || 150000
      });
    }
  };

  return (
    <div 
      className="relative w-full min-h-[500px] lg:min-h-[580px] bg-slate-950 text-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40 z-10" />
            <img 
              src={slide.image} 
              alt={slide.headline} 
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-7000 ease-out"
            />
          </div>
        );
      })}

      {/* Hero Foreground Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 min-h-[500px] lg:min-h-[580px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Dynamic Hero Slides Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{slides[currentSlide].badge}</span>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
                {slides[currentSlide].tagline}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                {slides[currentSlide].headline}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
                {slides[currentSlide].subheadline}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartOnboarding}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>
                  {tText({
                    en: "Start Smart Onboarding",
                    hi: "स्मार्ट ऑनबोर्डिंग शुरू करें",
                    kn: "ಸ್ಮಾರ್ಟ್ ಆನ್‌ಬೋರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
                    ta: "ஸ்மார்ட் ஆன்போர்டிங் தொடங்கவும்",
                    te: "స్మార్ట్ ఆన్‌బోర్డింగ్ ప్రారంభించండి",
                    mr: "स्मार्ट ऑनबोर्डिंग सुरू करा",
                    bn: "স্মার্ট অনবোর্ডিং শুরু করুন"
                  }, lang)}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreSchemes}
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>
                  {tText({
                    en: "Explore 50+ Schemes",
                    hi: "50+ योजनाएं देखें",
                    kn: "50+ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
                    ta: "50+ திட்டங்களை ஆராயுங்கள்",
                    te: "50+ పథకాలను అన్వేషించండి",
                    mr: "50+ योजना एक्सप्लोर करा",
                    bn: "৫০+ স্কিম অন্বেষণ করুন"
                  }, lang)}
                </span>
              </button>
            </div>

            {/* Compliance Guarantee Badges */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {tText({
                    en: "Zero Collateral up to ₹1.5L",
                    hi: "₹1.5L तक शून्य संपार्श्विक",
                    kn: "₹1.5 ಲಕ್ಷದವರೆಗೆ ಶೂನ್ಯ ಮೇಲಾಧಾರ",
                    ta: "₹1.5L வரை பிணையில்லாதது",
                    te: "₹1.5L వరకు తాకట్టు అవసరం లేదు",
                    mr: "₹1.5 लाखांपर्यंत शून्य तारण",
                    bn: "₹১.৫ লাখ পর্যন্ত জামানতমুক্ত"
                  }, lang)}
                </span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {tText({
                    en: "4.0% - 5.0% Subsidized ROI",
                    hi: "4.0% - 5.0% रियायती ब्याज",
                    kn: "4.0% - 5.0% ರಿಯಾಯಿತಿ ಬಡ್ಡಿದರ",
                    ta: "4.0% - 5.0% மானிய வட்டி",
                    te: "4.0% - 5.0% రాయితీ వడ్డీ",
                    mr: "4.0% - 5.0% सवलतीचे व्याज",
                    bn: "৪.০% - ৫.০% ভর্তুকিযুক্ত সুদ"
                  }, lang)}
                </span>
              </span>
            </div>
          </div>

          {/* Right Column: Embedded Quick Eligibility & Scheme Finder Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-emerald-500/30 shadow-2xl text-slate-900 relative">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                {tText({
                  en: "Instant Fit Calculator",
                  hi: "त्वरित पात्रता कैलकुलेटर",
                  kn: "ತ್ವರಿತ ಫಿಟ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
                  ta: "உடனடி தகுதி கால்குலேட்டர்",
                  te: "తక్షణ అర్హత కాలిక్యులేటర్",
                  mr: "त्वरित पात्रता कॅल्क्युलेटर",
                  bn: "তাত্ক্ষণিক যোগ্যতা ক্যালকুলেটর"
                }, lang)}
              </div>

              <div className="space-y-1 mb-5 text-left">
                <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {tText({
                      en: "SchemeReady Eligibility Check",
                      hi: "स्कीम रेडी पात्रता जांच",
                      kn: "ಸ್ಕೀಮ್ ರೆಡಿ ಅರ್ಹತಾ ಪರಿಶೀಲನೆ",
                      ta: "ஸ்கீம் ரெடி தகுதி சரிபார்ப்பு",
                      te: "స్కీమ్ రెడీ అర్హత తనిఖీ",
                      mr: "स्कीम रेडी पात्रता पडताळणी",
                      bn: "স্কিম রেডি যোগ্যতা পরীক্ষা"
                    }, lang)}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {tText({
                    en: "Find Your Concessional Scheme",
                    hi: "अपनी रियायती योजना खोजें",
                    kn: "ನಿಮ್ಮ ರಿಯಾಯಿತಿ ಯೋಜನೆಯನ್ನು ಹುಡುಕಿ",
                    ta: "உங்கள் சலுகைத் திட்டத்தைக் கண்டறியவும்",
                    te: "మీ రాయితీ పథకాన్ని కనుగొనండి",
                    mr: "तुमची सवलतीची योजना शोधा",
                    bn: "আপনার রেয়াতযোগ্য স্কিম খুঁজুন"
                  }, lang)}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {tText({
                    en: "Enter your business type & loan requirement to see guaranteed matching government schemes.",
                    hi: "गारंटीकृत सरकारी योजनाओं को देखने के लिए अपना व्यवसाय प्रकार और ऋण आवश्यकता दर्ज करें।",
                    kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ನೋಡಲು ನಿಮ್ಮ ವ್ಯಾಪಾರ ಪ್ರಕಾರ ಮತ್ತು ಸಾಲದ ಅಗತ್ಯವನ್ನು ನಮೂದಿಸಿ.",
                    ta: "பொருந்தும் அரசுத் திட்டங்களைக் காண உங்கள் வணிக வகை மற்றும் கடன் தேவையை உள்ளிடவும்.",
                    te: "సరిపోలే ప్రభుత్వ పథకాలను చూడటానికి మీ వ్యాపార రకం మరియు రుణ అవసరాన్ని నమోదు చేయండి.",
                    mr: "सरकारी योजना पाहण्यासाठी तुमचा व्यवसाय प्रकार आणि कर्जाची आवश्यकता प्रविष्ट करा.",
                    bn: "উপযুক্ত সরকারি স্কিমগুলি দেখতে আপনার ব্যবসায়ের ধরন এবং ঋণের প্রয়োজনীয়তা লিখুন।"
                  }, lang)}
                </p>
              </div>

              <form onSubmit={handleQuickSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                {/* Business Type */}
                <div className="space-y-1 text-left">
                  <label className="block text-[11px] text-slate-600 font-bold">
                    {tText({
                      en: "What business do you want to start?",
                      hi: "आप कौन सा व्यवसाय शुरू करना चाहते हैं?",
                      kn: "ನೀವು ಯಾವ ವ್ಯವಹಾರವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಬಯಸುತ್ತೀರಿ?",
                      ta: "நீங்கள் எந்த வணிகத்தைத் தொடங்க விரும்புகிறீர்கள்?",
                      te: "మీరు ఏ వ్యాపారాన్ని ప్రారంభించాలనుకుంటున్నారు?",
                      mr: "तुम्हाला कोणता व्यवसाय सुरू करायचा आहे?",
                      bn: "আপনি কোন ব্যবসা শুরু করতে চান?"
                    }, lang)}
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={quickBusiness}
                      onChange={(e) => setQuickBusiness(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-500 cursor-pointer"
                    >
                      <option value="tailoring">Tailoring & Garment Making (₹1.2L - ₹2.5L)</option>
                      <option value="mobile repair">Mobile Display & Chip Repair Lab (₹1.5L - ₹3L)</option>
                      <option value="grocery">Grocery / Kirana / Provision Store (₹1L - ₹5L)</option>
                      <option value="ev transport">Electric Auto / Eco-Transport (₹3L - ₹5L)</option>
                      <option value="food processing">Food Processing & Spice Grinding (₹2L - ₹10L)</option>
                      <option value="beauty salon">Beauty Salon & Wellness Studio (₹1.5L - ₹4L)</option>
                      <option value="light manufacturing">Small Manufacturing / CNC Workshop (₹5L - ₹25L)</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1 text-left">
                  <label className="block text-[11px] text-slate-600 font-bold">
                    {tText({
                      en: "Business Location (District / State)",
                      hi: "व्यवसाय का स्थान (जिला / राज्य)",
                      kn: "ವ್ಯಾಪಾರದ ಸ್ಥಳ (ಜಿಲ್ಲೆ / ರಾಜ್ಯ)",
                      ta: "வணிக இடம் (மாவட்டம் / மாநிலம்)",
                      te: "వ్యాపార ప్రదేశం (జిల్లా / రాష్ట్రం)",
                      mr: "व्यवसायाचे स्थान (जिल्हा / राज्य)",
                      bn: "ব্যবসার অবস্থান (জেলা / রাজ্য)"
                    }, lang)}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={quickLocation}
                      onChange={(e) => setQuickLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-500 cursor-pointer"
                    >
                      <option value="Bengaluru">Bengaluru (Karnataka - SCA Active)</option>
                      <option value="Mumbai">Mumbai (Maharashtra - MPBCDC Active)</option>
                      <option value="Pune">Pune (Maharashtra - MPBCDC Active)</option>
                      <option value="Lucknow">Lucknow (Uttar Pradesh - UPSCDC Active)</option>
                      <option value="Hyderabad">Hyderabad (Telangana - TSSCDC Active)</option>
                      <option value="Chennai">Chennai (Tamil Nadu - TAHDCO Active)</option>
                      <option value="Delhi">Delhi NCR (DSCFDC Active)</option>
                    </select>
                  </div>
                </div>

                {/* Estimated Loan Amount */}
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600 font-bold">
                      {tText({
                        en: "Estimated Loan Needed",
                        hi: "अनुमानित ऋण आवश्यकता",
                        kn: "ಅಂದಾಜು ಸಾಲದ ಅಗತ್ಯತೆ",
                        ta: "மதிப்பிடப்பட்ட கடன் தேவை",
                        te: "అంచనా వేసిన రుణ అవసరం",
                        mr: "अंदाजे कर्जाची आवश्यकता",
                        bn: "আনুমানিক ঋণের প্রয়োজন"
                      }, lang)}
                    </span>
                    <span className="font-mono font-black text-emerald-700 text-xs">
                      ₹{(parseInt(quickAmount) / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="25000"
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹50,000 (Micro)</span>
                    <span>₹5,00,000</span>
                    <span>₹10,00,000 (Term)</span>
                  </div>
                </div>

                {/* Instant Match Submit */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {tText({
                      en: "Check Instant Matching Schemes",
                      hi: "तत्काल मिलान वाली योजनाएं जांचें",
                      kn: "ತ್ವರಿತ ಹೊಂದಾಣಿಕೆಯ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
                      ta: "பொருந்தும் திட்டங்களை உடனடியாக சரிபார்க்கவும்",
                      te: "సరిపోలే పథకాలను తక్షణమే తనిఖీ చేయండి",
                      mr: "त्वरित जुळणाऱ्या योजना तपासा",
                      bn: "তাত্ক্ষণিক উপযুক্ত স্কিমগুলি পরীক্ষা করুন"
                    }, lang)}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Income ≤ ₹5L Eligible</span>
                </span>
                <span className="text-emerald-700 font-bold font-mono">
                  Up to 90% Govt Funding
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Carousel Dots & Controls */}
      <div className="absolute z-30 bottom-4 left-4 right-4 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
          <span className="text-[10px] font-mono text-slate-400 pl-1">
            0{currentSlide + 1} / 0{slides.length}
          </span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={prevSlide}
            className="w-9 h-9 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:text-emerald-400 transition-all shadow-md active:scale-90 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="w-9 h-9 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:text-emerald-400 transition-all shadow-md active:scale-90 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
