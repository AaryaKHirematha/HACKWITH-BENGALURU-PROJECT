/**
 * IntelligencePropagationScene
 * Animated cyber-defense topology showing intelligence moving through
 * ingress, routing, agents, memory, forensics, and defense output.
 */

import { motion } from 'framer-motion';
import { Brain, Database, Radio, Shield, Sparkles, Workflow } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { DemoBeat } from '@/demo';

const nodes = [
  { id: 'ingress', label: 'Signal Ingress', icon: Radio, x: 40, y: 170, color: 'text-cyan-300' },
  { id: 'routing', label: 'CascadeFlow', icon: Workflow, x: 175, y: 95, color: 'text-purple-300' },
  { id: 'agents', label: 'Multi-Agent Mesh', icon: Brain, x: 175, y: 245, color: 'text-fuchsia-300' },
  { id: 'memory', label: 'Hindsight Memory', icon: Database, x: 340, y: 95, color: 'text-green-300' },
  { id: 'forensics', label: 'Forensic Reasoning', icon: Sparkles, x: 340, y: 245, color: 'text-amber-300' },
  { id: 'defense', label: 'Command Outcome', icon: Shield, x: 500, y: 170, color: 'text-cyan-300' },
] as const;

const sceneMap: Record<DemoBeat['spotlight'], string[]> = {
  incident_feed: ['ingress', 'routing'],
  timeline: ['ingress', 'agents'],
  routing: ['routing', 'agents', 'memory'],
  memory: ['agents', 'memory', 'forensics'],
  agents: ['routing', 'agents', 'forensics'],
  cost: ['routing', 'defense'],
  forensics: ['memory', 'forensics', 'defense'],
};

const edges = [
  ['ingress', 'routing'],
  ['routing', 'agents'],
  ['routing', 'memory'],
  ['agents', 'memory'],
  ['agents', 'forensics'],
  ['memory', 'forensics'],
  ['forensics', 'defense'],
] as const;

function position(id: string) {
  return nodes.find((node) => node.id === id)!;
}

export function IntelligencePropagationScene({ beat }: { beat: DemoBeat | null }) {
  const activeNodes = beat ? sceneMap[beat.spotlight] ?? [] : [];

  return (
    <Card noPadding className="h-full">
      <div className="p-5 pb-0">
        <CardHeader>
          <CardTitle><Sparkles className="h-5 w-5 text-cyan-400" />Animated Intelligence Propagation</CardTitle>
          <Badge variant="primary" size="sm">cinematic systems map</Badge>
        </CardHeader>
      </div>

      <div className="relative mx-auto my-5" style={{ width: 560, height: 340, maxWidth: '100%' }}>
        <div className="absolute inset-0 rounded-2xl border border-slate-700/40 bg-slate-950/65" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:28px_28px] rounded-2xl" />

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 340">
          {edges.map(([fromId, toId], index) => {
            const from = position(fromId);
            const to = position(toId);
            const active = activeNodes.includes(fromId) && activeNodes.includes(toId);
            return (
              <motion.line
                key={`${fromId}-${toId}`}
                x1={from.x + 28}
                y1={from.y + 28}
                x2={to.x + 28}
                y2={to.y + 28}
                stroke={active ? 'rgba(34,211,238,0.7)' : 'rgba(71,85,105,0.45)'}
                strokeWidth={active ? 2 : 1}
                initial={{ pathLength: 0.2, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: active ? 1 : 0.55 }}
                transition={{ duration: 0.6, delay: index * 0.04 }}
              />
            );
          })}

          {edges
            .filter(([fromId, toId]) => activeNodes.includes(fromId) && activeNodes.includes(toId))
            .map(([fromId, toId], index) => {
              const from = position(fromId);
              const to = position(toId);
              return (
                <motion.circle
                  key={`particle-${fromId}-${toId}`}
                  r={4}
                  fill="rgba(34,211,238,0.95)"
                  initial={{ cx: from.x + 28, cy: from.y + 28, opacity: 0 }}
                  animate={{
                    cx: [from.x + 28, to.x + 28],
                    cy: [from.y + 28, to.y + 28],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{ duration: 1.5, delay: index * 0.18, repeat: Infinity, ease: 'easeInOut' }}
                />
              );
            })}
        </svg>

        {nodes.map((node, index) => {
          const Icon = node.icon;
          const active = activeNodes.includes(node.id);
          return (
            <motion.div
              key={node.id}
              className={cn(
                'absolute flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl border p-3 text-center',
                active ? 'border-cyan-500/45 bg-cyan-500/10 shadow-lg shadow-cyan-500/10' : 'border-slate-700/40 bg-slate-900/55',
              )}
              style={{ left: node.x, top: node.y }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: active ? 1.03 : 1 }}
              transition={{ delay: Math.min(index * 0.04, 0.25) }}
            >
              {active && (
                <motion.div
                  className="absolute inset-0 rounded-xl border border-cyan-400/30"
                  animate={{ opacity: [0.2, 0.85, 0.2] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
              )}
              <div className={cn('mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950/70', node.color)}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-[11px] font-semibold text-white leading-tight">{node.label}</p>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
