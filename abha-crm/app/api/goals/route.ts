import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';
import { getCurrentStaffFromRequest } from '../../../lib/auth/current';
import { priorityScore, type GoalPriority } from '../../../lib/constants/goals';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get('scope') ?? 'staff';
    const type = url.searchParams.get('type');
    const priority = url.searchParams.get('priority');
    const status = url.searchParams.get('status');
    const staffId = url.searchParams.get('staff_id');
    const officeId = url.searchParams.get('office_id');
    const parentGoalId = url.searchParams.get('parent_goal_id');
    const fromDate = url.searchParams.get('from');
    const toDate = url.searchParams.get('to');

    let query = supabaseAdmin
      .from('goals')
      .select(
        'id, user_id, parent_goal_id, title, description, goal_type, priority, priority_score, start_date, due_date, reminder_time, status, completion_notes, completed_at, created_at, assigned_by',
      )
      .order('priority_score', { ascending: false })
      .order('due_date', { ascending: true, nullsFirst: false });

    if (scope === 'staff') {
      const currentStaff = await getCurrentStaffFromRequest(request);
      if (currentStaff?.id) {
        query = query.eq('user_id', currentStaff.id);
      }
    }

    if (staffId) {
      query = query.eq('user_id', staffId);
    }

    if (type) {
      query = query.eq('goal_type', type);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (parentGoalId) {
      query = query.eq('parent_goal_id', parentGoalId);
    }

    if (fromDate) {
      query = query.gte('due_date', fromDate);
    }

    if (toDate) {
      query = query.lte('due_date', toDate);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    let goals = data ?? [];

    // Office scoping requires a join on users; filter post-fetch using the staff roster.
    if (officeId) {
      const { data: staffInOffice } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('office_id', officeId);
      const allowed = new Set((staffInOffice ?? []).map((row) => row.id));
      goals = goals.filter((goal) => allowed.has(goal.user_id));
    }

    return NextResponse.json({ ok: true, goals });
  } catch (error) {
    console.error('Failed to fetch goals', error);
    return NextResponse.json({ ok: false, error: 'Unable to load goals.' }, { status: 500 });
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

    if (!payload.title || !payload.goal_type) {
      return NextResponse.json(
        { ok: false, error: 'Title and goal type are required.' },
        { status: 400 },
      );
    }

    // When an admin assigns to another staff member, user_id is supplied and the
    // creator is recorded as assigned_by. Otherwise the goal belongs to the creator.
    const targetUserId = payload.user_id ?? currentStaff.id;
    const isAssignment = targetUserId !== currentStaff.id;
    const priority = (payload.priority ?? 'medium') as GoalPriority;

    const insertPayload = {
      user_id: targetUserId,
      parent_goal_id: payload.parent_goal_id || null,
      title: payload.title,
      description: payload.description ?? null,
      goal_type: payload.goal_type,
      priority,
      priority_score: priorityScore[priority] ?? 50,
      start_date: payload.start_date || null,
      due_date: payload.due_date || null,
      reminder_time: payload.reminder_time || null,
      status: 'pending',
      created_by: currentStaff.id,
      assigned_by: isAssignment ? currentStaff.id : null,
    };

    const { data, error } = await supabaseAdmin
      .from('goals')
      .insert(insertPayload)
      .select()
      .single();

    if (error || !data) {
      throw error ?? new Error('Goal insert failed.');
    }

    return NextResponse.json({ ok: true, goal: data });
  } catch (error) {
    console.error('Failed to create goal', error);
    return NextResponse.json({ ok: false, error: 'Unable to create goal.' }, { status: 500 });
  }
}
