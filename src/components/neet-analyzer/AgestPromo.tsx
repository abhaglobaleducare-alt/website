'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, ArrowUpRight, GraduationCap } from 'lucide-react';

/**
 * AGEST scholarship promotion — surfaced when a government seat is unlikely and
 * MBBS Georgia becomes the best-value path. Links to the evergreen /scholarship
 * page (the AGEST 2026 registration form closed on 10 July 2026).
 */
export default function AgestPromo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg sm:p-8"
      style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 50%, #7c3aed 100%)' }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest"
            style={{ background: 'rgba(198,150,46,0.25)', color: '#f5e6c8' }}
          >
            <Trophy className="h-3.5 w-3.5" /> Scholarship Opportunity
          </span>

          <h3 className="mt-4 font-playfair text-2xl font-bold leading-tight sm:text-3xl">
            A government seat looks unlikely — but your MBBS dream isn’t over.
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-purple-100">
            Through the <strong className="text-white">Bapusaheb Patil (Sagaon) Global Education Support Grant (AGEST)</strong>,
            ABHA students get an assured{' '}
            <strong style={{ color: '#FDE68A' }}>$3,000+</strong> grant (up to $6,000 for top rankers) towards a
            NMC &amp; WHO eligible MBBS in Tbilisi, Georgia — turning a missed rank into an affordable European medical degree.
          </p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-purple-100">
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" style={{ color: '#FDE68A' }} /> Merit-based · no minimum score
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="h-4 w-4" style={{ color: '#FDE68A' }} /> $3,000–$6,000 over 6 years
            </span>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto">
          <Link
            href="/scholarship"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-black transition-transform hover:-translate-y-0.5"
            style={{ background: '#FDE68A', color: '#1a1a2e' }}
          >
            Explore the AGEST Grant <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Ask about eligibility
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
