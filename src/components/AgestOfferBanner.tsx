'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, ArrowUpRight, GraduationCap, Trophy, Users } from 'lucide-react';

export default function AgestOfferBanner() {
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
                300 Scholarships Available
              </span>
            </div>

            <h2
              className="font-playfair font-bold text-white leading-tight mb-2"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
            >
              🏆 ABHA NEET Scholarship Test
              <span className="block" style={{ color: '#FDE68A' }}>AGEST 2026</span>
            </h2>

            <p className="text-purple-200 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-4">
              Bapusaheb Patil, Sagaon Abroad Education Support Grant
            </p>

            {/* Scholarship benefit highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/10 px-3 py-2.5">
                <GraduationCap size={20} style={{ color: '#FDE68A' }} className="flex-shrink-0" />
                <div className="text-left">
                  <div className="text-white font-black text-sm leading-none">Up to $1,000</div>
                  <div className="text-purple-200 text-[11px] mt-0.5">per year</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/10 px-3 py-2.5">
                <Trophy size={20} style={{ color: '#FDE68A' }} className="flex-shrink-0" />
                <div className="text-left">
                  <div className="text-white font-black text-sm leading-none">Up to $6,000</div>
                  <div className="text-purple-200 text-[11px] mt-0.5">total per student</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/10 px-3 py-2.5">
                <Users size={20} style={{ color: '#FDE68A' }} className="flex-shrink-0" />
                <div className="text-left">
                  <div className="text-white font-black text-sm leading-none">300 students</div>
                  <div className="text-purple-200 text-[11px] mt-0.5">scholarship seats</div>
                </div>
              </div>
            </div>

            {/* Pricing — registration fee */}
            <div className="flex items-center gap-4 justify-center lg:justify-start flex-wrap">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-purple-300 text-[11px] font-semibold uppercase tracking-wide">
                  Original Value
                </span>
                <span className="text-purple-300 line-through text-xl font-semibold">₹2,110</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-yellow-200 text-[11px] font-semibold uppercase tracking-wide">
                  Only for 2026 NEET Aspirants · Registration Fee
                </span>
                <span
                  className="font-playfair font-black text-5xl leading-none"
                  style={{ color: '#FDE68A' }}
                >
                  ₹111
                </span>
              </div>
              <span className="text-xs font-black px-3 py-1.5 rounded-full bg-red-500/25 text-red-300 border border-red-500/30">
                90% OFF
              </span>
            </div>
          </div>

          {/* Right: CTAs */}
          <div className="flex flex-col gap-3 items-center lg:items-start flex-shrink-0">
            <a
              href="https://wa.me/917447552878?text=I%20want%20to%20register%20for%20AGEST%202026%20%E2%80%94%20ABHA%20NEET%20Scholarship%20Test%20%28%E2%82%B9111%20registration%20fee%29"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              style={{ background: '#FDE68A', color: '#1a1a2e' }}
            >
              <Zap size={18} />
              Register for AGEST 2026
            </a>
            <Link
              href="/scholarship"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all"
            >
              Know More about AGEST <ArrowUpRight size={15} />
            </Link>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="text-purple-300/80 text-[11px] leading-relaxed mt-6 max-w-3xl mx-auto text-center lg:text-left"
        >
          Scholarship awards are subject to AGEST ranking, eligibility criteria, admission through
          ABHA Global Educare, scholarship policy, and continued academic performance. Scholarship
          support may be distributed across the duration of the eligible MBBS program.
        </motion.p>
      </div>
    </section>
  );
}
