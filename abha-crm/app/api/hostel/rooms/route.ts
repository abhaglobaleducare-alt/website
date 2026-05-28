import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const officeId = url.searchParams.get('office_id');

    let query = supabaseAdmin
      .from('hostel_rooms')
      .select(
        'id, room_number, floor_number, room_type, capacity, current_occupancy, monthly_rent_usd, status, office_id, notes, created_at',
      )
      .order('room_number', { ascending: true });

    if (status) query = query.eq('status', status);
    if (officeId) query = query.eq('office_id', officeId);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true, rooms: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch rooms', error);
    return NextResponse.json({ ok: false, error: 'Unable to load rooms.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!payload.room_number) {
      return NextResponse.json({ ok: false, error: 'Room number is required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('hostel_rooms')
      .insert({
        room_number: payload.room_number,
        floor_number: payload.floor_number ?? null,
        room_type: payload.room_type || null,
        capacity: payload.capacity ?? 1,
        current_occupancy: 0,
        monthly_rent_usd: payload.monthly_rent_usd ?? null,
        status: payload.status || 'available',
        office_id: payload.office_id || currentStaff?.office_id || null,
        notes: payload.notes || null,
      })
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Room insert failed.');

    return NextResponse.json({ ok: true, room: data });
  } catch (error) {
    console.error('Failed to create room', error);
    return NextResponse.json({ ok: false, error: 'Unable to create room.' }, { status: 500 });
  }
}
