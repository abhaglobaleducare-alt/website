'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight, GraduationCap, School } from 'lucide-react';
import {
  CurrencyProvider,
  useCurrency,
  formatMoney,
} from '@/components/courses/context';
import CurrencyToggle from '@/components/courses/CurrencyToggle';
import {
  getUniversitiesByCountry,
  getCoursesByUniversity,
  type Course,
} from '@/data/courses';
import { getUniversityImages } from '@/data/universityImages';

/** Per-semester tuition, derived from the yearly fee where it is a plain number. */
function semesterFeeUSD(c: Course): number | null {
  return typeof c.feePerYearUSD === 'number' ? Math.round(c.feePerYearUSD / 2) : null;
}

function Inner({ country }: { country: string }) {
  const universities = getUniversitiesByCountry(country);
  const { currency } = useCurrency();
  const [selected, setSelected] = useState<string>('');

  const courses = selected ? getCoursesByUniversity(selected) : [];
  const images = selected ? getUniversityImages(selected) : [];

  return (
    <section id="university-explorer" className="bg-white px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#C6962E]">
            University Explorer
          </span>
          <h2 className="font-playfair text-3xl leading-tight text-[#0B1A35] sm:text-4xl">
            Universities &amp; Courses in {country}
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-sm leading-relaxed text-gray-500 sm:text-base">
            Pick a university to see its campus and every programme with verified
            year-wise fees. Switch between USD and INR anytime.
          </p>
        </div>

        {/* Controls: dropdown + currency toggle */}
        <div className="mx-auto mb-10 flex max-w-[760px] flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <label className="relative flex-1">
            <span className="sr-only">Select University</span>
            <School
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C6962E]"
            />
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full appearance-none rounded-full border border-gray-200 bg-white py-3.5 pl-11 pr-11 text-sm font-semibold text-[#0B1A35] shadow-card transition-colors focus:border-[#C6962E] focus:outline-none focus:ring-2 focus:ring-[#C6962E]/30 sm:text-base"
            >
              <option value="">Select a university…</option>
              {universities.map((u) => (
                <option key={u.university} value={u.university}>
                  {u.university}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </label>
          <CurrencyToggle className="self-center sm:self-auto" />
        </div>

        {/* Empty state — bilingual prompt */}
        {!selected && (
          <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-[#F8F9FA] px-6 py-12 text-center">
            <GraduationCap size={36} className="text-[#C6962E]" />
            <p className="text-base font-semibold text-[#0B1A35]">
              युनिव्हर्सिटी निवडा
            </p>
            <p className="text-sm text-gray-500">Select a university to explore courses</p>
          </div>
        )}

        {/* Selected university content */}
        {selected && (
          <div className="space-y-8">
            {/* Gallery — only when campus images exist (graceful fallback otherwise) */}
            {images.length > 0 && (
              <div
                className={`grid gap-4 ${
                  images.length === 1
                    ? 'grid-cols-1'
                    : images.length === 2
                      ? 'sm:grid-cols-2'
                      : 'sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {images.slice(0, 4).map((src, i) => (
                  <div
                    key={src}
                    className={`relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card ${
                      images.length === 1 ? 'mx-auto w-full max-w-[720px]' : ''
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${selected} campus${images.length > 1 ? ` — photo ${i + 1}` : ''}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Courses table */}
            <div>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-playfair text-xl font-bold text-[#0B1A35] sm:text-2xl">
                  {selected}
                </h3>
                <span className="text-sm text-gray-500">
                  {courses.length} {courses.length === 1 ? 'programme' : 'programmes'}
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-card">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#0B1A35] text-xs uppercase tracking-wide text-white/85">
                      <th className="px-4 py-3.5 font-semibold">Course</th>
                      <th className="px-4 py-3.5 font-semibold">Duration</th>
                      <th className="px-4 py-3.5 font-semibold">Semester Fee</th>
                      <th className="px-4 py-3.5 font-semibold">Total Fee</th>
                      <th className="px-4 py-3.5 text-right font-semibold">More Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c, i) => {
                      const sem = semesterFeeUSD(c);
                      const semAfter =
                        c.feePerYearAfterUSD != null
                          ? Math.round(c.feePerYearAfterUSD / 2)
                          : null;
                      return (
                        <tr
                          key={`${c.stream}-${c.name}`}
                          className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FA]'}
                        >
                          <td className="px-4 py-3.5 align-top">
                            <span className="font-semibold text-[#0B1A35]">{c.name}</span>
                            <span className="mt-0.5 block text-xs text-gray-400">{c.degree}</span>
                          </td>
                          <td className="px-4 py-3.5 align-top text-sm text-gray-600">
                            {c.duration}
                          </td>
                          <td className="px-4 py-3.5 align-top text-sm">
                            {sem != null ? (
                              <span className="font-semibold text-[#0B1A35]">
                                {formatMoney(sem, currency)}
                              </span>
                            ) : (
                              <span className="text-gray-500">As per schedule</span>
                            )}
                            {semAfter != null && (
                              <span className="mt-0.5 block text-xs font-medium text-[#1B7C9E]">
                                {formatMoney(semAfter, currency)} after scholarship
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 align-top text-sm">
                            {c.totalTuitionUSD > 0 ? (
                              <span className="font-semibold text-[#0B1A35]">
                                {formatMoney(c.totalTuitionUSD, currency)}
                              </span>
                            ) : (
                              <span className="text-gray-500">As per university schedule</span>
                            )}
                            {c.totalTuitionAfterUSD != null && (
                              <span className="mt-0.5 block text-xs font-medium text-[#1B7C9E]">
                                {formatMoney(c.totalTuitionAfterUSD, currency)} after scholarship
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right align-top">
                            <Link
                              href={`/courses/${c.stream}`}
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#C6962E]/40 px-3.5 py-1.5 text-xs font-semibold text-[#0B1A35] transition-colors hover:bg-[#C6962E]/10"
                            >
                              View <ArrowRight size={13} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-gray-400">
                Fees shown in {currency}. Semester fee is derived from the verified
                year-wise tuition; where a schedule varies by year it is marked “as per
                schedule”. Hostel, food, insurance &amp; living costs are extra unless stated.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Interactive University Explorer for destination pages: a "Select University"
 * dropdown → campus gallery (when photos exist) + a per-course fee table with a
 * live USD/INR toggle. Renders nothing for countries whose universities are not
 * in the course data (e.g. Russian Countries).
 */
export default function UniversityExplorer({ country }: { country: string }) {
  if (getUniversitiesByCountry(country).length === 0) return null;
  return (
    <CurrencyProvider>
      <Inner country={country} />
    </CurrencyProvider>
  );
}
