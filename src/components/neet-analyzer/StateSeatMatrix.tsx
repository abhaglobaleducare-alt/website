'use client';

import { Table2, Info } from 'lucide-react';
import type { StateSeatMatrix as StateSeatMatrixType } from '@/lib/neetPredictor';
import { formatRank } from '@/lib/neetPredictor';

export default function StateSeatMatrix({ matrix }: { matrix: StateSeatMatrixType }) {
  const {
    heading,
    intro,
    rows,
    govtTotal,
    privateTotal,
    grandTotal,
    govtStateQuota,
    privateStateQuota,
    quotaNote,
    footnote,
    marathi,
  } = matrix;

  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
      {/* Heading stays English by design; descriptions localise. */}
      <h3 className="flex items-center gap-2 font-playfair text-2xl font-bold text-primary-navy">
        <Table2 className="h-6 w-6 text-primary-gold" /> {heading}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-navy-500">{intro}</p>

      {/* Totals strip */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { k: 'Total', v: grandTotal, tone: 'text-primary-navy' },
          { k: 'Government', v: govtTotal, tone: 'text-emerald-700' },
          { k: 'Private', v: privateTotal, tone: 'text-accent-blue' },
        ].map((x) => (
          <div key={x.k} className="rounded-xl border border-navy-100 bg-slate-50/60 px-3 py-2.5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-navy-400">{x.k}</p>
            <p className={`font-playfair text-xl font-bold ${x.tone}`}>{formatRank(x.v)}</p>
          </div>
        ))}
      </div>

      {/* Category table — wide content scrolls inside its own container */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[340px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-navy-100">
              <th className="py-2 pr-2 text-left text-xs font-bold uppercase tracking-wider text-navy-400">
                {marathi ? 'Category' : 'Category'}
              </th>
              <th className="py-2 px-2 text-right text-xs font-bold uppercase tracking-wider text-navy-400">
                Government
              </th>
              <th className="py-2 pl-2 text-right text-xs font-bold uppercase tracking-wider text-navy-400">
                Private
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.category}
                className={`border-b border-navy-100/70 ${r.isYours ? 'bg-amber-50/70' : ''}`}
              >
                <td className="py-2.5 pr-2">
                  <span className={`font-semibold ${r.isYours ? 'text-primary-navy' : 'text-navy-600'}`}>
                    {r.category}
                  </span>
                  <span className="ml-1.5 text-xs text-navy-400">{r.sharePct}%</span>
                  {r.isYours ? (
                    <span className="ml-2 rounded-full bg-primary-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-navy">
                      {marathi ? 'तुमची' : 'Yours'}
                    </span>
                  ) : null}
                </td>
                <td className="py-2.5 px-2 text-right font-bold text-emerald-700">{formatRank(r.govt)}</td>
                <td className="py-2.5 pl-2 text-right font-bold text-accent-blue">{formatRank(r.private)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-navy-100">
              <td className="py-2.5 pr-2 text-xs font-bold uppercase tracking-wider text-navy-400">
                {marathi ? 'State quota एकूण (85%)' : 'State quota total (85%)'}
              </td>
              <td className="py-2.5 px-2 text-right font-bold text-primary-navy">{formatRank(govtStateQuota)}</td>
              <td className="py-2.5 pl-2 text-right font-bold text-primary-navy">{formatRank(privateStateQuota)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 rounded-xl border border-navy-100 bg-slate-50/60 px-3 py-2.5 text-xs leading-relaxed text-navy-500">
        {quotaNote}
      </p>

      <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-navy-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{footnote}</span>
      </p>
    </div>
  );
}
