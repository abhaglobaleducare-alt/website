'use client';

import Link from 'next/link';
import { Phone, MessageCircle, RotateCcw, CalendarCheck, Download } from 'lucide-react';
import { KOLHAPUR, waLink } from '@/data/contacts';
import { trackEvent } from '@/lib/analytics';

interface Props {
  onReset?: () => void;
  /** prefilled context for the WhatsApp message */
  summary?: string;
  /** NEET score, for download analytics only */
  score?: number;
}

export default function ActionButtons({ onReset, summary, score }: Props) {
  /* The browser's own print dialog is the download: every desktop and mobile
     browser offers "Save as PDF" there. It keeps the report as real text —
     selectable, searchable and accessible — which a canvas-to-image PDF would
     not, and it adds no dependency to the bundle. */
  const handleDownload = () => {
    trackEvent('analysis_download_clicked', { score });
    window.print();
  };

  const waHref = waLink(
    summary
      ? `Hi ABHA Global Educare, I just used the NEET Admission Analyzer. ${summary} I'd like free counselling on my options.`
      : 'Hi ABHA Global Educare, I used the NEET Admission Analyzer and would like free counselling on my options.',
  );

  return (
    <div className="rounded-3xl border border-gold-200 bg-gradient-to-br from-gold-50 to-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col items-center text-center">
        <h3 className="font-playfair text-2xl font-bold text-primary-navy sm:text-3xl">
          Turn this analysis into an admission
        </h3>
        <p className="mt-2 max-w-xl text-sm text-navy-500">
          An estimate is a starting point — a counsellor turns it into a confirmed seat. Book a free session with ABHA
          Global Educare and we’ll lock your best path for this academic year.
        </p>

        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-navy px-6 py-3.5 text-sm font-bold text-white shadow-navy transition-transform hover:-translate-y-0.5"
          >
            <CalendarCheck className="h-5 w-5 text-primary-gold" /> Book Free Counselling
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp Us
          </a>
          <a
            href={KOLHAPUR.tel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-6 py-3.5 text-sm font-bold text-primary-navy transition-transform hover:-translate-y-0.5"
          >
            <Phone className="h-5 w-5 text-primary-gold" /> Call Now
          </a>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary-navy bg-white px-6 py-3.5 text-sm font-bold text-primary-navy transition-transform hover:-translate-y-0.5 sm:w-auto"
        >
          <Download className="h-5 w-5 text-primary-gold" /> Download this analysis (PDF)
        </button>
        <p className="mt-2 max-w-md text-xs text-navy-400">
          Opens your browser&apos;s print dialog — choose <strong>&ldquo;Save as PDF&rdquo;</strong> as the
          destination. The saved copy carries the full estimate along with a note that these figures are assumptions
          drawn from past seat allotments.
        </p>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-400 transition hover:text-primary-navy"
          >
            <RotateCcw className="h-4 w-4" /> Analyze a different score
          </button>
        )}
      </div>
    </div>
  );
}
