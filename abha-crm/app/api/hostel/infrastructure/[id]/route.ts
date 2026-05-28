import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase/server';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() };

    [
      'item_name',
      'item_category',
      'total_quantity',
      'good_condition',
      'damaged',
      'under_repair',
      'disposed',
      'unit_cost',
      'last_inspection_date',
      'notes',
    ].forEach((key) => {
      if (body[key] !== undefined) updateFields[key] = body[key];
    });

    const { data, error } = await supabaseAdmin
      .from('hostel_infrastructure')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Infrastructure update failed.');

    return NextResponse.json({ ok: true, item: data });
  } catch (error) {
    console.error('Failed to update infrastructure item', error);
    return NextResponse.json({ ok: false, error: 'Unable to update item.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin
      .from('hostel_infrastructure')
      .delete()
      .eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete infrastructure item', error);
    return NextResponse.json({ ok: false, error: 'Unable to delete item.' }, { status: 500 });
  }
}
