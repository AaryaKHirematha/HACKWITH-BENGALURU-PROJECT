/**
 * Cost Savings Monitor
 * Shows how adaptive routing reduces frontier-model spend.
 */

import { motion } from 'framer-motion';
import { DollarSign, PiggyBank, Route, TrendingDown } from 'lucide-react';
import { Badge, Card, CardHeader, CardTitle } from '@/components/ui';
import type { RuntimeAnalytics } from '@/cascade';

interface CostSavingsMonitorProps {
  analytics: RuntimeAnalytics;
}

export function CostSavingsMonitor({ analytics }: CostSavingsMonitorProps) {
  const savingsRate = analytics.baselineCostUsd > 0 ? (analytics.costSavedUsd / analytics.baselineCostUsd) * 100 : 0;
  const avoidedTier2 = Math.max(0, analytics.tier1Requests - analytics.escalations);

  return (
    <Card glow="green">
      <CardHeader>
        <CardTitle>
          <PiggyBank className="h-5 w-5 text-green-400" />
          Cost Savings Monitor
        </CardTitle>
        <Badge variant="success" size="sm">${analytics.costSavedUsd.toFixed(4)} saved</Badge>
      </CardHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <CostPanel icon={<DollarSign className="h-5 w-5" />} label="Adaptive spend" value={`$${analytics.totalCostUsd.toFixed(4)}`} />
        <CostPanel icon={<TrendingDown className="h-5 w-5" />} label="Baseline avoided" value={`$${analytics.baselineCostUsd.toFixed(4)}`} />
        <CostPanel icon={<Route className="h-5 w-5" />} label="Tier 2 calls avoided" value={avoidedTier2.toString()} />
      </div>

      <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-green-200">Savings efficiency</span>
          <span className="font-mono text-sm text-white">{savingsRate.toFixed(1)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-950/70">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
          />
        </div>
      </div>
    </Card>
  );
}

function CostPanel({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-green-500/20 bg-green-500/10 text-green-300">
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}