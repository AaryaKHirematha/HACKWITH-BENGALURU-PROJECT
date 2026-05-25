/**
 * Agent Definitions
 * Six specialized AI agent profiles for autonomous cybersecurity investigations
 */

import type { AgentProfile } from './types';

export const agentProfiles: AgentProfile[] = [
  // ============================================================
  // 1. THREAT DETECTION AGENT
  // ============================================================
  {
    id: 'agent-detection-001',
    role: 'threat_detection',
    name: 'Sentinel',
    codename: 'SENTINEL',
    description: 'First line of defense. Continuously scans incoming signals, classifies threats by severity, and seeds new investigations. Operates with low-latency tier-1 models for rapid triage.',
    capabilities: [
      'signal_classification',
      'severity_assessment',
      'pattern_recognition',
      'anomaly_detection',
      'ioc_extraction',
      'baseline_comparison',
    ],
    icon: '🛡️',
    color: 'cyan',
    accentColor: '#06b6d4',
    maxConcurrentTasks: 8,
    averageLatencyMs: 140,
    costPerTask: 0.0008,
    reliability: 0.994,
  },

  // ============================================================
  // 2. CORRELATION AGENT
  // ============================================================
  {
    id: 'agent-correlation-001',
    role: 'correlation',
    name: 'Nexus',
    codename: 'NEXUS',
    description: 'Cross-references events across time, geography, and entities to uncover hidden attack chains. Links disparate signals into coherent threat narratives using graph-based reasoning.',
    capabilities: [
      'cross_event_correlation',
      'attack_chain_mapping',
      'temporal_analysis',
      'entity_linking',
      'campaign_attribution',
      'graph_traversal',
    ],
    icon: '🔗',
    color: 'purple',
    accentColor: '#a855f7',
    maxConcurrentTasks: 4,
    averageLatencyMs: 380,
    costPerTask: 0.0045,
    reliability: 0.988,
  },

  // ============================================================
  // 3. REFLECTION AGENT
  // ============================================================
  {
    id: 'agent-reflection-001',
    role: 'reflection',
    name: 'Arbiter',
    codename: 'ARBITER',
    description: 'Meta-cognitive agent that reviews other agents\' conclusions, challenges assumptions, reduces false positives, and refines investigation quality through adversarial reasoning.',
    capabilities: [
      'hypothesis_challenge',
      'false_positive_detection',
      'assumption_audit',
      'confidence_calibration',
      'quality_review',
      'blind_spot_detection',
    ],
    icon: '🪞',
    color: 'amber',
    accentColor: '#f59e0b',
    maxConcurrentTasks: 3,
    averageLatencyMs: 520,
    costPerTask: 0.0062,
    reliability: 0.991,
  },

  // ============================================================
  // 4. INVESTIGATION AGENT
  // ============================================================
  {
    id: 'agent-investigation-001',
    role: 'investigation',
    name: 'Tracker',
    codename: 'TRACKER',
    description: 'Deep forensic analysis specialist. Performs detailed evidence examination, constructs timelines, and builds comprehensive case files for confirmed threats.',
    capabilities: [
      'forensic_analysis',
      'timeline_construction',
      'evidence_chain_of_custody',
      'deep_packet_inspection',
      'memory_forensics',
      'malware_reversing',
    ],
    icon: '🔬',
    color: 'green',
    accentColor: '#10b981',
    maxConcurrentTasks: 3,
    averageLatencyMs: 680,
    costPerTask: 0.0078,
    reliability: 0.986,
  },

  // ============================================================
  // 5. COST OPTIMIZATION AGENT
  // ============================================================
  {
    id: 'agent-cost-001',
    role: 'cost_optimization',
    name: 'Auditor',
    codename: 'AUDITOR',
    description: 'Monitors inference costs across all agents, optimizes model selection, compresses token usage, and ensures investigation quality stays high while expenditure stays low.',
    capabilities: [
      'cost_monitoring',
      'model_selection_optimization',
      'token_compression',
      'budget_allocation',
      'efficiency_analysis',
      'roi_assessment',
    ],
    icon: '💰',
    color: 'emerald',
    accentColor: '#34d399',
    maxConcurrentTasks: 2,
    averageLatencyMs: 95,
    costPerTask: 0.0003,
    reliability: 0.997,
  },

  // ============================================================
  // 6. NARRATIVE GENERATION AGENT
  // ============================================================
  {
    id: 'agent-narrative-001',
    role: 'narrative_generation',
    name: 'Chronicler',
    codename: 'CHRONICLER',
    description: 'Transforms raw findings into human-readable intelligence reports, executive summaries, and incident narratives. Maintains institutional knowledge and investigation memory.',
    capabilities: [
      'report_generation',
      'executive_summary',
      'incident_narrative',
      'knowledge_synthesis',
      'timeline_storytelling',
      'recommendation_drafting',
    ],
    icon: '📝',
    color: 'rose',
    accentColor: '#f43f5e',
    maxConcurrentTasks: 3,
    averageLatencyMs: 440,
    costPerTask: 0.0035,
    reliability: 0.993,
  },
];

// Lookup helpers
export const getAgentByRole = (role: string): AgentProfile | undefined =>
  agentProfiles.find((p) => p.role === role);

export const getAgentById = (id: string): AgentProfile | undefined =>
  agentProfiles.find((p) => p.id === id);

export const agentColorMap: Record<string, string> = Object.fromEntries(
  agentProfiles.map((a) => [a.role, a.accentColor]),
);
