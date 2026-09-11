import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  X, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Award,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SihLoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [activeRole, setActiveRole] = useState('student'); // 'student', 'spoc', 'ministry'
  const [emailOrId, setEmailOrId] = useState('team.phoenix@sih.gov.in');
  const [password, setPassword] = useState('SIH2026@Pass');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [captchaInput, setCaptchaInput] = useState('32');
  const [captchaVal, setCaptchaVal] = useState({ q: '24 + 8', ans: '32' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const refreshCaptcha = () => {
    const n1 = Math.floor(Math.random() * 30) + 10;
    const n2 = Math.floor(Math.random() * 10) + 2;
    setCaptchaVal({ q: `${n1} + ${n2}`, ans: (n1 + n2).toString() });
    setCaptchaInput('');
    setError('');
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setError('');
    if (role === 'student') {
      setEmailOrId('team.phoenix@sih.gov.in');
      setPassword('SIH2026@Pass');
    } else if (role === 'spoc') {
      setEmailOrId('spoc.iitdelhi@nic.in');
      setPassword('Spoc@2026');
    } else {
      setEmailOrId('evaluator.isro@gov.in');
      setPassword('Jury@2026');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (captchaInput.trim() !== captchaVal.ans) {
      setError('Incorrect Captcha answer. Please solve the challenge.');
      refreshCaptcha();
      return;
    }

    setSuccess(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess({
          user: emailOrId,
          role: activeRole,
          name: activeRole === 'student' ? 'Team Phoenix (Leader)' : activeRole === 'spoc' ? 'Prof. R. Sharma (College SPOC)' : 'Dr. K. Sivan (Ministry Jury)'
        });
      }
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 mx-auto shadow-md shadow-orange-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Smart India Hackathon 2026
          </h3>
          <p className="text-xs text-slate-500">
            Sovereign Innovation &amp; Evaluation Single Sign-On
          </p>
        </div>

        {/* Role Selector Tabs (Student / SPOC / Ministry) */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeRole === 'student' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Team
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('spoc')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeRole === 'spoc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            College SPOC
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('ministry')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeRole === 'ministry' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ministry / Jury
          </button>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Authenticated! Entering SIH 2026 Portal...</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              {activeRole === 'student' ? 'Team ID or Email' : activeRole === 'spoc' ? 'College AISHE Code / Email' : 'Ministry Official ID'}
            </label>
            <input
              type="text"
              required
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-orange-500 focus:bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-bold">Password</label>
              <a href="#home" onClick={(e) => { e.preventDefault(); alert('Password recovery link dispatched to institution registered email.'); }} className="text-orange-600 hover:underline text-[11px] font-semibold">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-orange-500 focus:bg-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Captcha Challenge */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-black text-sm bg-white border border-slate-300 px-3 py-1 rounded-lg text-slate-800 tracking-wider">
                {captchaVal.q} = ?
              </span>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="text-slate-400 hover:text-orange-600 p-1"
                title="Refresh Captcha"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              type="text"
              required
              placeholder="Answer"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-center font-bold text-slate-900 focus:outline-orange-500 font-mono"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2 text-slate-600">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="remember" className="font-medium cursor-pointer">
              Remember my session on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all transform active:scale-95 cursor-pointer"
          >
            SIGN IN TO SIH 2026
          </button>
        </form>

        {/* Quick Demo Note */}
        <div className="pt-2 text-center border-t border-slate-100 text-[11px] text-slate-400">
          New Team? <a href="#problems" onClick={() => { onClose(); }} className="text-orange-600 font-bold hover:underline">Explore Problem Statements</a> to register.
        </div>
      </div>
    </div>
  );
}