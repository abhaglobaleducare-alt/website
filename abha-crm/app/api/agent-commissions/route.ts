import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../lib/auth/current';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let query = supabaseAdmin
      .from('agent_commissions')
      .select(
        'id, agent_name, agent_phone, service_type, service_description, commission_amount, currency, payment_date, status, created_at, student:student_id(id, full_name, student_code)',
      )
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) {
      console.error('Agent commissions query failed (table may not be migrated)', error);
      return NextResponse.json({ ok: true, commissions: [], tableMissing: true });
    }

    return NextResponse.json({ ok: true, commissions: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch agent commissions', error);
    return NextResponse.json({ ok: true, commissions: [], tableMissing: true });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!payload.agent_name || !payload.service_type || payload.commission_amount == null) {
      return NextResponse.json(
        { ok: false, error: 'Agent name, service type, and amount are required.' },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('agent_commissions')
      .insert({
        office_id: currentStaff?.office_id ?? null,
        agent_name: payload.agent_name,
        agent_phone: payload.agent_phone || null,
        service_type: payload.service_type,
        service_description: payload.service_description || null,
        student_id: payload.student_id || null,
        commission_amount: payload.commission_amount,
        currency: payload.currency || 'GEL',
        status: 'pending',
        created_by: currentStaff?.id ?? null,
      })
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Commission insert failed.');

    return NextResponse.json({ ok: true, commission: data });
  } catch (error) {
    console.error('Failed to create agent commission', error);
    return NextResponse.json({ ok: false, error: 'Unable to save commission.' }, { status: 500 });
  }
}
