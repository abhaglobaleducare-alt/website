import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const officeId = url.searchParams.get('office_id');

    let query = supabaseAdmin
      .from('hostel_daily_log')
      .select('*')
      .order('log_date', { ascending: false })
      .limit(60);

    if (officeId) query = query.eq('office_id', officeId);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true, logs: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch daily logs', error);
    return NextResponse.json({ ok: false, error: 'Unable to load logs.' }, { status: 500 });
  }
}

// Upsert by (log_date, office_id) so re-submitting a day's log updates it.
export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!payload.log_date) {
      return NextResponse.json({ ok: false, error: 'Log date is required.' }, { status: 400 });
    }

    const officeId = payload.office_id || currentStaff?.office_id || null;

    const { data, error } = await supabaseAdmin
      .from('hostel_daily_log')
      .upsert(
        {
          log_date: payload.log_date,
          office_id: officeId,
          students_present: payload.students_present ?? 0,
          students_absent: payload.students_absent ?? 0,
          new_arrivals: payload.new_arrivals ?? 0,
          departures: payload.departures ?? 0,
          issues: payload.issues || null,
          meals_served: payload.meals_served || null,
          notable_events: payload.notable_events || null,
          created_by: currentStaff?.id ?? null,
        },
        { onConflict: 'log_date,office_id' },
      )
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Daily log upsert failed.');

    return NextResponse.json({ ok: true, log: data });
  } catch (error) {
    console.error('Failed to save daily log', error);
    return NextResponse.json({ ok: false, error: 'Unable to save daily log.' }, { status: 500 });
  }
}
