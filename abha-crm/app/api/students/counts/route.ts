import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get('scope') ?? 'staff';
    const country = url.searchParams.get('country');
    const university = url.searchParams.get('university');

    const query = supabaseAdmin.from('students').select('funnel_stage');

    if (scope === 'staff') {
      const currentStaff = await getCurrentStaffFromRequest(request);
      if (currentStaff?.id) {
        query.eq('assigned_staff_id', currentStaff.id);
      }
    }

    if (country) query.eq('selected_country', country);
    if (university) query.eq('selected_university', university);

    const { data, error } = await query;

    if (error) throw error;

    const counts: Record<string, number> = {};
    (data ?? []).forEach((row: unknown) => {
      const stage = (row as Record<string, unknown>).funnel_stage ?? 'Lead Generated';
      counts[String(stage)] = (counts[String(stage)] ?? 0) + 1;
    });

    return NextResponse.json({
      ok: true,
      counts,
      total: Object.values(counts).reduce((a, b) => a + b, 0),
    });
  } catch (err) {
    console.error('Failed to fetch student counts', err);
    return NextResponse.json({ ok: false, error: 'Unable to fetch counts' }, { status: 500 });
  }
}
