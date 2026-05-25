/**
 * ForensicSummaryBanner
 * Hero banner for the top forensic conclusion and key metrics.
 */

import { motion } from 'framer-motion';
import { Brain, Radar, ShieldAlert, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { ForensicAnalysisResult, ForensicCluster } from '@/forensics';

export function ForensicSummaryBanner({ analysis, cluster }: { analysis: ForensicAnalysisResult | null; cluster: ForensicCluster | null }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-950/50 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_80%_25%,rgba(6,182,212,0.14),transparent_26%),radial-gradient(circle_at_50%_95%,rgba(236,72,153,0.08),transparent_22%)]" />
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />

      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-4xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="neon" size="sm">PHASE 7</Badge>
            <Badge variant={cluster?.coordinatedBehavior ? 'warning' : 'secondary'} size="sm">
              {cluster?.coordinatedBehavior ? 'Coordinated behavior detected' : 'Explainable reasoning online'}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white xl:text-4xl">AI Forensic Reasoning Engine</h1>
          <p className="mt-2 text-sm text-gray-400">
            {analysis?.topConclusion ?? 'Analyzing telemetry for contextual forensic relationships and coordinated threat behavior.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric icon={<Brain className="h-4 w-4" />} label="Overall confidence" value={`${analysis?.overallConfidence ?? 0}%`} />
          <Metric icon={<ShieldAlert className="h-4 w-4" />} label="Clusters" value={`${analysis?.clusters.length ?? 0}`} />
          <Metric icon={<Radar className="h-4 w-4" />} label="Predictions" value={`${analysis?.predictions.length ?? 0}`} />
          <Metric icon={<TrendingUp className="h-4 w-4" />} label="Attack probability" value={`${cluster?.futureAttackProbability ?? 0}%`} />
        </div>
      </div>
    </section>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700/40 bg-slate-900/60 p-3">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">{icon}</div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
    </div>
  );
}
