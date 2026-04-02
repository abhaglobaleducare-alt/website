'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
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

export default function Praxis() {
  return (
    <section className="relative py-24 sm:py-28 px-4 sm:px-8 overflow-hidden bg-[#0B1A35]" id="praxis">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23C6962E%22%20fill-opacity%3D%220.04%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M0%2038.59l2.83-2.83%201.41%201.41L1.41%2040H0v-1.41zM0%201.4l2.83%202.83%201.41-1.41L1.41%200H0v1.41zM38.59%2040l-2.83-2.83%201.41-1.41L40%2038.59V40h-1.41zM40%201.41l-2.83%202.83-1.41-1.41L38.59%200H40v1.41zM20%2018.6l2.83-2.83%201.41%201.41L21.41%2020l2.83%202.83-1.41%201.41L20%2021.41l-2.83%202.83-1.41-1.41L18.59%2020l-2.83-2.83%201.41-1.41L20%2018.59z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-4"
          >
            Our Own Training Platform
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-playfair text-3xl sm:text-4xl lg:text-[2.75rem] text-white mb-5 leading-tight"
          >
            Hands-On Clinical{' '}
            <span className="text-[#C6962E]">Workshops by INCREDOC</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg max-w-[720px] mx-auto leading-relaxed"
          >
            We don&apos;t just place students — we train them. Through our own skill-tech platform INCREDOC, 
            we deliver standardized medical workshops that build the clinical confidence textbooks alone can&apos;t provide.
          </motion.p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-16">
          {workshopFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 hover:bg-white/[0.07] hover:border-[#C6962E]/20 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#C6962E]/10 flex items-center justify-center mb-5 group-hover:bg-[#C6962E]/15 transition-colors">
                <feature.icon size={22} className="text-[#C6962E]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2.5">
                {feature.title}
              </h3>
              <p className="text-white/60 text-[0.9rem] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Outcomes + CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
        >
          <div>
            <h3 className="text-white font-bold text-xl mb-4">What Students Gain</h3>
            <ul className="space-y-3">
              {outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/75 text-[0.95rem]">
                  <CheckCircle2 size={18} className="text-[#C6962E] mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start lg:items-center gap-3">
            <a
              href="https://incredoc.com/demo/consultancy4.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C6962E] text-[#0B1A35] px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-300 hover:bg-[#d4a73a]"
            >
              Explore INCREDOC Workshops <ArrowRight size={18} />
            </a>
            <span className="text-white/40 text-sm">Owned & operated by ABHA</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
