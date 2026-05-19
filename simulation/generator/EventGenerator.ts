/**
 * Event Generator Service
 * Generates realistic cybersecurity threat events for simulation
 * Creates interconnected attack chains and correlated events
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  ThreatEvent,
  EventType,
  ThreatLevel,
  EventStatus,
  KillChainPhase,
  AttackVector,
  Geolocation,
  DeviceInfo,
  UserInfo,
  EvidenceItem,
  AIAnalysis,
  ThreatCampaign,
  SimulationConfig,
} from '../types';
import {
  corporateUsers,
  corporateDevices,
  geolocations,
  eventTemplates,
  eventTags,
  mitreTactics,
  mitreTechniques,
  threatCampaigns,
  attackChains,
  suspiciousIPs,
  maliciousDomains,
} from '../data/realisticData';

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/** Generate random number within range */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick random item from array */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Pick multiple random items from array */
function pickRandomMultiple<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

/** Generate UUID */
function generateId(): string {
  return uuidv4();
}

/** Generate event ID */
function generateEventId(): string {
  return `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

/** Generate random IP address */
function generateInternalIP(): string {
  return `10.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`;
}

/** Generate MAC address */
function generateMAC(): string {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join(':');
}

// ============================================================
// EVENT GENERATOR CLASS
// ============================================================

export class EventGenerator {
  private config: SimulationConfig;
  private generatedEvents: ThreatEvent[] = [];

  constructor(config: SimulationConfig) {
    this.config = config;
  }

  /**
   * Generate all threat events
   */
  async generateEvents(): Promise<ThreatEvent[]> {
    console.log(`[EventGenerator] Starting generation of ${this.config.totalEvents} events...`);
    
    this.generatedEvents = [];
    const startTime = Date.now();

    // Generate individual events
    const individualEventCount = Math.floor(this.config.totalEvents * 0.7);
    for (let i = 0; i < individualEventCount; i++) {
      const event = this.generateSingleEvent();
      this.generatedEvents.push(event);
    }

    // Generate campaign-related events
    if (this.config.enableCampaigns) {
      await this.generateCampaignEvents();
    }

    // Generate correlated events
    await this.generateCorrelatedEvents();

    // Sort by timestamp
    this.generatedEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    console.log(`[EventGenerator] Generated ${this.generatedEvents.length} events in ${Date.now() - startTime}ms`);
    return this.generatedEvents;
  }

  /**
   * Generate a single threat event
   */
  private generateSingleEvent(): ThreatEvent {
    const eventType = this.selectEventType();
    const template = eventTemplates[eventType];
    const threatLevel = this.selectThreatLevel();
    const status = this.selectStatus();
    
    const user = this.generateUser();
    const device = this.generateDevice();
    const geolocation = this.generateGeolocation(threatLevel);
    const evidence = this.generateEvidence(eventType);
    const aiAnalysis = this.generateAIAnalysis(eventType, threatLevel, evidence);
    
    const timestamp = this.generateTimestamp();
    
    return {
      id: generateId(),
      eventId: generateEventId(),
      timestamp,
      receivedAt: new Date(timestamp.getTime() + randomInt(100, 5000)),
      
      eventType,
      category: template.category,
      sourceType: template.sourceType,
      
      threatLevel,
      status,
      priority: this.threatLevelToPriority(threatLevel),
      
      title: pickRandom(template.titles),
      description: pickRandom(template.descriptions),
      aiSummary: aiAnalysis.summary,
      
      user,
      device,
      geolocation,
      
      anomalyScore: this.calculateAnomalyScore(threatLevel, eventType),
      confidenceScore: aiAnalysis.confidenceScore,
      
      evidence,
      aiAnalysis,
      
      relatedEvents: [],
      
      killChainPhase: this.inferKillChainPhase(eventType),
      attackVector: this.inferAttackVector(eventType),
      
      tags: this.generateTags(eventType, threatLevel),
    };
  }

  /**
   * Generate events for attack campaigns
   */
  private async generateCampaignEvents(): Promise<void> {
    const campaignCount = this.config.campaignCount;
    const selectedCampaigns = pickRandomMultiple(threatCampaigns, campaignCount);

    for (const campaign of selectedCampaigns) {
      const chain = pickRandom(attackChains);
      const campaignStartTime = this.generateTimestamp();
      
      // Generate events for each phase of the attack chain
      for (let phaseIndex = 0; phaseIndex < chain.phases.length; phaseIndex++) {
        const phase = chain.phases[phaseIndex];
        const timeOffset = phaseIndex * randomInt(300000, 3600000); // 5 min to 1 hour between phases
        
        const event = this.generateCampaignEvent(campaign, phase, new Date(campaignStartTime.getTime() + timeOffset));
        this.generatedEvents.push(event);
      }
    }
  }

  /**
   * Generate a single campaign event
   */
  private generateCampaignEvent(
    campaign: ThreatCampaign,
    phase: typeof attackChains[0]['phases'][0],
    timestamp: Date
  ): ThreatEvent {
    const template = eventTemplates[phase.eventType];
    const threatLevel = this.determineCampaignThreatLevel(campaign.sophistication);
    
    const user = this.generateUser();
    const device = this.generateDevice();
    const geolocation = this.generateGeolocation(threatLevel);
    const evidence = this.generateEvidence(phase.eventType);
    const aiAnalysis = this.generateAIAnalysis(phase.eventType, threatLevel, evidence);
    
    return {
      id: generateId(),
      eventId: generateEventId(),
      timestamp,
      receivedAt: new Date(timestamp.getTime() + randomInt(100, 2000)),
      
      eventType: phase.eventType,
      category: template.category,
      sourceType: template.sourceType,
      
      threatLevel,
      status: 'new',
      priority: this.threatLevelToPriority(threatLevel),
      
      title: pickRandom(template.titles),
      description: pickRandom(template.descriptions),
      aiSummary: `[Campaign: ${campaign.name}] ${aiAnalysis.summary}`,
      
      user,
      device,
      geolocation,
      
      anomalyScore: this.calculateAnomalyScore(threatLevel, phase.eventType),
      confidenceScore: aiAnalysis.confidenceScore,
      
      evidence,
      aiAnalysis,
      
      relatedEvents: [],
      campaign: campaign as ThreatCampaign,
      
      killChainPhase: phase.killChainPhase,
      attackVector: phase.attackVector,
      
      tags: [...this.generateTags(phase.eventType, threatLevel), campaign.campaignId.toLowerCase()],
    };
  }

  /**
   * Generate correlated events (events linked to each other)
   */
  private async generateCorrelatedEvents(): Promise<void> {
    const correlationCount = Math.floor(this.config.totalEvents * this.config.correlatedEventPercentage);
    const correlationBatchSize = randomInt(3, 8);
    const correlationBatches = Math.floor(correlationCount / correlationBatchSize);

    for (let batch = 0; batch < correlationBatches; batch++) {
      const baseEvent = this.generateSingleEvent();
      const relatedEventIds: string[] = [baseEvent.id];
      
      this.generatedEvents.push(baseEvent);

      // Generate related events
      for (let i = 1; i < correlationBatchSize; i++) {
        const relatedEvent = this.generateRelatedEvent(baseEvent, i);
        relatedEventIds.push(relatedEvent.id);
        this.generatedEvents.push(relatedEvent);
      }

      // Link all events in the batch
      for (const eventId of relatedEventIds) {
        const event = this.generatedEvents.find(e => e.id === eventId);
        if (event) {
          event.relatedEvents = relatedEventIds.filter(id => id !== eventId);
        }
      }
    }
  }

  /**
   * Generate an event related to a base event
   */
  private generateRelatedEvent(baseEvent: ThreatEvent, sequenceIndex: number): ThreatEvent {
    // Get related event type
    const relatedEventType = this.getRelatedEventType(baseEvent.eventType);
    const template = eventTemplates[relatedEventType];
    
    // Time offset from base event (minutes later)
    const timeOffset = sequenceIndex * randomInt(60000, 1800000); // 1-30 minutes
    const timestamp = new Date(baseEvent.timestamp.getTime() + timeOffset);
    
    const threatLevel = this.escalateThreatLevel(baseEvent.threatLevel, sequenceIndex);
    const user = baseEvent.user || this.generateUser();
    const device = baseEvent.device || this.generateDevice();
    const geolocation = baseEvent.geolocation || this.generateGeolocation(threatLevel);
    const evidence = this.generateEvidence(relatedEventType);
    const aiAnalysis = this.generateAIAnalysis(relatedEventType, threatLevel, evidence);

    return {
      id: generateId(),
      eventId: generateEventId(),
      timestamp,
      receivedAt: new Date(timestamp.getTime() + randomInt(100, 2000)),
      
      eventType: relatedEventType,
      category: template.category,
      sourceType: template.sourceType,
      
      threatLevel,
      status: 'new',
      priority: this.threatLevelToPriority(threatLevel),
      
      title: pickRandom(template.titles),
      description: pickRandom(template.descriptions),
      aiSummary: `[Correlated with ${baseEvent.eventId}] ${aiAnalysis.summary}`,
      
      user,
      device,
      geolocation,
      
      anomalyScore: this.calculateAnomalyScore(threatLevel, relatedEventType),
      confidenceScore: aiAnalysis.confidenceScore,
      
      evidence,
      aiAnalysis,
      
      relatedEvents: [baseEvent.id],
      campaign: baseEvent.campaign,
      
      killChainPhase: this.inferKillChainPhase(relatedEventType),
      attackVector: this.inferAttackVector(relatedEventType),
      
      tags: [...this.generateTags(relatedEventType, threatLevel), 'correlated'],
    };
  }

  // ============================================================
  // HELPER METHODS
  // ============================================================

  private selectEventType(): EventType {
    const eventTypes = Object.keys(eventTemplates) as EventType[];
    // Weight physical events less
    const weights: Record<string, number> = {
      suspicious_vehicle: 5,
      abnormal_badge_access: 8,
      unauthorized_login: 15,
      server_room_breach: 3,
      malware_activity: 12,
      network_intrusion: 15,
      phishing_attempt: 12,
      ransomware_indicator: 4,
      insider_threat: 6,
      data_exfiltration: 5,
      privilege_escalation: 8,
      lateral_movement: 10,
      credential_theft: 10,
      physical_security: 4,
      anomalous_behavior: 12,
    };
    
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (const [type, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        return type as EventType;
      }
    }
    
    return pickRandom(eventTypes);
  }

  private selectThreatLevel(): ThreatLevel {
    const distribution = this.config.threatDistribution;
    const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
    let random = Math.random() * total;
    
    for (const [level, count] of Object.entries(distribution)) {
      random -= count;
      if (random <= 0) {
        return level as ThreatLevel;
      }
    }
    
    return 'medium';
  }

  private selectStatus(): EventStatus {
    const statuses: EventStatus[] = ['new', 'investigating', 'confirmed', 'mitigated', 'false_positive'];
    const weights = [0.4, 0.25, 0.15, 0.15, 0.05];
    
    let random = Math.random();
    for (let i = 0; i < statuses.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return statuses[i];
      }
    }
    
    return 'new';
  }

  private generateUser(): UserInfo {
    const user = pickRandom(corporateUsers);
    return {
      ...user,
      lastLogin: new Date(Date.now() - randomInt(0, 86400000 * 7)),
      accountStatus: Math.random() > 0.95 ? 'suspicious' : 'active',
    };
  }

  private generateDevice(): DeviceInfo {
    const device = pickRandom(corporateDevices);
    return {
      ...device,
      ipAddress: device.deviceType === 'workstation' || device.deviceType === 'laptop' ? generateInternalIP() : undefined,
      macAddress: generateMAC(),
      lastSeen: new Date(Date.now() - randomInt(0, 3600000)),
    };
  }

  private generateGeolocation(threatLevel: ThreatLevel): Geolocation {
    // Higher threat levels more likely to be external/suspicious
    const useExternal = threatLevel === 'high' || threatLevel === 'critical' 
      ? Math.random() > 0.3 
      : Math.random() > 0.7;
    
    const useSuspicious = threatLevel === 'critical' && Math.random() > 0.5;
    
    if (useSuspicious) {
      return pickRandom(geolocations.suspicious);
    } else if (useExternal) {
      return pickRandom(geolocations.external);
    }
    return pickRandom(geolocations.internal);
  }

  private generateTimestamp(): Date {
    const { start, end } = this.config.timeRange;
    const timeDiff = end.getTime() - start.getTime();
    const randomTime = start.getTime() + Math.random() * timeDiff;
    return new Date(randomTime);
  }

  private generateEvidence(_eventType: EventType): EvidenceItem[] {
    const evidenceCount = randomInt(1, 5);
    const evidenceTypes: EvidenceItem['type'][] = ['log_entry', 'alert', 'network_flow', 'packet_capture'];
    
    return Array.from({ length: evidenceCount }, () => {
      const type = pickRandom(evidenceTypes);
      return {
        id: generateId(),
        type,
        source: this.getEvidenceSource(type),
        timestamp: new Date(Date.now() - randomInt(0, 3600000)),
        content: this.generateEvidenceContent(type),
        isValid: Math.random() > 0.05,
        confidence: randomInt(70, 100),
        metadata: this.generateEvidenceMetadata(type),
      };
    });
  }

  private getEvidenceSource(type: EvidenceItem['type']): string {
    const sources: Record<string, string[]> = {
      log_entry: ['Windows Event Log', 'Syslog', 'Apache Access Log', 'Application Log'],
      alert: ['Snort', 'Suricata', 'YARA', 'Sigma Rule'],
      network_flow: ['NetFlow', 'Zeek', 'NetworkMiner', 'Wireshark'],
      packet_capture: ['tcpdump', 'Wireshark', 'Network TAP'],
      screenshot: ['Security Camera', 'Screen Capture'],
      file_hash: ['VirusTotal', 'Hybrid Analysis', 'Local Scanner'],
    };
    return pickRandom(sources[type] || sources.log_entry);
  }

  private generateEvidenceContent(type: EvidenceItem['type']): string {
    const contents: Record<string, string[]> = {
      log_entry: [
        `Failed login attempt for user from ${pickRandom(suspiciousIPs)}`,
        `Process created: ${pickRandom(['cmd.exe', 'powershell.exe', 'mimikatz.exe', 'rundll32.exe'])}`,
        `Network connection to ${pickRandom(maliciousDomains)}`,
        `File created: ${pickRandom(['suspicious.ps1', 'payload.exe', 'encrypted_data.zip'])}`,
      ],
      alert: [
        `Signature match: ${pickRandom(['ET MALWARE', 'Win.Trojan', 'APT28', 'Cobalt Strike'])}`,
        `Anomaly detected: ${pickRandom(['DNS tunneling', 'Data exfiltration', 'Port scanning'])}`,
      ],
      network_flow: [
        `TCP SYN flood detected from ${pickRandom(suspiciousIPs)}`,
        `Large data transfer: 2.3GB to external IP`,
        `Encrypted traffic to known C2 server`,
      ],
    };
    return pickRandom(contents[type] || contents.log_entry);
  }

  private generateEvidenceMetadata(_type: EvidenceItem['type']): Record<string, unknown> {
    return {
      sourceIP: pickRandom([...suspiciousIPs, generateInternalIP()]),
      destinationIP: Math.random() > 0.5 ? pickRandom(suspiciousIPs) : generateInternalIP(),
      port: pickRandom([80, 443, 445, 3389, 8080, 8443, 53]),
      protocol: pickRandom(['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS']),
      bytesTransferred: randomInt(100, 10000000),
    };
  }

  private generateAIAnalysis(
    eventType: EventType,
    threatLevel: ThreatLevel,
    evidence: EvidenceItem[]
  ): AIAnalysis {
    const confidenceScore = threatLevel === 'critical' ? randomInt(85, 99) : randomInt(60, 95);
    const riskScore = this.threatLevelToRiskScore(threatLevel);
    
    const tactics = pickRandomMultiple(mitreTactics, randomInt(1, 3));
    const techniques = pickRandomMultiple(mitreTechniques, randomInt(2, 5));
    
    return {
      summary: this.generateAISummary(eventType, threatLevel),
      confidenceScore,
      riskScore,
      attackPattern: pickRandom(['Targeted Attack', 'Opportunistic', 'Automated Scan', 'Advanced Persistent']),
      mitreTactics: tactics.map(t => ({ ...t })),
      mitreTechniques: techniques.map(t => ({ ...t })),
      indicators: [
        ...evidence.map(e => typeof e.content === 'string' ? e.content : ''),
        `IP: ${pickRandom(suspiciousIPs)}`,
        `Domain: ${pickRandom(maliciousDomains)}`,
      ].filter(Boolean).slice(0, 5),
      recommendations: this.generateRecommendations(threatLevel),
      similarIncidents: [],
      analysisTimestamp: new Date(),
      modelVersion: '2.1.0',
    };
  }

  private generateAISummary(eventType: EventType, _threatLevel: ThreatLevel): string {
    const summaries: Record<string, string[]> = {
      suspicious_vehicle: [
        'Vehicle behavior analysis indicates potential reconnaissance activity. Pattern matches known pre-attack surveillance techniques.',
        'Unidentified vehicle exhibiting suspicious movement patterns near facility perimeter. Correlation with historical data shows similar behavior prior to security incidents.',
      ],
      abnormal_badge_access: [
        'Badge access anomaly detected through behavioral analysis. Access pattern deviates significantly from user baseline, suggesting potential credential compromise.',
        'Impossible travel scenario detected. Same credentials used at geographically distant locations within impossible timeframe.',
      ],
      unauthorized_login: [
        'Authentication anomaly detected with high confidence. Multiple failed attempts followed by success suggests credential stuffing or brute force attack.',
        'Login pattern analysis indicates potential account compromise. Session characteristics differ from known user profile.',
      ],
      malware_activity: [
        'Behavioral analysis confirms malicious activity with high confidence. Process chain and network behavior match known threat actor TTPs.',
        'Endpoint protection detected malware execution. Behavioral indicators suggest polymorphic variant designed to evade signature-based detection.',
      ],
      network_intrusion: [
        'Network traffic analysis identified lateral movement indicators. Communication patterns suggest compromised host reconnaissance.',
        'Command and control communication detected. Beaconing pattern and encrypted traffic analysis match known threat infrastructure.',
      ],
    };
    
    return pickRandom(summaries[eventType] || summaries.malware_activity);
  }

  private generateRecommendations(threatLevel: ThreatLevel): string[] {
    const baseRecommendations = [
      'Isolate affected systems immediately',
      'Collect forensic evidence before remediation',
      'Review access logs for related suspicious activity',
      'Notify incident response team',
    ];
    
    const criticalAdditional = [
      'Initiate full network segmentation',
      'Reset all potentially compromised credentials',
      'Engage external forensics team if needed',
      'Prepare executive briefing',
    ];
    
    if (threatLevel === 'critical') {
      return [...criticalAdditional, ...baseRecommendations];
    }
    return baseRecommendations;
  }

  private generateTags(eventType: EventType, threatLevel: ThreatLevel): string[] {
    const baseTags = [eventType.replace(/_/g, '-')];
    
    if (threatLevel === 'critical' || threatLevel === 'high') {
      baseTags.push('priority');
    }
    
    return [...baseTags, ...pickRandomMultiple(eventTags, randomInt(1, 3))];
  }

  private inferKillChainPhase(eventType: EventType): KillChainPhase {
    const phaseMap: Partial<Record<EventType, KillChainPhase>> = {
      suspicious_vehicle: 'reconnaissance',
      abnormal_badge_access: 'initial_access',
      unauthorized_login: 'initial_access',
      server_room_breach: 'initial_access',
      malware_activity: 'execution',
      network_intrusion: 'lateral_movement',
      phishing_attempt: 'delivery',
      ransomware_indicator: 'actions_objectives',
      insider_threat: 'collection',
      data_exfiltration: 'exfiltration',
      privilege_escalation: 'privilege_escalation',
      lateral_movement: 'lateral_movement',
      credential_theft: 'credential_access',
      physical_security: 'reconnaissance',
      anomalous_behavior: 'discovery',
    };
    
    return phaseMap[eventType] || 'discovery';
  }

  private inferAttackVector(eventType: EventType): AttackVector {
    const vectorMap: Partial<Record<EventType, AttackVector>> = {
      suspicious_vehicle: 'physical',
      abnormal_badge_access: 'physical',
      server_room_breach: 'physical',
      physical_security: 'physical',
      phishing_attempt: 'email',
      unauthorized_login: 'network',
      malware_activity: 'network',
      network_intrusion: 'network',
      insider_threat: 'insider',
      data_exfiltration: 'insider',
    };
    
    return vectorMap[eventType] || 'network';
  }

  private threatLevelToPriority(level: ThreatLevel): number {
    const priorityMap: Record<ThreatLevel, number> = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    };
    return priorityMap[level];
  }

  private threatLevelToRiskScore(level: ThreatLevel): number {
    const riskMap: Record<ThreatLevel, [number, number]> = {
      critical: [90, 100],
      high: [70, 89],
      medium: [40, 69],
      low: [20, 39],
      info: [0, 19],
    };
    const [min, max] = riskMap[level];
    return randomInt(min, max);
  }

  private calculateAnomalyScore(threatLevel: ThreatLevel, _eventType: EventType): number {
    const baseScores: Record<ThreatLevel, [number, number]> = {
      critical: [85, 100],
      high: [70, 89],
      medium: [45, 69],
      low: [20, 44],
      info: [0, 19],
    };
    
    const [min, max] = baseScores[threatLevel];
    return randomInt(min, max);
  }

  private determineCampaignThreatLevel(sophistication: ThreatCampaign['sophistication']): ThreatLevel {
    const levelMap: Record<string, ThreatLevel> = {
      expert: 'critical',
      advanced: 'high',
      intermediate: 'medium',
      emerging: 'low',
    };
    return levelMap[sophistication] || 'medium';
  }

  private getRelatedEventType(eventType: EventType): EventType {
    const relatedMap: Partial<Record<EventType, EventType[]>> = {
      phishing_attempt: ['unauthorized_login', 'malware_activity'],
      unauthorized_login: ['lateral_movement', 'privilege_escalation', 'data_exfiltration'],
      malware_activity: ['network_intrusion', 'ransomware_indicator'],
      network_intrusion: ['lateral_movement', 'credential_theft', 'data_exfiltration'],
      insider_threat: ['data_exfiltration', 'anomalous_behavior'],
      credential_theft: ['lateral_movement', 'privilege_escalation'],
      lateral_movement: ['data_exfiltration', 'privilege_escalation'],
      privilege_escalation: ['data_exfiltration', 'ransomware_indicator'],
    };
    
    const relatedTypes = relatedMap[eventType];
    return relatedTypes ? pickRandom(relatedTypes) : eventType;
  }

  private escalateThreatLevel(currentLevel: ThreatLevel, escalationSteps: number): ThreatLevel {
    const levels: ThreatLevel[] = ['info', 'low', 'medium', 'high', 'critical'];
    const currentIndex = levels.indexOf(currentLevel);
    const newIndex = Math.min(currentIndex + escalationSteps, levels.length - 1);
    return levels[newIndex];
  }
}

// ============================================================
// DEFAULT CONFIGURATION
// ============================================================

export const defaultConfig: SimulationConfig = {
  totalEvents: 10000,
  timeRange: {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    end: new Date(),
  },
  threatDistribution: {
    critical: 5,
    high: 15,
    medium: 35,
    low: 30,
    info: 15,
  },
  categoryDistribution: {
    cyber: 60,
    physical: 15,
    insider: 15,
    combined: 10,
  },
  enableCampaigns: true,
  campaignCount: 5,
  insiderThreatPercentage: 0.15,
  correlatedEventPercentage: 0.25,
};

// Export singleton for easy access
let generatorInstance: EventGenerator | null = null;

export function getEventGenerator(config?: SimulationConfig): EventGenerator {
  if (!generatorInstance || config) {
    generatorInstance = new EventGenerator(config || defaultConfig);
  }
  return generatorInstance;
}
