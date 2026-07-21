'use client';

import Link from 'next/link';
import { Stethoscope, ArrowRight, Scale } from 'lucide-react';

/**
 * Alternative-courses card, shown for lower score bands (≤ ~480) where students
 * commonly weigh BDS / BAMS / BHMS / nursing against MBBS.
 *
 * Compliance guardrails (do not loosen):
 *  - DMD is a DENTAL degree. Never claim "FMGE eligible" — FMGE is for MBBS.
 *    Foreign dental graduates follow a separate screening pathway; keep it at
 *    "practice-in-India pathway explained at counselling".
 *  - No cutoff/rank numbers for BDS/BAMS.
 *  - BAMS/BHMS honesty: ABHA does not handle State CET counselling; say so.
 */
export default function BdsBamsCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card">
      <div className="border-b border-navy-100 bg-light-gray px-6 py-5 sm:px-8">
        <h2 className="flex items-center gap-2.5 font-playfair text-2xl font-bold text-primary-navy">
          <Stethoscope className="h-6 w-6 shrink-0 text-primary-gold" />
          Considering BDS / BAMS / other medical courses?
        </h2>
        <p className="mt-1.5 text-sm text-navy-500">
          At your score, these are the paths students most often weigh — here&apos;s an honest look at each.
        </p>
      </div>

      <div className="grid gap-4 p-6 sm:p-8 md:grid-cols-2">
        {/* BDS → DMD Georgia (primary block) */}
        <div className="flex flex-col rounded-2xl border border-primary-gold/30 bg-primary-gold/[0.06] p-5 md:col-span-2">
          <span className="mb-1.5 text-xs font-bold uppercase tracking-widest text-primary-gold">
            Interested in BDS?
          </span>
          <p className="font-playfair text-lg font-bold text-primary-navy">ABHA has the abroad answer</p>
          <p className="mt-1.5 text-sm leading-relaxed text-navy-500">
            ABHA offers <strong className="text-primary-navy">Dentistry (DMD)</strong> at accredited
            universities in Tbilisi, Georgia — 3 English-medium programmes, a 5-year Doctor of Dental
            Medicine. Fees &amp; eligibility at counselling.
          </p>
          <Link
            href="/courses/dentistry"
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl bg-primary-navy px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Explore Dentistry (DMD) <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Nursing / Pharmacy */}
        <div className="flex flex-col rounded-2xl border border-navy-100 bg-light-gray p-5 md:col-span-2">
          <p className="text-sm leading-relaxed text-navy-500">
            <strong className="text-primary-navy">Nursing / Pharmacy:</strong> BSc Nursing, Pharmacy &amp;
            allied health programmes are also available in Georgia.
          </p>
          <Link
            href="/courses/nursing-health-sciences"
            className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-primary-gold hover:underline"
          >
            See Nursing &amp; Health Sciences <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* BAMS / BHMS — honest */}
        <div className="rounded-2xl border border-navy-100 bg-white p-5 md:col-span-2">
          <p className="flex items-center gap-2 font-bold text-primary-navy">
            <Scale className="h-4 w-4 text-navy-400" /> BAMS / BHMS — the honest bit
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-navy-500">
            BAMS/BHMS run through State CET counselling, which ABHA does not handle — we won&apos;t
            pretend to guide you there. But before locking that choice, compare: at your score,{' '}
            <strong className="text-primary-navy">MBBS Abroad</strong> (Timor-Leste college fees under
            ₹20L) and <strong className="text-primary-navy">DMD Georgia</strong> are both open — often at
            comparable total cost. Free comparison at counselling.
          </p>
        </div>
      </div>

      {/* Compliance footer — no FMGE claim for dental */}
      <div className="border-t border-navy-100 bg-light-gray px-6 py-4 sm:px-8">
        <p className="text-xs leading-relaxed text-navy-400">
          For DMD, the practice-in-India pathway is explained at counselling — dental degrees follow their
          own screening route, separate from MBBS (FMGE applies to MBBS, not dentistry).
        </p>
      </div>
    </div>
  );
}
