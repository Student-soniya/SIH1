import React, { useState } from 'react';
import { UserPlus, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from './AuthContext';
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

// R5.1, R5.2. Four fields and no more — name, email, password, confirmation — because every one
// of them is required by R5.1 and nothing else is asked for. Each field validates as you leave it
// and again on submit; a failure names the field, sends no request, and retains everything except
// the two password fields.
//
// Deliberately absent: social sign-in. It would move credential handling to a third party, put an
// external identity provider inside the trust boundary of a government benefits dossier, and it is
// not in the approved requirements — R4.1 specifies ASP.NET Core Identity accounts.

export default function SignupForm({ onSwitchToLogin }) {
  const { signup } = useAuth();

  const [values, setValues] = useState({ displayName: '', email: '', password: '', confirmation: '' });
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const [formMessage, setFormMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateField = (field) => () => {
    setErrors((prev) => ({ ...prev, [field]: fieldError(field, values) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormMessage(null);
    setServerErrors([]);

    const nextErrors = {};
    ['displayName', 'email', 'password', 'confirmation'].forEach((field) => {
      const error = fieldError(field, values);
      if (error) nextErrors[field] = error;
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      // Retain the name and email; clear both password fields (R5.2).
      setValues((prev) => ({ ...prev, password: '', confirmation: '' }));
      return;
    }

    setSubmitting(true);
    const result = await signup(values.email.trim(), values.password, values.displayName.trim());
    setSubmitting(false);

    if (!result.ok) {
      setValues((prev) => ({ ...prev, password: '', confirmation: '' }));
      setFormMessage(result.message);
      setServerErrors(result.fieldErrors || []);
    }
  };

  const passwordStrong = values.password.length >= 12 && /[a-zA-Z]/.test(values.password) && /\d/.test(values.password);

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 space-y-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Takes under a minute</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
          <p className="text-sm text-slate-600">
            Four details is all we need. Your documents and readiness progress stay private to you.
          </p>
        </div>

        {formMessage && (
          <div
            role="alert"
            className="space-y-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl p-3"
          >
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{formMessage}</span>
            </div>
            {serverErrors.length > 0 && (
              <ul className="list-disc pl-8 space-y-0.5">
                {serverErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field
            id="signup-name"
            label="Your name"
            type="text"
            value={values.displayName}
            maxLength={DISPLAY_NAME_MAX}
            autoComplete="name"
            placeholder="Ravi Kumar"
            error={errors.displayName}
            onChange={setField('displayName')}
            onBlur={validateField('displayName')}
          />

          <Field
            id="signup-email"
            label="Email address"
            type="email"
            value={values.email}
            maxLength={EMAIL_MAX}
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email}
            onChange={setField('email')}
            onBlur={validateField('email')}
          />

          <div className="space-y-1">
            <Field
              id="signup-password"
              label="Password"
              type="password"
              value={values.password}
              maxLength={PASSWORD_MAX}
              autoComplete="new-password"
              placeholder={`At least ${PASSWORD_MIN} characters`}
              error={errors.password}
              onChange={setField('password')}
              onBlur={validateField('password')}
            />
            {values.password.length > 0 && !errors.password && (
              <p className={`text-[11px] font-semibold flex items-center space-x-1 ${passwordStrong ? 'text-emerald-700' : 'text-slate-500'}`}>
                {passwordStrong && <CheckCircle2 className="w-3 h-3" />}
                <span>
                  {passwordStrong
                    ? 'Strong password — accepted by the server too.'
                    : 'Tip: 12+ characters with at least one letter and one digit is accepted everywhere.'}
                </span>
              </p>
            )}
          </div>

          <Field
            id="signup-confirmation"
            label="Re-enter password"
            type="password"
            value={values.confirmation}
            maxLength={PASSWORD_MAX}
            autoComplete="new-password"
            placeholder="Type it once more"
            error={errors.confirmation}
            onChange={setField('confirmation')}
            onBlur={validateField('confirmation')}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.99]"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            <span>{submitting ? 'Creating your account…' : 'Create account'}</span>
          </button>
        </form>

        <p className="text-xs text-slate-600 text-center">
          Already registered?{' '}
          <button type="button" onClick={onSwitchToLogin} className="font-bold text-emerald-700 hover:underline">
            Sign in instead
          </button>
        </p>
      </div>
    </div>
  );
}

function fieldError(field, values) {
  switch (field) {
    case 'displayName':
      return validateDisplayName(values.displayName);
    case 'email':
      return validateEmail(values.email);
    case 'password':
      return validatePassword(values.password);
    case 'confirmation':
      return validateConfirmation(values.password, values.confirmation);
    default:
      return null;
  }
}

function Field({ id, label, error, ...inputProps }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-bold text-slate-700">
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${
          error ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-200'
        }`}
      />
      {error && <p className="text-[11px] font-semibold text-rose-700">{error}</p>}
    </div>
  );
}
