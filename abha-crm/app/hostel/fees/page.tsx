'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { feeStatusClasses, titleCase, usd } from '../../../lib/constants/hostel';

interface Fee {
  id: string;
  student_id: string;
  year_number?: number | null;
  total_amount?: number | null;
  paid_amount?: number | null;
  pending_amount?: number | null;
  currency?: string | null;
  due_date?: string | null;
  status?: string | null;
  receipt_url?: string | null;
  student?: { id: string; full_name?: string | null; student_code?: string | null } | null;
}

interface StudentOption {
  id: string;
  full_name?: string | null;
}

export default function HostelFeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [msg, setMsg] = useState('');

  const load = () => {
    const params = new URLSearchParams();
    if (pendingOnly) params.set('pending', '1');
    fetch(`/api/hostel/fees?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setFees(json.fees ?? []);
        setPendingAmount(json.pendingAmount ?? 0);
      })
      .catch(() => setFees([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingOnly]);

  useEffect(() => {
    fetch('/api/hostel/students')
      .then((res) => res.json())
      .then((json) => setStudents(json.students ?? []))
      .catch(() => setStudents([]));
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, { name: string; code: string; rows: Fee[] }>();
    fees.forEach((fee) => {
      const key = fee.student_id;
      const entry = map.get(key) ?? {
        name: fee.student?.full_name ?? 'Student',
        code: fee.student?.student_code ?? '',
        rows: [],
      };
      entry.rows.push(fee);
      map.set(key, entry);
    });
    return Array.from(map.values());
  }, [fees]);

  const confirmPayment = async (id: string) => {
    const res = await fetch(`/api/hostel/fees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'confirm' }),
    });
    const json = await res.json();
    if (json.ok) load();
  };

  const uploadReceipt = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
    const uploadJson = await uploadRes.json();
    if (!uploadJson.ok) return;
    await fetch(`/api/hostel/fees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receipt_url: uploadJson.url }),
    });
    setMsg('Receipt uploaded.');
    load();
  };

  const generateSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMsg('');
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/hostel/fees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: String(formData.get('student_id') ?? ''),
        annual_amount: Number(formData.get('annual_amount') ?? 0) || 0,
        currency: 'USD',
      }),
    });
    const json = await res.json();
    setMsg(json.ok ? 'Fee schedule generated.' : (json.error ?? 'Could not generate schedule.'));
    if (json.ok) load();
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Fees</p>
            <h1 className="mt-2 text-3xl font-semibold">Fee tracking</h1>
            <p className="mt-2 text-slate-300">
              Total pending across all students:{' '}
              <span className="font-semibold text-amber-200">{usd(pendingAmount)}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/hostel/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button
              variant={pendingOnly ? 'default' : 'ghost'}
              onClick={() => setPendingOnly((v) => !v)}
            >
              {pendingOnly ? 'Showing pending' : 'Show pending only'}
            </Button>
          </div>
        </header>

        <Card>
          <h2 className="text-lg font-semibold">Generate 6-year hostel fee schedule</h2>
          {msg ? <p className="mt-2 text-sm text-emerald-200">{msg}</p> : null}
          <form className="mt-3 grid gap-3 md:grid-cols-3" onSubmit={generateSchedule}>
            <select
              name="student_id"
              required
              className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-saffron"
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
            <Input name="annual_amount" type="number" placeholder="Annual amount (USD)" />
            <Button type="submit" size="sm">
              Generate
            </Button>
          </form>
        </Card>

        <section className="grid gap-3">
          {grouped.length === 0 ? (
            <Card>
              <p className="text-slate-300">No hostel fees found.</p>
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
                        <th className="px-2 py-2">Total</th>
                        <th className="px-2 py-2">Paid</th>
                        <th className="px-2 py-2">Pending</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.rows
                        .sort((a, b) => (a.year_number ?? 0) - (b.year_number ?? 0))
                        .map((fee) => {
                          const overdue = fee.status === 'overdue';
                          return (
                            <tr
                              key={fee.id}
                              className={`border-b border-white/5 ${overdue ? 'bg-red-500/5' : ''}`}
                            >
                              <td className="px-2 py-2">Year {fee.year_number}</td>
                              <td className="px-2 py-2">{usd(fee.total_amount ?? 0)}</td>
                              <td className="px-2 py-2">{usd(fee.paid_amount ?? 0)}</td>
                              <td
                                className={`px-2 py-2 ${overdue ? 'font-semibold text-red-300' : ''}`}
                              >
                                {usd(fee.pending_amount ?? 0)}
                              </td>
                              <td className="px-2 py-2">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${feeStatusClasses[fee.status ?? 'pending']}`}
                                >
                                  {titleCase(fee.status ?? 'pending')}
                                </span>
                              </td>
                              <td className="px-2 py-2">
                                <div className="flex items-center gap-2">
                                  {fee.status !== 'paid' ? (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => confirmPayment(fee.id)}
                                    >
                                      Confirm paid
                                    </Button>
                                  ) : null}
                                  <label className="cursor-pointer text-xs text-saffron hover:underline">
                                    {fee.receipt_url ? 'Replace receipt' : 'Upload receipt'}
                                    <input
                                      type="file"
                                      className="sr-only"
                                      onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (file) uploadReceipt(fee.id, file);
                                      }}
                                    />
                                  </label>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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
