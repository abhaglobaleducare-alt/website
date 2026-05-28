'use client';

import Link from 'next/link';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { reportDefinitions } from '../../../lib/constants/admin';
import { expenseCategoryLabel } from '../../../lib/constants/hostel-ops';

const monthStart = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;
const todayStr = new Date().toISOString().slice(0, 10);

function inRange(date: string | null | undefined, from: string, to: string) {
  if (!date) return true;
  const d = date.slice(0, 10);
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}

function save(sheets: { name: string; rows: Record<string, unknown>[] }[], fileName: string) {
  const workbook = XLSX.utils.book_new();
  sheets.forEach((sheet) => {
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(sheet.rows.length ? sheet.rows : [{ Note: 'No data for range' }]),
      sheet.name.slice(0, 31),
    );
  });
  XLSX.writeFile(workbook, fileName);
}

export default function AdminReportsPage() {
  const [from, setFrom] = useState(monthStart);
  const [to, setTo] = useState(todayStr);
  const [busy, setBusy] = useState('');

  const getJson = (url: string) => fetch(url).then((res) => res.json());

  const downloadReport = async (key: string) => {
    setBusy(key);
    try {
      if (key === 'admissions') {
        const json = await getJson('/api/students?scope=admin');
        const rows = (json.students ?? [])
          .filter((s: { created_at?: string }) => inRange(s.created_at, from, to))
          .map((s: Record<string, unknown>) => ({
            Code: s.student_code,
            Name: s.full_name,
            Stage: s.funnel_stage,
            University: s.selected_university,
            Country: s.selected_country,
            Created: String(s.created_at ?? '').slice(0, 10),
          }));
        save([{ name: 'Admissions', rows }], `admissions_${from}_${to}.xlsx`);
      } else if (key === 'staff_productivity') {
        const json = await getJson('/api/admin/dashboard');
        const rows = (json.leaderboard ?? []).map((s: Record<string, unknown>) => ({
          Staff: s.name,
          Admissions: s.admissions,
          'Conversions (this month)': s.conversionsThisMonth,
          Slab: (s.slab as { name?: string } | null)?.name ?? '',
        }));
        save([{ name: 'Staff Productivity', rows }], `staff_productivity_${todayStr}.xlsx`);
      } else if (key === 'lead_conversion') {
        const json = await getJson('/api/leads?scope=admin');
        const rows = (json.leads ?? [])
          .filter((l: { created_at?: string }) => inRange(l.created_at, from, to))
          .map((l: Record<string, unknown>) => ({
            Name: l.full_name,
            Phone: l.phone,
            Source: l.lead_source,
            Status: l.lead_status,
            Created: String(l.created_at ?? '').slice(0, 10),
          }));
        save([{ name: 'Lead Conversion', rows }], `lead_conversion_${from}_${to}.xlsx`);
      } else if (key === 'financial') {
        const [bonus, fees] = await Promise.all([
          getJson('/api/bonus?scope=admin'),
          getJson('/api/hostel/fees'),
        ]);
        const bonusRows = (bonus.bonuses ?? []).map((b: Record<string, unknown>) => ({
          Staff: (b.staff as { full_name?: string } | null)?.full_name ?? '',
          Type: b.bonus_type,
          Amount: b.bonus_amount,
          Status: b.status,
        }));
        const feeRows = (fees.fees ?? []).map((f: Record<string, unknown>) => ({
          Student: (f.student as { full_name?: string } | null)?.full_name ?? '',
          Year: f.year_number,
          Total: f.total_amount,
          Paid: f.paid_amount,
          Pending: f.pending_amount,
          Status: f.status,
        }));
        save(
          [
            { name: 'Bonuses', rows: bonusRows },
            { name: 'Hostel Fees', rows: feeRows },
          ],
          `financial_summary_${todayStr}.xlsx`,
        );
      } else if (key === 'hostel_expense') {
        const json = await getJson(`/api/hostel/expenses?from=${from}&to=${to}`);
        const byCategory = new Map<string, number>();
        (json.expenses ?? []).forEach((e: Record<string, unknown>) => {
          const cat = String(e.expense_category);
          byCategory.set(cat, (byCategory.get(cat) ?? 0) + Number(e.total_cost ?? 0));
        });
        const summary = Array.from(byCategory.entries()).map(([category, total]) => ({
          Category: expenseCategoryLabel(category),
          Total: total,
        }));
        const detail = (json.expenses ?? []).map((e: Record<string, unknown>) => ({
          Date: e.expense_date,
          Category: expenseCategoryLabel(String(e.expense_category)),
          Item: e.item_name,
          Total: e.total_cost,
          Currency: e.currency,
          Status: e.approval_status,
        }));
        save(
          [
            { name: 'By Category', rows: summary },
            { name: 'Detail', rows: detail },
          ],
          `hostel_expenses_${from}_${to}.xlsx`,
        );
      } else if (key === 'agent_commission') {
        const json = await getJson('/api/agent-commissions');
        const rows = (json.commissions ?? []).map((c: Record<string, unknown>) => ({
          Agent: c.agent_name,
          Service: c.service_type,
          Student: (c.student as { full_name?: string } | null)?.full_name ?? '',
          Amount: c.commission_amount,
          Currency: c.currency,
          Status: c.status,
        }));
        save([{ name: 'Agent Commissions', rows }], `agent_commissions_${todayStr}.xlsx`);
      } else if (key === 'b2b_performance') {
        const json = await getJson('/api/b2b-partners?withStats=1');
        const rows = (json.partners ?? []).map((p: Record<string, unknown>) => ({
          Partner: p.partner_name,
          Type: p.partner_type,
          Referrals: p.referrals,
          Conversions: p.conversions,
          'Conversion %': p.conversionRate,
          'Commission %': p.commission_percent,
          'Est. Commission': p.estimatedCommission,
        }));
        save([{ name: 'B2B Performance', rows }], `b2b_performance_${todayStr}.xlsx`);
      } else if (key === 'infrastructure') {
        const json = await getJson('/api/hostel/infrastructure');
        const rows = (json.items ?? []).map((i: Record<string, unknown>) => ({
          Item: i.item_name,
          Category: i.item_category,
          Total: i.total_quantity,
          Good: i.good_condition,
          Damaged: i.damaged,
          'Under Repair': i.under_repair,
          'Last Inspected': i.last_inspection_date ?? '',
        }));
        save([{ name: 'Infrastructure', rows }], `infrastructure_${todayStr}.xlsx`);
      } else if (key === 'store_consumption') {
        const [txns, store] = await Promise.all([
          getJson(`/api/hostel/store/transactions?type=issue&from=${from}&to=${to}`),
          getJson('/api/hostel/store'),
        ]);
        const consumed = new Map<string, number>();
        (txns.transactions ?? []).forEach((t: Record<string, unknown>) => {
          const name = (t.item as { item_name?: string } | null)?.item_name ?? 'Unknown';
          consumed.set(name, (consumed.get(name) ?? 0) + Number(t.quantity ?? 0));
        });
        const consumptionRows = Array.from(consumed.entries()).map(([item, qty]) => ({
          Item: item,
          'Qty issued': qty,
        }));
        const reorderRows = (store.items ?? [])
          .filter(
            (s: { current_stock: number; minimum_stock_alert: number }) =>
              s.current_stock <= s.minimum_stock_alert,
          )
          .map((s: Record<string, unknown>) => ({
            Item: s.item_name,
            Stock: s.current_stock,
            'Min alert': s.minimum_stock_alert,
          }));
        save(
          [
            { name: 'Consumption', rows: consumptionRows },
            { name: 'Reorder', rows: reorderRows },
          ],
          `store_consumption_${from}_${to}.xlsx`,
        );
      }
    } catch {
      // Swallow — empty workbook still downloads with a note.
    } finally {
      setBusy('');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Admin · Reports</p>
            <h1 className="mt-2 text-3xl font-semibold">Reports</h1>
            <p className="mt-2 text-slate-300">Download Excel reports for any date range.</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </header>

        <Card>
          <div className="flex flex-wrap items-end gap-4">
            <label className="space-y-1 text-xs text-slate-300" htmlFor="from">
              From
              <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </label>
            <label className="space-y-1 text-xs text-slate-300" htmlFor="to">
              To
              <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </label>
            <p className="text-xs text-slate-400">
              Date range applies to admission, lead, expense, and store reports.
            </p>
          </div>
        </Card>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {reportDefinitions.map((report) => (
            <Card key={report.key} className="flex flex-col justify-between gap-4">
              <div>
                <h2 className="font-semibold">{report.title}</h2>
                <p className="mt-1 text-sm text-slate-400">{report.description}</p>
              </div>
              <Button
                size="sm"
                disabled={busy === report.key}
                onClick={() => downloadReport(report.key)}
              >
                {busy === report.key ? 'Preparing…' : 'Download Excel'}
              </Button>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
