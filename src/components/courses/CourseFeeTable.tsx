'use client';

import type { Course } from '@/data/courses';
import { FEE_TABLE_FOOTER, RATE_NOTE, ABHA_SERVICE_CHARGES } from '@/data/config';
import { useCurrency, useCompare, formatFee, MAX_COMPARE } from './context';
import CurrencyToggle from './CurrencyToggle';
import { cn } from '@/lib/utils';

function scheduleParts(c: Course): string[] {
  const { part1, part2, part3 } = c.firstYearSchedule;
  return [part1, part2, part3].filter((p): p is string => Boolean(p && p.trim()));
}

export default function CourseFeeTable({ courses }: { courses: Course[] }) {
  const { currency } = useCurrency();
  const { isSelected, toggle, canAdd } = useCompare();

  return (
    <div>
      {/* Toggle row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          Tap <span className="font-semibold text-[#0B1A35]">+ Compare</span> on up to {MAX_COMPARE}{' '}
          courses to view them side by side.
        </p>
        <CurrencyToggle className="self-start sm:self-auto" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-card custom-scrollbar">
        <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#0B1A35] text-white">
              <th className="sticky left-0 z-20 bg-[#0B1A35] px-4 py-3.5 font-semibold">
                Course
              </th>
              <th className="px-4 py-3.5 font-semibold">University</th>
              <th className="px-4 py-3.5 font-semibold">Location</th>
              <th className="px-4 py-3.5 font-semibold">Duration</th>
              <th className="px-4 py-3.5 font-semibold">Per Year Fees</th>
              <th className="px-4 py-3.5 font-semibold">Total Tuition</th>
              <th className="px-4 py-3.5 font-semibold">1st Year Payment (P1 / P2 / P3)</th>
              <th className="min-w-[260px] px-4 py-3.5 font-semibold">Other Fees &amp; Expenses</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => {
              const zebra = i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]';
              const selected = isSelected(c);
              const disabled = !selected && !canAdd;
              const parts = scheduleParts(c);
              return (
                <tr key={i} className={cn(zebra, selected && 'ring-2 ring-inset ring-[#C6962E]/40')}>
                  <td
                    className={cn(
                      'sticky left-0 z-10 px-4 py-4 align-top',
                      selected ? 'bg-[#F7EDD7]' : zebra,
                    )}
                  >
                    <div className="font-semibold text-[#0B1A35]">{c.name}</div>
                    <label
                      className={cn(
                        'mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold',
                        disabled ? 'cursor-not-allowed text-gray-400' : 'text-[#C6962E]',
                      )}
                      title={disabled ? `Max ${MAX_COMPARE} courses` : undefined}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={disabled}
                        onChange={() => toggle(c)}
                        className="h-4 w-4 accent-[#C6962E]"
                        aria-label={`Add ${c.name} at ${c.university} to comparison`}
                      />
                      + Compare
                    </label>
                    {c.notes && (
                      <p className="mt-1.5 text-[0.7rem] leading-snug text-gray-500">{c.notes}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-gray-700">{c.university}</td>
                  <td className="px-4 py-4 align-top text-gray-600">{c.location}</td>
                  <td className="px-4 py-4 align-top text-gray-600">{c.duration}</td>
                  <td className="px-4 py-4 align-top text-gray-700">
                    {formatFee(c.feePerYearUSD, currency)}
                  </td>
                  <td className="px-4 py-4 align-top font-semibold text-[#0B1A35]">
                    {c.totalTuitionUSD > 0
                      ? formatFee(c.totalTuitionUSD, currency)
                      : 'As per university schedule'}
                  </td>
                  <td className="px-4 py-4 align-top text-gray-600">
                    {parts.length ? (
                      <ul className="space-y-0.5">
                        {parts.map((p, pi) => (
                          <li key={pi}>{formatFee(p, currency)}</li>
                        ))}
                      </ul>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="min-w-[260px] px-4 py-4 align-top text-gray-600">
                    {c.otherFees && (
                      <p className="mb-1.5">{formatFee(c.otherFees, currency)}</p>
                    )}
                    <p className="text-[0.72rem] leading-snug text-gray-500">
                      <span className="font-semibold text-[#85611C]">+ ABHA charges (as applicable): </span>
                      {ABHA_SERVICE_CHARGES.join(', ')}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer notes */}
      <div className="mt-4 space-y-1.5 text-xs leading-relaxed text-gray-500">
        <p>{FEE_TABLE_FOOTER}</p>
        {currency === 'INR' && <p className="font-medium text-[#0B1A35]">{RATE_NOTE}</p>}
      </div>
    </div>
  );
}
