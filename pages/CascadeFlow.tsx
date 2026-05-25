/**
 * CascadeFlow Page
 * Phase 3 adaptive runtime intelligence orchestration interface.
 */

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, BrainCircuit, GitBranch, Route, ShieldAlert, Sparkles } from 'lucide-react';
import { AdaptiveRuntimeControl, CostSavingsMonitor, ModelDecisionTimeline, RuntimePipelineVisualization, RuntimeStreamConsole, TokenUsageDashboard } from '@/components/cascade';
import { Badge, Card, CardHeader, CardTitle, StatCard } from '@/components/ui';
import { useCascadeStore } from '@/cascade';
import { useSimulationStore } from '@/simulation';
import { formatNumber } from '@/utils/format';
import { fadeInUp, staggerContainer } from '@/utils/animations';

export function CascadeFlow() {
  const {
    decisions,
    activeDecision,
    activeStage,
    analytics,
    isRunning,
    processEvent,
    processBatch,
    setActiveDecision,
    advanceStage,
  } = useCascadeStore();
  const { events, isLoaded, isGenerating, generateEvents } = useSimulationStore();

  useEffect(() => {
    if (!isLoaded && !isGenerating) {
      void generateEvents();
    }
  }, [generateEvents, isGenerating, isLoaded]);

  useEffect(() => {
    if (events.length > 0 && decisions.length === 0) {
      processBatch(events, 18);
    }
  }, [decisions.length, events, processBatch]);

  useEffect(() => {
    if (!isRunning || events.length === 0) return;

    const routeTimer = setInterval(() => {
      const event = events[Math.floor(Math.random() * Math.min(events.length, 400))];
      if (event) processEvent(event);
    }, 2200);

    const stageTimer = setInterval(() => {
      advanceStage();
    }, 850);

    return () => {
      clearInterval(routeTimer);
      clearInterval(stageTimer);
    };
  }, [advanceStage, events, isRunning, processEvent]);

  const tier1Share = analytics.totalRequests > 0 ? (analytics.tier1Requests / analytics.totalRequests) * 100 : 0;
  const escalationRate = analytics.totalRequests > 0 ? (analytics.escalations / analytics.totalRequests) * 100 : 0;

  const reasonSummary = useMemo(() => {
    const counts = decisions.reduce<Record<string, number>>((acc, decision) => {
      decision.reasons.forEach((reason) => {
        acc[reason] = (acc[reason] ?? 0) + 1;
      });
      return acc;
    }, {});
    return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 6);
  }, [decisions]);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/50 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(6,182,212,0.16),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.15),transparent_28%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="cyber" size="sm">PHASE 3</Badge>
              <Badge variant={isRunning ? 'success' : 'warning'} size="sm">
                {isRunning ? 'Autonomous runtime active' : 'Runtime paused'}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              CascadeFlow Adaptive Runtime Intelligence
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-400">
              Dynamic model routing middleware that optimizes tier selection, confidence escalation, token compression, latency, retry recovery, and inference failover in real time.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-700/50 bg-slate-950/60 p-3">
            <RuntimePulse label="Tier 1 fast path" value={`${tier1Share.toFixed(0)}%`} />
            <RuntimePulse label="Escalation rate" value={`${escalationRate.toFixed(0)}%`} />
            <RuntimePulse label="Avg latency" value={`${analytics.averageLatencyMs}ms`} />
          </div>
        </div>
      </section>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div variants={fadeInUp}>
          <StatCard label="Runtime Decisions" value={formatNumber(analytics.totalRequests)} icon={<Route className="h-6 w-6 text-cyan-400" />} trend="up" change={18.4} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Escalations" value={formatNumber(analytics.escalations)} icon={<ShieldAlert className="h-6 w-6 text-orange-400" />} trend="neutral" change={6.2} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Failovers" value={formatNumber(analytics.failovers)} icon={<GitBranch className="h-6 w-6 text-purple-400" />} trend="down" change={2.1} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Confidence" value={`${analytics.averageConfidence}%`} icon={<BrainCircuit className="h-6 w-6 text-green-400" />} trend="up" change={9.8} />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="space-y-6">
          <RuntimePipelineVisualization decision={activeDecision} activeStage={activeStage} />
          <RuntimeStreamConsole />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TokenUsageDashboard analytics={analytics} />
            <CostSavingsMonitor analytics={analytics} />
          </div>
          <AutonomySignals reasonSummary={reasonSummary} />
        </div>

        <div className="space-y-6">
          <AdaptiveRuntimeControl />
          <ModelDecisionTimeline decisions={decisions} selectedId={activeDecision?.id} onSelect={setActiveDecision} />
        </div>
      </div>
    </div>
  );
}

function RuntimePulse({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-28 rounded-lg border border-slate-700/40 bg-slate-900/60 p-3 text-center">
      <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.8)]" />
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  );
}

function AutonomySignals({ reasonSummary }: { reasonSummary: Array<[string, number]> }) {
  return (
    <Card glow="orange">
      <CardHeader>
        <CardTitle>
          <Sparkles className="h-5 w-5 text-orange-400" />
          Autonomous Decision Signals
        </CardTitle>
        <Badge variant="warning" size="sm">Live policy traces</Badge>
      </CardHeader>

      <div className="grid gap-3 md:grid-cols-3">
        {reasonSummary.length === 0 ? (
          <div className="col-span-3 rounded-xl border border-slate-700/40 bg-slate-950/40 p-4 text-sm text-gray-400">
            Routing reasons will populate as the runtime evaluates incoming events.
          </div>
        ) : (
          reasonSummary.map(([reason, count]) => (
            <div key={reason} className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-4">
              <div className="mb-3 flex items-center gap-2 text-cyan-300">
                <Activity className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">{reason.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-3xl font-bold text-white">{count}</p>
              <p className="mt-1 text-xs text-gray-500">runtime decisions</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}