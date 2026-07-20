'use client';

import { useState } from 'react';
import { IdCard, ChevronDown } from 'lucide-react';

const LINES = [
  ['AIR (All India Rank)', 'your position in the national merit list — it decides the 15% All-India Quota seats.'],
  ['Category Rank', 'your standing inside your own reservation pool (SC/ST/OBC/EWS) — it decides reserved seats.'],
  ['Percentile ≠ Percentage', 'percentile is how many candidates you finished ahead of, not marks out of 100.'],
  ['"Qualified"', 'means you cleared the cut-off to enter counselling — it is not a seat by itself.'],
  ['Keep your rank card handy', 'counselling authorities verify the original at every round.'],
  ['One score, two ranks', 'read both your AIR and Category Rank before you plan your choices.'],
] as const;

/** Collapsible educational block near the form (all original wording). */
export default function RankCardExplainer() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-navy-100 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-navy">
          <IdCard className="h-4 w-4 text-primary-gold" /> Understand your NEET rank card
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-navy-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="space-y-2 border-t border-navy-100 px-5 py-4 text-sm">
          {LINES.map(([term, def]) => (
            <li key={term} className="flex gap-2 text-navy-500">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-gold" />
              <span>
                <strong className="text-primary-navy">{term}</strong> — {def}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
