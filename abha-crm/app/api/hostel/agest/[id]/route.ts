import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../../lib/auth/current';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action as 'disburse' | 'hold' | 'schedule' | 'cancel' | undefined;
    const currentStaff = await getCurrentStaffFromRequest(request);
    const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() };

    switch (action) {
      case 'disburse':
        updateFields.status = 'disbursed';
        updateFields.disbursed_date = new Date().toISOString().slice(0, 10);
        updateFields.approved_by = currentStaff?.id ?? null;
        break;
      case 'hold':
        updateFields.status = 'hold';
        break;
      case 'schedule':
        updateFields.status = 'scheduled';
        break;
      case 'cancel':
        updateFields.status = 'cancelled';
        break;
      default:
        break;
    }

    if (body.proof_url !== undefined) updateFields.proof_url = body.proof_url;
    if (body.notes !== undefined) updateFields.notes = body.notes;

    const { data, error } = await supabaseAdmin
      .from('agest_disbursement')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Disbursement update failed.');

    return NextResponse.json({ ok: true, disbursement: data });
  } catch (error) {
    console.error('Failed to update disbursement', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to update disbursement.' },
      { status: 500 },
    );
  }
}
