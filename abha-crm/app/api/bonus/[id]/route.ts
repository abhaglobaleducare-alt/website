import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action as
      | 'approve'
      | 'disburse'
      | 'hold'
      | 'cancel'
      | 'mark_referrer_paid'
      | undefined;
    const currentStaff = await getCurrentStaffFromRequest(request);

    const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() };

    switch (action) {
      case 'approve':
        updateFields.status = 'approved';
        updateFields.approved_by = currentStaff?.id ?? null;
        updateFields.approved_at = new Date().toISOString();
        break;
      case 'disburse':
        updateFields.status = 'disbursed';
        updateFields.disbursed_date = body.disbursed_date ?? new Date().toISOString().slice(0, 10);
        if (body.payment_proof_url) updateFields.payment_proof_url = body.payment_proof_url;
        break;
      case 'hold':
        updateFields.status = 'hold';
        break;
      case 'cancel':
        updateFields.status = 'cancelled';
        break;
      case 'mark_referrer_paid':
        updateFields.referrer_paid = true;
        updateFields.referrer_paid_date = new Date().toISOString().slice(0, 10);
        break;
      default:
        return NextResponse.json({ ok: false, error: 'Unknown action.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('admission_bonus')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) {
      throw error ?? new Error('Bonus update failed.');
    }

    return NextResponse.json({ ok: true, bonus: data });
  } catch (error) {
    console.error('Failed to update bonus', error);
    return NextResponse.json({ ok: false, error: 'Unable to update bonus.' }, { status: 500 });
  }
}
