import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase/server';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() };

    [
      'item_name',
      'item_category',
      'unit',
      'current_stock',
      'minimum_stock_alert',
      'unit_cost',
      'storage_location',
      'notes',
    ].forEach((key) => {
      if (body[key] !== undefined) updateFields[key] = body[key];
    });

    const { data, error } = await supabaseAdmin
      .from('hostel_store')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Store item update failed.');

    return NextResponse.json({ ok: true, item: data });
  } catch (error) {
    console.error('Failed to update store item', error);
    return NextResponse.json({ ok: false, error: 'Unable to update item.' }, { status: 500 });
  }
}
