/**
 * Threat Summary Widget
 * Displays aggregated threat intelligence metrics
 */

import { motion } from 'framer-motion';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { staggerContainer, fadeInUp } from '@/utils/animations';
import { formatNumber, formatPercentage } from '@/utils/format';

// ============================================================
// MOCK DATA (Replace with real API data in production)
// ============================================================

const threatMetrics = [
  {
    id: 'total-threats',
    label: 'Total Threats',
    value: 1847,
    change: 12.5,
    trend: 'up' as const,
    icon: Shield,
    color: 'cyan',
  },
  {
    id: 'critical-alerts',
    label: 'Critical Alerts',
    value: 23,
    change: -5.2,
    trend: 'down' as const,
    icon: AlertTriangle,
    color: 'red',
  },
  {
    id: 'mitigated',
    label: 'Mitigated',
    value: 1654,
    change: 8.7,
    trend: 'up' as const,
    icon: Activity,
    color: 'green',
  },
  {
    id: 'active-incidents',
    label: 'Active Incidents',
    value: 42,
    change: 3.1,
    trend: 'up' as const,
    icon: TrendingUp,
    color: 'orange',
  },
];

// ============================================================
// COMPONENT
// ============================================================

export const ThreatSummaryWidget = () => {
  return (
    <Card glow="cyan" className="col-span-2">
      <CardHeader>
        <CardTitle>
          <Shield className="w-5 h-5 text-cyan-400" />
          Threat Intelligence Summary
        </CardTitle>
        <Badge variant="primary" size="sm">Last 24 hours</Badge>
      </CardHeader>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {threatMetrics.map((metric) => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </motion.div>

      {/* Trend Line Placeholder */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400">Threat Trend (7 days)</span>
          <span className="text-xs text-gray-500">Auto-updates every 30s</span>
        </div>
        <div className="h-24 flex items-end gap-1">
          {[65, 45, 78, 52, 89, 67, 72].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              className={cn(
                'flex-1 rounded-t-sm',
                i === 4 ? 'bg-cyan-500' : 'bg-cyan-500/30',
              )}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

// ============================================================
// METRIC CARD
// ============================================================

interface MetricCardProps {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

const MetricCard = ({ label, value, change, trend, icon: Icon, color }: MetricCardProps) => {
  const colorClasses = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === 'up' 
    ? (change > 0 ? 'text-green-400' : 'text-red-400')
    : (change < 0 ? 'text-green-400' : 'text-red-400');

  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        'p-4 rounded-xl',
        'bg-slate-800/30 border border-slate-700/30',
        'hover:border-slate-600/50 transition-colors'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          'p-2 rounded-lg border',
          colorClasses[color as keyof typeof colorClasses]
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div className={cn('flex items-center gap-1 text-xs', trendColor)}>
          <TrendIcon className="w-3 h-3" />
          <span>{formatPercentage(Math.abs(change))}</span>
        </div>
      </div>
      
      <p className="text-2xl font-bold text-white mb-1">
        {formatNumber(value)}
      </p>
      <p className="text-xs text-gray-400">{label}</p>
    </motion.div>
  );
};
