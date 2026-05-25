/**
 * Inter-Agent Communication Graph
 * Animated node-link visualization of agent-to-agent messaging
 */

import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import { agentColorMap } from '@/agents';
import { useAgentOrchestrationStore } from '@/agents/store/useAgentOrchestrationStore';

// Circular layout positions for 6 agents
const nodePositions: Array<{ x: number; y: number }> = [
  { x: 200, y: 60 },   // top center
  { x: 340, y: 130 },  // top right
  { x: 340, y: 270 },  // bottom right
  { x: 200, y: 340 },  // bottom center
  { x: 60, y: 270 },   // bottom left
  { x: 60, y: 130 },   // top left
];

export function CommunicationGraph() {
  const { agents, messages, runtimes } = useAgentOrchestrationStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Compute edge weights from recent messages
  const edges = useMemo(() => {
    const edgeMap = new Map<string, { from: string; to: string; count: number; active: boolean }>();

    for (const msg of messages.slice(-40)) {
      const key = `${msg.fromAgentId}->${msg.toAgentId}`;
      const existing = edgeMap.get(key);
      if (existing) {
        existing.count += 1;
        existing.active = true;
      } else {
        edgeMap.set(key, { from: msg.fromAgentId, to: msg.toAgentId, count: 1, active: true });
      }
    }

    return Array.from(edgeMap.values()).sort((a, b) => b.count - a.count).slice(0, 12);
  }, [messages]);

  // Recent message count
  const recentMsgCount = messages.filter((m) => {
    const diff = Date.now() - m.timestamp.getTime();
    return diff < 10000;
  }).length;

  return (
    <Card glow="purple" className="h-full" noPadding>
      <div className="p-5">
        <CardHeader>
          <CardTitle>
            <Radio className="h-5 w-5 text-purple-400" />
            Inter-Agent Communication Graph
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" size="sm">{edges.length} active links</Badge>
            <Badge variant="primary" size="sm">{recentMsgCount} msgs/10s</Badge>
          </div>
        </CardHeader>
      </div>

      <div
        ref={canvasRef}
        className="relative mx-auto"
        style={{ width: 400, height: 400 }}
      >
        {/* Background */}
        <div className="absolute inset-0 rounded-xl bg-slate-950/60 border border-slate-800/50" />

        {/* Edges (SVG) */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400">
          {edges.map((edge, idx) => {
            const fromIdx = agents.findIndex((a) => a.id === edge.from);
            const toIdx = agents.findIndex((a) => a.id === edge.to);
            if (fromIdx < 0 || toIdx < 0) return null;

            const from = nodePositions[fromIdx];
            const to = nodePositions[toIdx];
            const fromColor = agentColorMap[agents[fromIdx].role] ?? '#6b7280';
            const opacity = Math.min(1, 0.2 + edge.count * 0.08);

            return (
              <motion.line
                key={`${edge.from}-${edge.to}-${idx}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={fromColor}
                strokeWidth={Math.min(4, 1 + edge.count * 0.3)}
                strokeOpacity={opacity}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity }}
                transition={{ duration: 0.6, delay: idx * 0.04 }}
              />
            );
          })}

          {/* Animated particle for active edge */}
          {edges.slice(0, 3).map((edge, idx) => {
            const fromIdx = agents.findIndex((a) => a.id === edge.from);
            const toIdx = agents.findIndex((a) => a.id === edge.to);
            if (fromIdx < 0 || toIdx < 0) return null;

            const from = nodePositions[fromIdx];
            const to = nodePositions[toIdx];

            return (
              <motion.circle
                key={`particle-${idx}`}
                r={3}
                fill={agentColorMap[agents[fromIdx].role] ?? '#fff'}
                initial={{ cx: from.x, cy: from.y, opacity: 1 }}
                animate={{
                  cx: [from.x, to.x],
                  cy: [from.y, to.y],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: idx * 0.5,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {agents.map((agent, idx) => {
          const pos = nodePositions[idx];
          const runtime = runtimes.find((r) => r.agentId === agent.id);
          const isActive = runtime?.state === 'executing' || runtime?.state === 'reasoning';
          const color = agentColorMap[agent.role];

          return (
            <motion.div
              key={agent.id}
              className="absolute flex flex-col items-center"
              style={{ left: pos.x - 28, top: pos.y - 28, width: 56 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Node circle */}
              <div className={cn(
                'relative flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg',
                'bg-slate-900/90 backdrop-blur-sm',
                isActive ? 'border-cyan-400 shadow-lg shadow-cyan-500/30' : 'border-slate-600/60',
              )}>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: color }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <span>{agent.icon}</span>
              </div>
              {/* Label */}
              <p className="mt-1 text-[10px] font-semibold text-white text-center leading-tight">
                {agent.name}
              </p>
              <p className="text-[8px] text-gray-500">{agent.codename}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 px-5 pb-5 pt-3">
        {agents.map((agent) => (
          <div key={agent.id} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: agentColorMap[agent.role] }} />
            <span className="text-[10px] text-gray-400">{agent.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
