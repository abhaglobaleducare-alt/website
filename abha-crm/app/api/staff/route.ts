import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(
        'id, email, full_name, phone, role, designation, office_id, status, base_salary, is_bonus_eligible, invite_token, invite_sent_at, invite_expires_at',
      )
      .order('full_name');

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, staff: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch staff users', error);
    return NextResponse.json({ ok: false, error: 'Unable to load staff users.' }, { status: 500 });
  }
}
