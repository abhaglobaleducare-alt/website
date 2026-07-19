'use client';

import { motion } from 'framer-motion';
import { Tablet, Phone, MessageCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { waLink, KOLHAPUR } from '@/data/contacts';

interface Props {
  /** optional NEET score to prefill the WhatsApp message (used on the analyzer) */
  score?: number;
  /** compact = tighter padding for embedding inside result flows */
  variant?: 'full' | 'compact';
  className?: string;
}

/**
 * "FREE iPad" Early Bird offer card. Every placement MUST show the
 * "upon admission confirmation" condition + the T&C disclaimer (see below).
 * MBBS quality is primary; the iPad is a bonus incentive — kept professional.
 */
export default function IpadOfferCard({ score, variant = 'full', className = '' }: Props) {
  const waMessage = score
    ? `Hi! I am interested in MBBS Abroad with iPad Early Bird Offer. My NEET Score: ${score}`
    : 'Hi! I am interested in MBBS Abroad with the iPad Early Bird Offer.';

  const points = [
    'Limited Period Early Bird Offer',
    'Only for confirmed MBBS Abroad registrations',
    'iPad delivered upon admission confirmation',
    'NMC & WHO Eligible universities in Georgia',
    'Transparent MBBS fees — Georgia tuition from ₹21 Lakhs',
  ];

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-primary-gold via-gold-400 to-gold-600 p-[2px] shadow-gold ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-[calc(1.5rem-2px)] bg-gradient-to-br from-primary-navy to-navy-700 text-white ${
          variant === 'compact' ? 'p-6' : 'p-6 sm:p-8'
        }`}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary-gold/15 blur-3xl" />

        {/* Badges */}
        <div className="relative flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
            🎁 Early Bird
          </span>
          <span className="rounded-full border border-gold-300/50 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-200">
            Limited Period
          </span>
        </div>

        <div className="relative mt-4 flex items-start gap-4">
          <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-primary-gold sm:flex">
            <Tablet className="h-7 w-7" />
          </span>
          <div>
            <h3 className="font-playfair text-2xl font-bold text-white sm:text-3xl">
              Register for MBBS Abroad — get a <span className="text-primary-gold">FREE iPad</span>
            </h3>
            <p className="mt-1.5 text-sm text-navy-100">
              Register for MBBS Abroad with ABHA Global Educare and get a free iPad{' '}
              <strong className="text-white">upon admission confirmation</strong>.
            </p>
          </div>
        </div>

        {/* Points */}
        <ul className="relative mt-5 grid gap-2 sm:grid-cols-2">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-navy-100">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={waLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" /> Claim Your iPad Offer — WhatsApp Now
          </a>
          <a
            href={KOLHAPUR.tel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            <Phone className="h-5 w-5 text-primary-gold" /> Call {KOLHAPUR.phoneDisplay}
          </a>
        </div>

        {/* Trust badges */}
        <div className="relative mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-xs font-semibold text-navy-100">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> NMC &amp; WHO Eligible
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> No Hidden Charges
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Own Hostel in Tbilisi
          </span>
        </div>

        {/* Mandatory disclaimer */}
        <p className="relative mt-3 text-[11px] leading-relaxed text-navy-300">
          * iPad provided upon confirmed admission to a partner university. Limited period offer. Terms &amp; conditions
          apply.
        </p>
      </motion.div>
    </div>
  );
}
