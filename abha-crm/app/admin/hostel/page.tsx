'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import {
  complaintPriorityClasses,
  feeStatusClasses,
  titleCase,
  usd,
} from '../../../lib/constants/hostel';
import { money } from '../../../lib/constants/hostel-ops';

interface DashboardData {
  roomStats: { total: number; occupied: number; available: number; maintenance: number };
  pendingFees: { count: number; amount: number };
  openComplaints: number;
}

interface HostelStudent {
  id: string;
  selected_country?: string | null;
}

interface PendingFee {
  id: string;
  year_number?: number | null;
  pending_amount?: number | null;
  status?: string | null;
  student?: { full_name?: string | null } | null;
}

interface Complaint {
  id: string;
  complaint_title: string;
  priority?: string | null;
  student?: { full_name?: string | null } | null;
}

interface InfraItem {
  id: string;
  item_name: string;
  item_category: string;
  total_quantity: number;
  good_condition: number;
  damaged: number;
  under_repair: number;
  unit_cost?: number | null;
  last_inspection_date?: string | null;
}

interface StoreItem {
  id: string;
  item_name: string;
  current_stock: number;
  minimum_stock_alert: number;
  unit?: string | null;
}

interface AgentCommission {
  id: string;
  agent_name: string;
  service_type: string;
  commission_amount: number;
  currency?: string | null;
  status: string;
  student?: { full_name?: string | null } | null;
}

export default function AdminHostelPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [students, setStudents] = useState<HostelStudent[]>([]);
  const [pendingFees, setPendingFees] = useState<PendingFee[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [infra, setInfra] = useState<InfraItem[]>([]);
  const [store, setStore] = useState<StoreItem[]>([]);
  const [commissions, setCommissions] = useState<AgentCommission[]>([]);

  const loadFees = () => {
    fetch('/api/hostel/fees?pending=1')
      .then((res) => res.json())
      .then((json) => setPendingFees(json.fees ?? []))
      .catch(() => setPendingFees([]));
  };

  const loadCommissions = () => {
    fetch('/api/agent-commissions?status=pending')
      .then((res) => res.json())
      .then((json) => setCommissions(json.commissions ?? []))
      .catch(() => setCommissions([]));
  };

  useEffect(() => {
    fetch('/api/hostel/dashboard')
      .then((res) => res.json())
      .then((json) => (json.ok ? setDashboard(json) : null))
      .catch(() => setDashboard(null));
    fetch('/api/hostel/students')
      .then((res) => res.json())
      .then((json) => setStudents(json.students ?? []))
      .catch(() => setStudents([]));
    fetch('/api/hostel/complaints?status=open')
      .then((res) => res.json())
      .then((json) => setComplaints(json.complaints ?? []))
      .catch(() => setComplaints([]));
    fetch('/api/hostel/infrastructure')
      .then((res) => res.json())
      .then((json) => setInfra(json.items ?? []))
      .catch(() => setInfra([]));
    fetch('/api/hostel/store')
      .then((res) => res.json())
      .then((json) => setStore(json.items ?? []))
      .catch(() => setStore([]));
    loadFees();
    loadCommissions();
  }, []);

  const distribution = useMemo(() => {
    const counts: Record<string, number> = { Georgia: 0, Kyrgyzstan: 0, Other: 0 };
    students.forEach((student) => {
      const key =
        student.selected_country === 'Georgia'
          ? 'Georgia'
          : student.selected_country === 'Kyrgyzstan'
            ? 'Kyrgyzstan'
            : 'Other';
      counts[key] += 1;
    });
    return counts;
  }, [students]);

  const escalations = complaints.filter((c) => ['urgent', 'high'].includes(c.priority ?? ''));
  const damagedItems = infra.filter((i) => (i.damaged ?? 0) > 0 || (i.under_repair ?? 0) > 0);
  const inventoryValue = infra.reduce(
    (sum, i) => sum + (i.total_quantity ?? 0) * Number(i.unit_cost ?? 0),
    0,
  );
  const lowStock = store.filter((s) => s.current_stock <= s.minimum_stock_alert);

  const approveFee = async (id: string) => {
    await fetch(`/api/hostel/fees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    });
    loadFees();
  };

  const actCommission = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`/api/agent-commissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    loadCommissions();
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Admin · Hostel</p>
            <h1 className="mt-2 text-3xl font-semibold">Hostel management</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              All hostels — occupancy, fees, infrastructure, store, and commissions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/hostel/expenses">
              <Button variant="ghost">Expense approvals</Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </header>

        {/* Overview */}
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <p className="text-sm text-slate-400">Total rooms</p>
            <p className="mt-2 text-3xl font-bold">{dashboard?.roomStats.total ?? 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Occupied / available</p>
            <p className="mt-2 text-3xl font-bold">
              {dashboard?.roomStats.occupied ?? 0}
              <span className="text-lg text-slate-400">
                {' '}
                / {dashboard?.roomStats.available ?? 0}
              </span>
            </p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Pending fees</p>
            <p className="mt-2 text-3xl font-bold text-amber-200">
              {usd(dashboard?.pendingFees.amount ?? 0)}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Inventory value</p>
            <p className="mt-2 text-3xl font-bold">{usd(inventoryValue)}</p>
          </Card>
        </section>

        <Card>
          <h2 className="text-lg font-semibold">Georgia vs Kyrgyzstan</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {(['Georgia', 'Kyrgyzstan', 'Other'] as const).map((country) => (
              <div key={country} className="rounded-2xl bg-slate-900/60 p-4">
                <p className="text-sm text-slate-400">{country}</p>
                <p className="mt-1 text-2xl font-bold">{distribution[country]}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Infrastructure alerts */}
        <Card>
          <h2 className="text-lg font-semibold">Infrastructure alerts</h2>
          {damagedItems.length === 0 ? (
            <p className="mt-3 text-sm text-emerald-200">No damaged or under-repair items.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5">
              {damagedItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-medium">{item.item_name}</p>
                    <p className="text-xs text-slate-400">
                      {titleCase(item.item_category)} · last inspected{' '}
                      {item.last_inspection_date ?? 'never'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {item.damaged > 0 ? (
                      <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-xs font-semibold text-orange-200">
                        {item.damaged} damaged
                      </span>
                    ) : null}
                    {item.under_repair > 0 ? (
                      <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-200">
                        {item.under_repair} under repair
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Store alerts */}
        <Card>
          <h2 className="text-lg font-semibold">Store / stock alerts</h2>
          {lowStock.length === 0 ? (
            <p className="mt-3 text-sm text-emerald-200">All store items above minimum stock.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {lowStock.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-red-500/10 px-3 py-2 text-sm"
                >
                  <span className="font-medium">{item.item_name}</span>
                  <span className="text-red-200">
                    {item.current_stock} {item.unit ?? ''} (min {item.minimum_stock_alert}) —
                    reorder
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Agent commission approvals */}
        <Card>
          <h2 className="text-lg font-semibold">Agent commission approvals</h2>
          {commissions.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No pending agent commissions.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5">
              {commissions.map((commission) => (
                <li
                  key={commission.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {commission.agent_name} ·{' '}
                      {money(commission.commission_amount, commission.currency ?? 'GEL')}
                    </p>
                    <p className="text-xs text-slate-400">
                      {commission.service_type}
                      {commission.student?.full_name ? ` · ${commission.student.full_name}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => actCommission(commission.id, 'approve')}>
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => actCommission(commission.id, 'reject')}
                    >
                      Reject
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Pending fee approvals */}
        <Card>
          <h2 className="text-lg font-semibold">Pending fee approvals</h2>
          {pendingFees.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No pending fees to approve.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5">
              {pendingFees.slice(0, 20).map((fee) => (
                <li key={fee.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">{fee.student?.full_name ?? 'Student'}</p>
                    <p className="text-sm text-slate-400">
                      Year {fee.year_number} · {usd(fee.pending_amount ?? 0)} pending
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${feeStatusClasses[fee.status ?? 'pending']}`}
                    >
                      {titleCase(fee.status ?? 'pending')}
                    </span>
                    <Button size="sm" onClick={() => approveFee(fee.id)}>
                      Approve
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Complaint escalations */}
        <Card>
          <h2 className="text-lg font-semibold">Complaint escalations</h2>
          {escalations.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No high-priority open complaints.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5">
              {escalations.map((complaint) => (
                <li
                  key={complaint.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-semibold">{complaint.complaint_title}</p>
                    <p className="text-sm text-slate-400">
                      {complaint.student?.full_name ?? 'Student'}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${complaintPriorityClasses[complaint.priority ?? 'medium']}`}
                  >
                    {titleCase(complaint.priority ?? 'medium')}
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
