/**
 * Forensics Page — Phase 7
 * Advanced AI forensic reasoning and threat correlation workspace.
 */

import { useEffect, useMemo } from 'react';
import { FileSearch, Link2, Users, Radar, Sparkles } from 'lucide-react';
import { StatCard } from '@/components/ui';
import {
  ForensicSummaryBanner,
  CorrelationWorkbench,
  AttackChainVisualizer,
  SuspectTimelineBoard,
  ForensicNarrativePanel,
  FutureAttackPanel,
} from '@/components/forensics';
import { useSimulationStore } from '@/simulation';
import { useAgentOrchestrationStore } from '@/agents';
import { useForensicsStore, selectActiveCluster, selectActiveTimeline } from '@/forensics';
import { staggerContainer, fadeInUp } from '@/utils/animations';
import { motion } from 'framer-motion';

export function Forensics() {
  const { events, isLoaded, isGenerating, generateEvents } = useSimulationStore();
  const { memories, investigations } = useAgentOrchestrationStore();
  const { analysis, selectedClusterId, selectedTimelineId, analyze, selectCluster, selectTimeline } = useForensicsStore();

  useEffect(() => {
    if (!isLoaded && !isGenerating) {
      void generateEvents();
    }
  }, [isLoaded, isGenerating, generateEvents]);

  useEffect(() => {
    if (events.length > 0) {
      analyze(events, memories, investigations);
    }
  }, [events.length, memories.length, investigations.length, analyze]);

  const activeCluster = useMemo(() => selectActiveCluster(analysis, selectedClusterId), [analysis, selectedClusterId]);
  const activeTimeline = useMemo(() => selectActiveTimeline(analysis, selectedTimelineId), [analysis, selectedTimelineId]);

  return (
    <div className="space-y-6">
      <ForensicSummaryBanner analysis={analysis} cluster={activeCluster} />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div variants={fadeInUp}>
          <StatCard label="Correlated Clusters" value={analysis?.clusters.length ?? 0} icon={<Link2 className="h-6 w-6 text-cyan-400" />} trend="up" change={11.2} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Suspect Timelines" value={analysis?.suspectTimelines.length ?? 0} icon={<Users className="h-6 w-6 text-amber-400" />} trend="up" change={8.7} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Predicted Actions" value={analysis?.predictions.length ?? 0} icon={<Radar className="h-6 w-6 text-purple-400" />} trend="up" change={15.9} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Supporting Memories" value={analysis?.supportingMemories.length ?? 0} icon={<Sparkles className="h-6 w-6 text-green-400" />} trend="neutral" />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <CorrelationWorkbench
          clusters={analysis?.clusters ?? []}
          activeClusterId={selectedClusterId}
          onSelect={selectCluster}
        />
        <AttackChainVisualizer cluster={activeCluster} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SuspectTimelineBoard
          timelines={analysis?.suspectTimelines ?? []}
          activeTimeline={activeTimeline}
          onSelect={selectTimeline}
        />
        <FutureAttackPanel predictions={analysis?.predictions ?? []} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ForensicNarrativePanel cluster={activeCluster} />
        <SupportContextPanel
          memories={analysis?.supportingMemories.length ?? 0}
          investigations={analysis?.investigations.length ?? 0}
          generatedAt={analysis?.generatedAt ?? null}
        />
      </div>
    </div>
  );
}

function SupportContextPanel({
  memories,
  investigations,
  generatedAt,
}: {
  memories: number;
  investigations: number;
  generatedAt: Date | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2">
        <FileSearch className="h-5 w-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Explainability Context</h3>
      </div>
      <div className="space-y-3 text-sm">
        <div className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-4">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Reasoning basis</p>
          <p className="text-gray-300">Correlation confidence, temporal ordering, shared entities, anomaly score density, and contextual memory overlap.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-4">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Supporting memories</p>
            <p className="text-2xl font-bold text-white">{memories}</p>
          </div>
          <div className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-4">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Open investigations</p>
            <p className="text-2xl font-bold text-white">{investigations}</p>
          </div>
        </div>
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Last synthesis</p>
          <p className="text-cyan-300 font-mono">{generatedAt ? generatedAt.toLocaleString() : 'Pending analysis'}</p>
        </div>
      </div>
    </div>
  );
}
