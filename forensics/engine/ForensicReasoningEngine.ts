/**
 * ForensicReasoningEngine
 * Heuristic + explainable reasoning engine for incident correlation,
 * coordinated behavior detection, suspect timelines, and future attack prediction.
 */

import type { ThreatEvent } from '@/simulation/types';
import type { Investigation, MemoryEntry } from '@/agents/types';
import type {
  CorrelationLink,
  ForensicAnalysisResult,
  ForensicCluster,
  ForensicNarrativeRecord,
  ForensicPatternSignature,
  FutureAttackPrediction,
  RecommendedAction,
  SuspectTimeline,
  ThreatTimelineEntry,
} from '../types';

const uid = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

interface PatternDefinition {
  signature: ForensicPatternSignature;
  requiredTypes: ThreatEvent['eventType'][];
  timeWindowMs: number;
  name: string;
  conclusion: string;
  coordinatedBehavior: boolean;
  nextLikelyStep: string;
  stageLabels: string[];
}

const patternDefinitions: PatternDefinition[] = [
  {
    signature: 'insider_assisted_intrusion',
    requiredTypes: ['suspicious_vehicle', 'abnormal_badge_access', 'server_room_breach'],
    timeWindowMs: 6 * 60 * 60 * 1000,
    name: 'Insider-Assisted Physical Intrusion',
    conclusion: 'Potential coordinated insider-assisted intrusion detected.',
    coordinatedBehavior: true,
    nextLikelyStep: 'Credential staging or covert network pivot from restricted infrastructure.',
    stageLabels: ['Perimeter reconnaissance', 'Access enablement', 'Restricted-area breach'],
  },
  {
    signature: 'credential_compromise_chain',
    requiredTypes: ['phishing_attempt', 'unauthorized_login', 'credential_theft', 'lateral_movement'],
    timeWindowMs: 18 * 60 * 60 * 1000,
    name: 'Credential Compromise Attack Chain',
    conclusion: 'Probable multi-stage credential compromise progressing toward lateral expansion.',
    coordinatedBehavior: true,
    nextLikelyStep: 'Privilege escalation or data staging on adjacent hosts.',
    stageLabels: ['Delivery', 'Account access', 'Credential extraction', 'Lateral movement'],
  },
  {
    signature: 'ransomware_progression',
    requiredTypes: ['phishing_attempt', 'malware_activity', 'lateral_movement', 'ransomware_indicator'],
    timeWindowMs: 24 * 60 * 60 * 1000,
    name: 'Ransomware Progression',
    conclusion: 'Probable ransomware preparation chain with expanding blast radius.',
    coordinatedBehavior: true,
    nextLikelyStep: 'Mass encryption, shadow copy deletion, and service disruption.',
    stageLabels: ['Initial lure', 'Malware execution', 'Internal spread', 'Impact preparation'],
  },
  {
    signature: 'insider_exfiltration',
    requiredTypes: ['insider_threat', 'abnormal_badge_access', 'data_exfiltration'],
    timeWindowMs: 48 * 60 * 60 * 1000,
    name: 'Insider Data Exfiltration Pattern',
    conclusion: 'Behavior indicates likely insider-led data collection with exfiltration intent.',
    coordinatedBehavior: true,
    nextLikelyStep: 'Additional data staging, removable media usage, or off-network transfer.',
    stageLabels: ['Behavioral anomaly', 'Facility access anomaly', 'Exfiltration activity'],
  },
  {
    signature: 'coordinated_network_breach',
    requiredTypes: ['network_intrusion', 'privilege_escalation', 'data_exfiltration'],
    timeWindowMs: 18 * 60 * 60 * 1000,
    name: 'Coordinated Network Breach',
    conclusion: 'Network intrusion appears coordinated and mission-oriented toward data loss.',
    coordinatedBehavior: true,
    nextLikelyStep: 'Persistence hardening or destructive cleanup actions.',
    stageLabels: ['Network foothold', 'Privilege gain', 'Data extraction'],
  },
  {
    signature: 'physical_digital_pivot',
    requiredTypes: ['server_room_breach', 'network_intrusion', 'credential_theft'],
    timeWindowMs: 12 * 60 * 60 * 1000,
    name: 'Physical-to-Digital Pivot',
    conclusion: 'Physical breach likely enabled or accelerated digital compromise operations.',
    coordinatedBehavior: true,
    nextLikelyStep: 'Identity abuse or malware deployment from compromised internal systems.',
    stageLabels: ['Restricted physical access', 'Internal network pivot', 'Credential abuse'],
  },
];

export class ForensicReasoningEngine {
  analyze(
    events: ThreatEvent[],
    memories: MemoryEntry[] = [],
    investigations: Investigation[] = [],
  ): ForensicAnalysisResult {
    const recentEvents = [...events]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-600);

    const patternClusters = patternDefinitions
      .map((pattern) => this.findPatternCluster(pattern, recentEvents))
      .filter((cluster): cluster is ForensicCluster => cluster !== null);

    const behavioralClusters = this.buildBehavioralClusters(recentEvents);
    const clusters = [...patternClusters, ...behavioralClusters]
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, 10);

    const suspectTimelines = this.buildSuspectTimelines(recentEvents, clusters);
    const predictions = this.buildPredictions(clusters, suspectTimelines);
    const narratives = clusters.map((cluster) => this.toNarrative(cluster));
    const supportingMemories = this.selectSupportingMemories(memories, clusters);

    const topConclusion = clusters[0]?.conclusion
      ?? 'No high-confidence coordinated intrusion pattern identified in current telemetry window.';

    const overallConfidence = clusters.length > 0
      ? Math.round(clusters.reduce((sum, cluster) => sum + cluster.confidenceScore, 0) / clusters.length)
      : 54;

    return {
      generatedAt: new Date(),
      overallConfidence,
      topConclusion,
      clusters,
      suspectTimelines,
      predictions,
      narratives,
      supportingMemories,
      investigations,
    };
  }

  private findPatternCluster(pattern: PatternDefinition, events: ThreatEvent[]): ForensicCluster | null {
    const candidatesByType = pattern.requiredTypes.map((type) =>
      events
        .filter((event) => event.eventType === type)
        .slice(-18),
    );

    if (candidatesByType.some((group) => group.length === 0)) {
      return null;
    }

    let bestChain: ThreatEvent[] | null = null;
    let bestScore = -1;

    const search = (depth: number, selected: ThreatEvent[]) => {
      if (depth === candidatesByType.length) {
        const first = new Date(selected[0].timestamp).getTime();
        const last = new Date(selected[selected.length - 1].timestamp).getTime();
        if (last - first > pattern.timeWindowMs) return;

        const score = this.scoreChain(selected);
        if (score > bestScore) {
          bestScore = score;
          bestChain = [...selected];
        }
        return;
      }

      for (const event of candidatesByType[depth]) {
        if (selected.length > 0) {
          const prevTime = new Date(selected[selected.length - 1].timestamp).getTime();
          const nextTime = new Date(event.timestamp).getTime();
          if (nextTime < prevTime) continue;
        }

        selected.push(event);
        search(depth + 1, selected);
        selected.pop();
      }
    };

    search(0, []);

    if (!bestChain) return null;

    const links = this.buildLinks(bestChain);
    const confidenceScore = clamp(Math.round(bestScore), 55, 98);
    const futureAttackProbability = clamp(Math.round(confidenceScore * 0.82 + (pattern.coordinatedBehavior ? 10 : 0)), 30, 97);
    const suspectEntities = this.extractSuspectEntities(bestChain);
    const timeline = this.toTimeline(bestChain, pattern.stageLabels);
    const recommendedActions = this.recommendActions(pattern.signature, bestChain);
    const investigationSummary = this.buildInvestigationSummary(pattern, bestChain, confidenceScore);
    const forensicNarrative = this.buildNarrative(pattern, bestChain, confidenceScore);
    const behavioralExplanation = this.buildBehavioralExplanation(pattern, bestChain);

    return {
      id: uid('cluster'),
      signature: pattern.signature,
      name: pattern.name,
      conclusion: pattern.conclusion,
      investigationSummary,
      forensicNarrative,
      behavioralExplanation,
      coordinatedBehavior: pattern.coordinatedBehavior,
      confidenceScore,
      futureAttackProbability,
      suspectEntities,
      events: bestChain,
      links,
      timeline,
      recommendedActions,
      attackChainStages: pattern.stageLabels,
    };
  }

  private buildBehavioralClusters(events: ThreatEvent[]): ForensicCluster[] {
    const groups = new Map<string, ThreatEvent[]>();

    for (const event of events) {
      const key = event.user?.userId
        ? `user:${event.user.userId}`
        : event.device?.deviceId
          ? `device:${event.device.deviceId}`
          : null;

      if (!key) continue;
      const current = groups.get(key) ?? [];
      if (event.anomalyScore >= 65 || event.threatLevel === 'high' || event.threatLevel === 'critical') {
        current.push(event);
        groups.set(key, current);
      }
    }

    return Array.from(groups.entries())
      .filter(([, group]) => group.length >= 3)
      .map(([key, group]) => {
        const ordered = [...group]
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .slice(-5);
        const links = this.buildLinks(ordered);
        const avgAnomaly = ordered.reduce((sum, event) => sum + event.anomalyScore, 0) / ordered.length;
        const avgConfidence = ordered.reduce((sum, event) => sum + event.confidenceScore, 0) / ordered.length;
        const confidenceScore = clamp(Math.round(avgAnomaly * 0.45 + avgConfidence * 0.45 + ordered.length * 3), 58, 94);

        return {
          id: uid('cluster'),
          signature: 'behavioral_cluster' as const,
          name: `Behavioral Cluster • ${key}`,
          conclusion: 'Multiple related high-anomaly incidents suggest coordinated or persistent malicious behavior.',
          investigationSummary: `The subject associated with ${key} generated ${ordered.length} related high-risk events across a compressed time window, indicating elevated operational intent rather than isolated noise.`,
          forensicNarrative: `Observed telemetry suggests repeated deviation from established behavioral norms. The actor or asset associated with ${key} appears to move through an intentional sequence of actions that increases operational risk and indicates persistence or mission focus.`,
          behavioralExplanation: `The cluster combines repeated access anomalies, elevated anomaly scores, and multi-step event progression. This pattern is more consistent with deliberate operational behavior than accidental misuse.`,
          coordinatedBehavior: ordered.length >= 4,
          confidenceScore,
          futureAttackProbability: clamp(Math.round(confidenceScore * 0.78), 35, 92),
          suspectEntities: this.extractSuspectEntities(ordered),
          events: ordered,
          links,
          timeline: this.toTimeline(ordered),
          recommendedActions: [
            this.action('high', 'Escalate behavioral review', 'Correlate subject activity with access, endpoint, and data movement telemetry.', 'soc'),
            this.action('medium', 'Validate identity controls', 'Review MFA, badge, and privilege assignments for the subject.', 'identity'),
          ],
          attackChainStages: ['Behavioral spike', 'Multi-signal correlation', 'Escalation trigger'],
        };
      })
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, 4);
  }

  private buildSuspectTimelines(_events: ThreatEvent[], clusters: ForensicCluster[]): SuspectTimeline[] {
    const subjects = new Map<string, ThreatEvent[]>();

    for (const cluster of clusters) {
      for (const event of cluster.events) {
        if (event.user?.userId) {
          const key = `user:${event.user.userId}`;
          subjects.set(key, [...(subjects.get(key) ?? []), event]);
        } else if (event.device?.deviceId) {
          const key = `device:${event.device.deviceId}`;
          subjects.set(key, [...(subjects.get(key) ?? []), event]);
        }
      }
    }

    return Array.from(subjects.entries())
      .map(([key, subjectEvents]) => {
        const ordered = [...subjectEvents].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const first = ordered[0];
        const isUser = key.startsWith('user:');
        const riskScore = clamp(Math.round(
          ordered.reduce((sum, event) => sum + event.anomalyScore, 0) / ordered.length * 0.55
          + ordered.length * 7,
        ), 35, 98);

        return {
          id: uid('suspect'),
          subjectType: (isUser ? 'user' : 'device') as 'user' | 'device',
          subjectId: key.split(':')[1],
          subjectLabel: isUser
            ? first.user?.username ?? key
            : first.device?.hostname ?? first.device?.deviceId ?? key,
          riskScore,
          explanation: this.buildSuspectExplanation(ordered, riskScore),
          events: ordered,
          timeline: this.toTimeline(ordered),
          likelyIntent: this.buildLikelyIntent(ordered),
        };
      })
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 6);
  }

  private buildPredictions(clusters: ForensicCluster[], suspectTimelines: SuspectTimeline[]): FutureAttackPrediction[] {
    const predictions: FutureAttackPrediction[] = [];

    for (const cluster of clusters.slice(0, 6)) {
      predictions.push({
        id: uid('pred'),
        clusterId: cluster.id,
        title: cluster.name,
        probability: cluster.futureAttackProbability,
        nextLikelyStep: this.predictNextStep(cluster),
        rationale: `Prediction derived from ${cluster.events.length} correlated incidents, ${cluster.links.length} supporting relations, and a ${cluster.confidenceScore}% forensic confidence score.`,
        estimatedWindow: this.predictionWindow(cluster.futureAttackProbability),
      });
    }

    if (predictions.length === 0 && suspectTimelines.length > 0) {
      const top = suspectTimelines[0];
      predictions.push({
        id: uid('pred'),
        clusterId: 'timeline-fallback',
        title: `Escalation watch • ${top.subjectLabel}`,
        probability: clamp(top.riskScore, 35, 88),
        nextLikelyStep: 'Additional anomalous access or covert data movement.',
        rationale: `No complete attack chain was detected, but the suspect timeline indicates elevated intent and repeated deviation from normal behavior.`,
        estimatedWindow: 'Within 4–12 hours',
      });
    }

    return predictions.sort((a, b) => b.probability - a.probability).slice(0, 6);
  }

  private toNarrative(cluster: ForensicCluster): ForensicNarrativeRecord {
    return {
      id: uid('narr'),
      clusterId: cluster.id,
      headline: cluster.conclusion,
      executiveSummary: cluster.investigationSummary,
      detailedNarrative: cluster.forensicNarrative,
      recommendedActions: cluster.recommendedActions,
    };
  }

  private selectSupportingMemories(memories: MemoryEntry[], clusters: ForensicCluster[]): MemoryEntry[] {
    const clusterTags = new Set(clusters.flatMap((cluster) => cluster.events.flatMap((event) => event.tags)));

    return memories
      .filter((memory) => memory.tags.some((tag) => clusterTags.has(tag)) || memory.confidence >= 80)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 12);
  }

  private scoreChain(chain: ThreatEvent[]): number {
    const avgAnomaly = chain.reduce((sum, event) => sum + event.anomalyScore, 0) / chain.length;
    const avgConfidence = chain.reduce((sum, event) => sum + event.confidenceScore, 0) / chain.length;
    const evidenceDensity = chain.reduce((sum, event) => sum + event.evidence.length, 0) / chain.length;

    const sharedUser = this.sharedValueCount(chain.map((event) => event.user?.userId).filter(Boolean) as string[]);
    const sharedDevice = this.sharedValueCount(chain.map((event) => event.device?.deviceId).filter(Boolean) as string[]);
    const sharedCity = this.sharedValueCount(chain.map((event) => event.geolocation?.city).filter(Boolean) as string[]);

    const relationBonus = chain.reduce((sum, event) => sum + event.relatedEvents.length, 0);

    return avgAnomaly * 0.42
      + avgConfidence * 0.38
      + evidenceDensity * 1.7
      + sharedUser * 7
      + sharedDevice * 6
      + sharedCity * 3
      + relationBonus * 0.9;
  }

  private buildLinks(events: ThreatEvent[]): CorrelationLink[] {
    const links: CorrelationLink[] = [];

    for (let i = 0; i < events.length - 1; i++) {
      const from = events[i];
      const to = events[i + 1];
      const reasons: string[] = [];
      let score = 40;

      if (from.user?.userId && to.user?.userId && from.user.userId === to.user.userId) {
        reasons.push('Shared user identity');
        score += 18;
      }
      if (from.device?.deviceId && to.device?.deviceId && from.device.deviceId === to.device.deviceId) {
        reasons.push('Shared device');
        score += 16;
      }
      if (from.geolocation?.city && to.geolocation?.city && from.geolocation.city === to.geolocation.city) {
        reasons.push('Common location context');
        score += 10;
      }
      if (from.relatedEvents.includes(to.id) || to.relatedEvents.includes(from.id)) {
        reasons.push('Explicit event relationship');
        score += 14;
      }
      if (reasons.length === 0) {
        reasons.push('Temporal progression suggests operational continuity');
      }

      links.push({
        id: uid('link'),
        fromEventId: from.id,
        toEventId: to.id,
        score: clamp(score, 30, 95),
        reasons,
      });
    }

    return links;
  }

  private toTimeline(events: ThreatEvent[], stageLabels?: string[]): ThreatTimelineEntry[] {
    return events.map((event, index) => ({
      id: uid('tle'),
      eventId: event.id,
      timestamp: new Date(event.timestamp),
      label: stageLabels?.[index] ?? event.title,
      eventType: event.eventType,
      severity: event.threatLevel,
      explanation: `${event.eventType.replace(/_/g, ' ')} observed with anomaly score ${event.anomalyScore} and confidence ${event.confidenceScore}%.`,
    }));
  }

  private extractSuspectEntities(events: ThreatEvent[]): string[] {
    const entities = new Set<string>();

    for (const event of events) {
      if (event.user?.username) entities.add(`User: ${event.user.username}`);
      if (event.device?.hostname) entities.add(`Device: ${event.device.hostname}`);
      if (event.geolocation?.city) entities.add(`Location: ${event.geolocation.city}`);
    }

    return Array.from(entities).slice(0, 6);
  }

  private buildInvestigationSummary(pattern: PatternDefinition, events: ThreatEvent[], confidence: number): string {
    const first = events[0];
    const last = events[events.length - 1];
    const durationHours = Math.max(1, Math.round((new Date(last.timestamp).getTime() - new Date(first.timestamp).getTime()) / (1000 * 60 * 60)));

    return `${pattern.name} was identified across ${events.length} related incidents spanning approximately ${durationHours} hour(s). Correlation confidence is ${confidence}%, driven by consistent temporal ordering, shared entities, and supporting forensic indicators.`;
  }

  private buildNarrative(pattern: PatternDefinition, events: ThreatEvent[], confidence: number): string {
    const physicalSignals = events.filter((event) => event.category === 'physical').length;
    const cyberSignals = events.filter((event) => event.category === 'cyber' || event.category === 'combined').length;
    const insiderSignals = events.filter((event) => event.category === 'insider').length;

    return `${pattern.conclusion} The sequence begins with ${events[0].eventType.replace(/_/g, ' ')}, progresses through ${events.slice(1).map((event) => event.eventType.replace(/_/g, ' ')).join(', ')}, and culminates in a pattern that aligns with ${pattern.name.toLowerCase()}. The evidence mix includes ${physicalSignals} physical, ${cyberSignals} cyber, and ${insiderSignals} insider-oriented signals. Taken together, this indicates a context-aware, potentially coordinated operation with ${confidence}% assessed confidence.`;
  }

  private buildBehavioralExplanation(pattern: PatternDefinition, events: ThreatEvent[]): string {
    const outsideHours = events.some((event) => {
      const hour = new Date(event.timestamp).getHours();
      return hour < 6 || hour > 21;
    });
    const sharedIdentity = this.sharedValueCount(events.map((event) => event.user?.userId).filter(Boolean) as string[]) > 0;
    const repeatedLocation = this.sharedValueCount(events.map((event) => event.geolocation?.city).filter(Boolean) as string[]) > 0;

    const fragments = [
      `The chain is explainable because each incident advances the previous one rather than occurring as isolated noise.`,
      sharedIdentity
        ? `A shared identity context appears across multiple events, strengthening attribution confidence.`
        : `No singular identity appears across all events, suggesting coordination through shared objectives rather than a single actor alone.`,
      repeatedLocation
        ? `Location overlap reinforces the likelihood of operational continuity.`
        : `Location diversity suggests a distributed or pivoting operating pattern.`,
      outsideHours
        ? `Timing includes off-hours activity, which increases suspicion of deliberate concealment or opportunistic execution.`
        : `Timing remains within a compressed operational window, which is consistent with mission-driven sequencing.`,
      pattern.coordinatedBehavior
        ? `The event progression is more consistent with coordinated intent than accidental misuse.`
        : `The progression warrants continued watch due to behavioral escalation even if full coordination is not yet proven.`,
    ];

    return fragments.join(' ');
  }

  private buildSuspectExplanation(events: ThreatEvent[], riskScore: number): string {
    const categories = Array.from(new Set(events.map((event) => event.category)));
    return `This subject accumulated ${events.length} linked events across ${categories.join(', ')} telemetry with a derived risk score of ${riskScore}. The sequence combines elevated anomaly signals, repeat activity, and contextual continuity that exceeds normal operational drift.`;
  }

  private buildLikelyIntent(events: ThreatEvent[]): string {
    const types = new Set(events.map((event) => event.eventType));
    if (types.has('data_exfiltration')) return 'Data theft or covert staging.';
    if (types.has('server_room_breach')) return 'Restricted physical access supporting later digital exploitation.';
    if (types.has('ransomware_indicator')) return 'Disruption and extortion through operational impact.';
    if (types.has('lateral_movement')) return 'Internal expansion and privilege consolidation.';
    return 'Reconnaissance and escalation of access opportunities.';
  }

  private predictNextStep(cluster: ForensicCluster): string {
    if (cluster.signature === 'insider_assisted_intrusion') return 'Credential theft, internal staging, or a controlled pivot into network assets.';
    if (cluster.signature === 'credential_compromise_chain') return 'Privilege escalation or sensitive data staging on adjacent infrastructure.';
    if (cluster.signature === 'ransomware_progression') return 'Broad encryption activity and service disruption across shared assets.';
    if (cluster.signature === 'insider_exfiltration') return 'Secondary export channel activation or removable media transfer.';
    if (cluster.signature === 'coordinated_network_breach') return 'Persistence reinforcement or anti-forensic cleanup.';
    if (cluster.signature === 'physical_digital_pivot') return 'Malware drop, identity abuse, or management-plane takeover.';
    return 'Additional correlated anomalous behavior within the same subject context.';
  }

  private predictionWindow(probability: number): string {
    if (probability >= 85) return 'Within 1–4 hours';
    if (probability >= 70) return 'Within 4–12 hours';
    if (probability >= 55) return 'Within 12–24 hours';
    return 'Within 24–72 hours';
  }

  private recommendActions(signature: ForensicPatternSignature, _events: ThreatEvent[]): RecommendedAction[] {
    const actions: RecommendedAction[] = [];

    if (signature === 'insider_assisted_intrusion') {
      actions.push(
        this.action('immediate', 'Lock down physical access perimeter', 'Disable suspect badges, review CCTV, and harden access checkpoints around restricted zones.', 'physical_security'),
        this.action('high', 'Quarantine server room-adjacent assets', 'Isolate any systems recently accessed from the breached location to prevent digital pivoting.', 'ir'),
      );
    }

    if (signature === 'credential_compromise_chain' || signature === 'coordinated_network_breach') {
      actions.push(
        this.action('immediate', 'Reset impacted credentials', 'Force-reset accounts linked to the chain and revoke active sessions.', 'identity'),
        this.action('high', 'Expand lateral movement hunt', 'Query adjacent hosts, shares, and privileged accounts for similar patterns.', 'soc'),
      );
    }

    if (signature === 'ransomware_progression') {
      actions.push(
        this.action('immediate', 'Segment affected network zones', 'Prevent east-west spread and preserve unaffected shared storage.', 'ir'),
        this.action('high', 'Protect backup integrity', 'Verify backup immutability and monitor for deletion or corruption attempts.', 'leadership'),
      );
    }

    if (signature === 'insider_exfiltration' || signature === 'behavioral_cluster') {
      actions.push(
        this.action('high', 'Review user and device behavior', 'Compare current telemetry against baseline, HR status, and access entitlements.', 'soc'),
        this.action('medium', 'Preserve evidence chain', 'Retain logs, endpoint telemetry, badge records, and network flows for legal review.', 'ir'),
      );
    }

    if (actions.length === 0) {
      actions.push(this.action('medium', 'Escalate for analyst review', 'Assign the cluster to a human analyst for targeted triage and validation.', 'soc'));
    }

    return actions.slice(0, 4);
  }

  private action(
    priority: RecommendedAction['priority'],
    title: string,
    description: string,
    owner: RecommendedAction['owner'],
  ): RecommendedAction {
    return { id: uid('action'), priority, title, description, owner };
  }

  private sharedValueCount(values: string[]): number {
    const counts = new Map<string, number>();
    for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
    return Array.from(counts.values()).filter((count) => count >= 2).length;
  }
}
