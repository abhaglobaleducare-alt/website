'use client';

import { MapPin } from 'lucide-react';
import type { PredictionResult } from '@/lib/neetPredictor';
import { money } from '@/lib/neetPredictor';
import { useCurrency } from './currencyContext';
import { chanceMeta } from './_shared';
import ProbabilityMeter from './ProbabilityMeter';
import CutoffSource from './CutoffSource';

export default function StateQuotaCard({ result }: { result: PredictionResult }) {
  const currency = useCurrency();
  const meta = chanceMeta[result.chance];
  return (
    <div className={`rounded-2xl border ${meta.border} bg-white p-6 shadow-card`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-accent-blue">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold leading-tight text-primary-navy">{result.title}</h3>
            <span className={`text-xs font-bold ${meta.text}`}>{meta.label}</span>
          </div>
        </div>
        {result.costTotal ? (
          <div className="text-right">
            <p className="text-xs text-navy-400">{result.costLabel}</p>
            <p className="font-bold text-primary-navy">{money(result.costTotal, currency)}</p>
          </div>
        ) : null}
      </div>

      <p className="mt-4 font-semibold text-primary-navy">{result.headline}</p>
      <p className="mt-1 text-sm leading-relaxed text-navy-500">{result.detail}</p>

      <div className="mt-4">
        <ProbabilityMeter value={result.probability} chance={result.chance} label="Chance of a seat" />
      </div>

      {result.cutoffSource ? <CutoffSource result={result} /> : null}
    </div>
  );
}
