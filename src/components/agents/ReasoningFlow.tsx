/**
 * Reasoning Flow Animation
 * Visualizes agent reasoning chains as they process tasks
 */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { agentProfiles, agentColorMap } from '@/agents';
import { useAgentOrchestrationStore } from '@/agents/store/useAgentOrchestrationStore';

export function ReasoningFlow() {
  const { completedTasks } = useAgentOrchestrationStore();

  // Show the last 6 completed tasks with reasoning chains
  const recentReasoning = useMemo(() => {
    return completedTasks
      .filter((t) => t.result?.reasoningChain && t.result.reasoningChain.length > 0)
      .slice(-6)
      .reverse();
  }, [completedTasks]);

  return (
    <Card className="h-full" noPadding>
      <div className="p-5">
        <CardHeader>
          <CardTitle>
            <Brain className="h-5 w-5 text-purple-400" />
            Agent Reasoning Flow
          </CardTitle>
          <Badge variant="secondary" size="sm">
            {recentReasoning.length} reasoning chains
          </Badge>
        </CardHeader>
      </div>

      <div className="space-y-4 px-5 pb-5" style={{ maxHeight: '480px', overflowY: 'auto' }}>
        <AnimatePresence initial={false}>
          {recentReasoning.length === 0 ? (
            <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-8 text-center text-sm text-gray-500">
              Reasoning chains will appear as agents complete tasks.
            </div>
          ) : (
            recentReasoning.map((task, idx) => {
              const agent = agentProfiles.find((a) => a.id === task.assignedAgentId);
              if (!agent) return null;
              const color = agentColorMap[agent.role] ?? '#6b7280';

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.35 }}
                  className="rounded-xl border border-slate-700/40 bg-slate-950/50 p-4"
                >
                  {/* Agent header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg">{agent.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{agent.name}</span>
                        <Badge variant="secondary" size="sm" className="text-[10px]">
                          {task.type.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-gray-500">{agent.codename} • {agent.role.replace(/_/g, ' ')}</p>
                    </div>
                    {task.result && (
                      <Badge variant={task.result.success ? 'success' : 'danger'} size="sm">
                        {task.result.confidence.toFixed(0)}%
                      </Badge>
                    )}
                  </div>

                  {/* Reasoning chain steps */}
                  <div className="space-y-2 pl-2">
                    {task.result?.reasoningChain.map((step, stepIdx) => (
                      <motion.div
                        key={stepIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 + stepIdx * 0.06, duration: 0.3 }}
                        className="flex items-start gap-2"
                      >
                        <div className="mt-1 flex items-center gap-1">
                          {stepIdx < (task.result?.reasoningChain?.length ?? 0) - 1 ? (
                            <ChevronRight className="h-3 w-3" style={{ color }} />
                          ) : (
                            <ArrowRight className="h-3 w-3" style={{ color }} />
                          )}
                        </div>
                        <p className="text-[12px] text-gray-300 leading-relaxed">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
