import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

// Assign a student to a room and keep the room occupancy/status in sync.
export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!payload.student_id || !payload.room_id) {
      return NextResponse.json(
        { ok: false, error: 'Student and room are required.' },
        { status: 400 },
      );
    }

    const { data: room, error: roomError } = await supabaseAdmin
      .from('hostel_rooms')
      .select('id, capacity, current_occupancy')
      .eq('id', payload.room_id)
      .maybeSingle();

    if (roomError || !room) throw roomError ?? new Error('Room not found.');

    if ((room.current_occupancy ?? 0) >= (room.capacity ?? 1)) {
      return NextResponse.json(
        { ok: false, error: 'Room is already at capacity.' },
        { status: 400 },
      );
    }

    const { data: assignment, error } = await supabaseAdmin
      .from('hostel_room_assignments')
      .insert({
        student_id: payload.student_id,
        room_id: payload.room_id,
        check_in_date: payload.check_in_date || new Date().toISOString().slice(0, 10),
        expected_check_out: payload.expected_check_out || null,
        monthly_fee_usd: payload.monthly_fee_usd ?? null,
        status: 'active',
        assigned_by: currentStaff?.id ?? null,
        notes: payload.notes || null,
      })
      .select()
      .single();

    if (error || !assignment) throw error ?? new Error('Assignment failed.');

    const newOccupancy = (room.current_occupancy ?? 0) + 1;
    await supabaseAdmin
      .from('hostel_rooms')
      .update({ current_occupancy: newOccupancy, status: 'occupied' })
      .eq('id', payload.room_id);

    return NextResponse.json({ ok: true, assignment });
  } catch (error) {
    console.error('Failed to assign student', error);
    return NextResponse.json({ ok: false, error: 'Unable to assign student.' }, { status: 500 });
  }
}
