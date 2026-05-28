import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../lib/auth/current';

interface PartnerStats {
  referrals: number;
  conversions: number;
  conversionRate: number;
  commissionableFees: number;
  estimatedCommission: number;
}

// Aggregates referral/conversion/commission figures for every partner in a few
// queries (no per-partner round trips), keyed by partner id.
async function buildStats(): Promise<Map<string, PartnerStats>> {
  const stats = new Map<string, PartnerStats>();

  const [{ data: leads }, { data: students }] = await Promise.all([
    supabaseAdmin.from('leads').select('id, b2b_partner_id'),
    supabaseAdmin.from('students').select('id, reference_partner_id'),
  ]);

  const studentToPartner = new Map<string, string>();
  (students ?? []).forEach((student) => {
    if (student.reference_partner_id) {
      studentToPartner.set(student.id, student.reference_partner_id);
    }
  });

  const ensure = (id: string): PartnerStats => {
    let entry = stats.get(id);
    if (!entry) {
      entry = {
        referrals: 0,
        conversions: 0,
        conversionRate: 0,
        commissionableFees: 0,
        estimatedCommission: 0,
      };
      stats.set(id, entry);
    }
    return entry;
  };

  (leads ?? []).forEach((lead) => {
    if (lead.b2b_partner_id) ensure(lead.b2b_partner_id).referrals += 1;
  });

  (students ?? []).forEach((student) => {
    if (student.reference_partner_id) ensure(student.reference_partner_id).conversions += 1;
  });

  // Sum commissionable fees per partner via the linked students' fee schedule.
  const linkedStudentIds = Array.from(studentToPartner.keys());
  if (linkedStudentIds.length > 0) {
    const { data: fees } = await supabaseAdmin
      .from('fee_schedule')
      .select('student_id, total_amount')
      .in('student_id', linkedStudentIds);

    (fees ?? []).forEach((fee) => {
      const partnerId = studentToPartner.get(fee.student_id);
      if (partnerId) ensure(partnerId).commissionableFees += Number(fee.total_amount ?? 0);
    });
  }

  return stats;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const withStats = url.searchParams.get('withStats') === '1';
    const search = url.searchParams.get('search') ?? '';
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const officeId = url.searchParams.get('office_id');

    let query = supabaseAdmin
      .from('b2b_partners')
      .select(
        'id, partner_name, partner_type, contact_person, contact_phone, contact_email, city, state, commission_percent, preferred_country, status, office_id, created_at',
      )
      .order('partner_name', { ascending: true });

    if (search) {
      query = query.or(`partner_name.ilike.%${search}%,contact_person.ilike.%${search}%`);
    }
    if (type) query = query.eq('partner_type', type);
    if (status) query = query.eq('status', status);
    if (officeId) query = query.eq('office_id', officeId);

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    let partners = data ?? [];

    if (withStats) {
      const stats = await buildStats();
      partners = partners.map((partner) => {
        const entry = stats.get(partner.id);
        const referrals = entry?.referrals ?? 0;
        const conversions = entry?.conversions ?? 0;
        const commissionableFees = entry?.commissionableFees ?? 0;
        const percent = Number(partner.commission_percent ?? 0);
        return {
          ...partner,
          referrals,
          conversions,
          conversionRate: referrals > 0 ? Math.round((conversions / referrals) * 100) : 0,
          commissionableFees,
          estimatedCommission: Math.round((commissionableFees * percent) / 100),
        };
      });
    }

    return NextResponse.json({ ok: true, partners });
  } catch (error) {
    console.error('Failed to fetch B2B partners', error);
    return NextResponse.json({ ok: false, error: 'Unable to load partners.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!payload.partner_name) {
      return NextResponse.json({ ok: false, error: 'Partner name is required.' }, { status: 400 });
    }

    const insertPayload = {
      partner_name: payload.partner_name,
      partner_type: payload.partner_type || null,
      contact_person: payload.contact_person || null,
      contact_phone: payload.contact_phone || null,
      contact_email: payload.contact_email || null,
      city: payload.city || null,
      state: payload.state || null,
      address: payload.address || null,
      commission_percent: payload.commission_percent ?? 0,
      preferred_country: payload.preferred_country || null,
      status: payload.status || 'active',
      notes: payload.notes || null,
      added_by: currentStaff?.id ?? null,
      office_id: currentStaff?.office_id ?? null,
    };

    const { data, error } = await supabaseAdmin
      .from('b2b_partners')
      .insert(insertPayload)
      .select()
      .single();

    if (error || !data) {
      throw error ?? new Error('Partner insert failed.');
    }

    return NextResponse.json({ ok: true, partner: data });
  } catch (error) {
    console.error('Failed to create B2B partner', error);
    return NextResponse.json({ ok: false, error: 'Unable to create partner.' }, { status: 500 });
  }
}
