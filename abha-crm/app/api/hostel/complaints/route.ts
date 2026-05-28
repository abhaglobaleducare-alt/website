import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');

    let query = supabaseAdmin
      .from('hostel_complaints')
      .select(
        'id, student_id, room_id, complaint_title, complaint_description, category, priority, status, resolution_notes, raised_at, resolved_at, student:student_id(id, full_name), room:room_id(id, room_number)',
      )
      .order('raised_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true, complaints: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch complaints', error);
    return NextResponse.json({ ok: false, error: 'Unable to load complaints.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));

    if (!payload.complaint_title || !payload.complaint_description) {
      return NextResponse.json(
        { ok: false, error: 'Title and description are required.' },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('hostel_complaints')
      .insert({
        student_id: payload.student_id || null,
        room_id: payload.room_id || null,
        complaint_title: payload.complaint_title,
        complaint_description: payload.complaint_description,
        category: payload.category || 'other',
        priority: payload.priority || 'medium',
        status: 'open',
      })
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Complaint insert failed.');

    return NextResponse.json({ ok: true, complaint: data });
  } catch (error) {
    console.error('Failed to create complaint', error);
    return NextResponse.json({ ok: false, error: 'Unable to log complaint.' }, { status: 500 });
  }
}
