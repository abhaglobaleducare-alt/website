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
} from 'lucide-react';

const workshopFeatures = [
  {
    icon: Microscope,
    title: 'Hands-On Clinical Training',
    description:
      'Standardized medical training through advanced modalities — work with anatomical models, demonstration equipment and real clinical scenarios, not just textbooks.',
  },
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
    icon: Target,
    title: 'Practical Skill Building',
    description:
      'Build confidence and competence through immersive, hands-on learning. Our workshops go beyond traditional academia to develop the real-world skills that matter.',
  },
  {
    icon: MonitorPlay,
    title: 'INCREDOC Digital Workspace',
    description:
      'Get 24/7 access to our digital workspace with instructional videos, detailed workbooks, revision guides and supplementary modules — all in one place.',
  },
  {
    icon: Trophy,
    title: 'Our Own Expert Faculty',
    description:
      'Learn from experienced medical educators on our team — including workshop specialists, clinical trainers and mentors who are dedicated to your success.',
  },
];

const outcomes = [
  'Stronger grasp of pre-clinical and clinical subjects',
  'Confidence in laboratory and clinical settings',
  'Skills on par with home-country medical graduates',
  'Access to a distinguished peer and professional network',
];

/**
 * Migrated from the former standalone Clinical Workshops (/praxis) page — now a
 * prominent section within the Medicine course page. Anchored at
 * id="clinical-workshops" (the old URL 301-redirects here).
 */
export default function ClinicalWorkshopsSection() {
  return (
    <section
      id="clinical-workshops"
      className="relative scroll-mt-24 overflow-hidden bg-[#0B1A35] px-4 py-16 sm:px-8 sm:py-20 lg:py-24"
    >
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
            Part of Your MBBS Journey · Our Own Training Platform
          </span>
          <h2 className="mb-5 font-playfair text-3xl leading-tight text-white sm:text-4xl">
            ABHA&apos;s Hands-On Clinical Experience{' '}
            <span className="text-[#C6962E]">Workshop</span>
          </h2>
          <p className="mx-auto max-w-[720px] text-lg leading-relaxed text-white/70">
            We don&apos;t just place students — we train them. Through our own skill-tech platform
            INCREDOC, we deliver standardized medical workshops that build the clinical confidence
            textbooks alone can&apos;t provide.
          </p>
        </div>

        <div className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {workshopFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.04] p-7 transition-all duration-300 hover:border-[#C6962E]/20 hover:bg-white/[0.07]"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#C6962E]/10 transition-colors group-hover:bg-[#C6962E]/15">
                <feature.icon size={22} className="text-[#C6962E]" />
              </div>
              <h3 className="mb-2.5 text-lg font-bold text-white">{feature.title}</h3>
              <p className="text-[0.9rem] leading-relaxed text-white/60">{feature.description}</p>
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
            <Link
              href="/clinical-workshops"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C6962E] px-7 py-3.5 text-base font-bold text-[#0B1A35] transition-all duration-300 hover:bg-[#d4a73a]"
            >
              Explore Clinical Workshops <ArrowRight size={18} />
            </Link>
            <span className="text-sm text-white/40">Owned &amp; operated by ABHA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
