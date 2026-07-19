'use client';

import { TrendingDown } from 'lucide-react';
import { PRIVATE_INDIA_TYPICAL_INR, GEORGIA_SAVINGS_LABEL, GEORGIA_TUITION_FROM_INR } from '@/lib/neetPredictor';

const lakh = (inr: number) => `₹${Math.round(inr / 100_000)}L`;

/**
 * "Indian private ₹80L+ · Georgia tuition from ₹21L · Save up to ₹55L".
 * `variant="banner"` for cards, `variant="inline"` for a one-line strip.
 */
export default function SavingsHighlight({ variant = 'banner' }: { variant?: 'banner' | 'inline' }) {
  const priv = `${lakh(PRIVATE_INDIA_TYPICAL_INR)}+`;
  const geo = lakh(GEORGIA_TUITION_FROM_INR);
  const save = GEORGIA_SAVINGS_LABEL;

  if (variant === 'inline') {
    return (
      <p className="text-sm font-semibold text-emerald-700">
        <TrendingDown className="mr-1 inline h-4 w-4" />
        Indian private {priv} · Georgia tuition from {geo} —{' '}
        <span className="text-emerald-800">Save up to {save}*</span>
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-800">
          <TrendingDown className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wide">Cost advantage</span>
        </div>
        <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-black text-white">
          Save up to {save}*
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
        <span className="text-navy-500">
          Indian private MBBS <strong className="text-rose-600 line-through">{priv}</strong>
        </span>
        <span className="text-navy-400">·</span>
        <span className="text-navy-500">
          Georgia tuition <strong className="text-emerald-700">from {geo}</strong>
        </span>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-navy-400">
        *Conservative saving vs a typical Indian private MBBS total (~{lakh(PRIVATE_INDIA_TYPICAL_INR)}), based on Georgia
        tuition. Full Georgia all-inclusive cost (₹44L–₹58L) is shown in the breakdown.
      </p>
    </div>
  );
}
