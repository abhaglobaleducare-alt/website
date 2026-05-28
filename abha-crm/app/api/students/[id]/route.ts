import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';
import { nextAdmissionBonusAmount } from '../../../../lib/bonus';
import { REFERENCE_DISTRIBUTION_BONUS } from '../../../../lib/constants/hr';

const UNIVERSITY_REGISTRATION_STAGE = 'University Registration in Georgia/Kyrgyzstan';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { data, error } = await supabaseAdmin
      .from('students')
      .select(
        '*, assigned_staff:assigned_staff_id(id, full_name, email), office:office_id(id, name), student_funnel_history(*), fee_schedule(*), agest_disbursement(*), admission_bonus(*)',
      )
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, student: data ?? null });
  } catch (error) {
    console.error('Failed to fetch student details', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to load student details.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);
    const staffId = currentStaff?.id ?? null;

    const updateFields: Record<string, unknown> = {};

    const editableFields = [
      'full_name',
      'father_name',
      'mother_name',
      'dob',
      'gender',
      'phone',
      'parent_phone',
      'whatsapp',
      'email',
      'address',
      'city',
      'state',
      'reference_source',
      'reference_details',
      'referrer_student_id',
      'neet_score',
      'neet_year',
      'twelfth_percentage',
      'board',
      'school_name',
      'selected_country',
      'selected_university',
      'intake_year',
      'intake_month',
      'notes',
      'assigned_staff_id',
      'office_id',
      'funnel_stage',
      'student_code',
      'photo_url',
    ] as const;

    editableFields.forEach((key) => {
      if (body[key] !== undefined) {
        updateFields[key] = body[key];
      }
    });

    if (body.stage) {
      updateFields.funnel_stage = body.stage;
    }

    if (Object.keys(updateFields).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('students')
        .update(updateFields)
        .eq('id', id);
      if (updateError) {
        throw updateError;
      }
    }

    if (
      body.stage ||
      body.stage_notes ||
      body.documents_url ||
      body.amount ||
      body.payment_method
    ) {
      const historyPayload: Record<string, unknown> = {
        student_id: id,
        stage: body.stage ?? 'Update',
        stage_status: body.stage_status ?? 'completed',
        stage_notes: body.stage_notes ?? null,
        documents_url: body.documents_url
          ? Array.isArray(body.documents_url)
            ? body.documents_url
            : [body.documents_url]
          : [],
        amount: body.amount ?? null,
        payment_method: body.payment_method ?? null,
        payment_date: body.payment_date ?? null,
        payment_receipt_url: body.payment_receipt_url ?? null,
        updated_by: staffId,
      };

      const { error: historyError } = await supabaseAdmin
        .from('student_funnel_history')
        .insert(historyPayload);
      if (historyError) {
        throw historyError;
      }
    }

    if (body.stage === UNIVERSITY_REGISTRATION_STAGE) {
      const { data: studentData, error: studentError } = await supabaseAdmin
        .from('students')
        .select('id, assigned_staff_id, reference_source')
        .eq('id', id)
        .maybeSingle();

      if (!studentError && studentData) {
        const today = new Date().toISOString().slice(0, 10);

        // Admission bonus — only for staff explicitly flagged bonus_type='admission'.
        if (studentData.assigned_staff_id) {
          const { data: staffUser } = await supabaseAdmin
            .from('users')
            .select('id, is_bonus_eligible, bonus_type')
            .eq('id', studentData.assigned_staff_id)
            .maybeSingle();

          if (staffUser?.is_bonus_eligible && staffUser.bonus_type === 'admission') {
            const existingAdmission = await supabaseAdmin
              .from('admission_bonus')
              .select('id')
              .eq('student_id', id)
              .eq('bonus_type', 'admission')
              .maybeSingle();

            if (!existingAdmission.data) {
              const amount = await nextAdmissionBonusAmount(staffUser.id);
              await supabaseAdmin.from('admission_bonus').insert({
                staff_id: staffUser.id,
                student_id: id,
                bonus_type: 'admission',
                bonus_amount: amount,
                trigger_event: 'student_reached_university',
                eligible_date: today,
                status: 'pending_approval',
                notes: 'Auto-triggered on university registration (slab-based amount).',
              });
            }
          }
        }

        // Reference distribution bonus to the director for referral admissions.
        if (studentData.reference_source === 'referral') {
          const { data: director } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('bonus_type', 'reference_distribution')
            .limit(1)
            .maybeSingle();

          if (director?.id) {
            const existingRefBonus = await supabaseAdmin
              .from('admission_bonus')
              .select('id')
              .eq('student_id', id)
              .eq('bonus_type', 'reference_distribution')
              .maybeSingle();

            if (!existingRefBonus.data) {
              await supabaseAdmin.from('admission_bonus').insert({
                staff_id: director.id,
                student_id: id,
                bonus_type: 'reference_distribution',
                bonus_amount: REFERENCE_DISTRIBUTION_BONUS,
                trigger_event: 'reference_distribution',
                eligible_date: today,
                status: 'pending_approval',
                notes: 'Auto-triggered reference distribution bonus for the director.',
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ ok: true, message: 'Student updated successfully.' });
  } catch (error) {
    console.error('Failed to update student', error);
    return NextResponse.json({ ok: false, error: 'Unable to update student.' }, { status: 500 });
  }
}
