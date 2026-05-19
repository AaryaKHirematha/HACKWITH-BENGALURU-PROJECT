/**
 * CommandCenter — Phase 6
 * World-class futuristic cybersecurity intelligence dashboard.
 *
 * Unifies every prior phase into a single cinematic view:
 *   • Phase 2 simulation events → Live Incident Feed, Heatmap, Timeline, Confidence
 *   • Phase 3 CascadeFlow     → AI Routing Monitor, Cost Optimization Tracker
 *   • Phase 5 Agents          → Reasoning Logs, Hindsight Memory Graph, Investigations
 */

import { useEffect, useRef } from 'react';
import { useSimulationStore } from '@/simulation';
import { useCascadeStore } from '@/cascade';
import { useAgentOrchestrationStore } from '@/agents';
import {
  HeroStatusBar,
  AnomalyHeatmap,
  ThreatTimeline,
  ConfidenceAnalytics,
  HindsightMemoryGraph,
  AIReasoningLogs,
  InvestigationConsole,
  CostOptimizationTracker,
  AIRoutingMonitor,
  LiveIncidentStrip,
} from '@/components/nexus';

export function CommandCenter() {
  // ── Store subscriptions ──
  const { events, isLoaded, isGenerating, generateEvents, getStatistics, addRandomEvent } = useSimulationStore();
  const { decisions, activeDecision, analytics: cascadeAnalytics, processEvent: cascadeProcess, advanceStage, isRunning: cascadeRunning } = useCascadeStore();
  const { runtimes, completedTasks, memories, investigations, isRunning: agentsRunning, processTick } = useAgentOrchestrationStore();
  const tickRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // ── Bootstrap simulation events ──
  useEffect(() => {
    if (!isLoaded && !isGenerating) void generateEvents();
  }, [isLoaded, isGenerating, generateEvents]);

  // ── Unified autonomous tick ──
  useEffect(() => {
    if (events.length === 0) return;

    tickRef.current = setInterval(() => {
      // Inject a new random event every few ticks
      if (Math.random() < 0.4) addRandomEvent();

      // Feed CascadeFlow
      if (cascadeRunning) {
        const ev = events[Math.floor(Math.random() * Math.min(events.length, 400))];
        if (ev) cascadeProcess(ev);
        advanceStage();
      }

      // Feed agent orchestration
      if (agentsRunning) {
        processTick(events);
      }
    }, 2800);

    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [events, cascadeRunning, agentsRunning, addRandomEvent, cascadeProcess, advanceStage, processTick]);

  // ── Derived stats ──
  const stats = isLoaded ? getStatistics() : null;
  const activeAgents = runtimes.filter((r) => r.state !== 'idle').length;

  return (
    <div className="space-y-5">
      {/* ── Hero Banner ── */}
      <HeroStatusBar
        totalEvents={stats?.totalEvents ?? 0}
        criticalCount={stats?.byThreatLevel.critical ?? 0}
        activeAgents={activeAgents}
        totalAgents={runtimes.length}
        avgConfidence={cascadeAnalytics.averageConfidence}
        isLive={cascadeRunning || agentsRunning}
      />

      {/* ── Row 1: Incidents + Routing + Cost ── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_0.65fr_0.65fr]">
        <LiveIncidentStrip events={events} />
        <AIRoutingMonitor decisions={decisions} activeDecision={activeDecision} />
        <CostOptimizationTracker analytics={cascadeAnalytics} />
      </div>

      {/* ── Row 2: Memory + Heatmap + Confidence ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <HindsightMemoryGraph memories={memories} />
        <AnomalyHeatmap events={events} />
        <ConfidenceAnalytics events={events} />
      </div>

      {/* ── Row 3: Timeline + Investigations ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ThreatTimeline events={events} />
        <InvestigationConsole investigations={investigations} />
      </div>

      {/* ── Row 4: Reasoning Logs (full width) ── */}
      <AIReasoningLogs completedTasks={completedTasks} />
    </div>
  );
}
