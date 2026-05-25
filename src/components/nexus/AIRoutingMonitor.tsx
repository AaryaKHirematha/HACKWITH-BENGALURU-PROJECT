/**
 * AIRoutingMonitor
 * Compact live view of CascadeFlow model routing decisions.
 */

import { motion } from 'framer-motion';
import { Route, Brain, Zap, ArrowRight, RefreshCw, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { RoutingDecision } from '@/cascade';

interface AIRoutingMonitorProps {
  decisions: RoutingDecision[];
  activeDecision: RoutingDecision | null;
}

export function AIRoutingMonitor({ decisions, activeDecision }: AIRoutingMonitorProps) {
  const recent = decisions.slice(0, 10);

  return (
    <Card glow="cyan" noPadding className="h-full">
      <div className="p-5">
        <CardHeader>
          <CardTitle><Route className="h-5 w-5 text-cyan-400" />AI Routing Monitor</CardTitle>
          <Badge variant="primary" size="sm">{decisions.length} routes</Badge>
        </CardHeader>
      </div>

      {/* Active decision highlight */}
      {activeDecision && (
        <div className="mx-5 mb-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
          <div className="flex items-center gap-2 text-xs mb-2">
            <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse', activeDecision.finalTier === 'tier2' ? 'bg-orange-400' : 'bg-cyan-400')} />
            <span className="font-semibold text-white">{activeDecision.selectedModel.name}</span>
            <ArrowRight className="h-3 w-3 text-gray-500" />
            <Badge variant={activeDecision.finalTier === 'tier2' ? 'warning' : 'primary'} size="sm" className="text-[9px]">
              {activeDecision.finalTier}
            </Badge>
          </div>
          <div className="flex gap-4 text-[10px] text-gray-400">
            <span><Brain className="inline h-3 w-3 mr-0.5 text-purple-400" />{activeDecision.confidenceAfter}%</span>
            <span><Zap className="inline h-3 w-3 mr-0.5 text-cyan-400" />{activeDecision.latencyMs}ms</span>
            <span className="text-green-300">${activeDecision.costSavedUsd.toFixed(4)} saved</span>
          </div>
        </div>
      )}

      <div className="max-h-[340px] overflow-y-auto px-5 pb-5 space-y-1.5">
        {recent.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-2 rounded-lg bg-slate-950/50 border border-slate-800/40 px-3 py-2 text-[11px]"
          >
            <div className={cn('h-2 w-2 rounded-full', d.finalTier === 'tier2' ? 'bg-orange-500' : 'bg-cyan-500')} />
            <span className="text-gray-300 truncate flex-1">{d.selectedModel.name}</span>
            <span className="text-gray-500">{d.latencyMs}ms</span>
            {d.failoverUsed && <ShieldAlert className="h-3 w-3 text-red-400" />}
            {d.retryCount > 0 && <RefreshCw className="h-3 w-3 text-yellow-400" />}
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
