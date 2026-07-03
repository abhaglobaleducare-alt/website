'use client';

import { useCurrency } from './context';
import { cn } from '@/lib/utils';

/**
 * Pill switch — "USD $" | "INR ₹" — gold active state on navy. Reads/writes the
 * shared CurrencyProvider (persisted in localStorage).
 */
export default function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      role="group"
      aria-label="Fee currency"
      className={cn(
        'inline-flex items-center rounded-full bg-[#0B1A35] p-1 text-sm font-semibold',
        className,
      )}
    >
      {(['USD', 'INR'] as const).map((c) => {
        const active = currency === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => setCurrency(c)}
            aria-pressed={active}
            className={cn(
              'rounded-full px-3.5 py-1.5 transition-colors duration-200',
              active
                ? 'bg-[#C6962E] text-[#0B1A35]'
                : 'text-white/70 hover:text-white',
            )}
          >
            {c === 'USD' ? 'USD $' : 'INR ₹'}
          </button>
        );
      })}
    </div>
  );
}
