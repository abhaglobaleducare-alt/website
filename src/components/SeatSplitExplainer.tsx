'use client';

import { MapPinned, Info } from 'lucide-react';
import { generateSeatSplit, formatRank, type SeatSplit } from '@/lib/neetPredictor';
import type { StateName } from '@/data/neetPredictorData';

/**
 * The compact "कुठे / किती / कसं" seat-split table, shared by the analyzer and
 * the Marathi NEET Zone / homepage sections.
 *
 * Numbers are always derived through `generateSeatSplit` from the seat matrix —
 * never passed in as literals — so every placement stays in step when the NMC
 * matrix is refreshed. Callers may pass a ready `split` (the analyzer already
 * has one) or just a state name.
 */
export default function SeatSplitExplainer({
  state = 'Maharashtra',
  split: given,
  variant = 'card',
  showHeading = true,
}: {
  state?: StateName;
  split?: SeatSplit;
  /** 'card' = standalone white card · 'bare' = no border, for nesting */
  variant?: 'card' | 'bare';
  showHeading?: boolean;
}) {
  const split = given ?? generateSeatSplit(state);
  if (!split) return null;

  const { heading, intro, rows, total, footnote, marathi } = split;
  const shell =
    variant === 'card'
      ? 'rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8'
      : 'rounded-2xl border border-navy-100 bg-slate-50/60 p-4';

  return (
    <div className={shell}>
      {showHeading ? (
        <h3 className="flex items-center gap-2 font-playfair text-2xl font-bold text-primary-navy">
          <MapPinned className="h-6 w-6 text-primary-gold" /> {heading}
        </h3>
      ) : null}
      <p className={`text-sm leading-relaxed text-navy-500 ${showHeading ? 'mt-1' : ''}`}>{intro}</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-navy-100">
              <th className="py-2 pr-2 text-left text-xs font-bold uppercase tracking-wider text-navy-400">
                {marathi ? 'कुठे' : 'Where'}
              </th>
              <th className="py-2 px-2 text-right text-xs font-bold uppercase tracking-wider text-navy-400">
                {marathi ? 'किती' : 'Seats'}
              </th>
              <th className="py-2 pl-2 text-right text-xs font-bold uppercase tracking-wider text-navy-400">
                {marathi ? 'कसं' : 'How'}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.where} className="border-b border-navy-100/70">
                <td className="py-2.5 pr-2 font-semibold text-primary-navy">{r.where}</td>
                <td className="py-2.5 px-2 text-right font-bold text-accent-blue">{formatRank(r.seats)}</td>
                <td className="py-2.5 pl-2 text-right text-xs text-navy-500">{r.how}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-navy-100">
              <td className="py-2.5 pr-2 text-sm font-bold text-primary-navy">
                {marathi ? 'एकूण' : 'Total'}
              </td>
              <td className="py-2.5 px-2 text-right font-playfair text-lg font-bold text-primary-navy">
                {formatRank(total)}
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-navy-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{footnote}</span>
      </p>
    </div>
  );
}
