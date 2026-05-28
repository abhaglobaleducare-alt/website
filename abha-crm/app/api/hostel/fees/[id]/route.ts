import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../../lib/auth/current';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);
    const updateFields: Record<string, unknown> = {
      updated_by: currentStaff?.id ?? null,
      updated_at: new Date().toISOString(),
    };

    if (body.action === 'confirm' || body.action === 'approve') {
      // Confirm/approve a payment: fetch the row to mark it fully paid.
      const { data: fee } = await supabaseAdmin
        .from('fee_schedule')
        .select('total_amount')
        .eq('id', params.id)
        .maybeSingle();
      updateFields.status = 'paid';
      updateFields.paid_amount = Number(fee?.total_amount ?? 0);
      updateFields.paid_date = new Date().toISOString().slice(0, 10);
      if (body.receipt_url) updateFields.receipt_url = body.receipt_url;
    } else {
      ['status', 'paid_amount', 'paid_date', 'payment_mode', 'receipt_url', 'due_date'].forEach(
        (key) => {
          if (body[key] !== undefined) updateFields[key] = body[key];
        },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('fee_schedule')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Fee update failed.');

    return NextResponse.json({ ok: true, fee: data });
  } catch (error) {
    console.error('Failed to update fee', error);
    return NextResponse.json({ ok: false, error: 'Unable to update fee.' }, { status: 500 });
  }
}
