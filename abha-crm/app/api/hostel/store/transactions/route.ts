import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../../lib/auth/current';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const itemId = url.searchParams.get('store_item_id');
    const type = url.searchParams.get('type');

    let query = supabaseAdmin
      .from('store_transactions')
      .select(
        'id, store_item_id, transaction_type, quantity, transaction_date, purpose, issued_to, room_id, notes, created_at, item:store_item_id(item_name, unit, unit_cost), room:room_id(room_number), creator:created_by(full_name)',
      )
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (from) query = query.gte('transaction_date', from);
    if (to) query = query.lte('transaction_date', to);
    if (itemId) query = query.eq('store_item_id', itemId);
    if (type) query = query.eq('transaction_type', type);

    const { data, error } = await query;
    if (error) {
      console.error('Store transactions query failed (table may not be migrated)', error);
      return NextResponse.json({ ok: true, transactions: [], tableMissing: true });
    }

    return NextResponse.json({ ok: true, transactions: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch store transactions', error);
    return NextResponse.json({ ok: true, transactions: [], tableMissing: true });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!payload.store_item_id || !payload.transaction_type || payload.quantity == null) {
      return NextResponse.json(
        { ok: false, error: 'Item, type, and quantity are required.' },
        { status: 400 },
      );
    }

    const quantity = Math.abs(Number(payload.quantity)) || 0;

    const { data: transaction, error } = await supabaseAdmin
      .from('store_transactions')
      .insert({
        store_item_id: payload.store_item_id,
        transaction_type: payload.transaction_type,
        quantity,
        transaction_date: payload.transaction_date || new Date().toISOString().slice(0, 10),
        purpose: payload.purpose || null,
        issued_to: payload.issued_to || null,
        room_id: payload.room_id || null,
        notes: payload.notes || null,
        created_by: currentStaff?.id ?? null,
      })
      .select()
      .single();

    if (error || !transaction) throw error ?? new Error('Transaction insert failed.');

    // Keep current_stock in sync: issue decreases; purchase/return/adjustment increase.
    const { data: item } = await supabaseAdmin
      .from('hostel_store')
      .select('current_stock')
      .eq('id', payload.store_item_id)
      .maybeSingle();

    if (item) {
      const delta = payload.transaction_type === 'issue' ? -quantity : quantity;
      const newStock = Math.max((item.current_stock ?? 0) + delta, 0);
      await supabaseAdmin
        .from('hostel_store')
        .update({ current_stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', payload.store_item_id);
    }

    return NextResponse.json({ ok: true, transaction });
  } catch (error) {
    console.error('Failed to record store transaction', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to record transaction.' },
      { status: 500 },
    );
  }
}
