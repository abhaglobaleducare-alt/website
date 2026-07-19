'use client';

import { motion } from 'framer-motion';
import type { Chance } from '@/lib/neetPredictor';
import { chanceMeta } from './_shared';

interface Props {
  /** 0–100 */
  value: number;
  chance: Chance;
  label?: string;
  size?: 'sm' | 'md';
}

/** Horizontal probability bar with animated fill and a % readout. */
export default function ProbabilityMeter({ value, chance, label, size = 'md' }: Props) {
  const meta = chanceMeta[chance];
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-navy-500">
          <span>{label}</span>
          <span className={meta.text}>{clamped}%</span>
        </div>
      )}
      <div
        className={`relative w-full overflow-hidden rounded-full bg-slate-100 ${size === 'sm' ? 'h-2' : 'h-3'}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Probability'}
      >
        <motion.div
          className={`h-full rounded-full ${meta.bar}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${clamped}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
