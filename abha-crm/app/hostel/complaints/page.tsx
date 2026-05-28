'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import {
  complaintCategories,
  complaintPriorities,
  complaintStatuses,
  complaintPriorityClasses,
  complaintStatusClasses,
  titleCase,
} from '../../../lib/constants/hostel';

interface Complaint {
  id: string;
  complaint_title: string;
  complaint_description: string;
  category?: string | null;
  priority?: string | null;
  status?: string | null;
  resolution_notes?: string | null;
  raised_at?: string | null;
  student?: { full_name?: string | null } | null;
  room?: { room_number?: string | null } | null;
}

interface Option {
  id: string;
  full_name?: string | null;
  room_number?: string | null;
}

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30';

export default function HostelComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [students, setStudents] = useState<Option[]>([]);
  const [rooms, setRooms] = useState<Option[]>([]);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const load = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/hostel/complaints?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => setComplaints(json.complaints ?? []))
      .catch(() => setComplaints([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    fetch('/api/hostel/students')
      .then((res) => res.json())
      .then((json) => setStudents(json.students ?? []))
      .catch(() => setStudents([]));
    fetch('/api/hostel/rooms')
      .then((res) => res.json())
      .then((json) =>
        setRooms(
          (json.rooms ?? []).map((r: { id: string; room_number: string }) => ({
            id: r.id,
            room_number: r.room_number,
          })),
        ),
      )
      .catch(() => setRooms([]));
  }, []);

  const submitNew = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const res = await fetch('/api/hostel/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: String(formData.get('student_id') ?? '') || null,
        room_id: String(formData.get('room_id') ?? '') || null,
        category: String(formData.get('category') ?? 'other'),
        priority: String(formData.get('priority') ?? 'medium'),
        complaint_title: String(formData.get('complaint_title') ?? '').trim(),
        complaint_description: String(formData.get('complaint_description') ?? '').trim(),
      }),
    });
    const json = await res.json();
    if (json.ok) {
      form.reset();
      load();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/hostel/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, resolution_notes: notesDraft[id] }),
    });
    load();
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Complaints</p>
            <h1 className="mt-2 text-3xl font-semibold">Complaints</h1>
          </div>
          <Link href="/hostel/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </header>

        <Card>
          <h2 className="text-lg font-semibold">Log a complaint</h2>
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submitNew}>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="student_id">
              Student
              <select id="student_id" name="student_id" className={selectClass}>
                <option value="">— None —</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="room_id">
              Room
              <select id="room_id" name="room_id" className={selectClass}>
                <option value="">— None —</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.room_number}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="category">
              Category
              <select id="category" name="category" className={selectClass}>
                {complaintCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {titleCase(cat)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="priority">
              Priority
              <select id="priority" name="priority" defaultValue="medium" className={selectClass}>
                {complaintPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {titleCase(priority)}
                  </option>
                ))}
              </select>
            </label>
            <label
              className="space-y-2 text-sm text-slate-200 md:col-span-2"
              htmlFor="complaint_title"
            >
              Title
              <Input id="complaint_title" name="complaint_title" required />
            </label>
            <label
              className="space-y-2 text-sm text-slate-200 md:col-span-2"
              htmlFor="complaint_description"
            >
              Description
              <textarea
                id="complaint_description"
                name="complaint_description"
                required
                className="min-h-[80px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              />
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Log complaint</Button>
            </div>
          </form>
        </Card>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${statusFilter === '' ? 'bg-saffron text-brand-900' : 'bg-white/5 text-slate-300'}`}
          >
            All
          </button>
          {complaintStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${statusFilter === status ? 'bg-saffron text-brand-900' : 'bg-white/5 text-slate-300'}`}
            >
              {titleCase(status)}
            </button>
          ))}
        </div>

        <section className="grid gap-3">
          {complaints.length === 0 ? (
            <Card>
              <p className="text-slate-300">No complaints for this filter.</p>
            </Card>
          ) : (
            complaints.map((complaint) => (
              <Card key={complaint.id} className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{complaint.complaint_title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${complaintPriorityClasses[complaint.priority ?? 'medium']}`}
                      >
                        {titleCase(complaint.priority ?? 'medium')}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${complaintStatusClasses[complaint.status ?? 'open']}`}
                      >
                        {titleCase(complaint.status ?? 'open')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{complaint.complaint_description}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {titleCase(complaint.category ?? 'other')}
                      {complaint.student?.full_name ? ` · ${complaint.student.full_name}` : ''}
                      {complaint.room?.room_number ? ` · Room ${complaint.room.room_number}` : ''}
                      {complaint.raised_at
                        ? ` · ${format(parseISO(complaint.raised_at), 'MMM d, yyyy')}`
                        : ''}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                  <Input
                    placeholder="Resolution notes"
                    defaultValue={complaint.resolution_notes ?? ''}
                    onChange={(event) =>
                      setNotesDraft((prev) => ({ ...prev, [complaint.id]: event.target.value }))
                    }
                  />
                  <select
                    defaultValue={complaint.status ?? 'open'}
                    onChange={(event) => updateStatus(complaint.id, event.target.value)}
                    className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-saffron"
                  >
                    {complaintStatuses.map((status) => (
                      <option key={status} value={status}>
                        {titleCase(status)}
                      </option>
                    ))}
                  </select>
                </div>
              </Card>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
