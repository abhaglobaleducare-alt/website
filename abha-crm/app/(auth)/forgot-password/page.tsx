'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Logo } from '../../../components/shared/Logo';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071a37_0%,#0b2545_100%)] px-4 py-10 text-white lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center">
        <Card className="w-full space-y-6 p-8">
          <Logo />
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-saffron">Password reset</p>
            <h1 className="mt-3 text-3xl font-semibold">Forgot Password</h1>
            <p className="mt-2 text-slate-300">
              Enter your business email and we’ll send a secure reset link.
            </p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <Input type="email" placeholder="you@abhaedu.com" required />
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </form>
          {sent ? (
            <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">
              Reset instructions have been queued for your email.
            </p>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
