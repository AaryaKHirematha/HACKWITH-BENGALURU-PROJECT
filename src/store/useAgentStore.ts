/**
 * Agent Store
 * Multi-agent AI coordination state management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AgentState } from './types';
import type { AIAgent } from '@/types';

// Default AI agents for the system
const defaultAgents: AIAgent[] = [
  {
    id: 'agent-analyzer-001',
    name: 'Sentinel',
    type: 'analyzer',
    status: 'active',
    capabilities: ['malware_analysis', 'log_analysis', 'ioc_enrichment'],
    performance: {
      tasksCompleted: 1247,
      successRate: 98.7,
      averageResponseTime: 2.3,
      accuracy: 97.2,
    },
    memory: [],
    lastActive: new Date(),
  },
  {
    id: 'agent-hunter-001',
    name: 'Pathfinder',
    type: 'hunter',
    status: 'active',
    capabilities: ['threat_hunting', 'network_forensics'],
    performance: {
      tasksCompleted: 856,
      successRate: 95.4,
      averageResponseTime: 5.1,
      accuracy: 94.8,
    },
    memory: [],
    lastActive: new Date(),
  },
  {
    id: 'agent-responder-001',
    name: 'Guardian',
    type: 'responder',
    status: 'active',
    capabilities: ['incident_response', 'report_generation'],
    performance: {
      tasksCompleted: 634,
      successRate: 99.1,
      averageResponseTime: 1.8,
      accuracy: 99.5,
    },
    memory: [],
    lastActive: new Date(),
  },
  {
    id: 'agent-collector-001',
    name: 'Watcher',
    type: 'collector',
    status: 'active',
    capabilities: ['user_behavior_analysis', 'ioc_enrichment'],
    performance: {
      tasksCompleted: 3421,
      successRate: 99.8,
      averageResponseTime: 0.5,
      accuracy: 99.2,
    },
    memory: [],
    lastActive: new Date(),
  },
  {
    id: 'agent-correlator-001',
    name: 'Nexus',
    type: 'correlator',
    status: 'processing',
    capabilities: ['threat_hunting', 'log_analysis', 'ioc_enrichment'],
    currentTask: 'Analyzing attack pattern correlation',
    performance: {
      tasksCompleted: 523,
      successRate: 97.6,
      averageResponseTime: 8.2,
      accuracy: 96.4,
    },
    memory: [],
    lastActive: new Date(),
  },
];

export const useAgentStore = create<AgentState>()(
  devtools(
    (set) => ({
      agents: defaultAgents,
      selectedAgentId: null,

      setAgents: (agents: AIAgent[]) => 
        set({ agents }),

      updateAgent: (id: string, updates: Partial<AIAgent>) => 
        set((state) => ({
          agents: state.agents.map((a) => 
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      selectAgent: (id: string | null) => 
        set({ selectedAgentId: id }),
    }),
    { name: 'AgentStore' }
  )
);

// Selectors
export const selectActiveAgents = (state: AgentState) => 
  state.agents.filter((a) => a.status !== 'offline');

export const selectAgentById = (id: string) => (state: AgentState) =>
  state.agents.find((a) => a.id === id);
