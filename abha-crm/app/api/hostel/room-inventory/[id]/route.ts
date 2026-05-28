import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../../lib/auth/current';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);
    const updateFields: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      last_checked_date: new Date().toISOString().slice(0, 10),
      checked_by: currentStaff?.id ?? null,
    };

    ['item_name', 'item_category', 'quantity_assigned', 'condition', 'notes'].forEach((key) => {
      if (body[key] !== undefined) updateFields[key] = body[key];
    });

    const { data, error } = await supabaseAdmin
      .from('room_inventory')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Room inventory update failed.');

    return NextResponse.json({ ok: true, item: data });
  } catch (error) {
    console.error('Failed to update room inventory item', error);
    return NextResponse.json({ ok: false, error: 'Unable to update item.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin.from('room_inventory').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete room inventory item', error);
    return NextResponse.json({ ok: false, error: 'Unable to delete item.' }, { status: 500 });
  }
}
