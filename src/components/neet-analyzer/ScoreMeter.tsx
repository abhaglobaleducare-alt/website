'use client';

import { motion } from 'framer-motion';
import { formatRank } from '@/lib/neetPredictor';
import { MAX_SCORE } from '@/data/neetPredictorData';

interface Props {
  score: number;
  rank: number;
  percentile: number;
}

/** Big radial-ish hero readout: score, estimated AIR, and percentile. */
export default function ScoreMeter({ score, rank, percentile }: Props) {
  const pct = Math.max(0, Math.min(100, (score / MAX_SCORE) * 100));

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
          <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Estimated AIR</p>
          <p className="mt-1 font-playfair text-5xl font-bold text-accent-blue">{formatRank(rank)}</p>
          <p className="mt-3 text-xs text-navy-400">All India Rank (approx.)</p>
        </div>

        <div className="text-center sm:pl-6">
          <p className="text-xs font-bold uppercase tracking-wider text-navy-400">Percentile</p>
          <p className="mt-1 font-playfair text-5xl font-bold text-emerald-600">{percentile.toFixed(2)}</p>
          <p className="mt-3 text-xs text-navy-400">Better than most candidates</p>
        </div>
      </div>
    </div>
  );
}
