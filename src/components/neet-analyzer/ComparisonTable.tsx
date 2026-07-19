'use client';

import { Check, X, Minus } from 'lucide-react';
import type { CostComparison } from '@/lib/neetPredictor';
import SavingsHighlight from './SavingsHighlight';

export default function ComparisonTable({ comparison }: { comparison: CostComparison }) {
  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-playfair text-2xl font-bold text-primary-navy">Route Comparison</h3>
        <SavingsHighlight variant="inline" />
      </div>
      <p className="mt-1 text-sm text-navy-500">{comparison.verdict}</p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-left text-xs uppercase tracking-wider text-navy-400">
              <th className="py-3 pr-4 font-semibold">Route</th>
              <th className="py-3 px-4 font-semibold">Total Course Cost (from)</th>
              {comparison.budget != null && <th className="py-3 px-4 font-semibold">Fits Budget?</th>}
              <th className="py-3 pl-4 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((r, i) => (
              <tr
                key={r.route}
                className={`border-b border-navy-50 ${i === 0 ? 'bg-emerald-50/40' : ''}`}
              >
                <td className="py-3 pr-4 font-semibold text-primary-navy">
                  {r.route}
                  {i === 0 && (
                    <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      CHEAPEST
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 font-bold text-primary-navy">{r.displayTotal}</td>
                {comparison.budget != null && (
                  <td className="py-3 px-4">
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
                <td className="py-3 pl-4 text-xs text-navy-500">
                  {r.note}
                  {r.trustLine && <span className="mt-1 block font-semibold text-emerald-700">{r.trustLine}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
