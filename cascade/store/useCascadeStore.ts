/**
 * CascadeFlow Store
 * Runtime orchestration state for live adaptive AI routing decisions.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CascadeRuntimeEngine, defaultRuntimePolicy } from '../engine/CascadeRuntimeEngine';
import type { ThreatEvent } from '@/simulation/types';
import type { RoutingDecision, RuntimeAnalytics, RuntimePolicy, RuntimeSignal, RoutingStage } from '../types';

interface CascadeState {
  policy: RuntimePolicy;
  signals: RuntimeSignal[];
  decisions: RoutingDecision[];
  activeDecision: RoutingDecision | null;
  activeStage: RoutingStage;
  isRunning: boolean;
  analytics: RuntimeAnalytics;
  updatePolicy: (policy: Partial<RuntimePolicy>) => void;
  processEvent: (event: ThreatEvent) => RoutingDecision;
  processBatch: (events: ThreatEvent[], limit?: number) => void;
  setActiveDecision: (decision: RoutingDecision | null) => void;
  advanceStage: () => void;
  toggleRuntime: () => void;
  resetRuntime: () => void;
}

const emptyAnalytics: RuntimeAnalytics = {
  totalRequests: 0,
  tier1Requests: 0,
  tier2Requests: 0,
  escalations: 0,
  failovers: 0,
  retries: 0,
  totalTokens: 0,
  compressedTokens: 0,
  totalCostUsd: 0,
  baselineCostUsd: 0,
  costSavedUsd: 0,
  averageLatencyMs: 0,
  averageConfidence: 0,
};

const stages: RoutingStage[] = ['ingested', 'routed', 'inferencing', 'escalating', 'retrying', 'failover', 'completed'];

const createEngine = (policy: RuntimePolicy): CascadeRuntimeEngine => new CascadeRuntimeEngine(undefined, policy);

export const useCascadeStore = create<CascadeState>()(
  devtools(
    (set, get) => ({
      policy: defaultRuntimePolicy,
      signals: [],
      decisions: [],
      activeDecision: null,
      activeStage: 'ingested',
      isRunning: true,
      analytics: emptyAnalytics,

      updatePolicy: (policyUpdate) => {
        set((state) => ({ policy: { ...state.policy, ...policyUpdate } }));
      },

      processEvent: (event) => {
        const { policy } = get();
        const engine = createEngine(policy);
        const signal = engine.createSignalFromEvent(event);
        const decision = engine.route(signal);

        set((state) => {
          const decisions = [decision, ...state.decisions].slice(0, 120);
          const signals = [signal, ...state.signals].slice(0, 120);
          return {
            signals,
            decisions,
            activeDecision: decision,
            activeStage: decision.escalationRequired ? 'escalating' : 'inferencing',
            analytics: engine.buildAnalytics(decisions),
          };
        });

        return decision;
      },

      processBatch: (events, limit = 24) => {
        const { policy } = get();
        const engine = createEngine(policy);
        const selectedEvents = events.slice(0, limit);
        const signals = selectedEvents.map((event) => engine.createSignalFromEvent(event));
        const decisions = signals.map((signal) => engine.route(signal));

        set((state) => {
          const nextDecisions = [...decisions, ...state.decisions].slice(0, 120);
          const nextSignals = [...signals, ...state.signals].slice(0, 120);
          return {
            signals: nextSignals,
            decisions: nextDecisions,
            activeDecision: decisions[0] ?? state.activeDecision,
            activeStage: decisions[0]?.escalationRequired ? 'escalating' : 'inferencing',
            analytics: engine.buildAnalytics(nextDecisions),
          };
        });
      },

      setActiveDecision: (decision) => {
        set({ activeDecision: decision, activeStage: decision?.stage ?? 'ingested' });
      },

      advanceStage: () => {
        set((state) => {
          const currentIndex = stages.indexOf(state.activeStage);
          const nextStage = stages[(currentIndex + 1) % stages.length];
          return { activeStage: nextStage };
        });
      },

      toggleRuntime: () => {
        set((state) => ({ isRunning: !state.isRunning }));
      },

      resetRuntime: () => {
        set({
          signals: [],
          decisions: [],
          activeDecision: null,
          activeStage: 'ingested',
          analytics: emptyAnalytics,
        });
      },
    }),
    { name: 'CascadeStore' },
  ),
);