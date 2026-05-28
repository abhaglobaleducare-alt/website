'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { expenseCategoryLabel, money, titleCase } from '../../../../lib/constants/hostel-ops';
import { offices } from '../../../../lib/constants/staff';

interface Expense {
  id: string;
  office_id?: string | null;
  expense_date: string;
  expense_category: string;
  item_name: string;
  total_cost: number;
  currency?: string | null;
  payment_type?: string | null;
  vendor_name?: string | null;
  receipt_url?: string | null;
  approval_status: string;
  creator?: { full_name?: string | null } | null;
}

const monthStart = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;
const COLORS = [
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#eab308',
  '#f97316',
  '#64748b',
];

function officeName(id?: string | null) {
  return offices.find((o) => o.id === id)?.name ?? 'Unassigned';
}

export default function AdminExpensesPage() {
  const [pending, setPending] = useState<Expense[]>([]);
  const [monthExpenses, setMonthExpenses] = useState<Expense[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetch('/api/hostel/expenses?approval_status=pending')
      .then((res) => res.json())
      .then((json) => setPending(json.expenses ?? []))
      .catch(() => setPending([]));
    fetch(`/api/hostel/expenses?from=${monthStart}`)
      .then((res) => res.json())
      .then((json) => setMonthExpenses(json.expenses ?? []))
      .catch(() => setMonthExpenses([]));
  };

  useEffect(() => {
    load();
  }, []);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    monthExpenses.forEach((e) => {
      map.set(e.expense_category, (map.get(e.expense_category) ?? 0) + Number(e.total_cost ?? 0));
    });
    return Array.from(map.entries()).map(([category, value]) => ({
      name: expenseCategoryLabel(category),
      value: Math.round(value),
    }));
  }, [monthExpenses]);

  const byOffice = useMemo(() => {
    const map = new Map<string, number>();
    monthExpenses.forEach((e) => {
      const key = officeName(e.office_id);
      map.set(key, (map.get(key) ?? 0) + Number(e.total_cost ?? 0));
    });
    return Array.from(map.entries());
  }, [monthExpenses]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const act = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`/api/hostel/expenses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, notes: notes[id] }),
    });
    load();
  };

  const bulkApprove = async () => {
    if (selected.size === 0) return;
    setBusy(true);
    await Promise.all(
      Array.from(selected).map((id) =>
        fetch(`/api/hostel/expenses/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'approve' }),
        }),
      ),
    );
    setSelected(new Set());
    setBusy(false);
    load();
  };

  const exportApproved = async () => {
    const res = await fetch('/api/hostel/expenses?approval_status=approved');
    const json = await res.json();
    const rows = (json.expenses ?? []).map((e: Expense) => ({
      Date: e.expense_date,
      Office: officeName(e.office_id),
      Category: expenseCategoryLabel(e.expense_category),
      Item: e.item_name,
      Total: e.total_cost,
      Currency: e.currency ?? '',
      Vendor: e.vendor_name ?? '',
    }));
    const worksheet = XLSX.utils.json_to_sheet(
      rows.length ? rows : [{ Note: 'No approved expenses' }],
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Approved Expenses');
    XLSX.writeFile(workbook, `approved_expenses_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">
              Admin · Hostel Expenses
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Expense approvals</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/hostel">
              <Button variant="ghost">Hostel overview</Button>
            </Link>
            <Button variant="ghost" onClick={exportApproved}>
              Export approved
            </Button>
          </div>
        </header>

        <div className="grid gap-3 lg:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold">This month by category</h2>
            {byCategory.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No expenses this month.</p>
            ) : (
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={80} label>
                      {byCategory.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }}
                      formatter={(value) => money(Number(value) || 0)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">This month by office</h2>
            {byOffice.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No expenses this month.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {byOffice.map(([name, total]) => (
                  <li
                    key={name}
                    className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-3 py-2 text-sm"
                  >
                    <span>{name}</span>
                    <span className="font-semibold">{money(total)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Pending approvals ({pending.length})</h2>
            <Button size="sm" disabled={busy || selected.size === 0} onClick={bulkApprove}>
              {busy ? 'Approving…' : `Approve selected (${selected.size})`}
            </Button>
          </div>

          {pending.length === 0 ? (
            <p className="mt-3 text-sm text-slate-300">No pending expenses to approve.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pending.map((expense) => (
                <li key={expense.id} className="rounded-2xl bg-slate-900/60 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        aria-label={`Select expense ${expense.item_name}`}
                        checked={selected.has(expense.id)}
                        onChange={() => toggle(expense.id)}
                        className="mt-1 h-4 w-4 accent-saffron"
                      />
                      <span>
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-lg font-semibold">
                            {money(expense.total_cost, expense.currency ?? 'GEL')}
                          </span>
                          <span className="text-xs text-slate-400">
                            {expenseCategoryLabel(expense.expense_category)}
                          </span>
                        </span>
                        <span className="mt-1 block text-sm text-slate-300">
                          {expense.item_name}
                          {expense.vendor_name ? ` · ${expense.vendor_name}` : ''}
                          {expense.payment_type ? ` · ${titleCase(expense.payment_type)}` : ''}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {officeName(expense.office_id)} ·{' '}
                          {format(parseISO(expense.expense_date), 'MMM d, yyyy')}
                          {expense.creator?.full_name ? ` · by ${expense.creator.full_name}` : ''}
                        </span>
                      </span>
                    </div>
                    {expense.receipt_url ? (
                      <a
                        href={expense.receipt_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-saffron hover:underline"
                      >
                        View receipt
                      </a>
                    ) : null}
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto_auto]">
                    <Input
                      placeholder="Notes (reason if rejecting)"
                      value={notes[expense.id] ?? ''}
                      onChange={(event) =>
                        setNotes((prev) => ({ ...prev, [expense.id]: event.target.value }))
                      }
                    />
                    <Button size="sm" onClick={() => act(expense.id, 'approve')}>
                      Approve
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => act(expense.id, 'reject')}>
                      Reject
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}
