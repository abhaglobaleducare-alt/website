'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import {
  roomTypes,
  roomStatuses,
  roomStatusClasses,
  titleCase,
  usd,
} from '../../../lib/constants/hostel';

interface Room {
  id: string;
  room_number: string;
  floor_number?: number | null;
  room_type?: string | null;
  capacity?: number | null;
  current_occupancy?: number | null;
  monthly_rent_usd?: number | null;
  status?: string | null;
  notes?: string | null;
}

interface Occupant {
  id: string;
  check_in_date?: string | null;
  monthly_fee_usd?: number | null;
  student?: { id: string; full_name?: string | null; student_code?: string | null } | null;
}

interface StudentOption {
  id: string;
  full_name?: string | null;
  room_number?: string | null;
}

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30';

export default function HostelRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [managing, setManaging] = useState<Room | null>(null);
  const [occupants, setOccupants] = useState<Occupant[]>([]);
  const [msg, setMsg] = useState('');

  const loadRooms = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/hostel/rooms?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => setRooms(json.rooms ?? []))
      .catch(() => setRooms([]));
  };

  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    fetch('/api/hostel/students')
      .then((res) => res.json())
      .then((json) => setStudents(json.students ?? []))
      .catch(() => setStudents([]));
  }, []);

  const openManage = async (room: Room) => {
    setManaging(room);
    setMsg('');
    const res = await fetch(`/api/hostel/rooms/${room.id}`);
    const json = await res.json();
    if (json.ok) {
      setManaging(json.room);
      setOccupants(json.occupants ?? []);
    }
  };

  const submitAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      room_number: String(formData.get('room_number') ?? '').trim(),
      floor_number: Number(formData.get('floor_number') ?? 0) || null,
      room_type: String(formData.get('room_type') ?? ''),
      capacity: Number(formData.get('capacity') ?? 1) || 1,
      monthly_rent_usd: Number(formData.get('monthly_rent_usd') ?? 0) || null,
      status: String(formData.get('status') ?? 'available'),
    };
    const res = await fetch('/api/hostel/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.ok) {
      setShowAdd(false);
      loadRooms();
    }
  };

  const submitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!managing) return;
    const formData = new FormData(event.currentTarget);
    const payload = {
      room_number: String(formData.get('room_number') ?? '').trim(),
      capacity: Number(formData.get('capacity') ?? 1) || 1,
      monthly_rent_usd: Number(formData.get('monthly_rent_usd') ?? 0) || null,
      status: String(formData.get('status') ?? 'available'),
      notes: String(formData.get('notes') ?? ''),
    };
    const res = await fetch(`/api/hostel/rooms/${managing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.ok) {
      setMsg('Room updated.');
      loadRooms();
    }
  };

  const submitAssign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!managing) return;
    const formData = new FormData(event.currentTarget);
    const payload = {
      room_id: managing.id,
      student_id: String(formData.get('student_id') ?? ''),
      check_in_date: String(formData.get('check_in_date') ?? ''),
      monthly_fee_usd: Number(formData.get('monthly_fee_usd') ?? 0) || null,
    };
    const res = await fetch('/api/hostel/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.ok) {
      setMsg('Student assigned.');
      openManage(managing);
      loadRooms();
    } else {
      setMsg(json.error ?? 'Assignment failed.');
    }
  };

  const checkout = async (assignmentId: string) => {
    const res = await fetch(`/api/hostel/assignments/${assignmentId}`, { method: 'PATCH' });
    const json = await res.json();
    if (json.ok && managing) {
      openManage(managing);
      loadRooms();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Rooms</p>
            <h1 className="mt-2 text-3xl font-semibold">Room management</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/hostel/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button onClick={() => setShowAdd(true)}>Add room</Button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${statusFilter === '' ? 'bg-saffron text-brand-900' : 'bg-white/5 text-slate-300'}`}
          >
            All
          </button>
          {roomStatuses.map((status) => (
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

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rooms.length === 0 ? (
            <Card>
              <p className="text-slate-300">No rooms yet.</p>
            </Card>
          ) : (
            rooms.map((room) => (
              <Card key={room.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Room {room.room_number}</h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${roomStatusClasses[room.status ?? 'available']}`}
                  >
                    {titleCase(room.status ?? 'available')}
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  {titleCase(room.room_type ?? '—')} · {room.current_occupancy ?? 0}/
                  {room.capacity ?? 1} occupied
                </p>
                <p className="text-sm text-slate-400">{usd(room.monthly_rent_usd ?? 0)} / month</p>
                <Button size="sm" variant="ghost" onClick={() => openManage(room)}>
                  Manage
                </Button>
              </Card>
            ))
          )}
        </section>
      </div>

      {showAdd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-soft">
            <h2 className="text-xl font-semibold">Add room</h2>
            <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submitAdd}>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="room_number">
                Room number
                <Input id="room_number" name="room_number" required />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="floor_number">
                Floor
                <Input id="floor_number" name="floor_number" type="number" />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="room_type">
                Type
                <select id="room_type" name="room_type" className={selectClass}>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {titleCase(type)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="capacity">
                Capacity
                <Input id="capacity" name="capacity" type="number" defaultValue={1} />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="monthly_rent_usd">
                Monthly rent (USD)
                <Input id="monthly_rent_usd" name="monthly_rent_usd" type="number" />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="status">
                Status
                <select id="status" name="status" defaultValue="available" className={selectClass}>
                  {roomStatuses.map((status) => (
                    <option key={status} value={status}>
                      {titleCase(status)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex justify-end gap-3 md:col-span-2">
                <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add room</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {managing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-8 w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Room {managing.room_number}</h2>
              <button
                type="button"
                onClick={() => setManaging(null)}
                className="rounded-full bg-white/5 px-2 text-slate-300 hover:bg-white/10"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {msg ? <p className="mt-2 text-sm text-emerald-200">{msg}</p> : null}

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-300">Current occupants</h3>
              {occupants.length === 0 ? (
                <p className="mt-2 text-sm text-slate-400">No active occupants.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {occupants.map((occupant) => (
                    <li
                      key={occupant.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-3 py-2 text-sm"
                    >
                      <span>
                        {occupant.student?.full_name ?? 'Student'}
                        {occupant.check_in_date ? ` · since ${occupant.check_in_date}` : ''}
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => checkout(occupant.id)}>
                        Check out
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={submitAssign}>
              <p className="text-sm font-semibold text-slate-300 md:col-span-2">Assign student</p>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="student_id">
                Student
                <select id="student_id" name="student_id" className={selectClass} required>
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.full_name}
                      {student.room_number ? ` (Room ${student.room_number})` : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="check_in_date">
                Check-in date
                <Input id="check_in_date" name="check_in_date" type="date" />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="monthly_fee_usd">
                Monthly fee (USD)
                <Input id="monthly_fee_usd" name="monthly_fee_usd" type="number" />
              </label>
              <div className="flex items-end">
                <Button type="submit" size="sm">
                  Assign
                </Button>
              </div>
            </form>

            <form className="mt-6 grid gap-3 md:grid-cols-2" onSubmit={submitEdit}>
              <p className="text-sm font-semibold text-slate-300 md:col-span-2">Edit room</p>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="edit_room_number">
                Room number
                <Input
                  id="edit_room_number"
                  name="room_number"
                  defaultValue={managing.room_number}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="edit_capacity">
                Capacity
                <Input
                  id="edit_capacity"
                  name="capacity"
                  type="number"
                  defaultValue={managing.capacity ?? 1}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="edit_rent">
                Monthly rent (USD)
                <Input
                  id="edit_rent"
                  name="monthly_rent_usd"
                  type="number"
                  defaultValue={managing.monthly_rent_usd ?? ''}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="edit_status">
                Status
                <select
                  id="edit_status"
                  name="status"
                  defaultValue={managing.status ?? 'available'}
                  className={selectClass}
                >
                  {roomStatuses.map((status) => (
                    <option key={status} value={status}>
                      {titleCase(status)}
                    </option>
                  ))}
                </select>
              </label>
              <label
                className="space-y-2 text-sm text-slate-200 md:col-span-2"
                htmlFor="edit_notes"
              >
                Notes
                <Input id="edit_notes" name="notes" defaultValue={managing.notes ?? ''} />
              </label>
              <div className="flex justify-end md:col-span-2">
                <Button type="submit" size="sm">
                  Save changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
