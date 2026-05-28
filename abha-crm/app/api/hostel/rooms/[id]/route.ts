import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { data: room, error } = await supabaseAdmin
      .from('hostel_rooms')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!room) {
      return NextResponse.json({ ok: false, error: 'Room not found.' }, { status: 404 });
    }

    const { data: occupants } = await supabaseAdmin
      .from('hostel_room_assignments')
      .select(
        'id, student_id, check_in_date, expected_check_out, monthly_fee_usd, status, student:student_id(id, full_name, student_code, phone, selected_university)',
      )
      .eq('room_id', id)
      .eq('status', 'active');

    return NextResponse.json({ ok: true, room, occupants: occupants ?? [] });
  } catch (error) {
    console.error('Failed to fetch room', error);
    return NextResponse.json({ ok: false, error: 'Unable to load room.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() };

    const editable = [
      'room_number',
      'floor_number',
      'room_type',
      'capacity',
      'monthly_rent_usd',
      'status',
      'notes',
      'office_id',
    ] as const;
    editable.forEach((key) => {
      if (body[key] !== undefined) updateFields[key] = body[key];
    });

    const { data, error } = await supabaseAdmin
      .from('hostel_rooms')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Room update failed.');

    return NextResponse.json({ ok: true, room: data });
  } catch (error) {
    console.error('Failed to update room', error);
    return NextResponse.json({ ok: false, error: 'Unable to update room.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin.from('hostel_rooms').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete room', error);
    return NextResponse.json({ ok: false, error: 'Unable to delete room.' }, { status: 500 });
  }
}
