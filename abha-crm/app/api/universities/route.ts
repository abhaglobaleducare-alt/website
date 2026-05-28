import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('universities')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ ok: true, universities: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch universities', error);
    return NextResponse.json({ ok: false, error: 'Unable to load universities.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    if (!payload.name || !payload.country) {
      return NextResponse.json(
        { ok: false, error: 'Name and country are required.' },
        { status: 400 },
      );
    }
    const { data, error } = await supabaseAdmin
      .from('universities')
      .insert({
        name: payload.name,
        short_name: payload.short_name || null,
        country: payload.country,
        city: payload.city || null,
        status: payload.status || 'active',
        mbbs_duration_years: payload.mbbs_duration_years ?? 6,
        annual_fee_usd: payload.annual_fee_usd ?? null,
        sort_order: payload.sort_order ?? 0,
      })
      .select()
      .single();
    if (error || !data) throw error ?? new Error('University insert failed.');
    return NextResponse.json({ ok: true, university: data });
  } catch (error) {
    console.error('Failed to create university', error);
    return NextResponse.json({ ok: false, error: 'Unable to create university.' }, { status: 500 });
  }
}
