import React, { useRef, useEffect } from 'react';

/**
 * 6-Box OTP Input with automatic focus shift, backspace navigation, and clipboard paste support.
 */
export default function OtpInputBoxes({
  value = '',
  onChange,
  onComplete,
  disabled = false,
  hasError = false,
  autoFocus = true,
  idPrefix = 'otp-cell'
}) {
  const inputRefs = useRef([]);

  // Ensure digits array always has 6 items
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && !disabled && inputRefs.current[0]) {
      // Find first empty cell or focus first cell
      const firstEmptyIndex = digits.findIndex(d => !d);
      const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
      inputRefs.current[targetIndex]?.focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (index, e) => {
    const rawChar = e.target.value;
    // Take only the last numeric digit typed
    const cleanDigit = rawChar.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = cleanDigit;
    const nextOtp = newDigits.join('');
    onChange(nextOtp);

    // Auto-advance focus to next cell
    if (cleanDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger onComplete when 6 digits are reached
    if (nextOtp.length === 6 && onComplete) {
      onComplete(nextOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Current cell empty: focus previous and clear it
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (disabled) return;

    const pastedData = e.clipboardData?.getData('text') || '';
    const cleanDigits = pastedData.replace(/\D/g, '').slice(0, 6);

    if (cleanDigits.length > 0) {
      onChange(cleanDigits);
      const focusIndex = Math.min(cleanDigits.length, 5);
      inputRefs.current[focusIndex]?.focus();

      if (cleanDigits.length === 6 && onComplete) {
        onComplete(cleanDigits);
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 max-w-sm mx-auto" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, index) => {
        const isFilled = Boolean(digits[index]);
        return (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            id={`${idPrefix}-${index}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            disabled={disabled}
            value={digits[index]}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${index + 1} of 6-digit verification code`}
            className={`w-11 h-13 sm:w-12 sm:h-14 min-w-[42px] sm:min-w-[48px] min-h-[48px] text-center text-lg sm:text-xl font-mono font-black rounded-xl border transition-all select-none outline-none ${
              hasError
                ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-300'
                : isFilled
                ? 'border-[#0D2A4A] bg-white text-slate-900 shadow-xs'
                : 'border-slate-300 bg-slate-50/80 text-slate-800 hover:border-slate-400 focus:border-[#0D2A4A] focus:bg-white focus:ring-2 focus:ring-slate-200'
            } disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed`}
          />
        );
      })}
    </div>
  );
}
