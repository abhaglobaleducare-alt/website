'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { agestStatusClasses, titleCase, usd } from '../../../lib/constants/hostel';

interface Disbursement {
  id: string;
  student_id: string;
  year_number?: number | null;
  amount_usd?: number | null;
  status?: string | null;
  disbursed_date?: string | null;
  proof_url?: string | null;
  student?: { id: string; full_name?: string | null; student_code?: string | null } | null;
}

export default function HostelAgestPage() {
  const [rows, setRows] = useState<Disbursement[]>([]);
  const [totals, setTotals] = useState({ disbursed: 0, pending: 0 });

  const load = () => {
    fetch('/api/hostel/agest')
      .then((res) => res.json())
      .then((json) => {
        setRows(json.disbursements ?? []);
        setTotals(json.totals ?? { disbursed: 0, pending: 0 });
      })
      .catch(() => setRows([]));
  };

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, { name: string; code: string; rows: Disbursement[] }>();
    rows.forEach((row) => {
      const entry = map.get(row.student_id) ?? {
        name: row.student?.full_name ?? 'Student',
        code: row.student?.student_code ?? '',
        rows: [],
      };
      entry.rows.push(row);
      map.set(row.student_id, entry);
    });
    return Array.from(map.values());
  }, [rows]);

  const act = async (id: string, action: string, extra: Record<string, unknown> = {}) => {
    await fetch(`/api/hostel/agest/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...extra }),
    });
    load();
  };

  const uploadProof = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    if (json.ok) {
      await act(id, '', { proof_url: json.url });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · AGEST</p>
            <h1 className="mt-2 text-3xl font-semibold">AGEST disbursement</h1>
            <p className="mt-2 text-slate-300">Year-wise $1,000 disbursement per student.</p>
          </div>
          <Link href="/hostel/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </header>

        <section className="grid gap-3 md:grid-cols-2">
          <Card>
            <p className="text-sm text-slate-400">Total disbursed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{usd(totals.disbursed)}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Pending / scheduled</p>
            <p className="mt-2 text-3xl font-bold text-amber-200">{usd(totals.pending)}</p>
          </Card>
        </section>

        <section className="grid gap-3">
          {grouped.length === 0 ? (
            <Card>
              <p className="text-slate-300">No disbursements found.</p>
            </Card>
          ) : (
            grouped.map((group) => (
              <Card key={group.name + group.code} className="space-y-3">
                <h2 className="text-lg font-semibold">
                  {group.name}
                  {group.code ? (
                    <span className="ml-2 text-sm text-slate-400">{group.code}</span>
                  ) : null}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-white/10 text-left text-slate-400">
                      <tr>
                        <th className="px-2 py-2">Year</th>
                        <th className="px-2 py-2">Amount</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Proof</th>
                        <th className="px-2 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows
                        .sort((a, b) => (a.year_number ?? 0) - (b.year_number ?? 0))
                        .map((row) => (
                          <tr key={row.id} className="border-b border-white/5">
                            <td className="px-2 py-2">Year {row.year_number}</td>
                            <td className="px-2 py-2">{usd(row.amount_usd ?? 0)}</td>
                            <td className="px-2 py-2">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${agestStatusClasses[row.status ?? 'scheduled']}`}
                              >
                                {titleCase(row.status ?? 'scheduled')}
                              </span>
                            </td>
                            <td className="px-2 py-2">
                              {row.proof_url ? (
                                <a
                                  href={row.proof_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-saffron hover:underline"
                                >
                                  View
                                </a>
                              ) : (
                                <label className="cursor-pointer text-xs text-saffron hover:underline">
                                  Upload
                                  <input
                                    type="file"
                                    className="sr-only"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0];
                                      if (file) uploadProof(row.id, file);
                                    }}
                                  />
                                </label>
                              )}
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex gap-2">
                                {row.status !== 'disbursed' ? (
                                  <Button size="sm" onClick={() => act(row.id, 'disburse')}>
                                    Approve &amp; disburse
                                  </Button>
                                ) : null}
                                {row.status !== 'hold' && row.status !== 'disbursed' ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => act(row.id, 'hold')}
                                  >
                                    Hold
                                  </Button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
