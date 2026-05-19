/**
 * Token Usage Dashboard
 * Runtime analytics for token optimization and inference throughput.
 */

import { motion } from 'framer-motion';
import { Gauge, Layers, Timer, Workflow } from 'lucide-react';
import { Badge, Card, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/utils/cn';
import { formatNumber } from '@/utils/format';
import type { RuntimeAnalytics } from '@/cascade';

interface TokenUsageDashboardProps {
  analytics: RuntimeAnalytics;
}

export function TokenUsageDashboard({ analytics }: TokenUsageDashboardProps) {
  const compressionRate = analytics.totalTokens > 0 ? (analytics.compressedTokens / analytics.totalTokens) * 100 : 0;
  const tier2Ratio = analytics.totalRequests > 0 ? (analytics.tier2Requests / analytics.totalRequests) * 100 : 0;

  return (
    <Card glow="cyan">
      <CardHeader>
        <CardTitle>
          <Layers className="h-5 w-5 text-cyan-400" />
          Token Usage Dashboard
        </CardTitle>
        <Badge variant="primary" size="sm">Adaptive compression</Badge>
      </CardHeader>

      <div className="grid grid-cols-2 gap-4">
        <TokenMetric
          icon={<Workflow className="h-5 w-5" />}
          label="Total routed tokens"
          value={formatNumber(analytics.totalTokens)}
          accent="cyan"
        />
        <TokenMetric
          icon={<Gauge className="h-5 w-5" />}
          label="Compressed tokens"
          value={formatNumber(analytics.compressedTokens)}
          accent="green"
        />
        <TokenMetric
          icon={<Timer className="h-5 w-5" />}
          label="Avg latency"
          value={`${analytics.averageLatencyMs}ms`}
          accent="purple"
        />
        <TokenMetric
          icon={<Layers className="h-5 w-5" />}
          label="Tier 2 ratio"
          value={`${tier2Ratio.toFixed(1)}%`}
          accent="orange"
        />
      </div>

      <div className="mt-5 space-y-4">
        <ProgressRow label="Token compression efficiency" value={compressionRate} color="bg-cyan-400" />
        <ProgressRow label="Average confidence" value={analytics.averageConfidence} color="bg-purple-400" />
        <ProgressRow label="Escalation pressure" value={analytics.totalRequests ? (analytics.escalations / analytics.totalRequests) * 100 : 0} color="bg-orange-400" />
      </div>
    </Card>
  );
}

function TokenMetric({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: 'cyan' | 'green' | 'purple' | 'orange';
}) {
  const accents = {
    cyan: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
    green: 'border-green-500/25 bg-green-500/10 text-green-300',
    purple: 'border-purple-500/25 bg-purple-500/10 text-purple-300',
    orange: 'border-orange-500/25 bg-orange-500/10 text-orange-300',
  };

  return (
    <div className="rounded-xl border border-slate-700/40 bg-slate-950/35 p-4">
      <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-lg border', accents[accent])}>{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}

function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono text-white">{safeValue.toFixed(1)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={cn('h-full rounded-full', color)}
        />
      </div>
    </div>
  );
}