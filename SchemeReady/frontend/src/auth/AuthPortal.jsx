import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Key,
  MessageSquare,
  Share2,
  CheckCircle,
  HelpCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { translations } from '../translations';
import OtpInputBoxes from './OtpInputBoxes';
import { 
  detectIdentifierType,
  validateIdentifier,
  validatePhone,
  validateOtp,
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
  fontSize = 'md',
  highContrast = false,
  notice, 
  initialMode = 'login', 
  onSuccess, 
  onBackToPortal 
}) {
  const t = translations[lang] || translations.en;
  const tAuth = t.auth || {};
  const isHindi = lang === 'hi';
  const { login, signup, sendOtp, loginWithOtp, verifyInlinePhoneOtp, authMessage } = useAuth();

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState(initialMode);

  // Unified Sign-In State
  const [identifier, setIdentifier] = useState('');
  const [signInAuthMode, setSignInAuthMode] = useState('auto'); // 'auto' | 'password' | 'otp'
  const [signInPassword, setSignInPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [deliveryChannel, setDeliveryChannel] = useState('sms'); // 'sms' | 'whatsapp' | 'email'

  // Registration (Sign-Up) State
  const [displayName, setDisplayName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [inlineOtpDrawer, setInlineOtpDrawer] = useState(false);
  const [inlineOtp, setInlineOtp] = useState('');
  const [inlineOtpSent, setInlineOtpSent] = useState(false);
  const [inlineOtpCountdown, setInlineOtpCountdown] = useState(0);
  const [sendingInlineOtp, setSendingInlineOtp] = useState(false);
  const [verifyingInlineOtp, setVerifyingInlineOtp] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [incomeCertified, setIncomeCertified] = useState(true);

  // Field validation and UI states
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const [formMessage, setFormMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mathematical Captcha Challenge
  const [captchaNum1, setCaptchaNum1] = useState(5);
  const [captchaNum2, setCaptchaNum2] = useState(8);
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

  // Sign-in OTP countdown timer (60s cooldown)
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

  // Sign-up inline OTP countdown timer (60s cooldown)
  useEffect(() => {
    let timer = null;
    if (inlineOtpCountdown > 0) {
      timer = setInterval(() => {
        setInlineOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [inlineOtpCountdown]);

  // Auto-detect identifier type
  const detectedType = detectIdentifierType(identifier);

  // Real-time password requirement checklist calculation
  const targetPassword = mode === 'signup' ? password : signInPassword;
  const hasMinLength = targetPassword.length >= 8;
  const hasNumber = /\d/.test(targetPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(targetPassword);
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

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
  };

  // -------------------------------------------------------------
  // Sign-In Flow Handlers
  // -------------------------------------------------------------

  const handleSendSignInOtp = async (channel = 'sms') => {
    setFormMessage(null);
    setServerErrors([]);

    const err = validateIdentifier(identifier);
    if (err) {
      setErrors((prev) => ({ ...prev, identifier: err }));
      triggerShake();
      return;
    }

    setSendingOtp(true);
    setDeliveryChannel(channel);

    const cleanTarget = detectedType === 'phone' 
      ? identifier.replace(/\D/g, '').slice(-10) 
      : identifier.trim();

    const result = await sendOtp(cleanTarget, channel);
    setSendingOtp(false);

    if (!result.ok) {
      setFormMessage(result.message);
      triggerShake();
      return;
    }

    setOtpSent(true);
    setOtpCountdown(60); // 60 seconds cooldown timer
    setFormMessage(null);
  };

  const handleVerifySignInOtp = async (customOtp) => {
    setFormMessage(null);
    setServerErrors([]);

    const codeToVerify = typeof customOtp === 'string' ? customOtp : otp;
    if (!codeToVerify || codeToVerify.trim().length !== 6) {
      setErrors((prev) => ({ ...prev, otp: tAuth.enterValidOtp || 'Please enter the 6-digit verification code' }));
      triggerShake();
      return;
    }

    setSubmitting(true);
    const cleanTarget = detectedType === 'phone' 
      ? identifier.replace(/\D/g, '').slice(-10) 
      : identifier.trim();

    const result = await loginWithOtp(cleanTarget, codeToVerify.trim(), '', false);
    setSubmitting(false);

    if (!result.ok) {
      triggerShake();
      setFormMessage(result.message || 'Invalid verification code. Please check your SMS or try another method.');
    } else if (onSuccess) {
      onSuccess(result.user);
    }
  };

  const handlePasswordSignIn = async (e) => {
    if (e) e.preventDefault();
    setFormMessage(null);
    setServerErrors([]);
    setCaptchaError(null);

    const emailErr = validateEmail(identifier);
    const passErr = validatePassword(signInPassword);

    const expected = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer) !== expected) {
      setCaptchaError(`Incorrect sum: ${captchaNum1} + ${captchaNum2} = ${expected}`);
      triggerShake();
      refreshCaptcha();
      return;
    }

    if (emailErr || passErr) {
      setErrors({
        identifier: emailErr,
        signInPassword: passErr
      });
      triggerShake();
      return;
    }

    setSubmitting(true);
    const result = await login(identifier.trim(), signInPassword);
    setSubmitting(false);

    if (!result.ok) {
      triggerShake();
      setSignInPassword('');
      setFormMessage(result.message || 'Invalid credentials. Please verify your email and password.');
      refreshCaptcha();
    } else if (onSuccess) {
      onSuccess(result.user);
    }
  };

  // -------------------------------------------------------------
  // Sign-Up (Registration) Inline Phone Verification Handlers
  // -------------------------------------------------------------

  const handleSendInlineOtp = async (channel = 'sms') => {
    setFormMessage(null);
    const cleanPhone = signupPhone.replace(/\D/g, '').slice(-10);
    const phoneErr = validatePhone(cleanPhone);
    if (phoneErr) {
      setErrors((prev) => ({ ...prev, signupPhone: phoneErr }));
      triggerShake();
      return;
    }

    setSendingInlineOtp(true);
    const result = await sendOtp(cleanPhone, channel);
    setSendingInlineOtp(false);

    if (!result.ok) {
      setFormMessage(result.message);
      triggerShake();
      return;
    }

    setInlineOtpDrawer(true);
    setInlineOtpSent(true);
    setInlineOtpCountdown(60);
    setErrors((prev) => ({ ...prev, signupPhone: null }));
  };

  const handleVerifyInlineOtp = async (customOtp) => {
    setFormMessage(null);
    const cleanPhone = signupPhone.replace(/\D/g, '').slice(-10);
    const code = typeof customOtp === 'string' ? customOtp : inlineOtp;

    if (!code || code.length !== 6) {
      setErrors((prev) => ({ ...prev, inlineOtp: tAuth.enterValidOtp || 'Please enter the 6-digit verification code' }));
      triggerShake();
      return;
    }

    setVerifyingInlineOtp(true);
    const result = await verifyInlinePhoneOtp(cleanPhone, code);
    setVerifyingInlineOtp(false);

    if (!result.ok) {
      setErrors((prev) => ({ ...prev, inlineOtp: result.message }));
      triggerShake();
    } else {
      setIsPhoneVerified(true);
      setInlineOtpDrawer(false);
      setErrors((prev) => ({ ...prev, inlineOtp: null, signupPhone: null }));
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);
    setServerErrors([]);
    setCaptchaError(null);

    // 1. Mandatory Gate: Phone MUST be verified
    if (!isPhoneVerified) {
      setErrors((prev) => ({
        ...prev,
        signupPhone: tAuth.pendingVerification || 'Please verify your mobile number with OTP first.'
      }));
      setFormMessage(tAuth.pendingVerification || 'Please verify your mobile number before creating your account.');
      triggerShake();
      return;
    }

    // 2. Validate all fields
    const nameErr = validateDisplayName(displayName);
    const emailErr = validateEmail(signupEmail);
    const passErr = validatePassword(password);
    const confErr = validateConfirmation(password, confirmation);

    const expected = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer) !== expected) {
      setCaptchaError(`Incorrect sum: ${captchaNum1} + ${captchaNum2} = ${expected}`);
      triggerShake();
      refreshCaptcha();
      return;
    }

    const nextErrors = {};
    if (nameErr) nextErrors.displayName = nameErr;
    if (emailErr) nextErrors.signupEmail = emailErr;
    if (passErr) nextErrors.password = passErr;
    if (confErr) nextErrors.confirmation = confErr;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      triggerShake();
      return;
    }

    setSubmitting(true);
    const result = await signup(signupEmail.trim(), password, displayName.trim());
    setSubmitting(false);

    if (!result.ok) {
      triggerShake();
      setPassword('');
      setConfirmation('');
      setFormMessage(result.message || 'Account registration failed. Please check your details.');
      setServerErrors(result.fieldErrors || []);
      refreshCaptcha();
    } else if (onSuccess) {
      onSuccess(result.user);
    }
  };

  // Demo evaluator login shortcut
  const handleLoadDemoUser = async (demoRole = 'beneficiary') => {
    setFormMessage(null);
    setSubmitting(true);
    const isSca = demoRole === 'admin';
    const demoEmail = isSca ? 'officer.nagaraj@schemeready.gov.in' : 'ravi.kumar@schemeready.gov.in';
    const demoPassword = isSca ? 'Officer@2026SCA!' : 'Ravi@2026Secure!';
    const res = await login(demoEmail, demoPassword);
    setSubmitting(false);
    if (res.ok && onSuccess) {
      onSuccess(res.user);
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto my-3 sm:my-6 rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col md:flex-row transition-all ${
      fontSize === 'lg' ? 'text-base' : fontSize === 'sm' ? 'text-xs' : 'text-sm'
    }`}>
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT PANEL: Sovereign Government Trust & Value Propositions   */}
      {/* ------------------------------------------------------------- */}
      <div className="md:w-5/12 bg-gradient-to-br from-[#0D2A4A] via-[#103358] to-[#0A223C] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Sovereign Emblem & Endorsement */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{tAuth.udyamSaarthi || "UDYAM SAARTHI AI"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              {tAuth.readinessPortal || "National Concessional Credit Readiness Portal"}
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {tAuth.concessionalDescription || "PM-SURAJ Aligned • Concessional loans at 4.0% to 8.0% interest rate for SC, OBC & first-time entrepreneurs."}
            </p>
          </div>

          {/* Key Trust & Value Pillars */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-start space-x-3 text-left">
              <div className="p-2 rounded-xl bg-white/10 text-amber-300 shrink-0 mt-0.5 border border-white/10">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">{tAuth.aiMatching || "AI-Powered Scheme Matching"}</h3>
                <p className="text-[11px] text-slate-300 leading-snug">{tAuth.aiMatchingDesc || "Instant eligibility for Micro Credit (5%), MSY (4%), and Term Loans."}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-left">
              <div className="p-2 rounded-xl bg-white/10 text-emerald-300 shrink-0 mt-0.5 border border-white/10">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">{tAuth.collateralFree || "Zero-Collateral Readiness Check"}</h3>
                <p className="text-[11px] text-slate-300 leading-snug">{tAuth.collateralFreeDesc || "Bank DSCR predictor with 92% survival probability metric."}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-left">
              <div className="p-2 rounded-xl bg-white/10 text-sky-300 shrink-0 mt-0.5 border border-white/10">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">{tAuth.channelRouting || "Direct Channel Partner Routing"}</h3>
                <p className="text-[11px] text-slate-300 leading-snug">{tAuth.channelRoutingDesc || "Direct submission to 100+ authorized SCAs & RRBs with 0% overdue."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Compliance Badges */}
        <div className="pt-6 mt-6 border-t border-white/15 relative z-10 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{tAuth.encryption || "256-Bit AES Encryption"}</span>
          </span>
          <span className="bg-emerald-950/70 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
            {tAuth.compliance || "DPDP Act 2023"}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT PANEL: Unified Authentication Form                     */}
      {/* ------------------------------------------------------------- */}
      <div className={`md:w-7/12 p-6 sm:p-8 flex flex-col justify-between ${isShaking ? 'animate-shake' : ''}`}>
        <div>
          
          {/* Header Mode Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => { setMode('login'); setFormMessage(null); setErrors({}); }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#0D2A4A] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{tAuth.signInTab || "Sign In"}</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setFormMessage(null); setErrors({}); }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#0D2A4A] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{tAuth.signUpTab || "Register (Sign Up)"}</span>
              </button>
            </div>

            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isHindi ? 'सुरक्षित पोर्टल' : 'Official Portal'}</span>
            </span>
          </div>

          {/* Form Titles */}
          <div className="text-left mb-5">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {mode === 'login' 
                ? (tAuth.loginHeading || "Sign In to Your Account") 
                : (tAuth.signupHeading || "Create Your Citizen Account")}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login' 
                ? (tAuth.loginDesc || "Enter your mobile number or email to access your citizen dossier.") 
                : (tAuth.signupDesc || "Register with your verified mobile number to check concessional scheme eligibility.")}
            </p>
          </div>

          {/* System Notice or Error Alert */}
          {(formMessage || notice || authMessage) && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-left flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 font-medium leading-relaxed">
                {formMessage || notice || authMessage}
              </p>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 1: UNIFIED SIGN-IN FLOW                              */}
          {/* ========================================================= */}
          {mode === 'login' && (
            <div className="space-y-4 text-left">
              
              {/* Single Smart Identifier Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="unified-identifier" className="font-bold text-slate-700">
                    {tAuth.smartIdentifierLabel || "Mobile Number or Email Address"} <span className="text-rose-500">*</span>
                  </label>

                  {/* Dynamic Detection Badge */}
                  {detectedType === 'phone' && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center space-x-1">
                      <span>🇮🇳</span>
                      <span>{tAuth.detectedMobile || "Mobile Number"}</span>
                    </span>
                  )}
                  {detectedType === 'email' && (
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{tAuth.detectedEmail || "Email Address"}</span>
                    </span>
                  )}
                </div>

                <div className="relative">
                  {detectedType === 'phone' ? (
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  ) : (
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  )}
                  <input
                    id="unified-identifier"
                    type="text"
                    autoFocus
                    placeholder={tAuth.smartIdentifierPlaceholder || "Enter 10-digit mobile number or email"}
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setErrors((prev) => ({ ...prev, identifier: null }));
                      setOtpSent(false); // Reset OTP if identifier changes
                    }}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all ${
                      errors.identifier
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                    }`}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.identifier}</p>
                )}
              </div>

              {/* Dynamic Path A: Mobile Number Detected -> 6-Box OTP Flow */}
              {detectedType === 'phone' && signInAuthMode !== 'password' && (
                <div className="space-y-4 pt-1">
                  
                  {/* Send OTP Trigger button (if not sent yet) */}
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={() => handleSendSignInOtp('sms')}
                      disabled={sendingOtp || identifier.replace(/\D/g, '').length < 10}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      {sendingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{tAuth.processing || "Sending Verification Code…"}</span>
                        </>
                      ) : (
                        <>
                          <span>{tAuth.sendOtpBtn || "Send 6-Digit OTP"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  ) : (
                    /* OTP Dispatched Active Section */
                    <div className="space-y-3.5">
                      
                      {/* Sovereign Status Alert Banner */}
                      <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0D2A4A] flex items-center space-x-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                            <span>
                              {deliveryChannel === 'whatsapp' 
                                ? (tAuth.whatsappDispatchedTitle || "WhatsApp Code Dispatched")
                                : (tAuth.smsDispatchedTitle || "SMS Verification Code Dispatched")}
                            </span>
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center space-x-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>
                              {deliveryChannel === 'whatsapp' 
                                ? (tAuth.whatsappSentBadge || "WhatsApp Sent")
                                : (tAuth.smsSentBadge || "SMS Sent")}
                            </span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          {isHindi 
                            ? `सत्यापन कोड आपके मोबाइल +91 ******${identifier.slice(-4)} पर भेजा गया है। कृपया इनबॉक्स देखें और कोड दर्ज करें।`
                            : `A 6-digit verification code was sent to mobile +91 ******${identifier.slice(-4)}. Please check your messages.`}
                        </p>
                      </div>

                      {/* 6-Box OTP Input Component */}
                      <div className="space-y-1 text-center">
                        <label className="font-bold text-xs text-slate-700 block text-left mb-1.5">
                          {tAuth.otpLabel || "Enter 6-Digit Verification Code"} <span className="text-rose-500">*</span>
                        </label>
                        <OtpInputBoxes
                          value={otp}
                          onChange={(val) => {
                            setOtp(val);
                            setErrors((prev) => ({ ...prev, otp: null }));
                          }}
                          onComplete={(val) => handleVerifySignInOtp(val)}
                          hasError={Boolean(errors.otp)}
                          disabled={submitting}
                        />
                        {errors.otp && (
                          <p className="text-[11px] font-semibold text-rose-600 text-left pl-1">{errors.otp}</p>
                        )}
                        <p className="text-[10px] text-slate-400 text-left pl-1 pt-1">
                          {tAuth.pasteCodePrompt || "Tip: You can paste the 6-digit code directly into the boxes."}
                        </p>
                      </div>

                      {/* Verify & Sign In Action Button */}
                      <button
                        type="button"
                        onClick={() => handleVerifySignInOtp()}
                        disabled={submitting || otp.length !== 6}
                        className="w-full py-3 px-4 rounded-xl bg-[#0D2A4A] hover:bg-[#12365e] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-md shadow-slate-900/10 transition-all cursor-pointer flex items-center justify-center space-x-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{tAuth.processing || "Verifying securely…"}</span>
                          </>
                        ) : (
                          <>
                            <span>{tAuth.verifySignInBtn || "Verify & Sign In"}</span>
                            <ArrowRight className="w-4 h-4 text-amber-300" />
                          </>
                        )}
                      </button>

                      {/* Multi-Channel Fallbacks & Resend Timer */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {otpCountdown > 0 
                              ? `${tAuth.resendCountdown || 'Resend in'} ${otpCountdown}s` 
                              : (tAuth.didNotReceiveSms || 'Did not receive code?')}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Resend via SMS button */}
                          <button
                            type="button"
                            onClick={() => handleSendSignInOtp('sms')}
                            disabled={otpCountdown > 0 || sendingOtp}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed hover:underline"
                          >
                            {tAuth.resendOtpBtn || "Resend via SMS"}
                          </button>
                          
                          <span className="text-slate-300">|</span>

                          {/* Fallback via WhatsApp */}
                          <button
                            type="button"
                            onClick={() => handleSendSignInOtp('whatsapp')}
                            disabled={otpCountdown > 0 || sendingOtp}
                            className="text-[11px] font-bold text-teal-700 hover:text-teal-800 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed hover:underline"
                          >
                            {tAuth.sendViaWhatsapp || "WhatsApp"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Alternative: Switch to Password option */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setSignInAuthMode('password')}
                      className="text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                    >
                      {tAuth.verifyViaPassword || "Sign in with Password instead"}
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Path B: Email Address Detected (or explicitly switched to password) */}
              {(detectedType === 'email' || signInAuthMode === 'password') && (
                <form onSubmit={handlePasswordSignIn} className="space-y-4 pt-1">
                  
                  {/* Password Input */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="signin-pass" className="font-bold text-slate-700">
                        {tAuth.passwordLabel || "Password"} <span className="text-rose-500">*</span>
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="signin-pass"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={tAuth.passwordLoginPlaceholder || "Enter your password"}
                        value={signInPassword}
                        onChange={(e) => {
                          setSignInPassword(e.target.value);
                          setErrors((prev) => ({ ...prev, signInPassword: null }));
                        }}
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all ${
                          errors.signInPassword
                            ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.signInPassword && (
                      <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.signInPassword}</p>
                    )}
                  </div>

                  {/* Mathematical Captcha */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <label htmlFor="signin-captcha" className="font-bold text-slate-700">
                        {tAuth.captchaLabel || "Security Verification (Captcha)"} <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{tAuth.refresh || "Refresh"}</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="px-3.5 py-2 bg-slate-100 border border-slate-300 rounded-xl font-mono font-bold text-sm text-slate-800 tracking-wider select-none shrink-0">
                        {captchaNum1} + {captchaNum2} = ?
                      </div>
                      <input
                        id="signin-captcha"
                        type="text"
                        placeholder={tAuth.captchaPlaceholder || "Enter sum"}
                        value={captchaAnswer}
                        onChange={(e) => {
                          setCaptchaAnswer(e.target.value);
                          setCaptchaError(null);
                        }}
                        className={`w-full py-2 px-3 bg-slate-50 border rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none transition-all ${
                          captchaError
                            ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                        }`}
                      />
                    </div>
                    {captchaError && (
                      <p className="text-[11px] font-semibold text-rose-600 pl-1">{captchaError}</p>
                    )}
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-[11px] font-medium">{tAuth.rememberMe || "Keep me signed in"}</span>
                    </label>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#0D2A4A] hover:bg-[#12365e] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-md shadow-slate-900/10 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{tAuth.processing || "Signing in…"}</span>
                      </>
                    ) : (
                      <>
                        <span>{tAuth.signInBtn || "Sign In to SchemeReady"}</span>
                        <ArrowRight className="w-4 h-4 text-amber-300" />
                      </>
                    )}
                  </button>

                  {/* Alternative Option: Sign in via Email OTP */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSignInAuthMode('otp');
                        handleSendSignInOtp('email');
                      }}
                      className="text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                    >
                      {tAuth.verifyViaOtp || "Sign in with Email OTP / Magic Code instead"}
                    </button>
                  </div>
                </form>
              )}

              {/* Dev Bypass Helper Note in Local Development */}
              <div className="pt-2 text-left">
                <p className="text-[10px] text-slate-400 font-mono">
                  {isHindi ? '• परीक्षण बायपास: 123456 या कंसोल लॉग देखें' : '• Dev bypass OTP: 123456 (or check browser console)'}
                </p>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: REGISTRATION / SIGN-UP FLOW WITH INLINE OTP GATING */}
          {/* ========================================================= */}
          {mode === 'signup' && (
            <form onSubmit={handleRegistrationSubmit} className="space-y-3.5 text-left" noValidate>
              
              {/* 1. Full Name */}
              <div className="space-y-1">
                <label htmlFor="reg-name" className="font-bold text-xs text-slate-700">
                  {tAuth.fullNameLabel || "Full Name (as on Aadhaar)"} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-name"
                    type="text"
                    placeholder={tAuth.fullNamePlaceholder || "e.g. Shri Aniket Sharma"}
                    value={displayName}
                    maxLength={DISPLAY_NAME_MAX}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      setErrors((prev) => ({ ...prev, displayName: null }));
                    }}
                    className={`w-full pl-10 pr-3.5 py-2 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all ${
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

              {/* 2. Email Address */}
              <div className="space-y-1">
                <label htmlFor="reg-email" className="font-bold text-xs text-slate-700">
                  {tAuth.emailLabel || "Email Address"} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-email"
                    type="email"
                    placeholder={tAuth.emailPlaceholder || "citizen@example.gov.in"}
                    value={signupEmail}
                    maxLength={EMAIL_MAX}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, signupEmail: null }));
                    }}
                    className={`w-full pl-10 pr-3.5 py-2 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all ${
                      errors.signupEmail
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                    }`}
                  />
                </div>
                {errors.signupEmail && (
                  <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.signupEmail}</p>
                )}
              </div>

              {/* 3. Mobile Number with Mandatory INLINE OTP Verification */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="reg-phone" className="font-bold text-slate-700">
                    {tAuth.mobileLabel || "Mobile Number (10 Digits)"} <span className="text-rose-500">*</span>
                  </label>
                  {isPhoneVerified ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>{tAuth.verifiedBadge || "Verified ✓"}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {tAuth.pendingVerification || "OTP Verification Required"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 border-r border-slate-200 pr-2 pointer-events-none">
                      <span className="text-xs font-bold text-slate-700">🇮🇳 +91</span>
                    </div>
                    <input
                      id="reg-phone"
                      type="tel"
                      placeholder={tAuth.mobilePlaceholder || "98765 43210"}
                      value={signupPhone}
                      maxLength={10}
                      disabled={isPhoneVerified}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, '');
                        setSignupPhone(clean);
                        setIsPhoneVerified(false);
                        setInlineOtpDrawer(false);
                        setErrors((prev) => ({ ...prev, signupPhone: null }));
                      }}
                      className={`w-full pl-20 pr-3.5 py-2 bg-slate-50 border rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none transition-all ${
                        isPhoneVerified
                          ? 'bg-emerald-50/50 border-emerald-400 text-emerald-950 font-black'
                          : errors.signupPhone
                          ? 'border-rose-400 bg-rose-50/30'
                          : 'border-slate-300 focus:border-[#0D2A4A]'
                      }`}
                    />
                  </div>

                  {/* Inline Verify Button */}
                  {!isPhoneVerified ? (
                    <button
                      type="button"
                      onClick={() => handleSendInlineOtp('sms')}
                      disabled={sendingInlineOtp || signupPhone.length !== 10}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
                    >
                      {sendingInlineOtp ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>{tAuth.inlineVerifyBtn || "Verify Mobile"}</span>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsPhoneVerified(false);
                        setInlineOtpDrawer(false);
                        setSignupPhone('');
                      }}
                      className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] cursor-pointer"
                      title="Change phone number"
                    >
                      {isHindi ? 'बदलें' : 'Change'}
                    </button>
                  )}
                </div>
                {errors.signupPhone && (
                  <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.signupPhone}</p>
                )}

                {/* Inline OTP Drawer/Section */}
                {inlineOtpDrawer && !isPhoneVerified && (
                  <div className="mt-2.5 p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                        <Key className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{tAuth.otpLabel || "Enter 6-Digit OTP"}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {inlineOtpCountdown > 0 ? `${inlineOtpCountdown}s` : ''}
                      </span>
                    </div>

                    <OtpInputBoxes
                      value={inlineOtp}
                      onChange={(val) => {
                        setInlineOtp(val);
                        setErrors((prev) => ({ ...prev, inlineOtp: null }));
                      }}
                      onComplete={(val) => handleVerifyInlineOtp(val)}
                      hasError={Boolean(errors.inlineOtp)}
                      disabled={verifyingInlineOtp}
                    />
                    {errors.inlineOtp && (
                      <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.inlineOtp}</p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => handleSendInlineOtp('sms')}
                        disabled={inlineOtpCountdown > 0 || sendingInlineOtp}
                        className="text-[11px] font-bold text-emerald-700 hover:underline disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {tAuth.resendOtpBtn || "Resend OTP"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVerifyInlineOtp()}
                        disabled={verifyingInlineOtp || inlineOtp.length !== 6}
                        className="py-1.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 text-white font-bold text-xs cursor-pointer flex items-center space-x-1"
                      >
                        {verifyingInlineOtp ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{isHindi ? 'सत्यापित करें' : 'Confirm'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Password Creation */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="reg-pass" className="font-bold text-slate-700">
                    {tAuth.passwordLabel || "Create Password"} <span className="text-rose-500">*</span>
                  </label>
                  {password && (
                    <span className="text-[10px] font-bold text-slate-500">
                      {strengthLabels[strengthScore]}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-pass"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={tAuth.passwordPlaceholder || "Create secure password (8+ chars)"}
                    value={password}
                    maxLength={PASSWORD_MAX}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: null }));
                    }}
                    className={`w-full pl-10 pr-10 py-2 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all ${
                      errors.password
                        ? 'border-rose-400 bg-rose-50/30'
                        : 'border-slate-300 focus:border-[#0D2A4A]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.password}</p>
                )}

                {/* Password strength meter bar */}
                {password.length > 0 && (
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mt-1 flex">
                    <div 
                      className={`h-full transition-all duration-300 ${strengthColors[strengthScore]}`}
                      style={{ width: `${Math.min(100, (strengthScore + 1) * 20)}%` }}
                    />
                  </div>
                )}
              </div>

              {/* 5. Confirm Password */}
              <div className="space-y-1">
                <label htmlFor="reg-confirm" className="font-bold text-xs text-slate-700">
                  {tAuth.confirmPasswordLabel || "Confirm Password"} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={tAuth.confirmPlaceholder || "Retype your password"}
                    value={confirmation}
                    maxLength={PASSWORD_MAX}
                    onChange={(e) => {
                      setConfirmation(e.target.value);
                      setErrors((prev) => ({ ...prev, confirmation: null }));
                    }}
                    className={`w-full pl-10 pr-10 py-2 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all ${
                      errors.confirmation
                        ? 'border-rose-400 bg-rose-50/30'
                        : 'border-slate-300 focus:border-[#0D2A4A]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmation && (
                  <p className="text-[11px] font-semibold text-rose-600 pl-1">{errors.confirmation}</p>
                )}
              </div>

              {/* 6. Mathematical Captcha */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="reg-captcha" className="font-bold text-slate-700">
                    {tAuth.captchaLabel || "Security Verification (Captcha)"} <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{tAuth.refresh || "Refresh"}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-3.5 py-1.5 bg-slate-100 border border-slate-300 rounded-xl font-mono font-bold text-sm text-slate-800 tracking-wider select-none shrink-0">
                    {captchaNum1} + {captchaNum2} = ?
                  </div>
                  <input
                    id="reg-captcha"
                    type="text"
                    placeholder={tAuth.captchaPlaceholder || "Enter sum"}
                    value={captchaAnswer}
                    onChange={(e) => {
                      setCaptchaAnswer(e.target.value);
                      setCaptchaError(null);
                    }}
                    className={`w-full py-1.5 px-3 bg-slate-50 border rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none transition-all ${
                      captchaError
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-[#0D2A4A] focus:ring-2 focus:ring-slate-200'
                    }`}
                  />
                </div>
                {captchaError && (
                  <p className="text-[11px] font-semibold text-rose-600 pl-1">{captchaError}</p>
                )}
              </div>

              {/* 7. Income Self-Certification Checkbox */}
              <div className="pt-1">
                <label className="flex items-start space-x-2 cursor-pointer select-none text-left">
                  <input
                    type="checkbox"
                    checked={incomeCertified}
                    onChange={(e) => setIncomeCertified(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-slate-600 leading-snug">
                    {tAuth.incomeCertification || "I certify that my annual family income is within ₹5.00 Lakhs."}
                  </span>
                </label>
              </div>

              {/* Final Submit Registration Button */}
              <button
                type="submit"
                disabled={submitting || !isPhoneVerified}
                className="w-full py-3 px-4 rounded-xl bg-[#0D2A4A] hover:bg-[#12365e] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs shadow-md shadow-slate-900/10 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{tAuth.processing || "Registering Account…"}</span>
                  </>
                ) : (
                  <>
                    <span>{tAuth.signUpBtn || "Create Citizen Account"}</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Evaluator 1-Click Fast-Access Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">
              {isHindi ? 'मूल्यांकनकर्ता त्वरित प्रवेश:' : 'Evaluator 1-Click Access:'}
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleLoadDemoUser('beneficiary')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] cursor-pointer"
              >
                Ravi Kumar (Beneficiary)
              </button>
              <button
                type="button"
                onClick={() => handleLoadDemoUser('admin')}
                className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[10px] cursor-pointer"
              >
                SCA Officer (Admin)
              </button>
            </div>
          </div>

        </div>

        {/* Card Footer Switcher */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 mt-4">
          {mode === 'login' ? (
            <p>
              {tAuth.noAccountYet || "Don't have a SchemeReady account yet?"}{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setFormMessage(null); setErrors({}); }}
                className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                {tAuth.registerNew || "Register new citizen account →"}
              </button>
            </p>
          ) : (
            <p>
              {tAuth.alreadyAccount || "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setFormMessage(null); setErrors({}); }}
                className="font-bold text-[#0D2A4A] hover:underline cursor-pointer"
              >
                {tAuth.signInHere || "Sign in here →"}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
