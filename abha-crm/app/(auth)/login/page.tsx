'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Logo } from '../../../components/shared/Logo';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1200);
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071a37_0%,#0b2545_100%)] px-4 py-10 text-white lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <Card className="w-full max-w-5xl overflow-hidden p-0 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6 bg-[linear-gradient(180deg,#0b2545_0%,#081a30_100%)] p-8 lg:p-10">
            <Logo />
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-saffron">Secure access</p>
              <h1 className="text-3xl font-semibold">ABHA Global Educare Staff CRM</h1>
              <p className="max-w-md text-slate-300">
                Role-based access for directors, staff, and hostel managers with mobile-first
                dashboards.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>• Fast onboarding and invite flow</li>
              <li>• Attendance, goals, and student management</li>
              <li>• Hostel and finance visibility</li>
            </ul>
          </section>
          <section className="p-8 lg:p-10">
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-slate-300">Sign in to continue to your portal.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label htmlFor="email" className="block text-sm text-slate-200">
                Email
                <Input
                  id="email"
                  type="email"
                  placeholder="you@abhaedu.com"
                  className="mt-2"
                  required
                />
              </label>
              <label htmlFor="password" className="block text-sm text-slate-200">
                Password
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-2"
                  required
                />
              </label>
              <div className="flex items-center justify-between text-sm text-slate-200">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                  />{' '}
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-saffron hover:text-yellow-400">
                  Forgot Password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </section>
        </Card>
      </div>
    </main>
  );
}
