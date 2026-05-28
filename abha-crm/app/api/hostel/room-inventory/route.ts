import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const roomId = url.searchParams.get('room_id');

    let query = supabaseAdmin
      .from('room_inventory')
      .select(
        'id, room_id, item_name, item_category, quantity_assigned, condition, notes, last_checked_date, room:room_id(room_number)',
      )
      .order('item_name', { ascending: true });

    if (roomId) query = query.eq('room_id', roomId);

    const { data, error } = await query;
    if (error) {
      console.error('Room inventory query failed (table may not be migrated)', error);
      return NextResponse.json({ ok: true, items: [], tableMissing: true });
    }

    return NextResponse.json({ ok: true, items: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch room inventory', error);
    return NextResponse.json({ ok: true, items: [], tableMissing: true });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    // Mark every item in a room as inspected today.
    if (payload.action === 'inspect') {
      if (!payload.room_id) {
        return NextResponse.json({ ok: false, error: 'Room is required.' }, { status: 400 });
      }
      const { error } = await supabaseAdmin
        .from('room_inventory')
        .update({
          last_checked_date: new Date().toISOString().slice(0, 10),
          checked_by: currentStaff?.id ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('room_id', payload.room_id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (!payload.room_id || !payload.item_name) {
      return NextResponse.json(
        { ok: false, error: 'Room and item name are required.' },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('room_inventory')
      .insert({
        room_id: payload.room_id,
        item_name: payload.item_name,
        item_category: payload.item_category || 'other',
        quantity_assigned: payload.quantity_assigned ?? 0,
        condition: payload.condition || 'good',
        notes: payload.notes || null,
        last_checked_date: new Date().toISOString().slice(0, 10),
        checked_by: currentStaff?.id ?? null,
      })
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Room inventory insert failed.');

    return NextResponse.json({ ok: true, item: data });
  } catch (error) {
    console.error('Failed to save room inventory item', error);
    return NextResponse.json({ ok: false, error: 'Unable to save item.' }, { status: 500 });
  }
}
