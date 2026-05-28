import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('achievement_slabs')
      .select('*')
      .order('admissions_min', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ ok: true, slabs: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch slabs', error);
    return NextResponse.json({ ok: false, error: 'Unable to load slabs.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    if (!payload.slab_name || payload.admissions_min == null) {
      return NextResponse.json(
        { ok: false, error: 'Slab name and minimum admissions are required.' },
        { status: 400 },
      );
    }
    const { data, error } = await supabaseAdmin
      .from('achievement_slabs')
      .insert({
        slab_name: payload.slab_name,
        slab_color: payload.slab_color || null,
        slab_icon: payload.slab_icon || null,
        admissions_min: payload.admissions_min,
        admissions_max: payload.admissions_max ?? null,
        base_bonus: payload.base_bonus ?? 20000,
        extra_bonus: payload.extra_bonus ?? 0,
        has_annual_reward: Boolean(payload.has_annual_reward),
        annual_reward_description: payload.annual_reward_description || null,
      })
      .select()
      .single();
    if (error || !data) throw error ?? new Error('Slab insert failed.');
    return NextResponse.json({ ok: true, slab: data });
  } catch (error) {
    console.error('Failed to create slab', error);
    return NextResponse.json({ ok: false, error: 'Unable to create slab.' }, { status: 500 });
  }
}
