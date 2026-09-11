import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Compass, 
  Code2, 
  Cpu, 
  ShieldAlert, 
  Award,
  ChevronDown
} from 'lucide-react';

export default function HeroCarousel({ onOpenRegister }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);

  const slides = [
    {
      id: 1,
      image: '/images/slide1_summit.jpg',
      tagline: 'BHARAT MANDAPAM AI SUMMIT | NATIONAL IMPACT',
      headline: 'Innovate. Solve. Transform.',
      description: 'World\'s biggest open innovation hackathon empowering 10 Lakh+ student developers, creators, and engineers to build sovereign technological breakthroughs for the Government of India.',
      primaryCta: 'Explore Problem Statements',
      primaryLink: '#problems',
      secondaryCta: 'Register Now',
      secondaryAction: onOpenRegister,
      accentColor: 'from-orange-500 to-amber-500',
      badge: 'SIH 2026 OFFICIAL'
    },
    {
      id: 2,
      image: '/images/slide2_students.webp',
      tagline: 'EMPOWERING YOUNG LEADERS | DIRECT INTERACTION',
      headline: 'India\'s Young Minds. Real-World Solutions.',
      description: 'Engage directly with national leadership, premier research labs, and industry mentors to transform disruptive prototypes into scalable startups and public sector deployments.',
      primaryCta: 'Explore Themes',
      primaryLink: '#themes',
      secondaryCta: 'Get Started',
      secondaryAction: onOpenRegister,
      accentColor: 'from-emerald-400 to-teal-500',
      badge: 'STUDENT INNOVATION'
    },
    {
      id: 3,
      image: '/images/slide3_team.jpg',
      tagline: '50+ UNION MINISTRIES & DEPARTMENTS',
      headline: 'Build Solutions That Matter.',
      description: '58 Hardware and 182 Software challenges submitted by 50+ Union Ministries, Defense Organizations, and State Governments awaiting your breakthrough code.',
      primaryCta: 'View Challenges',
      primaryLink: '#problems',
      secondaryCta: 'Join the Innovation',
      secondaryAction: onOpenRegister,
      accentColor: 'from-blue-400 to-indigo-500',
      badge: 'NATIONWIDE DEPLOYMENT'
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
      }, 5000);
    }
    return () => clearInterval(autoplayRef.current);
  }, [isPaused, currentSlide]);

  return (
    <section 
      id="home"
      className="relative w-full h-[92vh] min-h-[620px] max-h-[960px] overflow-hidden bg-slate-950 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel with Ken Burns Zoom */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Background Image with Slow Zoom */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Futuristic Multi-Stop Gradient Overlay (Dark Navy + Vignette) */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
            
            {/* Tech grid overlay */}
            <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
          </div>
        );
      })}

      {/* Floating Animated Tech Shapes & Glow Blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none animate-float z-20" />
      <div className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-float-reverse z-20" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow z-20" />

      {/* Slide Content Layer */}
      <div className="relative z-30 max-w-7xl mx-auto h-full px-4 sm:px-6 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-extrabold tracking-widest text-amber-300 uppercase">
              {slides[currentSlide].tagline}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            <span className="block drop-shadow-md">
              {slides[currentSlide].headline}
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl drop-shadow-sm">
            {slides[currentSlide].description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={slides[currentSlide].primaryLink}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-xl shadow-orange-500/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <span>{slides[currentSlide].primaryCta}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </a>

            <button
              onClick={slides[currentSlide].secondaryAction}
              className="inline-flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-md shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <span>{slides[currentSlide].secondaryCta}</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Mini Trust Highlights */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center space-x-1.5">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>182 Software PS</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>58 Hardware PS</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-orange-400" />
              <span>₹1.5+ Cr Total Grants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute z-30 bottom-8 left-4 right-4 max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 pointer-events-none">
        {/* Pagination Dots */}
        <div className="flex items-center space-x-2.5 pointer-events-auto bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${idx === currentSlide ? 'w-8 bg-gradient-to-r from-orange-500 to-amber-500' : 'w-2 bg-white/30 hover:bg-white/60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
          <span className="text-[10px] font-mono text-slate-400 pl-1">
            0{currentSlide + 1} / 0{slides.length}
          </span>
        </div>

        {/* Arrow Buttons */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:text-orange-400 transition-all shadow-md active:scale-90 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:text-orange-400 transition-all shadow-md active:scale-90 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scroll Down Bounce Indicator */}
      <div className="absolute z-30 bottom-2 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center pointer-events-none text-slate-400">
        <span className="text-[9px] uppercase tracking-widest font-mono text-slate-400 mb-0.5">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-scroll-bounce text-orange-400" />
      </div>
    </section>
  );
}