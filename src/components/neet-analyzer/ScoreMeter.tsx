'use client';

import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { formatRank, type RankRange, type AirSource } from '@/lib/neetPredictor';
import { MAX_SCORE } from '@/data/neetPredictorData';

interface Props {
  score: number;
  rank: number;
  rankRange: RankRange;
  airSource: AirSource;
  calibrationLabel: string;
  percentile: number;
}

/** Big readout: score, AIR (exact when actual / range when estimated), percentile. */
export default function ScoreMeter({ score, rank, rankRange, airSource, calibrationLabel, percentile }: Props) {
  const pct = Math.max(0, Math.min(100, (score / MAX_SCORE) * 100));
  const isActual = airSource === 'actual';

  const airHeading = isActual ? 'Your AIR' : 'Estimated AIR';
  const airValue = isActual
    ? formatRank(rank)
    : `${formatRank(rankRange.from)}–${formatRank(rankRange.to)}`;
  const airSub = isActual
    ? 'Based on your actual NEET 2026 AIR'
    : rankRange.borderline
      ? 'Qualifying-borderline zone — low precision. Enter your actual AIR for exact guidance.'
      : 'Estimated from the official 2026 result distribution — enter your actual AIR for exact guidance.';

  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-6 sm:grid-cols-3 sm:divide-x sm:divide-navy-100">
        <div className="text-center sm:pr-6">
          <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Your Score</p>
          <p className="mt-1 font-playfair text-5xl font-bold text-primary-navy">
            {score}
            <span className="text-2xl text-navy-300">/{MAX_SCORE}</span>
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-gold to-gold-400"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-wider text-navy-400">{airHeading}</p>
          <p
            className={`mt-1 font-playfair font-bold text-accent-blue ${
              isActual ? 'text-5xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            {isActual ? airValue : `~${airValue}`}
          </p>
          <p className="mt-2 text-[11px] leading-snug text-navy-400">{airSub}</p>
        </div>

        <div className="text-center sm:pl-6">
          <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Percentile</p>
          <p className="mt-1 font-playfair text-5xl font-bold text-emerald-600">{percentile.toFixed(2)}</p>
          <p className="mt-3 text-xs text-navy-400">Better than most candidates</p>
        </div>
      </div>

      <p className="mt-5 flex items-center justify-center gap-1.5 border-t border-navy-100 pt-4 text-xs font-semibold text-emerald-700">
        <BadgeCheck className="h-4 w-4" /> {calibrationLabel}
      </p>
    </div>
  );
}
