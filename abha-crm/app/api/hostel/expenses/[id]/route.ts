import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../../lib/auth/current';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action as 'approve' | 'reject' | undefined;
    const currentStaff = await getCurrentStaffFromRequest(request);

    const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (action === 'approve') {
      updateFields.approval_status = 'approved';
      updateFields.approved_by = currentStaff?.id ?? null;
    } else if (action === 'reject') {
      updateFields.approval_status = 'rejected';
      updateFields.approved_by = currentStaff?.id ?? null;
    }
    if (body.notes !== undefined) updateFields.notes = body.notes;

    const { data, error } = await supabaseAdmin
      .from('hostel_expenses')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Expense update failed.');

    return NextResponse.json({ ok: true, expense: data });
  } catch (error) {
    console.error('Failed to update expense', error);
    return NextResponse.json({ ok: false, error: 'Unable to update expense.' }, { status: 500 });
  }
}
