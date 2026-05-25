/**
 * useForensicsStore
 * Zustand state for Phase 7 forensic reasoning outputs.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ThreatEvent } from '@/simulation/types';
import type { Investigation, MemoryEntry } from '@/agents/types';
import type { ForensicAnalysisResult, ForensicCluster, SuspectTimeline } from '../types';
import { ForensicReasoningEngine } from '../engine/ForensicReasoningEngine';

const engine = new ForensicReasoningEngine();

interface ForensicsState {
  analysis: ForensicAnalysisResult | null;
  selectedClusterId: string | null;
  selectedTimelineId: string | null;
  isAnalyzing: boolean;
  analyze: (events: ThreatEvent[], memories?: MemoryEntry[], investigations?: Investigation[]) => void;
  selectCluster: (clusterId: string | null) => void;
  selectTimeline: (timelineId: string | null) => void;
  reset: () => void;
}

export const useForensicsStore = create<ForensicsState>()(
  devtools(
    (set) => ({
      analysis: null,
      selectedClusterId: null,
      selectedTimelineId: null,
      isAnalyzing: false,

      analyze: (events, memories = [], investigations = []) => {
        set({ isAnalyzing: true });
        const analysis = engine.analyze(events, memories, investigations);
        set({
          analysis,
          selectedClusterId: analysis.clusters[0]?.id ?? null,
          selectedTimelineId: analysis.suspectTimelines[0]?.id ?? null,
          isAnalyzing: false,
        });
      },

      selectCluster: (clusterId) => set({ selectedClusterId: clusterId }),
      selectTimeline: (timelineId) => set({ selectedTimelineId: timelineId }),
      reset: () => set({ analysis: null, selectedClusterId: null, selectedTimelineId: null, isAnalyzing: false }),
    }),
    { name: 'ForensicsStore' },
  ),
);

export const selectActiveCluster = (analysis: ForensicAnalysisResult | null, clusterId: string | null): ForensicCluster | null => {
  if (!analysis || !clusterId) return null;
  return analysis.clusters.find((cluster) => cluster.id === clusterId) ?? null;
};

export const selectActiveTimeline = (analysis: ForensicAnalysisResult | null, timelineId: string | null): SuspectTimeline | null => {
  if (!analysis || !timelineId) return null;
  return analysis.suspectTimelines.find((timeline) => timeline.id === timelineId) ?? null;
};
