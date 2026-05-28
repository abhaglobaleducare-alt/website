'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import {
  leaveStatuses,
  leaveStatusClasses,
  titleCase,
  type LeaveStatus,
} from '../../../lib/constants/hr';

interface LeaveApplication {
  id: string;
  user_id: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  days_count: number;
  reason: string;
  status: LeaveStatus;
  rejection_reason?: string | null;
  created_at?: string | null;
}

interface StaffMember {
  id: string;
  full_name?: string | null;
}

const selectClass =
  'rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-saffron';

export default function AdminLeavePage() {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejecting, setRejecting] = useState<LeaveApplication | null>(null);
  const [reason, setReason] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/staff')
      .then((res) => res.json())
      .then((json) => setStaff(json.staff ?? []))
      .catch(() => setStaff([]));
  }, []);

  const load = () => {
    const params = new URLSearchParams();
    params.set('scope', 'admin');
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/leave?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => setApplications(json.applications ?? []))
      .catch(() => setApplications([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const staffName = useMemo(() => {
    const map = new Map(staff.map((member) => [member.id, member.full_name ?? 'Unknown']));
    return (id: string) => map.get(id) ?? 'Unknown staff';
  }, [staff]);

  const approve = async (application: LeaveApplication) => {
    setBusyId(application.id);
    const response = await fetch(`/api/leave/${application.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    });
    const json = await response.json();
    setBusyId(null);
    if (json.ok) load();
  };

  const submitRejection = async () => {
    if (!rejecting || !reason.trim()) return;
    setBusyId(rejecting.id);
    const response = await fetch(`/api/leave/${rejecting.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', rejection_reason: reason.trim() }),
    });
    const json = await response.json();
    setBusyId(null);
    if (json.ok) {
      setRejecting(null);
      setReason('');
      load();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">HR · Leave</p>
            <h1 className="mt-2 text-3xl font-semibold">Leave approvals</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Review and action staff leave requests across the team.
            </p>
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className={selectClass}
          >
            <option value="">All statuses</option>
            {leaveStatuses.map((value) => (
              <option key={value} value={value}>
                {titleCase(value)}
              </option>
            ))}
          </select>
        </header>

        <section className="grid gap-3">
          {applications.length === 0 ? (
            <Card>
              <p className="text-slate-300">No leave applications for this filter.</p>
            </Card>
          ) : (
            applications.map((application) => (
              <Card key={application.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{staffName(application.user_id)}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${leaveStatusClasses[application.status]}`}
                      >
                        {titleCase(application.status)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {titleCase(application.leave_type)} · {application.days_count} day(s)
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">
                      {format(parseISO(application.from_date), 'MMM d')} —{' '}
                      {format(parseISO(application.to_date), 'MMM d, yyyy')}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{application.reason}</p>
                    {application.rejection_reason ? (
                      <p className="mt-2 rounded-2xl bg-red-500/10 p-2 text-sm text-red-200">
                        Rejected: {application.rejection_reason}
                      </p>
                    ) : null}
                  </div>
                  {application.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={busyId === application.id}
                        onClick={() => approve(application)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setRejecting(application);
                          setReason('');
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Card>
            ))
          )}
        </section>
      </div>

      {rejecting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-soft">
            <h2 className="text-xl font-semibold">Reject leave</h2>
            <p className="mt-1 text-sm text-slate-300">
              {staffName(rejecting.user_id)} · {titleCase(rejecting.leave_type)}
            </p>
            <label
              className="mt-4 block space-y-2 text-sm text-slate-200"
              htmlFor="rejection_reason"
            >
              Reason (required)
              <textarea
                id="rejection_reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="min-h-[100px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                placeholder="Explain why this request is being rejected"
              />
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setRejecting(null);
                  setReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={submitRejection}
                disabled={!reason.trim() || busyId === rejecting.id}
              >
                {busyId === rejecting.id ? 'Rejecting…' : 'Confirm rejection'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
