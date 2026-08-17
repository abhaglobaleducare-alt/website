'use client';

import { motion } from 'framer-motion';
import { Phone, MessageCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { waLink, KOLHAPUR } from '@/data/contacts';

interface Props {
  /** optional NEET score to prefill the WhatsApp message (used on the analyzer) */
  score?: number;
  /**
   * compact = tighter padding for embedding inside result flows.
   * minimal = headline, one line of copy and the two CTAs only. Used on pages
   * that already carry the full EarlyBirdTabletCard above it, where the device
   * image, proof points and trust row would just repeat what the reader has
   * already seen.
   */
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
  /**
   * When true, show Georgia-specific proof points (Georgia tuition, Tbilisi
   * hostel). Set false on non-Georgia destination pages (Timor-Leste, Russian
   * Countries). Defaults to true to preserve homepage/analyzer/scholarship copy.
   */
  georgiaContext?: boolean;
}

/**
 * "FREE study tablet" Early Bird offer card — the reward is a CHOICE of one
 * device from three (see EarlyBirdTabletCard). Every placement MUST show the
 * "delivered after visa approval" condition + the T&C disclaimer (see below).
 * MBBS quality is primary; the device is a bonus incentive — kept professional.
 *
 * The iPad visual is a hand-crafted SVG mock (license-safe). To use a real
 * product photo instead, drop it in /public/images and swap <IpadGraphic/>.
 */
function IpadGraphic({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={className}
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 240 320"
        fill="none"
        className="w-full drop-shadow-2xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <linearGradient id="ipadBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3c3c42" />
            <stop offset="1" stopColor="#17171a" />
          </linearGradient>
          <linearGradient id="ipadScreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6d40b0" />
            <stop offset="0.5" stopColor="#1f6feb" />
            <stop offset="1" stopColor="#C6962E" />
          </linearGradient>
          <linearGradient id="ipadGlare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* body */}
        <rect x="8" y="4" width="224" height="312" rx="28" fill="url(#ipadBody)" stroke="#4c4c52" strokeWidth="1.5" />
        {/* screen */}
        <rect x="18" y="14" width="204" height="292" rx="18" fill="url(#ipadScreen)" />
        {/* abstract wallpaper shapes */}
        <circle cx="66" cy="86" r="58" fill="#ffffff" opacity="0.12" />
        <circle cx="182" cy="238" r="72" fill="#ffffff" opacity="0.09" />
        <circle cx="150" cy="70" r="26" fill="#ffffff" opacity="0.10" />
        {/* glare */}
        <rect x="18" y="14" width="204" height="292" rx="18" fill="url(#ipadGlare)" />
        {/* front camera */}
        <circle cx="120" cy="9" r="2.4" fill="#0c0c0e" />
      </motion.svg>
    </motion.div>
  );
}

export default function IpadOfferCard({ score, variant = 'full', className = '', georgiaContext = true }: Props) {
  const minimal = variant === 'minimal';
  const waMessage = score
    ? `Hi! I am interested in MBBS Abroad with the Early Bird study-tablet offer. My NEET Score: ${score}`
    : 'Hi! I am interested in MBBS Abroad with the Early Bird study-tablet offer.';

  const points = [
    'Only for confirmed MBBS Abroad registrations',
    'Study tablet delivered after Visa Approval',
    georgiaContext
      ? 'NMC & WHO Eligible universities in Georgia'
      : 'NMC & WHO Eligible partner universities',
    georgiaContext
      ? 'Transparent MBBS fees — Georgia tuition from ₹21 Lakhs'
      : 'Transparent fees — full breakdown at counselling',
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

        {/* Heading + iPad visual */}
        <div className="relative mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex-1">
            <h3 className="font-playfair text-2xl font-bold text-white sm:text-3xl">
              Register for MBBS Abroad — get a <span className="text-primary-gold">FREE study tablet</span>
            </h3>
            <p className="mt-1.5 text-sm text-navy-100">
              Register for MBBS Abroad with ABHA Global Educare and get a free study tablet —{' '}
              <strong className="text-white">delivered after your visa approval</strong>. Limited
              Period Early Bird Offer.
            </p>
          </div>
          {!minimal && <IpadGraphic className="mx-auto w-28 shrink-0 sm:mx-0 sm:w-32 md:w-40" />}
        </div>

        {/* Points */}
        {!minimal && (
          <ul className="relative mt-5 grid gap-2 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-navy-100">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTAs */}
        <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={waLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />{' '}
            {minimal ? 'Claim Your Early Bird Offer' : 'Claim Your Early Bird Offer — WhatsApp Now'}
          </a>
          <a
            href={KOLHAPUR.tel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            <Phone className="h-5 w-5 text-primary-gold" /> Call {KOLHAPUR.phoneDisplay}
          </a>
        </div>

        {/* Trust badges */}
        {!minimal && (
        <div className="relative mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-xs font-semibold text-navy-100">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> NMC &amp; WHO Eligible
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> No Hidden Charges
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />{' '}
            {georgiaContext ? 'Own Hostel in Tbilisi' : 'On-ground Student Support'}
          </span>
        </div>
        )}

        {/* Mandatory disclaimer */}
        <p className="relative mt-3 text-[11px] leading-relaxed text-navy-300">
          * Study tablet (choice of model, subject to availability) provided after visa approval, on
          confirmed admission to a partner university.
          Limited period offer. Terms &amp; conditions apply.
        </p>
      </motion.div>
    </div>
  );
}
