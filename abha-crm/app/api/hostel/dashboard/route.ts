import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const officeId = url.searchParams.get('office_id');
    const today = new Date().toISOString().slice(0, 10);

    let roomsQuery = supabaseAdmin.from('hostel_rooms').select('id, status');
    if (officeId) roomsQuery = roomsQuery.eq('office_id', officeId);

    const [
      { data: rooms },
      { data: arrivals },
      { data: departures },
      { data: fees },
      { data: complaints },
    ] = await Promise.all([
      roomsQuery,
      supabaseAdmin.from('hostel_room_assignments').select('id').eq('check_in_date', today),
      supabaseAdmin.from('hostel_room_assignments').select('id').eq('actual_check_out', today),
      supabaseAdmin
        .from('fee_schedule')
        .select('pending_amount, status')
        .eq('fee_type', 'hostel')
        .in('status', ['pending', 'partial', 'overdue']),
      supabaseAdmin.from('hostel_complaints').select('id').in('status', ['open', 'in_progress']),
    ]);

    const roomList = rooms ?? [];
    const roomStats = {
      total: roomList.length,
      occupied: roomList.filter((room) => room.status === 'occupied').length,
      available: roomList.filter((room) => room.status === 'available').length,
      maintenance: roomList.filter((room) => room.status === 'maintenance').length,
      reserved: roomList.filter((room) => room.status === 'reserved').length,
    };

    const pendingFeesAmount = (fees ?? []).reduce(
      (sum, fee) => sum + Number(fee.pending_amount ?? 0),
      0,
    );

    // Recent activity feed: merge recent complaints + assignments + daily logs.
    const [{ data: recentComplaints }, { data: recentAssignments }, { data: recentLogs }] =
      await Promise.all([
        supabaseAdmin
          .from('hostel_complaints')
          .select('id, complaint_title, raised_at')
          .order('raised_at', { ascending: false })
          .limit(5),
        supabaseAdmin
          .from('hostel_room_assignments')
          .select('id, check_in_date, created_at, student:student_id(full_name)')
          .order('created_at', { ascending: false })
          .limit(5),
        supabaseAdmin
          .from('hostel_daily_log')
          .select('id, log_date, created_at')
          .order('created_at', { ascending: false })
          .limit(3),
      ]);

    const activity = [
      ...(recentComplaints ?? []).map((item) => ({
        type: 'complaint',
        label: `Complaint: ${item.complaint_title}`,
        at: item.raised_at,
      })),
      ...(recentAssignments ?? []).map((item) => {
        const student = item.student as { full_name?: string } | null;
        return {
          type: 'assignment',
          label: `Room assigned to ${student?.full_name ?? 'student'}`,
          at: item.created_at,
        };
      }),
      ...(recentLogs ?? []).map((item) => ({
        type: 'log',
        label: `Daily log recorded for ${item.log_date}`,
        at: item.created_at,
      })),
    ]
      .filter((entry) => entry.at)
      .sort((a, b) => new Date(b.at as string).getTime() - new Date(a.at as string).getTime())
      .slice(0, 10);

    return NextResponse.json({
      ok: true,
      roomStats,
      arrivalsToday: (arrivals ?? []).length,
      departuresToday: (departures ?? []).length,
      pendingFees: { count: (fees ?? []).length, amount: pendingFeesAmount },
      openComplaints: (complaints ?? []).length,
      activity,
    });
  } catch (error) {
    console.error('Failed to load hostel dashboard', error);
    return NextResponse.json({ ok: false, error: 'Unable to load dashboard.' }, { status: 500 });
  }
}
