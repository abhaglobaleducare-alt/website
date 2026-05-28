'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { parentChannels, titleCase } from '../../../lib/constants/hostel';

interface Communication {
  id: string;
  student_id: string;
  communication_date: string;
  channel?: string | null;
  subject?: string | null;
  notes?: string | null;
  follow_up_required?: boolean | null;
  follow_up_date?: string | null;
  student?: { full_name?: string | null } | null;
}

interface StudentOption {
  id: string;
  full_name?: string | null;
}

const today = new Date().toISOString().slice(0, 10);

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30';

export default function HostelParentsPage() {
  const [comms, setComms] = useState<Communication[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentFilter, setStudentFilter] = useState('');
  const [followUpOnly, setFollowUpOnly] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    const params = new URLSearchParams();
    if (studentFilter) params.set('student_id', studentFilter);
    if (followUpOnly) params.set('follow_up', '1');
    fetch(`/api/hostel/parents?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setComms(json.communications ?? []);
        setTableMissing(Boolean(json.tableMissing));
      })
      .catch(() => setComms([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentFilter, followUpOnly]);

  useEffect(() => {
    fetch('/api/hostel/students')
      .then((res) => res.json())
      .then((json) => setStudents(json.students ?? []))
      .catch(() => setStudents([]));
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMsg('');
    const form = event.currentTarget;
    const formData = new FormData(form);
    const res = await fetch('/api/hostel/parents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: String(formData.get('student_id') ?? ''),
        communication_date: String(formData.get('communication_date') ?? ''),
        channel: String(formData.get('channel') ?? 'call'),
        subject: String(formData.get('subject') ?? ''),
        notes: String(formData.get('notes') ?? ''),
        follow_up_required: formData.get('follow_up_required') === 'on',
        follow_up_date: String(formData.get('follow_up_date') ?? '') || null,
      }),
    });
    const json = await res.json();
    setMsg(json.ok ? 'Communication logged.' : (json.error ?? 'Could not log.'));
    if (json.ok) {
      form.reset();
      load();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Parents</p>
            <h1 className="mt-2 text-3xl font-semibold">Parent communication log</h1>
          </div>
          <Link href="/hostel/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </header>

        {tableMissing ? (
          <Card className="border-amber-500/40 bg-amber-500/10">
            <p className="text-sm text-amber-100">
              The parent communication table is not yet in the database. Apply migration{' '}
              <code>20260527000024_create_hostel_parent_communication.sql</code> to enable saving.
            </p>
          </Card>
        ) : null}

        <Card>
          <h2 className="text-lg font-semibold">Log communication</h2>
          {msg ? <p className="mt-2 text-sm text-emerald-200">{msg}</p> : null}
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submit}>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="student_id">
              Student
              <select id="student_id" name="student_id" className={selectClass} required>
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="communication_date">
              Date
              <Input
                id="communication_date"
                name="communication_date"
                type="date"
                defaultValue={today}
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="channel">
              Channel
              <select id="channel" name="channel" className={selectClass}>
                {parentChannels.map((channel) => (
                  <option key={channel} value={channel}>
                    {titleCase(channel)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="subject">
              Subject
              <Input id="subject" name="subject" placeholder="Fee reminder, wellbeing check…" />
            </label>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="notes">
              Notes
              <textarea
                id="notes"
                name="notes"
                className="min-h-[80px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-saffron"
              />
            </label>
            <label
              className="flex items-center gap-2 text-sm text-slate-200"
              htmlFor="follow_up_required"
            >
              <input
                id="follow_up_required"
                name="follow_up_required"
                type="checkbox"
                className="h-4 w-4 accent-saffron"
              />
              Follow-up required
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="follow_up_date">
              Follow-up date
              <Input id="follow_up_date" name="follow_up_date" type="date" />
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Log communication</Button>
            </div>
          </form>
        </Card>

        <div className="flex flex-wrap gap-3">
          <select
            value={studentFilter}
            onChange={(event) => setStudentFilter(event.target.value)}
            className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-saffron"
          >
            <option value="">All students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name}
              </option>
            ))}
          </select>
          <Button
            variant={followUpOnly ? 'default' : 'ghost'}
            onClick={() => setFollowUpOnly((v) => !v)}
          >
            {followUpOnly ? 'Showing follow-ups' : 'Follow-ups only'}
          </Button>
        </div>

        <section className="grid gap-3">
          {comms.length === 0 ? (
            <Card>
              <p className="text-slate-300">No communications logged.</p>
            </Card>
          ) : (
            comms.map((comm) => (
              <Card key={comm.id} className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">
                    {comm.student?.full_name ?? 'Student'}
                    <span className="ml-2 text-sm font-normal text-slate-400">
                      {titleCase(comm.channel ?? 'call')}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {format(parseISO(comm.communication_date), 'MMM d, yyyy')}
                  </span>
                </div>
                {comm.subject ? <p className="text-sm font-medium">{comm.subject}</p> : null}
                {comm.notes ? <p className="text-sm text-slate-300">{comm.notes}</p> : null}
                {comm.follow_up_required ? (
                  <p className="text-xs text-amber-200">
                    Follow-up required{comm.follow_up_date ? ` by ${comm.follow_up_date}` : ''}
                  </p>
                ) : null}
              </Card>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
