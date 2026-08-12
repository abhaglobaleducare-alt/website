'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Target, ArrowRight } from 'lucide-react';

/**
 * PERMANENT fixture — the NEET Admission Decision Engine.
 *
 * Deliberately NOT an entry in `announcements.ts`. Announcements are
 * time-sensitive and dismissible: they carry date windows, they expire, and a
 * visitor can close one into the "बंद केलेल्या updates" drawer and never see it
 * again. The Decision Engine is a standing product, not news, so it must
 * survive every announcement cycle and cannot be dismissed away.
 *
 * Sits ABOVE the announcement banners on the homepage so it holds the first
 * position no matter how many updates are live at the time.
 *
 * The pulse is a slow glow rather than a hard blink: a true on/off flash is
 * both an accessibility hazard and reads as a cheap ad. It is disabled outright
 * for visitors who ask for reduced motion.
 */
export default function NeetEngineSpotlight() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="border-b border-gray-100 bg-[#F5F6FA]">
      <div className="mx-auto max-w-[1400px] px-4 pt-4 sm:px-8">
        <Link
          href="/neet-analyzer"
          aria-label="NEET Admission Decision Engine — check your admission chances"
          className="group relative block overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold focus-visible:ring-offset-2"
          style={{
            background: 'linear-gradient(135deg, #0B1A35 0%, #1a3160 60%, #24406f 100%)',
            border: '2px solid #C6962E',
          }}
        >
          {/* Slow gold glow — the "this is live" cue */}
          {!reduceMotion && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: [
                  'inset 0 0 0 rgba(198,150,46,0)',
                  'inset 0 0 30px rgba(198,150,46,0.5)',
                  'inset 0 0 0 rgba(198,150,46,0)',
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <div className="relative flex items-center gap-3 p-3.5 sm:gap-4 sm:p-4">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12"
              style={{ background: 'rgba(198,150,46,0.16)' }}
            >
              <Target className="h-5 w-5 text-primary-gold sm:h-6 sm:w-6" />
            </span>

            <div className="min-w-0 flex-1">
              {/* LIVE chip — permanent, so it says ALWAYS ON, not a date */}
              <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                {!reduceMotion ? (
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
                Always available
              </span>

              <p className="font-playfair text-base font-bold leading-snug text-white sm:text-lg">
                NEET Admission Decision Engine
              </p>
              {/* Phones get the headline only, matching the banner rule */}
              <p className="mt-0.5 hidden text-xs leading-relaxed text-white/75 sm:block sm:text-sm">
                तुमचा NEET score व All India Rank टाका — Govt / Private / Abroad admission ची शक्यता,
                seat matrix, खर्चाची तुलना आणि personalised roadmap एका क्लिकवर.
              </p>
            </div>

            <span
              className="hidden shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-transform duration-300 group-hover:translate-x-0.5 sm:inline-flex"
              style={{ background: 'linear-gradient(to right, #C6962E, #DFB761)', color: '#0B1A35' }}
            >
              तपासा
              <ArrowRight size={16} />
            </span>
            <ArrowRight
              aria-hidden="true"
              size={18}
              className="shrink-0 text-primary-gold transition-transform duration-300 group-hover:translate-x-1 sm:hidden"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
