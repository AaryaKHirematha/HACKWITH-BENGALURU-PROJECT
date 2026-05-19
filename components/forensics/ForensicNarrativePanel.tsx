/**
 * ForensicNarrativePanel
 * Explainable narrative, behavioral explanation, and actions for the selected cluster.
 */

import { FileText, Lightbulb, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import type { ForensicCluster } from '@/forensics';

export function ForensicNarrativePanel({ cluster }: { cluster: ForensicCluster | null }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle><FileText className="h-5 w-5 text-rose-400" />Forensic Narrative</CardTitle>
        <Badge variant={cluster?.coordinatedBehavior ? 'warning' : 'secondary'} size="sm">
          {cluster?.coordinatedBehavior ? 'coordinated behavior' : 'context synthesis'}
        </Badge>
      </CardHeader>

      {!cluster ? (
        <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-8 text-center text-sm text-gray-500">
          Select a forensic cluster to generate a full narrative.
        </div>
      ) : (
        <div className="space-y-4">
          <Section icon={<FileText className="h-4 w-4 text-rose-400" />} title="Investigation Summary" body={cluster.investigationSummary} />
          <Section icon={<Lightbulb className="h-4 w-4 text-amber-400" />} title="Behavioral Explanation" body={cluster.behavioralExplanation} />
          <Section icon={<ShieldCheck className="h-4 w-4 text-cyan-400" />} title="Forensic Narrative" body={cluster.forensicNarrative} />

          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 text-green-400" />Recommended actions
            </p>
            <div className="space-y-2">
              {cluster.recommendedActions.map((action) => (
                <div key={action.id} className="rounded-lg border border-slate-700/40 bg-slate-950/40 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={action.priority === 'immediate' ? 'danger' : action.priority === 'high' ? 'warning' : action.priority === 'medium' ? 'secondary' : 'default'} size="sm">
                      {action.priority}
                    </Badge>
                    <span className="text-sm font-semibold text-white">{action.title}</span>
                  </div>
                  <p className="text-[12px] text-gray-400">{action.description}</p>
                  <p className="mt-1 text-[10px] text-gray-600">owner: {action.owner.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function Section({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-4">
      <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500">{icon}{title}</p>
      <p className="text-[12px] leading-relaxed text-gray-300">{body}</p>
    </div>
  );
}
