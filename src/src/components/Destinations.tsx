'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap,
  Home as HomeIcon,
  Utensils,
  Globe2,
  Shield,
  MapPin,
  Users,
  IndianRupee,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const destinations = [
  {
    country: 'Georgia',
    flag: '🇬🇪',
    tagline: 'European-standard medical education in a safe, welcoming country',
    cost: '₹30–40L',
    duration: '6 years',
    universities: ['Alte University', 'European University', 'SEU', 'East West University'],
    keyFacts: [
      { icon: HomeIcon, text: 'Sterling Study & Stay Suites — our own 200+ bed hostel in Tbilisi' },
      { icon: Utensils, text: 'Daily Indian veg & non-veg meals prepared by Indian cooks' },
      { icon: Globe2, text: 'Full English-medium curriculum at all partner universities' },
      { icon: Shield, text: 'WHO, NMC & WFME recognized degrees' },
      { icon: MapPin, text: 'ABHA Global Services LLC office on ground in Tbilisi' },
      { icon: Users, text: "One of Europe's safest countries — ranked higher than many EU nations" },
    ],
    accent: '#C6962E',
  },
  {
    country: 'Kyrgyzstan',
    flag: '🇰🇬',
    tagline: 'The most affordable MBBS destination with a large Indian community',
    cost: '₹25–35L',
    duration: '5 years',
    universities: ['International European University (IEU)', 'Asian International Medical University (AIMU)'],
    keyFacts: [
      { icon: IndianRupee, text: 'Lowest total cost among all MBBS-abroad countries' },
      { icon: HomeIcon, text: 'Managed student housing with 24/7 security and warden' },
      { icon: Utensils, text: 'Dedicated Indian mess — home-style meals every day' },
      { icon: Users, text: '5,000+ Indian medical students already studying here' },
      { icon: Globe2, text: 'English-medium instruction with optional Russian language prep' },
      { icon: Shield, text: 'WHO & NMC recognized — eligible for FMGE / NEXT' },
    ],
    accent: '#1B7C9E',
  },
];

export default function Destinations() {
  return (
    <section className="bg-[#F8F9FA] py-24 sm:py-28 px-4 sm:px-8" id="destinations">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#C6962E] font-semibold text-sm uppercase tracking-[0.2em] mb-4"
          >
            Study Destinations
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-playfair text-3xl sm:text-4xl lg:text-[2.75rem] text-[#0B1A35] mb-5 leading-tight"
          >
            Georgia & Kyrgyzstan —{' '}
            <span className="text-[#C6962E]">Our Focus Countries</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-[680px] mx-auto leading-relaxed"
          >
            We don&apos;t spread thin across dozens of countries. We go deep in two — 
            with our own hostels, food services, and on-ground offices.
          </motion.p>
        </div>

        {/* Destination Cards */}
        <div className="space-y-10">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.country}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Card Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-7 sm:px-9 py-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{dest.flag}</span>
                  <div>
                    <h3 className="font-playfair text-2xl sm:text-[1.75rem] font-bold text-[#0B1A35]">
                      {dest.country}
                    </h3>
                    <p className="text-gray-500 text-[0.9rem] mt-0.5">{dest.tagline}</p>
                  </div>
                </div>
                <div className="flex gap-5 sm:gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-[#0B1A35] font-bold text-xl">{dest.cost}</div>
                    <div className="text-gray-400 text-xs mt-0.5">Total Cost</div>
                  </div>
                  <div className="w-px bg-gray-200" />
                  <div className="text-center">
                    <div className="text-[#0B1A35] font-bold text-xl">{dest.duration}</div>
                    <div className="text-gray-400 text-xs mt-0.5">Duration</div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-7 sm:px-9 py-7 sm:py-8">
                {/* Universities */}
                <div className="mb-7">
                  <h4 className="text-[#0B1A35] font-semibold text-sm uppercase tracking-wider mb-3">
                    Partner Universities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {dest.universities.map((uni) => (
                      <span
                        key={uni}
                        className="inline-flex items-center gap-1.5 bg-[#0B1A35]/[0.04] text-[#0B1A35] px-3.5 py-1.5 rounded-lg text-sm font-medium"
                      >
                        <GraduationCap size={14} className="text-[#C6962E]" />
                        {uni}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Facts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {dest.keyFacts.map((fact) => (
                    <div key={fact.text} className="flex items-start gap-3">
                      <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${dest.accent}10` }}>
                        <fact.icon size={16} style={{ color: dest.accent }} />
                      </div>
                      <span className="text-gray-600 text-[0.9rem] leading-snug">{fact.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-gray-400 text-sm">
                    All universities are NMC-approved and eligible for FMGE / NEXT after graduation.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 font-semibold text-[0.9rem] transition-colors duration-200 hover:gap-3"
                    style={{ color: dest.accent }}
                  >
                    Enquire about {dest.country} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
