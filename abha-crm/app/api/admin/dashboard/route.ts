import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { offices } from '../../../../lib/constants/staff';
import { funnelStages } from '../../../../lib/constants/students';
import { getSlabs, slabForCount } from '../../../../lib/bonus';

const PENDING_BONUS = ['pending_approval', 'approved', 'hold'];

export async function GET() {
  try {
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const today = now.toISOString().slice(0, 10);

    const [
      { data: students },
      { data: leads },
      { data: bonuses },
      { data: attendance },
      { data: complaints },
      { count: pendingFeeApprovals },
      { data: expenses },
      { data: store },
      { data: infra },
      { data: users },
      slabs,
    ] = await Promise.all([
      supabaseAdmin.from('students').select('id, full_name, funnel_stage, office_id, created_at'),
      supabaseAdmin
        .from('leads')
        .select('id, full_name, lead_status, office_id, assigned_staff_id, created_at'),
      supabaseAdmin
        .from('admission_bonus')
        .select('staff_id, bonus_type, bonus_amount, status, created_at'),
      supabaseAdmin.from('attendance').select('user_id, check_in_time').eq('date', today),
      supabaseAdmin.from('hostel_complaints').select('id, status'),
      supabaseAdmin
        .from('fee_schedule')
        .select('id', { count: 'exact', head: true })
        .eq('fee_type', 'hostel')
        .in('status', ['pending', 'partial', 'overdue']),
      supabaseAdmin
        .from('hostel_expenses')
        .select('total_cost, expense_date, approval_status, office_id, item_name'),
      supabaseAdmin.from('hostel_store').select('current_stock, minimum_stock_alert, item_name'),
      supabaseAdmin.from('hostel_infrastructure').select('damaged'),
      supabaseAdmin.from('users').select('id, full_name, office_id'),
      getSlabs(),
    ]);

    const studentList = students ?? [];
    const leadList = leads ?? [];
    const bonusList = bonuses ?? [];
    const expenseList = expenses ?? [];
    const userMap = new Map((users ?? []).map((u) => [u.id, u.full_name ?? 'Unknown']));

    const convertedLeads = leadList.filter((l) => l.lead_status === 'converted').length;

    const kpis = {
      totalStudents: studentList.length,
      leadsThisMonth: leadList.filter((l) => (l.created_at ?? '') >= monthStart).length,
      conversionRate:
        leadList.length > 0 ? Math.round((convertedLeads / leadList.length) * 100) : 0,
      pendingBonusesAmount: bonusList
        .filter((b) => PENDING_BONUS.includes(b.status ?? ''))
        .reduce((sum, b) => sum + Number(b.bonus_amount ?? 0), 0),
      checkedInToday: (attendance ?? []).length,
      openComplaints: (complaints ?? []).filter((c) =>
        ['open', 'in_progress'].includes(c.status ?? ''),
      ).length,
      pendingFeeApprovals: pendingFeeApprovals ?? 0,
      todayHostelExpenses: expenseList
        .filter((e) => e.expense_date === today)
        .reduce((sum, e) => sum + Number(e.total_cost ?? 0), 0),
      pendingExpenseCount: expenseList.filter((e) => e.approval_status === 'pending').length,
      pendingExpenseAmount: expenseList
        .filter((e) => e.approval_status === 'pending')
        .reduce((sum, e) => sum + Number(e.total_cost ?? 0), 0),
      lowStockCount: (store ?? []).filter(
        (s) => (s.current_stock ?? 0) <= (s.minimum_stock_alert ?? 0),
      ).length,
      infraDamagedCount: (infra ?? []).reduce((sum, i) => sum + (i.damaged ?? 0), 0),
    };

    // Funnel: counts per stage in canonical order.
    const stageCounts: Record<string, number> = {};
    studentList.forEach((s) => {
      const stage = s.funnel_stage ?? 'Lead Generated';
      stageCounts[stage] = (stageCounts[stage] ?? 0) + 1;
    });
    const funnel = funnelStages.map((stage) => ({ stage, count: stageCounts[stage] ?? 0 }));

    // Office comparison across the 4 known offices.
    const officeComparison = offices.map((office) => ({
      id: office.id,
      name: office.name,
      students: studentList.filter((s) => s.office_id === office.id).length,
      leads: leadList.filter((l) => l.office_id === office.id).length,
      conversions: leadList.filter(
        (l) => l.office_id === office.id && l.lead_status === 'converted',
      ).length,
      monthlyExpenses: expenseList
        .filter((e) => e.office_id === office.id && (e.expense_date ?? '') >= monthStart)
        .reduce((sum, e) => sum + Number(e.total_cost ?? 0), 0),
    }));

    // Leaderboard by admissions (admission bonuses), with current slab.
    const admissionsByStaff = new Map<string, number>();
    bonusList
      .filter((b) => b.bonus_type === 'admission')
      .forEach((b) =>
        admissionsByStaff.set(b.staff_id, (admissionsByStaff.get(b.staff_id) ?? 0) + 1),
      );

    const conversionsThisMonthByStaff = new Map<string, number>();
    leadList
      .filter(
        (l) =>
          l.lead_status === 'converted' &&
          (l.created_at ?? '') >= monthStart &&
          l.assigned_staff_id,
      )
      .forEach((l) =>
        conversionsThisMonthByStaff.set(
          l.assigned_staff_id,
          (conversionsThisMonthByStaff.get(l.assigned_staff_id) ?? 0) + 1,
        ),
      );

    const leaderboard = Array.from(admissionsByStaff.entries())
      .map(([staffId, admissions]) => {
        const slab = slabForCount(slabs, admissions);
        return {
          staff_id: staffId,
          name: userMap.get(staffId) ?? 'Unknown',
          admissions,
          conversionsThisMonth: conversionsThisMonthByStaff.get(staffId) ?? 0,
          slab: slab ? { name: slab.slab_name, icon: slab.slab_icon } : null,
        };
      })
      .sort((a, b) => b.admissions - a.admissions)
      .slice(0, 8);

    // Recent activity feed: merge several streams.
    const activity = [
      ...studentList
        .filter((s) => s.created_at)
        .slice(-6)
        .map((s) => ({
          type: 'student',
          label: `New student: ${s.full_name ?? 'Unnamed'}`,
          at: s.created_at as string,
        })),
      ...leadList
        .filter((l) => (l.created_at ?? '') >= today)
        .map((l) => ({
          type: 'lead',
          label: `New lead today: ${l.full_name ?? 'Unnamed'}`,
          at: l.created_at as string,
        })),
      ...(attendance ?? [])
        .filter((a) => a.check_in_time)
        .map((a) => ({
          type: 'checkin',
          label: `${userMap.get(a.user_id) ?? 'Staff'} checked in`,
          at: a.check_in_time as string,
        })),
      ...bonusList
        .filter((b) => b.created_at)
        .slice(-5)
        .map((b) => ({
          type: 'bonus',
          label: `Bonus triggered for ${userMap.get(b.staff_id) ?? 'staff'}`,
          at: b.created_at as string,
        })),
      ...expenseList
        .filter((e) => e.expense_date)
        .slice(-5)
        .map((e) => ({
          type: 'expense',
          label: `Expense: ${e.item_name}`,
          at: `${e.expense_date}T12:00:00Z`,
        })),
      ...(store ?? [])
        .filter((s) => (s.current_stock ?? 0) <= (s.minimum_stock_alert ?? 0))
        .slice(0, 5)
        .map((s) => ({
          type: 'low_stock',
          label: `Low stock: ${s.item_name}`,
          at: now.toISOString(),
        })),
    ]
      .filter((entry) => entry.at)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 15);

    return NextResponse.json({
      ok: true,
      kpis,
      funnel,
      officeComparison,
      leaderboard,
      activity,
    });
  } catch (error) {
    console.error('Failed to build admin dashboard', error);
    return NextResponse.json({ ok: false, error: 'Unable to load dashboard.' }, { status: 500 });
  }
}
