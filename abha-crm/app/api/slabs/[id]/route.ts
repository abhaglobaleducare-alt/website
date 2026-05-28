import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const updateFields: Record<string, unknown> = {};
    [
      'slab_name',
      'slab_color',
      'slab_icon',
      'admissions_min',
      'admissions_max',
      'base_bonus',
      'extra_bonus',
      'has_annual_reward',
      'annual_reward_description',
    ].forEach((key) => {
      if (body[key] !== undefined) updateFields[key] = body[key];
    });

    const { data, error } = await supabaseAdmin
      .from('achievement_slabs')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();
    if (error || !data) throw error ?? new Error('Slab update failed.');
    return NextResponse.json({ ok: true, slab: data });
  } catch (error) {
    console.error('Failed to update slab', error);
    return NextResponse.json({ ok: false, error: 'Unable to update slab.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin.from('achievement_slabs').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete slab', error);
    return NextResponse.json({ ok: false, error: 'Unable to delete slab.' }, { status: 500 });
  }
}
