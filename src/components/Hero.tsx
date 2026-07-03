'use client';

import Link from 'next/link';
import LeadGate from '@/components/LeadGate';
import { motion } from 'framer-motion';
import { GraduationCap, Globe, Shield, MapPin } from 'lucide-react';

const trustPoints = [
  { icon: Shield, text: 'NMC & WHO Eligible medical universities' },
  { icon: MapPin, text: 'Georgia · Bosnia · Timor-Leste' },
  { icon: GraduationCap, text: '44 programmes across 6 streams' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden" id="home">
      {/* Layered Background */}
      <div className="absolute inset-0 bg-[#0B1A35]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23C6962E%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      <div className="absolute top-0 right-0 h-full w-[50%] bg-gradient-to-l from-[#C6962E]/[0.08] to-transparent" />
      <div className="absolute bottom-0 left-0 h-[35%] w-full bg-gradient-to-t from-[#0B1A35] to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1000px] px-4 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#C6962E]/20 bg-[#C6962E]/10 px-4 py-2"
        >
          <GraduationCap size={16} className="text-[#C6962E]" />
          <span className="text-sm font-semibold tracking-wide text-[#C6962E]">Study Abroad Consultancy</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto max-w-[900px] font-playfair text-[2rem] leading-[1.12] text-white sm:text-[2.75rem] lg:text-[3.75rem]"
        >
          Study Abroad with{' '}
          <span className="relative whitespace-nowrap">
            <span className="bg-gradient-to-r from-[#C6962E] to-[#e2b960] bg-clip-text text-transparent">
              Complete Support
            </span>
            <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#C6962E] to-[#e2b960]" />
          </span>{' '}
          — Admission to Graduation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-6 max-w-[640px] text-base leading-relaxed text-white/80 sm:text-lg"
        >
          ABHA Global Educare helps Indian students get admitted to universities in Georgia,
          Bosnia &amp; Timor-Leste — across MBBS, dentistry, nursing, business, IT and
          postgraduate studies — with our own hostels, Indian meals and on-ground support.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#explore-by-stream"
            className="inline-flex items-center gap-2.5 rounded-xl bg-[#C6962E] px-7 py-3.5 text-base font-bold text-[#0B1A35] transition-all duration-300 hover:bg-[#d4a73a]"
          >
            <GraduationCap size={18} /> Find Your Course Abroad
          </a>
          <LeadGate action="whatsapp_appointment" mode="newTab">
            <a
              href="https://wa.me/917447552878?text=Hi%2C+I'm+interested+in+booking+a+FREE+counseling+appointment+for+studying+abroad."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-[#1ebe5d]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              WhatsApp for Appointment
            </a>
          </LeadGate>
          <LeadGate action="explore_destination" mode="sameTab">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2.5 rounded-xl border border-white/25 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
            >
              <Globe size={18} /> Explore Destinations
            </Link>
          </LeadGate>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/70"
        >
          {trustPoints.map((tp) => (
            <span key={tp.text} className="inline-flex items-center gap-2">
              <tp.icon size={15} className="text-[#C6962E]" /> {tp.text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
