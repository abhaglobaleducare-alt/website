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
} from 'lucide-react';

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
 * MBBS-focused introduction — the lady-doctor visual beside the medical-study
 * highlights that previously sat in the hero. Links onward to the relevant
 * course and destination pages.
 */
export default function MbbsIntro() {
  return (
    <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Lady doctor image */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative order-2 lg:order-1"
        >
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-[#C6962E]/15 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0B1A35] to-[#152d54] shadow-[0_20px_60px_rgba(11,26,53,0.25)]">
            <Image
              src="/images/doctor.png"
              alt="ABHA — MBBS abroad for Indian students"
              width={640}
              height={720}
              className="mx-auto h-auto w-full max-w-[460px] object-contain"
              priority={false}
            />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-2"
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
            MBBS Abroad
          </span>
          <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
            Study MBBS Abroad with <span className="text-[#C6962E]">Complete Support</span>
          </h2>
          <p className="mt-5 max-w-[560px] text-base leading-relaxed text-gray-600 sm:text-lg">
            ABHA Global Educare helps Indian students get admitted to NMC &amp; WHO Eligible medical
            universities in Georgia &amp; Bosnia — with our own hostels, Indian meals, and exclusive
            hands-on clinical experience.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#C6962E]/10">
                  <item.icon size={18} className="text-[#C6962E]" />
                </div>
                <span className="text-[0.95rem] font-medium leading-snug text-[#0B1A35]">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
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
        </motion.div>
      </div>
    </section>
  );
}
