'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

interface StaffMember {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: string;
  designation?: string | null;
  office_id?: string | null;
  status?: string | null;
  base_salary?: number | null;
  is_bonus_eligible?: boolean | null;
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    fetch('/api/staff')
      .then((res) => res.json())
      .then((json) => setStaff(json.staff ?? []))
      .catch(() => setStaff([]));
  }, []);
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Phase 3</p>
            <h1 className="mt-2 text-3xl font-semibold">Staff management</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Review the current roster, create new staff, and keep invite status under control from
              one screen.
            </p>
          </div>
          <Link href="/admin/staff/new">
            <Button>Create new staff</Button>
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-slate-300">Total active staff</p>
            <p className="mt-2 text-3xl font-semibold">{staff.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-300">Invite sent</p>
            <p className="mt-2 text-3xl font-semibold">
              {staff.filter((item) => item.status === 'pending_invite').length}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-slate-300">Bonus eligible</p>
            <p className="mt-2 text-3xl font-semibold">
              {staff.filter((item) => Boolean(item.is_bonus_eligible)).length}
            </p>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h2 className="text-xl font-semibold">Quick filters</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <p className="rounded-2xl border border-white/10 bg-white/5 p-3">All staff</p>
              <p className="rounded-2xl border border-white/10 bg-white/5 p-3">Active</p>
              <p className="rounded-2xl border border-white/10 bg-white/5 p-3">Invite pending</p>
              <p className="rounded-2xl border border-white/10 bg-white/5 p-3">Bonus eligible</p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Current roster</h2>
              <span className="rounded-full border border-saffron/40 bg-saffron/10 px-3 py-1 text-xs text-saffron">
                Pre-seeded
              </span>
            </div>
            <div className="mt-4 space-y-4">
              {staff.map((member) => (
                <article
                  key={member.id}
                  className="rounded-3xl border border-white/10 bg-slate-900/80 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{member.full_name}</h3>
                      <p className="text-sm text-slate-300">
                        {member.designation ?? 'Staff member'} • {member.role}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">{member.email}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                      {member.status ?? 'active'}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href={`/admin/staff/${member.id}`}>
                      <Button variant="ghost">View profile</Button>
                    </Link>
                    <Button variant="ghost">Send reminder</Button>
                    <Button variant="ghost">Edit</Button>
                  </div>
                </article>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
