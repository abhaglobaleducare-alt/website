'use client';

import { motion } from 'framer-motion';
import { Gauge, Info } from 'lucide-react';
import type { ConfidenceScore as ConfidenceScoreType } from '@/lib/neetPredictor';

const levelColor: Record<ConfidenceScoreType['level'], { ring: string; text: string }> = {
  High: { ring: 'text-emerald-500', text: 'text-emerald-600' },
  Medium: { ring: 'text-amber-500', text: 'text-amber-600' },
  Low: { ring: 'text-orange-500', text: 'text-orange-600' },
};

export default function ConfidenceScore({ confidence }: { confidence: ConfidenceScoreType }) {
  const { score, level, reasons } = confidence;
  const c = levelColor[level];
  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Dial */}
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#E8EBF0" strokeWidth="8" />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              className={c.ring}
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              whileInView={{ strokeDashoffset: offset }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute text-center">
            <p className={`font-playfair text-3xl font-bold ${c.text}`}>{score}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Confidence</p>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="flex items-center gap-2 font-playfair text-2xl font-bold text-primary-navy">
            <Gauge className="h-6 w-6 text-primary-gold" /> Prediction Confidence: <span className={c.text}>{level}</span>
          </h3>
          <p className="mt-1 text-sm text-navy-500">
            How reliable this estimate is, given your inputs. Higher means the prediction is more stable.
          </p>
          <ul className="mt-4 space-y-2">
            {reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-navy-500">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-300" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
