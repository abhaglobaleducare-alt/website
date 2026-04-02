'use client';

import { motion } from 'framer-motion';
import { IndianRupee, Award, BookOpen, HeartHandshake } from 'lucide-react';

const stats = [
  {
    icon: IndianRupee,
    value: '₹25–40L',
    label: 'Complete MBBS Cost',
    detail: 'Tuition + hostel + food — all inclusive',
  },
  {
    icon: Award,
    value: '$6,000',
    label: 'AGEST 2026 Scholarship',
    detail: 'Annual merit scholarship for top students',
  },
  {
    icon: BookOpen,
    value: '10',
    label: 'Praxis Workshops',
    detail: 'Hands-on foundation year training',
  },
  {
    icon: HeartHandshake,
    value: '100%',
    label: 'Support System',
    detail: 'From admission to graduation & beyond',
  },
];

export default function Stats() {
  return (
    <section className="relative bg-white py-16 sm:py-20 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center p-6 sm:p-8 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-[#C6962E]/20 hover:bg-[#C6962E]/[0.03] transition-all duration-300"
            >
              <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-[#0B1A35] flex items-center justify-center">
                <stat.icon size={22} className="text-[#C6962E]" />
              </div>
              <div className="font-playfair text-3xl sm:text-4xl font-black text-[#0B1A35] mb-1">
                {stat.value}
              </div>
              <div className="text-[#0B1A35] font-semibold text-sm sm:text-base mb-1">
                {stat.label}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm leading-snug">
                {stat.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
