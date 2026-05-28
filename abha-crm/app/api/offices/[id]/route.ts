import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() };
    [
      'name',
      'city',
      'country',
      'geo_latitude',
      'geo_longitude',
      'geo_radius_meters',
      'address',
      'phone',
      'email',
      'is_active',
    ].forEach((key) => {
      if (body[key] !== undefined) updateFields[key] = body[key];
    });

    const { data, error } = await supabaseAdmin
      .from('offices')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();
    if (error || !data) throw error ?? new Error('Office update failed.');
    return NextResponse.json({ ok: true, office: data });
  } catch (error) {
    console.error('Failed to update office', error);
    return NextResponse.json({ ok: false, error: 'Unable to update office.' }, { status: 500 });
  }
}
