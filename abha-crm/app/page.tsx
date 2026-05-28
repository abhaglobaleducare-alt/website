import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-900 via-[#0D315B] to-[#112A52] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12 sm:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur-md sm:p-10">
          <div className="mb-8">
            <span className="inline-flex items-center rounded-full bg-saffron/15 px-4 py-1 text-sm font-semibold text-saffron">
              AI-Powered NEET & MBBS Abroad Support
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              ABHA Global Educare Staff CRM & Productivity System
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
              A mobile-first, role-driven workspace for directors, admins, staff, and hostel
              managers.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Secure Auth',
                description: 'Supabase auth scaffolding and role-based routing.',
              },
              {
                icon: Sparkles,
                title: 'PWA Ready',
                description: 'Manifest and service worker support from day one.',
              },
              {
                icon: ArrowRight,
                title: 'Modular UI',
                description: 'Tailwind, shadcn-style components, and responsive pages.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"
              >
                <card.icon className="mb-4 h-8 w-8 text-saffron" />
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-brand-900 transition hover:bg-slate-100"
            >
              Get started
            </Link>
            <p className="text-sm text-slate-300">
              Phase 1 foundation is ready. Continue to Phase 2 after verification.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
