/**
 * Multi-Agent Orchestration Module
 * Phase 5 — Autonomous AI agent collaboration
 */

export type * from './types';
export { agentProfiles, getAgentByRole, getAgentById, agentColorMap } from './definitions';
export { OrchestrationEngine } from './engine/OrchestrationEngine';
export { useAgentOrchestrationStore } from './store/useAgentOrchestrationStore';
