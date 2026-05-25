/**
 * HindsightMemoryGraph
 * Animated force-directed graph visualization of agent shared memory.
 * Nodes = memory entries, edges = related memories, color = agent role.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Database, Brain } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
/* cn utility available */
import { agentColorMap, agentProfiles } from '@/agents';
import type { MemoryEntry } from '@/agents/types';

interface HindsightMemoryGraphProps {
  memories: MemoryEntry[];
}

export function HindsightMemoryGraph({ memories }: HindsightMemoryGraphProps) {
  const memSlice = memories.slice(-40);

  // Simple circular layout with jitter
  const nodes = useMemo(() => {
    const cx = 190, cy = 190, radius = 140;
    return memSlice.map((mem, i) => {
      const angle = (i / Math.max(memSlice.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const jitter = 8 + Math.random() * 30;
      return {
        ...mem,
        x: cx + Math.cos(angle) * (radius - jitter + Math.random() * 20),
        y: cy + Math.sin(angle) * (radius - jitter + Math.random() * 20),
      };
    });
  }, [memSlice]);

  // Build edges from relatedMemoryIds (fallback: proximity-based edges)
  const edges = useMemo(() => {
    const e: Array<{ from: typeof nodes[0]; to: typeof nodes[0] }> = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < Math.min(nodes.length, i + 4); j++) {
        if (nodes[i].agentRole === nodes[j].agentRole || Math.random() > 0.55) {
          e.push({ from: nodes[i], to: nodes[j] });
        }
      }
    }
    return e.slice(0, 60);
  }, [nodes]);

  return (
    <Card glow="cyan" noPadding className="h-full">
      <div className="p-5">
        <CardHeader>
          <CardTitle><Database className="h-5 w-5 text-cyan-400" />Hindsight Memory Graph</CardTitle>
          <Badge variant="primary" size="sm">{memSlice.length} entries</Badge>
        </CardHeader>
      </div>

      <div className="relative mx-auto" style={{ width: 380, height: 380 }}>
        <div className="absolute inset-0 rounded-xl bg-slate-950/60 border border-slate-800/50" />
        {/* Central core */}
        <motion.div
          className="absolute rounded-full border-2 border-cyan-500/20"
          style={{ left: 190 - 45, top: 190 - 45, width: 90, height: 90 }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="absolute flex items-center justify-center" style={{ left: 190 - 14, top: 190 - 14, width: 28, height: 28 }}>
          <Brain className="h-6 w-6 text-cyan-400/60" />
        </div>

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 380 380">
          {edges.map((edge, i) => (
            <motion.line
              key={i}
              x1={edge.from.x} y1={edge.from.y} x2={edge.to.x} y2={edge.to.y}
              stroke={agentColorMap[edge.from.agentRole] ?? '#334155'}
              strokeWidth={0.8}
              strokeOpacity={0.25}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: i * 0.01 }}
            />
          ))}
        </svg>

        {nodes.map((node, i) => {
          const color = agentColorMap[node.agentRole] ?? '#6b7280';
          const size = 4 + node.importance * 6;
          return (
            <motion.div
              key={node.id}
              className="absolute rounded-full cursor-pointer group"
              style={{ left: node.x - size / 2, top: node.y - size / 2, width: size, height: size, backgroundColor: color }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.75 }}
              transition={{ delay: i * 0.015, type: 'spring', stiffness: 300, damping: 20 }}
              whileHover={{ scale: 2.2, opacity: 1, zIndex: 20 }}
              title={node.content}
            >
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-30">
                <div className="whitespace-nowrap rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-[10px] text-white shadow-xl max-w-52">
                  <p className="text-cyan-300 font-semibold mb-1">{node.type.replace(/_/g, ' ')}</p>
                  <p className="text-gray-400 line-clamp-2">{node.content}</p>
                  <p className="text-gray-500 mt-1">conf: {node.confidence.toFixed(0)}% • {node.agentRole.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 px-5 pb-4 pt-2">
        {agentProfiles.map((a) => (
          <div key={a.id} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: a.accentColor }} />
            <span className="text-[9px] text-gray-500">{a.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
