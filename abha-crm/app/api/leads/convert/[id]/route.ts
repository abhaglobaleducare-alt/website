import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../../lib/auth/current';

async function generateStudentCode() {
  const { count, error } = await supabaseAdmin
    .from('students')
    .select('id', { count: 'exact', head: true });
  if (error) {
    throw error;
  }

  const nextNumber = (count ?? 0) + 1;
  return `ABHA-2026-${String(nextNumber).padStart(4, '0')}`;
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (leadError || !lead) {
      throw leadError ?? new Error('Lead not found');
    }

    const studentCode = await generateStudentCode();

    const studentPayload = {
      student_code: studentCode,
      full_name: lead.full_name ?? null,
      phone: lead.phone ?? null,
      parent_phone: lead.parent_phone ?? null,
      email: lead.email ?? null,
      city: lead.city ?? null,
      state: lead.state ?? null,
      neet_score: lead.neet_score ?? null,
      neet_year: lead.neet_year ?? null,
      notes: lead.notes ?? null,
      assigned_staff_id: lead.assigned_staff_id,
      office_id: lead.office_id,
      funnel_stage: 'Lead Generated',
      selected_country: payload.selected_country ?? lead.preferred_country ?? null,
      selected_university: payload.selected_university ?? null,
      reference_partner_id: lead.b2b_partner_id ?? null,
      reference_source: lead.b2b_partner_id ? 'b2b' : null,
      created_by: lead.created_by,
    };

    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .insert(studentPayload)
      .select()
      .single();

    if (studentError || !student) {
      throw studentError ?? new Error('Student insert failed');
    }

    await supabaseAdmin.from('student_funnel_history').insert({
      student_id: student.id,
      stage: 'Lead Generated',
      stage_status: 'completed',
      stage_notes: 'Lead converted from leads table.',
      documents_url: [],
      updated_by: currentStaff?.id,
    });

    const disbursementRows = Array.from({ length: 6 }, (_, index) => ({
      student_id: student.id,
      year_number: index + 1,
      amount_usd: 1000,
      status: 'scheduled',
    }));

    await supabaseAdmin.from('agest_disbursement').insert(disbursementRows);

    await supabaseAdmin
      .from('leads')
      .update({
        converted_to_student_id: student.id,
        lead_status: 'converted',
        converted_at: new Date().toISOString(),
      })
      .eq('id', id);

    return NextResponse.json({ ok: true, student });
  } catch (error) {
    console.error('Failed to convert lead to student', error);
    return NextResponse.json({ ok: false, error: 'Unable to convert lead.' }, { status: 500 });
  }
}
