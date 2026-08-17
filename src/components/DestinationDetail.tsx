'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Info, Phone, MapPin } from 'lucide-react';
import type { DestinationDetailData } from '@/data/destinations';
import { KOLHAPUR, GEORGIA_SUPPORT_LINE } from '@/data/contacts';
import UniversityExplorer from '@/components/UniversityExplorer';
import IpadOfferCard from '@/components/IpadOfferCard';
import EarlyBirdTabletCard from '@/components/EarlyBirdTabletCard';

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
  const hasGlimpse = data.images.gallery.length > 0 || Boolean(data.images.climate);
  return (
    <>
      {/* Hero with destination image */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-24">
        <Image
          src={data.images.hero}
          alt={`${data.name} — cityscape`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A35] via-[#0B1A35]/70 to-[#0B1A35]/45" />
        <div className="relative mx-auto max-w-[1000px] text-center">
          <span className="mb-4 inline-block text-6xl drop-shadow-lg">{data.flag}</span>
          <h1 className="font-playfair text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl lg:text-5xl">
            Study in {data.name}
          </h1>
          <p className="mx-auto mt-5 max-w-[700px] text-base leading-relaxed text-white/85 sm:text-lg">
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

      {/* Interactive University Explorer — dropdown → gallery + per-course fee table.
          Renders nothing for countries without universities in the course data. */}
      <UniversityExplorer country={data.name} />

      {/* Visual gallery — life in the destination */}
      {hasGlimpse && (
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

          <div
            className={`grid gap-5 ${
              data.images.gallery.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {data.images.gallery.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group relative aspect-[16/9] overflow-hidden rounded-2xl shadow-card"
              >
                <Image
                  src={img.src}
                  alt={img.label}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A35]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    <MapPin size={14} className="text-[#E0B85C]" /> {img.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Climate & weather banner */}
          {data.images.climate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-5 overflow-hidden rounded-2xl border border-gray-100 shadow-card"
          >
            <Image
              src={data.images.climate}
              alt={`${data.name} — climate and weather`}
              width={1200}
              height={300}
              unoptimized
              sizes="(max-width: 1100px) 100vw, 1100px"
              className="h-auto w-full"
            />
          </motion.div>
          )}
        </div>
      </section>
      )}

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
                href={KOLHAPUR.tel}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-[#C6962E] hover:text-[#C6962E]"
              >
                <Phone size={16} /> {KOLHAPUR.phoneDisplay}
              </a>
            </div>

            {/* Georgia on-ground office — trust signal on the Georgia page */}
            {/Georgia/i.test(data.name) && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#C6962E]/40 bg-white/5 px-4 py-2 text-sm font-semibold text-[#F7EDD7]">
                <MapPin size={15} className="text-[#C6962E]" /> {GEORGIA_SUPPORT_LINE}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Early Bird study-tablet offer (brochure p.3) — Georgia only: the offer
          is awarded on successful admission to Georgia specifically. */}
      {data.slug === 'georgia' && (
        <section className="bg-white px-4 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <EarlyBirdTabletCard />
          </div>
        </section>
      )}

      {/* iPad Early Bird offer — abroad registration incentive */}
      <section className="bg-light-gray px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <IpadOfferCard
            variant={data.slug === 'georgia' ? 'minimal' : 'full'}
            georgiaContext={data.slug === 'georgia'}
          />
        </div>
      </section>
    </>
  );
}
