'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import {
  partnerTypes,
  partnerStatuses,
  partnerCountries,
  partnerTypeLabel,
  titleCase,
} from '../../../../lib/constants/b2b';

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30';

export default function NewPartnerPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      partner_name: String(formData.get('partner_name') ?? '').trim(),
      partner_type: String(formData.get('partner_type') ?? ''),
      contact_person: String(formData.get('contact_person') ?? '').trim(),
      contact_phone: String(formData.get('contact_phone') ?? '').trim(),
      contact_email: String(formData.get('contact_email') ?? '').trim(),
      city: String(formData.get('city') ?? '').trim(),
      state: String(formData.get('state') ?? '').trim(),
      address: String(formData.get('address') ?? '').trim(),
      commission_percent: Number(formData.get('commission_percent') ?? 0) || 0,
      preferred_country: String(formData.get('preferred_country') ?? ''),
      status: String(formData.get('status') ?? 'active'),
      notes: String(formData.get('notes') ?? '').trim(),
    };

    const response = await fetch('/api/b2b-partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    setLoading(false);

    if (json.ok) {
      setStatus('Partner added successfully. Redirecting…');
      window.setTimeout(() => {
        window.location.href = '/staff/b2b';
      }, 800);
    } else {
      setStatus(json.error ?? 'Could not add the partner.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">B2B Partners</p>
            <h1 className="mt-2 text-3xl font-semibold">New partner</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Register a referral partner — coaching class, consultant, agent, or school — to track
              leads and commissions.
            </p>
          </div>
          <Link href="/staff/b2b">
            <Button variant="ghost">Back to partners</Button>
          </Link>
        </header>

        <Card>
          <h2 className="text-xl font-semibold">Partner details</h2>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="partner_name">
              Partner name
              <Input id="partner_name" name="partner_name" placeholder="Sunrise Academy" required />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="partner_type">
              Partner type
              <select id="partner_type" name="partner_type" className={selectClass}>
                {partnerTypes.map((type) => (
                  <option key={type} value={type}>
                    {partnerTypeLabel(type)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="contact_person">
              Contact person
              <Input id="contact_person" name="contact_person" placeholder="Rohit Sharma" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="contact_phone">
              Contact phone
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                placeholder="+91 9876543210"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="contact_email">
              Contact email
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                placeholder="partner@example.com"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="commission_percent">
              Commission %
              <Input
                id="commission_percent"
                name="commission_percent"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="10"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="city">
              City
              <Input id="city" name="city" placeholder="Kolhapur" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="state">
              State
              <Input id="state" name="state" placeholder="Maharashtra" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="preferred_country">
              Preferred country
              <select id="preferred_country" name="preferred_country" className={selectClass}>
                <option value="">Select country</option>
                {partnerCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="status">
              Status
              <select id="status" name="status" defaultValue="active" className={selectClass}>
                {partnerStatuses.map((value) => (
                  <option key={value} value={value}>
                    {titleCase(value)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="address">
              Address
              <Input id="address" name="address" placeholder="Street, area, landmark" />
            </label>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="notes">
              Notes
              <textarea
                id="notes"
                name="notes"
                className="min-h-[90px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                placeholder="Agreement terms, history, anything useful."
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Add partner'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
