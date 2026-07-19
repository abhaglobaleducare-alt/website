'use client';

import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div className="text-xs leading-relaxed text-amber-900">
          <p className="font-bold">Important — this is a guidance estimate, not an official prediction.</p>
          <p className="mt-1">
            Rank, percentile and admission chances are computed from previous-year NEET (NTA) results and counselling
            cutoffs. Actual results depend on paper difficulty, the seat matrix, category, domicile, document
            verification and round-wise movement, all of which change every year. Figures are compiled in good faith by
            the ABHA Global Educare office and may contain errors. Always verify against official sources — NTA
            (neet.nta.nic.in), MCC (mcc.nic.in) and your state counselling authority — before making any decision. ABHA
            Global Educare is not liable for admission outcomes based on this tool.
          </p>
        </div>
      </div>
    </div>
  );
}
