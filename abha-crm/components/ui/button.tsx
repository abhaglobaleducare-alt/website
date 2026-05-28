import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  size?: 'default' | 'sm';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
          size === 'sm' ? 'px-3 py-2 text-xs' : 'px-5 py-3 text-sm',
          variant === 'ghost'
            ? 'bg-white/5 text-white hover:bg-white/10'
            : 'bg-saffron text-brand-900 hover:bg-yellow-500',
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
