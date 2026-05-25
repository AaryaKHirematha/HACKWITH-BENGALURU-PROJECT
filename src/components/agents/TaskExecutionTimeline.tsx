/**
 * Task Execution Timeline
 * Chronological feed of all agent task lifecycle events
 */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MessageCircle, Sparkles, Target, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import { agentProfiles } from '@/agents';
import { useAgentOrchestrationStore } from '@/agents/store/useAgentOrchestrationStore';
import type { TimelineEntry } from '@/agents/types';

const eventIcons: Record<TimelineEntry['eventType'], React.ElementType> = {
  task_start: Target,
  task_complete: CheckCircle2,
  message_sent: MessageCircle,
  insight_generated: Sparkles,
  memory_shared: Sparkles,
};

const eventColors: Record<TimelineEntry['eventType'], string> = {
  task_start: 'text-cyan-400',
  task_complete: 'text-green-400',
  message_sent: 'text-purple-400',
  insight_generated: 'text-amber-400',
  memory_shared: 'text-emerald-400',
};

export function TaskExecutionTimeline() {
  const { timeline } = useAgentOrchestrationStore();

  const enrichedEntries = useMemo(() => {
    return timeline.slice(0, 40).map((entry) => {
      const agent = agentProfiles.find((a) => a.id === entry.agentId);
      return { ...entry, agent };
    });
  }, [timeline]);

  // Stats
  const taskStarts = timeline.filter((t) => t.eventType === 'task_start').length;
  const taskCompletes = timeline.filter((t) => t.eventType === 'task_complete').length;
  const msgSends = timeline.filter((t) => t.eventType === 'message_sent').length;

  return (
    <Card className="h-full" noPadding>
      <div className="p-5">
        <CardHeader>
          <CardTitle>
            <Clock className="h-5 w-5 text-green-400" />
            Task Execution Timeline
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">{taskStarts} started</Badge>
            <Badge variant="success" size="sm">{taskCompletes} done</Badge>
            <Badge variant="secondary" size="sm">{msgSends} msgs</Badge>
          </div>
        </CardHeader>
      </div>

      <div className="max-h-[560px] overflow-y-auto px-5 pb-5">
        <AnimatePresence initial={false}>
          {enrichedEntries.length === 0 ? (
            <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-8 text-center text-sm text-gray-500">
              Timeline events will populate as agents process tasks.
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-purple-500/30 to-transparent" />

              <div className="space-y-1">
                {enrichedEntries.map((entry, idx) => {
                  const Icon = eventIcons[entry.eventType] ?? Target;
                  const agent = entry.agent;
                  const ts = entry.timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(idx * 0.02, 0.5), duration: 0.25 }}
                      className="relative flex items-start gap-3 pl-1 py-2"
                    >
                      {/* Dot on the timeline */}
                      <div className="relative z-10 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 border border-slate-700/60">
                        <Icon className={cn('h-3 w-3', eventColors[entry.eventType])} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium text-white">
                            {agent ? (
                              <>
                                <span className="mr-1">{agent.icon}</span>
                                {agent.name}
                              </>
                            ) : (
                              <span className="text-gray-400">System</span>
                            )}
                          </span>
                          <Badge variant="secondary" size="sm" className="text-[9px]">
                            {entry.eventType.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <p className="text-[12px] text-gray-400 truncate">{entry.description}</p>
                      </div>

                      {/* Timestamp */}
                      <span className="flex-shrink-0 text-[10px] font-mono text-gray-600 mt-0.5">
                        {ts}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
