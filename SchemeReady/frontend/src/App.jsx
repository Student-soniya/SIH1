import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConversationalOnboarding from './components/ConversationalOnboarding';
import AIVoiceAssistant from './components/AIVoiceAssistant';
import BeneficiaryProfileView from './components/BeneficiaryProfileView';
import ExplainableSchemeResults from './components/ExplainableSchemeResults';
import ReadinessDashboard from './components/ReadinessDashboard';
import BusinessPlanBuilder from './components/BusinessPlanBuilder';
import DocumentChecklist from './components/DocumentChecklist';
import PartnerRouting from './components/PartnerRouting';
import EmiSimulator from './components/EmiSimulator';
import ApplicationPack from './components/ApplicationPack';
import AdminPortal from './components/AdminPortal';
import EntrepreneurLanding from './pages/EntrepreneurLanding';
import GovUtilityHeader from './auth/GovUtilityHeader';
import AuthPortal from './auth/AuthPortal';
import { AuthProvider, useAuth } from './auth/AuthContext';
import AuthPanel from './auth/AuthPanel';
import confetti from 'canvas-confetti';

const ANONYMOUS_VIEWS = ['onboarding', 'schemes', 'emi', 'businessPlan'];
const ADMIN_VIEWS = ['admin'];

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

function AppShell() {
  const [portalView, setPortalView] = useState('landing');
  const { isAuthenticated, isAdmin, restoring, authMessage } = useAuth();
  const [lang, setLang] = useState('en');
  const [fontSize, setFontSize] = useState('md');
  const [highContrast, setHighContrast] = useState(false);
  const [activeTab, setActiveTab] = useState('onboarding');
  const [authPanelNotice, setAuthPanelNotice] = useState(null);

  const createCleanProfile = (user = {}) => ({
    id: user?.userId || `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    fullName: user?.displayName || user?.fullName || '',
    phoneNumber: user?.phoneNumber || user?.phone || '',
    email: user?.email || '',
    parentsName: '',
    gender: '',
    businessType: '',
    businessScale: '',
    projectDescription: '',
    location: '',
    state: '',
    estimatedProjectCost: '',
    annualFamilyIncome: '',
    householdAnnualIncome: '',
    cibilScore: '',
    userType: 'new_entrepreneur',
    category: '',
    hasCasteCertificate: false,
    casteCertificateNo: '',
    digilockerVerified: false,
    hasIncomeCertificate: false,
    hasFiledItr: false,
    itrAckNumber: '',
    tenthMarksPercentage: '',
    tenthSchoolName: '',
    twelfthMarksPercentage: '',
    twelfthSchoolName: '',
    requiredLoanAmount: '',
    supportPreference: '',
    preferredLanguage: '',
    age: '',
    uploadedDocs: []
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('schemeready_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
    return createCleanProfile();
  });

  useEffect(() => {
    try {
      localStorage.setItem('schemeready_profile', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  const [selectedScheme, setSelectedScheme] = useState({
    schemeId: 'NSFDC-MCS-01', schemeName: 'Micro Credit Scheme (MCS)', schemeType: 'Micro Credit',
    interestRate: 5.0, maximumTenureMonths: 36, moratoriumMonths: 3, maxLoanEligible: 150000,
    sourceDocument: 'NSFDC Operational Guidelines 2024-26, Clause 4.2', lastVerifiedDate: '2026-09-10T00:00:00Z'
  });

  const [nearestPartner, setNearestPartner] = useState({
    institutionName: 'Karnataka State Dr. B.R. Ambedkar Development Corporation (SCA)', district: 'Bengaluru', distanceKm: 4.2,
    contactNumber: '+91 80 2286 4521 / +91 94808 12345', contactPerson: 'Shri M. Nagaraj (District Manager)',
    address: 'No. 9 & 10, Vishweshwaraiah Towers, 9th Floor, Dr. Ambedkar Veedhi, Bengaluru - 560001',
    applicationMode: 'Offline', lastVerifiedDate: '2026-09-10T00:00:00Z'
  });

  const readinessScore = profile?.hasCasteCertificate
    ? (profile?.uploadedDocs?.includes('Business quotation') ? 100 : 92) : 72;

  const handleResetFresh = () => {
    const clean = createCleanProfile();
    setProfile(clean);
    try {
      localStorage.setItem('schemeready_profile', JSON.stringify(clean));
    } catch (e) {}
  };

  const handleLoadPersona = () => {
    const demoProfile = {
      id: 'APP-2026-BLR-0941', fullName: 'Ravi Kumar', parentsName: 'Shri M. Venkataram & Smt. Lakshmi', gender: 'Male',
      businessType: 'mobile repair', businessScale: 'Micro (Up to ₹5 Lakhs)',
      projectDescription: 'Smartphone display repair, IC soldering, micro-component replacement lab with automated diagnostics and diagnostic microscopes.',
      location: 'Bengaluru', state: 'Karnataka', estimatedProjectCost: 180000, annualFamilyIncome: 360000,
      householdAnnualIncome: 360000, cibilScore: 745, userType: 'new_entrepreneur', category: 'SC', hasCasteCertificate: false,
      casteCertificateNo: 'RD0038921029-SC', digilockerVerified: false, hasIncomeCertificate: true, hasFiledItr: true,
      itrAckNumber: 'ITR-V-2025-8891042', tenthMarksPercentage: 84.5, tenthSchoolName: 'Government High School, Malleshwaram',
      twelfthMarksPercentage: 79.2, twelfthSchoolName: 'Government PU College, Rajajinagar', requiredLoanAmount: 150000,
      supportPreference: 'offline', preferredLanguage: 'kn', age: 28, uploadedDocs: ['Aadhaar/KYC', 'Income certificate']
    };
    setProfile(demoProfile);
    try {
      localStorage.setItem('schemeready_profile', JSON.stringify(demoProfile));
    } catch (e) {}
    setLang('kn');
    setActiveTab('profile');
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.2 } });
  };

  const handleAuthSuccess = (authUser) => {
    if (authUser?.isDemo) {
      handleLoadPersona();
    } else if (authUser) {
      const savedForUser = localStorage.getItem(`schemeready_profile_${authUser.userId}`);
      let existingProfile = null;
      try {
        existingProfile = savedForUser ? JSON.parse(savedForUser) : null;
      } catch (e) {}

      const nextProfile = existingProfile && typeof existingProfile === 'object'
        ? existingProfile
        : createCleanProfile(authUser);

      setProfile(nextProfile);
      try {
        localStorage.setItem(`schemeready_profile_${authUser.userId}`, JSON.stringify(nextProfile));
        localStorage.setItem('schemeready_profile', JSON.stringify(nextProfile));
      } catch (e) {}
    }
    setActiveTab(requiresAdmin ? 'admin' : 'profile');
  };

  useEffect(() => {
    if (!isAuthenticated || !profile?.id) return;
    const userId = profile.id;
    if (!userId) return;
    try {
      localStorage.setItem(`schemeready_profile_${userId}`, JSON.stringify(profile));
    } catch (e) {}
  }, [profile, isAuthenticated]);

  if (portalView === 'landing') {
    return (
      <EntrepreneurLanding 
        onStartOnboarding={() => { 
          setPortalView('app'); 
          setActiveTab(isAuthenticated ? 'profile' : 'login'); 
        }}
        onExploreSchemes={(scheme) => { 
          if (scheme) setSelectedScheme(scheme); 
          setPortalView('app'); 
          setActiveTab('schemes'); 
        }}
        onLoadPersona={() => { 
          handleLoadPersona(); 
          setPortalView('app');
          setActiveTab('profile');
        }}
        onOpenAuth={() => { setPortalView('app'); setActiveTab('login'); }}
        onQuickFind={(criteria) => {
          setProfile(prev => ({
            ...prev,
            businessType: criteria.businessType || prev.businessType,
            location: criteria.location || prev.location,
            requiredLoanAmount: criteria.requiredLoanAmount || prev.requiredLoanAmount
          }));
          setPortalView('app');
          setActiveTab('schemes');
        }}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  const requiresAdmin = ADMIN_VIEWS.includes(activeTab);
  const isAuthView = activeTab === 'login';

  const effectiveTab = (() => {
    if (activeTab === 'login') return 'readiness';
    if (requiresAdmin && isAuthenticated && !isAdmin) return 'readiness';
    return activeTab;
  })();

  const navigate = (tab) => {
    setAuthPanelNotice(null);
    setActiveTab(tab);
  };

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

  if (isAuthView) {
    return (
      <div className={`min-h-screen flex flex-col font-sans bg-[#F8FAFC] ${highContrast ? 'contrast-125' : ''}`}>
        <GovUtilityHeader
          lang={lang}
          setLang={setLang}
          fontSize={fontSize}
          setFontSize={setFontSize}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          onBackToPortal={() => {
            setPortalView('landing');
            setActiveTab('profile');
          }}
        />
        <main className="flex-1 flex items-center justify-center p-2 sm:p-4">
          <AuthPortal
            lang={lang}
            fontSize={fontSize}
            highContrast={highContrast}
            notice={authPanelNotice || authMessage}
            initialMode={activeTab === 'login' ? 'login' : 'signup'}
            onSuccess={handleAuthSuccess}
            onBackToPortal={() => {
              setPortalView('landing');
              setActiveTab('profile');
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white ${highContrast ? 'contrast-125' : ''}`}>
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        activeTab={activeTab} 
        setActiveTab={navigate} 
        onLoadPersona={handleLoadPersona} 
        readinessScore={readinessScore}
        onGoToHome={() => setPortalView('landing')}
      />
      <main className="flex-1 pb-16">
        {effectiveTab === 'profile' && (
          <BeneficiaryProfileView 
            lang={lang} 
            profile={profile} 
            setProfile={setProfile} 
            onSaveDone={() => navigate('onboarding')} 
            onResetFresh={handleResetFresh}
          />
        )}
        {effectiveTab === 'onboarding' && <ConversationalOnboarding lang={lang} setLang={setLang} profile={profile} setProfile={setProfile} onProceedToMatching={() => navigate('schemes')} />}
        {effectiveTab === 'schemes' && <ExplainableSchemeResults lang={lang} profile={profile} selectedScheme={selectedScheme} setSelectedScheme={setSelectedScheme} onProceedToReadiness={(s) => { setSelectedScheme(s); navigate('readiness'); }} />}
        {effectiveTab === 'readiness' && <ReadinessDashboard lang={lang} profile={profile} setProfile={setProfile} onProceedToBusinessPlan={() => navigate('businessPlan')} />}
        {effectiveTab === 'businessPlan' && <BusinessPlanBuilder lang={lang} profile={profile} onProceedToPartners={() => navigate('partners')} />}
        {effectiveTab === 'checklist' && <DocumentChecklist lang={lang} profile={profile} setProfile={setProfile} selectedScheme={selectedScheme} onProceedToPack={() => navigate('pack')} />}
        {effectiveTab === 'partners' && <PartnerRouting lang={lang} profile={profile} selectedScheme={selectedScheme} nearestPartner={nearestPartner} setNearestPartner={setNearestPartner} />}
        {effectiveTab === 'emi' && <EmiSimulator lang={lang} profile={profile} selectedScheme={selectedScheme} />}
        {effectiveTab === 'pack' && <ApplicationPack lang={lang} profile={profile} selectedScheme={selectedScheme} nearestPartner={nearestPartner} />}
        {effectiveTab === 'admin' && isAdmin && <AdminPortal />}
      </main>
      <AIVoiceAssistant lang={lang} profile={profile} setProfile={setProfile} onNavigate={navigate} />
    </div>
  );
}
