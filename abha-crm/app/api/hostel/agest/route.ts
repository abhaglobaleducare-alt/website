import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const studentId = url.searchParams.get('student_id');

    let query = supabaseAdmin
      .from('agest_disbursement')
      .select(
        'id, student_id, year_number, amount_usd, status, scheduled_date, disbursed_date, proof_url, notes, student:student_id(id, full_name, student_code)',
      )
      .order('year_number', { ascending: true });

    if (status) query = query.eq('status', status);
    if (studentId) query = query.eq('student_id', studentId);

    const { data, error } = await query;
    if (error) throw error;

    const rows = data ?? [];
    const disbursed = rows
      .filter((row) => row.status === 'disbursed')
      .reduce((sum, row) => sum + Number(row.amount_usd ?? 0), 0);
    const pending = rows
      .filter((row) => ['scheduled', 'hold'].includes(row.status ?? ''))
      .reduce((sum, row) => sum + Number(row.amount_usd ?? 0), 0);

    return NextResponse.json({ ok: true, disbursements: rows, totals: { disbursed, pending } });
  } catch (error) {
    console.error('Failed to fetch AGEST disbursements', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to load disbursements.' },
      { status: 500 },
    );
  }
}
