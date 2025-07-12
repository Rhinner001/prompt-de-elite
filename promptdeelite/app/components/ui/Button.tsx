// components/ui/Button.tsx
'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-98';

    const variants = {
      default: 'bg-gradient-to-r from-[#2477e0] to-[#38bdf8] hover:from-[#1b5fc7] hover:to-[#2563eb] text-white shadow-md hover:shadow-lg',
      outline: 'border-2 border-white/20 text-gray-200 hover:text-white hover:border-white/40 hover:bg-white/10 shadow-sm hover:shadow-md',
      ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className, 'px-6 py-3')}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';