import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action as 'approve' | 'reject' | undefined;
    const updateFields: Record<string, unknown> = {};

    if (action === 'approve') {
      updateFields.status = 'paid';
      updateFields.payment_date = body.payment_date ?? new Date().toISOString().slice(0, 10);
      if (body.payment_type) updateFields.payment_type = body.payment_type;
    } else if (action === 'reject') {
      updateFields.status = 'cancelled';
      if (body.notes) updateFields.service_description = body.notes;
    } else {
      return NextResponse.json({ ok: false, error: 'Unknown action.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('agent_commissions')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Commission update failed.');

    return NextResponse.json({ ok: true, commission: data });
  } catch (error) {
    console.error('Failed to update agent commission', error);
    return NextResponse.json({ ok: false, error: 'Unable to update commission.' }, { status: 500 });
  }
}
