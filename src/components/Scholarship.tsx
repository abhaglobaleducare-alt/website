'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  CheckCircle2,
  Globe,
  BookOpen,
  Brain,
  Phone,
  Zap,
  ArrowUpRight,
  Flame,
  Repeat2,
  Clock,
  GraduationCap,
  Star,
  Trophy,
  MapPin,
} from 'lucide-react';

/* ── Animated count-up number ─────────────────────────────────── */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
      else setDisplay(target);
    };
    requestAnimationFrame((t) => step(t, t));
  }, [inView, target]);

  return (
    <span ref={ref}>
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

/* ── Ticker items (duplicated for seamless loop) ──────────────── */
const ticker = [
  '🔥 NEET PATTERN',
  '💰 JUST ₹111',
  '🏆 TOP 300 WIN',
  '💵 $6,000 SCHOLARSHIP',
  '� Multiple Attempts',
  '📊 Final Result on NEET Result Day',
  '🇬🇪 MBBS IN GEORGIA',
  '⚡ REGISTER NOW',
  '🔥 NEET PATTERN',
  '💰 JUST ₹111',
  '🏆 TOP 300 WIN',
  '💵 $6,000 SCHOLARSHIP',
  '🔄 Multiple Attempts',
  '📊 Final Result on NEET Result Day',
  '🇬🇪 MBBS IN GEORGIA',
  '⚡ REGISTER NOW',
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Scholarship() {
  return (
    <div className="overflow-x-hidden font-sans">

      {/* ══════════════════════════════════════
          HERO
          ══════════════════════════════════════ */}
      <section className="relative bg-[#0B1A35] min-h-[92vh] flex flex-col justify-center overflow-hidden px-5 sm:px-10 py-16 sm:py-20">

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#C6962E 1px,transparent 1px),linear-gradient(90deg,#C6962E 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Colour glows */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#C6962E]/12 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#1B7C9E]/12 blur-[100px] pointer-events-none" />

        {/* Floating shapes */}
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-24 right-10 sm:right-24 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C6962E] to-[#f5a623] opacity-20 hidden sm:block"
        />
        <motion.div
          animate={{ y: [0, 14, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-32 left-10 sm:left-24 w-10 h-10 rounded-xl bg-[#1B7C9E]/30 hidden sm:block"
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[#C6962E]/60 hidden lg:block"
        />

        <div className="relative max-w-[900px] mx-auto w-full">

          {/* Animated pill — FLASHING TITLE */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <motion.span
              animate={{
                background: [
                  'linear-gradient(90deg,#C6962E,#f5a623)',
                  'linear-gradient(90deg,#f5a623,#FFD770)',
                  'linear-gradient(90deg,#FFD770,#C6962E)',
                  'linear-gradient(90deg,#C6962E,#f5a623)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              className="inline-block text-[#0B1A35] font-black text-sm sm:text-base px-5 py-2.5 rounded-full shadow-[0_4px_24px_rgba(198,150,46,0.45)] tracking-wide"
            >
              📚 Start Right. Prepare Smart. Score High.
            </motion.span>
          </motion.div>

          {/* HEADLINE */}
          <div className="text-center mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-playfair font-bold leading-[1.08] text-white"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}
            >
              Your NEET Score Decides
              <br />
              <span className="text-[#C6962E]">Your MBBS Future.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="font-playfair font-bold text-[#FFD770] leading-tight mt-2"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}
            >
              Let&apos;s Build That Score — Together. 🎓
            </motion.p>
            {/* Premium Sentence */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="text-center text-lg sm:text-xl text-white font-semibold max-w-[640px] mx-auto mt-4"
            >
              India&apos;s Most Trusted NEET Excellence Program — Structured, Affordable &amp; Rewarding
            </motion.p>
          </div>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
            className="text-center text-lg sm:text-xl text-gray-300 max-w-[600px] mx-auto mb-10 leading-relaxed"
          >
            Every NEET mark matters. Our structured revision portal and real-exam practice
            hub give every serious student the tools to prepare with confidence —{' '}
            <span className="text-white font-bold">and High-performing candidates can secure a government MBBS seat in India, or, if not, qualify for a scholarship to study medicine abroad,</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.46 }}
            className="flex flex-col items-center gap-5"
          >
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/neet-preparation"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C6962E] via-[#e0a830] to-[#FFD770] text-[#0B1A35] px-7 py-4 rounded-xl font-black text-base sm:text-lg shadow-[0_0_40px_rgba(198,150,46,0.4)] hover:shadow-[0_0_60px_rgba(198,150,46,0.6)] transition-all duration-300 hover:-translate-y-0.5"
              >
                📚 NEET Preparation
                <ArrowUpRight size={17} className="shrink-0" />
              </Link>
              <Link
                href="/neet-practice-hub"
                className="inline-flex items-center gap-2.5 border-2 border-[#C6962E]/60 text-white px-7 py-4 rounded-xl font-black text-base sm:text-lg hover:bg-[#C6962E]/10 hover:border-[#C6962E] transition-all duration-300 hover:-translate-y-0.5"
              >
                🎯 NEET Practice Hub
                <ArrowUpRight size={17} className="shrink-0" />
              </Link>
            </div>
            <a
              href="tel:+917447552878"
              className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-6 py-2.5 rounded-xl font-semibold text-sm hover:border-[#C6962E]/60 hover:text-white transition-all duration-300"
            >
              <Phone size={14} /> +91 74475 52878
            </a>
          </motion.div>

          {/* Urgency strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C6962E] animate-pulse" />
              ⏳ Last date:{' '}
              <strong className="text-white">Don&apos;t wait for the Last Date</strong>
            </span>
          </motion.div>

          {/* Student Login Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-5 flex justify-center"
          >
            <a
              href="https://abha-neet-prepportal.vercel.app/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-all duration-200"
              style={{ background: '#16A34A', color: '#fff' }}
            >
              🎓 Student Login — NEET Portal
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SCROLLING TICKER BAND
      ══════════════════════════════════════ */}
      <div className="bg-[#C6962E] py-3 overflow-hidden border-y-2 border-[#0B1A35]/10">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="flex gap-8 whitespace-nowrap"
        >
          {ticker.map((item, i) => (
            <span
              key={i}
              className="text-[#0B1A35] font-black text-sm tracking-wider shrink-0"
            >
              {item}{' '}
              <span className="mx-2 opacity-40">|</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          AGEST ₹111 OFFER CARD
      ══════════════════════════════════════ */}
      <section
        className="relative py-14 sm:py-16 px-5 sm:px-10 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 50%, #7c3aed 100%)' }}
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1100px] mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col lg:flex-row items-center gap-10"
          >
            {/* Left */}
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
                style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.6rem)' }}
              >
                🏆 ABHA Full NEET Mock Test
                <span className="block" style={{ color: '#FDE68A' }}>AGEST 2026</span>
              </h2>
              <p className="text-purple-200 text-sm sm:text-base mb-5 max-w-lg mx-auto lg:mx-0">
                Full 180-question NEET pattern test with +4/−1 marking, personalised subject-wise score analysis, and WhatsApp feedback. One test could change everything.
              </p>
              <div className="flex items-center gap-4 justify-center lg:justify-start flex-wrap">
                <div className="flex items-baseline gap-3">
                  <span className="text-purple-300 line-through text-2xl font-semibold">₹2,110</span>
                  <span className="font-playfair font-black text-6xl" style={{ color: '#FDE68A' }}>₹111</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black px-3 py-1.5 rounded-full bg-red-500/25 text-red-300 border border-red-500/30">
                    90% OFF
                  </span>
                  <span className="text-xs text-purple-300">Limited time only</span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-3 items-center lg:items-start flex-shrink-0 lg:w-56">
              <a
                href="https://wa.me/917447552878?text=I%20want%20to%20register%20for%20AGEST%202026%20at%20%E2%82%B9111%20offer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-black text-base transition-all hover:-translate-y-0.5 hover:shadow-2xl text-center"
                style={{ background: '#FDE68A', color: '#1a1a2e' }}
              >
                <Zap size={18} />
                Claim ₹111 Offer
              </a>
              <a
                href="https://abha-neet-prepportal.vercel.app/login"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all text-center"
              >
                🎓 Student Login — NEET Portal
              </a>
              <p className="text-purple-300 text-xs text-center">
                WhatsApp to register. NEET 2026 only.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          AGEST IDENTITY BANNER
      ══════════════════════════════════════ */}
      <section className="bg-[#FFF8EE] py-16 sm:py-20 px-5 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[820px] mx-auto"
        >
          <span className="inline-block text-[#C6962E] text-xs font-black uppercase tracking-[0.3em] mb-4 border border-[#C6962E]/30 px-3 py-1 rounded-full">
            Introducing
          </span>
          <h2
            className="font-playfair font-bold text-[#0B1A35] leading-tight mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            🎓 ABHA NEET Excellence Pathway
          </h2>
          <p className="text-[#0B1A35]/60 font-semibold text-sm sm:text-base tracking-widest uppercase">
            Bapusaheb Patil (Sagaon) Abroad Education Support Grant
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          AGEST 2026 — FULL DETAILS
      ══════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28 px-5 sm:px-10 overflow-hidden">
        <div className="max-w-[1100px] mx-auto">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-[#0B1A35] text-[#C6962E] text-xs font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-5">
              India&apos;s First Consistency-Based Scholarship Test
            </span>
            <h2
              className="font-playfair font-bold text-[#0B1A35] leading-tight mb-3"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}
            >
              🏆 AGEST 2026
              <span className="block text-[#C6962E]">MBBS Abroad Scholarship Test</span>
            </h2>
            <p className="text-[#0B1A35]/60 text-lg sm:text-xl font-semibold italic mt-2">
              &ldquo;Where consistency wins, not luck&rdquo;
            </p>
          </motion.div>

          {/* Core Offer — 3 highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
            {[
              {
                icon: <Trophy size={28} />,
                value: '$6,000',
                label: 'Total Scholarship',
                sub: '$1,000/year × 6 years ≈ ₹5,00,000 per student',
                color: '#C6962E',
                bg: '#FFF8EE',
                border: '#C6962E',
              },
              {
                icon: <Star size={28} />,
                value: 'Top 300',
                label: 'Scholars Selected',
                sub: 'Open to top 300 NEET 2026 aspirants on merit',
                color: '#22C55E',
                bg: '#F0FDF4',
                border: '#22C55E',
              },
              {
                icon: <Zap size={28} />,
                value: '₹111',
                label: 'One-Time Fee',
                sub: 'Covers ALL attempts — no extra cost per attempt',
                color: '#6366F1',
                bg: '#EEF2FF',
                border: '#6366F1',
              },
            ].map(({ icon, value, label, sub, color, bg, border }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl p-7 text-center shadow-sm border-2"
                style={{ background: bg, borderColor: `${border}30` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${color}18`, color }}
                >
                  {icon}
                </div>
                <p className="font-black text-4xl leading-none mb-2" style={{ color }}>
                  {value}
                </p>
                <p className="font-bold text-[#0B1A35] text-base mb-2">{label}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Two-column: What Makes It Unique + Key Dates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">

            {/* What Makes It Unique */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#0B1A35] rounded-2xl p-8 shadow-xl"
            >
              <h3 className="font-playfair font-bold text-white text-xl mb-7 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#C6962E]/20 flex items-center justify-center text-[#C6962E]">
                  <Star size={18} />
                </span>
                What Makes It Unique
              </h3>
              <ul className="space-y-5">
                {[
                  {
                    icon: <Repeat2 size={18} />,
                    title: 'Multiple Attempts, One Registration',
                    desc: 'Appear as many times as you want — no extra cost ever',
                    accent: '#C6962E',
                  },
                  {
                    icon: <Star size={18} />,
                    title: 'Best-3-Average Merit Formula',
                    desc: 'Your final score = average of your top 3 highest attempts',
                    accent: '#FFD770',
                  },
                  {
                    icon: <Clock size={18} />,
                    title: 'Same-Day Results',
                    desc: 'Every attempt delivers your result on the very same day',
                    accent: '#60A5FA',
                  },
                  {
                    icon: <CalendarDays size={18} />,
                    title: 'On-Demand Scheduling',
                    desc: 'Appear whenever you feel prepared — first attempt from Day 3 after registration',
                    accent: '#34D399',
                  },
                  {
                    icon: <Trophy size={18} />,
                    title: 'Instant Plan B on NEET Result Day',
                    desc: 'Final merit list announced on NEET 2026 result day — no waiting',
                    accent: '#F472B6',
                  },
                ].map(({ icon, title, desc, accent }, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${accent}22`, color: accent }}
                    >
                      {icon}
                    </span>
                    <div>
                      <p className="font-bold text-white text-sm">{title}</p>
                      <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Key Dates */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5"
            >
              <div className="bg-[#FFF8EE] rounded-2xl p-8 border-2 border-[#C6962E]/20 flex-1">
                <h3 className="font-playfair font-bold text-[#0B1A35] text-xl mb-7 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-[#C6962E]/15 flex items-center justify-center text-[#C6962E]">
                    <CalendarDays size={18} />
                  </span>
                  Key Dates &amp; Rules
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      label: 'First Attempt Available',
                      value: 'From Day 3 after registration',
                      emoji: '🚀',
                      accent: '#22C55E',
                    },
                    {
                      label: 'Last Attempt Deadline',
                      value: '10 days before NEET 2026 result',
                      emoji: '⏰',
                      accent: '#EF4444',
                    },
                    {
                      label: 'Final Merit List',
                      value: 'On NEET 2026 result day',
                      emoji: '🏆',
                      accent: '#C6962E',
                    },
                  ].map(({ label, value, emoji, accent }) => (
                    <div
                      key={label}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
                    >
                      <span className="text-2xl shrink-0">{emoji}</span>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: accent }}>
                          {label}
                        </p>
                        <p className="font-bold text-[#0B1A35] text-sm">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration fee highlight */}
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: 'linear-gradient(135deg, #0B1A35 0%, #152d54 100%)' }}
              >
                <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-2">
                  One-time Registration Fee
                </p>
                <p className="font-black text-[#FFD700] leading-none mb-1" style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)' }}>
                  ₹111
                </p>
                <p className="text-white/60 text-sm">Covers every single attempt you take</p>
              </div>
            </motion.div>
          </div>

          {/* Universities & Support */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-gradient-to-br from-[#0B1A35] to-[#152d54] rounded-3xl p-8 sm:p-10 mb-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-10 h-10 rounded-xl bg-[#C6962E]/20 flex items-center justify-center text-[#C6962E]">
                <GraduationCap size={20} />
              </span>
              <h3 className="font-playfair font-bold text-white text-xl">
                Partner Universities &amp; Full Support
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Universities */}
              <div>
                <p className="text-[#C6962E] text-xs font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                  <MapPin size={13} /> NMC &amp; WHO Eligible Universities — Georgia 🇬🇪
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'European University',
                    'Alte University',
                    'SEU Georgia',
                    'East West University',
                  ].map((uni) => (
                    <div
                      key={uni}
                      className="flex items-center gap-2.5 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3"
                    >
                      <span className="text-[#C6962E] shrink-0">
                        <CheckCircle2 size={15} />
                      </span>
                      <p className="text-white text-sm font-semibold leading-tight">{uni}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* End-to-end support */}
              <div>
                <p className="text-[#60A5FA] text-xs font-black uppercase tracking-[0.25em] mb-4">
                  End-to-End Support Included
                </p>
                <div className="space-y-3">
                  {[
                    { emoji: '🎓', text: 'Free counselling &amp; admission guidance' },
                    { emoji: '✈️', text: 'Visa assistance &amp; airport pickup' },
                    { emoji: '🏠', text: 'ABHA-managed hostel in Tbilisi' },
                    { emoji: '🍛', text: 'Indian food available' },
                  ].map(({ emoji, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{emoji}</span>
                      <p
                        className="text-white/70 text-sm"
                        dangerouslySetInnerHTML={{ __html: text }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-500 text-sm mb-5">
              WhatsApp <strong className="text-[#0B1A35]">&ldquo;AGEST&rdquo;</strong> to register, or visit our website
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://wa.me/917447552878?text=AGEST"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C6962E] via-[#e0a830] to-[#FFD770] text-[#0B1A35] px-8 py-4 rounded-xl font-black text-base shadow-[0_0_40px_rgba(198,150,46,0.35)] hover:shadow-[0_0_60px_rgba(198,150,46,0.55)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <Zap size={18} /> WhatsApp &ldquo;AGEST&rdquo; — +91 74475 52878
              </a>
              <a
                href="https://wa.me/917249409376?text=AGEST"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 border-2 border-[#C6962E]/60 text-[#0B1A35] px-7 py-4 rounded-xl font-black text-base hover:bg-[#C6962E]/10 hover:border-[#C6962E] transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone size={17} /> +91 72494 09376
              </a>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              <a
                href="https://abhaglobaleducare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#C6962E] font-bold text-sm hover:underline"
              >
                <Globe size={14} /> abhaglobaleducare.com <ArrowUpRight size={13} />
              </a>
              <span className="text-gray-300 text-sm">·</span>
              <a
                href="https://abhaglobal.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#C6962E] font-bold text-sm hover:underline"
              >
                <Globe size={14} /> abhaglobal.in <ArrowUpRight size={13} />
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          BIG 3 STATS — count-up numbers
      ══════════════════════════════════════ */}
      <section className="bg-[#0B1A35] py-16 sm:py-20 px-5 sm:px-10 overflow-hidden">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {[
            {
              display: '₹999 & ₹1111',
              label: 'Registration Fee for NEET Excellence Program',
              sub: 'Less than a Family Dinner 🍕',
              color: '#C6962E',
            },
            {
              number: 300,
              prefix: '',
              label: 'Scholars Selected',
              sub: 'Nationwide merit list 🏆',
              color: '#22C55E',
            },
            {
              display: 'up to $6,000',
              label: 'Rewards / Gifts / Scholarship',
              sub: '≈ ₹5+ Lakhs over 6 yrs 💵',
              color: '#60A5FA',
            },
          ].map(({ number, prefix, display, label, sub, color }: { number?: number; prefix?: string; display?: string; label: string; sub: string; color: string }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="py-10 sm:py-0 sm:px-12 text-center"
            >
              <p
                className={`font-black leading-none mb-2 ${display ? 'text-3xl sm:text-4xl' : 'text-5xl sm:text-6xl'}`}
                style={{ color }}
              >
                {display
                  ? display
                  : <>{prefix}<CountUp target={number ?? 0} /></>
                }
              </p>
              <p className="text-white font-bold text-lg mb-1">{label}</p>
              <p className="text-gray-500 text-sm">{sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          EXAM FORMAT + PRIZE TICKET
      ══════════════════════════════════════ */}
      <section className="bg-[#FFF8EE] py-20 sm:py-24 px-5 sm:px-10">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-[#C6962E] text-xs font-black uppercase tracking-[0.25em] mb-4">
              About the Test
            </span>
            <h2 className="font-playfair font-bold text-[#0B1A35] text-3xl sm:text-4xl leading-tight mb-5">
              NEET pattern.
              <br />
              <span className="text-[#C6962E]">Real exam feel.</span>
              <br />
              All online. 💥
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-[1.05rem]">
              This isn&apos;t a random MCQ test. It&apos;s designed exactly like NEET — Physics,
              Chemistry &amp; Biology, 3 hours, 180 questions. You get sharper going into
              NEET. And you could win big.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { emoji: '📚', text: 'PCB — 180 Questions' },
                { emoji: '⏱️', text: '3 Hour Duration' },
                { emoji: '🖥️', text: 'Online Mode' },
                { emoji: '🔄', text: 'Multiple Attempts' },
              ].map(({ emoji, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-[#0B1A35] font-semibold text-sm px-4 py-2 rounded-lg shadow-sm"
                >
                  {emoji} {text}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: Prize ticket card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="bg-[#0B1A35] rounded-3xl overflow-hidden shadow-2xl">
              {/* UPPER PART: Title + Introductory offer pricing */}
              <div className="bg-gradient-to-r from-[#C6962E] to-[#f5a623] p-4 text-center">
                <p className="text-[#0B1A35] font-black text-xs sm:text-sm uppercase tracking-widest mb-2">
                  🏆 Only for 2026 NEET Aspirants : Introductory Offer
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-black text-2xl" style={{ color: '#dc2626', textDecoration: 'line-through' }}>
                    ₹2,110
                  </span>
                  <span className="font-black text-3xl" style={{ color: '#14532d' }}>
                    ₹111
                  </span>
                </div>
              </div>

              {/* Dashed rule */}
              <div className="px-6 py-1">
                <div className="border-t border-dashed border-white/10" />
              </div>

              {/* MIDDLE PART: Two vertical columns */}
              <div className="px-6 py-6 grid grid-cols-2">
                {/* Column 1: iPad / Tablet Reward */}
                <div className="text-center pr-3 border-r border-white/10">
                  <p className="text-4xl mb-2">📱</p>
                  <p className="text-white font-bold text-sm">iPad / Tablet</p>
                  <p className="text-[#C6962E] font-black text-sm mt-0.5">Reward</p>
                  <p className="text-white/60 text-xs mt-2 leading-relaxed">Learn, Practice &amp; Win</p>
                </div>
                {/* Column 2: Scholarship range */}
                <div className="text-center pl-3">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">
                    Scholarship Per Year
                  </p>
                  <p className="text-[#FFD770] font-black text-base leading-tight">
                    From $500 to $1,000
                  </p>
                  <p className="text-white/60 text-sm mt-1">× 6 years of MBBS</p>
                  <div className="my-3 border-t border-dashed border-white/10" />
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">
                    Total Value
                  </p>
                  <p className="text-[#C6962E] font-black text-base">$3,000 to $6,000</p>
                  <p className="text-white/50 text-xs mt-1">≈ ₹2,70,000 to ₹5,40,000</p>
                </div>
              </div>

              {/* LOWER PART: Bold limited period notice */}
              <div className="bg-white/5 px-6 py-4 text-center border-t border-white/10">
                <p className="text-white font-black text-xs sm:text-sm uppercase tracking-wide">
                  ⚡ ONLY FOR LIMITED PERIOD FOR NEET 2026 ASPIRANTS ⚡
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ rotate: ['-6deg', '-4deg', '-6deg'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-red-500 text-white font-black text-xs py-2 px-3 rounded-xl shadow-lg"
              style={{ rotate: '-6deg' }}
            >
              🔥 Limited Seats
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHO + WHERE
      ══════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-24 px-5 sm:px-10">
        <div className="max-w-[1100px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair font-bold text-[#0B1A35] text-3xl sm:text-4xl mb-12 text-center"
          >
            Is this for you?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Who */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="border-2 border-[#0B1A35]/[0.08] rounded-2xl p-8 bg-[#FFF8EE]"
            >
              <div className="flex items-center gap-3 mb-7">
                <span className="text-2xl">🎯</span>
                <h3 className="font-playfair font-bold text-[#0B1A35] text-xl">
                  Who Can Apply
                </h3>
              </div>
              <ul className="space-y-5">
                {[
                  { t: '12th Science students', s: 'Preparing for NEET this year' },
                  { t: 'NEET Droppers', s: 'Retaking NEET or planning abroad' },
                  { t: 'MBBS Abroad Aspirants', s: 'Want to study in Georgia or similar' },
                ].map(({ t, s }) => (
                  <li key={t} className="flex gap-4">
                    <CheckCircle2
                      size={20}
                      className="text-[#22C55E] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-[#0B1A35]">{t}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{s}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Where valid */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="border-2 border-[#0B1A35]/[0.08] rounded-2xl p-8 bg-[#FFF8EE]"
            >
              <div className="flex items-center gap-3 mb-7">
                <span className="text-2xl">🌍</span>
                <h3 className="font-playfair font-bold text-[#0B1A35] text-xl">
                  Valid For
                </h3>
              </div>
              <ul className="space-y-5">
                {[
                  { t: 'MBBS in Georgia 🇬🇪', s: 'Applied against annual tuition fee' },
                  { t: 'NMC Eligible Universities', s: 'WHO & NMC guideline compliant' },
                  { t: 'ABHA Partner Institutions', s: 'Only through ABHA Global Educare' },
                ].map(({ t, s }) => (
                  <li key={t} className="flex gap-4">
                    <Globe
                      size={20}
                      className="text-[#60A5FA] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-[#0B1A35]">{t}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{s}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DUAL CTA — NEET Preparation + NEET Practice Hub
      ══════════════════════════════════════ */}
      <section className="bg-[#0B1A35] py-14 px-5 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-2">Choose Your Pathway</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/neet-preparation"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C6962E] via-[#e0a830] to-[#FFD770] text-[#0B1A35] px-7 py-4 rounded-xl font-black text-base sm:text-lg shadow-[0_0_40px_rgba(198,150,46,0.4)] hover:shadow-[0_0_60px_rgba(198,150,46,0.6)] transition-all duration-300 hover:-translate-y-0.5"
            >
              📚 NEET Preparation
              <ArrowUpRight size={17} className="shrink-0" />
            </Link>
            <Link
              href="/neet-practice-hub"
              className="inline-flex items-center gap-2.5 border-2 border-[#C6962E]/60 text-white px-7 py-4 rounded-xl font-black text-base sm:text-lg hover:bg-[#C6962E]/10 hover:border-[#C6962E] transition-all duration-300 hover:-translate-y-0.5"
            >
              🎯 NEET Practice Hub
              <ArrowUpRight size={17} className="shrink-0" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          SCHOLARSHIP CLARITY SECTION
      ══════════════════════════════════════ */}
      <section className="bg-[#FFF8EE] py-20 sm:py-24 px-5 sm:px-10">
        <div className="max-w-[900px] mx-auto">
          {/* Power Statement */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex justify-center"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(198,150,46,0.3)',
                  '0 0 40px rgba(198,150,46,0.6)',
                  '0 0 20px rgba(198,150,46,0.3)'
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-gradient-to-r from-[#0B1A35] to-[#152d54] border-2 border-[#C6962E] px-6 py-3 rounded-xl"
            >
              <p className="text-[#FFD700] font-black text-sm sm:text-base text-center">
                ⚡ We don&apos;t just say &apos;Scholarship&apos; — we explain it. ⚡
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-playfair font-bold text-[#0B1A35] text-2xl sm:text-3xl">
              🎓 Scholarship Clarity – What You Should Know
            </h2>
          </motion.div>

          <div className="space-y-8">
            {/* Commonly Available Scholarships */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"
            >
              <h3 className="font-bold text-[#0B1A35] text-lg mb-4">
                📌 Commonly Available Scholarships
              </h3>
              <p className="text-gray-600 mb-4">
                Most scholarships fall under:
              </p>
              <div className="space-y-4 ml-4">
                <div className="flex gap-3">
                  <span className="text-[#C6962E] font-bold">1.</span>
                  <div>
                    <p className="font-semibold text-[#0B1A35]">Government Scholarships</p>
                    <p className="text-gray-500 text-sm">Offered by governments based on policies, eligibility, or bilateral agreements.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#C6962E] font-bold">2.</span>
                  <div>
                    <p className="font-semibold text-[#0B1A35]">University-Specific Scholarships</p>
                    <p className="text-gray-500 text-sm">Provided by universities based on merit, promotions, or institutional criteria.</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4 border-t border-gray-100 pt-4">
                👉 These scholarships are not created by consultancies, but are part of the existing education system.
              </p>
            </motion.div>

            {/* The ABHA Advantage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[#0B1A35] to-[#152d54] rounded-2xl p-6 sm:p-8 shadow-lg"
            >
              <h3 className="font-bold text-white text-lg mb-4">
                💡 The ABHA Advantage
              </h3>
              <p className="text-white/80 mb-4">
                At ABHA Global Educare, we believe students deserve complete clarity.
                Along with guiding you through existing scholarship opportunities, we also provide:
              </p>
              <div className="bg-[#C6962E]/10 border border-[#C6962E]/30 rounded-xl p-4">
                <p className="font-black text-[#C6962E] text-xl">
                  💰 Additional Scholarship Support of up to $1000 per year for 6 years
                </p>
                <p className="text-white/70 text-sm mt-2">
                  👉 This is an extra benefit, designed to support students throughout their MBBS journey abroad.
                </p>
              </div>
            </motion.div>

            {/* Our Commitment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"
            >
              <h3 className="font-bold text-[#0B1A35] text-lg mb-4">
                🤝 Our Commitment
              </h3>
              <p className="text-gray-600 mb-4">
                We do not believe in creating confusion through unclear claims.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-[#22C55E]" />
                  <p className="text-[#0B1A35]">We explain every component clearly</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-[#22C55E]" />
                  <p className="text-[#0B1A35]">We guide you with transparency</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-[#22C55E]" />
                  <p className="text-[#0B1A35]">We support you throughout your journey</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4 border-t border-gray-100 pt-4 font-semibold">
                Because choosing your medical career deserves clarity, not confusion.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY AGEST — numbered cards
      ══════════════════════════════════════ */}
      <section className="bg-[#0B1A35] py-20 sm:py-24 px-5 sm:px-10 overflow-hidden">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="text-[#C6962E] text-xs font-black uppercase tracking-[0.3em]">
              The double advantage
            </span>
            <h2 className="font-playfair font-bold text-white text-3xl sm:text-4xl mt-2">
              Why take the Pathway Test?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: '01',
                heading: 'Real NEET Revision',
                body: 'Get access to all the finest NEET revision tools and material at an unbelievable cost of ₹999 for a year. Introductory Offer.',
                accent: '#FFD770',
                icon: <Brain size={22} />,
              },
              {
                num: '02',
                heading: 'Real NEET Practice',
                body: 'Same pattern, same pressure. Write AGEST and walk into NEET sharper than anyone else in the room.',
                accent: '#C6962E',
                icon: <BookOpen size={22} />,
              },
              {
                num: '03',
                heading: 'Earn Your Scholarship',
                body: "This isn't charity. Top 300 rankers earn up to $1,000/year off their MBBS fees. Pure merit.",
                accent: '#22C55E',
                icon: <Flame size={22} />,
              },
              {
                num: '04',
                heading: 'Secure Your MBBS Path',
                body: "ABHA's counsellors guide you on university choice, visa, and every step — no guesswork.",
                accent: '#60A5FA',
                icon: <Globe size={22} />,
              },
            ].map(({ num, heading, body, accent, icon }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 hover:bg-white/[0.07] transition-colors duration-300 overflow-hidden"
              >
                {/* Ghost number */}
                <span
                  className="absolute -right-2 -top-3 font-black text-8xl select-none pointer-events-none opacity-[0.06] leading-none"
                  style={{ color: accent }}
                >
                  {num}
                </span>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  {icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{heading}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ABHA SUPPORT — pill chips
      ══════════════════════════════════════ */}
      <section className="bg-[#FFF8EE] py-16 sm:py-20 px-5 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[780px] mx-auto"
        >
          <span className="text-[#C6962E] text-xs font-black uppercase tracking-[0.25em]">
            Full-circle support
          </span>
          <h2 className="font-playfair font-bold text-[#0B1A35] text-3xl sm:text-4xl mt-2 mb-3">
            ABHA doesn&apos;t stop at admission
          </h2>
          <p className="text-gray-500 mb-10 text-base">
            Win the scholarship and you still have ABHA with you every step — visa to
            hostel to workshops.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { emoji: '📋', label: 'Admission' },
              { emoji: '✈️', label: 'Visa Processing' },
              { emoji: '🛬', label: 'Airport Arrival' },
              { emoji: '🏠', label: 'Own Hostel' },
              { emoji: '🍛', label: 'Indian Mess' },
              { emoji: '🧪', label: 'Clinical Workshops' },
            ].map(({ emoji, label }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 200 }}
                className="flex items-center gap-2 bg-white border border-gray-200 text-[#0B1A35] font-semibold text-sm px-5 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              >
                <span className="text-xl">{emoji}</span> {label}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          IMPORTANT DATES
      ══════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-24 px-5 sm:px-10">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-playfair font-bold text-[#0B1A35] text-3xl sm:text-4xl">
              ⏳ 2026 NEET Aspirants — Mark Your Calendar
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                label: 'Last Date to Register',
                date: '10 days before NEET result',
                year: '',
                urgent: true,
                emoji: '⚠️',
              },
              {
                label: 'Attempt 1',
                date: 'from 3rd day of registration',
                year: '',
                urgent: false,
                emoji: '📝',
              },
              {
                label: 'Multiple Attempts',
                date: 'As your Demand dates',
                year: '',
                urgent: false,
                emoji: '📝',
              },
              {
                label: 'Result Declared',
                date: 'Same Attempt Day',
                year: '',
                urgent: false,
                emoji: '📊',
              },
              {
                label: 'Final Announcement',
                date: 'On the NEET Result Day',
                year: '',
                urgent: false,
                emoji: '📢',
              },
            ].map(({ label, date, year, urgent, emoji }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-2xl p-6 text-center ${
                  urgent
                    ? 'bg-gradient-to-br from-[#C6962E] to-[#e0a830] shadow-xl ring-2 ring-[#C6962E]/30'
                    : 'bg-[#F8F9FA] border border-gray-100'
                }`}
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <p
                  className={`text-xs font-black uppercase tracking-widest mb-2 ${
                    urgent ? 'text-[#0B1A35]/70' : 'text-[#C6962E]'
                  }`}
                >
                  {label}
                </p>
                <p className="font-black text-2xl sm:text-3xl leading-none text-[#0B1A35]">
                  {date}
                </p>
                {year && (
                  <p
                    className={`text-sm mt-1 font-semibold ${
                      urgent ? 'text-[#0B1A35]/70' : 'text-gray-400'
                    }`}
                  >
                    {year}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">
            <CalendarDays size={14} className="inline mr-1" />
            Results declared on the same day after each attempt
          </p>
          {/* Flashing Box - Don't Wait */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 flex justify-center"
          >
            <motion.div
              animate={{
                background: [
                  'linear-gradient(90deg,#C6962E,#f5a623)',
                  'linear-gradient(90deg,#f5a623,#FFD770)',
                  'linear-gradient(90deg,#FFD770,#C6962E)',
                  'linear-gradient(90deg,#C6962E,#f5a623)'
                ],
                boxShadow: [
                  '0 0 20px rgba(198,150,46,0.4)',
                  '0 0 40px rgba(198,150,46,0.7)',
                  '0 0 20px rgba(198,150,46,0.4)'
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="px-8 py-4 rounded-xl"
            >
              <p className="text-[#0B1A35] font-black text-base sm:text-lg text-center">
                DON&apos;T WAIT FOR THE LAST DATE. 111 RUPEES CAN OPEN DOORS OF YOUR DREAM
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="relative bg-[#0B1A35] py-24 sm:py-32 px-5 sm:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#C6962E]/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#1B7C9E]/10 blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-[720px] mx-auto text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="inline-block bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-7"
          >
            ⚡ Limited Seats · But YOU can Win
          </motion.div>

          <h2
            className="font-playfair font-bold text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            ₹111 invested.
            <br />
            <span className="text-[#C6962E]">₹5 Lakhs returned.</span>
          </h2>

          <p className="text-gray-400 text-lg mb-10">
            DM{' '}
            <motion.span
              animate={{ color: ['#C6962E', '#FFD770', '#C6962E'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-black"
            >
              &ldquo;AGEST&rdquo;
            </motion.span>{' '}
            on WhatsApp or call us right now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/917447552878?text=AGEST"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#C6962E] via-[#e0a830] to-[#FFD770] text-[#0B1A35] px-9 py-5 rounded-xl font-black text-lg shadow-[0_0_50px_rgba(198,150,46,0.35)] hover:shadow-[0_0_70px_rgba(198,150,46,0.55)] hover:-translate-y-1 transition-all duration-300"
            >
              <Zap size={22} />
              Send &ldquo;AGEST&rdquo; on WhatsApp
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </a>
            <a
              href="tel:+917447552878"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-base hover:border-[#C6962E]/50 hover:text-[#C6962E] transition-all duration-300"
            >
              <Phone size={17} /> +91 74475 52878
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
