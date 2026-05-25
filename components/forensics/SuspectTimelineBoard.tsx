/**
 * SuspectTimelineBoard
 * Scrubbable timeline of suspect activity with explainable steps.
 */

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock3, UserSearch, Laptop } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { SuspectTimeline } from '@/forensics';

export function SuspectTimelineBoard({
  timelines,
  activeTimeline,
  onSelect,
}: {
  timelines: SuspectTimeline[];
  activeTimeline: SuspectTimeline | null;
  onSelect: (id: string) => void;
}) {
  const [scrubIndex, setScrubIndex] = useState(0);

  useEffect(() => {
    setScrubIndex(0);
  }, [activeTimeline?.id]);

  const currentStep = useMemo(() => {
    if (!activeTimeline) return null;
    return activeTimeline.timeline[scrubIndex] ?? activeTimeline.timeline[0] ?? null;
  }, [activeTimeline, scrubIndex]);

  return (
    <Card noPadding className="h-full">
      <div className="p-5">
        <CardHeader>
          <CardTitle><Clock3 className="h-5 w-5 text-amber-400" />Suspect Timelines</CardTitle>
          <Badge variant="warning" size="sm">{timelines.length} tracked</Badge>
        </CardHeader>
      </div>

      <div className="grid grid-cols-1 gap-4 px-5 pb-5 xl:grid-cols-[0.85fr_1.15fr]">
        {/* Suspect list */}
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {timelines.length === 0 ? (
            <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-8 text-center text-sm text-gray-500">
              Suspect timelines will appear when correlated subjects are detected.
            </div>
          ) : timelines.map((timeline) => {
            const isActive = activeTimeline?.id === timeline.id;
            return (
              <button
                key={timeline.id}
                onClick={() => onSelect(timeline.id)}
                className={cn(
                  'w-full rounded-xl border p-3 text-left transition-all',
                  isActive ? 'border-amber-500/35 bg-amber-500/10' : 'border-slate-700/40 bg-slate-950/40 hover:border-slate-600/60',
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  {timeline.subjectType === 'user' ? <UserSearch className="h-4 w-4 text-cyan-400" /> : <Laptop className="h-4 w-4 text-purple-400" />}
                  <span className="text-sm font-semibold text-white truncate">{timeline.subjectLabel}</span>
                </div>
                <p className="text-[11px] text-gray-500">{timeline.likelyIntent}</p>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-gray-500">{timeline.events.length} events</span>
                  <span className="font-mono text-amber-300">risk {timeline.riskScore}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active timeline */}
        <div className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-4 min-h-[320px]">
          {!activeTimeline ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">Select a suspect timeline to inspect progression.</div>
          ) : (
            <>
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="warning" size="sm">risk {activeTimeline.riskScore}</Badge>
                  <span className="text-sm font-semibold text-white">{activeTimeline.subjectLabel}</span>
                </div>
                <p className="text-[12px] text-gray-400">{activeTimeline.explanation}</p>
              </div>

              {/* Scrubber */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2">
                  <span>Timeline scrubber</span>
                  <span className="font-mono">{scrubIndex + 1}/{Math.max(activeTimeline.timeline.length, 1)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(activeTimeline.timeline.length - 1, 0)}
                  step={1}
                  value={scrubIndex}
                  onChange={(e) => setScrubIndex(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Current highlighted step */}
              {currentStep && (
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 mb-4"
                >
                  <p className="text-[10px] uppercase tracking-wider text-cyan-400 mb-1">Highlighted step</p>
                  <p className="text-sm font-semibold text-white">{currentStep.label}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{currentStep.explanation}</p>
                </motion.div>
              )}

              {/* Timeline rail */}
              <div className="space-y-2">
                {activeTimeline.timeline.map((item, idx) => {
                  const isPast = idx <= scrubIndex;
                  const isCurrent = idx === scrubIndex;
                  return (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="relative flex flex-col items-center pt-1">
                        <div className={cn('h-3 w-3 rounded-full border-2 border-slate-900', isCurrent ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]' : isPast ? 'bg-cyan-500' : 'bg-slate-700')} />
                        {idx < activeTimeline.timeline.length - 1 && <div className={cn('mt-1 w-px h-8', isPast ? 'bg-cyan-500/50' : 'bg-slate-800')} />}
                      </div>
                      <div className="pb-2">
                        <p className={cn('text-[12px] font-medium', isCurrent ? 'text-white' : isPast ? 'text-gray-300' : 'text-gray-500')}>{item.label}</p>
                        <p className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
