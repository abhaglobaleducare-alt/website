'use client';

import { useState } from 'react';
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
} from 'lucide-react';

/* Migrated from the former /business-management-georgia page (Business Studies). */

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
    text: '3-year BBA and Executive MBA options are available for students who want to finish sooner.',
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
    text: 'Exchange-program and international-partnership opportunities at partner universities.',
  },
];

const comparisonRows = [
  { path: 'BBA', india: '3 years (4-year options under NEP)', georgia: '3 years (SEU/IBSU) or 4 years (UG)' },
  { path: 'MBA', india: '2 years, after competitive entrance (CAT/XAT/CUET)', georgia: '2 years, no CAT-style entrance' },
  { path: 'Executive MBA', india: '1–2 years', georgia: '2 years (SEU EMBA)' },
  {
    path: 'Admission basis',
    india: 'Entrance exam percentile + cutoffs',
    georgia: '12th/degree documents + interview + English proficiency (B1/B2)',
  },
  { path: 'Medium', india: 'English', georgia: 'English' },
];

const faqs = [
  {
    q: 'Am I eligible for a business/management program after 12th?',
    a: 'Yes. Students from any stream (Commerce, Science, or Arts) who have completed 12th (Higher Secondary) can apply for a Bachelor-level (BBA) program. Final eligibility is confirmed by the university at the time of admission.',
  },
  {
    q: 'What English proficiency do I need?',
    a: 'At SEU, Bachelor programs generally require B1-level English and Master programs require B2-level English. Requirements are assessed through the university’s interview/English test and are confirmed by the university during admission.',
  },
  {
    q: 'When are the intakes?',
    a: 'Georgian universities typically run intakes around the autumn and spring semesters. Exact application windows vary by university and program each year, so speak to an ABHA counsellor for the current intake dates.',
  },
  {
    q: 'Are these degrees valid?',
    a: 'The programs are offered by universities accredited by the Ministry of Education and Science of Georgia and are internationally accredited. Recognition for a specific purpose (further study or licensing) depends on the requirements of the country or body concerned.',
  },
  {
    q: 'Can graduates work or study further abroad?',
    a: 'A business/management degree from Georgia is an internationally accredited European (ECTS-based) qualification, which students commonly use to pursue further study or careers. Eligibility for any specific job or higher-study program is decided by that employer or institution.',
  },
  {
    q: 'Are partner scholarships available for master’s programs?',
    a: 'Partner scholarships are available on several master’s programs, subject to eligibility. Scholarship amounts and conditions are set by the university and confirmed at admission.',
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="overflow-hidden rounded-xl border border-gray-200"
    >
      <button
        className="flex w-full items-center justify-between bg-white px-5 py-4 text-left transition-colors duration-200 hover:bg-[#F8F9FA]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="pr-4 text-sm font-semibold text-[#0B1A35] sm:text-base">{q}</span>
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
            <div className="border-t border-gray-200 bg-[#F8F9FA] px-5 py-4 text-sm leading-relaxed text-gray-600">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export const businessFaqs = faqs;

export default function BusinessExtraSection() {
  return (
    <>
      {/* Why business in Georgia */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
              Why Georgia
            </span>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              Why Study Business in <span className="text-[#C6962E]">Tbilisi</span>
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

      {/* India vs Georgia */}
      <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
              An Honest Comparison
            </span>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              India vs Georgia — Duration &amp; Path
            </h2>
            <p className="mx-auto mt-4 max-w-[640px] leading-relaxed text-gray-500">
              Both routes lead to a valid degree. This is neutral information to help you and your
              family decide what fits best.
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

      {/* FAQ */}
      <section id="faq" className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[820px]">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
              Questions &amp; Answers
            </span>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
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
    </>
  );
}
