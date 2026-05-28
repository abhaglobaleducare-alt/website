'use client';

import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/card';

interface AttendanceRecord {
  id: string;
  date: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
  work_hours?: number | null;
  is_within_geofence?: boolean | null;
  check_in_address?: string | null;
}

export default function StaffAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    fetch('/api/attendance?scope=today')
      .then((res) => res.json())
      .then((json) => setRecords(json.attendance ?? []))
      .catch(() => setRecords([]));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-saffron">Attendance history</p>
          <h1 className="mt-2 text-3xl font-semibold">My attendance</h1>
          <p className="mt-2 text-slate-300">
            Calendar-like view of current and recent attendance records.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-slate-300">Present days</p>
            <p className="mt-2 text-3xl font-semibold">{records.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-300">Average work hours</p>
            <p className="mt-2 text-3xl font-semibold">
              {records.length
                ? (
                    records.reduce((sum, item) => sum + (item.work_hours ?? 0), 0) / records.length
                  ).toFixed(1)
                : '0.0'}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-slate-300">Geo-fence status</p>
            <p className="mt-2 text-3xl font-semibold">
              {records.some((item) => item.is_within_geofence) ? 'On-site' : 'Pending'}
            </p>
          </Card>
        </section>

        <Card>
          <h2 className="text-xl font-semibold">Recent visits</h2>
          <div className="mt-4 space-y-3">
            {records.map((record) => (
              <article
                key={record.id}
                className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong>{record.date}</strong>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
                    {record.is_within_geofence ? 'Within geofence' : 'Outside geofence'}
                  </span>
                </div>
                <p className="mt-2 text-slate-300">Check-in: {record.check_in_time ?? '—'}</p>
                <p className="text-slate-300">Check-out: {record.check_out_time ?? '—'}</p>
                <p className="text-slate-300">Work hours: {record.work_hours ?? 0}</p>
                <p className="text-slate-300">
                  Location: {record.check_in_address ?? 'Current location'}
                </p>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
