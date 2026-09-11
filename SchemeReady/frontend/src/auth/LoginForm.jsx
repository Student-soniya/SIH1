import React, { useState } from 'react';
import { LogIn, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import { validateEmail, validatePassword, EMAIL_MAX, PASSWORD_MAX } from './validation';

// R5.1, R5.2, R5.7. Validation runs before any request is sent; a failure names the field, and
// the email is retained while the password is cleared.

export default function LoginForm({ onSwitchToSignup, notice }) {
  const { login, authMessage } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormMessage(null);

    const nextErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;

    setErrors(nextErrors);

    // No request leaves the browser while a bound is violated (R5.2).
    if (Object.keys(nextErrors).length > 0) {
      setPassword('');
      return;
    }

    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);

    if (!result.ok) {
      setPassword('');                       // email retained, password cleared (R5.7)
      setFormMessage(result.message);
    }
  };

  const message = formMessage || authMessage || notice;

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 space-y-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure sign in</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-600">
            Sign in to reach your readiness dashboard, uploaded documents and application pack.
          </p>
        </div>

        {message && (
          <div
            role="alert"
            className="flex items-start space-x-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl p-3"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="login-email" className="text-xs font-bold text-slate-700">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              maxLength={EMAIL_MAX}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-300 focus:ring-emerald-200'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-[11px] font-semibold text-rose-700">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="login-password" className="text-xs font-bold text-slate-700">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              maxLength={PASSWORD_MAX}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-300 focus:ring-emerald-200'
              }`}
              placeholder="Your password"
            />
            {errors.password && <p className="text-[11px] font-semibold text-rose-700">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.99]"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
          </button>
        </form>

        <p className="text-xs text-slate-600 text-center">
          New here?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-bold text-emerald-700 hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
