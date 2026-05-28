import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email : 'staff@example.com';
    const fullName = typeof body.full_name === 'string' ? body.full_name : 'New Staff';
    const role = typeof body.role === 'string' ? body.role : 'staff';
    const designation = typeof body.designation === 'string' ? body.designation : null;
    const officeId = typeof body.office_id === 'string' ? body.office_id : null;
    const phone = typeof body.phone === 'string' ? body.phone : null;
    const baseSalary = typeof body.base_salary === 'number' ? body.base_salary : 0;
    const allowedBonusTypes = ['admission', 'reference_distribution', 'none'];
    const bonusType = allowedBonusTypes.includes(body.bonus_type) ? body.bonus_type : 'none';
    const isBonusEligible =
      typeof body.is_bonus_eligible === 'boolean' ? body.is_bonus_eligible : bonusType !== 'none';
    const token = randomUUID();
    const inviteExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const existingUsers = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers.data.users.find((item) => item.email === email);

    let userId = existingUser?.id;

    if (!userId) {
      const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: randomUUID(),
        email_confirm: true,
        user_metadata: { full_name: fullName, role },
      });

      if (createError || !createdUser.user) {
        throw createError ?? new Error('Unable to create auth user.');
      }

      userId = createdUser.user.id;
    }

    const { error: insertError } = await supabaseAdmin.from('users').upsert(
      {
        id: userId,
        email,
        full_name: fullName,
        phone,
        role,
        designation,
        office_id: officeId,
        base_salary: baseSalary,
        is_bonus_eligible: isBonusEligible,
        bonus_type: bonusType,
        status: 'pending_invite',
        invite_token: token,
        invite_sent_at: new Date().toISOString(),
        invite_expires_at: inviteExpiresAt,
      },
      { onConflict: 'id' },
    );

    if (insertError) {
      throw insertError;
    }

    const resendKey = process.env.RESEND_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const inviteUrl = `${appUrl}/invite/${token}`;

    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ABHA Global Educare <onboarding@resend.dev>',
          to: [email],
          subject: 'Welcome to ABHA Global Educare - Activate your account',
          html: `<p>Hello ${fullName},</p><p>Welcome to ABHA Global Educare. Activate your account here:</p><p><a href="${inviteUrl}">${inviteUrl}</a></p>`,
        }),
      });
    }

    return NextResponse.json({
      ok: true,
      token,
      inviteUrl,
      email,
      message: resendKey
        ? 'Invite created and email request sent.'
        : 'Invite created. Set RESEND_API_KEY to deliver the email.',
    });
  } catch (error) {
    console.error('Failed to create invite', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to create staff invite.' },
      { status: 500 },
    );
  }
}
