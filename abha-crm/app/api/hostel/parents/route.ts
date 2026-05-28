import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('student_id');
    const followUp = url.searchParams.get('follow_up');

    let query = supabaseAdmin
      .from('hostel_parent_communication')
      .select(
        'id, student_id, communication_date, channel, subject, notes, follow_up_required, follow_up_date, created_at, student:student_id(id, full_name)',
      )
      .order('communication_date', { ascending: false });

    if (studentId) query = query.eq('student_id', studentId);
    if (followUp === '1') query = query.eq('follow_up_required', true);

    const { data, error } = await query;
    // Resilient: if the table has not been migrated yet, return an empty list.
    if (error) {
      console.error('Parent communication query failed', error);
      return NextResponse.json({ ok: true, communications: [], tableMissing: true });
    }

    return NextResponse.json({ ok: true, communications: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch parent communications', error);
    return NextResponse.json({ ok: true, communications: [], tableMissing: true });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!payload.student_id) {
      return NextResponse.json({ ok: false, error: 'Student is required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('hostel_parent_communication')
      .insert({
        student_id: payload.student_id,
        office_id: currentStaff?.office_id || null,
        communication_date: payload.communication_date || new Date().toISOString().slice(0, 10),
        channel: payload.channel || 'call',
        subject: payload.subject || null,
        notes: payload.notes || null,
        follow_up_required: Boolean(payload.follow_up_required),
        follow_up_date: payload.follow_up_date || null,
        logged_by: currentStaff?.id ?? null,
      })
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Parent communication insert failed.');

    return NextResponse.json({ ok: true, communication: data });
  } catch (error) {
    console.error('Failed to log parent communication', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to log communication. Ensure the migration has been applied.' },
      { status: 500 },
    );
  }
}
