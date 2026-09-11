// Client-side bounds of R5.1 and R5.2, in one place so the login and signup forms cannot
// disagree, and so the messages name the failing field exactly as the requirement demands.

export const EMAIL_MAX = 254;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
export const DISPLAY_NAME_MIN = 1;
export const DISPLAY_NAME_MAX = 60;

/** Returns null when the address is acceptable, otherwise the message for the email field. */
export function validateEmail(value) {
  const email = (value || '').trim();

  if (email.length === 0) return 'Email address is required.';
  if (email.length > EMAIL_MAX) return `Email address must be at most ${EMAIL_MAX} characters.`;

  const parts = email.split('@');
  if (parts.length !== 2) return "Email address must contain exactly one '@'.";
  if (parts[0].length === 0 || parts[1].length === 0) {
    return "Email address needs at least one character on each side of the '@'.";
  }

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

  if (name.length < DISPLAY_NAME_MIN) return 'Your name is required.';
  if (name.length > DISPLAY_NAME_MAX) return `Your name must be at most ${DISPLAY_NAME_MAX} characters.`;

  return null;
}
