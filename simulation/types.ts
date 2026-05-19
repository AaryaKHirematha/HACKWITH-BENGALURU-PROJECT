/**
 * Simulation Engine Types
 * Comprehensive type definitions for threat intelligence simulation
 * Designed for enterprise SOC environment demos
 */

// ============================================================
// CORE EVENT TYPES
// ============================================================

/** Supported threat event types */
export type EventType = 
  | 'suspicious_vehicle'
  | 'abnormal_badge_access'
  | 'unauthorized_login'
  | 'server_room_breach'
  | 'malware_activity'
  | 'network_intrusion'
  | 'phishing_attempt'
  | 'ransomware_indicator'
  | 'insider_threat'
  | 'data_exfiltration'
  | 'privilege_escalation'
  | 'lateral_movement'
  | 'credential_theft'
  | 'physical_security'
  | 'anomalous_behavior';

/** Event categories for classification */
export type EventCategory = 'cyber' | 'physical' | 'insider' | 'combined';

/** Source types for event detection */
export type SourceType = 
  | 'siem'
  | 'ids'
  | 'ips'
  | 'edr'
  | 'ndr'
  | 'camera'
  | 'badge_system'
  | 'vehicle_system'
  | 'user_report'
  | 'threat_intel'
  | 'deception';

/** Threat severity levels */
export type ThreatLevel = 'info' | 'low' | 'medium' | 'high' | 'critical';

/** Event investigation status */
export type EventStatus = 'new' | 'investigating' | 'confirmed' | 'mitigated' | 'false_positive' | 'escalated';

/** MITRE ATT&CK Kill Chain phases */
export type KillChainPhase = 
  | 'reconnaissance'
  | 'resource_development'
  | 'initial_access'
  | 'execution'
  | 'persistence'
  | 'privilege_escalation'
  | 'defense_evasion'
  | 'credential_access'
  | 'discovery'
  | 'lateral_movement'
  | 'collection'
  | 'command_control'
  | 'exfiltration'
  | 'impact'
  | 'weaponization'
  | 'delivery'
  | 'exploitation'
  | 'installation'
  | 'actions_objectives';

/** Attack vectors */
export type AttackVector = 'network' | 'email' | 'physical' | 'web' | 'removable_media' | 'supply_chain' | 'social' | 'insider';

// ============================================================
// ENTITY TYPES
// ============================================================

/** Geolocation data */
export interface Geolocation {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  isp: string;
  asn?: string;
  timezone: string;
  isInternal: boolean;
}

/** Device information */
export interface DeviceInfo {
  deviceId: string;
  deviceType: 'workstation' | 'laptop' | 'server' | 'mobile' | 'iot' | 'camera' | 'badge_reader' | 'vehicle' | 'network_device';
  hostname?: string;
  ipAddress?: string;
  macAddress?: string;
  operatingSystem?: string;
  department?: string;
  owner?: string;
  lastSeen?: Date;
  trustLevel: 'trusted' | 'managed' | 'unmanaged' | 'unknown';
}

/** User information */
export interface UserInfo {
  userId: string;
  username: string;
  email: string;
  department: string;
  role: string;
  clearanceLevel: number;
  isPrivileged: boolean;
  isContractor: boolean;
  lastLogin?: Date;
  accountStatus: 'active' | 'disabled' | 'locked' | 'suspicious';
}

/** Evidence item */
export interface EvidenceItem {
  id: string;
  type: 'log_entry' | 'packet_capture' | 'screenshot' | 'file_hash' | 'memory_dump' | 'network_flow' | 'alert' | 'credential' | 'video' | 'access_log';
  source: string;
  timestamp: Date;
  content: string | Record<string, unknown>;
  hash?: string;
  size?: number;
  isValid: boolean;
  confidence: number;
  metadata?: Record<string, unknown>;
}

/** AI Analysis result */
export interface AIAnalysis {
  summary: string;
  confidenceScore: number;
  riskScore: number;
  attackPattern?: string;
  mitreTactics: Array<{
    tacticId: string;
    name: string;
    description: string;
  }>;
  mitreTechniques: Array<{
    techniqueId: string;
    name: string;
    tacticId: string;
  }>;
  indicators: string[];
  recommendations: string[];
  similarIncidents: string[];
  analysisTimestamp: Date;
  modelVersion: string;
}

/** Threat Campaign */
export interface ThreatCampaign {
  campaignId: string;
  name: string;
  threatActor: string;
  sophistication: 'emerging' | 'intermediate' | 'advanced' | 'expert';
  targets: string[];
  objectives: string[];
}

// ============================================================
// MAIN EVENT INTERFACE
// ============================================================

export interface ThreatEvent {
  id: string;
  eventId: string;
  timestamp: Date;
  receivedAt: Date;
  
  // Classification
  eventType: EventType;
  category: EventCategory;
  subcategory?: string;
  sourceType: SourceType;
  
  // Severity & Status
  threatLevel: ThreatLevel;
  status: EventStatus;
  priority: number;
  
  // Core Data
  title: string;
  description: string;
  aiSummary: string;
  
  // Entities
  user?: UserInfo;
  device?: DeviceInfo;
  geolocation?: Geolocation;
  
  // Scoring
  anomalyScore: number;
  confidenceScore: number;
  
  // Evidence & Analysis
  evidence: EvidenceItem[];
  aiAnalysis: AIAnalysis;
  
  // Relationships
  relatedEvents: string[];
  campaign?: ThreatCampaign;
  
  // Attack Chain
  killChainPhase?: KillChainPhase;
  attackVector?: AttackVector;
  
  // Tags
  tags: string[];
}

// ============================================================
// QUERY & FILTER TYPES
// ============================================================

export interface EventFilter {
  eventTypes?: EventType[];
  threatLevels?: ThreatLevel[];
  statuses?: EventStatus[];
  categories?: EventCategory[];
  sourceTypes?: SourceType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
  minAnomalyScore?: number;
  maxAnomalyScore?: number;
  minConfidenceScore?: number;
  departments?: string[];
  userIds?: string[];
  deviceIds?: string[];
  tags?: string[];
  hasCampaign?: boolean;
  campaignId?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// ============================================================
// SIMULATION CONFIGURATION
// ============================================================

export interface SimulationConfig {
  totalEvents: number;
  timeRange: {
    start: Date;
    end: Date;
  };
  threatDistribution: Record<ThreatLevel, number>;
  categoryDistribution: Record<EventCategory, number>;
  enableCampaigns: boolean;
  campaignCount: number;
  insiderThreatPercentage: number;
  correlatedEventPercentage: number;
}

// ============================================================
// STATISTICS TYPES
// ============================================================

export interface EventStatistics {
  totalEvents: number;
  byThreatLevel: Record<ThreatLevel, number>;
  byEventType: Record<EventType, number>;
  byCategory: Record<EventCategory, number>;
  byStatus: Record<EventStatus, number>;
  bySource: Record<SourceType, number>;
  averageAnomalyScore: number;
  averageConfidenceScore: number;
  topTags: Array<{ tag: string; count: number }>;
  timeline: Array<{ timestamp: Date; count: number; threatLevel: ThreatLevel }>;
  campaigns: number;
}
