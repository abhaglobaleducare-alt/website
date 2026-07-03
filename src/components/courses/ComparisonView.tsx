'use client';

import { X } from 'lucide-react';
import type { Course } from '@/data/courses';
import { courseId } from '@/data/courses';
import { RATE_NOTE, ABHA_SERVICE_CHARGES } from '@/data/config';
import { MessageCircle } from 'lucide-react';
import {
  useCompare,
  useCurrency,
  formatFee,
  STREAM_LABELS,
} from './context';
import CurrencyToggle from './CurrencyToggle';
import { cn } from '@/lib/utils';

function scheduleText(c: Course, format: (v: string | number) => string): string {
  const { part1, part2, part3 } = c.firstYearSchedule;
  const parts = [part1, part2, part3].filter((p): p is string => Boolean(p && p.trim()));
  return parts.length ? parts.map(format).join('  /  ') : '—';
}

const WHATSAPP_NUMBER = '917447552878';

function whatsappHref(course: Course): string {
  const msg = `Namaste ABHA! I want details about ${course.name} at ${course.university} (${STREAM_LABELS[course.stream]}). Please share fees and admission guidance.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export default function ComparisonView() {
  const { selected, isOpen, closeComparison, remove } = useCompare();
  const { currency } = useCurrency();

  if (!isOpen) return null;

  const fmt = (v: string | number) => formatFee(v, currency);
  const lowestTotal = Math.min(...selected.map((c) => c.totalTuitionUSD));

  const rows: { label: string; render: (c: Course) => React.ReactNode }[] = [
    { label: 'University', render: (c) => c.university },
    { label: 'Location', render: (c) => c.location },
    { label: 'Duration', render: (c) => c.duration },
    { label: 'Per Year Fees', render: (c) => fmt(c.feePerYearUSD) },
    {
      label: 'Total Tuition',
      render: (c) => (
        <div>
          <span className="font-bold text-[#0B1A35]">{fmt(c.totalTuitionUSD)}</span>
          {c.totalTuitionUSD === lowestTotal && (
            <span className="mt-1 block text-xs font-semibold text-[#85611C]">Lowest total</span>
          )}
        </div>
      ),
    },
    { label: '1st Year Payment Schedule', render: (c) => scheduleText(c, fmt) },
    {
      label: 'Other Fees & Expenses',
      render: (c) => (
        <div>
          {c.otherFees && <p className="mb-2">{fmt(c.otherFees)}</p>}
          <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-[#85611C]">
            ABHA charges (as applicable)
          </p>
          <ul className="mt-1 space-y-0.5 text-xs text-gray-500">
            {ABHA_SERVICE_CHARGES.map((charge) => (
              <li key={charge}>• {charge}</li>
            ))}
          </ul>
        </div>
      ),
    },
    { label: 'Notes', render: (c) => c.notes || '—' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex flex-col bg-white" role="dialog" aria-modal="true" aria-label="Course comparison">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-[#0B1A35] px-4 py-4 sm:px-6">
        <h2 className="font-playfair text-lg font-bold text-white sm:text-2xl">
          Compare Courses ({selected.length})
        </h2>
        <div className="flex items-center gap-3">
          <CurrencyToggle />
          <button
            type="button"
            onClick={closeComparison}
            aria-label="Close comparison"
            className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-20 min-w-[140px] bg-[#F8F9FA] px-4 py-4 text-left" />
              {selected.map((c) => (
                <th
                  key={courseId(c)}
                  className={cn(
                    'sticky top-0 z-10 min-w-[220px] border-l border-gray-200 px-4 py-4 text-left align-top',
                    c.totalTuitionUSD === lowestTotal ? 'bg-[#F5E6C4]' : 'bg-white',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-playfair text-base font-bold text-[#0B1A35]">
                      {c.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(c)}
                      aria-label={`Remove ${c.name}`}
                      className="mt-0.5 text-gray-400 hover:text-[#0B1A35]"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.label} className={ri % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                <th
                  className={cn(
                    'sticky left-0 z-10 px-4 py-3.5 text-left align-top text-xs font-semibold uppercase tracking-wide text-gray-500',
                    ri % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]',
                  )}
                >
                  {row.label}
                </th>
                {selected.map((c) => (
                  <td
                    key={courseId(c)}
                    className={cn(
                      'border-l border-gray-200 px-4 py-3.5 align-top text-gray-700',
                      row.label === 'Total Tuition' &&
                        c.totalTuitionUSD === lowestTotal &&
                        'bg-[#F5E6C4]',
                    )}
                  >
                    {row.render(c)}
                  </td>
                ))}
              </tr>
            ))}
            {/* CTA row */}
            <tr>
              <th className="sticky left-0 z-10 bg-white px-4 py-4" />
              {selected.map((c) => (
                <td key={courseId(c)} className="border-l border-gray-200 px-4 py-4 align-top">
                  <a
                    href={whatsappHref(c)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                  >
                    <MessageCircle size={16} /> Book Counselling
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 text-xs text-gray-500 sm:px-6">
        {currency === 'INR' ? (
          <p className="font-medium text-[#0B1A35]">{RATE_NOTE}</p>
        ) : (
          <p>Figures are tuition only, in USD. Toggle to INR for an indicative rupee value.</p>
        )}
      </div>
    </div>
  );
}
