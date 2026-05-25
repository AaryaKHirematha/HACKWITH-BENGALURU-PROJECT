/**
 * Runtime Stream Console
 * Live autonomous reasoning trace output — makes the runtime feel
 * visibly self-directed by streaming decision reasoning as it happens.
 */

import { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Wifi } from 'lucide-react';
import { Badge, Card, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/utils/cn';
import { useCascadeStore } from '@/cascade';
import type { DecisionReason, RoutingDecision } from '@/cascade';

const reasonPhrases: Record<DecisionReason, string> = {
  low_risk_fast_path: 'Routed to Tier 1 fast path — low anomaly footprint.',
  confidence_escalation: 'Confidence below Tier 1 threshold — promoting to Tier 2.',
  anomaly_escalation: 'Anomaly score exceeds policy — escalating to frontier model.',
  correlation_escalation: 'Multi-event correlation detected — upgrading to attack correlation graph.',
  latency_optimized: 'Latency fits inside budget — selected compressed inference path.',
  cost_optimized: 'Cost optimization applied — avoided frontier model spend.',
  retry_recovery: 'Primary inference failed — retrying with backoff strategy.',
  model_failover: 'Model degraded — failover to backup frontier endpoint.',
};

const reasonColors: Record<DecisionReason, string> = {
  low_risk_fast_path: 'text-cyan-300',
  confidence_escalation: 'text-yellow-300',
  anomaly_escalation: 'text-orange-300',
  correlation_escalation: 'text-amber-300',
  latency_optimized: 'text-green-300',
  cost_optimized: 'text-emerald-300',
  retry_recovery: 'text-red-300',
  model_failover: 'text-rose-300',
};

export function RuntimeStreamConsole() {
  const { decisions, isRunning } = useCascadeStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const stream = useMemo(() => decisions.slice(0, 28).reverse(), [decisions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [stream.length]);

  return (
    <Card className="flex h-full min-h-[360px] flex-col" noPadding>
      <div className="flex items-center justify-between border-b border-slate-700/40 px-5 py-4">
        <CardHeader className="mb-0">
          <CardTitle>
            <Terminal className="h-5 w-5 text-cyan-400" />
            Runtime Stream Console
          </CardTitle>
        </CardHeader>
        <Badge variant={isRunning ? 'success' : 'warning'} size="sm" className="flex items-center gap-1.5">
          <span className={cn('h-1.5 w-1.5 rounded-full', isRunning ? 'bg-green-400 animate-pulse' : 'bg-yellow-400')} />
          {isRunning ? 'Autonomous' : 'Paused'}
        </Badge>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-700/40 bg-slate-950/60 px-5 py-2 text-xs">
        <Wifi className="h-3.5 w-3.5 text-cyan-400" />
        <span className="font-mono text-gray-400">cascade://runtime/stream</span>
        <span className="ml-auto font-mono text-cyan-400">● connected</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-slate-950/80 p-4 font-mono text-[12px] leading-relaxed"
        style={{ maxHeight: '420px' }}
      >
        <AnimatePresence initial={false}>
          {stream.length === 0 ? (
            <p className="text-gray-600">// awaiting first signal from the threat intelligence pipeline...</p>
          ) : (
            stream.map((decision) => <StreamLine key={decision.id} decision={decision} />)
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

function StreamLine({ decision }: { decision: RoutingDecision }) {
  const timestamp = decision.completedAt.toLocaleTimeString('en-US', { hour12: false });
  const primaryReason = decision.reasons[0];
  const secondaryReasons = decision.reasons.slice(1);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-3 border-l-2 border-slate-800 pl-3 last:border-cyan-500/60"
    >
      <div className="flex items-center gap-2 text-gray-500">
        <span className="text-cyan-400">{timestamp}</span>
        <span className="text-gray-700">|</span>
        <span className={cn(
          'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase',
          decision.finalTier === 'tier2'
            ? 'bg-orange-500/15 text-orange-300'
            : 'bg-cyan-500/15 text-cyan-300',
        )}>
          {decision.finalTier}
        </span>
        <span className="text-gray-400">{decision.selectedModel.name}</span>
      </div>
      <p className="mt-1 text-gray-200">
        <span className="text-gray-600">→</span> {primaryReason ? reasonPhrases[primaryReason] : `Inference completed at ${decision.latencyMs}ms.`}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-gray-500">tokens: {decision.compressedTokens.toLocaleString()} in / {decision.outputTokens.toLocaleString()} out</span>
        <span className="text-gray-700">•</span>
        <span className="text-gray-500">latency: {decision.latencyMs}ms</span>
        <span className="text-gray-700">•</span>
        <span className="text-gray-500">confidence: {decision.confidenceAfter}%</span>
        <span className="text-gray-700">•</span>
        <span className="text-green-300">saved: ${decision.costSavedUsd.toFixed(4)}</span>
      </div>
      {secondaryReasons.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {secondaryReasons.map((reason) => (
            <span key={reason} className={cn('text-[10px] font-mono', reasonColors[reason])}>
              #{reason.replace(/_/g, '-')}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
