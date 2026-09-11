import React, { useState } from 'react';
import SihNavbar from '../components/sih/SihNavbar';
import HeroCarousel from '../components/sih/HeroCarousel';
import StatisticsSection from '../components/sih/StatisticsSection';
import AboutSection from '../components/sih/AboutSection';
import ThemesSection from '../components/sih/ThemesSection';
import ProblemStatementsSection from '../components/sih/ProblemStatementsSection';
import ProcessTimeline from '../components/sih/ProcessTimeline';
import WhyParticipateSection from '../components/sih/WhyParticipateSection';
import ImpactSection from '../components/sih/ImpactSection';
import EventTimeline from '../components/sih/EventTimeline';
import StoriesSection from '../components/sih/StoriesSection';
import PartnerLogos from '../components/sih/PartnerLogos';
import FAQAccordion from '../components/sih/FAQAccordion';
import FinalCTA from '../components/sih/FinalCTA';
import Footer from '../components/sih/Footer';
import SihLoginModal from '../components/sih/SihLoginModal';
import confetti from 'canvas-confetti';

export default function SihPortal({ onSwitchToSchemeReady }) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedThemeFilter, setSelectedThemeFilter] = useState('All');
  const [userNotification, setUserNotification] = useState(null);

  const handleOpenLogin = () => {
    setLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setLoginModalOpen(true);
  };

  const handleSelectTheme = (themeName) => {
    setSelectedThemeFilter(themeName);
    const element = document.getElementById('problems');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyProblem = (problem) => {
    setUserNotification(`Initiating Team Nomination for ${problem.id}: ${problem.title}`);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setLoginModalOpen(true);
    }, 600);
  };

  const handleLoginSuccess = (userData) => {
    setUserNotification(`Welcome back, ${userData.name}! Logged into SIH 2026 Sovereign Portal.`);
    setTimeout(() => {
      setUserNotification(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* Toast Notification Banner if any */}
      {userNotification && (
        <div className="fixed top-16 right-4 z-50 bg-slate-950 text-white border border-orange-500/40 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center space-x-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{userNotification}</span>
        </div>
      )}

      {/* Sticky National Header */}
      <SihNavbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onSwitchToSchemeReady={onSwitchToSchemeReady}
      />

      {/* Full-Screen 90-100vh Hero Carousel (3 Slides) */}
      <HeroCarousel onOpenRegister={handleOpenRegister} />

      {/* Animated Counter Statistics */}
      <StatisticsSection />

      {/* About Section */}
      <AboutSection onExploreProblems={() => {
        const el = document.getElementById('problems');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Innovation Themes Grid */}
      <ThemesSection onSelectTheme={handleSelectTheme} />

      {/* Problem Statements Section (Inspired by sih.gov.in/sih2026PS) */}
      <ProblemStatementsSection
        initialTheme={selectedThemeFilter}
        onApplyProblem={handleApplyProblem}
      />

      {/* 6-Phase Process Timeline */}
      <ProcessTimeline />

      {/* Why Participate Section */}
      <WhyParticipateSection />

      {/* Large Dark Impact Metrics Section */}
      <ImpactSection />

      {/* Upcoming Events Calendar */}
      <EventTimeline />

      {/* Innovation Success Stories */}
      <StoriesSection onOpenSchemeReady={onSwitchToSchemeReady} />

      {/* Partners / Ministries Logo Wall */}
      <PartnerLogos />

      {/* FAQ Accordion */}
      <FAQAccordion />

      {/* Final Dramatic CTA */}
      <FinalCTA
        onOpenRegister={handleOpenRegister}
        onExploreProblems={() => {
          const el = document.getElementById('problems');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* National Portal Footer */}
      <Footer
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onSwitchToSchemeReady={onSwitchToSchemeReady}
      />

      {/* Single Sign-On / Registration Modal */}
      <SihLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}