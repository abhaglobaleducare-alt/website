'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  leaveTypes,
  leaveStatusClasses,
  titleCase,
  type LeaveStatus,
} from '../../../lib/constants/hr';

interface LeaveApplication {
  id: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  days_count: number;
  reason: string;
  status: LeaveStatus;
  rejection_reason?: string | null;
  created_at?: string | null;
}

interface Balance {
  type: string;
  entitlement: number | null;
  used: number;
  remaining: number | null;
}

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30';

export default function StaffLeavePage() {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    fetch('/api/leave?scope=staff')
      .then((res) => res.json())
      .then((json) => {
        setApplications(json.applications ?? []);
        setBalances(json.balances ?? []);
      })
      .catch(() => {
        setApplications([]);
        setBalances([]);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      leave_type: String(formData.get('leave_type') ?? ''),
      from_date: String(formData.get('from_date') ?? ''),
      to_date: String(formData.get('to_date') ?? ''),
      reason: String(formData.get('reason') ?? '').trim(),
    };

    const response = await fetch('/api/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    setLoading(false);

    if (json.ok) {
      setStatus('Leave application submitted.');
      form.reset();
      load();
    } else {
      setStatus(json.error ?? 'Could not submit leave.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-saffron">HR · Leave</p>
          <h1 className="mt-2 text-3xl font-semibold">My leave</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Apply for leave, track approvals, and monitor your remaining balance this year.
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          {balances.map((balance) => (
            <Card key={balance.type} className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {titleCase(balance.type)}
              </p>
              <p className="text-2xl font-bold">
                {balance.remaining === null ? '∞' : balance.remaining}
              </p>
              <p className="text-xs text-slate-400">
                {balance.entitlement === null
                  ? `${balance.used} used`
                  : `${balance.used}/${balance.entitlement} used`}
              </p>
            </Card>
          ))}
        </section>

        <Card>
          <h2 className="text-xl font-semibold">Apply for leave</h2>
          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="leave_type">
              Leave type
              <select id="leave_type" name="leave_type" className={selectClass} required>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {titleCase(type)}
                  </option>
                ))}
              </select>
            </label>
            <div className="hidden md:block" />
            <label className="space-y-2 text-sm text-slate-200" htmlFor="from_date">
              From date
              <Input id="from_date" name="from_date" type="date" required />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="to_date">
              To date
              <Input id="to_date" name="to_date" type="date" required />
            </label>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="reason">
              Reason
              <textarea
                id="reason"
                name="reason"
                required
                className="min-h-[90px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                placeholder="Brief reason for the leave request"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting…' : 'Submit application'}
              </Button>
            </div>
          </form>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">Application history</h2>
          {applications.length === 0 ? (
            <Card>
              <p className="text-slate-300">No leave applications yet.</p>
            </Card>
          ) : (
            applications.map((application) => (
              <Card key={application.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{titleCase(application.leave_type)} leave</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${leaveStatusClasses[application.status]}`}
                      >
                        {titleCase(application.status)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {application.days_count} day(s)
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">
                      {format(parseISO(application.from_date), 'MMM d')} —{' '}
                      {format(parseISO(application.to_date), 'MMM d, yyyy')}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{application.reason}</p>
                    {application.status === 'rejected' && application.rejection_reason ? (
                      <p className="mt-2 rounded-2xl bg-red-500/10 p-2 text-sm text-red-200">
                        Rejected: {application.rejection_reason}
                      </p>
                    ) : null}
                  </div>
                  {application.created_at ? (
                    <p className="text-xs text-slate-500">
                      {format(parseISO(application.created_at), 'MMM d, yyyy')}
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
