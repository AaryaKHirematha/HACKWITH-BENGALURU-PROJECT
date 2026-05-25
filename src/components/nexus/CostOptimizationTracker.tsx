/**
 * CostOptimizationTracker
 * Compact cost analytics widget showing CascadeFlow savings.
 */

import { motion } from 'framer-motion';
import { DollarSign, PiggyBank, TrendingDown, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import { formatNumber } from '@/utils/format';
import type { RuntimeAnalytics } from '@/cascade';

export function CostOptimizationTracker({ analytics }: { analytics: RuntimeAnalytics }) {
  const savingsRate = analytics.baselineCostUsd > 0 ? (analytics.costSavedUsd / analytics.baselineCostUsd) * 100 : 0;

  return (
    <Card glow="green">
      <CardHeader>
        <CardTitle><PiggyBank className="h-5 w-5 text-green-400" />Cost Optimization Tracker</CardTitle>
        <Badge variant="success" size="sm">${analytics.costSavedUsd.toFixed(4)} saved</Badge>
      </CardHeader>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <CostBox icon={<DollarSign className="h-4 w-4" />} label="Adaptive spend" value={`$${analytics.totalCostUsd.toFixed(4)}`} color="text-cyan-300" />
        <CostBox icon={<TrendingDown className="h-4 w-4" />} label="Baseline cost" value={`$${analytics.baselineCostUsd.toFixed(4)}`} color="text-red-300" />
        <CostBox icon={<Layers className="h-4 w-4" />} label="Total tokens" value={formatNumber(analytics.totalTokens)} color="text-purple-300" />
        <CostBox icon={<Layers className="h-4 w-4" />} label="Compressed" value={formatNumber(analytics.compressedTokens)} color="text-green-300" />
      </div>

      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-green-200 font-medium">Savings efficiency</span>
          <span className="font-mono text-white">{savingsRate.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-950/70">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
          />
        </div>
      </div>
    </Card>
  );
}

function CostBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-slate-700/40 bg-slate-950/40 p-3">
      <div className={cn('mb-2', color)}>{icon}</div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}
