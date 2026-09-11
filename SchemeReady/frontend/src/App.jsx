import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ConversationalOnboarding from './components/ConversationalOnboarding';
import BeneficiaryProfileView from './components/BeneficiaryProfileView';
import ExplainableSchemeResults from './components/ExplainableSchemeResults';
import ReadinessDashboard from './components/ReadinessDashboard';
import BusinessPlanBuilder from './components/BusinessPlanBuilder';
import DocumentChecklist from './components/DocumentChecklist';
import PartnerRouting from './components/PartnerRouting';
import EmiSimulator from './components/EmiSimulator';
import ApplicationPack from './components/ApplicationPack';
import AdminPortal from './components/AdminPortal';
import { AuthProvider, useAuth } from './auth/AuthContext';
import AuthPanel from './auth/AuthPanel';
import confetti from 'canvas-confetti';

/**
 * Views reachable without a session (R5.8). Everything else — readiness, checklist, partners,
 * application pack, admin — is replaced by the login form, and crucially the replacement happens
 * *before* the view mounts, so no protected request is ever issued for a view the user may not see.
 */
const ANONYMOUS_VIEWS = ['onboarding', 'schemes', 'emi', 'businessPlan'];

/** R5.9 — the admin portal needs the Admin role, not merely a session. */
const ADMIN_VIEWS = ['admin'];

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

function AppShell() {
  const { isAuthenticated, isAdmin, restoring, authMessage } = useAuth();

  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('onboarding');
  const [authPanelNotice, setAuthPanelNotice] = useState(null);

  // Realistic default profile (Ravi Kumar - Persona from PRD & SIH guidelines)
  const [profile, setProfile] = useState({
    id: 'APP-2026-BLR-0941',
    fullName: 'Ravi Kumar',
    parentsName: 'Shri M. Venkataram & Smt. Lakshmi',
    gender: 'Male',
    businessType: 'mobile repair',
    businessScale: 'Micro (Up to ₹5 Lakhs)',
    projectDescription: 'Smartphone display repair, IC soldering, micro-component replacement lab with automated diagnostics and diagnostic microscopes.',
    location: 'Bengaluru',
    state: 'Karnataka',
    estimatedProjectCost: 180000,
    annualFamilyIncome: 360000,
    householdAnnualIncome: 360000,
    cibilScore: 745,
    userType: 'new_entrepreneur',
    category: 'SC',
    hasCasteCertificate: false, // 72% readiness default (remediated to true upon upload / DigiLocker)
    casteCertificateNo: 'RD0038921029-SC',
    digilockerVerified: false,
    hasIncomeCertificate: true,
    hasFiledItr: true,
    itrAckNumber: 'ITR-V-2025-8891042',
    tenthMarksPercentage: 84.5,
    tenthSchoolName: 'Government High School, Malleshwaram',
    twelfthMarksPercentage: 79.2,
    twelfthSchoolName: 'Government PU College, Rajajinagar',
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
      parentsName: 'Shri M. Venkataram & Smt. Lakshmi',
      gender: 'Male',
      businessType: 'mobile repair',
      businessScale: 'Micro (Up to ₹5 Lakhs)',
      projectDescription: 'Smartphone display repair, IC soldering, micro-component replacement lab with automated diagnostics and diagnostic microscopes.',
      location: 'Bengaluru',
      state: 'Karnataka',
      estimatedProjectCost: 180000,
      annualFamilyIncome: 360000,
      householdAnnualIncome: 360000,
      cibilScore: 745,
      userType: 'new_entrepreneur',
      category: 'SC',
      hasCasteCertificate: false,
      casteCertificateNo: 'RD0038921029-SC',
      digilockerVerified: false,
      hasIncomeCertificate: true,
      hasFiledItr: true,
      itrAckNumber: 'ITR-V-2025-8891042',
      tenthMarksPercentage: 84.5,
      tenthSchoolName: 'Government High School, Malleshwaram',
      twelfthMarksPercentage: 79.2,
      twelfthSchoolName: 'Government PU College, Rajajinagar',
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

  /**
   * Resolves the view actually rendered. Two substitutions, both required:
   *
   *  * no session and a protected target → the login form (R5.8);
   *  * a session without Admin and an admin target → the readiness dashboard (R5.9).
   */
  const requiresSession = !ANONYMOUS_VIEWS.includes(activeTab);
  const requiresAdmin = ADMIN_VIEWS.includes(activeTab);

  const showAuthPanel = requiresSession && !isAuthenticated;

  const effectiveTab = (() => {
    // 'login' is the target of the header's sign-in control; once a session exists it has
    // nothing to show, so it lands on the readiness dashboard.
    if (activeTab === 'login') return 'readiness';
    if (requiresAdmin && isAuthenticated && !isAdmin) return 'readiness';
    return activeTab;
  })();

  const navigate = (tab) => {
    if (tab === 'login' || ANONYMOUS_VIEWS.includes(tab) || isAuthenticated) {
      setAuthPanelNotice(null);
    } else {
      setAuthPanelNotice('Please sign in to open this section — your documents and dossier are private to your account.');
    }
    setActiveTab(tab);
  };

  // R5.4 — nothing that needs a session renders until the single refresh call has resolved.
  if (restoring) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600">Restoring your session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        lang={lang}
        setLang={setLang}
        activeTab={activeTab}
        setActiveTab={navigate}
        onLoadPersona={handleLoadPersona}
        readinessScore={readinessScore}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {showAuthPanel ? (
          <AuthPanel notice={authPanelNotice || authMessage} />
        ) : (
          <>
            {effectiveTab === 'onboarding' && (
              <ConversationalOnboarding
                lang={lang}
                profile={profile}
                setProfile={setProfile}
                onProceedToMatching={() => navigate('schemes')}
              />
            )}

            {effectiveTab === 'profile' && (
              <BeneficiaryProfileView
                profile={profile}
                setProfile={setProfile}
                onSaveDone={() => navigate('schemes')}
              />
            )}

            {effectiveTab === 'schemes' && (
              <ExplainableSchemeResults
                lang={lang}
                profile={profile}
                selectedScheme={selectedScheme}
                setSelectedScheme={setSelectedScheme}
                onProceedToReadiness={(s) => {
                  setSelectedScheme(s);
                  navigate('readiness');
                }}
              />
            )}

            {effectiveTab === 'readiness' && (
              <ReadinessDashboard
                lang={lang}
                profile={profile}
                setProfile={setProfile}
                onProceedToBusinessPlan={() => navigate('businessPlan')}
              />
            )}

            {effectiveTab === 'businessPlan' && (
              <BusinessPlanBuilder
                lang={lang}
                profile={profile}
                onProceedToPartners={() => navigate('partners')}
              />
            )}

            {effectiveTab === 'checklist' && (
              <DocumentChecklist
                lang={lang}
                profile={profile}
                setProfile={setProfile}
                selectedScheme={selectedScheme}
                onProceedToPack={() => navigate('pack')}
              />
            )}

            {effectiveTab === 'partners' && (
              <PartnerRouting
                lang={lang}
                profile={profile}
                selectedScheme={selectedScheme}
                onSelectPartner={(p) => setNearestPartner(p)}
                onProceedToEmi={() => navigate('emi')}
              />
            )}

            {effectiveTab === 'emi' && (
              <EmiSimulator
                lang={lang}
                profile={profile}
                selectedScheme={selectedScheme}
                onProceedToPack={() => navigate('pack')}
              />
            )}

            {effectiveTab === 'pack' && (
              <ApplicationPack
                lang={lang}
                profile={profile}
                selectedScheme={selectedScheme}
                nearestPartner={nearestPartner}
              />
            )}

            {effectiveTab === 'admin' && isAdmin && (
              <AdminPortal lang={lang} />
            )}
          </>
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
            {isAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={() => navigate('admin')}
                  className="text-slate-600 hover:text-slate-900 font-medium"
                >
                  Admin Console
                </button>
              </>
            )}
            <span>•</span>
            <span>Local Database: PostgreSQL 16</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
