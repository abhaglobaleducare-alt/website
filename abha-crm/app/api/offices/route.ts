import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('offices')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ ok: true, offices: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch offices', error);
    return NextResponse.json({ ok: false, error: 'Unable to load offices.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    if (!payload.name || !payload.city) {
      return NextResponse.json(
        { ok: false, error: 'Name and city are required.' },
        { status: 400 },
      );
    }
    const { data, error } = await supabaseAdmin
      .from('offices')
      .insert({
        name: payload.name,
        city: payload.city,
        country: payload.country || 'India',
        geo_latitude: payload.geo_latitude ?? null,
        geo_longitude: payload.geo_longitude ?? null,
        geo_radius_meters: payload.geo_radius_meters ?? 300,
        address: payload.address || null,
        phone: payload.phone || null,
        email: payload.email || null,
      })
      .select()
      .single();
    if (error || !data) throw error ?? new Error('Office insert failed.');
    return NextResponse.json({ ok: true, office: data });
  } catch (error) {
    console.error('Failed to create office', error);
    return NextResponse.json({ ok: false, error: 'Unable to create office.' }, { status: 500 });
  }
}
