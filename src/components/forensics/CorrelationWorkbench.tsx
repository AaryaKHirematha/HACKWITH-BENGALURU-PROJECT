/**
 * CorrelationWorkbench
 * Interactive cluster selector showing explainable relation summaries.
 */

import { motion } from 'framer-motion';
import { Link2, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { ForensicCluster } from '@/forensics';

const signatureLabel: Record<string, string> = {
  insider_assisted_intrusion: 'Insider-assisted intrusion',
  credential_compromise_chain: 'Credential compromise',
  ransomware_progression: 'Ransomware progression',
  insider_exfiltration: 'Insider exfiltration',
  coordinated_network_breach: 'Coordinated network breach',
  physical_digital_pivot: 'Physical → digital pivot',
  behavioral_cluster: 'Behavioral cluster',
};

export function CorrelationWorkbench({
  clusters,
  activeClusterId,
  onSelect,
}: {
  clusters: ForensicCluster[];
  activeClusterId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <Card noPadding className="h-full">
      <div className="p-5">
        <CardHeader>
          <CardTitle><Link2 className="h-5 w-5 text-cyan-400" />Threat Correlation Workbench</CardTitle>
          <Badge variant="primary" size="sm">{clusters.length} clusters</Badge>
        </CardHeader>
      </div>

      <div className="max-h-[540px] overflow-y-auto px-5 pb-5 space-y-2">
        {clusters.length === 0 ? (
          <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-8 text-center text-sm text-gray-500">
            No high-confidence correlated clusters identified yet.
          </div>
        ) : clusters.map((cluster, idx) => {
          const isActive = cluster.id === activeClusterId;
          return (
            <motion.button
              key={cluster.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.4) }}
              onClick={() => onSelect(cluster.id)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-all',
                isActive
                  ? 'border-cyan-500/40 bg-cyan-500/10 shadow-lg shadow-cyan-500/5'
                  : 'border-slate-700/40 bg-slate-950/40 hover:border-slate-600/60',
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge variant={cluster.coordinatedBehavior ? 'warning' : 'secondary'} size="sm" className="text-[10px]">
                  {signatureLabel[cluster.signature] ?? cluster.signature}
                </Badge>
                <span className="flex-1 text-sm font-semibold text-white truncate">{cluster.name}</span>
                <ChevronRight className={cn('h-4 w-4 text-gray-500 transition-transform', isActive && 'rotate-90')} />
              </div>
              <p className="text-[12px] text-gray-400 line-clamp-2">{cluster.conclusion}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                <MiniMetric label="confidence" value={`${cluster.confidenceScore}%`} color="text-cyan-300" />
                <MiniMetric label="linked events" value={`${cluster.events.length}`} color="text-purple-300" />
                <MiniMetric label="prediction" value={`${cluster.futureAttackProbability}%`} color="text-green-300" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
}

function MiniMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg bg-slate-900/60 border border-slate-800/60 px-2 py-2">
      <p className={cn('text-sm font-bold', color)}>{value}</p>
      <p className="text-[9px] uppercase tracking-wider text-gray-500">{label}</p>
    </div>
  );
}
