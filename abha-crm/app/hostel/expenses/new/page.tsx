'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import {
  expenseCategories,
  expenseItemSuggestions,
  expenseCurrencies,
  expensePaymentTypes,
  titleCase,
} from '../../../../lib/constants/hostel-ops';

const today = new Date().toISOString().slice(0, 10);
const selectClass =
  'w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/30';

export default function NewExpensePage() {
  const [category, setCategory] = useState(expenseCategories[0].value as string);
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [totalEdited, setTotalEdited] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const autoTotal = useMemo(() => {
    const q = Number(quantity) || 0;
    const u = Number(unitCost) || 0;
    return q && u ? (q * u).toFixed(2) : '';
  }, [quantity, unitCost]);

  const effectiveTotal = totalEdited ? totalCost : autoTotal;
  const suggestions = expenseItemSuggestions[category] ?? [];

  const handleReceipt = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    if (json.ok) {
      setReceiptUrl(json.url);
      setStatus('Receipt uploaded.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      expense_date: String(formData.get('expense_date') ?? ''),
      expense_category: category,
      item_name: String(formData.get('item_name') ?? '').trim(),
      quantity: Number(quantity) || null,
      unit: String(formData.get('unit') ?? '').trim() || null,
      unit_cost: Number(unitCost) || null,
      total_cost: Number(effectiveTotal) || 0,
      currency: String(formData.get('currency') ?? 'GEL'),
      payment_type: String(formData.get('payment_type') ?? ''),
      vendor_name: String(formData.get('vendor_name') ?? '').trim() || null,
      vendor_phone: String(formData.get('vendor_phone') ?? '').trim() || null,
      receipt_url: receiptUrl || null,
      notes: String(formData.get('notes') ?? '').trim() || null,
    };

    const res = await fetch('/api/hostel/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setStatus('Expense submitted for approval. Redirecting…');
      window.setTimeout(() => {
        window.location.href = '/hostel/expenses';
      }, 800);
    } else {
      setStatus(json.error ?? 'Could not save expense.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-saffron">Hostel · Expenses</p>
            <h1 className="mt-2 text-3xl font-semibold">Add expense</h1>
          </div>
          <Link href="/hostel/expenses">
            <Button variant="ghost">Back to expenses</Button>
          </Link>
        </header>

        <Card>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="expense_date">
              Date
              <Input
                id="expense_date"
                name="expense_date"
                type="date"
                defaultValue={today}
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="expense_category">
              Category
              <select
                id="expense_category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={selectClass}
              >
                {expenseCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200 md:col-span-2" htmlFor="item_name">
              Item name
              <Input id="item_name" name="item_name" list="item-suggestions" required />
              <datalist id="item-suggestions">
                {suggestions.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="quantity">
              Quantity
              <Input
                id="quantity"
                type="number"
                step="0.001"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="unit">
              Unit
              <Input id="unit" name="unit" placeholder="kg, litre, pcs…" />
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
            <label className="space-y-2 text-sm text-slate-200" htmlFor="total_cost">
              Total cost (auto)
              <Input
                id="total_cost"
                type="number"
                step="0.01"
                value={effectiveTotal}
                onChange={(event) => {
                  setTotalEdited(true);
                  setTotalCost(event.target.value);
                }}
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="currency">
              Currency
              <select id="currency" name="currency" defaultValue="GEL" className={selectClass}>
                {expenseCurrencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="payment_type">
              Payment type
              <select id="payment_type" name="payment_type" className={selectClass}>
                {expensePaymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {titleCase(type)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="vendor_name">
              Vendor name
              <Input id="vendor_name" name="vendor_name" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="vendor_phone">
              Vendor phone
              <Input id="vendor_phone" name="vendor_phone" type="tel" />
            </label>
            <label className="space-y-2 text-sm text-slate-200" htmlFor="receipt">
              Receipt photo
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
              <textarea
                id="notes"
                name="notes"
                className="min-h-[70px] w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-saffron"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Save & submit for approval'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
