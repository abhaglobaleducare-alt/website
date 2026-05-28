'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '../ui/card';
import { inr } from '../../lib/constants/hr';

interface Slab {
  slab_name: string;
  slab_icon: string | null;
}

interface Summary {
  admissionsCount: number;
  currentSlab: Slab | null;
  nextSlab: Slab | null;
  admissionsToNextSlab: number | null;
  slabThreshold: number | null;
  nextAdmissionEarns: number;
  totalEarned: number;
  totalPending: number;
  totalDisbursed: number;
}

export function BonusSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [eligible, setEligible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/bonus?scope=staff')
      .then((res) => res.json())
      .then((json) => {
        setSummary(json.summary ?? null);
        setEligible(
          Boolean(json.profile?.is_bonus_eligible && json.profile?.bonus_type === 'admission'),
        );
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || !eligible || !summary) return null;

  const { admissionsCount, slabThreshold, currentSlab } = summary;
  const progress = slabThreshold
    ? Math.min(Math.round((admissionsCount / slabThreshold) * 100), 100)
    : 100;

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.35em] text-saffron">Achievement slab</p>
        <Link href="/staff/salary" className="text-xs font-semibold text-saffron hover:underline">
          Details
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-3xl">{currentSlab?.slab_icon ?? '🏅'}</span>
        <div>
          <p className="text-xl font-semibold">{currentSlab?.slab_name ?? 'Starting'}</p>
          <p className="text-xs text-slate-400">{admissionsCount} admissions</p>
        </div>
      </div>

      <div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-3 rounded-full bg-saffron" style={{ width: `${progress}%` }} />
        </div>
        {summary.admissionsToNextSlab !== null && summary.nextSlab ? (
          <p className="mt-2 text-sm text-slate-300">
            {admissionsCount}/{slabThreshold} — {summary.admissionsToNextSlab} to{' '}
            {summary.nextSlab.slab_name}
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-300">Top slab reached</p>
        )}
      </div>

      <p className="rounded-2xl bg-emerald-500/10 p-3 text-sm text-emerald-200">
        Next admission earns {inr(summary.nextAdmissionEarns)}
      </p>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-2xl bg-slate-900/60 p-2">
          <p className="text-slate-400">Earned</p>
          <p className="mt-1 font-semibold">{inr(summary.totalEarned)}</p>
        </div>
        <div className="rounded-2xl bg-slate-900/60 p-2">
          <p className="text-slate-400">Pending</p>
          <p className="mt-1 font-semibold text-amber-200">{inr(summary.totalPending)}</p>
        </div>
        <div className="rounded-2xl bg-slate-900/60 p-2">
          <p className="text-slate-400">Disbursed</p>
          <p className="mt-1 font-semibold text-emerald-300">{inr(summary.totalDisbursed)}</p>
        </div>
      </div>
    </Card>
  );
}
