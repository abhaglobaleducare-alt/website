'use client';

import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/card';

interface AttendanceRecord {
  id: string;
  date: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
  check_in_address?: string | null;
  work_hours?: number | null;
  is_within_geofence?: boolean | null;
  user_id?: string | null;
  users?: { full_name?: string | null; role?: string | null }[];
}

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [staff, setStaff] = useState<{ id: string; full_name: string }[]>([]);

  useEffect(() => {
    fetch('/api/attendance?scope=today')
      .then((res) => res.json())
      .then((json) => setRecords(json.attendance ?? []))
      .catch(() => setRecords([]));

    fetch('/api/staff')
      .then((res) => res.json())
      .then((json) => setStaff((json.staff ?? []) as { id: string; full_name: string }[]))
      .catch(() => setStaff([]));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-saffron">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold"> Today’s attendance</h1>
          <p className="mt-2 text-slate-300">
            Live view of staff check-ins, location confidence, and daily work hours.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-sm text-slate-300">Present now</p>
            <p className="mt-2 text-3xl font-semibold">{records.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-300">Geo-fenced arrivals</p>
            <p className="mt-2 text-3xl font-semibold">
              {records.filter((item) => item.is_within_geofence).length}
            </p>
          </Card>
        </section>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Today’s attendance table</h2>
            <button className="rounded-full border border-saffron/40 bg-saffron/10 px-4 py-2 text-sm text-saffron">
              Export
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead>
                <tr className="border-b border-white/10 text-slate-300">
                  <th className="py-3 pr-4">Staff</th>
                  <th className="py-3 pr-4">Check-in</th>
                  <th className="py-3 pr-4">Location</th>
                  <th className="py-3 pr-4">Check-out</th>
                  <th className="py-3 pr-4">Hours</th>
                  <th className="py-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item) => (
                  <tr key={item.id} className="border-b border-white/5">
                    <td className="py-3 pr-4">{item.users?.[0]?.full_name ?? 'Unknown staff'}</td>
                    <td className="py-3 pr-4">{item.check_in_time ?? '—'}</td>
                    <td className="py-3 pr-4">{item.check_in_address ?? 'N/A'}</td>
                    <td className="py-3 pr-4">{item.check_out_time ?? '—'}</td>
                    <td className="py-3 pr-4">{item.work_hours ?? 0}</td>
                    <td className="py-3 pr-4">{item.is_within_geofence ? 'Inside' : 'Outside'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Absent staff today</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            {staff
              .filter((member) => !records.some((record) => record.user_id === member.id))
              .map((member) => (
                <li
                  key={member.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-3"
                >
                  {member.full_name}
                </li>
              ))}
          </ul>
        </Card>
      </div>
    </main>
  );
}
