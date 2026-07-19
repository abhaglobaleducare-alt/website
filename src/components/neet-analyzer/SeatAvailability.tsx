'use client';

import { motion } from 'framer-motion';
import { Armchair } from 'lucide-react';
import type { SeatBucket } from '@/data/neetPredictorData';
import { formatRank } from '@/lib/neetPredictor';

export default function SeatAvailability({
  buckets,
  total,
}: {
  buckets: SeatBucket[];
  total: number;
}) {
  const max = Math.max(...buckets.map((b) => b.seats));

  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
      <h3 className="flex items-center gap-2 font-playfair text-2xl font-bold text-primary-navy">
        <Armchair className="h-6 w-6 text-primary-gold" /> Seat Reality Check
      </h3>
      <p className="mt-1 text-sm text-navy-500">
        Roughly <strong className="text-primary-navy">{formatRank(total)}</strong> total MBBS seats across ~824 colleges
        (NMC seat matrix, NEET 2026) for ~20+ lakh aspirants. Knowing the seat matrix is the first step to a realistic
        plan.
      </p>

      <div className="mt-5 space-y-4">
        {buckets.map((b, i) => (
          <div key={b.type}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-semibold text-primary-navy">{b.type}</span>
              <span className="font-bold text-navy-500">{formatRank(b.seats)}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-blue to-blue-400"
                initial={{ width: 0 }}
                whileInView={{ width: `${(b.seats / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-1 text-xs text-navy-400">{b.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
