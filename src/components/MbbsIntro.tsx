'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Home as HomeIcon,
  Utensils,
  BookOpen,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import EligibilityForm from '@/components/EligibilityForm';

const highlights = [
  { icon: HomeIcon, text: 'Own Accommodation in Georgia & Bosnia' },
  { icon: Utensils, text: 'Authentic Indian Food Services Daily' },
  { icon: BookOpen, text: "ABHA's Clinical Experience Workshop" },
  { icon: Shield, text: 'NMC & WHO Eligible Degrees' },
];

const quickLinks = [
  { label: 'MBBS / MD Courses & Fees', href: '/courses/medicine' },
  { label: 'Clinical Workshops', href: '/courses/medicine#clinical-workshops' },
  { label: 'Study Destinations', href: '/destinations' },
];

/**
 * MBBS intro + lead capture. The lady-doctor image sits on the RIGHT in a
 * designer frame; the "Check Your Eligibility" form sits on the left. The image
 * appears only here (removed from anywhere else on the page).
 */
export default function MbbsIntro() {
  return (
    <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        {/* Intro */}
        <div className="mx-auto max-w-[760px] text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
            MBBS Abroad
          </span>
          <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
            Study MBBS Abroad with <span className="text-[#C6962E]">Complete Support</span>
          </h2>
          <p className="mx-auto mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
            ABHA Global Educare helps Indian students get admitted to NMC &amp; WHO Eligible medical
            universities in Georgia &amp; Bosnia — with our own hostels, Indian meals, and exclusive
            hands-on clinical experience.
          </p>
        </div>

        {/* Highlights band */}
        <div className="mx-auto mt-10 grid max-w-[900px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.text}
              className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-card"
            >
              <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#C6962E]/10">
                <item.icon size={18} className="text-[#C6962E]" />
              </div>
              <span className="text-[0.85rem] font-medium leading-snug text-[#0B1A35]">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Eligibility (left) + Lady-doctor image (right) */}
        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — Check Your Eligibility */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <EligibilityForm />
          </motion.div>

          {/* Right — lady doctor, designer frame */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-first mx-auto w-full max-w-[520px] lg:order-last"
          >
            {/* Architectural backdrop */}
            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-[#C6962E]/20 blur-2xl" />
            <div className="absolute -bottom-8 -left-6 h-48 w-48 rounded-full bg-[#0B1A35]/10 blur-2xl" />
            <div className="absolute inset-x-6 bottom-4 top-6 rounded-[2.5rem] border border-[#C6962E]/30" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#0B1A35] to-[#152d54] shadow-[0_30px_70px_rgba(11,26,53,0.22)] ring-1 ring-black/5">
              <Image
                src="/images/doctor-clear.png"
                alt="ABHA — MBBS abroad for Indian students"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                priority={false}
                className="object-cover object-top [filter:contrast(1.04)_saturate(1.05)]"
              />
              {/* Floating designer badge */}
              <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-[#0B1A35]/90 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
                <Sparkles size={15} className="text-[#C6962E]" /> Admission to Graduation
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick links */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0B1A35]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#0B1A35] transition-all hover:border-[#C6962E] hover:text-[#C6962E]"
            >
              {link.label} <ArrowRight size={15} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
