'use client';

import { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';

/** Collapsible data-source disclaimer shown at the top of the results. */
export default function SmartDisclaimer() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-navy-100 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600">
          <Info className="h-4 w-4 text-accent-blue" /> How these predictions are made — data sources &amp; limits
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-navy-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="border-t border-navy-100 px-5 py-4 text-xs leading-relaxed text-navy-500">
          This analysis is based on NEET 2025 counselling data from NTA, MCC, and state authorities. These are{' '}
          <strong className="text-navy-600">indicative</strong> predictions based on historical trends. Actual 2026
          cutoffs may vary based on paper difficulty, candidate volume, seat changes, and reservation policies. ABHA
          Global Educare LLP does not guarantee admission at any specific college. For confirmed data, refer to{' '}
          <a href="https://mcc.nic.in" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-blue underline">
            mcc.nic.in
          </a>{' '}
          and your state counselling authority.
        </p>
      )}
    </div>
  );
}
