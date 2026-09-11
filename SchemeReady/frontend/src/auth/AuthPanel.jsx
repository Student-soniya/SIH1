import React from 'react';
import AuthPortal from './AuthPortal';

export default function AuthPanel({ notice, initialMode = 'login', onSuccess, onBackToPortal }) {
  return (
    <AuthPortal 
      notice={notice} 
      initialMode={initialMode} 
      onSuccess={onSuccess} 
      onBackToPortal={onBackToPortal} 
    />
  );
}
