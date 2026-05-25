/**
 * InvestigationConsole
 * Expandable investigation panels with phase progress,
 * key findings, and agent involvement visualization.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Shield, Users, FileText, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { Investigation } from '@/agents/types';

const phases = ['detection', 'collection', 'correlation', 'analysis', 'reflection', 'narrative', 'conclusion'];
const phaseColors: Record<string, string> = {
  detection: 'bg-cyan-500', collection: 'bg-blue-500', correlation: 'bg-purple-500',
  analysis: 'bg-green-500', reflection: 'bg-amber-500', narrative: 'bg-rose-500', conclusion: 'bg-emerald-500',
};

export function InvestigationConsole({ investigations }: { investigations: Investigation[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const active = investigations.filter((i) => i.status === 'active');
  const finished = investigations.filter((i) => i.status !== 'active');

  return (
    <Card glow="green" noPadding className="h-full">
      <div className="p-5">
        <CardHeader>
          <CardTitle><Search className="h-5 w-5 text-green-400" />Investigation Console</CardTitle>
          <div className="flex gap-2">
            <Badge variant="success" size="sm">{active.length} active</Badge>
            <Badge variant="default" size="sm">{finished.length} closed</Badge>
          </div>
        </CardHeader>
      </div>

      <div className="max-h-[480px] overflow-y-auto space-y-3 px-5 pb-5">
        {investigations.length === 0 ? (
          <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-8 text-center text-sm text-gray-500">
            Investigations will appear when critical threats are detected and escalated.
          </div>
        ) : (
          investigations.slice(0, 12).map((inv) => {
            const isOpen = expandedId === inv.id;
            const phaseIdx = phases.indexOf(inv.phase);

            return (
              <motion.div
                key={inv.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'rounded-xl border transition-all overflow-hidden',
                  inv.status === 'active' ? 'border-green-500/25 bg-green-500/5' : 'border-slate-700/30 bg-slate-900/40',
                )}
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : inv.id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <Shield className={cn('h-5 w-5', inv.status === 'active' ? 'text-green-400' : 'text-gray-500')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{inv.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{inv.involvedAgents.length} agents</span>
                      <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{inv.keyFindings.length} findings</span>
                    </div>
                  </div>
                  <Badge variant={inv.status === 'active' ? 'success' : inv.status === 'escalated' ? 'warning' : 'default'} size="sm">
                    {inv.progress.toFixed(0)}%
                  </Badge>
                  <ChevronRight className={cn('h-4 w-4 text-gray-500 transition-transform', isOpen && 'rotate-90')} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        {/* Phase progress */}
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Investigation Phase</p>
                          <div className="flex gap-1">
                            {phases.map((p, i) => (
                              <div key={p} className="flex-1 flex flex-col items-center gap-1">
                                <div className={cn(
                                  'h-2 w-full rounded-full',
                                  i < phaseIdx ? phaseColors[p] : i === phaseIdx ? `${phaseColors[p]} animate-pulse` : 'bg-slate-800',
                                )} />
                                <span className="text-[8px] text-gray-600">{p.slice(0, 4)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key findings */}
                        {inv.keyFindings.length > 0 && (
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Key Findings</p>
                            {inv.keyFindings.slice(0, 3).map((f, i) => (
                              <p key={i} className="text-[11px] text-gray-400 mb-1 pl-2 border-l border-cyan-500/30">
                                {f.length > 120 ? f.slice(0, 120) + '…' : f}
                              </p>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-1">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Started {new Date(inv.startedAt).toLocaleTimeString()}</span>
                          <span>Events: {inv.eventIds.length}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </Card>
  );
}
