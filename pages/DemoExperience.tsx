/**
 * DemoExperience — Phase 8
 * Cinematic autonomous AI demo experience for judges and stakeholders.
 */

import { useEffect, useMemo, useRef } from 'react';
import { Film, Brain, Radar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/ui';
import { useSimulationStore } from '@/simulation';
import { useCascadeStore } from '@/cascade';
import { useAgentOrchestrationStore } from '@/agents';
import { useForensicsStore, selectActiveCluster } from '@/forensics';
import { buildCinematicSequence, useDemoStore } from '@/demo';
import { DemoHero, AttackSequenceRail, AutonomousNarrator, IntelligencePropagationScene, ReplayControlDeck } from '@/components/demo';
import { AIRoutingMonitor, CostOptimizationTracker, HindsightMemoryGraph, InvestigationConsole } from '@/components/nexus';
import { AIReasoningLogs } from '@/components/nexus/AIReasoningLogs';
import { AttackChainVisualizer } from '@/components/forensics';
import { fadeInUp, staggerContainer } from '@/utils/animations';

export function DemoExperience() {
  const { events, isLoaded, isGenerating, generateEvents } = useSimulationStore();
  const { decisions, activeDecision, analytics: cascadeAnalytics, processEvent, advanceStage, resetRuntime } = useCascadeStore();
  const { runtimes, completedTasks, memories, investigations, processTick, reset: resetAgents } = useAgentOrchestrationStore();
  const { analysis, analyze, selectedClusterId, reset: resetForensics } = useForensicsStore();
  const {
    sequence,
    currentBeatIndex,
    isAutoplay,
    playbackSpeedMs,
    isReplayMode,
    narrationMode,
    loadSequence,
    play,
    pause,
    nextBeat,
    previousBeat,
    jumpToBeat,
    setPlaybackSpeed,
    toggleReplayMode,
    setNarrationMode,
    resetDemo,
  } = useDemoStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const lastAppliedBeatRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded && !isGenerating) {
      void generateEvents();
    }
  }, [generateEvents, isGenerating, isLoaded]);

  // Initialize and reset the orchestration landscape when events arrive.
  useEffect(() => {
    if (events.length === 0) return;
    resetRuntime();
    resetAgents();
    resetForensics();
    resetDemo();
    loadSequence(buildCinematicSequence(events));
  }, [events.length, loadSequence, resetAgents, resetDemo, resetForensics, resetRuntime]);

  const currentBeat = sequence?.beats[currentBeatIndex] ?? null;

  // Apply beat effects once per beat.
  useEffect(() => {
    if (!currentBeat || lastAppliedBeatRef.current === currentBeat.id) return;
    lastAppliedBeatRef.current = currentBeat.id;

    const event = currentBeat.event;
    if (event) {
      processEvent(event);
      advanceStage();
    }

    const contextualEvents = sequence?.beats
      .slice(0, currentBeatIndex + 1)
      .map((beat) => beat.event)
      .filter((value): value is NonNullable<typeof value> => Boolean(value)) ?? [];

    if (contextualEvents.length > 0) {
      processTick(contextualEvents);
      analyze(contextualEvents, memories, investigations);
    }
  }, [analyze, advanceStage, currentBeat, currentBeatIndex, investigations, memories, processEvent, processTick, sequence]);

  // Autoplay loop.
  useEffect(() => {
    if (!sequence || !isAutoplay) return;
    timerRef.current = setInterval(() => {
      nextBeat();
    }, playbackSpeedMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sequence, isAutoplay, playbackSpeedMs, nextBeat]);

  const activeCluster = useMemo(() => selectActiveCluster(analysis, selectedClusterId), [analysis, selectedClusterId]);
  const totalAgents = runtimes.length;
  const activeAgents = runtimes.filter((runtime) => runtime.state !== 'idle').length;

  return (
    <div className="space-y-6">
      <DemoHero
        sequence={sequence}
        currentIndex={currentBeatIndex}
        total={sequence?.beats.length ?? 0}
        isAutoplay={isAutoplay}
      />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div variants={fadeInUp}>
          <StatCard label="Runtime Adaptation" value={`${cascadeAnalytics.averageConfidence}%`} icon={<Brain className="h-6 w-6 text-cyan-400" />} trend="up" change={10.4} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Memory Evolution" value={`${memories.length}`} icon={<Sparkles className="h-6 w-6 text-green-400" />} trend="up" change={12.8} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Agent Coordination" value={`${activeAgents}/${totalAgents}`} icon={<Film className="h-6 w-6 text-purple-400" />} trend="up" change={9.1} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <StatCard label="Forensic Confidence" value={`${analysis?.overallConfidence ?? 0}%`} icon={<Radar className="h-6 w-6 text-amber-400" />} trend="up" change={14.6} />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.74fr_1.26fr]">
        <div className="space-y-6">
          <AttackSequenceRail
            beats={sequence?.beats ?? []}
            currentBeatIndex={currentBeatIndex}
            onSelect={jumpToBeat}
          />
          <ReplayControlDeck
            sequence={sequence}
            currentBeatIndex={currentBeatIndex}
            isAutoplay={isAutoplay}
            playbackSpeedMs={playbackSpeedMs}
            isReplayMode={isReplayMode}
            narrationMode={narrationMode}
            onPlay={play}
            onPause={pause}
            onNext={nextBeat}
            onPrevious={previousBeat}
            onJump={jumpToBeat}
            onSpeedChange={setPlaybackSpeed}
            onToggleReplay={toggleReplayMode}
            onNarrationMode={setNarrationMode}
            onReset={() => {
              resetRuntime();
              resetAgents();
              resetForensics();
              resetDemo();
              lastAppliedBeatRef.current = null;
              if (events.length > 0) loadSequence(buildCinematicSequence(events));
            }}
          />
        </div>

        <div className="space-y-6">
          <AutonomousNarrator
            beat={currentBeat}
            cluster={activeCluster}
            analytics={cascadeAnalytics}
            mode={narrationMode}
          />
          <IntelligencePropagationScene beat={currentBeat} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.78fr_0.78fr_1.1fr]">
        <AIRoutingMonitor decisions={decisions} activeDecision={activeDecision} />
        <CostOptimizationTracker analytics={cascadeAnalytics} />
        <AttackChainVisualizer cluster={activeCluster} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_0.9fr_1.2fr]">
        <HindsightMemoryGraph memories={memories} />
        <InvestigationConsole investigations={investigations} />
        <AIReasoningLogs completedTasks={completedTasks} />
      </div>
    </div>
  );
}
