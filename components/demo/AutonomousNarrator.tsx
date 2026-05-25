/**
 * AutonomousNarrator
 * Typewriter-style adaptive narration driven by the current demo beat
 * and live platform analytics.
 */

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic2, Sparkles, TerminalSquare } from 'lucide-react';
import { Badge, Card, CardHeader, CardTitle } from '@/components/ui';
import type { DemoBeat } from '@/demo';
import type { RuntimeAnalytics } from '@/cascade';
import type { ForensicCluster } from '@/forensics';

function composeNarration(beat: DemoBeat | null, cluster: ForensicCluster | null, analytics: RuntimeAnalytics): string {
  if (!beat) return 'Preparing cinematic replay environment.';

  const clusterLine = cluster
    ? ` Forensic reasoning now assigns ${cluster.confidenceScore}% confidence to the conclusion: ${cluster.conclusion}`
    : '';

  return [
    `Narrator: ${beat.narrativeSeed}`,
    `System reaction: ${beat.systemReaction}`,
    `CascadeFlow latency currently averages ${analytics.averageLatencyMs} milliseconds while preserving ${analytics.averageConfidence}% confidence across routed decisions.`,
    clusterLine,
  ].join(' ');
}

export function AutonomousNarrator({
  beat,
  cluster,
  analytics,
  mode,
}: {
  beat: DemoBeat | null;
  cluster: ForensicCluster | null;
  analytics: RuntimeAnalytics;
  mode: 'guided' | 'autonomous';
}) {
  const text = useMemo(() => composeNarration(beat, cluster, analytics), [beat, cluster, analytics]);
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    setVisibleLength(0);
    const interval = setInterval(() => {
      setVisibleLength((value) => {
        if (value >= text.length) {
          clearInterval(interval);
          return value;
        }
        return value + 2;
      });
    }, 18);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <Card noPadding className="h-full">
      <div className="p-5 pb-0">
        <CardHeader>
          <CardTitle><Mic2 className="h-5 w-5 text-fuchsia-400" />Autonomous Narration</CardTitle>
          <div className="flex gap-2">
            <Badge variant="neon" size="sm">{mode}</Badge>
            <Badge variant="secondary" size="sm">AI-generated</Badge>
          </div>
        </CardHeader>
      </div>

      <div className="mx-5 mt-2 rounded-t-lg border border-b-0 border-slate-700/40 bg-slate-950/80 px-4 py-2 text-[10px]">
        <div className="flex items-center gap-2 text-gray-400 font-mono">
          <TerminalSquare className="h-3.5 w-3.5 text-cyan-400" />
          aegis://narrator/channel
          <span className="ml-auto text-green-400">● speaking</span>
        </div>
      </div>
      <div className="mx-5 mb-5 flex-1 rounded-b-lg border border-t-0 border-slate-700/40 bg-[#070a10] p-4">
        <motion.div
          key={beat?.id ?? 'idle'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm leading-relaxed text-gray-300"
        >
          {text.slice(0, visibleLength)}
          <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-cyan-400/60 align-middle" />
        </motion.div>
        <div className="mt-4 flex items-center gap-2 text-[10px] text-fuchsia-300">
          <Sparkles className="h-3.5 w-3.5" />
          Guided storytelling remains synchronized with attack-sequence replay.
        </div>
      </div>
    </Card>
  );
}
