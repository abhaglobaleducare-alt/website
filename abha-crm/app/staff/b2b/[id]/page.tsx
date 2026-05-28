'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { partnerStatusClasses, partnerTypeLabel, titleCase } from '../../../../lib/constants/b2b';
import { getLeadStatusLabel, leadStatusClasses } from '../../../../lib/constants/leads';

interface Partner {
  id: string;
  partner_name: string;
  partner_type?: string | null;
  contact_person?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  commission_percent?: number | null;
  preferred_country?: string | null;
  status?: string | null;
  notes?: string | null;
}

interface LinkedStudent {
  id: string;
  student_code?: string | null;
  full_name?: string | null;
  phone?: string | null;
  funnel_stage?: string | null;
  selected_country?: string | null;
  created_at?: string | null;
}

interface LinkedLead {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  lead_status?: string | null;
  converted_to_student_id?: string | null;
  created_at?: string | null;
}

interface Stats {
  referrals: number;
  conversions: number;
  conversionRate: number;
  commissionableFees: number;
  estimatedCommission: number;
}

const inr = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

export default function PartnerDetailPage() {
  const params = useParams();
  const partnerId = params.id as string;
  const [partner, setPartner] = useState<Partner | null>(null);
  const [students, setStudents] = useState<LinkedStudent[]>([]);
  const [leads, setLeads] = useState<LinkedLead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/b2b-partners/${partnerId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) {
          setPartner(json.partner);
          setStudents(json.linkedStudents ?? []);
          setLeads(json.linkedLeads ?? []);
          setStats(json.stats ?? null);
        }
      })
      .catch(() => setPartner(null))
      .finally(() => setLoading(false));
  }, [partnerId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <Card>
          <p className="text-slate-300">Loading partner…</p>
        </Card>
      </main>
    );
  }

  if (!partner) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <Card>
          <p className="text-slate-300">Partner not found.</p>
        </Card>
      </main>
    );
  }

  const status = (partner.status ?? 'active') as keyof typeof partnerStatusClasses;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Partner</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold">{partner.partner_name}</h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${partnerStatusClasses[status]}`}
              >
                {titleCase(partner.status ?? 'active')}
              </span>
            </div>
            {partner.partner_type ? (
              <p className="mt-1 text-sm text-slate-400">
                {partnerTypeLabel(partner.partner_type)}
              </p>
            ) : null}
          </div>
          <Link href="/staff/b2b">
            <Button variant="ghost">Back to partners</Button>
          </Link>
        </header>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Card>
            <p className="text-xs text-slate-400">Referrals</p>
            <p className="mt-1 text-2xl font-bold">{stats?.referrals ?? 0}</p>
          </Card>
          <Card>
            <p className="text-xs text-slate-400">Conversions</p>
            <p className="mt-1 text-2xl font-bold">{stats?.conversions ?? 0}</p>
          </Card>
          <Card>
            <p className="text-xs text-slate-400">Conversion rate</p>
            <p className="mt-1 text-2xl font-bold">{stats?.conversionRate ?? 0}%</p>
          </Card>
          <Card>
            <p className="text-xs text-slate-400">Commissionable fees</p>
            <p className="mt-1 text-2xl font-bold">{inr(stats?.commissionableFees ?? 0)}</p>
          </Card>
          <Card>
            <p className="text-xs text-slate-400">
              Est. commission ({partner.commission_percent ?? 0}%)
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">
              {inr(stats?.estimatedCommission ?? 0)}
            </p>
          </Card>
        </section>

        <Card>
          <h2 className="text-xl font-semibold">Contact & details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Detail label="Contact person" value={partner.contact_person} />
            <Detail label="Phone" value={partner.contact_phone} />
            <Detail label="Email" value={partner.contact_email} />
            <Detail label="Preferred country" value={partner.preferred_country} />
            <Detail
              label="Location"
              value={[partner.city, partner.state].filter(Boolean).join(', ') || null}
            />
            <Detail label="Address" value={partner.address} />
          </div>
          {partner.notes ? (
            <div className="mt-4">
              <p className="text-sm text-slate-400">Notes</p>
              <p className="mt-2 rounded-2xl bg-slate-900/50 p-3 text-sm">{partner.notes}</p>
            </div>
          ) : null}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Converted students ({students.length})</h2>
          {students.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No students linked to this partner yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5">
              {students.map((student) => (
                <li key={student.id} className="py-3">
                  <Link
                    href={`/staff/students/${student.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 hover:opacity-80"
                  >
                    <div>
                      <p className="font-semibold">{student.full_name ?? 'Unnamed'}</p>
                      <p className="text-sm text-slate-400">
                        {student.student_code ?? '—'} · {student.phone ?? 'No phone'}
                      </p>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      <p>{student.funnel_stage ?? '—'}</p>
                      {student.selected_country ? <p>{student.selected_country}</p> : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Referred leads ({leads.length})</h2>
          {leads.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No leads referred by this partner yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5">
              {leads.map((lead) => {
                const leadStatus = (lead.lead_status ?? 'new') as keyof typeof leadStatusClasses;
                return (
                  <li
                    key={lead.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3"
                  >
                    <div>
                      <p className="font-semibold">{lead.full_name ?? 'Unnamed'}</p>
                      <p className="text-sm text-slate-400">{lead.phone ?? 'No phone'}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${leadStatusClasses[leadStatus]}`}
                      >
                        {getLeadStatusLabel(lead.lead_status ?? 'new')}
                      </span>
                      {lead.created_at ? (
                        <span className="text-slate-400">
                          {format(parseISO(lead.created_at), 'MMM d, yyyy')}
                        </span>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 font-semibold">{value ?? '—'}</p>
    </div>
  );
}
