'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { offices, roles } from '../../../../lib/constants/staff';

export default function NewStaffPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      full_name: String(formData.get('full_name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      designation: String(formData.get('designation') ?? ''),
      office_id: String(formData.get('office') ?? ''),
      role: String(formData.get('role') ?? 'staff'),
      base_salary: Number(formData.get('salary') ?? 0),
      bonus_type: String(formData.get('bonus_type') ?? 'none'),
      is_bonus_eligible: String(formData.get('bonus_type') ?? 'none') !== 'none',
    };

    const response = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    setStatus(json.message ?? (json.ok ? 'Invite created.' : 'Invite failed.'));
    setLoading(false);
  }
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Phase 3</p>
            <h1 className="mt-2 text-3xl font-semibold">Create New Staff</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Capture the staff profile, assign the right role, and generate the invite link for
              onboarding.
            </p>
          </div>
          <Link href="/admin/staff">
            <Button variant="ghost">Back to staff list</Button>
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <h2 className="text-xl font-semibold">Staff details</h2>
            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label htmlFor="fullName" className="space-y-2 text-sm text-slate-200">
                  Full name
                  <Input id="fullName" name="full_name" placeholder="Asha Deshmukh" required />
                </label>
                <label htmlFor="email" className="space-y-2 text-sm text-slate-200">
                  Email
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="asha@abhaedu.in"
                    required
                  />
                </label>
                <label htmlFor="phone" className="space-y-2 text-sm text-slate-200">
                  Phone
                  <Input id="phone" name="phone" placeholder="+91 9876543210" />
                </label>
                <label htmlFor="designation" className="space-y-2 text-sm text-slate-200">
                  Designation
                  <Input id="designation" name="designation" placeholder="Admissions Lead" />
                </label>
                <label htmlFor="office" className="space-y-2 text-sm text-slate-200">
                  Office
                  <select
                    id="office"
                    name="office"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                  >
                    {offices.map((office) => (
                      <option key={office.id} value={office.id}>
                        {office.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label htmlFor="role" className="space-y-2 text-sm text-slate-200">
                  Role
                  <select
                    id="role"
                    name="role"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                  >
                    {roles.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </label>
                <label htmlFor="salary" className="space-y-2 text-sm text-slate-200">
                  Salary
                  <Input id="salary" name="salary" type="number" placeholder="420000" />
                </label>
                <label htmlFor="bonus_type" className="space-y-2 text-sm text-slate-200">
                  Bonus scheme
                  <select
                    id="bonus_type"
                    name="bonus_type"
                    defaultValue="none"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                  >
                    <option value="none">Not bonus eligible</option>
                    <option value="admission">Per-admission (slab-based)</option>
                    <option value="reference_distribution">
                      Reference distribution (director)
                    </option>
                  </select>
                </label>
                <div className="md:col-span-2 mt-6 flex flex-wrap gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Save and invite'}
                  </Button>
                  <Button type="button" variant="ghost">
                    Draft later
                  </Button>
                </div>
                {status ? (
                  <p className="md:col-span-2 mt-2 text-sm text-emerald-200">{status}</p>
                ) : null}
              </div>
            </form>
          </Card>

          <Card className="h-fit">
            <h2 className="text-xl font-semibold">Invite preview</h2>
            <p className="mt-3 text-sm text-slate-300">
              This flow will generate an onboarding token, attach the staff email, and send the
              invite through the Resend/Brevo integration when SMTP keys are enabled.
            </p>
            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              <p className="font-semibold">Invite link</p>
              <p className="mt-2 break-all text-emerald-50">/auth/invite/demo-token-2026</p>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li>• Auto-create staff profile</li>
              <li>• Trigger invite email</li>
              <li>• Mark status as Invite Sent</li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}
