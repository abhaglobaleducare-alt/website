import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../lib/auth/current';

function buildSearchQuery(search: string) {
  const term = search.replace(/%/g, '\\%').trim();
  return `full_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`;
}

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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get('scope') ?? 'staff';
    const search = url.searchParams.get('search') ?? '';
    const stage = url.searchParams.get('stage');
    const country = url.searchParams.get('country');
    const university = url.searchParams.get('university');
    const officeId = url.searchParams.get('office_id');
    const staffId = url.searchParams.get('staff_id');
    const fromDate = url.searchParams.get('from');
    const toDate = url.searchParams.get('to');

    const query = supabaseAdmin
      .from('students')
      .select(
        'id, student_code, full_name, phone, parent_phone, whatsapp, funnel_stage, selected_university, selected_country, created_at, assigned_staff_id, office_id',
      )
      .order('created_at', { ascending: false });

    if (scope === 'staff') {
      const currentStaff = await getCurrentStaffFromRequest(request);
      if (currentStaff?.id) {
        query.eq('assigned_staff_id', currentStaff.id);
      }
    }

    if (search) {
      query.or(buildSearchQuery(search));
    }

    if (stage) {
      query.eq('funnel_stage', stage);
    }

    if (country) {
      query.eq('selected_country', country);
    }

    if (university) {
      query.eq('selected_university', university);
    }

    if (officeId) {
      query.eq('office_id', officeId);
    }

    if (staffId) {
      query.eq('assigned_staff_id', staffId);
    }

    if (fromDate) {
      query.gte('created_at', fromDate);
    }

    if (toDate) {
      query.lte('created_at', toDate);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, students: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch students', error);
    return NextResponse.json({ ok: false, error: 'Unable to load students.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!currentStaff?.id) {
      return NextResponse.json(
        { ok: false, error: 'Unable to determine current staff.' },
        { status: 400 },
      );
    }

    const studentCode = await generateStudentCode();
    const insertPayload = {
      student_code: studentCode,
      full_name: payload.full_name ?? null,
      father_name: payload.father_name ?? null,
      mother_name: payload.mother_name ?? null,
      dob: payload.dob ?? null,
      gender: payload.gender ?? null,
      photo_url: payload.photo_url ?? null,
      phone: payload.phone ?? null,
      parent_phone: payload.parent_phone ?? null,
      whatsapp: payload.whatsapp ?? null,
      email: payload.email ?? null,
      address: payload.address ?? null,
      city: payload.city ?? null,
      state: payload.state ?? null,
      reference_source: payload.reference_source ?? null,
      reference_details: payload.reference_details ?? null,
      referrer_student_id: payload.referrer_student_id ?? null,
      neet_score: payload.neet_score ?? null,
      neet_year: payload.neet_year ?? null,
      twelfth_percentage: payload.twelfth_percentage ?? null,
      board: payload.board ?? null,
      school_name: payload.school_name ?? null,
      selected_country: payload.selected_country ?? null,
      selected_university: payload.selected_university ?? null,
      intake_year: payload.intake_year ?? null,
      intake_month: payload.intake_month ?? null,
      notes: payload.notes ?? null,
      assigned_staff_id: currentStaff.id,
      office_id: currentStaff.office_id ?? null,
      funnel_stage: 'Lead Generated',
      created_by: currentStaff.id,
    };

    const { data, error } = await supabaseAdmin
      .from('students')
      .insert(insertPayload)
      .select()
      .single();

    if (error || !data) {
      throw error ?? new Error('Student insert failed.');
    }

    const historyPayload = {
      student_id: data.id,
      stage: 'Lead Generated',
      stage_status: 'completed',
      stage_notes: 'Lead created from staff student funnel CRM.',
      documents_url: [],
      updated_by: currentStaff.id,
    };

    await supabaseAdmin.from('student_funnel_history').insert(historyPayload);

    const disbursementRows = Array.from({ length: 6 }, (_, index) => ({
      student_id: data.id,
      year_number: index + 1,
      amount_usd: 1000,
      status: 'scheduled',
    }));

    await supabaseAdmin.from('agest_disbursement').insert(disbursementRows);

    return NextResponse.json({ ok: true, student: data });
  } catch (error) {
    console.error('Failed to create student', error);
    return NextResponse.json({ ok: false, error: 'Unable to create student.' }, { status: 500 });
  }
}
