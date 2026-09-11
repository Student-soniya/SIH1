// Client-side validation schema & detection helpers for SchemeReady Authentication

export const EMAIL_MAX = 254;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
export const DISPLAY_NAME_MIN = 1;
export const DISPLAY_NAME_MAX = 60;
export const PHONE_LENGTH = 10;
export const OTP_LENGTH = 6;

/**
 * Smart identifier detector:
 * Determines if user is entering an Indian mobile number or an email address.
 * @param {string} value
 * @returns {'phone' | 'email' | 'phone_incomplete' | 'email_incomplete' | 'empty'}
 */
export function detectIdentifierType(value) {
  const raw = (value || '').trim();
  if (!raw) return 'empty';

  const cleanDigits = raw.replace(/\D/g, '');

  // If user typed only digits or starts with +91
  if (/^(\+91|91)?[6-9]\d*$/.test(raw.replace(/\s+/g, '')) || /^\d+$/.test(raw)) {
    if (cleanDigits.length === 10 || (cleanDigits.length === 12 && cleanDigits.startsWith('91'))) {
      return 'phone';
    }
    return 'phone_incomplete';
  }

  // If user typed letters or '@'
  if (raw.includes('@')) {
    const parts = raw.split('@');
    if (parts.length === 2 && parts[0].length > 0 && parts[1].includes('.')) {
      return 'email';
    }
    return 'email_incomplete';
  }

  return 'email_incomplete';
}

/** Returns null when the address is acceptable, otherwise error message. */
export function validateEmail(value) {
  const email = (value || '').trim();

  if (email.length === 0) return 'Email address is required.';
  if (email.length > EMAIL_MAX) return `Email address must be at most ${EMAIL_MAX} characters.`;

  const parts = email.split('@');
  if (parts.length !== 2) return "Email address must contain exactly one '@'.";
  if (parts[0].length === 0 || parts[1].length === 0) {
    return "Email address needs at least one character on each side of the '@'.";
  }

  const domainParts = parts[1].split('.');
  if (domainParts.length < 2 || domainParts.some(dp => dp.length === 0)) {
    return 'Please enter a valid email domain (e.g., .gov.in, .nic.in, .com).';
  }

  return null;
}

/** Validates 10-digit Indian Mobile Number */
export function validatePhone(value) {
  const raw = (value || '').trim();
  if (!raw) return 'Mobile number is required.';

  const clean = raw.replace(/\D/g, '').slice(-10);
  if (clean.length !== 10) {
    return 'Mobile number must be exactly 10 digits.';
  }

  if (!['6', '7', '8', '9'].includes(clean[0])) {
    return 'Mobile number must start with 6, 7, 8, or 9.';
  }

  return null;
}

/** Validates smart single identifier */
export function validateIdentifier(value) {
  const raw = (value || '').trim();
  if (!raw) return 'Please enter your mobile number or email address.';

  const type = detectIdentifierType(raw);
  if (type === 'phone') {
    return validatePhone(raw);
  }
  if (type === 'email') {
    return validateEmail(raw);
  }
  if (type === 'phone_incomplete') {
    return 'Please enter all 10 digits of your mobile number.';
  }
  return 'Please enter a valid email address or 10-digit Indian mobile number.';
}

/** Validates 6-Digit OTP */
export function validateOtp(value) {
  const clean = String(value || '').replace(/\D/g, '');
  if (!clean || clean.length === 0) return 'OTP verification code is required.';
  if (clean.length !== 6) return 'OTP must be exactly 6 digits.';
  return null;
}

export function validatePassword(value) {
  const password = value || '';

  if (password.length === 0) return 'Password is required.';
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return `Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters.`;
  }

  return null;
}

export function validateConfirmation(password, confirmation) {
  if ((confirmation || '').length === 0) return 'Please re-enter your password.';
  if (password !== confirmation) return 'The two passwords do not match.';
  return null;
}

export function validateDisplayName(value) {
  const name = (value || '').trim();

  if (name.length < DISPLAY_NAME_MIN) return 'Your full name is required.';
  if (name.length > DISPLAY_NAME_MAX) return `Your name must be at most ${DISPLAY_NAME_MAX} characters.`;

  return null;
}
