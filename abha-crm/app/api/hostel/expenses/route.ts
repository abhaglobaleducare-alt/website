import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const category = url.searchParams.get('category');
    const paymentType = url.searchParams.get('payment_type');
    const approvalStatus = url.searchParams.get('approval_status');

    let query = supabaseAdmin
      .from('hostel_expenses')
      .select(
        'id, office_id, expense_date, expense_category, item_name, quantity, unit, unit_cost, total_cost, currency, payment_type, vendor_name, vendor_phone, receipt_url, notes, approval_status, created_at, creator:created_by(full_name)',
      )
      .order('expense_date', { ascending: false });

    if (from) query = query.gte('expense_date', from);
    if (to) query = query.lte('expense_date', to);
    if (category) query = query.eq('expense_category', category);
    if (paymentType) query = query.eq('payment_type', paymentType);
    if (approvalStatus) query = query.eq('approval_status', approvalStatus);

    const { data, error } = await query;
    if (error) {
      console.error('Expenses query failed (table may not be migrated yet)', error);
      return NextResponse.json({ ok: true, expenses: [], total: 0, tableMissing: true });
    }

    const expenses = data ?? [];
    const total = expenses.reduce((sum, expense) => sum + Number(expense.total_cost ?? 0), 0);

    return NextResponse.json({ ok: true, expenses, total });
  } catch (error) {
    console.error('Failed to fetch expenses', error);
    return NextResponse.json({ ok: true, expenses: [], total: 0, tableMissing: true });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!payload.expense_date || !payload.expense_category || !payload.item_name) {
      return NextResponse.json(
        { ok: false, error: 'Date, category, and item name are required.' },
        { status: 400 },
      );
    }

    const quantity = payload.quantity != null ? Number(payload.quantity) : null;
    const unitCost = payload.unit_cost != null ? Number(payload.unit_cost) : null;
    const totalCost =
      payload.total_cost != null ? Number(payload.total_cost) : (quantity ?? 0) * (unitCost ?? 0);

    const { data, error } = await supabaseAdmin
      .from('hostel_expenses')
      .insert({
        office_id: currentStaff?.office_id ?? null,
        expense_date: payload.expense_date,
        expense_category: payload.expense_category,
        item_name: payload.item_name,
        quantity,
        unit: payload.unit || null,
        unit_cost: unitCost,
        total_cost: totalCost,
        currency: payload.currency || 'GEL',
        payment_type: payload.payment_type || null,
        vendor_name: payload.vendor_name || null,
        vendor_phone: payload.vendor_phone || null,
        receipt_url: payload.receipt_url || null,
        notes: payload.notes || null,
        approval_status: 'pending',
        created_by: currentStaff?.id ?? null,
      })
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Expense insert failed.');

    return NextResponse.json({ ok: true, expense: data });
  } catch (error) {
    console.error('Failed to create expense', error);
    return NextResponse.json({ ok: false, error: 'Unable to save expense.' }, { status: 500 });
  }
}
