/**
 * Live Routing Pipeline Visualization
 * Animated view of autonomous CascadeFlow routing stages.
 */

import { motion } from 'framer-motion';
import { ArrowRight, Brain, CheckCircle2, Cpu, GitBranch, Radio, RefreshCw, ShieldAlert, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { RoutingDecision, RoutingStage } from '@/cascade';

interface RuntimePipelineVisualizationProps {
  decision: RoutingDecision | null;
  activeStage: RoutingStage;
}

const stageMeta: Array<{ stage: RoutingStage; label: string; icon: React.ElementType }> = [
  { stage: 'ingested', label: 'Signal Ingest', icon: Radio },
  { stage: 'routed', label: 'Routing Policy', icon: GitBranch },
  { stage: 'inferencing', label: 'Inference', icon: Brain },
  { stage: 'escalating', label: 'Escalation Gate', icon: ShieldAlert },
  { stage: 'retrying', label: 'Retry Strategy', icon: RefreshCw },
  { stage: 'failover', label: 'Failover Logic', icon: Cpu },
  { stage: 'completed', label: 'Decision Ready', icon: CheckCircle2 },
];

export function RuntimePipelineVisualization({ decision, activeStage }: RuntimePipelineVisualizationProps) {
  const activeIndex = stageMeta.findIndex((stage) => stage.stage === activeStage);
  const modelTier = decision?.finalTier === 'tier2' ? 'Frontier escalation' : 'Fast-path tier 1';

  return (
    <Card glow={decision?.escalationRequired ? 'orange' : 'cyan'} className="min-h-[320px]">
      <CardHeader>
        <CardTitle>
          <Zap className="h-5 w-5 text-cyan-400" />
          Live Routing Pipeline
        </CardTitle>
        <Badge variant={decision?.escalationRequired ? 'warning' : 'primary'} size="sm">
          {decision ? modelTier : 'Awaiting signal'}
        </Badge>
      </CardHeader>

      <div className="relative overflow-hidden rounded-xl border border-slate-700/40 bg-slate-950/40 p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.12),transparent_30%),radial-gradient(circle_at_80%_50%,rgba(168,85,247,0.1),transparent_28%)]" />

        <div className="relative grid grid-cols-1 gap-3 xl:grid-cols-7">
          {stageMeta.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.stage === activeStage;
            const isComplete = activeIndex > index || activeStage === 'completed';
            const isSuppressed = (item.stage === 'retrying' && !decision?.retryCount) || (item.stage === 'failover' && !decision?.failoverUsed);

            return (
              <div key={item.stage} className="relative flex items-center gap-3 xl:block">
                <motion.div
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    opacity: isSuppressed ? 0.35 : 1,
                    boxShadow: isActive ? '0 0 28px rgba(6, 182, 212, 0.35)' : '0 0 0 rgba(0,0,0,0)',
                  }}
                  transition={{ duration: 0.35 }}
                  className={cn(
                    'relative z-10 rounded-xl border p-4 transition-colors',
                    isActive && 'border-cyan-400/70 bg-cyan-500/10',
                    isComplete && !isActive && 'border-green-500/40 bg-green-500/10',
                    !isActive && !isComplete && 'border-slate-700/50 bg-slate-900/60',
                    item.stage === 'escalating' && decision?.escalationRequired && 'border-orange-500/60 bg-orange-500/10',
                  )}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border border-cyan-300/50"
                      animate={{ opacity: [0.2, 0.8, 0.2] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                  )}
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950/70 text-cyan-300">
                    <Icon className={cn('h-5 w-5', isActive && 'animate-pulse')} />
                  </div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-xs text-gray-500">{stageCaption(item.stage, decision)}</p>
                </motion.div>

                {index < stageMeta.length - 1 && (
                  <div className="hidden xl:absolute xl:left-[calc(100%-4px)] xl:top-1/2 xl:z-20 xl:block xl:-translate-y-1/2">
                    <ArrowRight className={cn('h-5 w-5', isComplete ? 'text-cyan-400' : 'text-slate-700')} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function stageCaption(stage: RoutingStage, decision: RoutingDecision | null): string {
  if (!decision) return 'No active route';
  if (stage === 'ingested') return `${decision.inputTokens.toLocaleString()} raw tokens`;
  if (stage === 'routed') return decision.selectedModel.name;
  if (stage === 'inferencing') return `${decision.latencyMs} ms projected`;
  if (stage === 'escalating') return decision.escalationRequired ? 'Escalated to tier 2' : 'No escalation';
  if (stage === 'retrying') return decision.retryCount ? `${decision.retryCount} retry attempts` : 'Bypassed';
  if (stage === 'failover') return decision.failoverUsed ? 'Backup model engaged' : 'Healthy primary';
  return `${decision.confidenceAfter}% confidence`;
}