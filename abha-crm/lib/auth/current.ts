import { supabaseAdmin } from '../supabase/server';

const CURRENT_STAFF_COOKIE = 'abha-user-id';

function parseCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;

  return (
    cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.split('=')[1] ?? null
  );
}

export interface CurrentStaff {
  id: string;
  office_id?: string | null;
  role?: string | null;
}

export async function getCurrentStaffFromRequest(request: Request): Promise<CurrentStaff | null> {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const currentUserId = parseCookieValue(cookieHeader, CURRENT_STAFF_COOKIE);

  if (currentUserId) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, office_id, role')
      .eq('id', currentUserId)
      .maybeSingle();

    if (!error && data) return data;
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, office_id, role')
    .eq('role', 'staff')
    .limit(1)
    .maybeSingle();

  return !error && data ? data : null;
}
