import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hostel_store')
      .select(
        'id, item_name, item_category, unit, current_stock, minimum_stock_alert, unit_cost, storage_location, notes, updated_at',
      )
      .order('item_name', { ascending: true });

    if (error) {
      console.error('Store query failed (table may not be migrated)', error);
      return NextResponse.json({ ok: true, items: [], tableMissing: true });
    }

    return NextResponse.json({ ok: true, items: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch store items', error);
    return NextResponse.json({ ok: true, items: [], tableMissing: true });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!payload.item_name || !payload.item_category) {
      return NextResponse.json(
        { ok: false, error: 'Item name and category are required.' },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('hostel_store')
      .insert({
        office_id: currentStaff?.office_id ?? null,
        item_name: payload.item_name,
        item_category: payload.item_category,
        unit: payload.unit || null,
        current_stock: payload.current_stock ?? 0,
        minimum_stock_alert: payload.minimum_stock_alert ?? 5,
        unit_cost: payload.unit_cost ?? null,
        storage_location: payload.storage_location || null,
        notes: payload.notes || null,
      })
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Store item insert failed.');

    return NextResponse.json({ ok: true, item: data });
  } catch (error) {
    console.error('Failed to create store item', error);
    return NextResponse.json({ ok: false, error: 'Unable to save item.' }, { status: 500 });
  }
}
