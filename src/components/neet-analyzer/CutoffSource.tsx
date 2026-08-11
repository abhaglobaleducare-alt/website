'use client';

import { BadgeCheck, CircleDashed } from 'lucide-react';
import type { PredictionResult } from '@/lib/neetPredictor';

/**
 * Provenance footer for a cutoff-driven card. A verified row is traced to a
 * published closing rank; a modelled row is an ABHA office estimate. The two
 * must never look the same to a student.
 */
export default function CutoffSource({ result }: { result: PredictionResult }) {
  if (!result.cutoffSource) return null;
  const verified = result.dataQuality === 'verified';
  const Icon = verified ? BadgeCheck : CircleDashed;

  return (
    <div
      className={`mt-4 flex items-start gap-2 rounded-xl border px-3 py-2 text-xs leading-relaxed ${
        verified ? 'border-emerald-200 bg-emerald-50/70 text-emerald-800' : 'border-slate-200 bg-slate-50 text-navy-500'
      }`}
    >
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>
        <strong className="font-semibold">{verified ? 'Verified cutoff' : 'Estimated cutoff'}:</strong>{' '}
        {result.cutoffSource}.
      </span>
    </div>
  );
}
