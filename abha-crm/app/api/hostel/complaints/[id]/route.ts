import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../../lib/auth/current';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    const updateFields: Record<string, unknown> = {};

    if (body.status !== undefined) {
      updateFields.status = body.status;
      updateFields.handled_by = currentStaff?.id ?? null;
      if (body.status === 'resolved' || body.status === 'closed') {
        updateFields.resolved_at = new Date().toISOString();
      }
    }
    if (body.resolution_notes !== undefined) updateFields.resolution_notes = body.resolution_notes;
    if (body.priority !== undefined) updateFields.priority = body.priority;

    const { data, error } = await supabaseAdmin
      .from('hostel_complaints')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Complaint update failed.');

    return NextResponse.json({ ok: true, complaint: data });
  } catch (error) {
    console.error('Failed to update complaint', error);
    return NextResponse.json({ ok: false, error: 'Unable to update complaint.' }, { status: 500 });
  }
}
