/**
 * CascadeFlow Runtime Intelligence Types
 * Phase 3 domain contracts for adaptive AI inference orchestration.
 */

import type { EventType, ThreatLevel } from '@/simulation/types';

export type ModelTier = 'tier1' | 'tier2';

export type RuntimeTaskType =
  | 'ocr'
  | 'entity_extraction'
  | 'metadata_parsing'
  | 'transcription'
  | 'low_risk_classification'
  | 'anomaly_reasoning'
  | 'behavioral_analysis'
  | 'forensic_synthesis'
  | 'attack_correlation'
  | 'coordinated_threat_detection';

export type RoutingStage =
  | 'ingested'
  | 'routed'
  | 'inferencing'
  | 'escalating'
  | 'retrying'
  | 'failover'
  | 'completed';

export type DecisionReason =
  | 'low_risk_fast_path'
  | 'confidence_escalation'
  | 'anomaly_escalation'
  | 'correlation_escalation'
  | 'latency_optimized'
  | 'cost_optimized'
  | 'retry_recovery'
  | 'model_failover';

export interface ModelProfile {
  id: string;
  name: string;
  tier: ModelTier;
  capabilities: RuntimeTaskType[];
  baseLatencyMs: number;
  latencyJitterMs: number;
  costPer1KInputTokens: number;
  costPer1KOutputTokens: number;
  reliability: number;
  maxContextTokens: number;
  qualityScore: number;
}

export interface RuntimeSignal {
  id: string;
  taskType: RuntimeTaskType;
  eventType: EventType;
  threatLevel: ThreatLevel;
  anomalyScore: number;
  confidenceScore: number;
  evidenceCount: number;
  relatedEventCount: number;
  sourceLatencyBudgetMs: number;
  inputTokens: number;
  outputTokenEstimate: number;
  priority: number;
  timestamp: Date;
}

export interface RuntimePolicy {
  tier1ConfidenceThreshold: number;
  tier2ConfidenceThreshold: number;
  anomalyEscalationThreshold: number;
  correlationEscalationThreshold: number;
  criticalThreatForceEscalation: boolean;
  maxRetries: number;
  latencyBudgetMs: number;
  costGuardrailUsd: number;
  adaptiveTokenCompression: boolean;
}

export interface RoutingDecision {
  id: string;
  signalId: string;
  taskType: RuntimeTaskType;
  selectedModel: ModelProfile;
  initialTier: ModelTier;
  finalTier: ModelTier;
  stage: RoutingStage;
  reasons: DecisionReason[];
  confidenceBefore: number;
  confidenceAfter: number;
  escalationRequired: boolean;
  retryCount: number;
  failoverUsed: boolean;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  compressedTokens: number;
  estimatedCostUsd: number;
  baselineCostUsd: number;
  costSavedUsd: number;
  completedAt: Date;
}

export interface PipelineNodeState {
  stage: RoutingStage;
  label: string;
  active: boolean;
  completed: boolean;
  emphasis: 'neutral' | 'success' | 'warning' | 'danger' | 'cyan';
}

export interface RuntimeAnalytics {
  totalRequests: number;
  tier1Requests: number;
  tier2Requests: number;
  escalations: number;
  failovers: number;
  retries: number;
  totalTokens: number;
  compressedTokens: number;
  totalCostUsd: number;
  baselineCostUsd: number;
  costSavedUsd: number;
  averageLatencyMs: number;
  averageConfidence: number;
}