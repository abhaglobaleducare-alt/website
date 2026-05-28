import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../../lib/auth/current';

export async function POST(request: Request) {
  try {
    const currentStaff = await getCurrentStaffFromRequest(request);

    if (!currentStaff?.id) {
      return NextResponse.json(
        { ok: false, error: 'Unable to determine current staff.' },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file provided.' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    const validRows = [];
    const errors: { row: number; error: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const fullName = String(row['Full Name'] ?? row['full_name'] ?? '').trim();
      const phone = String(row['Phone'] ?? row['phone'] ?? '').trim();

      if (!fullName || !phone) {
        errors.push({ row: i + 2, error: 'Missing required fields: Full Name and/or Phone' });
        continue;
      }

      validRows.push({
        full_name: fullName,
        phone,
        parent_phone: String(row['Parent Phone'] ?? row['parent_phone'] ?? '').trim() || null,
        email: String(row['Email'] ?? row['email'] ?? '').trim() || null,
        city: String(row['City'] ?? row['city'] ?? '').trim() || null,
        state: String(row['State'] ?? row['state'] ?? '').trim() || null,
        neet_score: Number(row['NEET Score'] ?? row['neet_score'] ?? 0) || null,
        neet_year: Number(row['NEET Year'] ?? row['neet_year'] ?? 0) || null,
        interest: String(row['Interest'] ?? row['interest'] ?? '').trim() || null,
        preferred_country:
          String(row['Preferred Country'] ?? row['preferred_country'] ?? '').trim() || null,
        lead_source: String(row['Source'] ?? row['lead_source'] ?? 'excel_upload').trim(),
        lead_status: 'new',
        notes: String(row['Notes'] ?? row['notes'] ?? '').trim() || null,
        assigned_staff_id: currentStaff.id,
        office_id: currentStaff.office_id ?? null,
        uploaded_via: 'excel',
        created_by: currentStaff.id,
      });
    }

    if (validRows.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'No valid rows to insert.',
          errors,
        },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin.from('leads').insert(validRows);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      inserted: validRows.length,
      errors,
    });
  } catch (error) {
    console.error('Failed to bulk import leads', error);
    return NextResponse.json({ ok: false, error: 'Bulk import failed.' }, { status: 500 });
  }
}
