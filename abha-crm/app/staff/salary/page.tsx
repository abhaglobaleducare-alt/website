'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Card } from '../../../components/ui/card';
import { bonusStatusClasses, inr, titleCase, type BonusStatus } from '../../../lib/constants/hr';

interface Slab {
  id: string;
  slab_name: string;
  slab_color: string | null;
  slab_icon: string | null;
  admissions_min: number;
  admissions_max: number | null;
  total_bonus_per_admission: number;
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

interface Profile {
  full_name?: string | null;
  base_salary?: number | null;
  is_bonus_eligible?: boolean | null;
  bonus_type?: string | null;
}

interface Bonus {
  id: string;
  bonus_type: string;
  bonus_amount: number;
  status: BonusStatus;
  eligible_date?: string | null;
  disbursed_date?: string | null;
  created_at?: string | null;
}

export default function StaffSalaryPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);

  useEffect(() => {
    fetch('/api/bonus?scope=staff')
      .then((res) => res.json())
      .then((json) => {
        setProfile(json.profile ?? null);
        setSummary(json.summary ?? null);
        setBonuses(json.bonuses ?? []);
      })
      .catch(() => undefined);
  }, []);

  const eligible = profile?.is_bonus_eligible && profile.bonus_type === 'admission';
  const slab = summary?.currentSlab;
  const threshold = summary?.slabThreshold ?? null;
  const count = summary?.admissionsCount ?? 0;
  const progress = threshold ? Math.min(Math.round((count / threshold) * 100), 100) : 100;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-saffron">HR · Salary &amp; Bonus</p>
          <h1 className="mt-2 text-3xl font-semibold">Salary &amp; bonus</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Your monthly salary, achievement slab, and admission bonus earnings.
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          <Card className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">Monthly base salary</p>
            <p className="text-2xl font-bold">{inr(profile?.base_salary ?? 0)}</p>
          </Card>
          <Card className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">Bonus eligibility</p>
            <p className="text-2xl font-bold">
              {profile?.is_bonus_eligible ? 'Eligible' : 'Not eligible'}
            </p>
            {profile?.bonus_type && profile.bonus_type !== 'none' ? (
              <p className="text-xs text-slate-400">{titleCase(profile.bonus_type)}</p>
            ) : null}
          </Card>
          <Card className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">Admissions</p>
            <p className="text-2xl font-bold">{count}</p>
          </Card>
        </section>

        {eligible ? (
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{slab?.slab_icon ?? '🏅'}</span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Current slab</p>
                  <p className="text-2xl font-semibold">{slab?.slab_name ?? 'Starting'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Next admission earns
                </p>
                <p className="text-2xl font-bold text-emerald-300">
                  {inr(summary?.nextAdmissionEarns ?? 0)}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>
                  {count}
                  {threshold ? `/${threshold}` : ''} admissions
                </span>
                {summary?.admissionsToNextSlab !== null && summary?.nextSlab ? (
                  <span>
                    {summary?.admissionsToNextSlab} to {summary?.nextSlab?.slab_name}
                  </span>
                ) : (
                  <span>Top slab reached</span>
                )}
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-3 rounded-full bg-saffron" style={{ width: `${progress}%` }} />
              </div>
              {summary?.admissionsToNextSlab && summary.nextSlab ? (
                <p className="mt-2 text-sm text-slate-400">
                  {summary.admissionsToNextSlab} more admission(s) to reach{' '}
                  {summary.nextSlab.slab_name} —{' '}
                  {inr(Number(summary.nextSlab.total_bonus_per_admission))} per admission.
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-900/60 p-4">
                <p className="text-xs text-slate-400">Total earned</p>
                <p className="mt-1 text-xl font-bold">{inr(summary?.totalEarned ?? 0)}</p>
              </div>
              <div className="rounded-2xl bg-slate-900/60 p-4">
                <p className="text-xs text-slate-400">Pending</p>
                <p className="mt-1 text-xl font-bold text-amber-200">
                  {inr(summary?.totalPending ?? 0)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-900/60 p-4">
                <p className="text-xs text-slate-400">Disbursed</p>
                <p className="mt-1 text-xl font-bold text-emerald-300">
                  {inr(summary?.totalDisbursed ?? 0)}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <p className="text-slate-300">
              You are not on the admission bonus scheme. Reach out to admin for details on your
              compensation structure.
            </p>
          </Card>
        )}

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">Bonus history</h2>
          {bonuses.length === 0 ? (
            <Card>
              <p className="text-slate-300">No bonus records yet.</p>
            </Card>
          ) : (
            bonuses.map((bonus) => (
              <Card key={bonus.id}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{inr(bonus.bonus_amount)}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${bonusStatusClasses[bonus.status]}`}
                      >
                        {titleCase(bonus.status)}
                      </span>
                      <span className="text-xs text-slate-400">{titleCase(bonus.bonus_type)}</span>
                    </div>
                    {bonus.eligible_date ? (
                      <p className="mt-1 text-sm text-slate-400">
                        Eligible {format(parseISO(bonus.eligible_date), 'MMM d, yyyy')}
                      </p>
                    ) : null}
                  </div>
                  {bonus.disbursed_date ? (
                    <p className="text-xs text-emerald-300">
                      Paid {format(parseISO(bonus.disbursed_date), 'MMM d, yyyy')}
                    </p>
                  ) : null}
                </div>
              </Card>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
