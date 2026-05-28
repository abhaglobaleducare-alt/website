'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import {
  bonusStatuses,
  bonusStatusClasses,
  inr,
  titleCase,
  type BonusStatus,
} from '../../../lib/constants/hr';

interface Bonus {
  id: string;
  staff_id: string;
  student_id: string;
  bonus_type: 'admission' | 'reference_distribution';
  bonus_amount: number;
  status: BonusStatus;
  eligible_date?: string | null;
  disbursed_date?: string | null;
  referrer_name?: string | null;
  referrer_phone?: string | null;
  referrer_amount?: number | null;
  referrer_paid?: boolean | null;
  created_at?: string | null;
  staff?: { full_name?: string | null; bonus_type?: string | null } | null;
  student?: { full_name?: string | null; student_code?: string | null } | null;
}

const selectClass =
  'rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-saffron';

export default function AdminBonusPage() {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    const params = new URLSearchParams();
    params.set('scope', 'admin');
    if (typeFilter) params.set('type', typeFilter);
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/bonus?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => setBonuses(json.bonuses ?? []))
      .catch(() => setBonuses([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, statusFilter]);

  const totals = useMemo(() => {
    const result = { pendingApproval: 0, approved: 0, disbursed: 0 };
    bonuses.forEach((bonus) => {
      const amount = Number(bonus.bonus_amount) || 0;
      if (bonus.status === 'pending_approval') result.pendingApproval += amount;
      else if (bonus.status === 'approved') result.approved += amount;
      else if (bonus.status === 'disbursed') result.disbursed += amount;
    });
    return result;
  }, [bonuses]);

  const perStaff = useMemo(() => {
    const map = new Map<string, { name: string; earned: number; disbursed: number }>();
    bonuses.forEach((bonus) => {
      const key = bonus.staff_id;
      const entry = map.get(key) ?? {
        name: bonus.staff?.full_name ?? 'Unknown',
        earned: 0,
        disbursed: 0,
      };
      const amount = Number(bonus.bonus_amount) || 0;
      if (bonus.status !== 'cancelled') entry.earned += amount;
      if (bonus.status === 'disbursed') entry.disbursed += amount;
      map.set(key, entry);
    });
    return Array.from(map.values());
  }, [bonuses]);

  const act = async (id: string, action: string) => {
    setBusyId(id);
    const response = await fetch(`/api/bonus/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const json = await response.json();
    setBusyId(null);
    if (json.ok) load();
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">HR · Bonus</p>
            <h1 className="mt-2 text-3xl font-semibold">Bonus panel</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Approve admission bonuses, mark disbursements, and track reference distribution
              payouts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className={selectClass}
            >
              <option value="">All types</option>
              <option value="admission">Admission</option>
              <option value="reference_distribution">Reference distribution</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={selectClass}
            >
              <option value="">All statuses</option>
              {bonusStatuses.map((value) => (
                <option key={value} value={value}>
                  {titleCase(value)}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          <Card>
            <p className="text-sm text-slate-400">Pending approval</p>
            <p className="mt-2 text-3xl font-bold text-amber-200">{inr(totals.pendingApproval)}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Approved (awaiting payout)</p>
            <p className="mt-2 text-3xl font-bold text-blue-200">{inr(totals.approved)}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Disbursed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{inr(totals.disbursed)}</p>
          </Card>
        </section>

        {perStaff.length > 0 ? (
          <Card>
            <h2 className="text-lg font-semibold">Per-staff totals</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {perStaff.map((entry) => (
                <div key={entry.name} className="rounded-2xl bg-slate-900/60 p-4">
                  <p className="font-semibold">{entry.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Earned {inr(entry.earned)} · Disbursed {inr(entry.disbursed)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">Bonuses</h2>
          {bonuses.length === 0 ? (
            <Card>
              <p className="text-slate-300">No bonuses for this filter.</p>
            </Card>
          ) : (
            bonuses.map((bonus) => {
              const isReference = bonus.bonus_type === 'reference_distribution';
              return (
                <Card key={bonus.id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{inr(bonus.bonus_amount)}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${bonusStatusClasses[bonus.status]}`}
                        >
                          {titleCase(bonus.status)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {isReference ? 'Reference distribution' : 'Admission'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-300">
                        {bonus.staff?.full_name ?? 'Unknown staff'} ·{' '}
                        {bonus.student?.full_name ?? 'Student'}{' '}
                        {bonus.student?.student_code ? `(${bonus.student.student_code})` : ''}
                      </p>
                      {isReference && bonus.referrer_name ? (
                        <p className="mt-1 text-sm text-slate-400">
                          Referrer: {bonus.referrer_name}
                          {bonus.referrer_phone ? ` · ${bonus.referrer_phone}` : ''}
                          {bonus.referrer_amount ? ` · ${inr(bonus.referrer_amount)}` : ''} ·{' '}
                          {bonus.referrer_paid ? 'Paid' : 'Unpaid'}
                        </p>
                      ) : null}
                      {bonus.eligible_date ? (
                        <p className="mt-1 text-xs text-slate-500">
                          Eligible {format(parseISO(bonus.eligible_date), 'MMM d, yyyy')}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      {bonus.status === 'pending_approval' ? (
                        <>
                          <Button
                            size="sm"
                            disabled={busyId === bonus.id}
                            onClick={() => act(bonus.id, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={busyId === bonus.id}
                            onClick={() => act(bonus.id, 'hold')}
                          >
                            Hold
                          </Button>
                        </>
                      ) : null}
                      {bonus.status === 'approved' ? (
                        <Button
                          size="sm"
                          disabled={busyId === bonus.id}
                          onClick={() => act(bonus.id, 'disburse')}
                        >
                          Mark disbursed
                        </Button>
                      ) : null}
                      {isReference && !bonus.referrer_paid ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={busyId === bonus.id}
                          onClick={() => act(bonus.id, 'mark_referrer_paid')}
                        >
                          Mark referrer paid
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
