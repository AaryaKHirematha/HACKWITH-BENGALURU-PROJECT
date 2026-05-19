/**
 * Button Component
 * Enterprise-grade button with variants, sizes, and loading states
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

// ============================================================
// BUTTON VARIANTS
// ============================================================

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-[0.98]',
  ].join(' '),
  {
    variants: {
      variant: {
        // Primary cyan/neon accent
        primary: [
          'bg-gradient-to-r from-cyan-500 to-cyan-600',
          'text-white shadow-lg shadow-cyan-500/25',
          'hover:from-cyan-400 hover:to-cyan-500 hover:shadow-cyan-500/40',
          'focus:ring-cyan-500',
          'border border-cyan-400/50',
        ].join(' '),
        // Secondary purple accent
        secondary: [
          'bg-gradient-to-r from-purple-500 to-purple-600',
          'text-white shadow-lg shadow-purple-500/25',
          'hover:from-purple-400 hover:to-purple-500 hover:shadow-purple-500/40',
          'focus:ring-purple-500',
          'border border-purple-400/50',
        ].join(' '),
        // Danger red accent
        danger: [
          'bg-gradient-to-r from-red-500 to-red-600',
          'text-white shadow-lg shadow-red-500/25',
          'hover:from-red-400 hover:to-red-500 hover:shadow-red-500/40',
          'focus:ring-red-500',
          'border border-red-400/50',
        ].join(' '),
        // Warning orange accent
        warning: [
          'bg-gradient-to-r from-orange-500 to-orange-600',
          'text-white shadow-lg shadow-orange-500/25',
          'hover:from-orange-400 hover:to-orange-500 hover:shadow-orange-500/40',
          'focus:ring-orange-500',
          'border border-orange-400/50',
        ].join(' '),
        // Success green accent
        success: [
          'bg-gradient-to-r from-green-500 to-green-600',
          'text-white shadow-lg shadow-green-500/25',
          'hover:from-green-400 hover:to-green-500 hover:shadow-green-500/40',
          'focus:ring-green-500',
          'border border-green-400/50',
        ].join(' '),
        // Ghost/transparent
        ghost: [
          'bg-transparent',
          'text-gray-300 hover:text-white',
          'hover:bg-white/10',
          'focus:ring-gray-500',
          'border border-transparent hover:border-white/10',
        ].join(' '),
        // Outline with border
        outline: [
          'bg-transparent',
          'text-cyan-400',
          'border border-cyan-500/50',
          'hover:bg-cyan-500/10 hover:border-cyan-400',
          'focus:ring-cyan-500',
        ].join(' '),
        // Cyberpunk neon
        cyber: [
          'bg-black',
          'text-cyan-400',
          'border-2 border-cyan-500',
          'shadow-[0_0_15px_rgba(6,182,212,0.3)]',
          'hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]',
          'hover:bg-cyan-500/10',
          'focus:ring-cyan-500',
          'relative overflow-hidden',
          'before:absolute before:inset-0',
          'before:bg-gradient-to-r before:from-transparent before:via-cyan-500/10 before:to-transparent',
          'before:translate-x-[-100%] hover:before:translate-x-[100%]',
          'before:transition-transform before:duration-500',
        ].join(' '),
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// ============================================================
// BUTTON TYPES
// ============================================================

export interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Show loading spinner */
  loading?: boolean;
  /** Loading text to display */
  loadingText?: string;
}

// ============================================================
// BUTTON COMPONENT
// ============================================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {loading && loadingText ? loadingText : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Export for convenience
export { buttonVariants };
