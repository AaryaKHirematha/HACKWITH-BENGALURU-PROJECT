/**
 * Investigation Tracker
 * Shows active investigations and their progression through phases
 */

import { motion } from 'framer-motion';
import { Search, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import { useAgentOrchestrationStore } from '@/agents';

const phaseLabels: Record<string, string> = {
  detection: 'Detection',
  collection: 'Collection',
  correlation: 'Correlation',
  analysis: 'Analysis',
  reflection: 'Reflection',
  narrative: 'Narrative',
  conclusion: 'Conclusion',
};

const phaseColors: Record<string, string> = {
  detection: 'bg-cyan-500',
  collection: 'bg-blue-500',
  correlation: 'bg-purple-500',
  analysis: 'bg-green-500',
  reflection: 'bg-amber-500',
  narrative: 'bg-rose-500',
  conclusion: 'bg-emerald-500',
};

const allPhases = ['detection', 'collection', 'correlation', 'analysis', 'reflection', 'narrative', 'conclusion'];

export function InvestigationTracker() {
  const { investigations } = useAgentOrchestrationStore();
  const active = investigations.filter((i) => i.status === 'active');
  const completed = investigations.filter((i) => i.status !== 'active').slice(-4);

  return (
    <Card glow="green" noPadding>
      <div className="p-5">
        <CardHeader>
          <CardTitle>
            <Search className="h-5 w-5 text-green-400" />
            Investigation Tracker
          </CardTitle>
          <Badge variant="success" size="sm">{active.length} active</Badge>
        </CardHeader>
      </div>

      <div className="space-y-4 px-5 pb-5">
        {active.length === 0 && completed.length === 0 ? (
          <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-8 text-center text-sm text-gray-500">
            Investigations will be launched when critical threats are detected.
          </div>
        ) : (
          <>
            {active.map((inv) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-green-500/30 bg-green-500/5 p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <ShieldAlert className="h-5 w-5 text-green-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{inv.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {inv.involvedAgents.length} agents • {inv.keyFindings.length} findings
                    </p>
                  </div>
                  <Badge variant="success" size="sm">{inv.progress.toFixed(0)}%</Badge>
                </div>

                {/* Phase progress bar */}
                <div className="flex items-center gap-1 mb-2">
                  {allPhases.map((phase, idx) => {
                    const isCurrent = inv.phase === phase;
                    const phaseIdx = allPhases.indexOf(inv.phase);
                    const isPast = idx < phaseIdx;

                    return (
                      <div key={phase} className="flex-1 flex items-center">
                        <div className={cn(
                          'h-2 w-full rounded-full transition-all',
                          isPast ? phaseColors[phase] : isCurrent ? `${phaseColors[phase]} animate-pulse` : 'bg-slate-700/50',
                        )} />
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>Phase: <span className="text-white font-medium">{phaseLabels[inv.phase]}</span></span>
                  <span>Events: {inv.eventIds.length}</span>
                </div>
              </motion.div>
            ))}

            {completed.length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2">Recent Investigations</p>
                {completed.map((inv) => (
                  <div key={inv.id} className="flex items-center gap-2 py-1.5 text-[12px]">
                    <div className={cn('h-2 w-2 rounded-full', inv.status === 'completed' ? 'bg-green-500' : 'bg-orange-500')} />
                    <span className="text-gray-400 truncate flex-1">{inv.name}</span>
                    <Badge variant={inv.status === 'completed' ? 'success' : 'warning'} size="sm" className="text-[9px]">
                      {inv.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
