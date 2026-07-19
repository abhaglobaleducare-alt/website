'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Compass } from 'lucide-react';

interface Props {
  title?: string;
  subtitle?: string;
}

export default function Hero({
  title = 'NEET Admission Decision Engine',
  subtitle = 'Not just a rank calculator — a complete decision system. Enter your NEET score and get your estimated rank, government & private chances, an honest cost comparison, a confidence score and a personalised roadmap.',
}: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-navy to-navy-700 px-4 pb-16 pt-24 text-white sm:pt-28">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-blue/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-200 backdrop-blur"
        >
          <Compass className="h-4 w-4" /> ABHA Global Educare
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-5 bg-gradient-to-br from-gold-200 via-primary-gold to-gold-400 bg-clip-text font-playfair text-4xl font-bold leading-tight text-transparent drop-shadow-sm sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-base text-navy-100 sm:text-lg"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-navy-100"
        >
          <span className="inline-flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary-gold" /> Rank + percentile estimate
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary-gold" /> Govt · Private · Abroad chances
          </span>
          <span className="inline-flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary-gold" /> Personalised roadmap
          </span>
        </motion.div>
      </div>
    </section>
  );
}
