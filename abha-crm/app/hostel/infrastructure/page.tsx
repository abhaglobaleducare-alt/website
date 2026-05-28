'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { infraCategories, titleCase } from '../../../lib/constants/hostel-ops';

interface InfraItem {
  id: string;
  item_category: string;
  item_name: string;
  total_quantity: number;
  good_condition: number;
  damaged: number;
  under_repair: number;
  last_inspection_date?: string | null;
}

type Draft = Partial<
  Pick<InfraItem, 'total_quantity' | 'good_condition' | 'damaged' | 'under_repair'>
>;

const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-saffron';

export default function InfrastructurePage() {
  const [items, setItems] = useState<InfraItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    fetch('/api/hostel/infrastructure')
      .then((res) => res.json())
      .then((json) => setItems(json.items ?? []))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    load();
  }, []);

  const summary = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.total += item.total_quantity ?? 0;
        acc.good += item.good_condition ?? 0;
        acc.damaged += item.damaged ?? 0;
        acc.repair += item.under_repair ?? 0;
        return acc;
      },
      { total: 0, good: 0, damaged: 0, repair: 0 },
    );
  }, [items]);

  const seedStandard = async () => {
    setMsg('');
    const res = await fetch('/api/hostel/infrastructure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'seed' }),
    });
    const json = await res.json();
    setMsg(json.ok ? `Added ${json.inserted} standard items.` : (json.error ?? 'Seed failed.'));
    if (json.ok) load();
  };

  const saveRow = async (item: InfraItem) => {
    const draft = drafts[item.id] ?? {};
    await fetch(`/api/hostel/infrastructure/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        total_quantity: draft.total_quantity ?? item.total_quantity,
        good_condition: draft.good_condition ?? item.good_condition,
        damaged: draft.damaged ?? item.damaged,
        under_repair: draft.under_repair ?? item.under_repair,
        last_inspection_date: new Date().toISOString().slice(0, 10),
      }),
    });
    load();
  };

  const addItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/hostel/infrastructure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_name: String(formData.get('item_name') ?? '').trim(),
        item_category: String(formData.get('item_category') ?? 'other'),
        total_quantity: Number(formData.get('total_quantity') ?? 0) || 0,
        good_condition: Number(formData.get('total_quantity') ?? 0) || 0,
      }),
    });
    const json = await res.json();
    if (json.ok) {
      setShowAdd(false);
      load();
    }
  };

  const setDraft = (id: string, key: keyof Draft, value: number) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">
              Hostel · Infrastructure
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Infrastructure inventory</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/hostel/infrastructure/rooms">
              <Button variant="ghost">Room inventory</Button>
            </Link>
            <Link href="/hostel/infrastructure/total">
              <Button variant="ghost">Total inventory</Button>
            </Link>
            <Button variant="ghost" onClick={seedStandard}>
              Seed standard items
            </Button>
            <Button onClick={() => setShowAdd(true)}>Add item</Button>
          </div>
        </header>

        {msg ? <p className="text-sm text-emerald-200">{msg}</p> : null}

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <p className="text-sm text-slate-400">Total items</p>
            <p className="mt-2 text-3xl font-bold">{summary.total}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Good condition</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{summary.good}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Damaged</p>
            <p className="mt-2 text-3xl font-bold text-orange-300">{summary.damaged}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400">Under repair</p>
            <p className="mt-2 text-3xl font-bold text-amber-200">{summary.repair}</p>
          </Card>
        </section>

        <Card>
          {items.length === 0 ? (
            <p className="text-slate-300">
              No items yet. Use &ldquo;Seed standard items&rdquo; to populate the standard
              catalogue.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 text-left text-slate-400">
                  <tr>
                    <th className="px-2 py-2">Item</th>
                    <th className="px-2 py-2">Category</th>
                    <th className="px-2 py-2">Total</th>
                    <th className="px-2 py-2">Good</th>
                    <th className="px-2 py-2">Damaged</th>
                    <th className="px-2 py-2">Repair</th>
                    <th className="px-2 py-2">Last inspected</th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-white/5">
                      <td className="px-2 py-2 font-medium">{item.item_name}</td>
                      <td className="px-2 py-2 text-slate-400">{titleCase(item.item_category)}</td>
                      {(
                        ['total_quantity', 'good_condition', 'damaged', 'under_repair'] as const
                      ).map((field) => (
                        <td key={field} className="px-2 py-2">
                          <input
                            type="number"
                            defaultValue={item[field]}
                            onChange={(event) =>
                              setDraft(item.id, field, Number(event.target.value) || 0)
                            }
                            className="w-16 rounded-lg border border-slate-700 bg-slate-950/90 px-2 py-1 text-sm"
                          />
                        </td>
                      ))}
                      <td className="px-2 py-2 text-slate-400">
                        {item.last_inspection_date ?? '—'}
                      </td>
                      <td className="px-2 py-2">
                        <Button size="sm" variant="ghost" onClick={() => saveRow(item)}>
                          Save
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {showAdd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-soft">
            <h2 className="text-xl font-semibold">Add infrastructure item</h2>
            <form className="mt-4 grid gap-3" onSubmit={addItem}>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="item_name">
                Item name
                <Input id="item_name" name="item_name" required />
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="item_category">
                Category
                <select id="item_category" name="item_category" className={selectClass}>
                  {infraCategories.map((category) => (
                    <option key={category} value={category}>
                      {titleCase(category)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="total_quantity">
                Total quantity
                <Input id="total_quantity" name="total_quantity" type="number" defaultValue={0} />
              </label>
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
