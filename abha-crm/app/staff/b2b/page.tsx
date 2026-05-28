'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import {
  partnerTypes,
  partnerStatuses,
  partnerStatusClasses,
  partnerTypeLabel,
  titleCase,
  type PartnerStatus,
} from '../../../lib/constants/b2b';

interface Partner {
  id: string;
  partner_name: string;
  partner_type?: string | null;
  contact_person?: string | null;
  contact_phone?: string | null;
  city?: string | null;
  commission_percent?: number | null;
  status?: PartnerStatus | null;
  referrals?: number;
  conversions?: number;
  conversionRate?: number;
}

export default function StaffB2BPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    params.set('withStats', '1');
    if (search) params.set('search', search);
    if (typeFilter) params.set('type', typeFilter);
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/b2b-partners?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => setPartners(json.partners ?? []))
      .catch(() => setPartners([]));

    return () => controller.abort();
  }, [search, typeFilter, statusFilter]);

  const selectClass =
    'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30';

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">B2B Partners</p>
            <h1 className="mt-2 text-3xl font-semibold">Referral partners</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Coaching classes, consultants, and agents who refer students — with live referral and
              conversion tracking.
            </p>
          </div>
          <Link href="/staff/b2b/new">
            <Button>Add partner</Button>
          </Link>
        </header>

        <Card>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-200" htmlFor="search">
              Search
              <Input
                id="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Partner or contact name"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="type">
              Type
              <select
                id="type"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className={selectClass}
              >
                <option value="">All types</option>
                {partnerTypes.map((type) => (
                  <option key={type} value={type}>
                    {partnerTypeLabel(type)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="status">
              Status
              <select
                id="status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={selectClass}
              >
                <option value="">All statuses</option>
                {partnerStatuses.map((value) => (
                  <option key={value} value={value}>
                    {titleCase(value)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <section className="grid gap-4">
          {partners.length === 0 ? (
            <Card>
              <p className="text-slate-300">No partners match your filters yet.</p>
            </Card>
          ) : (
            partners.map((partner) => {
              const status = (partner.status ?? 'active') as PartnerStatus;
              return (
                <Link key={partner.id} href={`/staff/b2b/${partner.id}`}>
                  <Card className="transition hover:bg-slate-900/95">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold">{partner.partner_name}</h2>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${partnerStatusClasses[status]}`}
                          >
                            {titleCase(status)}
                          </span>
                          {partner.partner_type ? (
                            <span className="text-xs text-slate-400">
                              {partnerTypeLabel(partner.partner_type)}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-300">
                          {partner.contact_person ?? 'No contact'} ·{' '}
                          {partner.contact_phone ?? 'No phone'}
                          {partner.city ? ` · ${partner.city}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-6 text-right text-sm">
                        <div>
                          <p className="text-xs text-slate-400">Referrals</p>
                          <p className="text-lg font-semibold">{partner.referrals ?? 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Conversions</p>
                          <p className="text-lg font-semibold">{partner.conversions ?? 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Commission</p>
                          <p className="text-lg font-semibold">
                            {partner.commission_percent ?? 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
