import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const updateFields: Record<string, unknown> = {};
    [
      'name',
      'short_name',
      'country',
      'city',
      'status',
      'mbbs_duration_years',
      'annual_fee_usd',
      'sort_order',
    ].forEach((key) => {
      if (body[key] !== undefined) updateFields[key] = body[key];
    });

    const { data, error } = await supabaseAdmin
      .from('universities')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();
    if (error || !data) throw error ?? new Error('University update failed.');
    return NextResponse.json({ ok: true, university: data });
  } catch (error) {
    console.error('Failed to update university', error);
    return NextResponse.json({ ok: false, error: 'Unable to update university.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin.from('universities').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete university', error);
    return NextResponse.json({ ok: false, error: 'Unable to delete university.' }, { status: 500 });
  }
}
