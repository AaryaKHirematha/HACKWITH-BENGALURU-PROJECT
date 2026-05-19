/**
 * AttackChainVisualizer
 * Explains attack-chain progression for the selected cluster with
 * animated propagation between correlated incidents.
 */

import { motion } from 'framer-motion';
import { GitBranch, ArrowRight, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { ForensicCluster } from '@/forensics';

const severityColor: Record<string, string> = {
  critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-blue-500', info: 'bg-slate-500',
};

export function AttackChainVisualizer({ cluster }: { cluster: ForensicCluster | null }) {
  return (
    <Card glow="purple" className="h-full">
      <CardHeader>
        <CardTitle><GitBranch className="h-5 w-5 text-purple-400" />Attack Chain Visualizer</CardTitle>
        <Badge variant="secondary" size="sm">{cluster ? cluster.attackChainStages.length : 0} stages</Badge>
      </CardHeader>

      {!cluster ? (
        <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-8 text-center text-sm text-gray-500">
          Select a forensic cluster to inspect its attack chain.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Chain header */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <p className="text-sm font-semibold text-white">{cluster.conclusion}</p>
            <p className="mt-1 text-[12px] text-gray-400">{cluster.investigationSummary}</p>
          </div>

          {/* Stage flow */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {cluster.events.map((event, index) => (
              <div key={event.id} className="flex items-center gap-3 lg:flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative flex-1 rounded-xl border border-slate-700/40 bg-slate-950/50 p-4"
                >
                  {index < cluster.events.length - 1 && (
                    <motion.div
                      className="pointer-events-none absolute top-1/2 left-full hidden h-0.5 lg:block"
                      style={{ width: 48, background: 'linear-gradient(90deg, rgba(6,182,212,.7), rgba(168,85,247,.5))' }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.3, repeat: Infinity, delay: index * 0.15 }}
                    />
                  )}

                  <div className="mb-2 flex items-center gap-2">
                    <div className={cn('h-2.5 w-2.5 rounded-full', severityColor[event.threatLevel])} />
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">{cluster.attackChainStages[index] ?? `Stage ${index + 1}`}</span>
                  </div>
                  <p className="text-sm font-semibold text-white line-clamp-2">{event.title}</p>
                  <p className="mt-1 text-[11px] text-gray-500">{event.eventType.replace(/_/g, ' ')} • {new Date(event.timestamp).toLocaleTimeString('en-US', { hour12: false })}</p>
                  <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-500">
                    <span>Anomaly <span className="text-cyan-300">{event.anomalyScore}</span></span>
                    <span>Confidence <span className="text-purple-300">{event.confidenceScore}%</span></span>
                  </div>
                </motion.div>
                {index < cluster.events.length - 1 && <ArrowRight className="hidden lg:block h-4 w-4 text-gray-600" />}
              </div>
            ))}
          </div>

          {/* Threat propagation bar */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Threat propagation</p>
            <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-red-400"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.max(18, cluster.futureAttackProbability)}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-2 text-[11px] text-gray-400 flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-cyan-400" />Projected next-step probability: <span className="text-white font-semibold">{cluster.futureAttackProbability}%</span></p>
          </div>
        </div>
      )}
    </Card>
  );
}
