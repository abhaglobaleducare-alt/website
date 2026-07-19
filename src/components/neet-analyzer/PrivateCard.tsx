'use client';

import { Building2, GraduationCap } from 'lucide-react';
import type { PredictionResult } from '@/lib/neetPredictor';
import { formatINR } from '@/lib/neetPredictor';
import { chanceMeta } from './_shared';
import ProbabilityMeter from './ProbabilityMeter';

/** Shared card for the two fee-driven Indian routes: private & deemed. */
export default function PrivateCard({
  result,
  variant = 'private',
}: {
  result: PredictionResult;
  variant?: 'private' | 'deemed';
}) {
  const meta = chanceMeta[result.chance];
  const Icon = variant === 'deemed' ? GraduationCap : Building2;
  return (
    <div className={`rounded-2xl border ${meta.border} bg-white p-6 shadow-card`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-primary-gold">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold leading-tight text-primary-navy">{result.title}</h3>
            <span className={`text-xs font-bold ${meta.text}`}>{meta.label}</span>
          </div>
        </div>
        {result.costTotal ? (
          <div className="text-right">
            <p className="text-xs text-navy-400">{result.costLabel}</p>
            <p className="font-bold text-primary-navy">{formatINR(result.costTotal)}</p>
          </div>
        ) : null}
      </div>

      <p className="mt-4 font-semibold text-primary-navy">{result.headline}</p>
      <p className="mt-1 text-sm leading-relaxed text-navy-500">{result.detail}</p>

      <div className="mt-4">
        <ProbabilityMeter value={result.probability} chance={result.chance} label="Admission openness" />
      </div>
    </div>
  );
}
