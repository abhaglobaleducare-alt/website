'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card } from '../ui/card';
import { getLeadStatusLabel, leadStatusClasses } from '../../lib/constants/leads';

interface FollowUpLead {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  lead_status?: string | null;
  follow_up_date?: string | null;
}

const closedStatuses = ['converted', 'lost', 'not_interested'];

export function FollowUpReminders() {
  const [leads, setLeads] = useState<FollowUpLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/leads?scope=staff', { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => setLeads(json.leads ?? []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const dueLeads = useMemo(() => {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return leads
      .filter(
        (lead) =>
          lead.follow_up_date &&
          new Date(lead.follow_up_date) <= endOfToday &&
          !closedStatuses.includes(lead.lead_status ?? ''),
      )
      .sort(
        (a, b) =>
          new Date(a.follow_up_date ?? 0).getTime() - new Date(b.follow_up_date ?? 0).getTime(),
      );
  }, [leads]);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-saffron">Follow-ups due</p>
          <h2 className="mt-1 text-2xl font-semibold">{dueLeads.length} leads to follow up</h2>
        </div>
        <Link href="/staff/leads" className="text-sm font-semibold text-saffron hover:underline">
          View all
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading follow-ups…</p>
      ) : dueLeads.length === 0 ? (
        <p className="text-sm text-slate-300">
          No follow-ups due today. You&apos;re all caught up.
        </p>
      ) : (
        <ul className="divide-y divide-white/5">
          {dueLeads.slice(0, 6).map((lead) => {
            const status = (lead.lead_status ?? 'new') as keyof typeof leadStatusClasses;
            const dueDate = lead.follow_up_date ? new Date(lead.follow_up_date) : null;
            const isOverdue = dueDate ? dueDate < new Date(new Date().setHours(0, 0, 0, 0)) : false;

            return (
              <li key={lead.id} className="py-3">
                <Link
                  href={`/staff/leads/${lead.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 hover:opacity-80"
                >
                  <div>
                    <p className="font-semibold">{lead.full_name ?? 'Unnamed lead'}</p>
                    <p className="text-sm text-slate-400">{lead.phone ?? 'No phone'}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${leadStatusClasses[status]}`}
                    >
                      {getLeadStatusLabel(lead.lead_status ?? 'new')}
                    </span>
                    {dueDate && (
                      <span className={isOverdue ? 'font-semibold text-red-400' : 'text-slate-400'}>
                        {isOverdue ? '⚠ ' : ''}
                        {format(dueDate, 'MMM d')}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
