'use client';

import Link from 'next/link';
import { Phone, MessageCircle, RotateCcw, CalendarCheck } from 'lucide-react';

interface Props {
  onReset?: () => void;
  /** prefilled context for the WhatsApp message */
  summary?: string;
}

const WHATSAPP_RAW = '917447552878'; // Kolhapur head office

export default function ActionButtons({ onReset, summary }: Props) {
  const waText = encodeURIComponent(
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
            href={`https://wa.me/${WHATSAPP_RAW}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp Us
          </a>
          <a
            href="tel:+917447552878"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-6 py-3.5 text-sm font-bold text-primary-navy transition-transform hover:-translate-y-0.5"
          >
            <Phone className="h-5 w-5 text-primary-gold" /> Call Now
          </a>
        </div>

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
