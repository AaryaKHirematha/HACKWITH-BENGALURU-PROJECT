/**
 * Live Agent Activity Monitor
 * Real-time visualization of all six agents' states, tasks, and throughput
 */

import { motion } from 'framer-motion';
import { Activity, Brain, CheckCircle2, Loader2, MessageCircle, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import { agentProfiles, agentColorMap } from '@/agents';
import { useAgentOrchestrationStore } from '@/agents/store/useAgentOrchestrationStore';
import { staggerContainer, fadeInUp } from '@/utils/animations';
import type { AgentRuntime } from '@/agents/types';

export function AgentActivityMonitor() {
  const { agents, runtimes, tick: tickCount, isRunning } = useAgentOrchestrationStore();

  return (
    <Card glow="cyan" noPadding>
      <div className="p-5">
        <CardHeader>
          <CardTitle>
            <Activity className="h-5 w-5 text-cyan-400" />
            Live Agent Activity Monitor
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" size="sm">tick {tickCount}</Badge>
            <Badge variant={isRunning ? 'success' : 'warning'} size="sm">
              <span className={cn('mr-1.5 inline-block h-1.5 w-1.5 rounded-full', isRunning ? 'bg-green-400 animate-pulse' : 'bg-yellow-400')} />
              {isRunning ? 'Autonomous' : 'Paused'}
            </Badge>
          </div>
        </CardHeader>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3 p-5 pt-0 sm:grid-cols-2 lg:grid-cols-3"
      >
        {agents.map((agent) => {
          const runtime = runtimes.find((r) => r.agentId === agent.id);
          return (
            <motion.div key={agent.id} variants={fadeInUp}>
              <AgentCard agent={agent} runtime={runtime} />
            </motion.div>
          );
        })}
      </motion.div>
    </Card>
  );
}

function AgentCard({ agent, runtime }: { agent: typeof agentProfiles[0]; runtime?: AgentRuntime }) {
  const state = runtime?.state ?? 'idle';
  const stateColors: Record<string, string> = {
    idle: 'bg-slate-600',
    reasoning: 'bg-purple-500 animate-pulse',
    executing: 'bg-cyan-500 animate-pulse',
    communicating: 'bg-amber-500 animate-pulse',
    waiting: 'bg-yellow-500',
    error: 'bg-red-500 animate-pulse',
  };

  const stateBadge: Record<string, 'default' | 'success' | 'primary' | 'secondary' | 'warning' | 'danger'> = {
    idle: 'default',
    reasoning: 'secondary',
    executing: 'primary',
    communicating: 'warning',
    waiting: 'secondary',
    error: 'danger',
  };

  const color = agentColorMap[agent.role] ?? '#6b7280';

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border p-4 transition-all',
      'bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm',
      state === 'executing' || state === 'reasoning'
        ? 'border-cyan-500/30 shadow-lg shadow-cyan-500/10'
        : 'border-slate-700/40',
    )}>
      {/* Accent line */}
      <div className="absolute top-0 left-0 h-full w-1 rounded-l-xl" style={{ backgroundColor: color }} />

      {/* Header */}
      <div className="flex items-start gap-3 mb-3 pl-2">
        <div className="text-2xl">{agent.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white truncate">{agent.name}</h4>
            <span className="text-[10px] font-mono text-gray-500">{agent.codename}</span>
          </div>
          <p className="text-[11px] text-gray-400 capitalize">{agent.role.replace(/_/g, ' ')}</p>
        </div>
        <div className={cn('h-2.5 w-2.5 rounded-full mt-1', stateColors[state])} />
      </div>

      {/* State badge */}
      <div className="pl-2 mb-3">
        <Badge variant={stateBadge[state] ?? 'default'} size="sm">
          {state === 'executing' && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
          {state === 'reasoning' && <Brain className="mr-1 h-3 w-3 animate-pulse" />}
          {state}
        </Badge>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2 pl-2">
        <MetricBox
          icon={<CheckCircle2 className="h-3 w-3" />}
          value={runtime?.tasksCompleted ?? 0}
          label="Done"
          color="text-green-400"
        />
        <MetricBox
          icon={<MessageCircle className="h-3 w-3" />}
          value={runtime?.messagesSent ?? 0}
          label="Msgs"
          color="text-cyan-400"
        />
        <MetricBox
          icon={<Zap className="h-3 w-3" />}
          value={runtime?.insightsGenerated ?? 0}
          label="Insights"
          color="text-purple-400"
        />
      </div>
    </div>
  );
}

function MetricBox({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  return (
    <div className="rounded-lg bg-slate-950/50 p-2 text-center">
      <div className={cn('mb-1 flex justify-center', color)}>{icon}</div>
      <p className="text-sm font-bold text-white">{value}</p>
      <p className="text-[9px] text-gray-500 uppercase">{label}</p>
    </div>
  );
}
