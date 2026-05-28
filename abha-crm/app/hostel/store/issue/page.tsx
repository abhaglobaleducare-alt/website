'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { issuePurposes } from '../../../../lib/constants/hostel-ops';

interface StoreItem {
  id: string;
  item_name: string;
  unit?: string | null;
  current_stock: number;
}

interface Room {
  id: string;
  room_number: string;
}

const today = new Date().toISOString().slice(0, 10);
const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-saffron';

export default function StoreIssuePage() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/hostel/store')
      .then((res) => res.json())
      .then((json) => setItems(json.items ?? []))
      .catch(() => setItems([]));
    fetch('/api/hostel/rooms')
      .then((res) => res.json())
      .then((json) => setRooms(json.rooms ?? []))
      .catch(() => setRooms([]));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/hostel/store/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store_item_id: String(formData.get('store_item_id') ?? ''),
        transaction_type: 'issue',
        quantity: Number(formData.get('quantity') ?? 0) || 0,
        transaction_date: String(formData.get('transaction_date') ?? today),
        purpose: String(formData.get('purpose') ?? ''),
        issued_to: String(formData.get('issued_to') ?? '').trim() || null,
        room_id: String(formData.get('room_id') ?? '') || null,
        notes: String(formData.get('notes') ?? '').trim() || null,
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setStatus('Issue recorded and stock updated. Redirecting…');
      window.setTimeout(() => {
        window.location.href = '/hostel/store';
      }, 800);
    } else {
      setStatus(json.error ?? 'Could not record issue.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Store</p>
            <h1 className="mt-2 text-3xl font-semibold">Issue from store</h1>
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
                    {item.item_name} — {item.current_stock} {item.unit ?? ''} in stock
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="quantity">
              Quantity to issue
              <Input id="quantity" name="quantity" type="number" required />
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
            <label className="space-y-2 text-sm text-slate-200" htmlFor="purpose">
              Purpose
              <select id="purpose" name="purpose" className={selectClass}>
                {issuePurposes.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="issued_to">
              Issued to (staff)
              <Input id="issued_to" name="issued_to" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="room_id">
              Room (optional)
              <select id="room_id" name="room_id" className={selectClass}>
                <option value="">— None —</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.room_number}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="notes">
              Notes
              <Input id="notes" name="notes" />
            </label>
            <div className="flex items-center gap-3 md:col-span-2">
              {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Record issue'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
