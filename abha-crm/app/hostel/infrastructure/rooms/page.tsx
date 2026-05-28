'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import {
  infraCategories,
  inventoryConditions,
  inventoryConditionClasses,
  titleCase,
} from '../../../../lib/constants/hostel-ops';

interface Room {
  id: string;
  room_number: string;
}

interface InventoryItem {
  id: string;
  item_name: string;
  item_category: string;
  quantity_assigned: number;
  condition: string;
  last_checked_date?: string | null;
}

const selectClass =
  'rounded-2xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 outline-none focus:border-saffron';

export default function RoomInventoryPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState('');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/hostel/rooms')
      .then((res) => res.json())
      .then((json) => setRooms(json.rooms ?? []))
      .catch(() => setRooms([]));
  }, []);

  const loadItems = (id: string) => {
    if (!id) {
      setItems([]);
      return;
    }
    fetch(`/api/hostel/room-inventory?room_id=${id}`)
      .then((res) => res.json())
      .then((json) => setItems(json.items ?? []))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    loadItems(roomId);
  }, [roomId]);

  const updateItem = async (id: string, patch: Partial<InventoryItem>) => {
    await fetch(`/api/hostel/room-inventory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    loadItems(roomId);
  };

  const addItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const res = await fetch('/api/hostel/room-inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_id: roomId,
        item_name: String(formData.get('item_name') ?? '').trim(),
        item_category: String(formData.get('item_category') ?? 'other'),
        quantity_assigned: Number(formData.get('quantity_assigned') ?? 0) || 0,
        condition: String(formData.get('condition') ?? 'good'),
      }),
    });
    const json = await res.json();
    if (json.ok) {
      form.reset();
      loadItems(roomId);
    }
  };

  const markInspected = async () => {
    setMsg('');
    const res = await fetch('/api/hostel/room-inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'inspect', room_id: roomId }),
    });
    const json = await res.json();
    setMsg(json.ok ? 'Marked all items inspected today.' : 'Could not mark inspected.');
    if (json.ok) loadItems(roomId);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">
              Hostel · Room Inventory
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Room inventory checklist</h1>
          </div>
          <Link href="/hostel/infrastructure">
            <Button variant="ghost">Infrastructure</Button>
          </Link>
        </header>

        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={roomId}
              onChange={(event) => setRoomId(event.target.value)}
              className={selectClass}
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.room_number}
                </option>
              ))}
            </select>
            {roomId ? (
              <>
                <Button size="sm" variant="ghost" onClick={markInspected}>
                  Mark all inspected today
                </Button>
                <Button size="sm" variant="ghost" onClick={() => window.print()}>
                  Print
                </Button>
              </>
            ) : null}
            {msg ? <span className="text-sm text-emerald-200">{msg}</span> : null}
          </div>
        </Card>

        {roomId ? (
          <>
            <Card>
              {items.length === 0 ? (
                <p className="text-slate-300">No inventory items for this room yet.</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900/60 px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">{item.item_name}</p>
                        <p className="text-xs text-slate-400">{titleCase(item.item_category)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={item.quantity_assigned}
                          onBlur={(event) =>
                            updateItem(item.id, {
                              quantity_assigned: Number(event.target.value) || 0,
                            })
                          }
                          className="w-16 rounded-lg border border-slate-700 bg-slate-950/90 px-2 py-1 text-sm"
                        />
                        <select
                          defaultValue={item.condition}
                          onChange={(event) =>
                            updateItem(item.id, { condition: event.target.value })
                          }
                          className={`${selectClass} ${inventoryConditionClasses[item.condition] ?? ''}`}
                        >
                          {inventoryConditions.map((condition) => (
                            <option key={condition} value={condition}>
                              {titleCase(condition)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <h2 className="text-lg font-semibold">Add item to room</h2>
              <form className="mt-3 grid gap-3 md:grid-cols-4" onSubmit={addItem}>
                <Input name="item_name" placeholder="Item name" required />
                <select name="item_category" className={selectClass} defaultValue="furniture">
                  {infraCategories.map((category) => (
                    <option key={category} value={category}>
                      {titleCase(category)}
                    </option>
                  ))}
                </select>
                <Input name="quantity_assigned" type="number" placeholder="Qty" defaultValue={1} />
                <select name="condition" className={selectClass} defaultValue="good">
                  {inventoryConditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {titleCase(condition)}
                    </option>
                  ))}
                </select>
                <div className="md:col-span-4">
                  <Button type="submit" size="sm">
                    Add item
                  </Button>
                </div>
              </form>
            </Card>
          </>
        ) : (
          <Card>
            <p className="text-slate-300">Select a room to view and edit its inventory.</p>
          </Card>
        )}
      </div>
    </main>
  );
}
