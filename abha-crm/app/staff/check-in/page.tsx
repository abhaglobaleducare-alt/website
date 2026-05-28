'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { parseISO, isToday } from 'date-fns';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { priorityClasses, titleCase, type GoalPriority } from '../../../lib/constants/goals';

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
  office_id?: string | null;
}

interface TodayGoal {
  id: string;
  title: string;
  priority: GoalPriority;
  status: string;
  due_date?: string | null;
}

const officeMap = {
  '11111111-1111-1111-1111-111111111111': {
    name: 'Kolhapur Office',
    lat: 16.705,
    lng: 74.2433,
    radius: 300,
  },
  '22222222-2222-2222-2222-222222222222': {
    name: 'Sambhajinagar Office',
    lat: 19.8762,
    lng: 75.3433,
    radius: 300,
  },
  '44444444-4444-4444-4444-444444444444': {
    name: 'Boisar Office',
    lat: 19.8039,
    lng: 72.7726,
    radius: 300,
  },
  '33333333-3333-3333-3333-333333333333': {
    name: 'Georgia Hostel',
    lat: 41.6941,
    lng: 44.8337,
    radius: 500,
  },
} as const;

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function StaffCheckinPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [selfieUrl, setSelfieUrl] = useState('');
  const [dailySummary, setDailySummary] = useState('');
  const [todayGoals, setTodayGoals] = useState<TodayGoal[]>([]);

  useEffect(() => {
    fetch('/api/staff')
      .then((res) => res.json())
      .then((json) => {
        const members = (json.staff ?? []) as StaffMember[];
        setStaff(members);
        setSelectedStaff(members[0] ?? null);
      })
      .catch(() => setStaff([]));
  }, []);

  useEffect(() => {
    if (!selectedStaff?.id) {
      setTodayGoals([]);
      return;
    }
    fetch(`/api/goals?scope=admin&staff_id=${selectedStaff.id}`)
      .then((res) => res.json())
      .then((json) => {
        const dueToday = ((json.goals ?? []) as TodayGoal[]).filter(
          (goal) =>
            goal.due_date &&
            isToday(parseISO(goal.due_date)) &&
            goal.status !== 'completed' &&
            goal.status !== 'cancelled',
        );
        setTodayGoals(dueToday);
      })
      .catch(() => setTodayGoals([]));
  }, [selectedStaff]);

  async function completeGoal(goalId: string) {
    const response = await fetch(`/api/goals/${goalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'completed',
        completion_notes: dailySummary.trim() || 'Completed at checkout.',
      }),
    });
    const json = await response.json();
    if (json.ok) {
      setTodayGoals((prev) =>
        prev.map((goal) => (goal.id === goalId ? { ...goal, status: 'completed' } : goal)),
      );
    }
  }

  const office = useMemo(() => {
    if (!selectedStaff?.office_id) return null;
    return officeMap[selectedStaff.office_id as keyof typeof officeMap] ?? null;
  }, [selectedStaff]);

  async function handleCheckIn() {
    if (!selectedStaff) return;
    setLoading(true);
    setStatus('Requesting location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const currentDistance = office
          ? haversineDistance(lat, lng, office.lat, office.lng)
          : Number.POSITIVE_INFINITY;
        setDistance(currentDistance);

        const isWithin = office ? currentDistance <= office.radius : false;
        const locationLabel = office?.name ?? 'Current location';

        try {
          const response = await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'checkin',
              user_id: selectedStaff.id,
              check_in_lat: lat,
              check_in_lng: lng,
              check_in_address: isWithin ? locationLabel : 'Current location',
              check_in_selfie_url: selfieUrl || null,
              is_within_geofence: isWithin,
            }),
          });
          const json = await response.json();
          setStatus(
            json.ok
              ? `Checked in at ${isWithin ? locationLabel : 'current location'} at ${new Date().toLocaleTimeString()}`
              : 'Check-in could not be saved.',
          );
          setCheckedIn(Boolean(json.ok));
        } catch {
          setStatus('Check-in failed.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setStatus('Location access was denied.');
        setLoading(false);
      },
      { enableHighAccuracy: true },
    );
  }

  async function handleCheckOut() {
    if (!selectedStaff) return;
    setLoading(true);

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'checkout',
          user_id: selectedStaff.id,
          daily_summary: dailySummary || 'Daily report submitted.',
        }),
      });
      const json = await response.json();
      setStatus(json.ok ? 'Checked out successfully.' : 'Checkout failed.');
      setCheckedOut(Boolean(json.ok));
    } catch {
      setStatus('Checkout failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSelfieUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await response.json();
    if (json.ok) {
      setSelfieUrl(json.url);
      setStatus('Selfie uploaded successfully.');
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-saffron">Geo attendance</p>
          <h1 className="mt-2 text-3xl font-semibold">Staff check-in</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Tap once to capture your current GPS location, confirm your office radius, and log your
            day.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <Card>
            <label className="text-sm text-slate-200">
              Staff member
              <select
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100"
                value={selectedStaff?.id ?? ''}
                onChange={(event) =>
                  setSelectedStaff(staff.find((member) => member.id === event.target.value) ?? null)
                }
              >
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name}
                  </option>
                ))}
              </select>
            </label>

            <Button
              className="mt-6 w-full rounded-3xl py-4 text-base"
              disabled={loading || checkedIn}
              onClick={handleCheckIn}
            >
              {loading ? 'Locating...' : checkedIn ? 'Checked in for today' : 'Check In'}
            </Button>

            {distance !== null ? (
              <p className="mt-4 rounded-2xl border border-saffron/30 bg-saffron/10 p-4 text-sm text-saffron-100">
                {office
                  ? `You are ${Math.round(distance)} meters from ${office.name}${distance <= office.radius ? '' : ' — outside the geofence.'}`
                  : 'Location captured.'}
              </p>
            ) : null}

            {checkedIn && !checkedOut ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-4">
                <label className="text-sm text-slate-200">
                  Daily summary
                  <textarea
                    value={dailySummary}
                    onChange={(event) => setDailySummary(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100"
                    placeholder="Describe today's completed goals and work summary"
                  />
                </label>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-saffron">
                    Today&apos;s goals
                  </p>
                  {todayGoals.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-400">No goals due today.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {todayGoals.map((goal) => {
                        const done = goal.status === 'completed';
                        return (
                          <li
                            key={goal.id}
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2"
                          >
                            <input
                              type="checkbox"
                              id={`goal-${goal.id}`}
                              checked={done}
                              disabled={done}
                              onChange={() => completeGoal(goal.id)}
                              className="h-4 w-4 accent-saffron"
                            />
                            <label
                              htmlFor={`goal-${goal.id}`}
                              className={`flex-1 text-sm ${done ? 'text-slate-500 line-through' : 'text-slate-100'}`}
                            >
                              {goal.title}
                            </label>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityClasses[goal.priority]}`}
                            >
                              {titleCase(goal.priority)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <Button
                  className="mt-4 w-full"
                  disabled={loading || checkedOut}
                  onClick={handleCheckOut}
                >
                  {loading ? 'Submitting...' : 'Check Out & Submit Daily Report'}
                </Button>
              </div>
            ) : null}

            <p className="mt-4 text-sm text-slate-300">{status}</p>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold">Optional selfie</h2>
            <p className="mt-2 text-sm text-slate-300">Capture a quick proof photo for the day.</p>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="mt-4 w-full text-sm text-slate-100"
              onChange={handleSelfieUpload}
            />
            {selfieUrl ? (
              <Image
                src={selfieUrl}
                alt="Selfie preview"
                width={400}
                height={400}
                className="mt-4 rounded-2xl"
              />
            ) : null}
          </Card>
        </div>
      </div>
    </main>
  );
}
