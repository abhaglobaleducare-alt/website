import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { hostelStudentStages } from '../../../../lib/constants/hostel';

function feeStatusFor(rows: { status?: string | null }[]): string {
  if (rows.length === 0) return 'none';
  if (rows.some((row) => row.status === 'overdue')) return 'overdue';
  if (rows.some((row) => ['pending', 'partial'].includes(row.status ?? ''))) return 'pending';
  return 'paid';
}

export async function GET() {
  try {
    const { data: students, error } = await supabaseAdmin
      .from('students')
      .select(
        'id, full_name, student_code, phone, selected_university, selected_country, funnel_stage',
      )
      .in('funnel_stage', hostelStudentStages as unknown as string[])
      .order('full_name', { ascending: true });

    if (error) throw error;

    const list = students ?? [];
    const ids = list.map((student) => student.id);

    const assignmentsByStudent = new Map<
      string,
      { room_number?: string; check_in_date?: string }
    >();
    const feesByStudent = new Map<string, { status?: string | null }[]>();

    if (ids.length > 0) {
      const [{ data: assignments }, { data: fees }] = await Promise.all([
        supabaseAdmin
          .from('hostel_room_assignments')
          .select('student_id, check_in_date, status, room:room_id(room_number)')
          .in('student_id', ids)
          .eq('status', 'active'),
        supabaseAdmin
          .from('fee_schedule')
          .select('student_id, status')
          .eq('fee_type', 'hostel')
          .in('student_id', ids),
      ]);

      (assignments ?? []).forEach((assignment) => {
        const room = assignment.room as { room_number?: string } | null;
        assignmentsByStudent.set(assignment.student_id, {
          room_number: room?.room_number,
          check_in_date: assignment.check_in_date ?? undefined,
        });
      });

      (fees ?? []).forEach((fee) => {
        const existing = feesByStudent.get(fee.student_id) ?? [];
        existing.push({ status: fee.status });
        feesByStudent.set(fee.student_id, existing);
      });
    }

    const enriched = list.map((student) => {
      const assignment = assignmentsByStudent.get(student.id);
      return {
        ...student,
        room_number: assignment?.room_number ?? null,
        check_in_date: assignment?.check_in_date ?? null,
        fee_status: feeStatusFor(feesByStudent.get(student.id) ?? []),
      };
    });

    return NextResponse.json({ ok: true, students: enriched });
  } catch (error) {
    console.error('Failed to fetch hostel students', error);
    return NextResponse.json({ ok: false, error: 'Unable to load students.' }, { status: 500 });
  }
}
