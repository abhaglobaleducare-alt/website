'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Globe2,
  GraduationCap,
  IndianRupee,
  AlertTriangle,
  Shield,
  ClipboardList,
  FileText,
  Stethoscope,
  HelpCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { WHATSAPP } from '@/data/contacts';

/* ── FAQ data ────────────────────────────────────────────────── */
const faqs = [
  {
    q: 'Is MBBS from abroad valid in India?',
    a: 'Yes — provided the university is recognized by WHO and NMC (National Medical Commission), and you clear the NEXT (earlier FMGE) exam after returning to India. ABHA partners only with NMC-eligible universities.',
  },
  {
    q: 'What is the NEXT / FMGE exam?',
    a: 'The Foreign Medical Graduates Examination (FMGE) is now being replaced by the National Exit Test (NEXT). Any Indian student who completes MBBS from abroad must clear this screening exam to practice medicine in India. Our Clinical Workshops are specifically designed to help you clear it.',
  },
  {
    q: 'Do I need NEET to study MBBS abroad?',
    a: 'Yes. As per NMC guidelines, a valid NEET score is mandatory for Indian students who wish to study medicine abroad and later practice in India. There is no minimum cut-off requirement, just a valid score.',
  },
  {
    q: 'What is the minimum NEET score required?',
    a: 'NMC regulations require a valid NEET score (you must appear and qualify in the general sense — meet the minimum percentile). There is no specific score threshold set by foreign universities, but NMC requires the exam to be taken.',
  },
  {
    q: 'What are the NMC guidelines for MBBS abroad?',
    a: 'Key NMC guidelines include: (1) Degree must be from a WHO-listed & NMC-eligible university, (2) NEET qualified, (3) 54-month MBBS course duration + 12-month internship, (4) Mandatory attendance requirements, (5) Clear NEXT exam to practice in India.',
  },
  {
    q: 'How does Georgia compare to other MBBS destinations like Ukraine?',
    a: 'Georgia is considered one of the safest European countries, offers WHO/NMC-eligible universities with English-medium instruction, and costs are highly competitive. Post-conflict concerns with Ukraine make Georgia a much more stable and recommended alternative.',
  },
  {
    q: 'What is the total cost of MBBS in Georgia?',
    a: 'Georgia: approximately ₹30–50 lakh total (including tuition + accommodation + food over 6 years). This is significantly lower than private medical colleges in India.',
  },
  {
    q: 'Can I get a hostel with Indian food abroad?',
    a: 'Yes! ABHA operates Sterling Study & Stay Suites in Tbilisi, Georgia — a 200+ bed hostel with daily Indian veg & non-veg meals cooked by Indian chefs.',
  },
  {
    q: 'What is the AGEST Scholarship?',
    a: "AGEST (ABHA Global Education Scholarship Test) is ABHA's consistency-based scholarship exam in NEET MCQ format. AGEST 2026 was successfully conducted, with the top 300 scholars selected for up to $6,000 in tuition scholarships towards MBBS in Georgia.",
  },
  {
    q: 'How do Clinical Workshops help with NEXT/FMGE?',
    a: 'ABHA\'s Clinical Workshops provide hands-on cadaver dissection, clinical skill training, and case-based learning aligned with NEXT exam patterns. Students who attend have significantly higher NEXT pass rates than those relying on theory alone.',
  },
];

/* ── Topics data ─────────────────────────────────────────────── */
const topics = [
  {
    icon: GraduationCap,
    title: 'NMC Guidelines',
    color: '#C6962E',
    bg: 'bg-[#C6962E]/10',
    points: [
      'NEET qualification is mandatory for all Indian students',
      'University must be WHO-listed and NMC-eligible',
      'Minimum 54-month MBBS programme duration',
      '12-month compulsory internship',
      'Mandatory attendance as per university rules',
      'Must clear NEXT exam to practice in India',
    ],
  },
  {
    icon: Stethoscope,
    title: 'NEXT / FMGE Exam',
    color: '#1B7C9E',
    bg: 'bg-[#1B7C9E]/10',
    points: [
      'Replaces FMGE from 2024 onwards (phased rollout)',
      'Two parts: NEXT Step 1 (theory) + NEXT Step 2 (clinical)',
      'Must be cleared before practice in India',
      'ABHA Clinical Workshops are aligned with NEXT pattern',
      'Anatomy, Physiology, Biochemistry are heavily tested',
      'Case-based clinical reasoning is key for Step 2',
    ],
  },
  {
    icon: Globe2,
    title: 'Choosing the Right Country',
    color: '#C6962E',
    bg: 'bg-[#C6962E]/10',
    points: [
      'Ensure university is NMC-eligible (check NMC website)',
      'Consider political stability and student safety',
      'Look for English-medium instruction',
      'Evaluate accommodation and food arrangements',
      'Check presence of Indian community and support',
      'Verify clinical exposure and hospital tie-ups',
    ],
  },
  {
    icon: IndianRupee,
    title: 'Cost Breakdown',
    color: '#1B7C9E',
    bg: 'bg-[#1B7C9E]/10',
    points: [
      'Tuition: ₹3–6L per year depending on country/university',
      'Accommodation: ₹2–3L per year (ABHA-managed hostels)',
      'Food: ₹60K–1.2L per year (Indian mess)',
      'Travel & misc: ₹1–1.5L per year',
      'Total all-inclusive cost: ~₹36L (Timor-Leste) to ₹44–58L (Georgia) — vs ₹80L+ for Indian private (accommodation & food extra there)',
      'AGEST Scholarship can offset $6,000 from tuition',
    ],
  },
  {
    icon: FileText,
    title: 'Application & Visa Process',
    color: '#C6962E',
    bg: 'bg-[#C6962E]/10',
    points: [
      'NEET scorecard + 10th & 12th marksheets required',
      'Passport (minimum 2 years validity)',
      'Medical fitness certificate',
      'Offer letter from university for student visa',
      'ABHA handles all documentation and visa guidance',
      'Standard processing: 4–8 weeks from application',
    ],
  },
  {
    icon: Shield,
    title: 'Recognitions to Verify',
    color: '#1B7C9E',
    bg: 'bg-[#1B7C9E]/10',
    points: [
      'WHO (World Health Organization) listing',
      'NMC (National Medical Commission) eligibility',
      'WFME (World Federation for Medical Education) recognition',
      'ECFMG eligibility (for those aiming for USA residency)',
      'Check university directory for updated status',
      'All universities where ABHA assists admissions meet these criteria',
    ],
  },
];

/* ── Comparison table data ───────────────────────────────────── */
const comparisonRows = [
  { aspect: 'Total Cost (6 yrs)', india: '₹80L – 1.2 Cr (Private)', georgia: '₹30 – 50L' },
  { aspect: 'Medium of Instruction', india: 'English', georgia: 'English' },
  { aspect: 'NMC Eligible', india: '✅ Yes', georgia: '✅ Yes' },
  { aspect: 'NEET Required', india: '✅ Yes', georgia: '✅ Yes' },
  { aspect: 'Weather', india: 'Tropical/Mixed', georgia: 'Mild European' },
  { aspect: 'Indian Food Available', india: 'Everywhere', georgia: '✅ ABHA Indian Mess' },
  { aspect: 'Own Hostel by Agent', india: '—', georgia: '✅' },
  { aspect: 'Safety', india: 'Varies', georgia: '✅ Among Europe\'s safest' },
];

/* ── Video Section ───────────────────────────────────────────── */
function VideoSection() {
  const [muted, setMuted] = useState(true);
  const [hintDismissed, setHintDismissed] = useState(false);
  const src = muted
    ? 'https://www.youtube.com/embed/Myu_a4Wg2MI?autoplay=1&mute=1&rel=0&modestbranding=1&color=white'
    : 'https://www.youtube.com/embed/Myu_a4Wg2MI?autoplay=1&mute=0&rel=0&modestbranding=1&color=white';

  return (
    <section className="bg-[#0B1A35] py-14 px-4 sm:px-8">
      <div className="max-w-[860px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-center mb-7"
        >
          <span className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Must Watch
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl text-white">
            Understand MBBS Journey: From NEET to Admission Abroad
          </h2>
          <p className="text-white/55 mt-2 text-sm sm:text-base max-w-lg mx-auto">
            A complete overview of everything you need to know about MBBS Admissions Journey — don&apos;t skip this.
          </p>
        </motion.div>

        {/* Unmute nudge */}
        <AnimatePresence>
          {muted && !hintDismissed && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="flex items-center justify-between gap-3 bg-[#C6962E]/15 border border-[#C6962E]/40 rounded-xl px-5 py-3 mb-4"
            >
              <div className="flex items-center gap-2.5 text-white/90 text-sm">
                <VolumeX size={18} className="flex-shrink-0 text-[#C6962E]" />
                <span>Video is playing muted. <strong className="text-white">Tap the button to unmute</strong> for the full experience.</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setMuted(false)}
                  className="flex items-center gap-1.5 bg-[#C6962E] hover:bg-[#DFB761] text-[#0B1A35] text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors duration-200"
                >
                  <Volume2 size={14} />
                  Unmute
                </button>
                <button
                  onClick={() => setHintDismissed(true)}
                  className="text-white/40 hover:text-white/70 text-lg leading-none transition-colors duration-200"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
          className="relative w-full rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10"
          style={{ paddingBottom: '56.25%' }}
        >
          <iframe
            key={src}
            className="absolute inset-0 w-full h-full"
            src={src}
            title="Must Watch — MBBS Abroad Complete Guide"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>

        {/* Unmute / mute toggle below video */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setMuted((m) => !m)}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/50 px-4 py-2 rounded-full transition-all duration-200"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            {muted ? 'Video is muted — click to unmute' : 'Click to mute'}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ Item ────────────────────────────────────────────────── */
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
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-[#F8F9FA] transition-colors duration-200"
        onClick={() => setOpen(!open)}
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
            <div className="px-6 py-4 bg-[#F8F9FA] border-t border-gray-200 text-gray-600 text-sm leading-relaxed">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function Educate() {
  return (
    <div className="overflow-x-hidden font-sans">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative bg-[#0B1A35] py-16 sm:py-20 lg:py-28 px-5 sm:px-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#C6962E 1px,transparent 1px),linear-gradient(90deg,#C6962E 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#C6962E]/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#1B7C9E]/10 blur-[100px] pointer-events-none" />

        <div className="relative max-w-[900px] mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-4"
          >
            Student Resource Centre
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-4xl sm:text-5xl lg:text-[3.25rem] text-white mb-6 leading-tight"
          >
            Educate Yourself —{' '}
            <span className="text-[#C6962E]">Know Before You Go</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          >
            Everything you need to know about MBBS abroad — NMC guidelines, NEXT exam, costs, country comparisons, and honest answers to every question.
          </motion.p>

          {/* Quick nav pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {['NMC Guidelines', 'NEXT Exam', 'Cost Comparison', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-xs sm:text-sm bg-white/10 hover:bg-[#C6962E]/20 text-white/80 hover:text-white border border-white/20 hover:border-[#C6962E]/50 px-4 py-2 rounded-full transition-all duration-300"
              >
                {item}
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MUST WATCH VIDEO
      ══════════════════════════════════════ */}
      <VideoSection />

      {/* ══════════════════════════════════════
          IMPORTANT NOTE
      ══════════════════════════════════════ */}
      <section className="bg-amber-50 border-y border-amber-200 py-5 px-4">
        <div className="max-w-[1100px] mx-auto flex items-start sm:items-center gap-3 text-amber-800">
          <AlertTriangle size={20} className="flex-shrink-0 mt-0.5 sm:mt-0 text-amber-600" />
          <p className="text-sm">
            <strong>Important:</strong> NMC guidelines are updated periodically. Always verify the latest requirements on the official{' '}
            <a
              href="https://www.nmc.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-900 font-medium"
            >
              NMC website (nmc.org.in)
            </a>{' '}
            before making any decisions. ABHA counsellors are always available to help you navigate the latest rules.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          KEY TOPICS GRID
      ══════════════════════════════════════ */}
      <section id="nmc-guidelines" className="bg-[#F8F9FA] py-20 px-4 sm:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-3"
            >
              Complete Guide
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-playfair text-3xl sm:text-4xl text-[#0B1A35] mb-4"
            >
              Everything You Need to <span className="text-[#C6962E]">Know</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, i) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${topic.bg} mb-4`}>
                  <topic.icon size={22} style={{ color: topic.color }} />
                </div>
                <h3 className="font-semibold text-[#0B1A35] text-lg mb-4">{topic.title}</h3>
                <ul className="space-y-2">
                  {topic.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color: topic.color }} />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COST COMPARISON TABLE
      ══════════════════════════════════════ */}
      <section id="cost-comparison" className="bg-white py-20 px-4 sm:px-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-3"
            >
              Side-by-Side Comparison
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-playfair text-3xl sm:text-4xl text-[#0B1A35]"
            >
              India vs <span className="text-[#C6962E]">Georgia</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto rounded-2xl shadow-md"
          >
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#0B1A35] text-white">
                  <th className="px-5 py-4 text-left font-semibold">Aspect</th>
                  <th className="px-5 py-4 text-center font-semibold">India (Private)</th>
                  <th className="px-5 py-4 text-center font-semibold bg-[#C6962E]/20">
                    🇬🇪 Georgia
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.aspect}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}
                  >
                    <td className="px-5 py-3.5 font-medium text-[#0B1A35]">{row.aspect}</td>
                    <td className="px-5 py-3.5 text-center text-gray-600">{row.india}</td>
                    <td className="px-5 py-3.5 text-center font-medium text-[#0B1A35] bg-[#C6962E]/5">{row.georgia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NEXT EXAM SECTION
      ══════════════════════════════════════ */}
      <section id="next-exam" className="bg-gradient-to-br from-[#0B1A35] to-[#193769] py-20 px-4 sm:px-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-3"
            >
              NEXT / FMGE
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-playfair text-3xl sm:text-4xl text-white mb-4"
            >
              Clearing the <span className="text-[#C6962E]">NEXT Exam</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/60 max-w-xl mx-auto"
            >
              The National Exit Test is the gateway to practicing medicine in India after MBBS abroad. Here&apos;s what you need to know.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: ClipboardList,
                title: 'NEXT Step 1',
                desc: 'Theory-based MCQ exam covering pre-clinical and para-clinical subjects. Similar to FMGE but more comprehensive.',
              },
              {
                icon: Stethoscope,
                title: 'NEXT Step 2',
                desc: 'Clinical skills assessment — OSCE pattern with practical stations. Covers clinical reasoning and patient management.',
              },
              {
                icon: BookOpen,
                title: 'ABHA Workshops',
                desc: 'Our Clinical Workshops align with NEXT pattern — cadaver labs, OSCE prep, and case-based learning to maximise your score.',
              },
              {
                icon: CheckCircle2,
                title: 'Pass Rate',
                desc: 'ABHA students completing the Clinical Workshops & Hands-On Programme are expected to achieve significantly higher NEXT/FMGE pass rates compared to the national average.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C6962E]/20 flex items-center justify-center mb-4">
                  <item.icon size={18} className="text-[#C6962E]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <a
              href="/courses/medicine#clinical-workshops"
              className="inline-block bg-gradient-to-r from-[#C6962E] to-[#DFB761] text-[#0B1A35] px-8 py-3.5 rounded-full font-bold text-sm hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(198,150,46,0.5)] transition-all duration-300 shadow-[0_5px_20px_rgba(198,150,46,0.3)]"
            >
              Explore Clinical Workshops →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section id="faq" className="bg-[#F8F9FA] py-20 px-4 sm:px-8">
        <div className="max-w-[860px] mx-auto">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-3"
            >
              Frequently Asked Questions
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-playfair text-3xl sm:text-4xl text-[#0B1A35] mb-4"
            >
              Still Have <span className="text-[#C6962E]">Questions?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500"
            >
              Here are the most common questions from students and parents.
            </motion.p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 bg-white rounded-2xl p-6 sm:p-8 text-center border border-gray-200"
          >
            <HelpCircle size={32} className="mx-auto mb-3 text-[#C6962E]" />
            <h3 className="font-semibold text-[#0B1A35] text-lg mb-2">Didn&apos;t find your answer?</h3>
            <p className="text-gray-500 text-sm mb-6">Our expert counsellors are available to answer any question — no obligation, completely free.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="bg-gradient-to-r from-[#C6962E] to-[#DFB761] text-[#0B1A35] px-7 py-3 rounded-full font-bold text-sm hover:-translate-y-0.5 transition-all duration-300 hover:shadow-[0_6px_20px_rgba(198,150,46,0.4)]"
              >
                Book Free Counselling
              </a>
              <a
                href={WHATSAPP.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0B1A35] text-white px-7 py-3 rounded-full font-bold text-sm hover:-translate-y-0.5 transition-all duration-300 hover:bg-[#193769]"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
