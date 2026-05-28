import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const studentId = url.searchParams.get('student_id');
    const pendingOnly = url.searchParams.get('pending') === '1';

    let query = supabaseAdmin
      .from('fee_schedule')
      .select(
        'id, student_id, fee_type, year_number, description, total_amount, paid_amount, pending_amount, currency, due_date, paid_date, status, receipt_url, student:student_id(id, full_name, student_code)',
      )
      .eq('fee_type', 'hostel')
      .order('year_number', { ascending: true });

    if (status) query = query.eq('status', status);
    if (studentId) query = query.eq('student_id', studentId);
    if (pendingOnly) query = query.in('status', ['pending', 'partial', 'overdue']);

    const { data, error } = await query;
    if (error) throw error;

    const fees = data ?? [];
    const pendingAmount = fees
      .filter((fee) => ['pending', 'partial', 'overdue'].includes(fee.status ?? ''))
      .reduce((sum, fee) => sum + Number(fee.pending_amount ?? 0), 0);

    return NextResponse.json({ ok: true, fees, pendingAmount });
  } catch (error) {
    console.error('Failed to fetch hostel fees', error);
    return NextResponse.json({ ok: false, error: 'Unable to load fees.' }, { status: 500 });
  }
}

// Generate a 6-year hostel fee schedule for a student that has none yet.
export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    if (!payload.student_id) {
      return NextResponse.json({ ok: false, error: 'Student is required.' }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('fee_schedule')
      .select('id')
      .eq('student_id', payload.student_id)
      .eq('fee_type', 'hostel')
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { ok: false, error: 'A hostel fee schedule already exists for this student.' },
        { status: 400 },
      );
    }

    const amount = Number(payload.annual_amount ?? 0) || 0;
    const currency = payload.currency || 'USD';
    const rows = Array.from({ length: 6 }, (_, index) => ({
      student_id: payload.student_id,
      fee_type: 'hostel',
      year_number: index + 1,
      description: `Hostel fee - Year ${index + 1}`,
      total_amount: amount,
      currency,
      status: 'pending',
    }));

    const { error } = await supabaseAdmin.from('fee_schedule').insert(rows);
    if (error) throw error;

    return NextResponse.json({ ok: true, inserted: rows.length });
  } catch (error) {
    console.error('Failed to generate fee schedule', error);
    return NextResponse.json({ ok: false, error: 'Unable to generate schedule.' }, { status: 500 });
  }
}
