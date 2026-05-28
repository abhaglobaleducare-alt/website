'use client';

import Link from 'next/link';
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

interface Lead {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  lead_status?: string | null;
  lead_source?: string | null;
  follow_up_date?: string | null;
  created_at?: string | null;
  converted_to_student_id?: string | null;
}

export default function StaffLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    params.set('scope', 'staff');
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (sourceFilter) params.set('source', sourceFilter);

    fetch(`/api/leads?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => setLeads(json.leads ?? []))
      .catch(() => setLeads([]));

    return () => controller.abort();
  }, [search, statusFilter, sourceFilter]);

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    setLoading(true);
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_status: newStatus }),
    });
    const json = await response.json();
    setLoading(false);

    if (json.ok) {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, lead_status: newStatus } : lead)),
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Lead Management</p>
            <h1 className="mt-2 text-3xl font-semibold">My leads</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Manage your lead funnel, track follow-ups, and convert qualified leads to students.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/staff/leads/upload">
              <Button variant="ghost">Upload Excel</Button>
            </Link>
            <Link href="/staff/leads/new">
              <Button>Add lead</Button>
            </Link>
          </div>
        </header>

        <Card>
          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2 text-sm text-slate-200" htmlFor="search">
              Search
              <Input
                id="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name or phone"
              />
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
              <p className="text-slate-300">No leads match your filters yet.</p>
            </Card>
          ) : (
            leads.map((lead) => {
              const status = (lead.lead_status ?? 'new') as keyof typeof leadStatusClasses;
              const isOverdue = lead.follow_up_date && new Date(lead.follow_up_date) < new Date();

              return (
                <Card key={lead.id} className="transition hover:bg-slate-900/95">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
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
                      </div>
                    </div>

                    <div className="space-y-2 text-right text-sm">
                      {lead.follow_up_date && (
                        <p className={isOverdue ? 'font-semibold text-red-400' : 'text-slate-400'}>
                          {isOverdue ? '⚠ ' : ''}
                          Follow-up: {format(new Date(lead.follow_up_date), 'MMM d')}
                        </p>
                      )}

                      <select
                        value={lead.lead_status ?? 'new'}
                        onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                        disabled={loading}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-2 py-1 text-xs text-slate-100 outline-none transition focus:border-saffron"
                      >
                        {leadStatuses.map((s) => (
                          <option key={s} value={s}>
                            {getLeadStatusLabel(s)}
                          </option>
                        ))}
                      </select>

                      {lead.lead_status === 'qualified' && !lead.converted_to_student_id ? (
                        <Link href={`/staff/leads/${lead.id}`}>
                          <Button size="sm" className="w-full">
                            Convert to Student
                          </Button>
                        </Link>
                      ) : null}
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
