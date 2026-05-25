/**
 * Badge Component
 * Enterprise-grade badge for status, severity, and labels
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

// ============================================================
// BADGE VARIANTS
// ============================================================

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-full',
    'font-medium transition-colors',
    'border',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-slate-700/50 text-gray-300 border-slate-600/50',
        primary: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        secondary: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        success: 'bg-green-500/10 text-green-400 border-green-500/30',
        warning: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        danger: 'bg-red-500/10 text-red-400 border-red-500/30',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        // Threat severity specific
        critical: 'bg-red-600/20 text-red-400 border-red-500/40 shadow-red-500/20 shadow-sm',
        high: 'bg-orange-600/20 text-orange-400 border-orange-500/40',
        medium: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/40',
        low: 'bg-blue-600/20 text-blue-400 border-blue-500/40',
        info_level: 'bg-slate-600/20 text-slate-300 border-slate-500/40',
        // Cyberpunk neon variants
        cyber: 'bg-black/50 text-cyan-400 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
        neon: 'bg-black/50 text-fuchsia-400 border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.2)]',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
      },
      dot: {
        true: 'before:content-[""] before:w-2 before:h-2 before:rounded-full before:animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      dot: false,
    },
  }
);

// ============================================================
// BADGE TYPES
// ============================================================

export interface BadgeProps 
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Show dot indicator */
  dot?: boolean;
  /** Make badge glow */
  glow?: boolean;
}

// ============================================================
// BADGE COMPONENT
// ============================================================

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      dot = false,
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, dot }),
          glow && 'animate-pulse',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// ============================================================
// SEVERITY BADGE (Convenience Component)
// ============================================================

export interface SeverityBadgeProps extends Omit<BadgeProps, 'variant'> {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
}

export const SeverityBadge = forwardRef<HTMLSpanElement, SeverityBadgeProps>(
  ({ severity, ...props }, ref) => {
    const variantMap = {
      critical: 'critical',
      high: 'high',
      medium: 'medium',
      low: 'low',
      info: 'info_level',
    } as const;

    return (
      <Badge
        ref={ref}
        variant={variantMap[severity]}
        glow={severity === 'critical'}
        {...props}
      >
        {severity.toUpperCase()}
      </Badge>
    );
  }
);

SeverityBadge.displayName = 'SeverityBadge';

// ============================================================
// STATUS BADGE (Convenience Component)
// ============================================================

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'inactive' | 'processing' | 'error' | 'offline';
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const variantMap = {
      active: 'success',
      inactive: 'default',
      processing: 'primary',
      error: 'danger',
      offline: 'info',
    } as const;

    return (
      <Badge
        ref={ref}
        variant={variantMap[status]}
        dot={status === 'active' || status === 'processing'}
        {...props}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';
