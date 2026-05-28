import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, lead: data ?? null });
  } catch (error) {
    console.error('Failed to fetch lead details', error);
    return NextResponse.json({ ok: false, error: 'Unable to load lead details.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json().catch(() => ({}));

    const updateFields: Record<string, unknown> = {};

    const editableFields = [
      'full_name',
      'phone',
      'parent_phone',
      'email',
      'city',
      'state',
      'neet_score',
      'neet_year',
      'interest',
      'preferred_country',
      'lead_source',
      'lead_status',
      'follow_up_date',
      'notes',
      'b2b_partner_id',
    ] as const;

    editableFields.forEach((key) => {
      if (body[key] !== undefined) {
        updateFields[key] = body[key];
      }
    });

    if (Object.keys(updateFields).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('leads')
        .update(updateFields)
        .eq('id', id);
      if (updateError) {
        throw updateError;
      }
    }

    return NextResponse.json({ ok: true, message: 'Lead updated successfully.' });
  } catch (error) {
    console.error('Failed to update lead', error);
    return NextResponse.json({ ok: false, error: 'Unable to update lead.' }, { status: 500 });
  }
}
