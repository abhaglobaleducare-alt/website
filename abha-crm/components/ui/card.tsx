import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-soft',
        className,
      )}
    >
      {children}
    </div>
  );
}
