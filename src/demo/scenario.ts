/**
 * Demo Scenario Builder
 * Builds a cinematic replay sequence from the existing simulated event pool.
 */

import type { ThreatEvent, EventType } from '@/simulation/types';
import type { DemoBeat, DemoSequence } from './types';

const uid = (prefix: string): string => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

function latestOfType(events: ThreatEvent[], type: EventType): ThreatEvent | null {
  return [...events]
    .filter((event) => event.eventType === type)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] ?? null;
}

function latestFallback(events: ThreatEvent[]): ThreatEvent | null {
  return [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] ?? null;
}

function eventOrFallback(events: ThreatEvent[], type: EventType): ThreatEvent | null {
  return latestOfType(events, type) ?? latestFallback(events);
}

export function buildCinematicSequence(events: ThreatEvent[]): DemoSequence {
  const suspiciousVehicle = eventOrFallback(events, 'suspicious_vehicle');
  const badgeAccess = eventOrFallback(events, 'abnormal_badge_access');
  const serverRoom = eventOrFallback(events, 'server_room_breach');
  const login = eventOrFallback(events, 'unauthorized_login');
  const network = eventOrFallback(events, 'network_intrusion');
  const lateral = eventOrFallback(events, 'lateral_movement');
  const exfil = eventOrFallback(events, 'data_exfiltration');
  const ransomware = eventOrFallback(events, 'ransomware_indicator');

  const beats: DemoBeat[] = [
    {
      id: uid('beat'),
      title: 'Perimeter anomaly detected',
      subtitle: 'A suspicious vehicle lingers outside the restricted access zone.',
      stage: 'ingest',
      spotlight: 'incident_feed',
      event: suspiciousVehicle,
      narrativeSeed: 'Initial telemetry suggests low-visibility reconnaissance at the physical perimeter.',
      systemReaction: 'Threat detection classifies the signal as early-stage reconnaissance and opens low-latency triage.',
      cinematicLabel: 'Signal ingress',
    },
    {
      id: uid('beat'),
      title: 'Access control drift emerges',
      subtitle: 'An abnormal badge access event appears outside expected behavioral windows.',
      stage: 'physical',
      spotlight: 'timeline',
      event: badgeAccess,
      narrativeSeed: 'Physical anomalies begin to align around a shared window of opportunity.',
      systemReaction: 'Hindsight memory attaches the access anomaly to the perimeter signal and raises coordinated-risk weighting.',
      cinematicLabel: 'Behavioral shift',
    },
    {
      id: uid('beat'),
      title: 'Restricted-area breach',
      subtitle: 'Server room telemetry confirms a high-risk physical intrusion.',
      stage: 'breach',
      spotlight: 'forensics',
      event: serverRoom,
      narrativeSeed: 'The sequence pivots from reconnaissance into direct physical compromise.',
      systemReaction: 'Forensic correlation crosses the threshold for insider-assisted intrusion analysis.',
      cinematicLabel: 'Critical breach',
    },
    {
      id: uid('beat'),
      title: 'Digital foothold established',
      subtitle: 'Unauthorized identity activity follows the physical breach window.',
      stage: 'pivot',
      spotlight: 'routing',
      event: login,
      narrativeSeed: 'The attacker transitions from physical access into credential or session abuse.',
      systemReaction: 'CascadeFlow escalates from Tier 1 triage to advanced reasoning due to identity compromise signals.',
      cinematicLabel: 'Identity pivot',
    },
    {
      id: uid('beat'),
      title: 'Internal propagation begins',
      subtitle: 'Network intrusion indicators and lateral behaviors expand the blast radius.',
      stage: 'correlation',
      spotlight: 'agents',
      event: network ?? lateral,
      narrativeSeed: 'The intrusion now behaves like an operational campaign rather than an isolated breach.',
      systemReaction: 'Correlation, investigation, and reflection agents synchronize around a shared task chain.',
      cinematicLabel: 'Propagation',
    },
    {
      id: uid('beat'),
      title: 'Memory adapts in real time',
      subtitle: 'Shared memory captures recurring entities, timing, and infrastructure overlap.',
      stage: 'memory',
      spotlight: 'memory',
      event: lateral,
      narrativeSeed: 'Long-term memory begins to transform tactical signals into reusable operational knowledge.',
      systemReaction: 'The Hindsight memory graph evolves, reinforcing cross-event identity, location, and behavior patterns.',
      cinematicLabel: 'Memory evolution',
    },
    {
      id: uid('beat'),
      title: 'Adaptive cost control engages',
      subtitle: 'Inference pathways are compressed while high-value reasoning remains intact.',
      stage: 'optimization',
      spotlight: 'cost',
      event: exfil,
      narrativeSeed: 'The system balances urgency, latency, and spend without degrading analytical fidelity.',
      systemReaction: 'Cost optimization reroutes low-value inference to cheaper models while preserving frontier analysis for high-risk steps.',
      cinematicLabel: 'Efficiency shift',
    },
    {
      id: uid('beat'),
      title: 'Forensic conclusion synthesized',
      subtitle: 'The system generates an explainable intrusion narrative and predicts next steps.',
      stage: 'forensics',
      spotlight: 'forensics',
      event: ransomware ?? exfil,
      narrativeSeed: 'The final picture resolves into an explainable, context-aware campaign narrative.',
      systemReaction: 'Potential coordinated insider-assisted intrusion detected. Future attack probability and containment actions are issued.',
      cinematicLabel: 'Explainable verdict',
    },
    {
      id: uid('beat'),
      title: 'Autonomous defense posture',
      subtitle: 'The replay closes with synchronized routing, memory, agent, and forensic outputs.',
      stage: 'resolution',
      spotlight: 'routing',
      event: ransomware,
      narrativeSeed: 'The platform demonstrates end-to-end autonomous adaptation under pressure.',
      systemReaction: 'Investigation replay complete. Command Center remains ready for immediate reactivation.',
      cinematicLabel: 'Mission complete',
    },
  ];

  return {
    id: uid('sequence'),
    title: 'Operation Glass Shadow',
    tagline: 'A cinematic replay of autonomous cyber-physical defense intelligence.',
    beats,
  };
}
