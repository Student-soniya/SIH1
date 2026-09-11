import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

/**
 * The one place an unauthenticated user lands: sign in, or switch to sign up.
 *
 * `notice` carries the reason the panel appeared — an ended session, or an attempt to reach a
 * view that needs a session (R5.7, R5.8).
 */
export default function AuthPanel({ notice, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  return mode === 'signup'
    ? <SignupForm onSwitchToLogin={() => setMode('login')} />
    : <LoginForm notice={notice} onSwitchToSignup={() => setMode('signup')} />;
}
