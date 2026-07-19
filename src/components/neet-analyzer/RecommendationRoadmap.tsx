'use client';

import { motion } from 'framer-motion';
import { Target, ArrowRight, ListChecks } from 'lucide-react';
import type { Recommendation, Roadmap } from '@/lib/neetPredictor';

const toneStyles: Record<Recommendation['tone'], string> = {
  positive: 'from-emerald-500 to-emerald-600',
  balanced: 'from-accent-blue to-blue-600',
  action: 'from-primary-gold to-gold-600',
};

export default function RecommendationRoadmap({
  recommendation,
  roadmap,
}: {
  recommendation: Recommendation;
  roadmap: Roadmap;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Verdict */}
      <div className="lg:col-span-2">
        <div className={`h-full rounded-3xl bg-gradient-to-br ${toneStyles[recommendation.tone]} p-6 text-white shadow-lg sm:p-8`}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Target className="h-4 w-4" /> Our Recommendation
          </span>
          <h3 className="mt-4 font-playfair text-2xl font-bold leading-tight sm:text-3xl">{recommendation.verdict}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/90">{recommendation.reasoning}</p>

          <div className="mt-5 rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-white/70">Primary path</p>
            <p className="text-lg font-bold">{recommendation.primary}</p>
          </div>

          {recommendation.backups.length > 0 && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wider text-white/70">Backups</p>
              <ul className="mt-2 space-y-1.5">
                {recommendation.backups.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-white/90">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Roadmap */}
      <div className="lg:col-span-3">
        <div className="h-full rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
          <h3 className="flex items-center gap-2 font-playfair text-2xl font-bold text-primary-navy">
            <ListChecks className="h-6 w-6 text-primary-gold" /> {roadmap.headline}
          </h3>

          <ol className="mt-5 space-y-4">
            {roadmap.steps.map((s, i) => (
              <motion.li
                key={s.order}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex gap-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-navy text-sm font-bold text-white">
                  {s.order}
                </span>
                <div className="flex-1 border-b border-navy-50 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-primary-navy">{s.title}</p>
                    <span className="rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                      {s.timing}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-navy-500">{s.detail}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
