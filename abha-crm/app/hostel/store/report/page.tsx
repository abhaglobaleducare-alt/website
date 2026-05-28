'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { money } from '../../../../lib/constants/hostel-ops';

interface Transaction {
  store_item_id: string;
  transaction_type: string;
  quantity: number;
  item?: { item_name?: string | null; unit_cost?: number | null } | null;
}

interface StoreItem {
  id: string;
  item_name: string;
  unit?: string | null;
  current_stock: number;
  minimum_stock_alert: number;
}

const monthStart = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;

export default function StoreReportPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [items, setItems] = useState<StoreItem[]>([]);

  useEffect(() => {
    fetch(`/api/hostel/store/transactions?type=issue&from=${monthStart}`)
      .then((res) => res.json())
      .then((json) => setTransactions(json.transactions ?? []))
      .catch(() => setTransactions([]));
    fetch('/api/hostel/store')
      .then((res) => res.json())
      .then((json) => setItems(json.items ?? []))
      .catch(() => setItems([]));
  }, []);

  const consumption = useMemo(() => {
    const map = new Map<string, { item_name: string; qty: number; cost: number }>();
    transactions.forEach((txn) => {
      const name = txn.item?.item_name ?? 'Unknown';
      const unitCost = Number(txn.item?.unit_cost ?? 0);
      const entry = map.get(name) ?? { item_name: name, qty: 0, cost: 0 };
      entry.qty += txn.quantity;
      entry.cost += txn.quantity * unitCost;
      map.set(name, entry);
    });
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty);
  }, [transactions]);

  const totalCost = consumption.reduce((sum, entry) => sum + entry.cost, 0);
  const reorder = items.filter((item) => item.current_stock <= item.minimum_stock_alert);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Store</p>
            <h1 className="mt-2 text-3xl font-semibold">Monthly consumption report</h1>
            <p className="mt-2 text-slate-300">
              Consumption cost this month:{' '}
              <span className="font-semibold text-saffron">{money(totalCost)}</span>
            </p>
          </div>
          <Link href="/hostel/store">
            <Button variant="ghost">Back to store</Button>
          </Link>
        </header>

        <Card>
          <h2 className="text-lg font-semibold">Items consumed this month</h2>
          {consumption.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No items issued this month.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 text-left text-slate-400">
                  <tr>
                    <th className="px-2 py-2">#</th>
                    <th className="px-2 py-2">Item</th>
                    <th className="px-2 py-2">Quantity issued</th>
                    <th className="px-2 py-2">Estimated cost</th>
                  </tr>
                </thead>
                <tbody>
                  {consumption.map((entry, index) => (
                    <tr key={entry.item_name} className="border-b border-white/5">
                      <td className="px-2 py-2 text-slate-400">{index + 1}</td>
                      <td className="px-2 py-2 font-medium">{entry.item_name}</td>
                      <td className="px-2 py-2">{entry.qty}</td>
                      <td className="px-2 py-2">{money(entry.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Reorder suggestions (below minimum stock)</h2>
          {reorder.length === 0 ? (
            <p className="mt-3 text-sm text-emerald-200">
              All items are above their minimum stock.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {reorder.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-red-500/10 px-3 py-2 text-sm"
                >
                  <span className="font-medium">{item.item_name}</span>
                  <span className="text-red-200">
                    {item.current_stock} {item.unit ?? ''} (min {item.minimum_stock_alert})
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
