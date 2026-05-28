import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase/server';

// Check a student out of a room and free up occupancy.
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data: assignment, error: fetchError } = await supabaseAdmin
      .from('hostel_room_assignments')
      .select('id, room_id, status')
      .eq('id', params.id)
      .maybeSingle();

    if (fetchError || !assignment) throw fetchError ?? new Error('Assignment not found.');

    const { error } = await supabaseAdmin
      .from('hostel_room_assignments')
      .update({
        status: 'checked_out',
        actual_check_out: new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    if (error) throw error;

    if (assignment.room_id) {
      const { data: room } = await supabaseAdmin
        .from('hostel_rooms')
        .select('id, current_occupancy')
        .eq('id', assignment.room_id)
        .maybeSingle();

      if (room) {
        const newOccupancy = Math.max((room.current_occupancy ?? 0) - 1, 0);
        await supabaseAdmin
          .from('hostel_rooms')
          .update({
            current_occupancy: newOccupancy,
            status: newOccupancy > 0 ? 'occupied' : 'available',
          })
          .eq('id', assignment.room_id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to check out student', error);
    return NextResponse.json({ ok: false, error: 'Unable to check out student.' }, { status: 500 });
  }
}
