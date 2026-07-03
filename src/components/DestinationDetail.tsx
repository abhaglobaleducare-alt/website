'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight,
  Info,
  Phone,
  Landmark,
  Building2,
  CloudSun,
  Users,
  MapPin,
} from 'lucide-react';
import type { DestinationDetailData } from '@/data/destinations';

function initials(name: string): string {
  return name
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const TILE_GRADIENTS = [
  'from-[#0B1A35] to-[#1B7C9E]',
  'from-[#152d54] to-[#C6962E]',
  'from-[#1B7C9E] to-[#0B1A35]',
  'from-[#C6962E] to-[#85611C]',
];

export default function DestinationDetail({ data }: { data: DestinationDetailData }) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B1A35] px-4 py-12 sm:px-8 sm:py-16">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C6962E 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[1000px] text-center">
          <span className="mb-4 inline-block text-6xl">{data.flag}</span>
          <h1 className="font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Study in {data.name}
          </h1>
          <p className="mx-auto mt-5 max-w-[700px] text-base leading-relaxed text-white/75 sm:text-lg">
            {data.tagline}
          </p>
        </div>
      </section>

      {/* Facts */}
      <section className="bg-[#F8F9FA] px-4 py-14 sm:px-8">
        <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-4 sm:grid-cols-4">
          {data.facts.map((f) => (
            <div key={f.label} className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-card">
              <div className="font-playfair text-lg font-bold text-[#0B1A35]">{f.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-gray-400">{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[820px] space-y-5">
          {data.intro.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-gray-600 sm:text-lg">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Visual gallery — life in the destination */}
      <section className="bg-white px-4 pb-16 sm:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
              A Glimpse
            </span>
            <h2 className="font-playfair text-2xl leading-tight text-[#0B1A35] sm:text-3xl">
              Life in {data.name}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { icon: Landmark, label: 'Landmarks & Monuments', sub: 'Historic architecture' },
              { icon: Building2, label: 'City Life', sub: 'Safe, student-friendly streets' },
              { icon: CloudSun, label: 'Climate & Weather', sub: 'Distinct European seasons' },
              { icon: Users, label: 'Student Community', sub: 'Growing Indian presence' },
            ].map((tile, i) => (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${TILE_GRADIENTS[i]} p-5 shadow-card`}
              >
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                  }}
                />
                <tile.icon size={30} className="relative mb-3 text-white/90" />
                <h3 className="relative text-sm font-bold leading-snug text-white">{tile.label}</h3>
                <p className="relative mt-0.5 text-xs text-white/70">{tile.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Universities */}
      <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
              Universities
            </span>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              Where ABHA Assists Admissions
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.universities.map((u, i) => (
              <motion.div
                key={u}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.06 }}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div
                  className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${TILE_GRADIENTS[i % TILE_GRADIENTS.length]} font-playfair text-lg font-bold text-white`}
                >
                  {initials(u)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold leading-snug text-[#0B1A35]">{u}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin size={12} className="text-[#C6962E]" /> {data.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mx-auto mt-7 max-w-[720px] text-center text-sm leading-relaxed text-gray-500">
            {data.universitiesNote}
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
              Why {data.name}
            </span>
            <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
              What You Get with ABHA
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {data.highlights.map((h, i) => (
              <motion.div
                key={h}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.05 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
                <span className="text-gray-700">{h}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance + CTA */}
      <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-[#C6962E]/30 bg-[#C6962E]/5 p-5">
            <Info size={20} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
            <p className="text-sm leading-relaxed text-gray-700">{data.compliance}</p>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#0B1A35] p-8 text-center sm:p-10">
            <h2 className="font-playfair text-2xl font-bold text-white sm:text-3xl">
              Explore Medicine Programmes
            </h2>
            <p className="max-w-[560px] text-white/70">
              See verified year-wise fees, universities and payment schedules on the Medicine course
              page — then book a free counselling session.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/courses/medicine"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-gold to-gold-400 px-7 py-3.5 text-sm font-bold text-primary-navy shadow-gold transition-transform duration-300 hover:-translate-y-0.5 sm:text-base"
              >
                View MBBS / MD Courses <ArrowRight size={18} />
              </Link>
              <a
                href="tel:+917447552878"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-[#C6962E] hover:text-[#C6962E]"
              >
                <Phone size={16} /> +91 74475 52878
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
