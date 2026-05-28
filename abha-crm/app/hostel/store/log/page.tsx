'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import {
  storeTransactionTypes,
  storeTransactionClasses,
  titleCase,
} from '../../../../lib/constants/hostel-ops';

interface Transaction {
  id: string;
  store_item_id: string;
  transaction_type: string;
  quantity: number;
  transaction_date: string;
  purpose?: string | null;
  issued_to?: string | null;
  notes?: string | null;
  created_at?: string | null;
  item?: { item_name?: string | null } | null;
  room?: { room_number?: string | null } | null;
  creator?: { full_name?: string | null } | null;
}

interface StoreItem {
  id: string;
  item_name: string;
}

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-saffron';

export default function StoreLogPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [items, setItems] = useState<StoreItem[]>([]);
  const [filters, setFilters] = useState({ from: '', to: '', store_item_id: '', type: '' });

  useEffect(() => {
    fetch('/api/hostel/store')
      .then((res) => res.json())
      .then((json) => setItems(json.items ?? []))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    fetch(`/api/hostel/store/transactions?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => setTransactions(json.transactions ?? []))
      .catch(() => setTransactions([]));
  }, [filters]);

  // Running balance per item, computed chronologically (oldest first).
  const balanceById = useMemo(() => {
    const map: Record<string, number> = {};
    const running: Record<string, number> = {};
    const ordered = [...transactions].sort((a, b) => {
      const da = `${a.transaction_date} ${a.created_at ?? ''}`;
      const db = `${b.transaction_date} ${b.created_at ?? ''}`;
      return da.localeCompare(db);
    });
    ordered.forEach((txn) => {
      const delta = txn.transaction_type === 'issue' ? -txn.quantity : txn.quantity;
      running[txn.store_item_id] = (running[txn.store_item_id] ?? 0) + delta;
      map[txn.id] = running[txn.store_item_id];
    });
    return map;
  }, [transactions]);

  const exportExcel = () => {
    const rows = transactions.map((txn) => ({
      Date: txn.transaction_date,
      Item: txn.item?.item_name ?? '',
      Type: txn.transaction_type,
      Qty: txn.quantity,
      Balance: balanceById[txn.id] ?? '',
      Purpose: txn.purpose ?? '',
      'Issued To': txn.issued_to ?? '',
      Room: txn.room?.room_number ?? '',
      By: txn.creator?.full_name ?? '',
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Store Log');
    XLSX.writeFile(workbook, `store_log_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const setFilter = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Store</p>
            <h1 className="mt-2 text-3xl font-semibold">Transaction log</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/hostel/store">
              <Button variant="ghost">Back to store</Button>
            </Link>
            <Button variant="ghost" onClick={exportExcel}>
              Export Excel
            </Button>
          </div>
        </header>

        <Card>
          <div className="grid gap-3 md:grid-cols-4">
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
            <label className="space-y-1 text-xs text-slate-300" htmlFor="store_item_id">
              Item
              <select
                id="store_item_id"
                value={filters.store_item_id}
                onChange={(e) => setFilter('store_item_id', e.target.value)}
                className={selectClass}
              >
                <option value="">All items</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.item_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-xs text-slate-300" htmlFor="type">
              Type
              <select
                id="type"
                value={filters.type}
                onChange={(e) => setFilter('type', e.target.value)}
                className={selectClass}
              >
                <option value="">All types</option>
                {storeTransactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {titleCase(type)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <Card>
          {transactions.length === 0 ? (
            <p className="text-slate-300">No transactions match the filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 text-left text-slate-400">
                  <tr>
                    <th className="px-2 py-2">Date</th>
                    <th className="px-2 py-2">Item</th>
                    <th className="px-2 py-2">Type</th>
                    <th className="px-2 py-2">Qty</th>
                    <th className="px-2 py-2">Balance</th>
                    <th className="px-2 py-2">Purpose</th>
                    <th className="px-2 py-2">Issued To</th>
                    <th className="px-2 py-2">Room</th>
                    <th className="px-2 py-2">By</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="border-b border-white/5">
                      <td className="px-2 py-2">
                        {format(parseISO(txn.transaction_date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-2 py-2">{txn.item?.item_name ?? '—'}</td>
                      <td className="px-2 py-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${storeTransactionClasses[txn.transaction_type]}`}
                        >
                          {titleCase(txn.transaction_type)}
                        </span>
                      </td>
                      <td className="px-2 py-2">{txn.quantity}</td>
                      <td className="px-2 py-2 font-semibold">{balanceById[txn.id] ?? '—'}</td>
                      <td className="px-2 py-2 text-slate-400">{txn.purpose ?? '—'}</td>
                      <td className="px-2 py-2 text-slate-400">{txn.issued_to ?? '—'}</td>
                      <td className="px-2 py-2 text-slate-400">{txn.room?.room_number ?? '—'}</td>
                      <td className="px-2 py-2 text-slate-400">{txn.creator?.full_name ?? '—'}</td>
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
