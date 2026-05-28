'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import {
  expenseCategories,
  expenseCategoryLabel,
  expensePaymentTypes,
  expenseApprovalStatuses,
  expenseStatusClasses,
  titleCase,
  money,
} from '../../../lib/constants/hostel-ops';

interface Expense {
  id: string;
  expense_date: string;
  expense_category: string;
  item_name: string;
  quantity?: number | null;
  unit?: string | null;
  total_cost: number;
  currency?: string | null;
  payment_type?: string | null;
  vendor_name?: string | null;
  approval_status: string;
}

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-saffron';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    category: '',
    payment_type: '',
    approval_status: '',
  });

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    fetch(`/api/hostel/expenses?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setExpenses(json.expenses ?? []);
        setTotal(json.total ?? 0);
      })
      .catch(() => setExpenses([]));
  }, [filters]);

  const exportExcel = () => {
    const rows = expenses.map((expense) => ({
      Date: expense.expense_date,
      Category: expenseCategoryLabel(expense.expense_category),
      Item: expense.item_name,
      Quantity: expense.quantity ?? '',
      Unit: expense.unit ?? '',
      Total: expense.total_cost,
      Currency: expense.currency ?? '',
      Payment: expense.payment_type ?? '',
      Vendor: expense.vendor_name ?? '',
      Status: expense.approval_status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    XLSX.writeFile(workbook, `hostel_expenses_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const setFilter = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Expenses</p>
            <h1 className="mt-2 text-3xl font-semibold">Expenses</h1>
            <p className="mt-2 text-slate-300">
              Total (filtered): <span className="font-semibold text-saffron">{money(total)}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/hostel/expenses/summary">
              <Button variant="ghost">Summary</Button>
            </Link>
            <Button variant="ghost" onClick={exportExcel}>
              Export Excel
            </Button>
            <Link href="/hostel/expenses/new">
              <Button>Add expense</Button>
            </Link>
          </div>
        </header>

        <Card>
          <div className="grid gap-3 md:grid-cols-5">
            <label className="space-y-1 text-xs text-slate-300" htmlFor="from">
              From
              <Input
                id="from"
                type="date"
                value={filters.from}
                onChange={(e) => setFilter('from', e.target.value)}
              />
            </label>
            <label className="space-y-1 text-xs text-slate-300" htmlFor="to">
              To
              <Input
                id="to"
                type="date"
                value={filters.to}
                onChange={(e) => setFilter('to', e.target.value)}
              />
            </label>
            <label className="space-y-1 text-xs text-slate-300" htmlFor="category">
              Category
              <select
                id="category"
                value={filters.category}
                onChange={(e) => setFilter('category', e.target.value)}
                className={selectClass}
              >
                <option value="">All</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-xs text-slate-300" htmlFor="payment_type">
              Payment
              <select
                id="payment_type"
                value={filters.payment_type}
                onChange={(e) => setFilter('payment_type', e.target.value)}
                className={selectClass}
              >
                <option value="">All</option>
                {expensePaymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {titleCase(type)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-xs text-slate-300" htmlFor="approval_status">
              Status
              <select
                id="approval_status"
                value={filters.approval_status}
                onChange={(e) => setFilter('approval_status', e.target.value)}
                className={selectClass}
              >
                <option value="">All</option>
                {expenseApprovalStatuses.map((status) => (
                  <option key={status} value={status}>
                    {titleCase(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <Card>
          {expenses.length === 0 ? (
            <p className="text-slate-300">No expenses match the filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 text-left text-slate-400">
                  <tr>
                    <th className="px-2 py-2">Date</th>
                    <th className="px-2 py-2">Category</th>
                    <th className="px-2 py-2">Item</th>
                    <th className="px-2 py-2">Total</th>
                    <th className="px-2 py-2">Payment</th>
                    <th className="px-2 py-2">Vendor</th>
                    <th className="px-2 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-white/5">
                      <td className="px-2 py-2">
                        {format(parseISO(expense.expense_date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-2 py-2">
                        {expenseCategoryLabel(expense.expense_category)}
                      </td>
                      <td className="px-2 py-2">{expense.item_name}</td>
                      <td className="px-2 py-2 font-semibold">
                        {money(expense.total_cost, expense.currency ?? 'GEL')}
                      </td>
                      <td className="px-2 py-2 text-slate-400">
                        {expense.payment_type ? titleCase(expense.payment_type) : '—'}
                      </td>
                      <td className="px-2 py-2 text-slate-400">{expense.vendor_name ?? '—'}</td>
                      <td className="px-2 py-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${expenseStatusClasses[expense.approval_status]}`}
                        >
                          {titleCase(expense.approval_status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
