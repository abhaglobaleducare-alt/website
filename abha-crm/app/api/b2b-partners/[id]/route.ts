import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { data: partner, error } = await supabaseAdmin
      .from('b2b_partners')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!partner) {
      return NextResponse.json({ ok: false, error: 'Partner not found.' }, { status: 404 });
    }

    const [{ data: students }, { data: leads }] = await Promise.all([
      supabaseAdmin
        .from('students')
        .select(
          'id, student_code, full_name, phone, funnel_stage, selected_country, selected_university, created_at',
        )
        .eq('reference_partner_id', id)
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('leads')
        .select('id, full_name, phone, lead_status, converted_to_student_id, created_at')
        .eq('b2b_partner_id', id)
        .order('created_at', { ascending: false }),
    ]);

    const linkedStudents = students ?? [];
    const linkedLeads = leads ?? [];

    // Commission = total fees of linked students x commission_percent.
    let commissionableFees = 0;
    if (linkedStudents.length > 0) {
      const { data: fees } = await supabaseAdmin
        .from('fee_schedule')
        .select('total_amount')
        .in(
          'student_id',
          linkedStudents.map((student) => student.id),
        );
      commissionableFees = (fees ?? []).reduce(
        (sum, fee) => sum + Number(fee.total_amount ?? 0),
        0,
      );
    }

    const percent = Number(partner.commission_percent ?? 0);
    const referrals = linkedLeads.length;
    const conversions = linkedStudents.length;

    return NextResponse.json({
      ok: true,
      partner,
      linkedStudents,
      linkedLeads,
      stats: {
        referrals,
        conversions,
        conversionRate: referrals > 0 ? Math.round((conversions / referrals) * 100) : 0,
        commissionableFees,
        estimatedCommission: Math.round((commissionableFees * percent) / 100),
      },
    });
  } catch (error) {
    console.error('Failed to fetch partner detail', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to load partner detail.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const updateFields: Record<string, unknown> = {};

    const editableFields = [
      'partner_name',
      'partner_type',
      'contact_person',
      'contact_phone',
      'contact_email',
      'city',
      'state',
      'address',
      'commission_percent',
      'preferred_country',
      'status',
      'notes',
    ] as const;

    editableFields.forEach((key) => {
      if (body[key] !== undefined) {
        updateFields[key] = body[key];
      }
    });

    updateFields.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('b2b_partners')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) {
      throw error ?? new Error('Partner update failed.');
    }

    return NextResponse.json({ ok: true, partner: data });
  } catch (error) {
    console.error('Failed to update partner', error);
    return NextResponse.json({ ok: false, error: 'Unable to update partner.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Detach references first since leads/students hold plain UUIDs (no FK cascade).
    await Promise.all([
      supabaseAdmin.from('leads').update({ b2b_partner_id: null }).eq('b2b_partner_id', id),
      supabaseAdmin
        .from('students')
        .update({ reference_partner_id: null })
        .eq('reference_partner_id', id),
    ]);

    const { error } = await supabaseAdmin.from('b2b_partners').delete().eq('id', id);
    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete partner', error);
    return NextResponse.json({ ok: false, error: 'Unable to delete partner.' }, { status: 500 });
  }
}
