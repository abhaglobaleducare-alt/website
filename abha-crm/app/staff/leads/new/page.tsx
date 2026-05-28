'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import {
  leadSources,
  leadInterests,
  leadPreferredCountries,
  getLeadInterestLabel,
  getLeadSourceLabel,
} from '../../../../lib/constants/leads';

interface B2BPartner {
  id: string;
  partner_name?: string | null;
}

export default function NewLeadPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<B2BPartner[]>([]);

  useEffect(() => {
    fetch('/api/b2b-partners')
      .then((res) => res.json())
      .then((json) => setPartners(json.partners ?? []))
      .catch(() => setPartners([]));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      full_name: String(formData.get('full_name') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      parent_phone: String(formData.get('parent_phone') ?? ''),
      email: String(formData.get('email') ?? ''),
      city: String(formData.get('city') ?? ''),
      state: String(formData.get('state') ?? ''),
      neet_score: Number(formData.get('neet_score') ?? 0) || null,
      neet_year: Number(formData.get('neet_year') ?? 0) || null,
      interest: String(formData.get('interest') ?? ''),
      preferred_country: String(formData.get('preferred_country') ?? ''),
      lead_source: String(formData.get('lead_source') ?? 'walk-in'),
      follow_up_date: String(formData.get('follow_up_date') ?? ''),
      b2b_partner_id: String(formData.get('b2b_partner_id') ?? '') || null,
      notes: String(formData.get('notes') ?? ''),
    };

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    setLoading(false);

    if (json.ok) {
      setStatus('Lead created successfully. Redirecting...');
      window.setTimeout(() => {
        window.location.href = '/staff/leads';
      }, 1000);
    } else {
      setStatus(json.error ?? 'Could not create the lead.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Phase 6</p>
            <h1 className="mt-2 text-3xl font-semibold">New lead</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Capture lead information and assign to your funnel for follow-up and conversion.
            </p>
          </div>
          <Link href="/staff/leads">
            <Button variant="ghost">Back to leads</Button>
          </Link>
        </header>

        <Card>
          <h2 className="text-xl font-semibold">Lead entry form</h2>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="full_name">
              Full name
              <Input id="full_name" name="full_name" placeholder="Priya Patil" required />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="phone">
              Phone
              <Input id="phone" name="phone" type="tel" placeholder="+91 9876543210" required />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="parent_phone">
              Parent phone
              <Input
                id="parent_phone"
                name="parent_phone"
                type="tel"
                placeholder="+91 9876543211"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="email">
              Email
              <Input id="email" name="email" type="email" placeholder="lead@example.com" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="city">
              City
              <Input id="city" name="city" placeholder="Kolhapur" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="state">
              State
              <Input id="state" name="state" placeholder="Maharashtra" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="neet_score">
              NEET score
              <Input id="neet_score" name="neet_score" type="number" placeholder="450" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="neet_year">
              NEET year
              <Input id="neet_year" name="neet_year" type="number" placeholder="2026" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="interest">
              Interest
              <select
                id="interest"
                name="interest"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="">Select interest</option>
                {leadInterests.map((interest) => (
                  <option key={interest} value={interest}>
                    {getLeadInterestLabel(interest)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="preferred_country">
              Preferred country
              <select
                id="preferred_country"
                name="preferred_country"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="">Select country</option>
                {leadPreferredCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="lead_source">
              Lead source
              <select
                id="lead_source"
                name="lead_source"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                {leadSources.map((source) => (
                  <option key={source} value={source}>
                    {getLeadSourceLabel(source)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="follow_up_date">
              Follow-up date
              <Input id="follow_up_date" name="follow_up_date" type="date" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="b2b_partner_id">
              B2B Partner
              <select
                id="b2b_partner_id"
                name="b2b_partner_id"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="">No partner</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.partner_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="notes">
              Notes
              <textarea
                id="notes"
                name="notes"
                className="min-h-[100px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
                placeholder="Additional lead information..."
              />
            </label>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Create lead'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
