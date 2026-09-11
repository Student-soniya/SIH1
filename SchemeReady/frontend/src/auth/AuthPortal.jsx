import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Building2, 
  Coins, 
  FileText, 
  Bot, 
  Check, 
  KeyRound,
  UserPlus,
  LogIn,
  Smartphone,
  Key
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { translations } from '../translations';
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmation, 
  validateDisplayName,
  EMAIL_MAX, 
  PASSWORD_MAX, 
  PASSWORD_MIN, 
  DISPLAY_NAME_MAX 
} from './validation';

export default function AuthPortal({ 
  lang = 'en',
  notice, 
  initialMode = 'login', 
  onSuccess, 
  onBackToPortal 
}) {
  const t = translations[lang] || translations.en;
  const tAuth = t.auth || {};
  const isHindi = lang === 'hi';
  const { login, signup, sendOtp, loginWithOtp, authMessage } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' | 'password'

  // Phone & OTP states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [demoOtpHint, setDemoOtpHint] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Form Fields (Password mode)
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Field validation and UI states
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const [formMessage, setFormMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // OTP Countdown timer
  useEffect(() => {
    let timer = null;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpCountdown]);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Government Math Captcha Challenge
  const [captchaNum1, setCaptchaNum1] = useState(6);
  const [captchaNum2, setCaptchaNum2] = useState(7);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(null);

  const refreshCaptcha = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
    setCaptchaAnswer('');
    setCaptchaError(null);
  };

  useEffect(() => {
    refreshCaptcha();
  }, [mode]);

  // Real-time password requirement checklist calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasMatch = confirmation.length > 0 && password === confirmation;

  // Password strength score (0 to 4)
  const calculateStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    return score;
  };

  const strengthScore = calculateStrength();
  const strengthLabels = tAuth.strengthLevels || ['Too Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = [
    'bg-rose-500', 
    'bg-amber-500', 
    'bg-blue-500', 
    'bg-emerald-600', 
    'bg-[#138808]'
  ];

  // Dynamic onBlur validation
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let err = null;
    if (field === 'displayName') err = validateDisplayName(displayName);
    if (field === 'email') err = validateEmail(email);
    if (field === 'password') err = validatePassword(password);
    if (field === 'confirmation') err = validateConfirmation(password, confirmation);

    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
  };

  // OTP Handlers
  const handleSendOtp = async () => {
    setFormMessage(null);
    setServerErrors([]);
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10 || !['6', '7', '8', '9'].includes(cleanPhone[0])) {
      setErrors(prev => ({ ...prev, phoneNumber: tAuth.enterValidMobile || 'Please enter a valid 10-digit Indian mobile number' }));
      triggerShake();
      return;
    }
    setErrors(prev => ({ ...prev, phoneNumber: null }));
    setSendingOtp(true);

    const result = await sendOtp(cleanPhone);
    setSendingOtp(false);
    if (!result.ok) {
      setFormMessage(result.message);
      triggerShake();
      return;
    }

    setOtpSent(true);
    setOtpCountdown(30);
    setDemoOtpHint(result.otp);
    setFormMessage(`${tAuth.otpSentMsg || 'OTP sent successfully to +91'} ${cleanPhone}`);
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setFormMessage(null);
    setServerErrors([]);

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErrors(prev => ({ ...prev, phoneNumber: tAuth.enterValidMobile || 'Please enter a valid 10-digit mobile number' }));
      triggerShake();
      return;
    }

    if (mode === 'signup' && !displayName.trim()) {
      setErrors(prev => ({ ...prev, displayName: isHindi ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name' }));
      triggerShake();
      return;
    }

    if (!otp || otp.trim().length < 4) {
      setErrors(prev => ({ ...prev, otp: tAuth.enterValidOtp || 'Please enter the 6-digit OTP' }));
      triggerShake();
      return;
    }

    setSubmitting(true);
    const result = await loginWithOtp(cleanPhone, otp.trim(), displayName.trim(), mode === 'signup');
    setSubmitting(false);

    if (!result.ok) {
      triggerShake();
      setFormMessage(result.message || 'Invalid OTP. Please try again.');
    } else if (onSuccess) {
      onSuccess(result.user);
    }
  };

  // Demo user login if explicitly invoked
  const handleLoadDemoUser = async (demoRole = 'beneficiary') => {
    setFormMessage(null);
    setServerErrors([]);
    setSubmitting(true);
    const demoEmail = demoRole === 'beneficiary' ? 'ravi.kumar@schemeready.gov.in' : 'officer.nagaraj@schemeready.gov.in';
    const demoPassword = demoRole === 'beneficiary' ? 'Ravi@2026Secure!' : 'Officer@2026SCA!';
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    const res = await login(demoEmail, demoPassword);
    setSubmitting(false);
    if (res.ok && onSuccess) {
      onSuccess(res.user);
    }
  };

  // Handle Password Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);
    setServerErrors([]);
    setCaptchaError(null);

    // Validate Captcha
    const expected = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer) !== expected) {
      setCaptchaError(`Incorrect sum. ${captchaNum1} + ${captchaNum2} = ${expected}`);
      triggerShake();
      refreshCaptcha();
      return;
    }

    const nextErrors = {};
    if (mode === 'signup') {
      const nameErr = validateDisplayName(displayName);
      const emailErr = validateEmail(email);
      const passErr = validatePassword(password);
      const confErr = validateConfirmation(password, confirmation);
      if (nameErr) nextErrors.displayName = nameErr;
      if (emailErr) nextErrors.email = emailErr;
      if (passErr) nextErrors.password = passErr;
      if (confErr) nextErrors.confirmation = confErr;
    } else {
      const emailErr = validateEmail(email);
      const passErr = validatePassword(password);
      if (emailErr) nextErrors.email = emailErr;
      if (passErr) nextErrors.password = passErr;
    }

    setErrors(nextErrors);
    setTouched({ displayName: true, email: true, password: true, confirmation: true });

    if (Object.keys(nextErrors).length > 0) {
      triggerShake();
      return;
    }

    setSubmitting(true);
    if (mode === 'signup') {
      const result = await signup(email.trim(), password, displayName.trim());
      setSubmitting(false);
      if (!result.ok) {
        triggerShake();
        setPassword('');
        setConfirmation('');
        setFormMessage(result.message || 'Registration failed. Please check your credentials.');
        setServerErrors(result.fieldErrors || []);
        refreshCaptcha();
      } else if (onSuccess) {
        onSuccess(result.user);
      }
    } else {
      const result = await login(email.trim(), password);
      setSubmitting(false);
      if (!result.ok) {
        triggerShake();
        setPassword('');
        setFormMessage(result.message || 'Invalid email or password. Please try again.');
        refreshCaptcha();
      } else if (onSuccess) {
        onSuccess(result.user);
      }
    }
  };

  const activeAlert = formMessage || authMessage || notice;

  return (
    <div className="w-full max-w-4xl mx-auto my-auto p-2 sm:p-4 font-sans">
      
      {/* Split-View Container */}
      <div 
        className={`w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 bg-white grid grid-cols-1 lg:grid-cols-12 transition-all ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        
        {/* LEFT PANEL: High-Trust Government Portal (Deep Navy #0D2A4A + Gold Accents) */}
        <div className="lg:col-span-5 bg-[#0D2A4A] bg-emblem-pattern text-white p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Golden Geometric Halo Blob */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Identity */}
          <div className="relative z-10 space-y-6">
            
            {/* National Emblem & Project Emblem Header */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-amber-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#0D2A4A] rounded-[14px] flex items-center justify-center font-black text-amber-300 text-lg">
                  SR
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black tracking-tight text-white">{t.appTitle}</h1>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded">
                    {tAuth.udyamSaarthi || "UDYAM SAARTHI"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  {tAuth.readinessPortal || "National Concessional Credit Readiness Portal"}
                </p>
              </div>
            </div>

            {/* Ministry Endorsement Strip */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md space-y-1 text-left">
              <div className="flex items-center space-x-2 text-[10px] font-mono uppercase text-amber-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{tAuth.sovereignGateway || "Sovereign Citizen Gateway"}</span>
              </div>
              <p className="text-xs font-bold text-white">
                {tAuth.ministrySubtitle || "Under NSFDC & Ministry of Social Justice and Empowerment"}
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                {tAuth.concessionalDescription || "PM-SURAJ Aligned • Concessional loans at 4.0% to 8.0% interest rate for SC, OBC & first-time entrepreneurs."}
              </p>
            </div>

            {/* Key Value Propositions List */}
            <div className="space-y-3.5 pt-2 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{tAuth.aiMatching || "AI-Powered Scheme Matching"}</h4>
                  <p className="text-[11px] text-slate-300 font-normal">
                    {tAuth.aiMatchingDesc || "Explainable matching to Micro Credit (5%), MSY (4%), and Term Loans."}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{tAuth.collateralFree || "Zero-Collateral Readiness Check"}</h4>
                  <p className="text-[11px] text-slate-300 font-normal">
                    {tAuth.collateralFreeDesc || "92% survival probability predictor with pre-calculated bank DSCR."}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{tAuth.digilocker || "DigiLocker 1-Click Verification"}</h4>
                  <p className="text-[11px] text-slate-300 font-normal">
                    {tAuth.digilockerDesc || "Official Tahsildar caste and income certificate pull with QR code authenticity."}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{tAuth.channelRouting || "Direct Channel Partner Routing"}</h4>
                  <p className="text-[11px] text-slate-300 font-normal">
                    {tAuth.channelRoutingDesc || "Direct handoff to 100+ authorized SCAs & RRBs with 0% overdue."}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Trust & Compliance Seal */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 space-y-2 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>{tAuth.encryption || "256-Bit AES Encryption"}</span>
              </span>
              <span>{tAuth.compliance || "DPDP Act 2023 Compliant"}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{tAuth.dbtReady || "Direct Benefit Transfer (DBT) Ready Infrastructure"}</span>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Clean Elevated White Authentication Card */}
        <div className="lg:col-span-7 p-5 sm:p-7 bg-white flex flex-col justify-between space-y-4">
          
          <div>
            {/* Tab Switcher: Sign In vs Create Account */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => { setMode('login'); setFormMessage(null); setErrors({}); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-md shadow-slate-950/5'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4 text-emerald-600" />
                <span>{tAuth.signInTab || "Sign In to Account"}</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('signup'); setFormMessage(null); setErrors({}); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-md shadow-slate-950/5'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                <span>{tAuth.signUpTab || "Register (Sign Up)"}</span>
              </button>
            </div>

            {/* Auth Method Selector: Mobile OTP vs Email/Password */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMethod('otp'); setFormMessage(null); setErrors({}); }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  authMethod === 'otp'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tAuth.phoneTab || 'Mobile Number & OTP'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMethod('password'); setFormMessage(null); setErrors({}); }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  authMethod === 'password'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tAuth.passwordTab || 'Email & Password'}</span>
              </button>
            </div>

            {/* Header Description */}
            <div className="space-y-1 mb-5 text-left">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {mode === 'login' ? (tAuth.loginHeading || 'Access Your Beneficiary Dossier') : (tAuth.signupHeading || 'Create Your Citizen Account')}
              </h2>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                {mode === 'login' 
                  ? (tAuth.loginDesc || 'Sign in to access your business plan, DigiLocker verified documents, and credit readiness report.')
                  : (tAuth.signupDesc || 'Register in under a minute to check concessional scheme eligibility and track loan applications.')}
              </p>
            </div>

            {/* Error / Notification Alert Banner */}
            {activeAlert && (
              <div 
                role="alert"
                className="mb-5 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs flex items-start space-x-2.5 text-left animate-in fade-in duration-200"
              >
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <p className="font-semibold">{activeAlert}</p>
                  {serverErrors.length > 0 && (
                    <ul className="list-disc pl-4 text-[11px] space-y-0.5">
                      {serverErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* FORM 1: Mobile Phone Number + OTP Authentication */}
            {authMethod === 'otp' ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
                
                {/* Full Name (Sign Up only) */}
                {mode === 'signup' && (
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="otp-signup-name" className="font-bold text-slate-700">
                        {tAuth.fullNameLabel || "Full Name (as on Aadhaar)"} <span className="text-rose-500">*</span>
                      </label>
                    </div>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="otp-signup-name"
                        type="text"
                        placeholder={isHindi ? "जैसे: अनिकेत शर्मा" : "e.g. Shri Aniket Sharma"}
                        value={displayName}
                        maxLength={DISPLAY_NAME_MAX}
                        onChange={(e) => { setDisplayName(e.target.value); setErrors(prev => ({ ...prev, displayName: null })); }}
                        className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all ${
                          errors.displayName 
                            ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200' 
                            : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                        }`}
                      />
                    </div>
                    {errors.displayName && (
                      <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.displayName}</p>
                    )}
                  </div>
                )}

                {/* 10-Digit Mobile Number Input & Send OTP Button */}
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="otp-phone" className="font-bold text-slate-700">
                      {tAuth.mobileLabel || "Mobile Number (10 Digits)"} <span className="text-rose-500">*</span>
                    </label>
                    {phoneNumber.length === 10 && (
                      <span className="text-[10px] text-[#138808] font-bold flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>{isHindi ? 'मान्य मोबाइल' : 'Valid Mobile'}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center space-x-1 border-r border-slate-200 pr-2 pointer-events-none">
                        <span className="text-xs font-black text-slate-700">🇮🇳 +91</span>
                      </div>
                      <input
                        id="otp-phone"
                        type="tel"
                        placeholder="98765 43210"
                        value={phoneNumber}
                        maxLength={10}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setPhoneNumber(val);
                          setErrors(prev => ({ ...prev, phoneNumber: null }));
                        }}
                        className={`w-full pl-20 pr-3.5 py-2.5 bg-slate-50/70 border rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none transition-all ${
                          errors.phoneNumber 
                            ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200' 
                            : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendingOtp || (otpSent && otpCountdown > 0)}
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
                    >
                      {sendingOtp ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : otpSent && otpCountdown > 0 ? (
                        <span>{isHindi ? `पुनः भेजें (${otpCountdown}s)` : `Resend (${otpCountdown}s)`}</span>
                      ) : otpSent ? (
                        <span>{tAuth.resendOtpBtn || 'Resend OTP'}</span>
                      ) : (
                        <span>{tAuth.sendOtpBtn || 'Send OTP'}</span>
                      )}
                    </button>
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Simulated SMS Notification Banner */}
                {otpSent && demoOtpHint && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-left space-y-1.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{tAuth.quickDemoOtp || "Security OTP (Test Mode):"}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtp(demoOtpHint)}
                        className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold px-2 py-0.5 rounded cursor-pointer transition-all"
                      >
                        {isHindi ? 'स्वतः भरें' : 'Auto-fill'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-black text-emerald-800 tracking-widest text-lg">{demoOtpHint}</span>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        {tAuth.otpExpiresIn || "Valid for"} {otpCountdown > 0 ? `${otpCountdown} ${tAuth.seconds || 'seconds'}` : '10 mins'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 6-Digit OTP Field */}
                {otpSent && (
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="otp-digit-input" className="font-bold text-slate-700">
                        {tAuth.otpLabel || "Enter 6-Digit OTP"} <span className="text-rose-500">*</span>
                      </label>
                    </div>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="otp-digit-input"
                        type="text"
                        autoFocus
                        placeholder="• • • • • •"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setOtp(val);
                          setErrors(prev => ({ ...prev, otp: null }));
                        }}
                        className={`w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border rounded-xl text-center text-base font-mono font-black tracking-widest text-slate-900 focus:outline-none transition-all ${
                          errors.otp 
                            ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200' 
                            : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                        }`}
                      />
                    </div>
                    {errors.otp && (
                      <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.otp}</p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || (!otpSent && phoneNumber.length !== 10)}
                  className="w-full py-3.5 rounded-xl bg-[#0D2A4A] hover:bg-[#133b66] disabled:bg-slate-300 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-slate-950/15 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>{tAuth.processing || "Processing securely…"}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {!otpSent 
                          ? (tAuth.sendOtpBtn || 'Send OTP to Mobile')
                          : mode === 'login' 
                          ? (tAuth.verifySignInBtn || 'Verify OTP & Sign In') 
                          : (tAuth.verifySignUpBtn || 'Verify OTP & Create Account')}
                      </span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* FORM 2: Password / Email Authentication */
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                
                {/* Full Name (Sign Up only) */}
                {mode === 'signup' && (
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="signup-name" className="font-bold text-slate-700">
                        {tAuth.fullNameLabel || "Full Name (as on Aadhaar)"} <span className="text-rose-500">*</span>
                      </label>
                      {touched.displayName && !errors.displayName && (
                        <span className="text-[10px] text-[#138808] font-bold flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>{tAuth.validName || "Valid Name"}</span>
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="signup-name"
                        type="text"
                        placeholder={isHindi ? "जैसे: अनिकेत शर्मा" : "e.g. Shri Aniket Sharma"}
                        value={displayName}
                        maxLength={DISPLAY_NAME_MAX}
                        onChange={(e) => { setDisplayName(e.target.value); setErrors(prev => ({ ...prev, displayName: null })); }}
                        onBlur={() => handleBlur('displayName')}
                        className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all ${
                          errors.displayName 
                            ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200' 
                            : touched.displayName && !errors.displayName 
                            ? 'border-[#138808] focus:ring-2 focus:ring-emerald-200'
                            : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                        }`}
                      />
                    </div>
                    {errors.displayName && (
                      <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.displayName}</p>
                    )}
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="auth-email" className="font-bold text-slate-700">
                      {tAuth.emailLabel || "Email Address or Mobile"} <span className="text-rose-500">*</span>
                    </label>
                    {touched.email && !errors.email && (
                      <span className="text-[10px] text-[#138808] font-bold flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>{tAuth.validEmail || "Valid Entry"}</span>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-email"
                      type="text"
                      placeholder="citizen@gov.in"
                      value={email}
                      maxLength={EMAIL_MAX}
                      onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: null })); }}
                      onBlur={() => handleBlur('email')}
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all ${
                        errors.email 
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200' 
                          : touched.email && !errors.email 
                          ? 'border-[#138808] focus:ring-2 focus:ring-emerald-200'
                          : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="auth-password" className="font-bold text-slate-700">
                      {tAuth.passwordLabel || "Password"} <span className="text-rose-500">*</span>
                    </label>
                    {mode === 'login' && (
                      <button 
                        type="button" 
                        onClick={() => alert(isHindi ? "पासवर्ड रीसेट लिंक आपके पंजीकृत ईमेल पर भेजा गया है।" : "Password reset instructions sent to registered address.")}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        {tAuth.forgotPassword || "Forgot password?"}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={mode === 'signup' ? (tAuth.passwordPlaceholder || "Create a secure password (8+ chars)") : (tAuth.passwordLoginPlaceholder || "Enter your password")}
                      value={password}
                      maxLength={PASSWORD_MAX}
                      onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: null })); }}
                      onBlur={() => handleBlur('password')}
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all ${
                        errors.password 
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200' 
                          : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.password}</p>
                  )}

                  {/* Password Strength Checklist (Sign Up) */}
                  {mode === 'signup' && password.length > 0 && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-left">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-600">{tAuth.securityStrength || "Security Strength:"}</span>
                        <span className="font-black text-slate-800 font-mono">
                          {strengthLabels[strengthScore] || 'Good'}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        {[0, 1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-full transition-all duration-300 ${
                              step <= strengthScore ? strengthColors[strengthScore] : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                        <div className={`flex items-center space-x-1.5 transition-colors ${hasMinLength ? 'text-[#138808] font-bold' : 'text-slate-400'}`}>
                          {hasMinLength ? <Check className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block" />}
                          <span>{tAuth.ruleLength || "8+ Characters"}</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 transition-colors ${hasNumber ? 'text-[#138808] font-bold' : 'text-slate-400'}`}>
                          {hasNumber ? <Check className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block" />}
                          <span>{tAuth.ruleNumber || "1+ Number (0-9)"}</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 transition-colors ${hasSpecial ? 'text-[#138808] font-bold' : 'text-slate-400'}`}>
                          {hasSpecial ? <Check className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block" />}
                          <span>{tAuth.ruleSpecial || "1+ Special Symbol"}</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 transition-colors ${hasMatch ? 'text-[#138808] font-bold' : 'text-slate-400'}`}>
                          {hasMatch ? <Check className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block" />}
                          <span>{tAuth.ruleMatch || "Passwords Match"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password (Sign Up only) */}
                {mode === 'signup' && (
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="signup-confirmation" className="font-bold text-slate-700">
                        {tAuth.confirmPasswordLabel || "Confirm Password"} <span className="text-rose-500">*</span>
                      </label>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="signup-confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={tAuth.confirmPlaceholder || "Retype your password"}
                        value={confirmation}
                        maxLength={PASSWORD_MAX}
                        onChange={(e) => { setConfirmation(e.target.value); setErrors(prev => ({ ...prev, confirmation: null })); }}
                        onBlur={() => handleBlur('confirmation')}
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all ${
                          errors.confirmation 
                            ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200' 
                            : hasMatch 
                            ? 'border-[#138808] focus:ring-2 focus:ring-emerald-200'
                            : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmation && (
                      <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.confirmation}</p>
                    )}
                  </div>
                )}

                {/* Math Captcha Challenge */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tAuth.captchaLabel || "Security Verification (Captcha)"} <span className="text-rose-500">*</span></span>
                    </span>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1 cursor-pointer"
                      title="Generate New Question"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{tAuth.refresh || "Refresh"}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-slate-200 text-slate-900 font-mono font-black text-sm px-4 py-2 rounded-xl tracking-widest select-none shadow-inner border border-slate-300">
                      {captchaNum1} + {captchaNum2} = ?
                    </div>
                    <input
                      type="number"
                      placeholder={tAuth.captchaPlaceholder || "Enter sum"}
                      value={captchaAnswer}
                      onChange={(e) => { setCaptchaAnswer(e.target.value); setCaptchaError(null); }}
                      className={`flex-1 px-3.5 py-2 bg-white border rounded-xl text-xs font-bold text-slate-900 focus:outline-none ${
                        captchaError ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-300 focus:ring-2 focus:ring-slate-200'
                      }`}
                    />
                  </div>
                  {captchaError && (
                    <p className="text-[11px] font-semibold text-rose-600">{captchaError}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-[#0D2A4A] hover:bg-[#133b66] disabled:bg-slate-300 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-slate-950/15 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>{tAuth.processing || "Processing securely…"}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? (tAuth.signInBtn || 'Sign In to SchemeReady') : (tAuth.signUpBtn || 'Create Citizen Account')}</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Optional Test Credentials Info (Collapsed, clean) */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-left">
              <details className="text-[11px] text-slate-400 group">
                <summary className="cursor-pointer hover:text-slate-600 font-medium select-none list-none flex items-center justify-between">
                  <span>{isHindi ? 'परीक्षण हेतु क्रेडेंशियल (वैकल्पिक)' : 'Test credentials info (Optional)'}</span>
                  <span className="text-[10px] text-emerald-700 font-mono">OTP: 482910</span>
                </summary>
                <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-600 space-y-1">
                  <p>• {isHindi ? 'किसी भी 10-अंकीय मोबाइल नंबर पर ओटीपी 482910 दर्ज कर सकते हैं।' : 'Use any 10-digit mobile number with universal test OTP 482910.'}</p>
                  <p>• {isHindi ? 'डेमो खाता: ravi.kumar@schemeready.gov.in / Ravi@2026Secure!' : 'Demo account: ravi.kumar@schemeready.gov.in / Ravi@2026Secure!'}</p>
                </div>
              </details>
            </div>
          </div>

          {/* Card Footer Switcher */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                {tAuth.noAccountYet || "Don't have a SchemeReady account yet?"}{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setFormMessage(null); setErrors({}); }}
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  {tAuth.registerNew || "Register new account →"}
                </button>
              </p>
            ) : (
              <p>
                {tAuth.alreadyAccount || "Already have a registered account?"}{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setFormMessage(null); setErrors({}); }}
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  {tAuth.signInHere || "Sign in here →"}
                </button>
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
