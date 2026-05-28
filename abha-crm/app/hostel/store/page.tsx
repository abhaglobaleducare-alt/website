'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { storeCategories, titleCase } from '../../../lib/constants/hostel-ops';

interface StoreItem {
  id: string;
  item_name: string;
  item_category: string;
  unit?: string | null;
  current_stock: number;
  minimum_stock_alert: number;
  storage_location?: string | null;
}

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-saffron';

export default function StorePage() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const load = () => {
    fetch('/api/hostel/store')
      .then((res) => res.json())
      .then((json) => setItems(json.items ?? []))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    load();
  }, []);

  const addItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/hostel/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_name: String(formData.get('item_name') ?? '').trim(),
        item_category: String(formData.get('item_category') ?? 'other'),
        unit: String(formData.get('unit') ?? '').trim() || null,
        current_stock: Number(formData.get('current_stock') ?? 0) || 0,
        minimum_stock_alert: Number(formData.get('minimum_stock_alert') ?? 5) || 5,
        storage_location: String(formData.get('storage_location') ?? '').trim() || null,
      }),
    });
    const json = await res.json();
    if (json.ok) {
      setShowAdd(false);
      load();
    }
  };

  const lowCount = items.filter((item) => item.current_stock <= item.minimum_stock_alert).length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Store</p>
            <h1 className="mt-2 text-3xl font-semibold">Store inventory</h1>
            {lowCount > 0 ? (
              <p className="mt-2 text-sm text-red-300">{lowCount} item(s) below minimum stock</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/hostel/store/purchase">
              <Button variant="ghost">Purchase</Button>
            </Link>
            <Link href="/hostel/store/issue">
              <Button variant="ghost">Issue</Button>
            </Link>
            <Link href="/hostel/store/log">
              <Button variant="ghost">Log</Button>
            </Link>
            <Link href="/hostel/store/report">
              <Button variant="ghost">Report</Button>
            </Link>
            <Button onClick={() => setShowAdd(true)}>Add item</Button>
          </div>
        </header>

        <Card>
          {items.length === 0 ? (
            <p className="text-slate-300">No store items yet. Add one to begin tracking stock.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 text-left text-slate-400">
                  <tr>
                    <th className="px-2 py-2">Item</th>
                    <th className="px-2 py-2">Category</th>
                    <th className="px-2 py-2">Stock</th>
                    <th className="px-2 py-2">Min alert</th>
                    <th className="px-2 py-2">Location</th>
                    <th className="px-2 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const low = item.current_stock <= item.minimum_stock_alert;
                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-white/5 ${low ? 'bg-red-500/10' : ''}`}
                      >
                        <td className="px-2 py-2 font-medium">{item.item_name}</td>
                        <td className="px-2 py-2 text-slate-400">
                          {titleCase(item.item_category)}
                        </td>
                        <td className={`px-2 py-2 font-semibold ${low ? 'text-red-300' : ''}`}>
                          {item.current_stock} {item.unit ?? ''}
                        </td>
                        <td className="px-2 py-2 text-slate-400">{item.minimum_stock_alert}</td>
                        <td className="px-2 py-2 text-slate-400">{item.storage_location ?? '—'}</td>
                        <td className="px-2 py-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${low ? 'bg-red-500/15 text-red-200' : 'bg-emerald-500/15 text-emerald-200'}`}
                          >
                            {low ? 'Low stock' : 'OK'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {showAdd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-soft">
            <h2 className="text-xl font-semibold">Add store item</h2>
            <form className="mt-4 grid gap-3" onSubmit={addItem}>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="item_name">
                Item name
                <Input id="item_name" name="item_name" required />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="item_category">
                Category
                <select id="item_category" name="item_category" className={selectClass}>
                  {storeCategories.map((category) => (
                    <option key={category} value={category}>
                      {titleCase(category)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-2 text-sm text-slate-200" htmlFor="unit">
                  Unit
                  <Input id="unit" name="unit" placeholder="pcs, kg…" />
                </label>
                <label className="space-y-2 text-sm text-slate-200" htmlFor="current_stock">
                  Opening stock
                  <Input id="current_stock" name="current_stock" type="number" defaultValue={0} />
                </label>
                <label className="space-y-2 text-sm text-slate-200" htmlFor="minimum_stock_alert">
                  Min alert
                  <Input
                    id="minimum_stock_alert"
                    name="minimum_stock_alert"
                    type="number"
                    defaultValue={5}
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-200" htmlFor="storage_location">
                  Location
                  <Input id="storage_location" name="storage_location" />
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
