'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { titleCase } from '../../../../lib/constants/hostel-ops';

interface InventoryItem {
  id: string;
  item_name: string;
  item_category: string;
  quantity_assigned: number;
  condition: string;
  room?: { room_number?: string | null } | null;
}

export default function TotalInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    fetch('/api/hostel/room-inventory')
      .then((res) => res.json())
      .then((json) => setItems(json.items ?? []))
      .catch(() => setItems([]));
  }, []);

  const aggregated = useMemo(() => {
    const map = new Map<
      string,
      {
        item_name: string;
        category: string;
        total: number;
        good: number;
        damaged: number;
        missing: number;
      }
    >();
    items.forEach((item) => {
      const entry = map.get(item.item_name) ?? {
        item_name: item.item_name,
        category: item.item_category,
        total: 0,
        good: 0,
        damaged: 0,
        missing: 0,
      };
      const qty = item.quantity_assigned ?? 0;
      entry.total += qty;
      if (item.condition === 'good' || item.condition === 'fair') entry.good += qty;
      else if (item.condition === 'damaged') entry.damaged += qty;
      else if (item.condition === 'missing') entry.missing += qty;
      map.set(item.item_name, entry);
    });
    return Array.from(map.values()).sort((a, b) => a.item_name.localeCompare(b.item_name));
  }, [items]);

  const exportExcel = () => {
    const rows = aggregated.map((entry) => ({
      Item: entry.item_name,
      Category: titleCase(entry.category),
      'Grand Total': entry.total,
      'Good/Fair': entry.good,
      Damaged: entry.damaged,
      Missing: entry.missing,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Total Inventory');
    XLSX.writeFile(workbook, `total_inventory_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">
              Hostel · Total Inventory
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Total inventory across rooms</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/hostel/infrastructure">
              <Button variant="ghost">Infrastructure</Button>
            </Link>
            <Button variant="ghost" onClick={exportExcel}>
              Export Excel
            </Button>
          </div>
        </header>

        <Card>
          {aggregated.length === 0 ? (
            <p className="text-slate-300">No room inventory recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 text-left text-slate-400">
                  <tr>
                    <th className="px-2 py-2">Item</th>
                    <th className="px-2 py-2">Category</th>
                    <th className="px-2 py-2">Grand total</th>
                    <th className="px-2 py-2">Good/Fair</th>
                    <th className="px-2 py-2">Damaged</th>
                    <th className="px-2 py-2">Missing</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregated.map((entry) => (
                    <tr key={entry.item_name} className="border-b border-white/5">
                      <td className="px-2 py-2 font-medium">{entry.item_name}</td>
                      <td className="px-2 py-2 text-slate-400">{titleCase(entry.category)}</td>
                      <td className="px-2 py-2 font-semibold">{entry.total}</td>
                      <td className="px-2 py-2 text-emerald-300">{entry.good}</td>
                      <td className="px-2 py-2 text-orange-300">{entry.damaged}</td>
                      <td className="px-2 py-2 text-red-300">{entry.missing}</td>
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
