'use server';

export async function signInAction() {
  return { ok: true, message: 'Authentication will be wired to Supabase in Phase 3.' };
}

export async function resetPasswordAction() {
  return { ok: true, message: 'Password reset email will be sent through Supabase in Phase 3.' };
}
