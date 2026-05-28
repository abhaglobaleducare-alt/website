'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Card } from '../../../components/ui/card';
import { Header } from '../../../components/shared/Header';
import { Sidebar } from '../../../components/shared/Sidebar';
import { MobileNav } from '../../../components/shared/MobileNav';
import { inr } from '../../../lib/constants/hr';
import { money } from '../../../lib/constants/hostel-ops';

// Defer the recharts bundle until the dashboard renders on the client.
const FunnelChart = dynamic(() => import('../../../components/admin/FunnelChart'), {
  ssr: false,
  loading: () => <p className="mt-4 text-sm text-slate-400">Loading chart…</p>,
});

const adminItems = [
  { label: 'Home', href: '/admin/dashboard' },
  { label: 'Staff', href: '/admin/staff' },
  { label: 'Students', href: '/admin/students' },
  { label: 'Leads', href: '/admin/leads' },
  { label: 'Goals', href: '/admin/goals' },
  { label: 'B2B', href: '/admin/b2b' },
  { label: 'Leave', href: '/admin/leave' },
  { label: 'Bonus', href: '/admin/bonus' },
  { label: 'Hostel', href: '/admin/hostel' },
  { label: 'Reports', href: '/admin/reports' },
  { label: 'Notifications', href: '/admin/notifications' },
  { label: 'Settings', href: '/admin/settings' },
];

interface DashboardData {
  kpis: Record<string, number>;
  funnel: { stage: string; count: number }[];
  officeComparison: {
    id: string;
    name: string;
    students: number;
    leads: number;
    conversions: number;
    monthlyExpenses: number;
  }[];
  leaderboard: {
    staff_id: string;
    name: string;
    admissions: number;
    conversionsThisMonth: number;
    slab: { name: string; icon: string | null } | null;
  }[];
  activity: { type: string; label: string; at: string }[];
}

function Kpi({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <Card className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`text-2xl font-bold ${accent ?? ''}`}>{value}</p>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((json) => (json.ok ? setData(json) : null))
      .catch(() => setData(null));
  }, []);

  const k = data?.kpis ?? {};

  return (
    <>
      <Header title="Admin Panel" subtitle="Executive overview" userName="Admin User" />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-24 pt-6 lg:px-6 lg:pb-10">
        <Sidebar items={adminItems} title="Admin Portal" />
        <main className="flex-1 space-y-6">
          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/staff/new">
              <span className="inline-flex rounded-full bg-saffron px-4 py-2 text-sm font-semibold text-brand-900">
                + Add Staff
              </span>
            </Link>
            <Link href="/admin/students">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                + Students
              </span>
            </Link>
            <QuickBadge href="/admin/leave" label="Pending Leaves" />
            <QuickBadge
              href="/admin/bonus"
              label="Pending Bonuses"
              value={k.pendingBonusesAmount ? inr(k.pendingBonusesAmount) : undefined}
            />
            <QuickBadge
              href="/admin/hostel/expenses"
              label="Pending Expenses"
              value={k.pendingExpenseCount ? String(k.pendingExpenseCount) : undefined}
            />
            <QuickBadge
              href="/admin/attendance"
              label="Attendance"
              value={String(k.checkedInToday ?? 0)}
            />
            <QuickBadge
              href="/admin/hostel"
              label="Low Stock"
              value={k.lowStockCount ? String(k.lowStockCount) : undefined}
            />
          </div>

          {/* KPI Row 1 */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Total Students" value={k.totalStudents ?? 0} />
            <Kpi label="Students in Funnel" value={k.totalStudents ?? 0} />
            <Kpi label="Leads This Month" value={k.leadsThisMonth ?? 0} />
            <Kpi
              label="Conversion Rate"
              value={`${k.conversionRate ?? 0}%`}
              accent="text-emerald-300"
            />
          </section>

          {/* KPI Row 2 */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi
              label="Pending Bonuses"
              value={inr(k.pendingBonusesAmount ?? 0)}
              accent="text-amber-200"
            />
            <Kpi label="Checked In Today" value={k.checkedInToday ?? 0} />
            <Kpi label="Open Complaints" value={k.openComplaints ?? 0} accent="text-red-300" />
            <Kpi
              label="Pending Fee Approvals"
              value={k.pendingFeeApprovals ?? 0}
              accent="text-amber-200"
            />
          </section>

          {/* KPI Row 3 — Phase 10 Extended */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi
              label="Today's Hostel Expenses"
              value={money(k.todayHostelExpenses ?? 0)}
              accent="text-saffron"
            />
            <Kpi
              label="Pending Expense Approvals"
              value={`${k.pendingExpenseCount ?? 0} · ${money(k.pendingExpenseAmount ?? 0)}`}
              accent="text-amber-200"
            />
            <Kpi label="Low Stock Alerts" value={k.lowStockCount ?? 0} accent="text-red-300" />
            <Kpi
              label="Infrastructure Damaged"
              value={k.infraDamagedCount ?? 0}
              accent="text-orange-300"
            />
          </section>

          {/* Funnel chart */}
          <Card>
            <h2 className="text-lg font-semibold">Student funnel</h2>
            <p className="text-xs text-slate-400">
              Click a bar to view that stage&apos;s students.
            </p>
            <FunnelChart data={data?.funnel ?? []} />
          </Card>

          {/* Office comparison + leaderboard */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="text-lg font-semibold">Office comparison</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10 text-left text-slate-400">
                    <tr>
                      <th className="px-2 py-2">Office</th>
                      <th className="px-2 py-2">Students</th>
                      <th className="px-2 py-2">Leads</th>
                      <th className="px-2 py-2">Conv.</th>
                      <th className="px-2 py-2">Expenses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.officeComparison ?? []).map((office) => (
                      <tr key={office.id} className="border-b border-white/5">
                        <td className="px-2 py-2 font-medium">{office.name}</td>
                        <td className="px-2 py-2">{office.students}</td>
                        <td className="px-2 py-2">{office.leads}</td>
                        <td className="px-2 py-2">{office.conversions}</td>
                        <td className="px-2 py-2 text-slate-400">
                          {money(office.monthlyExpenses)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold">Staff leaderboard</h2>
              {(data?.leaderboard ?? []).length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">No admissions recorded yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {(data?.leaderboard ?? []).map((staff, index) => (
                    <li
                      key={staff.staff_id}
                      className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-3 py-2 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-slate-500">{index + 1}.</span>
                        {staff.slab?.icon ? <span>{staff.slab.icon}</span> : null}
                        <span className="font-medium">{staff.name}</span>
                        {staff.slab ? (
                          <span className="text-xs text-slate-400">{staff.slab.name}</span>
                        ) : null}
                      </span>
                      <span className="text-slate-300">
                        {staff.admissions} adm · {staff.conversionsThisMonth} this mo
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Activity feed */}
          <Card>
            <h2 className="text-lg font-semibold">Recent activity</h2>
            {!data || data.activity.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No recent activity.</p>
            ) : (
              <ul className="mt-4 divide-y divide-white/5">
                {data.activity.map((entry, index) => (
                  <li key={index} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="text-sm text-slate-200">{entry.label}</span>
                    <span className="text-xs text-slate-500">
                      {entry.at ? formatDistanceToNow(parseISO(entry.at), { addSuffix: true }) : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </main>
      </div>
      <MobileNav items={adminItems} />
    </>
  );
}

function QuickBadge({ href, label, value }: { href: string; label: string; value?: string }) {
  return (
    <Link href={href}>
      <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
        {label}
        {value ? (
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-200">
            {value}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
