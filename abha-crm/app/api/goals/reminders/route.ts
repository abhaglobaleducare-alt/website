import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

// Returns the current staff member's active goals whose reminder_time matches the
// supplied wall-clock time (HH:MM). Time is sent by the client so reminders fire in
// the user's local timezone rather than the server's.
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const time = url.searchParams.get('time'); // expected "HH:MM"

    const currentStaff = await getCurrentStaffFromRequest(request);
    if (!currentStaff?.id) {
      return NextResponse.json({ ok: true, goals: [] });
    }

    let query = supabaseAdmin
      .from('goals')
      .select('id, title, priority, due_date, reminder_time, status')
      .eq('user_id', currentStaff.id)
      .not('reminder_time', 'is', null)
      .in('status', ['pending', 'in_progress', 'overdue']);

    if (time && /^\d{2}:\d{2}$/.test(time)) {
      // reminder_time is stored as TIME (HH:MM:SS); match the HH:MM prefix.
      query = query.gte('reminder_time', `${time}:00`).lte('reminder_time', `${time}:59`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, goals: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch goal reminders', error);
    return NextResponse.json({ ok: false, error: 'Unable to load reminders.' }, { status: 500 });
  }
}
