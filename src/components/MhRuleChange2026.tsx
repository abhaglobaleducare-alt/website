'use client';

import { AlertTriangle, CheckCircle2, XCircle, MessageCircleQuestion, Info } from 'lucide-react';
import { MH_2026_RULE_CHANGE as N } from '@/data/neetPredictorData';

/**
 * Maharashtra's 23 July 2026 admission-rule change, with the correction to the
 * "management quota abolished" misreading attached to it.
 *
 * The myth/truth block is the reason this component exists — the announcement
 * on its own is routinely misread in a way that changes family planning, so the
 * two must always ship together. Content lives in the data file so the analyzer
 * and every NEET Zone page render one identical version.
 */
export default function MhRuleChange2026({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-3xl border-2 border-amber-300 bg-amber-50/60 shadow-card ${
        compact ? 'p-5' : 'p-6 sm:p-8'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
          <AlertTriangle className="h-5 w-5 text-amber-700" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Important note</p>
          <h3 className="font-playfair text-xl font-bold leading-tight text-primary-navy sm:text-2xl">{N.title}</h3>
          <p className="mt-1 text-xs text-navy-500">{N.source}</p>
        </div>
      </div>

      {/* What actually changed */}
      <ul className="mt-5 space-y-2.5">
        {N.confirmed.map((c) => (
          <li key={c} className="flex items-start gap-2.5 text-sm leading-relaxed text-navy-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{c}</span>
          </li>
        ))}
      </ul>

      {/* The correction — the reason this note exists */}
      <div className="mt-5 rounded-2xl border border-rose-200 bg-white p-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
          <XCircle className="h-4 w-4" /> {N.mythTitle}
        </p>
        <p className="mt-2 text-sm font-semibold text-primary-navy">{N.myth}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{N.truth}</p>
      </div>

      {/* Counselling-desk answer */}
      <div className="mt-4 rounded-2xl border border-navy-100 bg-white p-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-400">
          <MessageCircleQuestion className="h-4 w-4" /> {N.practicalTitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">{N.practical}</p>
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-navy-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{N.caution}</span>
      </p>
    </div>
  );
}
