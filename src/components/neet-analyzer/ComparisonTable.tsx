'use client';

import { Check, X, Minus } from 'lucide-react';
import type { CostComparison, CostRow } from '@/lib/neetPredictor';
import { money } from '@/lib/neetPredictor';
import SavingsHighlight from './SavingsHighlight';
import { useCurrency } from './currencyContext';

export default function ComparisonTable({ comparison }: { comparison: CostComparison }) {
  const currency = useCurrency();
  const maxTotal = Math.max(...comparison.rows.map((r) => r.total), 1);

  const displayTotal = (r: CostRow): string => {
    if (r.totalFromInr != null) {
      const from = money(r.totalFromInr, currency);
      const to = r.totalToInr != null && r.totalToInr > r.totalFromInr ? ` – ${money(r.totalToInr, currency)}` : '';
      return `~${from}${to}`;
    }
    return money(r.total, currency);
  };

  // sqrt scale so the cheapest routes stay visible next to the ₹1cr+ deemed bar
  const barWidth = (total: number) => Math.max(6, Math.round(Math.sqrt(total / maxTotal) * 100));
  const barColor = (i: number, route: string) =>
    i === 0
      ? 'bg-emerald-500'
      : route.includes('Georgia') || route.includes('Timor')
        ? 'bg-primary-gold'
        : 'bg-navy-400';

  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-playfair text-2xl font-bold text-primary-navy">Route Comparison</h3>
        <SavingsHighlight variant="inline" />
      </div>
      <p className="mt-1 text-sm text-navy-500">{comparison.verdict}</p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-left text-xs uppercase tracking-wider text-navy-400">
              <th className="py-3 pr-4 font-semibold">Route</th>
              <th className="py-3 px-4 font-semibold">Total Cost (from) &amp; relative scale</th>
              {comparison.budget != null && <th className="py-3 px-4 font-semibold">Fits Budget?</th>}
              <th className="py-3 pl-4 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((r, i) => (
              <tr key={r.route} className={`border-b border-navy-50 ${i === 0 ? 'bg-emerald-50/40' : ''}`}>
                <td className="py-3 pr-4 align-top font-semibold text-primary-navy">
                  {r.route}
                  {i === 0 && (
                    <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      CHEAPEST
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 align-top">
                  <div className="font-bold text-primary-navy">{displayTotal(r)}</div>
                  <div className="mt-1.5 h-2 w-full max-w-[220px] overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${barColor(i, r.route)}`} style={{ width: `${barWidth(r.total)}%` }} />
                  </div>
                </td>
                {comparison.budget != null && (
                  <td className="py-3 px-4 align-top">
                    {r.withinBudget === null ? (
                      <Minus className="h-4 w-4 text-navy-300" />
                    ) : r.withinBudget ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <Check className="h-4 w-4" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-500">
                        <X className="h-4 w-4" /> No
                      </span>
                    )}
                  </td>
                )}
                <td className="py-3 pl-4 align-top text-xs text-navy-500">
                  {r.note}
                  {r.trustLine && <span className="mt-1 block font-semibold text-emerald-700">{r.trustLine}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-navy-400">
        Bar length is a relative visual of total cost (not to exact scale). Amounts shown in {currency === 'USD' ? 'US Dollars' : 'Indian Rupees'} —
        use the toggle above to switch. Abroad figures converted at ₹90/USD.
      </p>
    </div>
  );
}
