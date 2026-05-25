/**
 * CascadeFlow Runtime Engine
 * Adaptive routing, escalation, retry, failover, token analytics, and cost logic.
 */

import type { ThreatEvent } from '@/simulation/types';
import type {
  DecisionReason,
  ModelProfile,
  ModelTier,
  RoutingDecision,
  RuntimeAnalytics,
  RuntimePolicy,
  RuntimeSignal,
  RuntimeTaskType,
} from '../types';

const id = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const cascadeModels: ModelProfile[] = [
  {
    id: 't1-vision-extract',
    name: 'T1 Vision Extractor',
    tier: 'tier1',
    capabilities: ['ocr', 'entity_extraction', 'metadata_parsing', 'low_risk_classification'],
    baseLatencyMs: 180,
    latencyJitterMs: 120,
    costPer1KInputTokens: 0.0008,
    costPer1KOutputTokens: 0.0012,
    reliability: 0.992,
    maxContextTokens: 16000,
    qualityScore: 72,
  },
  {
    id: 't1-audio-parse',
    name: 'T1 Audio Parser',
    tier: 'tier1',
    capabilities: ['transcription', 'entity_extraction', 'metadata_parsing'],
    baseLatencyMs: 240,
    latencyJitterMs: 180,
    costPer1KInputTokens: 0.001,
    costPer1KOutputTokens: 0.0014,
    reliability: 0.987,
    maxContextTokens: 12000,
    qualityScore: 70,
  },
  {
    id: 't1-classifier-fast',
    name: 'T1 Fast Classifier',
    tier: 'tier1',
    capabilities: ['low_risk_classification', 'metadata_parsing', 'entity_extraction'],
    baseLatencyMs: 95,
    latencyJitterMs: 70,
    costPer1KInputTokens: 0.0005,
    costPer1KOutputTokens: 0.0008,
    reliability: 0.996,
    maxContextTokens: 8000,
    qualityScore: 68,
  },
  {
    id: 't2-frontier-reasoner',
    name: 'T2 Frontier Reasoner',
    tier: 'tier2',
    capabilities: ['anomaly_reasoning', 'behavioral_analysis', 'forensic_synthesis', 'attack_correlation'],
    baseLatencyMs: 1050,
    latencyJitterMs: 520,
    costPer1KInputTokens: 0.012,
    costPer1KOutputTokens: 0.036,
    reliability: 0.978,
    maxContextTokens: 128000,
    qualityScore: 95,
  },
  {
    id: 't2-forensic-synth',
    name: 'T2 Forensic Synthesizer',
    tier: 'tier2',
    capabilities: ['forensic_synthesis', 'coordinated_threat_detection', 'attack_correlation'],
    baseLatencyMs: 1320,
    latencyJitterMs: 680,
    costPer1KInputTokens: 0.016,
    costPer1KOutputTokens: 0.048,
    reliability: 0.969,
    maxContextTokens: 200000,
    qualityScore: 97,
  },
  {
    id: 't2-behavioral-graph',
    name: 'T2 Behavioral Graph Analyst',
    tier: 'tier2',
    capabilities: ['behavioral_analysis', 'coordinated_threat_detection', 'anomaly_reasoning'],
    baseLatencyMs: 920,
    latencyJitterMs: 430,
    costPer1KInputTokens: 0.01,
    costPer1KOutputTokens: 0.032,
    reliability: 0.982,
    maxContextTokens: 96000,
    qualityScore: 93,
  },
];

export const defaultRuntimePolicy: RuntimePolicy = {
  tier1ConfidenceThreshold: 74,
  tier2ConfidenceThreshold: 86,
  anomalyEscalationThreshold: 72,
  correlationEscalationThreshold: 3,
  criticalThreatForceEscalation: true,
  maxRetries: 2,
  latencyBudgetMs: 1300,
  costGuardrailUsd: 0.095,
  adaptiveTokenCompression: true,
};

export class CascadeRuntimeEngine {
  private readonly models: ModelProfile[];
  private readonly policy: RuntimePolicy;

  constructor(models: ModelProfile[] = cascadeModels, policy: RuntimePolicy = defaultRuntimePolicy) {
    this.models = models;
    this.policy = policy;
  }

  createSignalFromEvent(event: ThreatEvent): RuntimeSignal {
    const taskType = this.inferTaskType(event);
    const inputTokens = this.estimateInputTokens(event, taskType);

    return {
      id: id('sig'),
      taskType,
      eventType: event.eventType,
      threatLevel: event.threatLevel,
      anomalyScore: event.anomalyScore,
      confidenceScore: event.confidenceScore,
      evidenceCount: event.evidence.length,
      relatedEventCount: event.relatedEvents.length,
      sourceLatencyBudgetMs: event.threatLevel === 'critical' ? 900 : this.policy.latencyBudgetMs,
      inputTokens,
      outputTokenEstimate: Math.round(inputTokens * (taskType.includes('synthesis') ? 0.42 : 0.18)),
      priority: event.priority,
      timestamp: new Date(),
    };
  }

  route(signal: RuntimeSignal): RoutingDecision {
    const reasons: DecisionReason[] = [];
    const initialTier = this.selectInitialTier(signal, reasons);
    let selectedModel = this.selectModel(signal, initialTier);
    let finalTier = initialTier;
    let confidenceAfter = this.projectConfidence(signal, selectedModel);
    let escalationRequired = this.shouldEscalate(signal, confidenceAfter, reasons);

    if (escalationRequired && selectedModel.tier === 'tier1') {
      finalTier = 'tier2';
      selectedModel = this.selectModel(signal, 'tier2');
      confidenceAfter = this.projectConfidence(signal, selectedModel);
    }

    const optimizedTokens = this.optimizeTokens(signal, selectedModel);
    const retryCount = this.deriveRetryCount(selectedModel);
    const failoverUsed = this.shouldFailover(selectedModel, signal, retryCount);

    if (retryCount > 0) reasons.push('retry_recovery');
    if (failoverUsed) {
      reasons.push('model_failover');
      selectedModel = this.failoverModel(selectedModel, signal);
      confidenceAfter = Math.max(confidenceAfter - 2, signal.confidenceScore + 4);
    }

    const latencyMs = this.estimateLatency(selectedModel, signal, retryCount, optimizedTokens.compressionRatio);
    if (latencyMs <= signal.sourceLatencyBudgetMs) reasons.push('latency_optimized');

    const outputTokens = Math.max(120, Math.round(signal.outputTokenEstimate * selectedModel.qualityScore / 80));
    const estimatedCostUsd = this.calculateCost(selectedModel, optimizedTokens.tokens, outputTokens);
    const baselineModel = this.models.find((model) => model.id === 't2-forensic-synth') ?? selectedModel;
    const baselineCostUsd = this.calculateCost(baselineModel, signal.inputTokens, outputTokens + 360);
    const costSavedUsd = Math.max(0, baselineCostUsd - estimatedCostUsd);

    if (costSavedUsd > 0.01) reasons.push('cost_optimized');

    return {
      id: id('route'),
      signalId: signal.id,
      taskType: signal.taskType,
      selectedModel,
      initialTier,
      finalTier,
      stage: escalationRequired ? 'escalating' : 'completed',
      reasons: Array.from(new Set(reasons)),
      confidenceBefore: signal.confidenceScore,
      confidenceAfter: Math.min(99, Math.round(confidenceAfter)),
      escalationRequired,
      retryCount,
      failoverUsed,
      latencyMs,
      inputTokens: signal.inputTokens,
      outputTokens,
      compressedTokens: optimizedTokens.tokens,
      estimatedCostUsd,
      baselineCostUsd,
      costSavedUsd,
      completedAt: new Date(),
    };
  }

  buildAnalytics(decisions: RoutingDecision[]): RuntimeAnalytics {
    const totals = decisions.reduce(
      (acc, decision) => {
        acc.totalRequests += 1;
        acc.tier1Requests += decision.finalTier === 'tier1' ? 1 : 0;
        acc.tier2Requests += decision.finalTier === 'tier2' ? 1 : 0;
        acc.escalations += decision.escalationRequired ? 1 : 0;
        acc.failovers += decision.failoverUsed ? 1 : 0;
        acc.retries += decision.retryCount;
        acc.totalTokens += decision.inputTokens + decision.outputTokens;
        acc.compressedTokens += decision.inputTokens - decision.compressedTokens;
        acc.totalCostUsd += decision.estimatedCostUsd;
        acc.baselineCostUsd += decision.baselineCostUsd;
        acc.costSavedUsd += decision.costSavedUsd;
        acc.averageLatencyMs += decision.latencyMs;
        acc.averageConfidence += decision.confidenceAfter;
        return acc;
      },
      {
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
      },
    );

    if (totals.totalRequests === 0) return totals;

    return {
      ...totals,
      averageLatencyMs: Math.round(totals.averageLatencyMs / totals.totalRequests),
      averageConfidence: Math.round(totals.averageConfidence / totals.totalRequests),
    };
  }

  private inferTaskType(event: ThreatEvent): RuntimeTaskType {
    if (event.sourceType === 'camera' || event.sourceType === 'vehicle_system') return 'ocr';
    if (event.sourceType === 'badge_system') return 'metadata_parsing';
    if (event.threatLevel === 'info' || event.threatLevel === 'low') return 'low_risk_classification';
    if (event.relatedEvents.length >= this.policy.correlationEscalationThreshold) return 'attack_correlation';
    if (event.eventType === 'insider_threat' || event.eventType === 'anomalous_behavior') return 'behavioral_analysis';
    if (event.eventType === 'ransomware_indicator' || event.eventType === 'data_exfiltration') return 'forensic_synthesis';
    if (event.eventType === 'network_intrusion' || event.eventType === 'lateral_movement') return 'coordinated_threat_detection';
    return 'anomaly_reasoning';
  }

  private selectInitialTier(signal: RuntimeSignal, reasons: DecisionReason[]): ModelTier {
    const tier1Tasks: RuntimeTaskType[] = [
      'ocr',
      'entity_extraction',
      'metadata_parsing',
      'transcription',
      'low_risk_classification',
    ];

    if (tier1Tasks.includes(signal.taskType) && signal.anomalyScore < this.policy.anomalyEscalationThreshold) {
      reasons.push('low_risk_fast_path');
      return 'tier1';
    }

    return 'tier2';
  }

  private selectModel(signal: RuntimeSignal, tier: ModelTier): ModelProfile {
    const candidates = this.models.filter((model) => model.tier === tier && model.capabilities.includes(signal.taskType));
    const fallback = this.models.filter((model) => model.tier === tier);
    const pool = candidates.length > 0 ? candidates : fallback;

    return [...pool].sort((a, b) => {
      const aLatencyFit = Math.abs(signal.sourceLatencyBudgetMs - a.baseLatencyMs);
      const bLatencyFit = Math.abs(signal.sourceLatencyBudgetMs - b.baseLatencyMs);
      const aScore = a.qualityScore * 2 + a.reliability * 100 - aLatencyFit / 25;
      const bScore = b.qualityScore * 2 + b.reliability * 100 - bLatencyFit / 25;
      return bScore - aScore;
    })[0];
  }

  private shouldEscalate(signal: RuntimeSignal, projectedConfidence: number, reasons: DecisionReason[]): boolean {
    if (this.policy.criticalThreatForceEscalation && signal.threatLevel === 'critical') {
      reasons.push('anomaly_escalation');
      return true;
    }

    if (signal.anomalyScore >= this.policy.anomalyEscalationThreshold) {
      reasons.push('anomaly_escalation');
      return true;
    }

    if (signal.relatedEventCount >= this.policy.correlationEscalationThreshold) {
      reasons.push('correlation_escalation');
      return true;
    }

    if (projectedConfidence < this.policy.tier1ConfidenceThreshold) {
      reasons.push('confidence_escalation');
      return true;
    }

    return false;
  }

  private projectConfidence(signal: RuntimeSignal, model: ModelProfile): number {
    const anomalyLift = signal.anomalyScore >= this.policy.anomalyEscalationThreshold ? 8 : 2;
    const correlationLift = Math.min(8, signal.relatedEventCount * 2);
    const qualityLift = (model.qualityScore - 70) * 0.55;
    return signal.confidenceScore + anomalyLift + correlationLift + qualityLift;
  }

  private optimizeTokens(signal: RuntimeSignal, model: ModelProfile): { tokens: number; compressionRatio: number } {
    if (!this.policy.adaptiveTokenCompression) {
      return { tokens: signal.inputTokens, compressionRatio: 1 };
    }

    const compressionRatio = model.tier === 'tier1' ? 0.76 : signal.anomalyScore > 85 ? 0.88 : 0.69;
    const tokens = Math.max(600, Math.round(signal.inputTokens * compressionRatio));
    return { tokens, compressionRatio };
  }

  private deriveRetryCount(model: ModelProfile): number {
    const failureProbability = 1 - model.reliability;
    if (Math.random() < failureProbability * 3) return Math.min(this.policy.maxRetries, 1 + randomInt(0, 1));
    return 0;
  }

  private shouldFailover(model: ModelProfile, signal: RuntimeSignal, retryCount: number): boolean {
    return retryCount >= this.policy.maxRetries || (model.tier === 'tier2' && signal.anomalyScore > 92 && Math.random() < 0.08);
  }

  private failoverModel(currentModel: ModelProfile, signal: RuntimeSignal): ModelProfile {
    const candidates = this.models.filter(
      (model) => model.id !== currentModel.id && model.tier === currentModel.tier && model.capabilities.includes(signal.taskType),
    );
    return candidates[0] ?? currentModel;
  }

  private estimateInputTokens(event: ThreatEvent, taskType: RuntimeTaskType): number {
    const base = 900 + event.evidence.length * 420 + event.relatedEvents.length * 260;
    const taskMultiplier = taskType === 'forensic_synthesis' || taskType === 'coordinated_threat_detection' ? 2.8 : 1.25;
    const severityMultiplier = event.threatLevel === 'critical' ? 1.8 : event.threatLevel === 'high' ? 1.45 : 1;
    return Math.round(base * taskMultiplier * severityMultiplier + randomInt(0, 900));
  }

  private estimateLatency(model: ModelProfile, signal: RuntimeSignal, retryCount: number, compressionRatio: number): number {
    const complexity = 1 + signal.evidenceCount * 0.04 + signal.relatedEventCount * 0.08;
    const compressionGain = 1 - (1 - compressionRatio) * 0.45;
    return Math.round((model.baseLatencyMs + randomInt(0, model.latencyJitterMs)) * complexity * compressionGain + retryCount * 260);
  }

  private calculateCost(model: ModelProfile, inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1000) * model.costPer1KInputTokens;
    const outputCost = (outputTokens / 1000) * model.costPer1KOutputTokens;
    return Number((inputCost + outputCost).toFixed(5));
  }
}