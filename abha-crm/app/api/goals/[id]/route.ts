import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server';
import { priorityScore, type GoalPriority } from '../../../../lib/constants/goals';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabaseAdmin
      .from('goals')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, goal: data ?? null });
  } catch (error) {
    console.error('Failed to fetch goal', error);
    return NextResponse.json({ ok: false, error: 'Unable to load goal.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json().catch(() => ({}));
    const updateFields: Record<string, unknown> = {};

    const editableFields = [
      'title',
      'description',
      'goal_type',
      'parent_goal_id',
      'start_date',
      'due_date',
      'reminder_time',
      'status',
    ] as const;

    editableFields.forEach((key) => {
      if (body[key] !== undefined) {
        updateFields[key] = body[key];
      }
    });

    if (body.priority !== undefined) {
      const priority = body.priority as GoalPriority;
      updateFields.priority = priority;
      updateFields.priority_score = priorityScore[priority] ?? 50;
    }

    // Completing a goal requires mandatory completion notes.
    if (body.status === 'completed') {
      const notes = String(body.completion_notes ?? '').trim();
      if (!notes) {
        return NextResponse.json(
          { ok: false, error: 'Completion notes are required to mark a goal complete.' },
          { status: 400 },
        );
      }
      updateFields.completion_notes = notes;
      updateFields.completed_at = new Date().toISOString();
    } else if (body.completion_notes !== undefined) {
      updateFields.completion_notes = body.completion_notes;
    }

    updateFields.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('goals')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error || !data) {
      throw error ?? new Error('Goal update failed.');
    }

    return NextResponse.json({ ok: true, goal: data });
  } catch (error) {
    console.error('Failed to update goal', error);
    return NextResponse.json({ ok: false, error: 'Unable to update goal.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Detach children so the parent can be removed without violating the FK.
    await supabaseAdmin
      .from('goals')
      .update({ parent_goal_id: null })
      .eq('parent_goal_id', params.id);

    const { error } = await supabaseAdmin.from('goals').delete().eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete goal', error);
    return NextResponse.json({ ok: false, error: 'Unable to delete goal.' }, { status: 500 });
  }
}
