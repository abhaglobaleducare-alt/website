import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action as 'approve' | 'reject' | 'cancel' | undefined;
    const currentStaff = await getCurrentStaffFromRequest(request);

    const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (action === 'approve') {
      updateFields.status = 'approved';
      updateFields.approved_by = currentStaff?.id ?? null;
      updateFields.approved_at = new Date().toISOString();
      updateFields.rejection_reason = null;
    } else if (action === 'reject') {
      if (!String(body.rejection_reason ?? '').trim()) {
        return NextResponse.json(
          { ok: false, error: 'A rejection reason is required.' },
          { status: 400 },
        );
      }
      updateFields.status = 'rejected';
      updateFields.approved_by = currentStaff?.id ?? null;
      updateFields.approved_at = new Date().toISOString();
      updateFields.rejection_reason = String(body.rejection_reason).trim();
    } else if (action === 'cancel') {
      updateFields.status = 'cancelled';
    } else {
      return NextResponse.json({ ok: false, error: 'Unknown action.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('leave_applications')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) {
      throw error ?? new Error('Leave update failed.');
    }

    return NextResponse.json({ ok: true, application: data });
  } catch (error) {
    console.error('Failed to update leave application', error);
    return NextResponse.json({ ok: false, error: 'Unable to update leave.' }, { status: 500 });
  }
}
