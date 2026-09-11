import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, Save, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { getAdminRules, saveAdminRules, previewAdminRules } from '../api';

/**
 * Rule_Store editor (R7.10, R7.11, R7.12).
 *
 * THE BOUNDS ARE MIRRORED, NOT OWNED. Every bound used to disable the save control arrives from
 * `GET /api/admin/rules` as `bounds`, which the server projects from its own `RuleBounds`
 * constants. Retyping 18/75/0.01 here would create a second declaration free to drift from the
 * one the server and the database enforce — and the failure mode is the nasty direction: a
 * frontend bound looser than the server's turns a clear "save disabled" into a confusing 400.
 * Client-side checks exist to keep the administrator from submitting a doomed request; the server
 * validates everything again regardless.
 *
 * THE PREVIEW IS SERVER-COMPUTED. `POST /api/admin/rules/preview` runs the real matching engine
 * twice, once with stored values and once with the pending ones, and persists nothing. Scoring
 * the sample profile in JavaScript would have avoided a round trip and produced a preview that
 * was free to disagree with the engine it claims to preview.
 */
export default function AdminRuleEditor() {
  const { isAdmin } = useAuth();

  const [payload, setPayload] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSchemeId, setSelectedSchemeId] = useState('');
  const [draftRule, setDraftRule] = useState(null);
  const [draftWeights, setDraftWeights] = useState(null);

  const [saveState, setSaveState] = useState(null);   // { kind: 'ok' | 'error', message }
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewing, setPreviewing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminRules();
      setPayload(data);
      setLoadError(null);

      const first = data.rules?.[0];
      setSelectedSchemeId(first?.schemeId || '');
      setDraftRule(first ? { ...first } : null);
      setDraftWeights({ ...data.weights });
    } catch (err) {
      // No compiled-in rule values stand in for an unreadable store.
      setLoadError(err?.status === 403
        ? 'Rule editing requires an administrator account.'
        : 'Scheme rules could not be loaded. Nothing is shown, because nothing could be retrieved.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  // R7.12 — no rule input, no weight input, no save control without an Admin session. Checked
  // before any request is made, so an unauthorised viewer does not even provoke a 403.
  if (!isAdmin) return null;

  const bounds = payload?.bounds;

  const onRuleField = (field, value) => {
    setDraftRule(prev => ({ ...prev, [field]: value }));
    setPreview(null);
    setSaveState(null);
  };

  const onWeightField = (component, raw) => {
    // Recomputed on every keystroke (R7.10): an empty box counts as 0 so the running sum is
    // always a number and the save control never enables on a blank field.
    const next = raw === '' ? '' : Number(raw);
    setDraftWeights(prev => ({ ...prev, [component]: next }));
    setPreview(null);
    setSaveState(null);
  };

  const weightSum = useMemo(() => {
    if (!draftWeights) return 0;
    return Object.values(draftWeights).reduce((total, v) => total + (Number(v) || 0), 0);
  }, [draftWeights]);

  const selectRule = (schemeId) => {
    const row = payload.rules.find(r => r.schemeId === schemeId);
    setSelectedSchemeId(schemeId);
    setDraftRule(row ? { ...row } : null);
    setPreview(null);
    setSaveState(null);
  };

  /** Field-level bound and cross-field violations, mirroring R7.1 and R7.7. */
  const violations = useMemo(() => {
    if (!draftRule || !draftWeights || !bounds) return ['Rules have not finished loading.'];

    const problems = [];
    const num = (v) => (v === '' || v === null || v === undefined ? NaN : Number(v));

    const range = (label, value, min, max) => {
      const n = num(value);
      if (Number.isNaN(n)) problems.push(`${label} is required.`);
      else if (n < min || n > max) problems.push(`${label} ${n} is outside ${min}–${max}.`);
    };

    range('Minimum age', draftRule.minimumAge, bounds.minAge, bounds.maxAge);
    range('Maximum age', draftRule.maximumAge, bounds.minAge, bounds.maxAge);
    range('Income limit', draftRule.incomeLimit, bounds.minIncomeLimit, bounds.maxIncomeLimit);
    range('Minimum project cost', draftRule.minimumProjectCost, bounds.minProjectCost, bounds.maxProjectCost);
    range('Maximum project cost', draftRule.maximumProjectCost, bounds.minProjectCost, bounds.maxProjectCost);
    range('Interest rate', draftRule.interestRate, bounds.minInterestRate, bounds.maxInterestRate);
    range('Maximum tenure (months)', draftRule.maximumTenureMonths, bounds.minTenureMonths, bounds.maxTenureMonths);
    range('Moratorium (months)', draftRule.moratoriumMonths, bounds.minMoratoriumMonths, bounds.maxMoratoriumMonths);

    if (num(draftRule.minimumAge) > num(draftRule.maximumAge)) {
      problems.push('Minimum age exceeds maximum age.');
    }
    if (num(draftRule.minimumProjectCost) > num(draftRule.maximumProjectCost)) {
      problems.push('Minimum project cost exceeds maximum project cost.');
    }
    if (num(draftRule.moratoriumMonths) > num(draftRule.maximumTenureMonths)) {
      problems.push('Moratorium exceeds maximum tenure.');
    }
    if (!bounds.genderRestrictions.includes(draftRule.genderRestriction)) {
      problems.push(`Gender restriction must be one of ${bounds.genderRestrictions.join(', ')}.`);
    }

    const types = listOf(draftRule.eligibleBusinessTypes);
    if (types.length < bounds.minEligibleBusinessTypes || types.length > bounds.maxEligibleBusinessTypes) {
      problems.push(`Eligible business types: ${types.length} entered; ${bounds.minEligibleBusinessTypes}–${bounds.maxEligibleBusinessTypes} required.`);
    }

    const categories = listOf(draftRule.eligibleCategories);
    if (categories.length < bounds.minEligibleCategories || categories.length > bounds.maxEligibleCategories) {
      problems.push(`Eligible categories: ${categories.length} entered; ${bounds.minEligibleCategories}–${bounds.maxEligibleCategories} required.`);
    }

    for (const component of bounds.weightComponents) {
      const value = draftWeights[component];
      if (value === '' || Number.isNaN(Number(value))) problems.push(`Weight ${component} is required.`);
      else if (Number(value) < bounds.minWeight || Number(value) > bounds.maxWeight) {
        problems.push(`Weight ${component} ${value} is outside ${bounds.minWeight}–${bounds.maxWeight}.`);
      }
    }

    if (weightSum !== bounds.requiredWeightSum) {
      problems.push(`Weights sum to ${weightSum}; exactly ${bounds.requiredWeightSum} is required.`);
    }

    return problems;
  }, [draftRule, draftWeights, bounds, weightSum]);

  const canSubmit = violations.length === 0 && !saving && !previewing;

  const buildRequest = () => ({
    rule: {
      schemeId: draftRule.schemeId,
      minimumAge: Number(draftRule.minimumAge),
      maximumAge: Number(draftRule.maximumAge),
      incomeLimit: Number(draftRule.incomeLimit),
      minimumProjectCost: Number(draftRule.minimumProjectCost),
      maximumProjectCost: Number(draftRule.maximumProjectCost),
      eligibleBusinessTypes: listOf(draftRule.eligibleBusinessTypes),
      eligibleCategories: listOf(draftRule.eligibleCategories),
      genderRestriction: draftRule.genderRestriction,
      interestRate: Number(draftRule.interestRate),
      maximumTenureMonths: Number(draftRule.maximumTenureMonths),
      moratoriumMonths: Number(draftRule.moratoriumMonths)
    },
    weights: Object.fromEntries(bounds.weightComponents.map(c => [c, Number(draftWeights[c])]))
  });

  const handlePreview = async () => {
    setPreviewing(true);
    setSaveState(null);
    try {
      setPreview(await previewAdminRules(buildRequest()));
    } catch (err) {
      setPreview(null);
      setSaveState({ kind: 'error', message: err?.message || 'The preview could not be computed.' });
    } finally {
      setPreviewing(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveAdminRules(buildRequest());
      setSaveState({
        kind: 'ok',
        message: result.changedFieldCount === 0
          ? 'Saved. No field differed from the stored values, so nothing was changed and nothing was audited.'
          : `Saved. ${result.changedFieldCount} field(s) changed: ${result.changedFields.join(', ')}.`
      });
      setPreview(null);
      await load();
    } catch (err) {
      // The server's message names the offending field and value — shown as-is.
      setSaveState({ kind: 'error', message: err?.message || 'The save was rejected.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-xs text-slate-600">
        Loading scheme rules and scoring weights…
      </div>
    );
  }

  if (loadError) {
    return (
      <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-2xl p-4">
        {loadError}
      </div>
    );
  }

  if (!draftRule || !draftWeights) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div className="flex justify-between items-start border-b border-slate-100 pb-3 gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Eligibility Rules &amp; Scoring Weights</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Stored in the database and read by the matching engine within 60 seconds of a save. No redeployment.
          </p>
        </div>

        <select
          aria-label="Scheme"
          value={selectedSchemeId}
          onChange={(e) => selectRule(e.target.value)}
          className="text-xs font-mono border border-slate-300 rounded-lg px-2 py-1.5"
        >
          {payload.rules.map(r => <option key={r.schemeId} value={r.schemeId}>{r.schemeId}</option>)}
        </select>
      </div>

      {/* ---------------------------------------------------------------- rule fields */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <NumberField label="Minimum age" value={draftRule.minimumAge} min={bounds.minAge} max={bounds.maxAge}
                     onChange={v => onRuleField('minimumAge', v)} />
        <NumberField label="Maximum age" value={draftRule.maximumAge} min={bounds.minAge} max={bounds.maxAge}
                     onChange={v => onRuleField('maximumAge', v)} />
        <NumberField label="Income limit (Rs)" value={draftRule.incomeLimit} step="0.01"
                     min={bounds.minIncomeLimit} max={bounds.maxIncomeLimit}
                     onChange={v => onRuleField('incomeLimit', v)} />
        <NumberField label="Interest rate (% p.a.)" value={draftRule.interestRate} step="0.01"
                     min={bounds.minInterestRate} max={bounds.maxInterestRate}
                     onChange={v => onRuleField('interestRate', v)} />
        <NumberField label="Min project cost (Rs)" value={draftRule.minimumProjectCost} step="0.01"
                     min={bounds.minProjectCost} max={bounds.maxProjectCost}
                     onChange={v => onRuleField('minimumProjectCost', v)} />
        <NumberField label="Max project cost (Rs)" value={draftRule.maximumProjectCost} step="0.01"
                     min={bounds.minProjectCost} max={bounds.maxProjectCost}
                     onChange={v => onRuleField('maximumProjectCost', v)} />
        <NumberField label="Max tenure (months)" value={draftRule.maximumTenureMonths}
                     min={bounds.minTenureMonths} max={bounds.maxTenureMonths}
                     onChange={v => onRuleField('maximumTenureMonths', v)} />
        <NumberField label="Moratorium (months)" value={draftRule.moratoriumMonths}
                     min={bounds.minMoratoriumMonths} max={bounds.maxMoratoriumMonths}
                     onChange={v => onRuleField('moratoriumMonths', v)} />

        <label className="text-xs space-y-1">
          <span className="font-bold uppercase text-slate-400 block">Gender restriction</span>
          <select
            value={draftRule.genderRestriction}
            onChange={(e) => onRuleField('genderRestriction', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-2 py-1.5"
          >
            {bounds.genderRestrictions.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
      </div>

      <TextListField
        label={`Eligible business types (${bounds.minEligibleBusinessTypes}–${bounds.maxEligibleBusinessTypes}, comma separated)`}
        value={draftRule.eligibleBusinessTypes}
        onChange={v => onRuleField('eligibleBusinessTypes', v)}
      />
      <TextListField
        label={`Eligible applicant categories (${bounds.minEligibleCategories}–${bounds.maxEligibleCategories}, comma separated)`}
        value={draftRule.eligibleCategories}
        onChange={v => onRuleField('eligibleCategories', v)}
      />

      {/* ------------------------------------------------------------------- weights */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold uppercase text-slate-500">Scoring weights</h4>
          <span
            data-testid="weight-sum"
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              weightSum === bounds.requiredWeightSum
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            Sum: {weightSum} / {bounds.requiredWeightSum}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {bounds.weightComponents.map(component => (
            <NumberField
              key={component}
              label={component}
              value={draftWeights[component]}
              min={bounds.minWeight}
              max={bounds.maxWeight}
              onChange={v => onWeightField(component, v)}
            />
          ))}
        </div>
      </div>

      {violations.length > 0 && (
        <ul role="alert" className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
          {violations.map((v, i) => (
            <li key={i} className="flex items-start space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{v}</span>
            </li>
          ))}
        </ul>
      )}

      {saveState && (
        <div
          role="alert"
          className={`text-xs rounded-xl p-3 border ${
            saveState.kind === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {saveState.message}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handlePreview}
          disabled={!canSubmit}
          className="flex items-center space-x-1.5 border border-slate-300 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{previewing ? 'Computing…' : 'Preview against sample profile'}</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!canSubmit}
          className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving…' : 'Save rules'}</span>
        </button>
      </div>

      {preview && <PreviewPanel preview={preview} />}
    </div>
  );
}

/** Pending versus stored, side by side, for one stored sample profile (R7.11). */
function PreviewPanel({ preview }) {
  const storedById = new Map(preview.stored.map(r => [r.schemeId, r]));

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-3">
      <h4 className="text-xs font-bold uppercase text-slate-500">
        Preview — sample profile {preview.sampleProfile?.id} ({preview.sampleProfile?.businessType},{' '}
        {preview.sampleProfile?.location}). Nothing is saved.
      </h4>

      {preview.pending.map(pendingResult => {
        const storedResult = storedById.get(pendingResult.schemeId);
        const delta = storedResult ? pendingResult.matchScore - storedResult.matchScore : null;

        return (
          <div key={pendingResult.schemeId} className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-slate-900">{pendingResult.schemeId}</span>
              <span className="font-semibold text-slate-700">
                stored {storedResult ? storedResult.matchScore : '—'} → pending {pendingResult.matchScore}
                {delta !== null && delta !== 0 && (
                  <span className={delta > 0 ? 'text-emerald-700 ml-1' : 'text-rose-700 ml-1'}>
                    ({delta > 0 ? '+' : ''}{delta})
                  </span>
                )}
                {delta === 0 && <span className="text-slate-400 ml-1">(no change)</span>}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <Explanation title="Stored rules" result={storedResult} />
              <Explanation title="Pending rules" result={pendingResult} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Explanation({ title, result }) {
  if (!result) return <div className="text-slate-400">{title}: not scored.</div>;

  return (
    <div className="space-y-1">
      <div className="font-bold text-slate-500 uppercase">{title}</div>
      <div className="text-slate-600">
        Recommended: {result.isRecommended ? 'yes' : 'no'}
      </div>
      <ul className="space-y-0.5">
        {result.positiveReasons.map((reason, i) => (
          <li key={`p${i}`} className="text-emerald-800">+ {reason}</li>
        ))}
        {result.negativeReasons.map((reason, i) => (
          <li key={`n${i}`} className="text-rose-800">− {reason}</li>
        ))}
        {result.missingDocuments.map((doc, i) => (
          <li key={`m${i}`} className="text-amber-800">! {doc}</li>
        ))}
      </ul>
    </div>
  );
}

function NumberField({ label, value, min, max, step = '1', onChange }) {
  const numeric = value === '' ? NaN : Number(value);
  const outOfBounds = Number.isNaN(numeric) || numeric < min || numeric > max;

  return (
    <label className="text-xs space-y-1">
      <span className="font-bold uppercase text-slate-400 block truncate" title={label}>{label}</span>
      <input
        type="number"
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-lg px-2 py-1.5 font-mono ${
          outOfBounds ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
        }`}
      />
      <span className="text-[10px] text-slate-400 block">{min} – {max}</span>
    </label>
  );
}

/**
 * A comma-separated text box over a `List<string>`. Order is preserved because the backend
 * comparer treats a reorder as a change and audits it as one.
 */
function TextListField({ label, value, onChange }) {
  const text = Array.isArray(value) ? value.join(', ') : String(value ?? '');

  return (
    <label className="text-xs space-y-1 block">
      <span className="font-bold uppercase text-slate-400 block">{label}</span>
      <input
        type="text"
        value={text}
        onChange={(e) => onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
        className="w-full border border-slate-300 rounded-lg px-2 py-1.5"
      />
    </label>
  );
}

function listOf(value) {
  if (Array.isArray(value)) return value.map(s => String(s).trim()).filter(Boolean);
  return String(value ?? '').split(',').map(s => s.trim()).filter(Boolean);
}
