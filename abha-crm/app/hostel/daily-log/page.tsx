'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';

interface DailyLog {
  id: string;
  log_date: string;
  students_present?: number | null;
  students_absent?: number | null;
  new_arrivals?: number | null;
  departures?: number | null;
  issues?: string | null;
  meals_served?: string | null;
  notable_events?: string | null;
}

const today = new Date().toISOString().slice(0, 10);

export default function HostelDailyLogPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [msg, setMsg] = useState('');

  const load = () => {
    fetch('/api/hostel/daily-log')
      .then((res) => res.json())
      .then((json) => setLogs(json.logs ?? []))
      .catch(() => setLogs([]));
  };

  useEffect(() => {
    load();
  }, []);

  const todayLogged = logs.some((log) => log.log_date === today);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMsg('');
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/hostel/daily-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        log_date: String(formData.get('log_date') ?? ''),
        students_present: Number(formData.get('students_present') ?? 0) || 0,
        students_absent: Number(formData.get('students_absent') ?? 0) || 0,
        new_arrivals: Number(formData.get('new_arrivals') ?? 0) || 0,
        departures: Number(formData.get('departures') ?? 0) || 0,
        issues: String(formData.get('issues') ?? ''),
        meals_served: String(formData.get('meals_served') ?? ''),
        notable_events: String(formData.get('notable_events') ?? ''),
      }),
    });
    const json = await res.json();
    setMsg(json.ok ? 'Daily log saved.' : (json.error ?? 'Could not save log.'));
    if (json.ok) load();
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Daily Log</p>
            <h1 className="mt-2 text-3xl font-semibold">Daily operations log</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${todayLogged ? 'bg-emerald-500/15 text-emerald-200' : 'bg-amber-500/15 text-amber-200'}`}
            >
              {todayLogged ? "Today's log recorded" : "Today's log pending"}
            </span>
            <Link href="/hostel/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </header>

        <Card>
          <h2 className="text-lg font-semibold">Log entry</h2>
          {msg ? <p className="mt-2 text-sm text-emerald-200">{msg}</p> : null}
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submit}>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="log_date">
              Date
              <Input id="log_date" name="log_date" type="date" defaultValue={today} required />
            </label>
            <div className="hidden md:block" />
            <label className="space-y-2 text-sm text-slate-200" htmlFor="students_present">
              Students present
              <Input id="students_present" name="students_present" type="number" defaultValue={0} />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="students_absent">
              Students absent
              <Input id="students_absent" name="students_absent" type="number" defaultValue={0} />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="new_arrivals">
              New arrivals
              <Input id="new_arrivals" name="new_arrivals" type="number" defaultValue={0} />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="departures">
              Departures
              <Input id="departures" name="departures" type="number" defaultValue={0} />
            </label>
            <label
              className="space-y-2 text-sm text-slate-200 md:col-span-2"
              htmlFor="meals_served"
            >
              Meals served
              <Input id="meals_served" name="meals_served" placeholder="Breakfast, lunch, dinner" />
            </label>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="issues">
              Issues
              <textarea
                id="issues"
                name="issues"
                className="min-h-[70px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-saffron"
              />
            </label>
            <label
              className="space-y-2 text-sm text-slate-200 md:col-span-2"
              htmlFor="notable_events"
            >
              Notable events
              <textarea
                id="notable_events"
                name="notable_events"
                className="min-h-[70px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-saffron"
              />
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Save daily log</Button>
            </div>
          </form>
        </Card>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">Log history</h2>
          {logs.length === 0 ? (
            <Card>
              <p className="text-slate-300">No logs recorded yet.</p>
            </Card>
          ) : (
            logs.map((log) => (
              <Card key={log.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {format(parseISO(log.log_date), 'EEEE, MMM d, yyyy')}
                  </h3>
                  <span className="text-sm text-slate-400">
                    Present {log.students_present ?? 0} · Absent {log.students_absent ?? 0}
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  Arrivals {log.new_arrivals ?? 0} · Departures {log.departures ?? 0}
                  {log.meals_served ? ` · Meals: ${log.meals_served}` : ''}
                </p>
                {log.issues ? <p className="text-sm text-red-200">Issues: {log.issues}</p> : null}
                {log.notable_events ? (
                  <p className="text-sm text-slate-300">Events: {log.notable_events}</p>
                ) : null}
              </Card>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
