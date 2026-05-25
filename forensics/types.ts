/**
 * Forensic Reasoning Types
 * Phase 7 — Advanced AI forensic reasoning and threat correlation engine.
 */

import type { ThreatEvent, ThreatLevel } from '@/simulation/types';
import type { MemoryEntry, Investigation } from '@/agents/types';

export type ForensicPatternSignature =
  | 'insider_assisted_intrusion'
  | 'credential_compromise_chain'
  | 'ransomware_progression'
  | 'insider_exfiltration'
  | 'coordinated_network_breach'
  | 'physical_digital_pivot'
  | 'behavioral_cluster';

export interface CorrelationLink {
  id: string;
  fromEventId: string;
  toEventId: string;
  score: number;
  reasons: string[];
}

export interface RecommendedAction {
  id: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  owner: 'soc' | 'ir' | 'physical_security' | 'identity' | 'leadership';
}

export interface ThreatTimelineEntry {
  id: string;
  eventId: string;
  timestamp: Date;
  label: string;
  eventType: string;
  severity: ThreatLevel;
  explanation: string;
}

export interface ForensicCluster {
  id: string;
  signature: ForensicPatternSignature;
  name: string;
  conclusion: string;
  investigationSummary: string;
  forensicNarrative: string;
  behavioralExplanation: string;
  coordinatedBehavior: boolean;
  confidenceScore: number;
  futureAttackProbability: number;
  suspectEntities: string[];
  events: ThreatEvent[];
  links: CorrelationLink[];
  timeline: ThreatTimelineEntry[];
  recommendedActions: RecommendedAction[];
  attackChainStages: string[];
}

export interface SuspectTimeline {
  id: string;
  subjectType: 'user' | 'device';
  subjectId: string;
  subjectLabel: string;
  riskScore: number;
  explanation: string;
  events: ThreatEvent[];
  timeline: ThreatTimelineEntry[];
  likelyIntent: string;
}

export interface FutureAttackPrediction {
  id: string;
  clusterId: string;
  title: string;
  probability: number;
  nextLikelyStep: string;
  rationale: string;
  estimatedWindow: string;
}

export interface ForensicNarrativeRecord {
  id: string;
  clusterId: string;
  headline: string;
  executiveSummary: string;
  detailedNarrative: string;
  recommendedActions: RecommendedAction[];
}

export interface ForensicAnalysisResult {
  generatedAt: Date;
  overallConfidence: number;
  topConclusion: string;
  clusters: ForensicCluster[];
  suspectTimelines: SuspectTimeline[];
  predictions: FutureAttackPrediction[];
  narratives: ForensicNarrativeRecord[];
  supportingMemories: MemoryEntry[];
  investigations: Investigation[];
}
