'use client';

import { motion } from 'framer-motion';
import {
  MessageSquare,
  FileCheck2,
  Plane,
  Home as HomeIcon,
  Utensils,
  BookOpen,
} from 'lucide-react';

const services = [
  {
    icon: MessageSquare,
    title: 'Expert Counselling',
    description:
      'One-on-one sessions with our counselors who have first-hand knowledge of each university. We assess your academic profile, budget and goals before recommending the best-fit option — no generic advice.',
    color: '#C6962E',
  },
  {
    icon: FileCheck2,
    title: 'Documentation & Admission',
    description:
      'We handle every document — from university application forms, SOPs and LORs to embassy attestation and visa paperwork. Zero guesswork, zero missed deadlines.',
    color: '#1B7C9E',
  },
  {
    icon: Plane,
    title: 'Pre-Departure & Travel',
    description:
      'Flight booking guidance, forex tips, packing checklist, group departure coordination and airport pickup at your destination. You\'re never alone at any step.',
    color: '#0B1A35',
  },
  {
    icon: HomeIcon,
    title: 'Own Accommodation',
    description:
      'Georgia: Abha Global Services managed own hostels in Tbilisi. Kyrgyzstan: Managed student housing with 24/7 security. Not third-party — ours.',
    color: '#C6962E',
  },
  {
    icon: Utensils,
    title: 'Indian Food Services',
    description:
      'Dedicated Indian mess at both destinations serving home-style vegetarian and non-vegetarian meals daily. No Maggi-and-rice survival stories — proper dal, sabzi, roti, rice.',
    color: '#1B7C9E',
  },
  {
    icon: BookOpen,
    title: 'Clinical Workshops',
    description:
      'Our own skill-tech platform delivering standardized medical workshops — hands-on clinical training, digital workspace access, and expert faculty on our team.',
    color: '#0B1A35',
  },
  {
    icon: FileCheck2,
    title: 'Residential Documentation to End to End. Not Drop-Off',
    description:
      'We manage all residential documentation from start to finish — accommodation registration, address proof, local documentation, and every step until you are fully settled. We never drop-off mid-way.',
    color: '#C6962E',
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-24 sm:py-28 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-4"
          >
            What We Provide
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-playfair text-3xl sm:text-4xl lg:text-[2.75rem] text-[#0B1A35] mb-5 leading-tight"
          >
            End-to-End Support —{' '}
            <span className="text-[#C6962E]">India to Graduation</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-[640px] mx-auto leading-relaxed"
          >
            Other consultancies hand you an admission letter and disappear. 
            We stay with you through every semester, every challenge, every milestone.
          </motion.p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group relative p-7 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
                style={{ backgroundColor: `${service.color}0D` }}
              >
                <service.icon size={22} style={{ color: service.color }} />
              </div>

              {/* Title */}
              <h3 className="font-bold text-[#0B1A35] text-lg mb-3">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-[0.9rem] leading-relaxed">
                {service.description}
              </p>

              {/* Subtle accent line on hover */}
              <div
                className="absolute bottom-0 left-7 right-7 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: service.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
