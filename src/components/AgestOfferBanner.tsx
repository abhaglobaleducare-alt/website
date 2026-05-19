'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, ArrowUpRight } from 'lucide-react';

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
          {/* Left: Offer details */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 flex-wrap">
              <span
                className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: 'rgba(198,150,46,0.25)', color: '#f5e6c8' }}
              >
                Introductory Offer
              </span>
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white/80">
                NEET 2026 Aspirants Only
              </span>
            </div>

            <h2
              className="font-playfair font-bold text-white leading-tight mb-3"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
            >
              🏆 ABHA Full NEET Mock Test
              <span className="block" style={{ color: '#FDE68A' }}>AGEST 2026</span>
            </h2>

            <p className="text-purple-200 text-sm sm:text-base mb-5 max-w-lg mx-auto lg:mx-0">
              Full 180-question NEET pattern test with +4/−1 marking, personalised subject-wise score analysis, and WhatsApp feedback.
            </p>

            <div className="flex items-center gap-4 justify-center lg:justify-start flex-wrap">
              <div className="flex items-baseline gap-3">
                <span className="text-purple-300 line-through text-xl font-semibold">₹2,110</span>
                <span
                  className="font-playfair font-black text-5xl"
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
              href="https://wa.me/917447552878?text=I%20want%20to%20register%20for%20AGEST%202026%20at%20%E2%82%B9111%20offer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              style={{ background: '#FDE68A', color: '#1a1a2e' }}
            >
              <Zap size={18} />
              Claim ₹111 Offer on WhatsApp
            </a>
            <Link
              href="/scholarship"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all"
            >
              Know More about AGEST <ArrowUpRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
