/**
 * Multi-Agent Orchestration Types
 * Phase 5 — Autonomous AI agent collaboration contracts
 */

import type { ThreatEvent, ThreatLevel } from '@/simulation/types';

// ============================================================
// AGENT CORE TYPES
// ============================================================

export type AgentRole =
  | 'threat_detection'
  | 'correlation'
  | 'reflection'
  | 'investigation'
  | 'cost_optimization'
  | 'narrative_generation';

export type AgentState =
  | 'idle'
  | 'reasoning'
  | 'executing'
  | 'communicating'
  | 'waiting'
  | 'error';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export type TaskStatus = 'queued' | 'assigned' | 'running' | 'completed' | 'failed' | 'cancelled';

export type MemoryDecayType = 'linear' | 'exponential' | 'staircase';

export type MessageType =
  | 'task_request'
  | 'task_result'
  | 'memory_share'
  | 'insight_broadcast'
  | 'alert_escalation'
  | 'status_update'
  | 'reasoning_share';

// ============================================================
// AGENT DEFINITION
// ============================================================

export interface AgentProfile {
  id: string;
  role: AgentRole;
  name: string;
  codename: string;
  description: string;
  capabilities: string[];
  icon: string;
  color: string;
  accentColor: string;
  maxConcurrentTasks: number;
  averageLatencyMs: number;
  costPerTask: number;
  reliability: number;
}

export interface AgentRuntime {
  agentId: string;
  state: AgentState;
  currentTaskId: string | null;
  tasksCompleted: number;
  tasksFailed: number;
  averageLatencyMs: number;
  messagesSent: number;
  messagesReceived: number;
  insightsGenerated: number;
  memoryContributions: number;
  uptimeStarted: Date;
  lastActivity: Date;
}

// ============================================================
// TASK TYPES
// ============================================================

export interface AgentTask {
  id: string;
  type: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedAgentId: string | null;
  createdByAgentId: string;
  payload: TaskPayload;
  result: TaskResult | null;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  timeoutMs: number;
  retryCount: number;
  maxRetries: number;
  relatedEventIds: string[];
}

export interface TaskPayload {
  event?: ThreatEvent;
  context: Record<string, unknown>;
  reason: string;
  requiredCapabilities: string[];
  inputTokens: number;
}

export interface TaskResult {
  success: boolean;
  output: string;
  insights: AgentInsight[];
  generatedTasks: TaskRequest[];
  tokensUsed: number;
  confidence: number;
  reasoningChain: string[];
}

export interface TaskRequest {
  type: string;
  priority: TaskPriority;
  payload: TaskPayload;
  suggestedAgentRole: AgentRole;
}

// ============================================================
// MEMORY TYPES
// ============================================================

export interface MemoryEntry {
  id: string;
  agentId: string;
  agentRole: AgentRole;
  type: MemoryType;
  content: string;
  context: Record<string, unknown>;
  confidence: number;
  importance: number;
  decayType: MemoryDecayType;
  decayFactor: number;
  accessCount: number;
  lastAccessed: Date;
  createdAt: Date;
  expiresAt: Date | null;
  relatedMemoryIds: string[];
  tags: string[];
}

export type MemoryType =
  | 'pattern_observation'
  | 'correlation_finding'
  | 'anomaly_insight'
  | 'resolution_outcome'
  | 'threat_actor_profile'
  | 'ioc_fingerprint'
  | 'behavioral_baseline'
  | 'cost_optimization'
  | 'narrative_context';

// ============================================================
// INTER-AGENT MESSAGING
// ============================================================

export interface AgentMessage {
  id: string;
  type: MessageType;
  fromAgentId: string;
  toAgentId: string;
  payload: MessagePayload;
  timestamp: Date;
  delivered: boolean;
  acknowledged: boolean;
}

export interface MessagePayload {
  task?: AgentTask;
  result?: TaskResult;
  memory?: MemoryEntry;
  insight?: AgentInsight;
  status?: AgentState;
  reasoningChain?: string[];
}

// ============================================================
// AGENT INSIGHTS
// ============================================================

export interface AgentInsight {
  id: string;
  agentId: string;
  agentRole: AgentRole;
  type: InsightType;
  title: string;
  summary: string;
  confidence: number;
  severity: ThreatLevel;
  relatedEventIds: string[];
  supportingEvidence: string[];
  timestamp: Date;
}

export type InsightType =
  | 'threat_detected'
  | 'correlation_identified'
  | 'pattern_anomaly'
  | 'behavioral_deviation'
  | 'attack_chain_mapped'
  | 'ioc_enriched'
  | 'false_positive_assessed'
  | 'remediation_recommended'
  | 'cost_optimization_applied';

// ============================================================
// ORCHESTRATION TYPES
// ============================================================

export interface OrchestrationState {
  agents: AgentProfile[];
  runtimes: Record<string, AgentRuntime>;
  taskQueue: AgentTask[];
  completedTasks: AgentTask[];
  messages: AgentMessage[];
  memories: MemoryEntry[];
  insights: AgentInsight[];
  activeInvestigations: Investigation[];
  isRunning: boolean;
  tick: number;
}

export interface Investigation {
  id: string;
  name: string;
  eventIds: string[];
  involvedAgents: AgentRole[];
  phase: InvestigationPhase;
  progress: number;
  startedAt: Date;
  lastUpdated: Date;
  keyFindings: string[];
  status: 'active' | 'completed' | 'escalated';
}

export type InvestigationPhase =
  | 'detection'
  | 'collection'
  | 'correlation'
  | 'analysis'
  | 'reflection'
  | 'narrative'
  | 'conclusion';

// ============================================================
// GRAPH / VISUALIZATION TYPES
// ============================================================

export interface CommsGraphNode {
  id: string;
  label: string;
  role: AgentRole;
  state: AgentState;
  x: number;
  y: number;
}

export interface CommsGraphEdge {
  from: string;
  to: string;
  messageCount: number;
  lastMessageTime: Date;
  active: boolean;
}

export interface TimelineEntry {
  id: string;
  timestamp: Date;
  agentId: string;
  agentRole: AgentRole;
  eventType: 'task_start' | 'task_complete' | 'message_sent' | 'insight_generated' | 'memory_shared';
  description: string;
}
