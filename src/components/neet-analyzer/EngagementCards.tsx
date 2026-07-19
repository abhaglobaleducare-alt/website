'use client';

import Link from 'next/link';
import { CalendarClock, BookOpen, ShieldCheck, Gift, ArrowUpRight } from 'lucide-react';
import { waLink } from '@/data/contacts';
import { trackEvent } from '@/lib/analytics';

export default function EngagementCards({ score }: { score: number }) {
  const ipadHref = waLink(`Hi! I am interested in MBBS Abroad with the iPad Early Bird Offer. My NEET Score: ${score}`);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Link
        href="/neet-zone/neet-2026-maharashtra-counselling"
        className="group rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <CalendarClock className="h-6 w-6 text-accent-blue" />
        <p className="mt-3 font-semibold text-primary-navy">NEET 2026 Counselling Guide</p>
        <p className="mt-1 text-xs text-navy-500">Score → college chart, cutoffs & counselling steps.</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-accent-blue">
          Open <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </Link>

      <Link
        href="/destinations/georgia"
        className="group rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <BookOpen className="h-6 w-6 text-primary-gold" />
        <p className="mt-3 font-semibold text-primary-navy">MBBS Georgia — Complete Guide</p>
        <p className="mt-1 text-xs text-navy-500">Universities, fees, hostels & the ABHA process.</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary-gold">
          Read <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </Link>

      <Link
        href="/neet-zone/neet-2025-validity-abroad"
        className="group rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <ShieldCheck className="h-6 w-6 text-emerald-600" />
        <p className="mt-3 font-semibold text-primary-navy">Is MBBS Georgia Valid?</p>
        <p className="mt-1 text-xs text-navy-500">NMC & WHO eligibility, FMGE/NExT — answered.</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
          Learn <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </Link>

      <a
        href={ipadHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('ipad_offer_clicked', { score })}
        className="group rounded-2xl border border-gold-300 bg-gradient-to-br from-gold-50 to-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <Gift className="h-6 w-6 text-primary-gold" />
        <p className="mt-3 font-semibold text-primary-navy">🎁 FREE iPad Early Bird Offer</p>
        <p className="mt-1 text-xs text-navy-500">On confirmed MBBS Abroad registration. T&amp;C apply.</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
          Claim on WhatsApp <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </a>
    </div>
  );
}
