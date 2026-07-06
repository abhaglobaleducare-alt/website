'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Microscope,
  CalendarDays,
  GraduationCap,
  Target,
  MonitorPlay,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Users,
  Activity,
  ShieldCheck,
  Stethoscope,
  Brain,
} from 'lucide-react';

/* ── Why ABHA + Praxis Method (from the MBBS Coaching portal deck) ─── */
const whyPoints = [
  '100% Commitment to Your Learning',
  'Detailed sessions focused on student satisfaction',
  'Evidence-based, practical, outcome-focused curriculum',
  'Designed by expert surgeons & delivered through real clinical simulations',
  '10 Hands-On Clinical Workshops',
];

const praxisPoints = [
  'Hands-on procedural skill development',
  'Continuous professional growth',
  'Hands-on Anatomy Workshop with animal anatomical specimens (organs similar to human anatomy) under expert faculty supervision',
];

/* ── Workshop components ──────────────────────────────────────────── */
const components = [
  { icon: Activity, title: 'Realistic Clinical Simulations', color: '#1B7C9E' },
  { icon: Users, title: 'Expert-Led Mentorship', color: '#C6962E' },
  { icon: Microscope, title: 'One Organ Specimen per Student', color: '#0B1A35' },
  { icon: Target, title: 'Structured Learning Pathways', color: '#1B7C9E' },
  { icon: ShieldCheck, title: 'Simulation-Based Emergency Training', color: '#C6962E' },
  { icon: Stethoscope, title: 'Animal Organ Specimens for Anatomy Training', color: '#0B1A35' },
];

/* ── Organ specimens (with Marathi study notes from the deck) ──────── */
const specimens = [
  { emoji: '🫀', name: 'Pig Heart', note: 'मानवी हृदयाच्या रचनेचा अभ्यास', en: 'Study of human-like cardiac structure' },
  { emoji: '🧠', name: 'Sheep Brain', note: 'मेंदूची मूलभूत रचना समजण्यासाठी', en: 'Understanding basic brain structure' },
  { emoji: '🫘', name: 'Goat Kidney', note: 'मूत्रपिंडाची रचना व कार्य', en: 'Kidney structure & function' },
  { emoji: '👁', name: 'Goat Eye', note: 'डोळ्याची अंतर्गत रचना', en: 'Internal structure of the eye' },
  { emoji: '🫁', name: 'Sheep Lungs', note: 'श्वसनसंस्थेचा अभ्यास', en: 'Study of the respiratory system' },
  { emoji: '🟤', name: 'Pig Liver', note: 'यकृताची रचना व कार्य', en: 'Liver structure & function' },
];

/* ── Digital workspace features (INCREDOC) ────────────────────────── */
const workspaceFeatures = [
  {
    icon: CalendarDays,
    title: 'Workshops Every Semester',
    description:
      'A comprehensive array of workshops, classes, symposiums and conferences each academic semester — timed to complement university lectures so you never fall behind.',
  },
  {
    icon: GraduationCap,
    title: 'Built for Medical Students',
    description:
      'Designed so that foreign medical graduates attain clinical knowledge and expertise on par with counterparts in their home countries — from day one.',
  },
  {
    icon: MonitorPlay,
    title: 'INCREDOC Digital Workspace',
    description:
      '24/7 access to instructional videos, detailed workbooks, revision guides and supplementary modules — all in one place.',
  },
  {
    icon: Trophy,
    title: 'Our Own Expert Faculty',
    description:
      'Learn from experienced medical educators, workshop specialists and clinical trainers on the ABHA team — dedicated to your success.',
  },
];

const outcomes = [
  'Stronger grasp of pre-clinical and clinical subjects',
  'Confidence in laboratory and clinical settings',
  'Skills on par with home-country medical graduates',
  'Access to a distinguished peer and professional network',
];

const MBBS_PORTAL = 'https://mbbsportal.abhaglobaleducare.com';

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
      {children}
    </span>
  );
}

export default function ClinicalWorkshops() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B1A35] px-4 py-16 sm:px-8 sm:py-20">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C6962E 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[1000px] text-center">
          <Kicker>MBBS Coaching Portal · Exclusively with ABHA</Kicker>
          <h1 className="font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Hands-On Anatomy <span className="text-[#C6962E]">Clinical Workshops</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[720px] text-base leading-relaxed text-white/75 sm:text-lg">
            Hands-on clinical workshops under ABHA transform medical understanding into real clinical
            mastery — through intense practical training, senior-led mentoring and advanced
            simulation labs.
          </p>
          <p className="mt-6 font-playfair text-2xl font-bold italic text-[#E0B85C]">
            “Practice. Master. Excel.”
          </p>
          <p className="mt-1 text-sm text-white/50">ABHA × Praxis | Powered Clinical Training</p>
        </div>
      </section>

      {/* Why + Praxis Method */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FA] p-8 shadow-card">
            <h2 className="mb-6 flex items-center gap-3 font-playfair text-2xl font-bold text-[#0B1A35]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C6962E]/15 text-[#C6962E]">
                <Trophy size={18} />
              </span>
              Why ABHA Clinical Workshops?
            </h2>
            <ul className="space-y-3.5">
              {whyPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[0.95rem] text-gray-700">
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F9FA] p-8 shadow-card">
            <h2 className="mb-6 flex items-center gap-3 font-playfair text-2xl font-bold text-[#0B1A35]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1B7C9E]/15 text-[#1B7C9E]">
                <Brain size={18} />
              </span>
              The Praxis Method
            </h2>
            <ul className="space-y-3.5">
              {praxisPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[0.95rem] text-gray-700">
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-[#1B7C9E]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Workshop Components */}
      <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <Kicker>What&apos;s Inside</Kicker>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              Workshop Components
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {components.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.05 }}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-card"
              >
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${c.color}14`, color: c.color }}
                >
                  <c.icon size={22} />
                </div>
                <h3 className="font-semibold leading-snug text-[#0B1A35]">{c.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organ Specimens */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <Kicker>Training Programs · Organ Specimens</Kicker>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              Animal Anatomical Specimens
            </h2>
            <p className="mx-auto mt-4 max-w-[640px] text-gray-500">
              One organ specimen per student — organs similar to human anatomy, studied hands-on
              under expert faculty supervision.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {specimens.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.05 }}
                className="rounded-2xl border border-gray-100 bg-[#F8F9FA] p-6 shadow-card"
              >
                <div className="mb-3 text-4xl">{s.emoji}</div>
                <h3 className="font-bold text-[#0B1A35]">{s.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{s.en}</p>
                <p className="mt-1 text-sm text-[#85611C]">{s.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital workspace + outcomes (INCREDOC) */}
      <section className="bg-[#0B1A35] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <Kicker>Our Own Training Platform</Kicker>
            <h2 className="font-playfair text-3xl leading-tight text-white sm:text-4xl">
              Beyond the Lab — <span className="text-[#C6962E]">INCREDOC</span> Digital Workspace
            </h2>
          </div>
          <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {workspaceFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#C6962E]/10">
                  <f.icon size={22} className="text-[#C6962E]" />
                </div>
                <h3 className="mb-2 font-bold text-white">{f.title}</h3>
                <p className="text-[0.85rem] leading-relaxed text-white/60">{f.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-8 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="mb-4 text-xl font-bold text-white">What Students Gain</h3>
              <ul className="space-y-3">
                {outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.95rem] text-white/75">
                    <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-center">
              <a
                href={MBBS_PORTAL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C6962E] px-7 py-3.5 text-base font-bold text-[#0B1A35] transition-all duration-300 hover:bg-[#d4a73a]"
              >
                Open the MBBS Coaching Portal <ArrowRight size={18} />
              </a>
              <span className="text-sm text-white/40">Owned &amp; operated by ABHA</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="font-playfair text-3xl font-bold leading-tight text-[#0B1A35] sm:text-4xl">
            Part of Your MBBS Journey with ABHA
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] leading-relaxed text-gray-600">
            Clinical Workshops are included in the ABHA MBBS pathway. Talk to a counsellor to learn
            how the hands-on training supports your FMGE / NExT preparation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/courses/medicine"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-gold to-gold-400 px-7 py-3.5 text-base font-bold text-primary-navy shadow-gold transition-transform duration-300 hover:-translate-y-0.5"
            >
              View MBBS / MD Courses <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#0B1A35]/20 px-6 py-3.5 text-base font-semibold text-[#0B1A35] transition-colors hover:border-[#C6962E] hover:text-[#C6962E]"
            >
              Book Counselling
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
