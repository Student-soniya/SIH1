import React from 'react';

/**
 * Marks a field group whose values are unverified sample data.
 *
 * The condition is `record.isIllustrative !== false`, deliberately — not
 * `=== true`. A record that omits the flag entirely (an older cached payload, a
 * hand-rolled fixture, a fallback that was never updated) is treated as
 * illustrative and badged. Only an explicit `false`, which the API sets solely
 * after an admin has recorded a verification reference and date, removes the
 * badge. Failing safe here is the whole point: a beneficiary must never mistake
 * an invented clause number or interest rate for official guidance (R2.3, R2.4).
 *
 * @param {object}  props
 * @param {object}  props.record  Scheme or ChannelPartner as received from the API.
 * @param {string} [props.className] Extra classes for spacing at the call site.
 */
export default function IllustrativeBadge({ record, className = '' }) {
  if (record && record.isIllustrative === false) return null;

  const provenance =
    (record && record.dataProvenance) ||
    'Illustrative sample value pending verification against current official NSFDC guidelines.';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-amber-400 bg-amber-50 px-1.5 py-0.5 align-middle text-[10px] font-semibold leading-none text-amber-800 ${className}`}
      title={provenance}
      aria-label={provenance}
      data-testid="illustrative-badge"
    >
      <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 shrink-0 fill-current" aria-hidden="true">
        <path d="M8 1.5 15 14H1L8 1.5Zm0 4.2a.75.75 0 0 0-.75.75v2.8a.75.75 0 0 0 1.5 0V6.45A.75.75 0 0 0 8 5.7Zm0 6.8a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z" />
      </svg>
      Illustrative data — not verified
    </span>
  );
}

/**
 * True when any record in the list still carries (or omits) the illustrative flag.
 * Used by the application pack to decide whether the channel-partner confirmation
 * statement is required (R2.8).
 */
export function anyIllustrative(records) {
  return (records || []).some((r) => r && r.isIllustrative !== false);
}
