'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';

interface StoreItem {
  id: string;
  item_name: string;
  unit?: string | null;
}

const today = new Date().toISOString().slice(0, 10);
const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-saffron';

export default function StorePurchasePage() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/hostel/store')
      .then((res) => res.json())
      .then((json) => setItems(json.items ?? []))
      .catch(() => setItems([]));
  }, []);

  const total = useMemo(() => {
    const q = Number(quantity) || 0;
    const u = Number(unitCost) || 0;
    return q && u ? (q * u).toFixed(2) : '';
  }, [quantity, unitCost]);

  const handleReceipt = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    if (json.ok) setReceiptUrl(json.url);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const itemId = String(formData.get('store_item_id') ?? '');
    const vendor = String(formData.get('vendor_name') ?? '').trim();
    const noteParts = [
      vendor ? `Vendor: ${vendor}` : '',
      unitCost ? `Unit cost: ${unitCost}` : '',
      total ? `Total: ${total}` : '',
      receiptUrl ? `Receipt: ${receiptUrl}` : '',
      String(formData.get('notes') ?? '').trim(),
    ].filter(Boolean);

    const res = await fetch('/api/hostel/store/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store_item_id: itemId,
        transaction_type: 'purchase',
        quantity: Number(quantity) || 0,
        transaction_date: String(formData.get('transaction_date') ?? today),
        purpose: 'Purchase',
        notes: noteParts.join(' · ') || null,
      }),
    });
    const json = await res.json();

    if (json.ok && unitCost) {
      await fetch(`/api/hostel/store/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unit_cost: Number(unitCost) }),
      });
    }

    setLoading(false);
    if (json.ok) {
      setStatus('Purchase recorded and stock updated. Redirecting…');
      window.setTimeout(() => {
        window.location.href = '/hostel/store';
      }, 800);
    } else {
      setStatus(json.error ?? 'Could not record purchase.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Store</p>
            <h1 className="mt-2 text-3xl font-semibold">Add stock (purchase)</h1>
          </div>
          <Link href="/hostel/store">
            <Button variant="ghost">Back to store</Button>
          </Link>
        </header>

        <Card>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label
              className="space-y-2 text-sm text-slate-200 md:col-span-2"
              htmlFor="store_item_id"
            >
              Item
              <select id="store_item_id" name="store_item_id" className={selectClass} required>
                <option value="">Select item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.item_name}
                    {item.unit ? ` (${item.unit})` : ''}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="quantity">
              Quantity purchased
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="transaction_date">
              Date
              <Input
                id="transaction_date"
                name="transaction_date"
                type="date"
                defaultValue={today}
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="unit_cost">
              Unit cost
              <Input
                id="unit_cost"
                type="number"
                step="0.01"
                value={unitCost}
                onChange={(event) => setUnitCost(event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="total">
              Total cost
              <Input id="total" type="number" value={total} readOnly />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="vendor_name">
              Vendor name
              <Input id="vendor_name" name="vendor_name" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="receipt">
              Receipt
              <input
                id="receipt"
                type="file"
                accept="image/*"
                onChange={handleReceipt}
                className="block w-full text-sm text-slate-300"
              />
              {receiptUrl ? <span className="text-xs text-emerald-200">Uploaded ✓</span> : null}
            </label>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="notes">
              Notes
              <Input id="notes" name="notes" />
            </label>
            <div className="flex items-center gap-3 md:col-span-2">
              {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Record purchase'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
