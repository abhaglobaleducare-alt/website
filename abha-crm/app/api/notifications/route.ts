import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';

const ALLOWED_TYPES = [
  'goal_reminder',
  'admin_alert',
  'lead_assigned',
  'bonus_pending',
  'leave_update',
  'student_update',
  'reference_bonus',
  'system',
  'general',
  'expense_approval',
  'low_stock_alert',
  'infrastructure_damage',
];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const isRead = url.searchParams.get('is_read');

    let query = supabaseAdmin
      .from('notifications')
      .select(
        'id, user_id, title, message, type, link, is_read, created_at, user:user_id(full_name)',
      )
      .order('created_at', { ascending: false })
      .limit(200);

    if (type) query = query.eq('type', type);
    if (isRead === 'true') query = query.eq('is_read', true);
    if (isRead === 'false') query = query.eq('is_read', false);

    const { data, error } = await query;
    if (error) throw error;

    const notifications = data ?? [];
    const unread = notifications.filter((n) => !n.is_read).length;

    return NextResponse.json({ ok: true, notifications, unread });
  } catch (error) {
    console.error('Failed to fetch notifications', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to load notifications.' },
      { status: 500 },
    );
  }
}

// Broadcast a notification to every active user.
export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    if (!payload.title || !payload.message) {
      return NextResponse.json(
        { ok: false, error: 'Title and message are required.' },
        { status: 400 },
      );
    }

    const type = ALLOWED_TYPES.includes(payload.type) ? payload.type : 'admin_alert';

    const { data: users, error: usersError } = await supabaseAdmin.from('users').select('id');
    if (usersError) throw usersError;

    const rows = (users ?? []).map((user) => ({
      user_id: user.id,
      title: payload.title,
      message: payload.message,
      type,
      link: payload.link || null,
    }));

    if (rows.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 });
    }

    const { error } = await supabaseAdmin.from('notifications').insert(rows);
    if (error) throw error;

    return NextResponse.json({ ok: true, sent: rows.length });
  } catch (error) {
    console.error('Failed to broadcast notification', error);
    return NextResponse.json({ ok: false, error: 'Unable to send broadcast.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.action === 'mark_all_read') {
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('is_read', false);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update notifications', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to update notifications.' },
      { status: 500 },
    );
  }
}
