import { NextResponse } from 'next/server';

export function supabaseMiddleware() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  return NextResponse.next();
}
