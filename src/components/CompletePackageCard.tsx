'use client';

import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  FileText,
  HandCoins,
  GraduationCap,
  Stamp,
  PlaneTakeoff,
  MonitorPlay,
  KeyRound,
  BedDouble,
  Gift,
  Info,
  MessageCircle,
} from 'lucide-react';
import { waLink } from '@/data/contacts';
import {
  PACKAGE_SERVICES,
  EARLY_BIRD,
  PACKAGE_PRICE,
  BEYOND_PACKAGE,
  type PackageService,
} from '@/data/completePackage';

const ICONS: Record<PackageService['icon'], React.ElementType> = {
  ClipboardCheck,
  FileText,
  HandCoins,
  GraduationCap,
  Stamp,
  PlaneTakeoff,
  MonitorPlay,
  KeyRound,
  BedDouble,
};

const NAVY = '#0B1A35';
const GOLD = '#C6962E';

/**
 * "The Complete ABHA Package" — page 3 of the marketing brochure, on the web.
 *
 * Reproduced faithfully rather than reworded, so a family comparing the printed
 * brochure against the site sees the same nine services, the same Early-Bird
 * iPad terms and the same USD 13,324. All copy and figures live in
 * data/completePackage.ts.
 *
 * The "beyond the package" block is carried over deliberately. It is the part a
 * sales page would be tempted to drop, and the one that stops ₹12.66 Lakh being
 * read as the total six-year cost.
 */
export default function CompletePackageCard({ className = '' }: { className?: string }) {
  const wa = waLink(
    'Hi ABHA, I want the Complete ABHA Package details (9 services + Early-Bird iPad, USD 13,324).',
  );

  return (
    <div className={`rounded-3xl border border-navy-100 bg-white p-5 shadow-card sm:p-8 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
            One all-inclusive package
          </p>
          <h2 className="mt-1 font-playfair text-2xl font-bold sm:text-4xl" style={{ color: NAVY }}>
            The Complete <span style={{ color: GOLD }}>ABHA</span> Package
          </h2>
          <span className="mt-2 block h-1 w-16 rounded-full" style={{ background: GOLD }} />
        </div>
        <div className="border-l-2 pl-3 text-right" style={{ borderColor: GOLD }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-navy-400">Everything included</p>
          <p className="font-playfair text-xl font-bold" style={{ color: NAVY }}>One Price</p>
          <p className="text-[11px] text-navy-400">No service-wise charges</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-navy-500">
        Everything from your first counselling call to twelve months in Tbilisi —{' '}
        <strong className="text-primary-navy">
          application, documentation, visa, travel, coaching, on-arrival setup, accommodation and food
        </strong>{' '}
        — delivered as one complete package. No separate service-wise charges, no hidden costs.
      </p>

      {/* Nine services */}
      <div className="mt-6 flex items-baseline justify-between gap-3 border-b border-navy-100 pb-2">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy-500">
          What&apos;s inside your package
        </h3>
        <span className="text-[11px] font-bold" style={{ color: GOLD }}>
          9 Services + Early-Bird iPad
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PACKAGE_SERVICES.map((s) => {
          const Icon = ICONS[s.icon];
          return (
            <div key={s.n} className="relative rounded-2xl border border-navy-100 bg-slate-50/60 p-4">
              <div className="flex items-start justify-between gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(198,150,46,0.12)' }}
                >
                  <Icon className="h-4 w-4" style={{ color: GOLD }} />
                </span>
                <span className="font-playfair text-xl font-bold text-navy-200">{s.n}</span>
              </div>
              <p className="mt-2.5 font-playfair text-base font-bold leading-snug" style={{ color: NAVY }}>
                {s.title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-navy-500">{s.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Early-Bird iPad strip */}
      <div
        className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl p-4 sm:p-5"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3160 100%)` }}
      >
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'rgba(198,150,46,0.16)' }}
        >
          <Gift className="h-6 w-6" style={{ color: GOLD }} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: GOLD }}>
            {EARLY_BIRD.eyebrow}
          </p>
          <p className="font-playfair text-lg font-bold text-white sm:text-xl">
            A <em>Useful Gift</em> for Future Doctors
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/70">{EARLY_BIRD.body}</p>
        </div>
        <motion.span
          className="shrink-0 rounded-xl px-4 py-2.5 text-center font-playfair text-base font-black leading-tight"
          style={{ background: `linear-gradient(to right, ${GOLD}, #DFB761)`, color: NAVY }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          FREE
          <br />
          iPad
        </motion.span>
      </div>

      {/* Price */}
      <div
        className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 sm:p-5"
        style={{ background: 'rgba(198,150,46,0.1)', border: `2px solid ${GOLD}` }}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: GOLD }}>
            Complete package · all-inclusive
          </p>
          <p className="font-playfair text-lg font-bold sm:text-xl" style={{ color: NAVY }}>
            {PACKAGE_PRICE.title}
          </p>
          <p className="mt-0.5 text-xs text-navy-400">{PACKAGE_PRICE.note}</p>
        </div>
        <div className="text-right">
          <p className="font-playfair text-3xl font-black leading-none sm:text-4xl" style={{ color: NAVY }}>
            USD {PACKAGE_PRICE.usd.toLocaleString('en-US')}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-navy-500">{PACKAGE_PRICE.rateLabel}</p>
          <p className="font-playfair text-lg font-bold" style={{ color: GOLD }}>
            {PACKAGE_PRICE.inrLabel}
          </p>
        </div>
      </div>

      {/* Beyond the package — the honest part */}
      <div className="mt-4 rounded-2xl border border-navy-100 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy-600">
            {BEYOND_PACKAGE.heading}
          </p>
          <p className="text-[11px] italic text-navy-400">{BEYOND_PACKAGE.subheading}</p>
        </div>
        <ul className="mt-3 space-y-2">
          {BEYOND_PACKAGE.rows.map((r) => (
            <li
              key={r.label}
              className="flex items-baseline justify-between gap-3 border-b border-dashed border-navy-100 pb-2 last:border-0 last:pb-0"
            >
              <span className="text-xs leading-relaxed text-navy-500">{r.label}</span>
              <span className="shrink-0 font-playfair text-base font-bold" style={{ color: NAVY }}>
                {r.amount}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-start gap-1.5 text-[11px] italic leading-relaxed text-navy-400">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          {BEYOND_PACKAGE.footnote}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy-400">
          Transparent pricing · zero hidden charges
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: '#25D366' }}
        >
          <MessageCircle className="h-4 w-4" /> Ask about the Early-Bird Offer
        </a>
      </div>
    </div>
  );
}
