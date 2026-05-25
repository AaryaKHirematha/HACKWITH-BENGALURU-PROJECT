/**
 * AIReasoningLogs
 * Terminal-style streaming log of AI reasoning from all autonomous agents.
 */

import { useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import { agentProfiles, agentColorMap } from '@/agents';
import type { AgentTask } from '@/agents/types';

interface AIReasoningLogsProps {
  completedTasks: AgentTask[];
}

export function AIReasoningLogs({ completedTasks }: AIReasoningLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const entries = useMemo(() => {
    return completedTasks
      .filter((t) => t.result?.reasoningChain && t.result.reasoningChain.length > 0)
      .slice(-20)
      .reverse()
      .flatMap((task) => {
        const agent = agentProfiles.find((a) => a.id === task.assignedAgentId);
        const ts = task.completedAt ? new Date(task.completedAt).toLocaleTimeString('en-US', { hour12: false }) : '--:--:--';
        return (task.result?.reasoningChain ?? []).map((step, i) => ({
          key: `${task.id}-${i}`,
          agent,
          step,
          ts,
          isLast: i === (task.result?.reasoningChain?.length ?? 1) - 1,
          confidence: task.result?.confidence ?? 0,
        }));
      });
  }, [completedTasks]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [entries.length]);

  return (
    <Card className="h-full flex flex-col" noPadding>
      <div className="p-5 pb-0">
        <CardHeader>
          <CardTitle><Terminal className="h-5 w-5 text-green-400" />AI Reasoning Logs</CardTitle>
          <Badge variant="success" size="sm">{entries.length} steps</Badge>
        </CardHeader>
      </div>

      {/* Terminal header bar */}
      <div className="mx-5 mt-2 flex items-center gap-2 rounded-t-lg bg-slate-950/80 border border-b-0 border-slate-700/40 px-4 py-2 text-[10px]">
        <Cpu className="h-3.5 w-3.5 text-cyan-400" />
        <span className="font-mono text-gray-400">aegis://reasoning/stream</span>
        <span className="ml-auto font-mono text-green-400">● connected</span>
      </div>

      <div
        ref={scrollRef}
        className="mx-5 mb-5 flex-1 overflow-y-auto rounded-b-lg bg-[#070a10] border border-t-0 border-slate-700/40 p-4 font-mono text-[11px] leading-relaxed"
        style={{ maxHeight: 380 }}
      >
        <AnimatePresence initial={false}>
          {entries.length === 0 ? (
            <p className="text-gray-700">// waiting for agent reasoning output...</p>
          ) : (
            entries.map((entry) => {
              const color = agentColorMap[entry.agent?.role ?? ''] ?? '#6b7280';
              return (
                <motion.div
                  key={entry.key}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn('mb-1', entry.isLast && 'mb-3 pb-2 border-b border-slate-800/60')}
                >
                  <span className="text-gray-600">{entry.ts}</span>
                  <span className="mx-2 text-gray-700">│</span>
                  <span style={{ color }} className="font-semibold">
                    {entry.agent?.codename ?? 'SYS'}
                  </span>
                  <span className="mx-2 text-gray-700">→</span>
                  <span className="text-gray-300">{entry.step}</span>
                  {entry.isLast && (
                    <span className="ml-2 text-green-400/70">[{entry.confidence.toFixed(0)}%]</span>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
