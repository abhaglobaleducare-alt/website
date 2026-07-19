'use client';

import type { AbroadResult } from '@/lib/neetPredictor';
import AbroadCard from './AbroadCard';

/** Georgia — ABHA's flagship abroad option (with the private-vs-Georgia savings banner). */
export default function GeorgiaCard({ result }: { result: AbroadResult }) {
  const georgia = result.options.find((o) => o.country === 'Georgia');
  if (!georgia) return null;
  return <AbroadCard option={georgia} showSavings eyebrow="ABHA's recommended safety net" />;
}
