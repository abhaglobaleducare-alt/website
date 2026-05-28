import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';
import { standardInfraItems } from '../../../../lib/constants/hostel-ops';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hostel_infrastructure')
      .select('*')
      .order('item_category', { ascending: true })
      .order('item_name', { ascending: true });

    if (error) {
      console.error('Infrastructure query failed (table may not be migrated)', error);
      return NextResponse.json({ ok: true, items: [], tableMissing: true });
    }

    return NextResponse.json({ ok: true, items: data ?? [] });
  } catch (error) {
    console.error('Failed to fetch infrastructure', error);
    return NextResponse.json({ ok: true, items: [], tableMissing: true });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    // Seed the standard catalogue of items (skips ones that already exist).
    if (payload.action === 'seed') {
      const { data: existing } = await supabaseAdmin
        .from('hostel_infrastructure')
        .select('item_name');
      const existingNames = new Set((existing ?? []).map((row) => row.item_name));
      const rows = standardInfraItems
        .filter((item) => !existingNames.has(item.item_name))
        .map((item) => ({
          office_id: currentStaff?.office_id ?? null,
          item_category: item.item_category,
          item_name: item.item_name,
          total_quantity: 0,
          good_condition: 0,
          created_by: currentStaff?.id ?? null,
        }));

      if (rows.length === 0) {
        return NextResponse.json({ ok: true, inserted: 0 });
      }

      const { error } = await supabaseAdmin.from('hostel_infrastructure').insert(rows);
      if (error) throw error;
      return NextResponse.json({ ok: true, inserted: rows.length });
    }

    if (!payload.item_name || !payload.item_category) {
      return NextResponse.json(
        { ok: false, error: 'Item name and category are required.' },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('hostel_infrastructure')
      .insert({
        office_id: currentStaff?.office_id ?? null,
        item_category: payload.item_category,
        item_name: payload.item_name,
        total_quantity: payload.total_quantity ?? 0,
        good_condition: payload.good_condition ?? 0,
        damaged: payload.damaged ?? 0,
        under_repair: payload.under_repair ?? 0,
        unit_cost: payload.unit_cost ?? null,
        created_by: currentStaff?.id ?? null,
      })
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Infrastructure insert failed.');

    return NextResponse.json({ ok: true, item: data });
  } catch (error) {
    console.error('Failed to create infrastructure item', error);
    return NextResponse.json({ ok: false, error: 'Unable to save item.' }, { status: 500 });
  }
}
