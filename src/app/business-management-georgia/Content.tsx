'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe2,
  GraduationCap,
  FileCheck,
  Clock,
  Wallet,
  ShieldCheck,
  Handshake,
  ChevronDown,
  MessageCircle,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { faqs } from './faqData';

const WHATSAPP_URL = 'https://wa.me/917447552878';

/* ── Section 2 — Why Business Studies in Georgia ──────────────── */
const whyCards = [
  {
    icon: Globe2,
    title: '100% English-Medium',
    text: 'Every program listed is taught fully in English — no local-language requirement to study.',
  },
  {
    icon: GraduationCap,
    title: 'European ECTS Credits',
    text: 'Degrees use the European ECTS system (60 ECTS/year), with credits transferable across Europe.',
  },
  {
    icon: FileCheck,
    title: 'No CAT/CUET-Style Exam',
    text: 'Admission is via documents plus an interview/English test — not a competitive entrance percentile.',
  },
  {
    icon: Clock,
    title: 'Faster Degree Options',
    text: '3-year BBA and a 1-year Executive MBA are available for students who want to finish sooner.',
  },
  {
    icon: Wallet,
    title: 'Lower Tuition',
    text: 'Tuition is far lower than Western Europe or the USA for comparable European degrees.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe, Student-Friendly Tbilisi',
    text: 'A welcoming capital city with a growing international student community.',
  },
  {
    icon: Handshake,
    title: 'International Partnerships',
    text: 'Exchange-program and international-partnership opportunities at both universities.',
  },
];

/* ── Section 3 — India vs Georgia comparison ──────────────────── */
const comparisonRows = [
  {
    path: 'BBA',
    india: '3 years (4-year options under NEP)',
    georgia: '3 years (SEU/UG) or 4 years (UG)',
  },
  {
    path: 'MBA',
    india: '2 years, after competitive entrance (CAT/XAT/CUET)',
    georgia: '2 years, no CAT-style entrance',
  },
  {
    path: 'Executive MBA',
    india: '1–2 years',
    georgia: '1 year (SEU EMBA)',
  },
  {
    path: 'Admission basis',
    india: 'Entrance exam percentile + cutoffs',
    georgia: '12th/degree documents + interview + English proficiency (B1/B2)',
  },
  {
    path: 'Medium',
    india: 'English',
    georgia: 'English',
  },
];

/* ── Section 4 — University program tables ────────────────────── */
const seuPrograms = [
  { program: 'Business Administration (BBA)', level: 'Bachelor', duration: '3 years', tuition: '$3,500/year (Total $10,500)' },
  { program: 'Business Management & Digital Technology', level: 'Bachelor', duration: '3 years', tuition: '$3,500/year (Total $10,500)' },
  { program: 'Business Administration (MBA)', level: 'Master', duration: '2 years', tuition: 'Full price $27,700; with scholarship $14,900 ($7,450/year)' },
  { program: 'Financial Technology', level: 'Master', duration: '2 years', tuition: 'Full price $27,700; with scholarship $14,900 ($7,450/year)' },
  { program: 'Business Analysis', level: 'Master', duration: '2 years', tuition: 'Full price $27,700; with scholarship $14,900 ($7,450/year)' },
  { program: 'Executive MBA (EMBA)', level: 'Master', duration: '1 year', tuition: '$13,850; after scholarship up to $7,450' },
];

const ugPrograms = [
  { program: 'Business Administration (BBA)', level: 'Bachelor', duration: '4 years', tuition: '$4,000/year (Total $16,000)' },
  { program: 'Business Administration (BBA)', level: 'Bachelor', duration: '3 years', tuition: '$4,500/year (Total $13,500)' },
  { program: 'Business Analytics', level: 'Bachelor', duration: '4 years', tuition: '$4,000/year (Total $16,000)' },
  { program: 'Business Analytics', level: 'Bachelor', duration: '3 years', tuition: '$4,000/year (Total $12,000)' },
  { program: 'Business Administration (MBA)', level: 'Master', duration: '2 years', tuition: '$4,000/year (Total $8,000)' },
];

/* ── Section 6 — How ABHA Helps ───────────────────────────────── */
const abhaSteps = [
  'Free counselling',
  'University & program selection',
  'Document processing',
  'University application',
  'Visa support',
  'Airport pickup (Tbilisi)',
  'ABHA hostel & Indian food',
  '24/7 student support',
  'Parent updates',
];

/* ── FAQ Item (mirrors Educate.tsx pattern) ───────────────────── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-gray-200 rounded-xl overflow-hidden"
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#F8F9FA] transition-colors duration-200"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-[#0B1A35] text-sm sm:text-base pr-4">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-[#C6962E] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 bg-[#F8F9FA] border-t border-gray-200 text-gray-600 text-sm leading-relaxed">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Reusable program table ───────────────────────────────────── */
function ProgramTable({
  rows,
}: {
  rows: { program: string; level: string; duration: string; tuition: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-card">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-[#0B1A35] text-white">
            <th className="px-4 py-3.5 font-semibold">Program</th>
            <th className="px-4 py-3.5 font-semibold">Level</th>
            <th className="px-4 py-3.5 font-semibold">Duration</th>
            <th className="px-4 py-3.5 font-semibold">Tuition</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={`${r.program}-${r.duration}-${i}`}
              className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}
            >
              <td className="px-4 py-3.5 font-semibold text-[#0B1A35]">{r.program}</td>
              <td className="px-4 py-3.5 text-gray-600">{r.level}</td>
              <td className="px-4 py-3.5 text-gray-600">{r.duration}</td>
              <td className="px-4 py-3.5 text-gray-700">{r.tuition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Content() {
  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0B1A35] px-4 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C6962E 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[1000px] text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-5"
          >
            Study in Tbilisi, Georgia · Dreams Have No Borders
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white"
          >
            Business Management Studies in{' '}
            <span className="text-[#C6962E]">Tbilisi, Georgia</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-[680px] text-base sm:text-lg leading-relaxed text-white/75"
          >
            English-medium, internationally accredited BBA, MBA and Executive MBA
            programs at Georgian National University SEU and the University of
            Georgia — with ABHA Global Educare as your admission guide from
            application to arrival in Tbilisi.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-gold to-gold-400 px-7 py-3.5 text-sm sm:text-base font-bold text-primary-navy shadow-gold transition-transform duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle size={18} /> Free Counselling on WhatsApp
            </a>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-sm text-white/80">
              <ShieldCheck size={16} className="text-[#C6962E]" />
              Authorized by the Ministry of Education of Georgia
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── 2. WHY BUSINESS STUDIES IN GEORGIA ──────────────────── */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em]">
              Why Georgia
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl leading-tight text-[#0B1A35]">
              Why Study Business in{' '}
              <span className="text-[#C6962E]">Tbilisi</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.05 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#C6962E]/10 text-[#C6962E]">
                  <card.icon size={24} />
                </div>
                <h3 className="mb-2 font-playfair text-xl font-semibold text-[#0B1A35]">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. INDIA vs GEORGIA ─────────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em]">
              An Honest Comparison
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl leading-tight text-[#0B1A35]">
              India vs Georgia — Duration &amp; Path
            </h2>
            <p className="mx-auto mt-4 max-w-[640px] text-gray-500 leading-relaxed">
              Both routes lead to a valid degree. This is neutral information to
              help you and your family decide what fits best.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-card">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#0B1A35] text-white">
                  <th className="px-4 py-3.5 font-semibold">Path</th>
                  <th className="px-4 py-3.5 font-semibold">India (typical)</th>
                  <th className="px-4 py-3.5 font-semibold">Georgia (Tbilisi)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((r, i) => (
                  <tr key={r.path} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}>
                    <td className="px-4 py-3.5 font-semibold text-[#0B1A35]">{r.path}</td>
                    <td className="px-4 py-3.5 text-gray-600">{r.india}</td>
                    <td className="px-4 py-3.5 text-gray-700">{r.georgia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 4. UNIVERSITY SECTIONS ──────────────────────────────── */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em]">
              Universities where ABHA assists admissions
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl leading-tight text-[#0B1A35]">
              Two Leading Tbilisi Universities
            </h2>
          </div>

          {/* SEU */}
          <div className="mb-14">
            <div className="mb-5">
              <h3 className="font-playfair text-2xl font-bold text-[#0B1A35]">
                Georgian National University SEU
              </h3>
              <p className="mt-2 max-w-[720px] text-sm leading-relaxed text-gray-600">
                Established in 2001, SEU is a well-known private university in
                Tbilisi offering English-medium business and management programs
                across Bachelor and Master levels.
              </p>
            </div>
            <ProgramTable rows={seuPrograms} />
          </div>

          {/* UG */}
          <div>
            <div className="mb-5">
              <h3 className="font-playfair text-2xl font-bold text-[#0B1A35]">
                University of Georgia (UG)
              </h3>
              <p className="mt-2 max-w-[720px] text-sm leading-relaxed text-gray-600">
                Established in 2004, the University of Georgia is one of the
                country&apos;s largest private universities, offering
                English-medium business programs with both 3-year and 4-year
                Bachelor options in Tbilisi.
              </p>
            </div>
            <ProgramTable rows={ugPrograms} />
          </div>

          {/* ── 5. TUITION FEE NOTE (mandatory) ─────────────────── */}
          <div className="mt-8 rounded-2xl border border-[#C6962E]/30 bg-[#C6962E]/5 p-5">
            <p className="text-sm leading-relaxed text-gray-700">
              <span className="font-semibold text-[#0B1A35]">Tuition fee note: </span>
              Tuition fees shown are per official university sources, verified
              July 2026. Fees are set by the universities and may be revised;
              final fees are confirmed at the time of admission. Figures shown
              are tuition only.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. HOW ABHA HELPS ───────────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em]">
              End-to-End Support
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl leading-tight text-[#0B1A35]">
              How ABHA Helps You
            </h2>
          </div>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {abhaSteps.map((step, i) => (
              <motion.li
                key={step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.05 }}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-card"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0B1A35] font-bold text-[#C6962E]">
                  {i + 1}
                </span>
                <span className="font-semibold text-[#0B1A35]">{step}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 7. FAQ ──────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20 lg:py-24" id="faq">
        <div className="mx-auto max-w-[820px]">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em]">
              Questions &amp; Answers
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl leading-tight text-[#0B1A35]">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA BAND ───────────────────────────────────── */}
      <section className="bg-[#0B1A35] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight text-white">
            Talk to an ABHA Counsellor
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-white/70 leading-relaxed">
            Get free, honest guidance on business and management study in Tbilisi,
            Georgia — from program selection to arrival.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-gold to-gold-400 px-7 py-3.5 text-sm sm:text-base font-bold text-primary-navy shadow-gold transition-transform duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle size={18} /> Talk to an ABHA Counsellor
            </a>
            <a
              href="tel:+917447552878"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm sm:text-base font-semibold text-white transition-colors duration-300 hover:border-[#C6962E] hover:text-[#C6962E]"
            >
              <Phone size={16} /> +91 74475 52878
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-[#C6962E]" /> Kolhapur
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-[#C6962E]" /> Chh. Sambhajinagar
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-[#C6962E]" /> Boisar
            </span>
          </div>
          <div className="mt-8">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C6962E] hover:underline"
            >
              Explore all ABHA study destinations <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
