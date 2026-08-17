'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, MessageCircle, ScrollText } from 'lucide-react';
import { waLink } from '@/data/contacts';
import { TABLET_OPTIONS, DEVICE_UNLOCKS, TABLET_OFFER_COPY as C } from '@/data/earlyBirdTablet';

const NAVY = '#0B1A35';
const GOLD = '#C6962E';
const TEAL = '#1B7C9E';

/**
 * Early Bird Offer — page 03 of the Early Bird brochure: a CHOICE of one study
 * tablet from three, awarded on successful admission to Georgia.
 *
 * The three device photos are the brochure's own images, so the printed page
 * and the site show the same thing. Copy and terms live in
 * data/earlyBirdTablet.ts.
 *
 * The full offer terms are reproduced rather than summarised — availability,
 * substitution, non-transferability and the cut-off. A student choosing a model
 * needs to know ABHA may substitute an equivalent one before they set their
 * heart on a specific device.
 */
export default function EarlyBirdTabletCard({ className = '' }: { className?: string }) {
  const wa = waLink(
    'Hi ABHA, I want to know about the Early Bird study-tablet offer (iPad / Lenovo Idea Tab / Samsung Galaxy Tab) and the current cut-off date.',
  );

  return (
    <div className={`rounded-3xl border border-navy-100 bg-white p-5 shadow-card sm:p-8 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: GOLD }}>
            {C.eyebrow}
          </p>
          <h2 className="mt-1.5 font-playfair text-2xl font-bold leading-tight sm:text-4xl" style={{ color: NAVY }}>
            {C.titleLead}{' '}
            <span style={{ color: TEAL }}>{C.titleAccent}</span> {C.titleTail}
          </h2>
          <span className="mt-3 block h-1 w-20 rounded-full" style={{ background: GOLD }} />
        </div>
        <div className="text-right">
          <p className="font-playfair text-xl font-bold sm:text-2xl" style={{ color: NAVY }}>
            {C.asideTitle}
          </p>
          <p className="mt-0.5 max-w-[15rem] text-[10px] font-bold uppercase leading-snug tracking-wider text-navy-400">
            {C.asideNote}
          </p>
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-navy-500">{C.intro}</p>

      {/* Three devices */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {TABLET_OPTIONS.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm"
          >
            <div className="relative flex h-52 items-center justify-center bg-white p-3">
              <Image
                src={t.image}
                alt={t.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain p-3"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-playfair text-xl font-bold leading-tight" style={{ color: NAVY }}>
                {t.name}
              </h3>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: TEAL }}>
                {t.kicker}
              </p>
              <ul className="mt-3 space-y-2">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs leading-relaxed text-navy-500">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45"
                      style={{ background: GOLD }}
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* What the device unlocks */}
      <div className="mt-6 rounded-2xl border border-navy-100 p-4 sm:p-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy-600">{C.unlocksHeading}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DEVICE_UNLOCKS.map((u) => (
            <div key={u.title} className="rounded-xl bg-slate-50/70 p-3.5">
              <p className="flex items-center gap-1.5 font-bold text-sm" style={{ color: TEAL }}>
                <Check className="h-3.5 w-3.5 shrink-0" />
                {u.title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-navy-500">{u.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Offer terms — reproduced in full */}
      <div
        className="mt-4 flex flex-col gap-2 rounded-2xl p-4 sm:flex-row sm:gap-4"
        style={{ background: 'rgba(198,150,46,0.08)', border: '1px solid rgba(198,150,46,0.35)' }}
      >
        <p
          className="flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] sm:border-r sm:pr-4"
          style={{ color: GOLD, borderColor: 'rgba(198,150,46,0.35)' }}
        >
          <ScrollText className="h-3.5 w-3.5" />
          {C.termsLabel}
        </p>
        <p className="text-xs leading-relaxed text-navy-500">{C.terms}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy-400">
          Early Bird Offer · ABHA Global Educare LLP
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: '#25D366' }}
        >
          <MessageCircle className="h-4 w-4" /> Ask for the current cut-off date
        </a>
      </div>
    </div>
  );
}
