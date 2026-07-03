'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import type { StreamSlug } from '@/data/courses';
import { getCoursesByStream, getUniversitiesByStream, COURSES } from '@/data/courses';
import { getStreamMeta } from '@/data/streams';
import { STREAM_EXTRAS } from '@/data/streamExtras';
import { useEnquiry } from './context';
import CourseFeeTable from './CourseFeeTable';
import UniversitiesList from './UniversitiesList';
import ClinicalWorkshopsSection from './ClinicalWorkshopsSection';
import StreamExtraSection from './StreamExtraSection';

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
        {kicker}
      </span>
      <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">{title}</h2>
    </div>
  );
}

export default function CourseStreamContent({ stream }: { stream: StreamSlug }) {
  const meta = getStreamMeta(stream)!;
  const courses = getCoursesByStream(stream);
  const universities = getUniversitiesByStream(stream);
  const { openEnquiry } = useEnquiry();

  const openStreamEnquiry = () =>
    openEnquiry({ stream: meta.title, university: 'Any / Not decided', course: meta.title });

  // masters-phd aggregator: surface postgraduate programmes from other streams.
  const crossLinks =
    stream === 'masters-phd'
      ? (['business-management', 'it-data-science-ai'] as StreamSlug[]).map((s) => ({
          meta: getStreamMeta(s)!,
          count: COURSES.filter((c) => c.stream === s && c.degree !== 'UG').length,
        }))
      : [];

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-[#0B1A35] px-4 py-12 sm:px-8 sm:py-16">
        <Image
          src={meta.image}
          alt={meta.title}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A35] via-[#0B1A35]/85 to-[#0B1A35]/70" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C6962E 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[1000px] text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]"
          >
            ABHA Global Educare · Dreams Have No Borders
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            {meta.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-[700px] text-base leading-relaxed text-white/75 sm:text-lg"
          >
            {meta.valueProp}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={openStreamEnquiry}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-gold to-gold-400 px-7 py-3.5 text-sm font-bold text-primary-navy shadow-gold transition-transform duration-300 hover:-translate-y-0.5 sm:text-base"
            >
              Book Counselling <ArrowRight size={18} />
            </button>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-sm text-white/80">
              <ShieldCheck size={16} className="text-[#C6962E]" />
              {meta.isMedical ? 'NMC & WHO Eligible universities' : meta.accreditation}
            </span>
          </motion.div>
        </div>
      </section>

      {/* 2. Fee chart — widened container with reduced side margin so the last
          column has room and rows stay compact */}
      <section className="bg-[#F8F9FA] px-2 py-16 sm:px-4 sm:py-20">
        <div className="mx-auto max-w-[1500px]">
          <SectionHeading kicker="Verified Fees" title="Course & Fee Chart" />
          <CourseFeeTable courses={courses} />
        </div>
      </section>

      {/* 3. Universities */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading kicker="Where ABHA Assists Admissions" title="Universities" />
          <UniversitiesList universities={universities} meta={meta} />
        </div>
      </section>

      {/* 4. Clinical Workshops (Medicine only) */}
      {stream === 'medicine' && <ClinicalWorkshopsSection />}

      {/* 5. Eligibility */}
      <section className="bg-[#F8F9FA] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[900px]">
          <SectionHeading kicker="Who Can Apply" title="Eligibility" />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {meta.eligibility.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-card"
              >
                <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
                <span className="text-sm leading-relaxed text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why · India-vs-Georgia comparison · FAQ — per stream */}
      <StreamExtraSection extra={STREAM_EXTRAS[stream]} />

      {/* masters-phd cross-links */}
      {crossLinks.length > 0 && (
        <section className="bg-white px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-[900px]">
            <SectionHeading
              kicker="Also Explore"
              title="Related Postgraduate Programmes"
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {crossLinks.map(({ meta: m, count }) => (
                <Link
                  key={m.slug}
                  href={`/courses/${m.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div>
                    <h3 className="font-playfair text-lg font-bold text-[#0B1A35]">{m.cardTitle}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {count} postgraduate programme{count === 1 ? '' : 's'}
                    </p>
                  </div>
                  <ArrowRight
                    size={20}
                    className="flex-shrink-0 text-[#C6962E] transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. India-practice / accreditation disclaimer */}
      <section className="bg-[#F8F9FA] px-4 pb-16 sm:px-8">
        <div className="mx-auto max-w-[900px]">
          <div className="flex items-start gap-3 rounded-2xl border border-[#C6962E]/30 bg-[#C6962E]/5 p-5">
            <Info size={20} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
            <p className="text-sm leading-relaxed text-gray-700">
              <span className="font-semibold text-[#0B1A35]">Please note: </span>
              {meta.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="bg-[#0B1A35] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl">
            Talk to an ABHA Counsellor
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] leading-relaxed text-white/70">
            Get free, honest guidance on {meta.cardTitle} — from programme selection to arrival.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={openStreamEnquiry}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-gold to-gold-400 px-8 py-4 text-base font-bold text-primary-navy shadow-gold transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book Counselling <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
