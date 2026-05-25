/**
 * Card Component
 * Enterprise-grade card with glassmorphism styling
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

// ============================================================
// CARD STYLES
// ============================================================

const cardBase = [
  'relative overflow-hidden rounded-xl',
  'bg-gradient-to-br from-slate-900/80 to-slate-800/50',
  'backdrop-blur-xl',
  'border border-slate-700/50',
  'shadow-xl shadow-black/20',
].join(' ');

const cardGlow = {
  cyan: 'hover:shadow-cyan-500/10 hover:border-cyan-500/30',
  purple: 'hover:shadow-purple-500/10 hover:border-purple-500/30',
  red: 'hover:shadow-red-500/10 hover:border-red-500/30',
  green: 'hover:shadow-green-500/10 hover:border-green-500/30',
  orange: 'hover:shadow-orange-500/10 hover:border-orange-500/30',
  none: '',
};

// ============================================================
// CARD TYPES
// ============================================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card glow color on hover */
  glow?: keyof typeof cardGlow;
  /** Enable hover effects */
  interactive?: boolean;
  /** Remove padding */
  noPadding?: boolean;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

// ============================================================
// CARD COMPONENTS
// ============================================================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      glow = 'none',
      interactive = false,
      noPadding = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardBase,
          cardGlow[glow],
          interactive && 'transition-all duration-300 hover:scale-[1.01] cursor-pointer',
          !noPadding && 'p-6',
          className
        )}
        {...props}
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-bl-3xl" />
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-lg font-semibold text-white',
        'flex items-center gap-2',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-gray-300', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-between mt-4 pt-4',
        'border-t border-slate-700/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

// ============================================================
// STAT CARD VARIANT
// ============================================================

export interface StatCardProps extends CardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ label, value, change, icon, trend = 'neutral', className, ...props }, ref) => {
    const trendColors = {
      up: 'text-green-400',
      down: 'text-red-400',
      neutral: 'text-gray-400',
    };

    const trendIcons = {
      up: '↗',
      down: '↘',
      neutral: '→',
    };

    return (
      <Card ref={ref} glow="cyan" interactive className={className} {...props}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-medium">{label}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {change !== undefined && (
              <p className={cn('text-sm flex items-center gap-1', trendColors[trend])}>
                <span>{trendIcons[trend]}</span>
                <span>{Math.abs(change)}%</span>
                <span className="text-gray-500">vs last period</span>
              </p>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              {icon}
            </div>
          )}
        </div>
      </Card>
    );
  }
);

StatCard.displayName = 'StatCard';
