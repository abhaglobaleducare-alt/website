import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../lib/auth/current';
import { leaveEntitlements, leaveTypes, type LeaveType } from '../../../lib/constants/hr';

function computeBalances(approved: { leave_type: string; days_count: number }[]) {
  const usedByType: Record<string, number> = {};
  approved.forEach((row) => {
    usedByType[row.leave_type] = (usedByType[row.leave_type] ?? 0) + Number(row.days_count ?? 0);
  });

  return leaveTypes.map((type) => {
    const entitlement = leaveEntitlements[type as LeaveType];
    const used = usedByType[type] ?? 0;
    return {
      type,
      entitlement,
      used,
      remaining: entitlement === null ? null : Math.max(entitlement - used, 0),
    };
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get('scope') ?? 'staff';
    const status = url.searchParams.get('status');
    const staffId = url.searchParams.get('staff_id');

    let query = supabaseAdmin
      .from('leave_applications')
      .select(
        'id, user_id, leave_type, from_date, to_date, days_count, reason, status, approved_by, approved_at, rejection_reason, created_at',
      )
      .order('created_at', { ascending: false });

    let currentUserId: string | null = null;
    if (scope === 'staff') {
      const currentStaff = await getCurrentStaffFromRequest(request);
      currentUserId = currentStaff?.id ?? null;
      if (currentUserId) {
        query = query.eq('user_id', currentUserId);
      }
    }

    if (staffId) query = query.eq('user_id', staffId);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    const applications = data ?? [];

    // Leave balances for the current staff member (current calendar year, approved only).
    let balances = null;
    if (scope === 'staff' && currentUserId) {
      const yearStart = `${new Date().getFullYear()}-01-01`;
      const { data: approved } = await supabaseAdmin
        .from('leave_applications')
        .select('leave_type, days_count')
        .eq('user_id', currentUserId)
        .eq('status', 'approved')
        .gte('from_date', yearStart);
      balances = computeBalances(approved ?? []);
    }

    return NextResponse.json({ ok: true, applications, balances });
  } catch (error) {
    console.error('Failed to fetch leave applications', error);
    return NextResponse.json({ ok: false, error: 'Unable to load leave.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!currentStaff?.id) {
      return NextResponse.json(
        { ok: false, error: 'Unable to determine current staff.' },
        { status: 400 },
      );
    }

    if (!payload.leave_type || !payload.from_date || !payload.to_date || !payload.reason) {
      return NextResponse.json(
        { ok: false, error: 'Leave type, dates, and reason are required.' },
        { status: 400 },
      );
    }

    if (payload.to_date < payload.from_date) {
      return NextResponse.json(
        { ok: false, error: 'End date cannot be before start date.' },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('leave_applications')
      .insert({
        user_id: currentStaff.id,
        leave_type: payload.leave_type,
        from_date: payload.from_date,
        to_date: payload.to_date,
        reason: payload.reason,
        status: 'pending',
      })
      .select()
      .single();

    if (error || !data) {
      throw error ?? new Error('Leave insert failed.');
    }

    return NextResponse.json({ ok: true, application: data });
  } catch (error) {
    console.error('Failed to create leave application', error);
    return NextResponse.json({ ok: false, error: 'Unable to submit leave.' }, { status: 500 });
  }
}
