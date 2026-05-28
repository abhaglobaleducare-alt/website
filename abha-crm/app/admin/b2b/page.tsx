'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { offices } from '../../../lib/constants/staff';
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
  commission_percent?: number | null;
  status?: PartnerStatus | null;
  office_id?: string | null;
  referrals?: number;
  conversions?: number;
  conversionRate?: number;
  commissionableFees?: number;
  estimatedCommission?: number;
}

const inr = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30';

export default function AdminB2BPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');

  const loadPartners = () => {
    const params = new URLSearchParams();
    params.set('withStats', '1');
    if (search) params.set('search', search);
    if (typeFilter) params.set('type', typeFilter);
    if (statusFilter) params.set('status', statusFilter);
    if (officeFilter) params.set('office_id', officeFilter);

    fetch(`/api/b2b-partners?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => setPartners(json.partners ?? []))
      .catch(() => setPartners([]));
  };

  useEffect(() => {
    loadPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, typeFilter, statusFilter, officeFilter]);

  const totals = useMemo(() => {
    return partners.reduce(
      (acc, partner) => {
        acc.referrals += partner.referrals ?? 0;
        acc.conversions += partner.conversions ?? 0;
        acc.commission += partner.estimatedCommission ?? 0;
        return acc;
      },
      { referrals: 0, conversions: 0, commission: 0 },
    );
  }, [partners]);

  const handleDelete = async (partner: Partner) => {
    if (
      !window.confirm(
        `Delete partner "${partner.partner_name}"? Linked records keep their data but lose the partner link.`,
      )
    ) {
      return;
    }
    const response = await fetch(`/api/b2b-partners/${partner.id}`, { method: 'DELETE' });
    const json = await response.json();
    if (json.ok) {
      setPartners((prev) => prev.filter((item) => item.id !== partner.id));
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">B2B Partners</p>
            <h1 className="mt-2 text-3xl font-semibold">Partner dashboard</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Monitor every referral partner, conversion performance, and commission exposure across
              offices.
            </p>
          </div>
          <Link href="/staff/b2b/new">
            <Button>Add partner</Button>
          </Link>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          <Card>
            <p className="text-sm text-slate-400">Partners</p>
            <p className="mt-2 text-3xl font-bold">{partners.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Total referrals</p>
            <p className="mt-2 text-3xl font-bold">{totals.referrals}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Total conversions</p>
            <p className="mt-2 text-3xl font-bold">{totals.conversions}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Est. commission</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{inr(totals.commission)}</p>
          </Card>
        </section>

        <Card>
          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2 text-sm text-slate-200" htmlFor="search">
              Search
              <Input
                id="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Partner or contact"
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
            <label className="space-y-2 text-sm text-slate-200" htmlFor="office">
              Office
              <select
                id="office"
                value={officeFilter}
                onChange={(event) => setOfficeFilter(event.target.value)}
                className={selectClass}
              >
                <option value="">All offices</option>
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <section className="grid gap-3">
          {partners.length === 0 ? (
            <Card>
              <p className="text-slate-300">No partners found.</p>
            </Card>
          ) : (
            partners.map((partner) => {
              const status = (partner.status ?? 'active') as PartnerStatus;
              return (
                <Card key={partner.id}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1">
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
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-right text-sm">
                      <div>
                        <p className="text-xs text-slate-400">Referrals</p>
                        <p className="font-semibold">{partner.referrals ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Conv.</p>
                        <p className="font-semibold">{partner.conversions ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Rate</p>
                        <p className="font-semibold">{partner.conversionRate ?? 0}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Commission</p>
                        <p className="font-semibold text-emerald-300">
                          {inr(partner.estimatedCommission ?? 0)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/staff/b2b/${partner.id}`}>
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </Link>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(partner)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
