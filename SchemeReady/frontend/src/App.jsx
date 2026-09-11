import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ConversationalOnboarding from './components/ConversationalOnboarding';
import ExplainableSchemeResults from './components/ExplainableSchemeResults';
import ReadinessDashboard from './components/ReadinessDashboard';
import BusinessPlanBuilder from './components/BusinessPlanBuilder';
import DocumentChecklist from './components/DocumentChecklist';
import PartnerRouting from './components/PartnerRouting';
import EmiSimulator from './components/EmiSimulator';
import ApplicationPack from './components/ApplicationPack';
import AdminPortal from './components/AdminPortal';
import { translations } from './translations';
import confetti from 'canvas-confetti';

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('onboarding');

  // Realistic default profile (Ravi Kumar - Persona from PRD)
  const [profile, setProfile] = useState({
    id: 'APP-2026-BLR-0941',
    fullName: 'Ravi Kumar',
    businessType: 'mobile repair',
    location: 'Bengaluru',
    estimatedProjectCost: 180000,
    annualFamilyIncome: 360000,
    userType: 'new_entrepreneur',
    category: 'SC',
    hasCasteCertificate: false, // 72% readiness default
    hasIncomeCertificate: true,
    requiredLoanAmount: 150000,
    supportPreference: 'offline',
    preferredLanguage: 'kn',
    age: 28,
    uploadedDocs: ['Aadhaar/KYC', 'Income certificate']
  });

  const [selectedScheme, setSelectedScheme] = useState({
    schemeId: 'NSFDC-MCS-01',
    schemeName: 'Micro Credit Scheme (MCS)',
    schemeType: 'Micro Credit',
    interestRate: 5.0,
    maximumTenureMonths: 36,
    moratoriumMonths: 3,
    maxLoanEligible: 150000,
    sourceDocument: 'NSFDC Operational Guidelines 2024-26, Clause 4.2',
    lastVerifiedDate: '2026-09-10T00:00:00Z'
  });

  const [nearestPartner, setNearestPartner] = useState({
    institutionName: 'Karnataka State Dr. B.R. Ambedkar Development Corporation (SCA)',
    district: 'Bengaluru',
    distanceKm: 4.2,
    contactNumber: '+91 80 2286 4521 / +91 94808 12345',
    contactPerson: 'Shri M. Nagaraj (District Manager)',
    address: 'No. 9 & 10, Vishweshwaraiah Towers, 9th Floor, Dr. Ambedkar Veedhi, Bengaluru - 560001',
    applicationMode: 'Offline',
    lastVerifiedDate: '2026-09-10T00:00:00Z'
  });

  // Calculate dynamic readiness score
  const readinessScore = profile.hasCasteCertificate
    ? (profile.uploadedDocs.includes('Business quotation') ? 100 : 92)
    : 72;

  const handleLoadPersona = () => {
    setProfile({
      id: 'APP-2026-BLR-0941',
      fullName: 'Ravi Kumar',
      businessType: 'mobile repair',
      location: 'Bengaluru',
      estimatedProjectCost: 180000,
      annualFamilyIncome: 360000,
      userType: 'new_entrepreneur',
      category: 'SC',
      hasCasteCertificate: false,
      hasIncomeCertificate: true,
      requiredLoanAmount: 150000,
      supportPreference: 'offline',
      preferredLanguage: 'kn',
      age: 28,
      uploadedDocs: ['Aadhaar/KYC', 'Income certificate']
    });
    setLang('kn'); // Ravi selects Kannada as his preferred language per PRD!
    setActiveTab('onboarding');
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.2 } });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoadPersona={handleLoadPersona}
        readinessScore={readinessScore}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'onboarding' && (
          <ConversationalOnboarding
            lang={lang}
            profile={profile}
            setProfile={setProfile}
            onProceedToMatching={() => setActiveTab('schemes')}
          />
        )}

        {activeTab === 'schemes' && (
          <ExplainableSchemeResults
            lang={lang}
            profile={profile}
            selectedScheme={selectedScheme}
            setSelectedScheme={setSelectedScheme}
            onProceedToReadiness={(s) => {
              setSelectedScheme(s);
              setActiveTab('readiness');
            }}
          />
        )}

        {activeTab === 'readiness' && (
          <ReadinessDashboard
            lang={lang}
            profile={profile}
            setProfile={setProfile}
            onProceedToBusinessPlan={() => setActiveTab('businessPlan')}
          />
        )}

        {activeTab === 'businessPlan' && (
          <BusinessPlanBuilder
            lang={lang}
            profile={profile}
            onProceedToPartners={() => setActiveTab('partners')}
          />
        )}

        {activeTab === 'checklist' && (
          <DocumentChecklist
            lang={lang}
            profile={profile}
            setProfile={setProfile}
            selectedScheme={selectedScheme}
            onProceedToPack={() => setActiveTab('pack')}
          />
        )}

        {activeTab === 'partners' && (
          <PartnerRouting
            lang={lang}
            profile={profile}
            selectedScheme={selectedScheme}
            onSelectPartner={(p) => setNearestPartner(p)}
            onProceedToEmi={() => setActiveTab('emi')}
          />
        )}

        {activeTab === 'emi' && (
          <EmiSimulator
            lang={lang}
            profile={profile}
            selectedScheme={selectedScheme}
            onProceedToPack={() => setActiveTab('pack')}
          />
        )}

        {activeTab === 'pack' && (
          <ApplicationPack
            lang={lang}
            profile={profile}
            selectedScheme={selectedScheme}
            nearestPartner={nearestPartner}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal lang={lang} />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-900">SchemeReady (Udyam Saarthi AI)</span> — National SC/ST Entrepreneur Readiness Platform
            <p className="text-[11px] text-slate-400 mt-0.5">
              Aligned with NSFDC Operational Guidelines &amp; PM-SURAJ Ecosystem | Data Verified: September 2026
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="http://localhost:5000/swagger"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 font-semibold hover:underline"
            >
              ASP.NET Core Swagger Docs
            </a>
            <span>•</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Admin Console
            </button>
            <span>•</span>
            <span>Local Database: MS SQL Server Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
