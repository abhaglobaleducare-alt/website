'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Building2,
  Utensils,
  Home as HomeIcon,
  BookOpen,
  Users,
  ShieldCheck,
} from 'lucide-react';

const reasons = [
  {
    icon: HomeIcon,
    title: 'Our Own Hostels',
    description:
      'Sterling Study & Stay Suites in Tbilisi (200+ beds) and managed housing in Kyrgyzstan. You live in our facilities — not some random landlord\'s flat.',
  },
  {
    icon: Utensils,
    title: 'Indian Food Daily',
    description:
      'Dal, roti, sabzi, rice — cooked by Indian cooks in our own mess. No surviving on instant noodles. Students say the food alone makes the difference.',
  },
  {
    icon: BookOpen,
    title: 'Clinical Workshops by INCREDOC',
    description:
      'Our own hands-on clinical training platform — standardized workshops, digital workspace, and expert faculty. Most consultancies stop at admission — we invest in your academics.',
  },
  {
    icon: Building2,
    title: 'On-Ground Offices',
    description:
      'Kolhapur head office, Chhatrapati Sambhajinagar branch, and a full office in Tbilisi, Georgia. Real people in real offices, not just a WhatsApp number.',
  },
  {
    icon: Users,
    title: 'End-to-End, Not Drop-Off',
    description:
      'From your first counselling call to your final-year exams — we\'re there. Airport pickup, university registration, bank account, SIM card, everything.',
  },
  {
    icon: ShieldCheck,
    title: 'Registered & Transparent',
    description:
      'ABHA Global Educare LLP (ACO-8092). No hidden fees, no surprise charges. Every cost is documented upfront before you make a decision.',
  },
];

export default function WhyAbha() {
  return (
    <section className="bg-[#F8F9FA] py-24 sm:py-28 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-[560px]">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-4"
            >
              Why ABHA
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-playfair text-3xl sm:text-4xl lg:text-[2.75rem] text-[#0B1A35] leading-tight"
            >
              We don&apos;t just send you abroad.{' '}
              <span className="text-[#C6962E]">We go with you.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-[440px] leading-relaxed lg:text-right"
          >
            From admission to accommodation, from academics to daily support — everything is managed by us, end to end, with no middlemen in between.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="bg-white p-7 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#0B1A35] flex items-center justify-center mb-5">
                <reason.icon size={20} className="text-[#C6962E]" />
              </div>
              <h3 className="font-bold text-[#0B1A35] text-lg mb-2.5">{reason.title}</h3>
              <p className="text-gray-500 text-[0.9rem] leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
