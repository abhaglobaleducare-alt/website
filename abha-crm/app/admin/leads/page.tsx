'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import {
  leadStatuses,
  leadSources,
  leadStatusClasses,
  getLeadStatusLabel,
  getLeadSourceLabel,
} from '../../../lib/constants/leads';
import { offices } from '../../../lib/constants/staff';

interface Lead {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  lead_status?: string | null;
  lead_source?: string | null;
  office_id?: string | null;
  assigned_staff_id?: string | null;
  created_at?: string | null;
  converted_to_student_id?: string | null;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    params.set('scope', 'admin');
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (sourceFilter) params.set('source', sourceFilter);
    if (officeFilter) params.set('office_id', officeFilter);

    fetch(`/api/leads?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => setLeads(json.leads ?? []))
      .catch(() => setLeads([]));

    return () => controller.abort();
  }, [search, statusFilter, sourceFilter, officeFilter]);

  const downloadCSV = () => {
    const headers = [
      'Name',
      'Phone',
      'Email',
      'City',
      'State',
      'Status',
      'Source',
      'NEET Score',
      'NEET Year',
      'Office',
      'Created',
    ];

    const rows = leads.map((lead) => [
      lead.full_name ?? '',
      lead.phone ?? '',
      lead.email ?? '',
      '',
      '',
      getLeadStatusLabel(lead.lead_status ?? 'new'),
      getLeadSourceLabel(lead.lead_source ?? 'other'),
      '',
      '',
      offices.find((o) => o.id === lead.office_id)?.name ?? '',
      lead.created_at ? format(new Date(lead.created_at), 'MMM d, yyyy') : '',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `leads_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const convertedCount = leads.filter((l) => l.converted_to_student_id).length;
  const conversionRate =
    leads.length > 0 ? ((convertedCount / leads.length) * 100).toFixed(1) : '0';

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Lead Management</p>
            <h1 className="mt-2 text-3xl font-semibold">All leads</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Monitor all leads across offices and track conversion metrics.
            </p>
          </div>
          <Button onClick={downloadCSV}>Download CSV</Button>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-slate-400">Total leads</p>
            <p className="mt-2 text-3xl font-bold">{leads.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Converted</p>
            <p className="mt-2 text-3xl font-bold">{convertedCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Conversion rate</p>
            <p className="mt-2 text-3xl font-bold">{conversionRate}%</p>
          </Card>
        </div>

        <Card>
          <div className="grid gap-4 md:grid-cols-5">
            <label className="space-y-2 text-sm text-slate-200" htmlFor="search">
              Search
              <Input
                id="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name or phone"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="office">
              Office
              <select
                id="office"
                value={officeFilter}
                onChange={(event) => setOfficeFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="">All offices</option>
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name}
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
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="">All statuses</option>
                {leadStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getLeadStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="source">
              Source
              <select
                id="source"
                value={sourceFilter}
                onChange={(event) => setSourceFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30"
              >
                <option value="">All sources</option>
                {leadSources.map((source) => (
                  <option key={source} value={source}>
                    {getLeadSourceLabel(source)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <section className="grid gap-4">
          {leads.length === 0 ? (
            <Card>
              <p className="text-slate-300">No leads found.</p>
            </Card>
          ) : (
            leads.map((lead) => {
              const status = (lead.lead_status ?? 'new') as keyof typeof leadStatusClasses;

              return (
                <Card key={lead.id} className="transition hover:bg-slate-900/95">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{lead.full_name ?? 'Unnamed'}</h2>
                      <p className="mt-1 text-sm text-slate-300">
                        {lead.phone ?? 'No phone'} · {lead.email ?? 'No email'}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            leadStatusClasses[status]
                          }`}
                        >
                          {getLeadStatusLabel(lead.lead_status ?? 'new')}
                        </span>
                        <span className="text-xs text-slate-400">
                          {getLeadSourceLabel(lead.lead_source ?? 'other')}
                        </span>
                        {lead.converted_to_student_id && (
                          <span className="text-xs text-emerald-400">✓ Converted</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-sm text-slate-400">
                      {lead.created_at && <p>{format(new Date(lead.created_at), 'MMM d, yyyy')}</p>}
                      {lead.office_id && (
                        <p className="mt-1">{offices.find((o) => o.id === lead.office_id)?.name}</p>
                      )}
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
