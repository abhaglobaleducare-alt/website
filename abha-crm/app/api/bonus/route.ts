import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../lib/auth/current';
import { getSlabs, summarizeBonuses, type BonusRow } from '../../../lib/bonus';

const BONUS_SELECT =
  'id, staff_id, student_id, bonus_type, bonus_amount, status, eligible_date, approved_at, disbursed_date, referrer_name, referrer_phone, referrer_amount, referrer_paid, referrer_paid_date, notes, created_at';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get('scope') ?? 'staff';
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');

    // Staff scope: return the current user's salary + slab summary + their bonuses.
    if (scope === 'staff') {
      const currentStaff = await getCurrentStaffFromRequest(request);
      if (!currentStaff?.id) {
        return NextResponse.json({ ok: true, bonuses: [], summary: null, profile: null });
      }

      const [{ data: profile }, { data: bonuses }, slabs] = await Promise.all([
        supabaseAdmin
          .from('users')
          .select('id, full_name, base_salary, is_bonus_eligible, bonus_type')
          .eq('id', currentStaff.id)
          .maybeSingle(),
        supabaseAdmin
          .from('admission_bonus')
          .select(BONUS_SELECT)
          .eq('staff_id', currentStaff.id)
          .order('created_at', { ascending: false }),
        getSlabs(),
      ]);

      const summary = summarizeBonuses(slabs, (bonuses ?? []) as BonusRow[]);
      return NextResponse.json({ ok: true, bonuses: bonuses ?? [], summary, profile, slabs });
    }

    // Admin scope: all bonuses with staff + student names.
    let query = supabaseAdmin
      .from('admission_bonus')
      .select(
        `${BONUS_SELECT}, staff:staff_id(id, full_name, bonus_type), student:student_id(id, full_name, student_code)`,
      )
      .order('created_at', { ascending: false });

    if (type) query = query.eq('bonus_type', type);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, bonuses: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch bonuses', error);
    return NextResponse.json({ ok: false, error: 'Unable to load bonuses.' }, { status: 500 });
  }
}

// Admin: manually record a reference distribution bonus tied to a student.
export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));

    if (!payload.staff_id || !payload.student_id) {
      return NextResponse.json(
        { ok: false, error: 'Staff and student are required.' },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('admission_bonus')
      .insert({
        staff_id: payload.staff_id,
        student_id: payload.student_id,
        bonus_type: payload.bonus_type ?? 'reference_distribution',
        bonus_amount: payload.bonus_amount ?? 0,
        trigger_event: 'manual_entry',
        status: 'pending_approval',
        referrer_name: payload.referrer_name || null,
        referrer_phone: payload.referrer_phone || null,
        referrer_amount: payload.referrer_amount ?? null,
        notes: payload.notes || null,
      })
      .select()
      .single();

    if (error || !data) {
      throw error ?? new Error('Bonus insert failed.');
    }

    return NextResponse.json({ ok: true, bonus: data });
  } catch (error) {
    console.error('Failed to create bonus', error);
    return NextResponse.json({ ok: false, error: 'Unable to create bonus.' }, { status: 500 });
  }
}
