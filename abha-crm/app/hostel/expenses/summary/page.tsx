'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { startOfWeek } from 'date-fns';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { expenseCategoryLabel, money } from '../../../../lib/constants/hostel-ops';

interface Expense {
  id: string;
  expense_date: string;
  expense_category: string;
  item_name: string;
  total_cost: number;
}

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
const today = new Date().toISOString().slice(0, 10);
const monthStart = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;
const weekStartStr = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().slice(0, 10);

export default function ExpenseSummaryPage() {
  const [monthExpenses, setMonthExpenses] = useState<Expense[]>([]);
  const [pending, setPending] = useState<{ count: number; amount: number }>({
    count: 0,
    amount: 0,
  });

  useEffect(() => {
    fetch(`/api/hostel/expenses?from=${monthStart}`)
      .then((res) => res.json())
      .then((json) => setMonthExpenses(json.expenses ?? []))
      .catch(() => setMonthExpenses([]));
    fetch('/api/hostel/expenses?approval_status=pending')
      .then((res) => res.json())
      .then((json) => setPending({ count: (json.expenses ?? []).length, amount: json.total ?? 0 }))
      .catch(() => setPending({ count: 0, amount: 0 }));
  }, []);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    monthExpenses.forEach((expense) => {
      map.set(
        expense.expense_category,
        (map.get(expense.expense_category) ?? 0) + Number(expense.total_cost ?? 0),
      );
    });
    return Array.from(map.entries()).map(([category, value]) => ({
      name: expenseCategoryLabel(category),
      value: Math.round(value),
    }));
  }, [monthExpenses]);

  const monthTotal = monthExpenses.reduce((sum, e) => sum + Number(e.total_cost ?? 0), 0);
  const weekTotal = monthExpenses
    .filter((e) => e.expense_date >= weekStartStr)
    .reduce((sum, e) => sum + Number(e.total_cost ?? 0), 0);
  const todayTotal = monthExpenses
    .filter((e) => e.expense_date === today)
    .reduce((sum, e) => sum + Number(e.total_cost ?? 0), 0);

  const top5 = useMemo(() => {
    const map = new Map<string, number>();
    monthExpenses.forEach((expense) => {
      map.set(
        expense.item_name,
        (map.get(expense.item_name) ?? 0) + Number(expense.total_cost ?? 0),
      );
    });
    return Array.from(map.entries())
      .map(([item, value]) => ({ item, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [monthExpenses]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Expenses</p>
            <h1 className="mt-2 text-3xl font-semibold">Expense summary</h1>
          </div>
          <Link href="/hostel/expenses">
            <Button variant="ghost">Back to expenses</Button>
          </Link>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          <Card>
            <p className="text-sm text-slate-400">This month</p>
            <p className="mt-2 text-2xl font-bold">{money(monthTotal)}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">This week</p>
            <p className="mt-2 text-2xl font-bold">{money(weekTotal)}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Today</p>
            <p className="mt-2 text-2xl font-bold">{money(todayTotal)}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Pending approvals</p>
            <p className="mt-2 text-2xl font-bold text-amber-200">{pending.count}</p>
            <p className="text-xs text-slate-400">{money(pending.amount)}</p>
          </Card>
        </section>

        <div className="grid gap-3 lg:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold">This month by category</h2>
            {byCategory.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No expenses this month.</p>
            ) : (
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={90} label>
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
            <h2 className="text-lg font-semibold">Top 5 expense items this month</h2>
            {top5.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No expenses this month.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {top5.map((entry, index) => (
                  <li
                    key={entry.item}
                    className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-3 py-2 text-sm"
                  >
                    <span>
                      {index + 1}. {entry.item}
                    </span>
                    <span className="font-semibold">{money(entry.value)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
