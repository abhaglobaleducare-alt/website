import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function computeWorkHours(checkIn: string, checkOut: string) {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  return Math.max(0, (end - start) / (1000 * 60 * 60));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') ?? 'admin';

    let query = supabaseAdmin
      .from('attendance')
      .select(
        'id, date, check_in_time, check_out_time, check_in_address, work_hours, is_within_geofence, user_id, users(full_name, role, office_id)',
      )
      .order('date', { ascending: false });

    if (scope === 'today') {
      query = query.eq('date', toISODate(new Date()));
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, attendance: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch attendance', error);
    return NextResponse.json({ ok: false, error: 'Unable to load attendance.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const today = toISODate(new Date());

    if (body.action === 'checkin') {
      const { error } = await supabaseAdmin.from('attendance').upsert(
        {
          user_id: body.user_id,
          date: today,
          check_in_time: new Date().toISOString(),
          check_in_lat: body.check_in_lat ?? null,
          check_in_lng: body.check_in_lng ?? null,
          check_in_address: body.check_in_address ?? null,
          check_in_selfie_url: body.check_in_selfie_url ?? null,
          is_within_geofence: Boolean(body.is_within_geofence),
          work_type: body.work_type ?? 'office',
        },
        { onConflict: 'user_id,date' },
      );

      if (error) {
        throw error;
      }

      return NextResponse.json({ ok: true, message: 'Checked in successfully.' });
    }

    if (body.action === 'checkout') {
      const { data: existing, error: fetchError } = await supabaseAdmin
        .from('attendance')
        .select('check_in_time')
        .eq('user_id', body.user_id)
        .eq('date', today)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      const workHours = existing?.check_in_time
        ? computeWorkHours(existing.check_in_time, new Date().toISOString())
        : 0;

      const { error } = await supabaseAdmin
        .from('attendance')
        .update({
          check_out_time: new Date().toISOString(),
          daily_summary: body.daily_summary ?? null,
          work_hours: workHours,
          admin_note: body.admin_note ?? null,
        })
        .eq('user_id', body.user_id)
        .eq('date', today);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        ok: true,
        message: 'Checked out successfully.',
        work_hours: workHours,
      });
    }

    return NextResponse.json({ ok: false, error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    console.error('Attendance update failed', error);
    return NextResponse.json({ ok: false, error: 'Unable to update attendance.' }, { status: 500 });
  }
}
