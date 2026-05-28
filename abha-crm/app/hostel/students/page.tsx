'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { feeStatusClasses, titleCase } from '../../../lib/constants/hostel';

interface HostelStudent {
  id: string;
  full_name?: string | null;
  student_code?: string | null;
  phone?: string | null;
  selected_university?: string | null;
  selected_country?: string | null;
  funnel_stage?: string | null;
  room_number?: string | null;
  check_in_date?: string | null;
  fee_status: string;
}

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-saffron';

export default function HostelStudentsPage() {
  const [students, setStudents] = useState<HostelStudent[]>([]);
  const [search, setSearch] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [feeFilter, setFeeFilter] = useState('');
  const [uniFilter, setUniFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/hostel/students')
      .then((res) => res.json())
      .then((json) => setStudents(json.students ?? []))
      .catch(() => setStudents([]));
  }, []);

  const rooms = useMemo(
    () => Array.from(new Set(students.map((s) => s.room_number).filter(Boolean))) as string[],
    [students],
  );
  const universities = useMemo(
    () =>
      Array.from(new Set(students.map((s) => s.selected_university).filter(Boolean))) as string[],
    [students],
  );

  const visible = students.filter(
    (student) =>
      (!search || (student.full_name ?? '').toLowerCase().includes(search.toLowerCase())) &&
      (!roomFilter || student.room_number === roomFilter) &&
      (!feeFilter || student.fee_status === feeFilter) &&
      (!uniFilter || student.selected_university === uniFilter),
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Students</p>
            <h1 className="mt-2 text-3xl font-semibold">Hostel students</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Students who have reached Flying / Departure (Stage 11) onward.
            </p>
          </div>
          <Link href="/hostel/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </header>

        <Card>
          <div className="grid gap-3 md:grid-cols-4">
            <label className="space-y-2 text-sm text-slate-200" htmlFor="search">
              Search
              <Input
                id="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Student name"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="room">
              Room
              <select
                id="room"
                value={roomFilter}
                onChange={(event) => setRoomFilter(event.target.value)}
                className={selectClass}
              >
                <option value="">All rooms</option>
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    Room {room}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="fee">
              Fee status
              <select
                id="fee"
                value={feeFilter}
                onChange={(event) => setFeeFilter(event.target.value)}
                className={selectClass}
              >
                <option value="">All fee statuses</option>
                {['paid', 'pending', 'overdue', 'none'].map((status) => (
                  <option key={status} value={status}>
                    {titleCase(status)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="uni">
              University
              <select
                id="uni"
                value={uniFilter}
                onChange={(event) => setUniFilter(event.target.value)}
                className={selectClass}
              >
                <option value="">All universities</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <section className="grid gap-3">
          {visible.length === 0 ? (
            <Card>
              <p className="text-slate-300">No hostel students match the filters.</p>
            </Card>
          ) : (
            visible.map((student) => (
              <Card key={student.id} className="transition hover:bg-slate-900/95">
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === student.id ? null : student.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-4 text-left"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{student.full_name ?? 'Unnamed'}</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {student.student_code ?? '—'} ·{' '}
                      {student.room_number ? `Room ${student.room_number}` : 'No room'} ·{' '}
                      {student.selected_university ?? 'University TBD'}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${feeStatusClasses[student.fee_status] ?? 'bg-slate-500/15 text-slate-300'}`}
                  >
                    {titleCase(student.fee_status)} fees
                  </span>
                </button>

                {expanded === student.id ? (
                  <div className="mt-4 grid gap-3 border-t border-white/5 pt-4 md:grid-cols-2">
                    <Detail label="Phone" value={student.phone} />
                    <Detail label="Country" value={student.selected_country} />
                    <Detail label="Check-in date" value={student.check_in_date} />
                    <Detail label="Funnel stage" value={student.funnel_stage} />
                    <div className="flex gap-3 md:col-span-2">
                      <Link href="/hostel/fees">
                        <Button size="sm" variant="ghost">
                          View fees
                        </Button>
                      </Link>
                      <Link href="/hostel/agest">
                        <Button size="sm" variant="ghost">
                          AGEST
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : null}
              </Card>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 font-semibold">{value ?? '—'}</p>
    </div>
  );
}
