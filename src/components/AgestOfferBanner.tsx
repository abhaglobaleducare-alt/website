'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LeadGate from '@/components/LeadGate';
import {
  Zap,
  ArrowUpRight,
  GraduationCap,
  Users,
  ChevronDown,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

/* Scholarship seat tracker — update SEATS_CLAIMED as real registrations come in.
   Keep this honest: it should reflect actual confirmed registrations, never a guess. */
const SEATS_TOTAL = 300;
const SEATS_CLAIMED = 0;

export default function AgestOfferBanner() {
  const [showTerms, setShowTerms] = useState(false);
  const seatsLeft = Math.max(SEATS_TOTAL - SEATS_CLAIMED, 0);
  const filledPct = Math.min(Math.round((SEATS_CLAIMED / SEATS_TOTAL) * 100), 100);

  return (
    <section
      className="relative py-14 sm:py-16 px-4 sm:px-8 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 50%, #7c3aed 100%)' }}
    >
      {/* Background glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex flex-col lg:flex-row items-center gap-8"
        >
          {/* Left: Scholarship details */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 flex-wrap">
              <span
                className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: 'rgba(198,150,46,0.25)', color: '#f5e6c8' }}
              >
                Scholarship Program
              </span>
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white/80">
                {SEATS_TOTAL} Scholarships Available
              </span>
            </div>

            <h2
              className="font-playfair font-bold text-white leading-tight mb-2"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
            >
              🏆 Bapusaheb Patil (Sagaon) Global Education Support Grant
              <span className="block" style={{ color: '#FDE68A' }}>AGEST 2026</span>
            </h2>

            <p className="text-purple-200 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-5">
              Merit-based grant · MBBS in Tbilisi, Georgia
            </p>

            {/* Hero value — lead with the assured floor, not the maximum */}
            <div className="flex items-end justify-center lg:justify-start gap-4 mb-2 flex-wrap">
              <div className="flex flex-col items-center lg:items-start">
                <span
                  className="font-playfair font-black leading-none"
                  style={{ color: '#FDE68A', fontSize: 'clamp(2.6rem, 7vw, 4.2rem)' }}
                >
                  $3,000+
                </span>
                <span className="text-purple-100 text-sm font-semibold mt-1">
                  assured total grant · up to $6,000 for top rankers
                </span>
              </div>
              <span className="inline-block text-sm font-bold px-3 py-1.5 rounded-full bg-white/10 text-white mb-2">
                $500–$1,000 / year by rank
              </span>
            </div>

            {/* Supporting stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/10 px-3 py-2.5">
                <Users size={20} style={{ color: '#FDE68A' }} className="flex-shrink-0" />
                <div className="text-left">
                  <div className="text-white font-black text-sm leading-none">{SEATS_TOTAL} students</div>
                  <div className="text-purple-200 text-[11px] mt-0.5">100 per ABHA office</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/10 px-3 py-2.5">
                <MapPin size={20} style={{ color: '#FDE68A' }} className="flex-shrink-0" />
                <div className="text-left">
                  <div className="text-white font-black text-sm leading-none">MBBS in Tbilisi</div>
                  <div className="text-purple-200 text-[11px] mt-0.5">Georgia · ABHA partners</div>
                </div>
              </div>
            </div>

            {/* Seats-remaining tracker (only meaningful once registrations begin) */}
            {SEATS_CLAIMED > 0 && (
              <div className="mb-5 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center justify-between text-[11px] font-semibold text-purple-100 mb-1.5">
                  <span>{SEATS_CLAIMED} of {SEATS_TOTAL} scholarship seats claimed</span>
                  <span>{seatsLeft} left</span>
                </div>
                <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${filledPct}%`, background: '#FDE68A' }} />
                </div>
              </div>
            )}

            {/* Registration fee — small, framed as a fee not a purchase */}
            <p className="text-purple-100 text-sm">
              <span className="text-purple-300 line-through mr-1.5">₹2,110</span>
              <span className="font-bold text-white">+ ₹111 to register</span>
              <span className="ml-2 text-[11px] font-black px-2 py-0.5 rounded-full bg-red-500/25 text-red-300 border border-red-500/30">
                90% OFF
              </span>
            </p>
          </div>

          {/* Right: CTAs */}
          <div className="flex flex-col gap-3 items-center lg:items-start flex-shrink-0">
            <LeadGate action="claim_111" mode="newTab">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScfLV7uW_1gEoxj8y8yc_1aVYfZ32k22NcPxwn0fax6ZwPh-g/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              style={{ background: '#FDE68A', color: '#1a1a2e' }}
            >
              <Zap size={18} />
              Register for AGEST 2026
            </a>
            </LeadGate>
            <p className="text-purple-200 text-xs text-center lg:text-left max-w-[15rem]">
              Open to all 2026 NEET aspirants · No minimum score · Register by 10 July 2026
            </p>
            <LeadGate action="know_agest" mode="sameTab">
            <Link
              href="/scholarship"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all"
            >
              Know More about AGEST <ArrowUpRight size={15} />
            </Link>
            </LeadGate>
          </div>
        </motion.div>

        {/* Trust strip — who funds this & that ABHA is a registered entity */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-purple-100/90 text-xs"
        >
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap size={14} style={{ color: '#FDE68A' }} />
            Grant funded &amp; disbursed by ABHA Global Services LLC, Tbilisi (in USD)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} style={{ color: '#FDE68A' }} />
            India partner: ABHA Global Educare LLP — Registered
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} style={{ color: '#FDE68A' }} />
            Offices: Kolhapur · Chh. Sambhajinagar · Boisar · Tbilisi
          </span>
        </motion.div>

        {/* Collapsible scholarship terms */}
        <div className="mt-4 max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
          <button
            type="button"
            onClick={() => setShowTerms((v) => !v)}
            className="inline-flex items-center gap-1.5 text-purple-200 hover:text-white text-xs font-semibold transition-colors"
            aria-expanded={showTerms}
          >
            Scholarship terms
            <ChevronDown
              size={14}
              className="transition-transform"
              style={{ transform: showTerms ? 'rotate(180deg)' : 'none' }}
            />
          </button>
          {showTerms && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-purple-300/80 text-[11px] leading-relaxed mt-2 overflow-hidden"
            >
              Grant funded and disbursed in USD by ABHA Global Services LLC, Tbilisi; ABHA Global Educare LLP
              is the India implementation partner. Value $3,000–$6,000 over 6 years ($500–$1,000/year by
              merit rank) — Year 1 assured on enrolment, Years 2–6 conditional on continued ABHA Package
              enrolment. Each of the 3 ABHA offices (Kolhapur, Chh. Sambhajinagar, Boisar) holds its own
              AGEST 2026 merit list of 100 seats; tier is by rank only, never by fee-payment order. Ranks
              6–100 per office receive $500/year ($3,000); the top 5 per office up to $1,000/year ($6,000).
              Available only for admission to an ABHA partner university in Tbilisi, Georgia.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
