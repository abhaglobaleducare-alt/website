'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Card } from '../../../components/ui/card';
import { usd } from '../../../lib/constants/hostel';
import { money } from '../../../lib/constants/hostel-ops';

const hostelNav = [
  { label: 'Rooms', href: '/hostel/rooms' },
  { label: 'Students', href: '/hostel/students' },
  { label: 'Fees', href: '/hostel/fees' },
  { label: 'Complaints', href: '/hostel/complaints' },
  { label: 'Daily Log', href: '/hostel/daily-log' },
  { label: 'Parents', href: '/hostel/parents' },
  { label: 'AGEST', href: '/hostel/agest' },
  { label: '💰 Expenses', href: '/hostel/expenses', key: 'expenses' },
  { label: '🏗️ Infrastructure', href: '/hostel/infrastructure' },
  { label: '📦 Store', href: '/hostel/store' },
];

interface DashboardData {
  roomStats: { total: number; occupied: number; available: number; maintenance: number };
  arrivalsToday: number;
  departuresToday: number;
  pendingFees: { count: number; amount: number };
  openComplaints: number;
  activity: { type: string; label: string; at: string }[];
}

interface OpsData {
  todayExpenses: number;
  lowStock: number;
  infraIssues: number;
  pendingExpenses: number;
}

const today = new Date().toISOString().slice(0, 10);

export default function HostelDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [ops, setOps] = useState<OpsData>({
    todayExpenses: 0,
    lowStock: 0,
    infraIssues: 0,
    pendingExpenses: 0,
  });

  useEffect(() => {
    fetch('/api/hostel/dashboard')
      .then((res) => res.json())
      .then((json) => (json.ok ? setData(json) : null))
      .catch(() => setData(null));

    Promise.all([
      fetch(`/api/hostel/expenses?from=${today}&to=${today}`).then((res) => res.json()),
      fetch('/api/hostel/expenses?approval_status=pending').then((res) => res.json()),
      fetch('/api/hostel/store').then((res) => res.json()),
      fetch('/api/hostel/infrastructure').then((res) => res.json()),
    ])
      .then(([todayExp, pendingExp, store, infra]) => {
        const lowStock = (store.items ?? []).filter(
          (item: { current_stock: number; minimum_stock_alert: number }) =>
            item.current_stock <= item.minimum_stock_alert,
        ).length;
        const infraIssues = (infra.items ?? []).reduce(
          (sum: number, item: { damaged?: number; under_repair?: number }) =>
            sum + (item.damaged ?? 0) + (item.under_repair ?? 0),
          0,
        );
        setOps({
          todayExpenses: todayExp.total ?? 0,
          pendingExpenses: (pendingExp.expenses ?? []).length,
          lowStock,
          infraIssues,
        });
      })
      .catch(() => undefined);
  }, []);

  const stats = data?.roomStats ?? { total: 0, occupied: 0, available: 0, maintenance: 0 };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel Manager</p>
          <h1 className="mt-2 text-3xl font-semibold">Hostel dashboard</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Rooms, occupancy, fees, complaints, expenses, and store for Georgia &amp; Kyrgyzstan.
          </p>
        </header>

        <nav className="flex flex-wrap gap-2">
          {hostelNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              {item.label}
              {item.key === 'expenses' && ops.pendingExpenses > 0 ? (
                <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-200">
                  {ops.pendingExpenses}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <p className="text-sm text-slate-400">Total rooms</p>
            <p className="mt-2 text-3xl font-bold">{stats.total}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Occupied</p>
            <p className="mt-2 text-3xl font-bold text-blue-200">{stats.occupied}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Available</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{stats.available}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Maintenance</p>
            <p className="mt-2 text-3xl font-bold text-orange-300">{stats.maintenance}</p>
          </Card>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <p className="text-sm text-slate-400">Arrivals today</p>
            <p className="mt-2 text-3xl font-bold">{data?.arrivalsToday ?? 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Departures today</p>
            <p className="mt-2 text-3xl font-bold">{data?.departuresToday ?? 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Pending fees</p>
            <p className="mt-2 text-3xl font-bold text-amber-200">{data?.pendingFees.count ?? 0}</p>
            <p className="text-xs text-slate-400">{usd(data?.pendingFees.amount ?? 0)}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Open complaints</p>
            <p className="mt-2 text-3xl font-bold text-red-300">{data?.openComplaints ?? 0}</p>
          </Card>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <Card>
            <p className="text-sm text-slate-400">Today&apos;s expenses</p>
            <p className="mt-2 text-3xl font-bold text-saffron">{money(ops.todayExpenses)}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Low stock alerts</p>
            <p className="mt-2 text-3xl font-bold text-red-300">{ops.lowStock}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Infrastructure issues</p>
            <p className="mt-2 text-3xl font-bold text-orange-300">{ops.infraIssues}</p>
          </Card>
        </section>

        <Card>
          <h2 className="text-xl font-semibold">Recent activity</h2>
          {!data || data.activity.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No recent activity.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5">
              {data.activity.map((entry, index) => (
                <li key={index} className="flex items-center justify-between gap-3 py-3">
                  <span className="text-sm text-slate-200">{entry.label}</span>
                  <span className="text-xs text-slate-500">
                    {entry.at ? formatDistanceToNow(parseISO(entry.at), { addSuffix: true }) : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}
