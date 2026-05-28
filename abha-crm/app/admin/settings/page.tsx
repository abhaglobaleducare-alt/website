'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';

interface Office {
  id: string;
  name: string;
  city: string;
  geo_latitude?: number | null;
  geo_longitude?: number | null;
  geo_radius_meters?: number | null;
}

interface Slab {
  id: string;
  slab_name: string;
  admissions_min: number;
  admissions_max: number | null;
  base_bonus: number;
  extra_bonus: number;
}

interface University {
  id: string;
  name: string;
  country: string;
  status: string;
}

interface StoreItem {
  id: string;
  item_name: string;
  current_stock: number;
  minimum_stock_alert: number;
}

const inputCls =
  'w-24 rounded-lg border border-slate-700 bg-slate-950/90 px-2 py-1 text-sm text-slate-100';

export default function AdminSettingsPage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [slabs, setSlabs] = useState<Slab[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [store, setStore] = useState<StoreItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({});
  const [msg, setMsg] = useState('');

  const loadAll = () => {
    fetch('/api/offices')
      .then((r) => r.json())
      .then((j) => setOffices(j.offices ?? []))
      .catch(() => undefined);
    fetch('/api/slabs')
      .then((r) => r.json())
      .then((j) => setSlabs(j.slabs ?? []))
      .catch(() => undefined);
    fetch('/api/universities')
      .then((r) => r.json())
      .then((j) => setUniversities(j.universities ?? []))
      .catch(() => undefined);
    fetch('/api/hostel/store')
      .then((r) => r.json())
      .then((j) => setStore(j.items ?? []))
      .catch(() => undefined);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const setDraft = (id: string, key: string, value: unknown) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));

  const saveOffice = async (office: Office) => {
    await fetch(`/api/offices/${office.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drafts[office.id] ?? {}),
    });
    setMsg('Office updated.');
    loadAll();
  };

  const saveSlab = async (slab: Slab) => {
    await fetch(`/api/slabs/${slab.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drafts[slab.id] ?? {}),
    });
    setMsg('Slab updated.');
    loadAll();
  };

  const saveUniversity = async (uni: University, status: string) => {
    await fetch(`/api/universities/${uni.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setMsg('University updated.');
    loadAll();
  };

  const saveStoreMin = async (item: StoreItem, value: number) => {
    await fetch(`/api/hostel/store/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minimum_stock_alert: value }),
    });
    setMsg('Minimum stock updated.');
    loadAll();
  };

  const addOffice = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    await fetch('/api/offices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: String(fd.get('name') ?? ''),
        city: String(fd.get('city') ?? ''),
        country: String(fd.get('country') ?? 'India'),
        geo_radius_meters: Number(fd.get('radius') ?? 300) || 300,
      }),
    });
    form.reset();
    loadAll();
  };

  const addUniversity = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    await fetch('/api/universities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: String(fd.get('name') ?? ''),
        country: String(fd.get('country') ?? 'Georgia'),
        status: 'active',
      }),
    });
    form.reset();
    loadAll();
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Admin · Settings</p>
            <h1 className="mt-2 text-3xl font-semibold">System settings</h1>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </header>
        {msg ? <p className="text-sm text-emerald-200">{msg}</p> : null}

        {/* Offices */}
        <Card>
          <h2 className="text-lg font-semibold">Office management</h2>
          <div className="mt-4 space-y-2">
            {offices.map((office) => (
              <div
                key={office.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-900/60 px-3 py-2 text-sm"
              >
                <span className="min-w-40 font-medium">{office.name}</span>
                <span className="text-slate-400">{office.city}</span>
                <label className="flex items-center gap-1 text-xs text-slate-400">
                  Radius (m)
                  <input
                    type="number"
                    defaultValue={office.geo_radius_meters ?? 300}
                    onChange={(e) =>
                      setDraft(office.id, 'geo_radius_meters', Number(e.target.value) || 0)
                    }
                    className={inputCls}
                  />
                </label>
                <label className="flex items-center gap-1 text-xs text-slate-400">
                  Lat
                  <input
                    type="number"
                    step="0.0001"
                    defaultValue={office.geo_latitude ?? ''}
                    onChange={(e) =>
                      setDraft(office.id, 'geo_latitude', Number(e.target.value) || null)
                    }
                    className={inputCls}
                  />
                </label>
                <label className="flex items-center gap-1 text-xs text-slate-400">
                  Lng
                  <input
                    type="number"
                    step="0.0001"
                    defaultValue={office.geo_longitude ?? ''}
                    onChange={(e) =>
                      setDraft(office.id, 'geo_longitude', Number(e.target.value) || null)
                    }
                    className={inputCls}
                  />
                </label>
                <Button size="sm" variant="ghost" onClick={() => saveOffice(office)}>
                  Save
                </Button>
              </div>
            ))}
          </div>
          <form className="mt-4 flex flex-wrap items-end gap-2" onSubmit={addOffice}>
            <Input name="name" placeholder="Office name" required className="w-44" />
            <Input name="city" placeholder="City" required className="w-36" />
            <Input name="country" placeholder="Country" defaultValue="India" className="w-28" />
            <Input
              name="radius"
              type="number"
              placeholder="Radius"
              defaultValue={300}
              className="w-24"
            />
            <Button size="sm" type="submit">
              Add office
            </Button>
          </form>
        </Card>

        {/* Slabs */}
        <Card>
          <h2 className="text-lg font-semibold">Achievement slab configuration</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 text-left text-slate-400">
                <tr>
                  <th className="px-2 py-2">Slab</th>
                  <th className="px-2 py-2">Min</th>
                  <th className="px-2 py-2">Max</th>
                  <th className="px-2 py-2">Base bonus</th>
                  <th className="px-2 py-2">Extra bonus</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((slab) => (
                  <tr key={slab.id} className="border-b border-white/5">
                    <td className="px-2 py-2 font-medium">{slab.slab_name}</td>
                    <td className="px-2 py-2">{slab.admissions_min}</td>
                    <td className="px-2 py-2">{slab.admissions_max ?? '∞'}</td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        defaultValue={slab.base_bonus}
                        onChange={(e) =>
                          setDraft(slab.id, 'base_bonus', Number(e.target.value) || 0)
                        }
                        className={inputCls}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        defaultValue={slab.extra_bonus}
                        onChange={(e) =>
                          setDraft(slab.id, 'extra_bonus', Number(e.target.value) || 0)
                        }
                        className={inputCls}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <Button size="sm" variant="ghost" onClick={() => saveSlab(slab)}>
                        Save
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Universities */}
        <Card>
          <h2 className="text-lg font-semibold">University management</h2>
          <div className="mt-4 space-y-2">
            {universities.map((uni) => (
              <div
                key={uni.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-900/60 px-3 py-2 text-sm"
              >
                <span className="min-w-56 font-medium">{uni.name}</span>
                <span className="text-slate-400">{uni.country}</span>
                <select
                  defaultValue={uni.status}
                  onChange={(e) => saveUniversity(uni, e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950/90 px-2 py-1 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            ))}
          </div>
          <form className="mt-4 flex flex-wrap items-end gap-2" onSubmit={addUniversity}>
            <Input name="name" placeholder="University name" required className="w-56" />
            <select
              name="country"
              defaultValue="Georgia"
              className="rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100"
            >
              <option value="Georgia">Georgia</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
            </select>
            <Button size="sm" type="submit">
              Add university
            </Button>
          </form>
        </Card>

        {/* Minimum stock alert levels */}
        <Card>
          <h2 className="text-lg font-semibold">Minimum stock alert levels</h2>
          {store.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No store items.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {store.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-900/60 px-3 py-2 text-sm"
                >
                  <span className="min-w-44 font-medium">{item.item_name}</span>
                  <span className="text-slate-400">Stock: {item.current_stock}</span>
                  <label className="flex items-center gap-1 text-xs text-slate-400">
                    Min alert
                    <input
                      type="number"
                      defaultValue={item.minimum_stock_alert}
                      onChange={(e) =>
                        setDraft(item.id, 'minimum_stock_alert', Number(e.target.value) || 0)
                      }
                      className={inputCls}
                    />
                  </label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      saveStoreMin(
                        item,
                        Number(drafts[item.id]?.minimum_stock_alert ?? item.minimum_stock_alert),
                      )
                    }
                  >
                    Save
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="border-white/10 bg-slate-900/40">
          <h2 className="text-lg font-semibold">Other settings</h2>
          <p className="mt-2 text-sm text-slate-400">
            Leave entitlements, expense approval limits, and system notification preferences are
            currently defined in code (lib/constants) and not yet stored per-record. Let me know if
            you want these persisted to dedicated tables.
          </p>
        </Card>
      </div>
    </main>
  );
}
