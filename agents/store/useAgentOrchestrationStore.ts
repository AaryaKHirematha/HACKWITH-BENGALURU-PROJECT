/**
 * Agent Orchestration Store
 * Zustand state for the multi-agent AI collaboration system
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ThreatEvent } from '@/simulation/types';
import type {
  AgentMessage,
  AgentRuntime,
  AgentTask,
  Investigation,
  MemoryEntry,
  TimelineEntry,
} from '../types';
import { agentProfiles } from '../definitions';
import { OrchestrationEngine } from '../engine/OrchestrationEngine';

const engine = new OrchestrationEngine();

interface AgentOrchestrationState {
  // Data
  agents: typeof agentProfiles;
  runtimes: AgentRuntime[];
  taskQueue: AgentTask[];
  completedTasks: AgentTask[];
  messages: AgentMessage[];
  memories: MemoryEntry[];
  timeline: TimelineEntry[];
  investigations: Investigation[];

  // UI state
  isRunning: boolean;
  tick: number;
  selectedAgentId: string | null;
  selectedTaskId: string | null;

  // Actions
  processTick: (eventPool: ThreatEvent[]) => void;
  toggleRunning: () => void;
  selectAgent: (id: string | null) => void;
  selectTask: (id: string | null) => void;
  reset: () => void;
}

export const useAgentOrchestrationStore = create<AgentOrchestrationState>()(
  devtools(
    (set) => ({
      agents: agentProfiles,
      runtimes: engine.getRuntimes(),
      taskQueue: engine.getTaskQueue(),
      completedTasks: engine.getCompletedTasks(),
      messages: engine.getMessages(),
      memories: engine.getMemories(),
      timeline: engine.getTimeline(),
      investigations: engine.getInvestigations(),

      isRunning: true,
      tick: 0,
      selectedAgentId: null,
      selectedTaskId: null,

      processTick: (eventPool: ThreatEvent[]) => {
        const result = engine.tick(eventPool);

        set((state) => ({
          runtimes: engine.getRuntimes(),
          taskQueue: engine.getTaskQueue(),
          completedTasks: engine.getCompletedTasks(),
          messages: engine.getMessages(),
          memories: engine.getMemories(),
          timeline: engine.getTimeline(),
          investigations: engine.getInvestigations(),
          tick: state.tick + 1,
        }));

        return result;
      },

      toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),

      selectAgent: (id) => set({ selectedAgentId: id }),

      selectTask: (id) => set({ selectedTaskId: id }),

      reset: () => {
        set({
          taskQueue: [],
          completedTasks: [],
          messages: [],
          memories: [],
          timeline: [],
          investigations: [],
          tick: 0,
        });
      },
    }),
    { name: 'AgentOrchestrationStore' },
  ),
);
