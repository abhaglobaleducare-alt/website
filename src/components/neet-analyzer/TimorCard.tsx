'use client';

import type { AbroadResult } from '@/lib/neetPredictor';
import AbroadCard from './AbroadCard';

/** Timor-Leste — Nalanda College of Medicine, Dili. Most budget-friendly route. */
export default function TimorCard({ result }: { result: AbroadResult }) {
  const timor = result.options.find((o) => o.country === 'Timor-Leste');
  if (!timor) return null;
  return <AbroadCard option={timor} eyebrow="Most budget-friendly route" />;
}
