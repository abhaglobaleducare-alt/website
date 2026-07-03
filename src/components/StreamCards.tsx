'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LeadGate from '@/components/LeadGate';
import { STREAMS } from '@/data/streams';
import { courseCount } from '@/data/courses';

/** Homepage "Explore by Stream" — 6 navy/gold cards with live programme counts. */
export default function StreamCards() {
  return (
    <section className="bg-white px-4 py-16 sm:px-8 sm:py-20 lg:py-24" id="explore-by-stream">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
            Explore by Stream
          </span>
          <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl lg:text-[2.75rem]">
            Find Your <span className="text-[#C6962E]">Course Abroad</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-lg leading-relaxed text-gray-500">
            From MBBS to MBA, PhD to AI — explore verified programmes and fees across six streams
            at our partner universities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STREAMS.map((s, i) => {
            const count = courseCount(s.slug);
            const Icon = s.icon;
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
              >
                <LeadGate action="explore_course" mode="sameTab" extra={{ stream: s.slug }}>
                <Link
                  href={`/courses/${s.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B1A35] transition-all duration-300 hover:-translate-y-1 hover:shadow-navy"
                >
                  {/* Course image banner */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.cardTitle}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-[#0B1A35]/80 px-3 py-1 text-xs font-semibold text-[#E0B85C] backdrop-blur-sm">
                      {count} programme{count === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6962E]/15 text-[#C6962E]">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-white">{s.cardTitle}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{s.valueProp}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C6962E] transition-all group-hover:gap-2.5">
                      Explore courses <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
                </LeadGate>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
