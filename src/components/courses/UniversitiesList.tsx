'use client';

import { GraduationCap, MapPin, ShieldCheck } from 'lucide-react';
import type { StreamMeta } from '@/data/streams';

export default function UniversitiesList({
  universities,
  meta,
}: {
  universities: { university: string; location: string }[];
  meta: StreamMeta;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {universities.map((u) => (
        <div
          key={u.university}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
        >
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#C6962E]/10 text-[#C6962E]">
            <GraduationCap size={22} />
          </div>
          <h3 className="font-playfair text-lg font-bold leading-snug text-[#0B1A35]">
            {u.university}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin size={14} className="text-[#C6962E]" /> {u.location}
          </p>
          <p className="mt-3 flex items-start gap-1.5 text-xs font-medium leading-snug text-gray-600">
            <ShieldCheck size={14} className="mt-0.5 flex-shrink-0 text-[#C6962E]" />
            {meta.isMedical ? 'NMC & WHO Eligible' : meta.accreditation}
          </p>
        </div>
      ))}
    </div>
  );
}
