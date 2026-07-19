'use client';

import { useState } from 'react';
import { ChevronDown, ShieldCheck, Info } from 'lucide-react';
import type { CostBreakdownEntry } from '@/data/neetPredictorData';
import { money } from '@/lib/neetPredictor';
import { useCurrency } from './currencyContext';

export default function CostBreakdown({ breakdowns }: { breakdowns: CostBreakdownEntry[] }) {
  const [open, setOpen] = useState<string | null>(breakdowns[0]?.route ?? null);
  const currency = useCurrency();

  const totalOf = (b: CostBreakdownEntry): string => {
    if (b.totalFromInr != null) {
      const from = money(b.totalFromInr, currency);
      const to = b.totalToInr != null && b.totalToInr > b.totalFromInr ? ` – ${money(b.totalToInr, currency)}` : '';
      return `~${from}${to}${b.totalSuffix ? ` (${b.totalSuffix})` : ''}`;
    }
    return money(b.components.reduce((s, c) => s + (c.amount ?? 0), 0), currency);
  };

  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
      <h3 className="font-playfair text-2xl font-bold text-primary-navy">Detailed Cost Breakdown</h3>
      <p className="mt-1 text-sm text-navy-500">Full-course estimates, component by component. Tap a route to expand.</p>

      <div className="mt-5 space-y-3">
        {breakdowns.map((b) => {
          const totalDisplay = totalOf(b);
          const isOpen = open === b.route;
          return (
            <div key={b.route} className="overflow-hidden rounded-2xl border border-navy-100">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : b.route)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 bg-light-gray px-5 py-4 text-left"
              >
                <span className="font-semibold text-primary-navy">{b.route}</span>
                <span className="flex items-center gap-3">
                  <span className="font-bold text-primary-navy">{totalDisplay}</span>
                  <ChevronDown className={`h-4 w-4 text-navy-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>
              {isOpen && (
                <div className="px-5 py-4">
                  {b.trustLine && (
                    <p className="mb-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                      {b.trustLine}
                    </p>
                  )}
                  <ul className="space-y-2.5">
                    {b.components.map((c) => (
                      <li key={c.label} className="flex items-start justify-between gap-3 text-sm">
                        <div className="flex-1">
                          <span className="font-medium text-navy-600">{c.label}</span>
                          <span className="ml-1.5 inline-flex gap-1 align-middle">
                            {c.oneTime && (
                              <span className="rounded bg-navy-50 px-1.5 py-0.5 text-[10px] font-bold text-navy-500">one-time</span>
                            )}
                            {c.directToCollege && (
                              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                direct to college
                              </span>
                            )}
                          </span>
                          {c.sub && <p className="mt-0.5 text-xs text-navy-400">{c.sub}</p>}
                        </div>
                        <span className="shrink-0 font-semibold text-primary-navy">
                          {c.amount == null ? 'At actuals' : money(c.amount, currency)}
                        </span>
                      </li>
                    ))}
                    <li className="flex items-center justify-between border-t border-navy-100 pt-2.5 text-sm font-bold text-primary-navy">
                      <span>Total (all-inclusive)</span>
                      <span>{totalDisplay}</span>
                    </li>
                  </ul>
                  <p className="mt-3 text-xs text-navy-400">{b.note}</p>
                  {b.footnotes && b.footnotes.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {b.footnotes.map((f) => (
                        <p key={f} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-navy-400">
                          <Info className="mt-0.5 h-3 w-3 shrink-0" />
                          {f}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
