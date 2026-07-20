'use client';

import { useState } from 'react';
import { Sparkles, Info, BadgeCheck } from 'lucide-react';
import { CATEGORIES, STATES, MAX_SCORE, type Category, type StateName } from '@/data/neetPredictorData';
import { CALIBRATION_LABEL, type PredictorInputs } from '@/lib/neetPredictor';
import {
  BUDGET_LABEL,
  BUDGET_LABEL_OPTIONAL,
  BUDGET_HELPER,
  BUDGET_FORMULA_PARTS,
  BUDGET_FORMULA_TOTAL,
  BUDGET_PLACEHOLDER,
  BUDGET_ADVISORY,
  BUDGET_ADVISORY_BOLD,
} from '@/data/advisoryCopy';

interface Props {
  value: PredictorInputs;
  onChange: (next: PredictorInputs) => void;
  onSubmit: () => void;
}

/** Render `text` with the given phrases wrapped in <strong> (for the advisory). */
function renderWithBold(text: string, phrases: string[]) {
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'g');
  return text.split(re).map((seg, i) =>
    phrases.includes(seg) ? (
      <strong key={i} className="font-bold text-primary-navy">
        {seg}
      </strong>
    ) : (
      <span key={i}>{seg}</span>
    ),
  );
}

export default function InputForm({ value, onChange, onSubmit }: Props) {
  const set = <K extends keyof PredictorInputs>(k: K, v: PredictorInputs[K]) =>
    onChange({ ...value, [k]: v });

  // AIR is required by default; this escape hatch makes it optional and falls
  // back to the 2026-calibrated estimate.
  const [airUnknown, setAirUnknown] = useState(false);

  // Budget is stored in ₹ internally but entered in ₹ Lakh for convenience.
  const budgetLakh = value.budget ? Math.round(value.budget / 100_000) : '';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Score */}
        <div>
          <label htmlFor="neet-score" className="mb-1.5 block text-sm font-semibold text-primary-navy">
            NEET Score <span className="text-navy-300">(out of {MAX_SCORE})</span>
          </label>
          <input
            id="neet-score"
            type="number"
            inputMode="numeric"
            min={-180}
            max={MAX_SCORE}
            required
            value={Number.isFinite(value.score) ? value.score : ''}
            onChange={(e) => set('score', Number(e.target.value))}
            placeholder="e.g. 585"
            className="w-full rounded-xl border border-navy-200 bg-light-gray px-4 py-3 text-lg font-semibold text-primary-navy outline-none transition focus:border-primary-gold focus:ring-2 focus:ring-gold-200"
          />
        </div>

        {/* All India Rank (required, with escape hatch) */}
        <div>
          <label htmlFor="neet-air" className="mb-1.5 block text-sm font-semibold text-primary-navy">
            All India Rank {airUnknown ? <span className="text-navy-300">(optional)</span> : <span className="text-primary-gold">*</span>}
          </label>
          <input
            id="neet-air"
            type="number"
            inputMode="numeric"
            min={1}
            required={!airUnknown}
            disabled={airUnknown}
            value={value.allIndiaRank && value.allIndiaRank > 0 ? value.allIndiaRank : ''}
            onChange={(e) => {
              const air = Number(e.target.value);
              set('allIndiaRank', air > 0 ? air : undefined);
            }}
            placeholder="e.g. 45000"
            className="w-full rounded-xl border border-navy-200 bg-light-gray px-4 py-3 text-lg font-semibold text-primary-navy outline-none transition focus:border-primary-gold focus:ring-2 focus:ring-gold-200 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-navy-400">
            Enter the AIR printed on your NEET 2026 rank card (neet.nta.nic.in).
          </p>
          <label className="mt-1.5 flex items-center gap-2 text-xs font-medium text-navy-500">
            <input
              type="checkbox"
              checked={airUnknown}
              onChange={(e) => {
                setAirUnknown(e.target.checked);
                if (e.target.checked) set('allIndiaRank', undefined);
              }}
              className="h-3.5 w-3.5 accent-primary-gold"
            />
            I don&apos;t know my AIR yet
          </label>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="neet-category" className="mb-1.5 block text-sm font-semibold text-primary-navy">
            Category
          </label>
          <select
            id="neet-category"
            value={value.category}
            onChange={(e) => set('category', e.target.value as Category)}
            className="w-full rounded-xl border border-navy-200 bg-light-gray px-4 py-3 font-medium text-primary-navy outline-none transition focus:border-primary-gold focus:ring-2 focus:ring-gold-200"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label htmlFor="neet-state" className="mb-1.5 block text-sm font-semibold text-primary-navy">
            Home State (domicile)
          </label>
          <select
            id="neet-state"
            value={value.state}
            onChange={(e) => set('state', e.target.value as StateName)}
            className="w-full rounded-xl border border-navy-200 bg-light-gray px-4 py-3 font-medium text-primary-navy outline-none transition focus:border-primary-gold focus:ring-2 focus:ring-gold-200"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Category Rank — reserved categories only */}
        {value.category !== 'General' && (
          <div className="sm:col-span-2">
            <label htmlFor="neet-catrank" className="mb-1.5 block text-sm font-semibold text-primary-navy">
              Category Rank <span className="text-navy-300">(optional — if on your rank card)</span>
            </label>
            <input
              id="neet-catrank"
              type="number"
              inputMode="numeric"
              min={1}
              value={value.categoryRank && value.categoryRank > 0 ? value.categoryRank : ''}
              onChange={(e) => {
                const cr = Number(e.target.value);
                set('categoryRank', cr > 0 ? cr : undefined);
              }}
              placeholder="e.g. 8500"
              className="w-full rounded-xl border border-navy-200 bg-light-gray px-4 py-3 font-medium text-primary-navy outline-none transition focus:border-primary-gold focus:ring-2 focus:ring-gold-200"
            />
            <p className="mt-1 text-xs text-navy-400">Used for reserved-seat guidance (SC/ST/OBC/EWS).</p>
          </div>
        )}

        {/* Budget */}
        <div className="sm:col-span-2">
          {/* Transparency advisory (above the field) */}
          <div className="mb-4 rounded-xl border-l-4 border-[#C6962E] bg-[#C6962E]/10 p-3.5">
            <p className="flex gap-2 text-xs leading-relaxed text-navy-600 sm:text-[13px]">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#C6962E]" />
              <span>{renderWithBold(BUDGET_ADVISORY, BUDGET_ADVISORY_BOLD)}</span>
            </p>
          </div>

          <label htmlFor="neet-budget" className="mb-1 block text-sm font-semibold text-primary-navy">
            {BUDGET_LABEL} <span className="text-navy-300">({BUDGET_LABEL_OPTIONAL})</span>
          </label>
          <p className="mb-2 text-xs leading-relaxed text-navy-500">{BUDGET_HELPER}</p>

          {/* Formula strip */}
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-navy-400">
            {BUDGET_FORMULA_PARTS.map((part, i) => (
              <span key={part} className="inline-flex items-center gap-1.5">
                <span className="rounded-md bg-light-gray px-2 py-0.5">{part}</span>
                {i < BUDGET_FORMULA_PARTS.length - 1 && <span className="text-navy-300">+</span>}
              </span>
            ))}
            <span className="text-navy-300">=</span>
            <span className="rounded-md bg-gold-50 px-2 py-0.5 font-bold text-gold-700">{BUDGET_FORMULA_TOTAL}</span>
          </div>

          <div className="relative">
            <input
              id="neet-budget"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={budgetLakh}
              onChange={(e) => {
                const lakh = Number(e.target.value);
                set('budget', lakh > 0 ? lakh * 100_000 : undefined);
              }}
              placeholder={BUDGET_PLACEHOLDER}
              className="w-full rounded-xl border border-navy-200 bg-light-gray px-4 py-3 pr-16 font-medium text-primary-navy outline-none transition focus:border-primary-gold focus:ring-2 focus:ring-gold-200"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-navy-400">
              Lakh
            </span>
          </div>
          <p className="mt-1 text-xs text-navy-400">Leave blank if you have no fixed budget limit.</p>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-navy to-navy-600 px-6 py-4 text-base font-bold text-white shadow-navy transition-transform duration-300 hover:-translate-y-0.5"
      >
        <Sparkles className="h-5 w-5 text-primary-gold" />
        Analyze My Admission Options
      </button>
      <p className="mt-3 text-center text-xs text-navy-400">
        Free · instant · no sign-up · results computed in your browser
      </p>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-emerald-700">
        <BadgeCheck className="h-4 w-4" /> {CALIBRATION_LABEL}
      </p>
    </form>
  );
}
