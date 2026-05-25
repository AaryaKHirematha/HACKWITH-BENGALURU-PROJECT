/**
 * Multi-Agent Orchestration Page
 * Phase 5 — Autonomous AI agent collaboration dashboard
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Bot, Pause, Play, RotateCcw } from 'lucide-react';
import {
  AgentActivityMonitor,
  ReasoningFlow,
  CommunicationGraph,
  TaskExecutionTimeline,
  InvestigationTracker,
  AgentInsightsPanel,
} from '@/components/agents';
import { Button, Badge, StatCard } from '@/components/ui';
import { useAgentOrchestrationStore } from '@/agents';
import { useSimulationStore } from '@/simulation';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { formatNumber } from '@/utils/format';

export function Agents() {
  const {
    runtimes,
    memories,
    isRunning,
    tick: tickCount,
    processTick,
    toggleRunning,
    reset,
  } = useAgentOrchestrationStore();
  const { events, isLoaded, isGenerating, generateEvents } = useSimulationStore();
  const tickRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Generate events if not loaded
  useEffect(() => {
    if (!isLoaded && !isGenerating) {
      void generateEvents();
    }
  }, [isLoaded, isGenerating, generateEvents]);

  // Autonomous tick loop
  useEffect(() => {
    if (!isRunning || events.length === 0) return;

    tickRef.current = setInterval(() => {
      processTick(events);
    }, 2800);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isRunning, events, processTick]);

  // Compute aggregate stats
  const totalCompleted = runtimes.reduce((sum, r) => sum + r.tasksCompleted, 0);
  const totalMsgs = runtimes.reduce((sum, r) => sum + r.messagesSent + r.messagesReceived, 0);
  const activeAgents = runtimes.filter((r) => r.state !== 'idle').length;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-950/50 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(168,85,247,0.16),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(6,182,212,0.14),transparent_28%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="neon" size="sm">PHASE 5</Badge>
              <Badge variant={isRunning ? 'success' : 'warning'} size="sm">
                {isRunning ? 'Autonomous agents active' : 'Agents paused'}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Multi-Agent AI Orchestration
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-400">
              Six specialized autonomous AI agents collaborate in real time — detecting threats, correlating evidence, reflecting on conclusions, investigating deeply, optimizing costs, and synthesizing narratives.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={isRunning ? 'danger' : 'primary'}
              onClick={toggleRunning}
            >
              {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isRunning ? 'Pause Agents' : 'Resume Agents'}
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <motion.div variants={fadeInUp}>
          <StatCard label="Orchestration Ticks" value={formatNumber(tickCount)} icon={<Brain className="h-6 w-6 text-cyan-400" />} trend="up" change={tickCount * 2} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Tasks Completed" value={formatNumber(totalCompleted)} icon={<Bot className="h-6 w-6 text-green-400" />} trend="up" change={8.4} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Active Agents" value={`${activeAgents}/${runtimes.length}`} icon={<Brain className="h-6 w-6 text-purple-400" />} trend="neutral" />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Messages Exchanged" value={formatNumber(totalMsgs)} icon={<Bot className="h-6 w-6 text-amber-400" />} trend="up" change={15.2} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Shared Memories" value={formatNumber(memories.length)} icon={<Brain className="h-6 w-6 text-emerald-400" />} trend="up" change={12.7} />
        </motion.div>
      </motion.div>

      {/* Agent Activity Monitor */}
      <AgentActivityMonitor />

      {/* Main Grid: Communication + Reasoning + Tasks */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <CommunicationGraph />
        <ReasoningFlow />
        <TaskExecutionTimeline />
      </div>

      {/* Bottom: Investigations + Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InvestigationTracker />
        <AgentInsightsPanel />
      </div>
    </div>
  );
}
