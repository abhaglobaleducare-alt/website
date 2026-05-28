import type { ReactNode } from 'react';
import { Card } from '../ui/card';

export function DashboardShell({
  title,
  summary,
  children,
}: {
  title: string;
  summary?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#071a37_0%,#0b2545_100%)] px-4 pb-24 pt-6 text-white lg:px-6 lg:pb-10">
      <div className="mx-auto flex max-w-7xl gap-6">
        <div className="flex-1 space-y-6">
          <Card className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-saffron">Portal</p>
            <h1 className="text-3xl font-semibold text-white">{title}</h1>
            {summary ? <p className="text-slate-300">{summary}</p> : null}
          </Card>
          {children}
        </div>
      </div>
    </main>
  );
}
