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

export default function LandingHero({ onStartOnboarding, onExploreSchemes, onQuickFind }) {
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
      tagline: 'MINISTRY OF SOCIAL JUSTICE & MSME | NATIONAL CONCESSIONAL CREDIT',
      headline: 'Empowering India\'s Grassroots Entrepreneurs With Concessional Capital',
      subheadline: 'Financial assistance up to ₹50 Lakhs at 4.0% to 8.0% interest rate covering up to 90% project cost for SC, OBC, Women & first-time business founders with family income up to ₹5.00 Lakhs.',
      badge: 'PM-SURAJ & NSFDC ALIGNED'
    },
    {
      id: 2,
      image: '/images/slide2_students.webp',
      tagline: 'FROM LOCAL SKILL TO PROFITABLE ENTERPRISE',
      headline: 'Turn Your Business Dream Into Reality With Zero Collateral Hassles',
      subheadline: 'Whether starting a tailoring unit, mobile repair lab, solar venture, or food processing unit—get verified through DigiLocker, assess viability with AI, and access subsidized government credit.',
      badge: '100% EXPLAINABLE MATCHING'
    },
    {
      id: 3,
      image: '/images/slide3_team.jpg',
      tagline: 'ZERO DIRECT REJECTIONS | ACTIVE CHANNEL FINANCE',
      headline: 'Direct Applications Get Rejected. We Make You 100% Bank Ready.',
      subheadline: 'National corporations route loans exclusively via 100+ Channel Partners (SCAs & Banks). SchemeReady prepares your bankable DPR, verifies compliance, and routes you to high-performing branches.',
      badge: 'ACTIVE CHANNEL ROUTING'
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
      {/* Background Slides with Ken Burns Effect */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out ${
                isActive ? 'scale-110' : 'scale-100'
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Deep Navy/Emerald Vignette Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/80" />
            <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />
          </div>
        );
      })}

      {/* Floating Gradient Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none z-20" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none z-20" />

      {/* Hero Content Container */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14 flex flex-col justify-center min-h-[500px] lg:min-h-[580px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Mission Narrative & CTAs */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* National Tagline Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider text-emerald-300 uppercase font-mono">
                {slides[currentSlide].tagline}
              </span>
            </div>

            {/* Dynamic Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.2] drop-shadow-md">
              {slides[currentSlide].headline}
            </h1>

            {/* Sub-headline */}
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-2xl drop-shadow-sm">
              {slides[currentSlide].subheadline}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartOnboarding}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Start Smart Onboarding (2 Min)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={onExploreSchemes}
                className="inline-flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-md transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Explore All 6 Schemes</span>
              </button>
            </div>

            {/* Micro Highlights Pill Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>4%–8% Rates</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Up to ₹50 Lakhs</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>DigiLocker Fast</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>0% Overdue SCA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Quick Eligibility & Scheme Finder Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-emerald-500/30 shadow-2xl text-slate-900 relative">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Instant Fit Calculator
              </div>

              <div className="space-y-1 mb-5">
                <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>SchemeReady Eligibility Check</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Find Your Concessional Scheme
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Enter your business type & loan requirement to see guaranteed matching government schemes.
                </p>
              </div>

              <form onSubmit={handleQuickSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                {/* Business Type */}
                <div className="space-y-1 text-left">
                  <label className="block text-[11px] text-slate-600 font-bold">What business do you want to start?</label>
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
                  <label className="block text-[11px] text-slate-600 font-bold">Business Location (District / State)</label>
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
                    <span className="text-slate-600 font-bold">Estimated Loan Needed</span>
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
                  <span>Check Instant Matching Schemes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Income &le; ₹5L Eligible</span>
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
