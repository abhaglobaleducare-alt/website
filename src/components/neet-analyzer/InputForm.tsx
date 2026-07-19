'use client';

import { Sparkles } from 'lucide-react';
import { CATEGORIES, STATES, MAX_SCORE, type Category, type StateName } from '@/data/neetPredictorData';
import type { PredictorInputs } from '@/lib/neetPredictor';

interface Props {
  value: PredictorInputs;
  onChange: (next: PredictorInputs) => void;
  onSubmit: () => void;
}

export default function InputForm({ value, onChange, onSubmit }: Props) {
  const set = <K extends keyof PredictorInputs>(k: K, v: PredictorInputs[K]) =>
    onChange({ ...value, [k]: v });

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

        {/* All India Rank (optional) */}
        <div>
          <label htmlFor="neet-air" className="mb-1.5 block text-sm font-semibold text-primary-navy">
            All India Rank <span className="text-navy-300">(optional — if you have it)</span>
          </label>
          <input
            id="neet-air"
            type="number"
            inputMode="numeric"
            min={1}
            value={value.allIndiaRank && value.allIndiaRank > 0 ? value.allIndiaRank : ''}
            onChange={(e) => {
              const air = Number(e.target.value);
              set('allIndiaRank', air > 0 ? air : undefined);
            }}
            placeholder="e.g. 45000"
            className="w-full rounded-xl border border-navy-200 bg-light-gray px-4 py-3 text-lg font-semibold text-primary-navy outline-none transition focus:border-primary-gold focus:ring-2 focus:ring-gold-200"
          />
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

        {/* Budget */}
        <div className="sm:col-span-2">
          <label htmlFor="neet-budget" className="mb-1.5 block text-sm font-semibold text-primary-navy">
            Family Budget for the full course <span className="text-navy-300">(optional · in ₹ Lakh)</span>
          </label>
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
              placeholder="e.g. 40"
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
    </form>
  );
}
