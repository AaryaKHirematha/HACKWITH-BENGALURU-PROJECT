/**
 * Model Decision Timeline
 * Chronological decision trace for autonomous model routing.
 */

import { motion } from 'framer-motion';
import { Brain, Clock, DollarSign, GitMerge, ShieldAlert, Zap } from 'lucide-react';
import { Badge, Card, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { DecisionReason, RoutingDecision } from '@/cascade';

interface ModelDecisionTimelineProps {
  decisions: RoutingDecision[];
  onSelect: (decision: RoutingDecision) => void;
  selectedId?: string;
}

const reasonLabels: Record<DecisionReason, string> = {
  low_risk_fast_path: 'Fast path',
  confidence_escalation: 'Confidence escalation',
  anomaly_escalation: 'Anomaly escalation',
  correlation_escalation: 'Correlation escalation',
  latency_optimized: 'Latency optimized',
  cost_optimized: 'Cost optimized',
  retry_recovery: 'Retry recovery',
  model_failover: 'Model failover',
};

export function ModelDecisionTimeline({ decisions, onSelect, selectedId }: ModelDecisionTimelineProps) {
  return (
    <Card className="h-full" noPadding>
      <div className="p-5">
        <CardHeader>
          <CardTitle>
            <GitMerge className="h-5 w-5 text-purple-400" />
            Model Decision Timeline
          </CardTitle>
          <Badge variant="secondary" size="sm">{decisions.length} routes</Badge>
        </CardHeader>
      </div>

      <div className="max-h-[640px] space-y-3 overflow-y-auto px-5 pb-5">
        {decisions.length === 0 ? (
          <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-6 text-center text-sm text-gray-400">
            Runtime decisions will appear as signals enter CascadeFlow.
          </div>
        ) : (
          decisions.slice(0, 36).map((decision, index) => (
            <motion.button
              key={decision.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index * 0.025, 0.4) }}
              onClick={() => onSelect(decision)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-all',
                selectedId === decision.id
                  ? 'border-cyan-400/60 bg-cyan-500/10'
                  : 'border-slate-700/50 bg-slate-900/45 hover:border-slate-600/70 hover:bg-slate-800/50',
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{decision.selectedModel.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{decision.taskType.replace(/_/g, ' ')}</p>
                </div>
                <Badge variant={decision.finalTier === 'tier2' ? 'warning' : 'primary'} size="sm">
                  {decision.finalTier.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <Metric icon={<Clock className="h-3.5 w-3.5" />} value={`${decision.latencyMs}ms`} />
                <Metric icon={<Brain className="h-3.5 w-3.5" />} value={`${decision.confidenceAfter}%`} />
                <Metric icon={<DollarSign className="h-3.5 w-3.5" />} value={`$${decision.estimatedCostUsd.toFixed(4)}`} />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {decision.reasons.slice(0, 3).map((reason) => (
                  <span
                    key={reason}
                    className={cn(
                      'rounded-full border px-2 py-0.5 text-[10px]',
                      reason.includes('escalation')
                        ? 'border-orange-500/30 bg-orange-500/10 text-orange-300'
                        : 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
                    )}
                  >
                    {reasonLabels[reason]}
                  </span>
                ))}
                {decision.failoverUsed && <ShieldAlert className="h-4 w-4 text-red-400" />}
                {decision.retryCount > 0 && <Zap className="h-4 w-4 text-yellow-400" />}
              </div>
            </motion.button>
          ))
        )}
      </div>
    </Card>
  );
}

function Metric({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-slate-950/50 px-2 py-1.5 text-gray-300">
      <span className="text-cyan-400">{icon}</span>
      <span>{value}</span>
    </div>
  );
}