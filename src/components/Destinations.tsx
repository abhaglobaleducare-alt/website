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
  ArrowRight,
} from 'lucide-react';

const destinations = [
  {
    country: 'Georgia',
    slug: 'georgia',
    flag: '🇬🇪',
    tagline: 'European-standard medical education in a safe, welcoming country',
    cost: '₹30–50L',
    duration: '6 years',
    universities: [
      'European University',
      'Alte University',
      'SEU',
      'East West University',
      'East European University',
      'Caucasus University',
      'University of Georgia',
      'CIU',
      'IBSU',
    ],
    keyFacts: [
      { icon: HomeIcon, text: 'One Window Services — our own 200+ bed (NOT BUNK BED) hostel in Tbilisi' },
      { icon: Utensils, text: 'Daily Indian veg & non-veg meals prepared by Indian cooks' },
      { icon: Globe2, text: 'Full English-medium curriculum at universities where ABHA assists admissions' },
      { icon: Shield, text: 'WHO, NMC & WFME Eligible Degrees' },
      { icon: MapPin, text: 'ABHA Global Services LLC office on ground in Tbilisi' },
      { icon: Users, text: "One of Europe's safest countries — ranked higher than many EU nations" },
    ],
    accent: '#C6962E',
  },
  {
    country: 'Russian Countries',
    slug: 'russian-countries',
    flag: '🇷🇺',
    tagline: 'MBBS in Russia & CIS — a long-established route for Indian students',
    cost: 'Speak to a counsellor',
    duration: '6 years',
    universities: ['State medical universities across Russia & CIS'],
    keyFacts: [
      { icon: Globe2, text: 'English-medium MBBS at established state medical universities' },
      { icon: Shield, text: 'WHO & NMC Eligible — eligible for FMGE / NExT' },
      { icon: MapPin, text: 'Universities across Russia, Kyrgyzstan, Kazakhstan & Uzbekistan' },
      { icon: Users, text: 'One of the largest Indian student communities abroad' },
      { icon: HomeIcon, text: 'ABHA-supported accommodation & settling-in guidance' },
      { icon: Utensils, text: 'Indian food options available near campus' },
    ],
    accent: '#1B7C9E',
  },
  {
    country: 'Timor-Leste',
    slug: 'timor-leste',
    flag: '🇹🇱',
    tagline: 'English-medium MBBS at Nalanda College of Medicine, Dili',
    cost: 'Verified fees',
    duration: '4.5 yrs + 1 yr internship',
    universities: ['Nalanda College of Medicine, Dili'],
    keyFacts: [
      { icon: Globe2, text: '100% English-medium MBBS programme' },
      { icon: Shield, text: 'Programme structured as per NMC FMGL 2021 norms' },
      { icon: Users, text: 'Limited intake of 125 seats per year' },
      { icon: HomeIcon, text: 'Hostel & food at $3,000 / year' },
      { icon: MapPin, text: 'Located in Dili, the capital of Timor-Leste' },
      { icon: Utensils, text: 'Verified all-inclusive fee structure via ABHA' },
    ],
    accent: '#C6962E',
  },
];

export default function Destinations() {
  return (
    <section className="bg-[#F8F9FA] py-16 sm:py-20 lg:py-28 px-4 sm:px-8" id="destinations">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14 lg:mb-16">
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
            Georgia, Timor-Leste & Russian Countries —{' '}
            <span className="text-[#C6962E]">Our Focus Countries</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-[680px] mx-auto leading-relaxed"
          >
            We don&apos;t spread thin across dozens of countries. We go deep in our focus
            destinations — with our own hostels, food services, and on-ground offices.
          </motion.p>
        </div>

        {/* Power Statement - Flashing Vertical Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex justify-center"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(198,150,46,0.3)',
                '0 0 40px rgba(198,150,46,0.6)',
                '0 0 20px rgba(198,150,46,0.3)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="bg-gradient-to-r from-[#0B1A35] to-[#152d54] border-2 border-[#C6962E] px-6 py-3 rounded-xl"
          >
            <p className="text-[#FFD700] font-black text-sm sm:text-base text-center">
              ⚡ We don&apos;t just send You — Our On ground support Team will be with you. ⚡
            </p>
          </motion.div>
        </motion.div>

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
                    Universities Where ABHA Assists Admissions
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
                    All universities are NMC guidelines Eligible and eligible for FMGE / NEXT after graduation.
                  </p>
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="inline-flex items-center gap-2 font-semibold text-[0.9rem] transition-colors duration-200 hover:gap-3"
                    style={{ color: dest.accent }}
                  >
                    Explore {dest.country} <ArrowRight size={16} />
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
