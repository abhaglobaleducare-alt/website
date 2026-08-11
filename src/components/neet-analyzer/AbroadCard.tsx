'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ShieldCheck, Info } from 'lucide-react';
import type { AbroadOption } from '@/data/neetPredictorData';
import { money } from '@/lib/neetPredictor';
import SavingsHighlight from './SavingsHighlight';
import { useCurrency } from './currencyContext';

interface Props {
  option: AbroadOption;
  /** show the Indian-private-vs-Georgia savings banner (Georgia only) */
  showSavings?: boolean;
  /** small tag above the title, e.g. "ABHA's recommended safety net" */
  eyebrow?: string;
}

/** Shared presentation for an abroad destination (Georgia / Timor-Leste). */
export default function AbroadCard({ option: o, showSavings, eyebrow }: Props) {
  const currency = useCurrency();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-3xl border border-gold-200 bg-gradient-to-br from-primary-navy to-navy-700 p-6 text-white shadow-navy sm:p-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow && <span className="text-xs font-bold uppercase tracking-wider text-gold-200">{eyebrow}</span>}
          <h3 className="font-playfair text-2xl font-bold text-white">
            {o.flag} MBBS {o.country}
          </h3>
          <p className="text-sm text-navy-200">{o.university}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-300">
            <Clock className="h-3.5 w-3.5" /> {o.durationLabel}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {o.badges.map((b) => (
            <span key={b} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Headline price (currency-aware) */}
      <div className="mt-5 rounded-2xl bg-white/5 p-4 backdrop-blur">
        <p className="text-xs uppercase tracking-wider text-navy-200">Programme fees</p>
        <p className="text-2xl font-bold text-primary-gold sm:text-3xl">
          {o.headlinePrefix} {money(o.headlineFromInr, currency)}
        </p>
        <p className="mt-1 text-sm font-semibold text-white">
          All-inclusive: ~{money(o.allInclusiveFromInr, currency)}
          {o.allInclusiveToInr > o.allInclusiveFromInr ? ` – ${money(o.allInclusiveToInr, currency)}` : ''}{' '}
          <span className="font-normal text-navy-200">({o.allInclusiveSuffix})</span>
        </p>
      </div>

      {/* Trust line (Timor) */}
      {o.trustLine && (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-200">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          {o.trustLine}
        </p>
      )}

      {/* Savings banner (Georgia) */}
      {showSavings && (
        <div className="mt-4">
          <SavingsHighlight variant="banner" />
        </div>
      )}

      {/* Cost lines. Hidden in print: the identical breakdown already appears in
          the Detailed Cost Breakdown section, and printing it twice cost the
          saved report a page per country. */}
      <div className="mt-5 print:hidden">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-navy-200">Cost breakdown</p>
        <ul className="space-y-3">
          {o.costLines.map((l) => (
            <li key={l.label} className="border-b border-white/10 pb-3 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-white">{l.label}</span>
                  <span className="ml-2 inline-flex gap-1 align-middle">
                    {l.oneTime && (
                      <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-navy-100">one-time</span>
                    )}
                    {l.directToCollege && (
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                        direct to college
                      </span>
                    )}
                  </span>
                  {l.sub && <p className="mt-0.5 text-xs text-navy-300">{l.sub}</p>}
                </div>
                <span className="shrink-0 font-bold text-primary-gold">
                  {l.amountInr == null ? 'At actuals' : money(l.amountInr, currency)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Highlights */}
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {o.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-xs text-navy-100">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      {/* Footnotes */}
      {o.footnotes.length > 0 && (
        <div className="mt-5 space-y-1 border-t border-white/10 pt-4">
          {o.footnotes.map((f) => (
            <p key={f} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-navy-300">
              <Info className="mt-0.5 h-3 w-3 shrink-0" />
              {f}
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
