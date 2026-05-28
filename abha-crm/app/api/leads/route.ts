import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../lib/auth/current';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get('scope') ?? 'staff';
    const search = url.searchParams.get('search') ?? '';
    const status = url.searchParams.get('status');
    const source = url.searchParams.get('source');
    const interest = url.searchParams.get('interest');
    const officeId = url.searchParams.get('office_id');
    const staffId = url.searchParams.get('staff_id');
    const fromDate = url.searchParams.get('from');
    const toDate = url.searchParams.get('to');

    let query = supabaseAdmin
      .from('leads')
      .select(
        'id, full_name, phone, email, city, neet_score, interest, preferred_country, lead_source, lead_status, follow_up_date, assigned_staff_id, office_id, created_at, b2b_partner_id',
      )
      .order('created_at', { ascending: false });

    if (scope === 'staff') {
      const currentStaff = await getCurrentStaffFromRequest(request);
      if (currentStaff?.id) {
        query = query.eq('assigned_staff_id', currentStaff.id);
      }
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }

    if (status) {
      query = query.eq('lead_status', status);
    }

    if (source) {
      query = query.eq('lead_source', source);
    }

    if (interest) {
      query = query.eq('interest', interest);
    }

    if (officeId) {
      query = query.eq('office_id', officeId);
    }

    if (staffId) {
      query = query.eq('assigned_staff_id', staffId);
    }

    if (fromDate) {
      query = query.gte('created_at', fromDate);
    }

    if (toDate) {
      query = query.lte('created_at', toDate);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, leads: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch leads', error);
    return NextResponse.json({ ok: false, error: 'Unable to load leads.' }, { status: 500 });
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

    const insertPayload = {
      full_name: payload.full_name ?? null,
      phone: payload.phone ?? null,
      parent_phone: payload.parent_phone ?? null,
      email: payload.email ?? null,
      city: payload.city ?? null,
      state: payload.state ?? null,
      neet_score: payload.neet_score ?? null,
      neet_year: payload.neet_year ?? null,
      interest: payload.interest ?? null,
      preferred_country: payload.preferred_country ?? null,
      lead_source: payload.lead_source ?? 'walk-in',
      lead_status: 'new',
      follow_up_date: payload.follow_up_date ?? null,
      notes: payload.notes ?? null,
      assigned_staff_id: currentStaff.id,
      office_id: currentStaff.office_id ?? null,
      b2b_partner_id: payload.b2b_partner_id ?? null,
      created_by: currentStaff.id,
    };

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert(insertPayload)
      .select()
      .single();

    if (error || !data) {
      throw error ?? new Error('Lead insert failed.');
    }

    return NextResponse.json({ ok: true, lead: data });
  } catch (error) {
    console.error('Failed to create lead', error);
    return NextResponse.json({ ok: false, error: 'Unable to create lead.' }, { status: 500 });
  }
}
