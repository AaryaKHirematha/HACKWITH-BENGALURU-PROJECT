/**
 * AttackSequenceRail
 * Interactive step rail for the cinematic attack sequence.
 */

import { motion } from 'framer-motion';
import { ChevronRight, Radio } from 'lucide-react';
import { Badge, Card, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { DemoBeat } from '@/demo';

const stageAccent: Record<DemoBeat['stage'], string> = {
  ingest: 'bg-cyan-500',
  physical: 'bg-blue-500',
  breach: 'bg-red-500',
  pivot: 'bg-purple-500',
  correlation: 'bg-fuchsia-500',
  memory: 'bg-emerald-500',
  optimization: 'bg-green-500',
  forensics: 'bg-amber-500',
  resolution: 'bg-slate-400',
};

export function AttackSequenceRail({
  beats,
  currentBeatIndex,
  onSelect,
}: {
  beats: DemoBeat[];
  currentBeatIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <Card noPadding className="h-full">
      <div className="p-5 pb-0">
        <CardHeader>
          <CardTitle><Radio className="h-5 w-5 text-cyan-400" />Simulated Live Attack Sequence</CardTitle>
          <Badge variant="primary" size="sm">{beats.length} beats</Badge>
        </CardHeader>
      </div>

      <div className="max-h-[520px] overflow-y-auto px-5 pb-5 pt-3">
        <div className="relative">
          <div className="absolute left-[16px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-fuchsia-500/20 to-transparent" />
          <div className="space-y-2">
            {beats.map((beat, index) => {
              const isActive = index === currentBeatIndex;
              const isPast = index < currentBeatIndex;
              return (
                <motion.button
                  key={beat.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.35) }}
                  onClick={() => onSelect(index)}
                  className={cn(
                    'relative w-full rounded-xl border p-4 pl-10 text-left transition-all',
                    isActive
                      ? 'border-cyan-500/45 bg-cyan-500/10 shadow-lg shadow-cyan-500/5'
                      : isPast
                        ? 'border-fuchsia-500/20 bg-fuchsia-500/5'
                        : 'border-slate-700/40 bg-slate-950/40 hover:border-slate-600/60',
                  )}
                >
                  <div className={cn(
                    'absolute left-[10px] top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-slate-950',
                    stageAccent[beat.stage],
                  )} />
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">{beat.title}</span>
                    {isActive && <Badge variant="primary" size="sm" className="text-[9px]">live</Badge>}
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{beat.subtitle}</p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
                    <span className="font-mono uppercase tracking-wider">{beat.cinematicLabel}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span>{beat.spotlight.replace(/_/g, ' ')}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
