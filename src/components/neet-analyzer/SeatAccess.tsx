'use client';

import { motion } from 'framer-motion';
import { Home, Globe2, Info } from 'lucide-react';
import type { SeatAccess as SeatAccessType, SeatAccessLine } from '@/lib/neetPredictor';
import { formatRank } from '@/lib/neetPredictor';
import SeatSplitExplainer from '../SeatSplitExplainer';

function Group({
  title,
  subtitle,
  icon,
  lines,
  accent,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  lines: SeatAccessLine[];
  accent: string;
}) {
  if (!lines.length) return null;
  const subtotal = lines.reduce((s, l) => s + l.seats, 0);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 text-sm font-bold text-primary-navy">
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${accent}`}>{icon}</span>
          {title}
        </h4>
        <span className="shrink-0 font-playfair text-lg font-bold text-primary-navy">{formatRank(subtotal)}</span>
      </div>
      <p className="mt-1 text-xs text-navy-400">{subtitle}</p>

      <ul className="mt-3 space-y-3">
        {lines.map((l) => (
          <li key={l.label} className="rounded-xl border border-navy-100 bg-slate-50/60 px-3 py-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-primary-navy">{l.label}</span>
              <span className="shrink-0 text-sm font-bold text-accent-blue">{formatRank(l.seats)}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-navy-500">{l.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SeatAccess({ access }: { access: SeatAccessType }) {
  const {
    state,
    totalReachable,
    categoryReachable,
    category,
    inside,
    outside,
    footnote,
    intro,
    insideSubtitle,
    outsideSubtitle,
  } = access;
  const catPct = totalReachable ? Math.round((categoryReachable / totalReachable) * 100) : 0;

  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
      {/* Headings stay English by design; descriptions localise (Marathi for MH). */}
      <h3 className="font-playfair text-2xl font-bold text-primary-navy">
        Government seats you can reach{state !== 'Other' ? ` from ${state}` : ''}
      </h3>
      <p className="mt-1 text-sm text-navy-500">{intro}</p>

      {/* Compact where/how summary first, then the detailed groups below. */}
      <div className="mt-5">
        <SeatSplitExplainer state={state} variant="bare" showHeading={false} />
      </div>

      <div className="mt-6 space-y-6">
        <Group
          title="In your home state"
          subtitle={insideSubtitle}
          icon={<Home className="h-4 w-4 text-emerald-700" />}
          lines={inside}
          accent="bg-emerald-50"
        />
        <Group
          title="Anywhere in India"
          subtitle={outsideSubtitle}
          icon={<Globe2 className="h-4 w-4 text-accent-blue" />}
          lines={outside}
          accent="bg-blue-50"
        />
      </div>

      {/* Total + category share */}
      <div className="mt-6 rounded-2xl border border-primary-gold/30 bg-amber-50/60 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-semibold text-primary-navy">Total government seats open to you</span>
          <span className="shrink-0 font-playfair text-2xl font-bold text-primary-navy">
            {formatRank(totalReachable)}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-3">
          <span className="text-sm text-navy-500">
            <strong className="text-primary-navy">{category}</strong> share after reservation
          </span>
          <span className="shrink-0 font-bold text-primary-gold">~{formatRank(categoryReachable)}</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary-gold to-amber-400"
            initial={{ width: 0 }}
            whileInView={{ width: `${catPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-navy-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{footnote}</span>
      </p>
    </div>
  );
}
