/**
 * Autonomous Threat Intelligence & Forensics Copilot
 * Core Type Definitions - Phase 1 Foundation
 * 
 * This module exports all type definitions for the AEGIS platform
 * following strict TypeScript typing practices for enterprise scalability.
 */

// ============================================================
// CORE DOMAIN TYPES
// ============================================================

/** Threat severity levels following CVSS-like classification */
export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

/** Threat status lifecycle states */
export type ThreatStatus = 
  | 'detected'
  | 'analyzing'
  | 'confirmed'
  | 'mitigating'
  | 'mitigated'
  | 'false_positive'
  | 'escalated';

/** Agent operational states for multi-agent coordination */
export type AgentStatus = 'idle' | 'active' | 'processing' | 'error' | 'offline';

/** Intelligence feed types */
export type IntelligenceFeedType = 
  | 'osint'
  | 'commercial'
  | 'government'
  | 'internal'
  | 'darkweb'
  | 'honeypot';

/** System notification urgency levels */
export type NotificationUrgency = 'critical' | 'high' | 'normal' | 'low';

// ============================================================
// THREAT INTELLIGENCE TYPES
// ============================================================

/** Core threat intelligence indicator */
export interface ThreatIndicator {
  readonly id: string;
  type: IndicatorType;
  value: string;
  confidence: number;
  firstSeen: Date;
  lastSeen: Date;
  tags: string[];
  source: string;
  geo?: GeolocationData;
  relatedIndicators: string[];
}

/** Supported indicator types for threat detection */
export type IndicatorType = 
  | 'ip_address'
  | 'domain'
  | 'url'
  | 'file_hash_md5'
  | 'file_hash_sha1'
  | 'file_hash_sha256'
  | 'email'
  | 'mutex'
  | 'registry_key'
  | 'user_agent';

/** Geolocation data for IP-based indicators */
export interface GeolocationData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  isp: string;
  asn?: string;
}

/** Comprehensive threat event record */
export interface ThreatEvent {
  readonly id: string;
  title: string;
  description: string;
  severity: ThreatSeverity;
  status: ThreatStatus;
  indicators: ThreatIndicator[];
  mitre?: MitreAttackMapping;
  analysis?: ThreatAnalysis;
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  ioc?: IoCData[];
}

/** MITRE ATT&CK framework mapping */
export interface MitreAttackMapping {
  tactics: MitreTactic[];
  techniques: MitreTechnique[];
  subTechniques?: string[];
  procedure?: string;
}

export interface MitreTactic {
  id: string;
  name: string;
  description: string;
}

export interface MitreTechnique {
  id: string;
  name: string;
  tacticId: string;
  description: string;
}

/** IoC (Indicator of Compromise) data */
export interface IoCData {
  type: IndicatorType;
  value: string;
  confidence: number;
  context: string;
  expiry?: Date;
}

// ============================================================
// THREAT ANALYSIS TYPES
// ============================================================

/** AI-generated threat analysis */
export interface ThreatAnalysis {
  readonly id: string;
  threatId: string;
  summary: string;
  riskScore: number;
  attackVector: AttackVector;
  impact: AnalysisImpact;
  recommendations: Recommendation[];
  similarIncidents: string[];
  aiConfidence: number;
  generatedAt: Date;
}

export type AttackVector = 
  | 'network'
  | 'email'
  | 'web'
  | 'physical'
  | 'removable_media'
  | 'supply_chain'
  | 'social_engineering';

export interface AnalysisImpact {
  confidentiality: ImpactLevel;
  integrity: ImpactLevel;
  availability: ImpactLevel;
  financial: string;
  reputational: string;
}

export type ImpactLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface Recommendation {
  id: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  action: string;
  rationale: string;
  estimatedEffort: string;
}

// ============================================================
// MULTI-AGENT SYSTEM TYPES
// ============================================================

/** AI Agent definition for coordinated threat response */
export interface AIAgent {
  readonly id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  capabilities: AgentCapability[];
  currentTask?: string;
  performance: AgentPerformance;
  memory: AgentMemoryEntry[];
  lastActive: Date;
}

export type AgentType = 
  | 'analyzer'
  | 'hunter'
  | 'responder'
  | 'collector'
  | 'correlator'
  | 'reporter';

export type AgentCapability = 
  | 'malware_analysis'
  | 'network_forensics'
  | 'log_analysis'
  | 'ioc_enrichment'
  | 'threat_hunting'
  | 'incident_response'
  | 'report_generation'
  | 'user_behavior_analysis';

export interface AgentPerformance {
  tasksCompleted: number;
  successRate: number;
  averageResponseTime: number;
  accuracy: number;
}

/** Hindsight Memory Intelligence entry */
export interface AgentMemoryEntry {
  readonly id: string;
  agentId: string;
  type: MemoryType;
  content: string;
  context: string;
  confidence: number;
  timestamp: Date;
  relatedEntries: string[];
  decayFactor: number;
}

export type MemoryType = 
  | 'pattern'
  | 'correlation'
  | 'anomaly'
  | 'resolution'
  | 'behavioral'
  | 'temporal';

// ============================================================
// CASCADE FLOW TYPES
// ============================================================

/** CascadeFlow runtime intelligence workflow */
export interface CascadeFlow {
  readonly id: string;
  name: string;
  description: string;
  steps: CascadeStep[];
  trigger: FlowTrigger;
  status: FlowStatus;
  executionHistory: FlowExecution[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CascadeStep {
  id: string;
  name: string;
  type: StepType;
  agentId?: string;
  conditions: FlowCondition[];
  actions: FlowAction[];
  timeout: number;
  retryPolicy: RetryPolicy;
}

export type StepType = 
  | 'collection'
  | 'analysis'
  | 'correlation'
  | 'enrichment'
  | 'decision'
  | 'action'
  | 'notification';

export interface FlowTrigger {
  type: 'manual' | 'schedule' | 'event' | 'threshold';
  config: Record<string, unknown>;
}

export type FlowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed';

export interface FlowCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'matches';
  value: unknown;
}

export interface FlowAction {
  type: string;
  params: Record<string, unknown>;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMs: number;
  exponential: boolean;
}

export interface FlowExecution {
  readonly id: string;
  flowId: string;
  status: FlowStatus;
  startedAt: Date;
  completedAt?: Date;
  stepsExecuted: StepExecution[];
  error?: string;
}

export interface StepExecution {
  stepId: string;
  status: FlowStatus;
  startedAt: Date;
  completedAt?: Date;
  output?: unknown;
  error?: string;
}

// ============================================================
// REAL-TIME INTELLIGENCE TYPES
// ============================================================

/** Real-time threat intelligence feed */
export interface IntelligenceFeed {
  readonly id: string;
  name: string;
  type: IntelligenceFeedType;
  url: string;
  apiKey?: string;
  refreshInterval: number;
  lastSync: Date;
  status: 'active' | 'paused' | 'error';
  indicators: number;
  reliability: number;
}

/** Live event stream entry */
export interface LiveEvent {
  readonly id: string;
  timestamp: Date;
  type: EventType;
  severity: ThreatSeverity;
  source: string;
  title: string;
  details: Record<string, unknown>;
  processed: boolean;
}

export type EventType = 
  | 'alert'
  | 'discovery'
  | 'correlation'
  | 'anomaly'
  | 'action'
  | 'system';

// ============================================================
// DASHBOARD & UI TYPES
// ============================================================

/** Dashboard widget configuration */
export interface DashboardWidget {
  readonly id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: WidgetPosition;
  config: Record<string, unknown>;
  refreshInterval?: number;
}

export type WidgetType = 
  | 'threat_summary'
  | 'severity_distribution'
  | 'timeline'
  | 'geographic_map'
  | 'agent_status'
  | 'ioc_feed'
  | 'recent_events'
  | 'metrics';

export type WidgetSize = 'sm' | 'md' | 'lg' | 'xl';

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** User preferences and settings */
export interface UserPreferences {
  theme: 'dark' | 'light' | 'cyberpunk';
  layout: 'default' | 'compact' | 'expanded';
  notifications: NotificationSettings;
  timezone: string;
  dateFormat: string;
}

export interface NotificationSettings {
  desktop: boolean;
  email: boolean;
  sound: boolean;
  urgencyThreshold: NotificationUrgency;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

/** Standard API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** Error response structure */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// ============================================================
// WEBSOCKET TYPES
// ============================================================

/** WebSocket message structure */
export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  payload: T;
  timestamp: Date;
  source: string;
}

export type WebSocketMessageType = 
  | 'threat_update'
  | 'agent_status'
  | 'feed_update'
  | 'alert'
  | 'system'
  | 'sync';

/** WebSocket connection state */
export interface WebSocketState {
  connected: boolean;
  reconnecting: boolean;
  lastConnected?: Date;
  messageCount: number;
}
