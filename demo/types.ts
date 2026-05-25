/**
 * Demo Experience Types
 * Phase 8 — cinematic autonomous AI showcase.
 */

import type { ThreatEvent } from '@/simulation/types';

export type DemoBeatStage =
  | 'ingest'
  | 'physical'
  | 'breach'
  | 'pivot'
  | 'correlation'
  | 'memory'
  | 'optimization'
  | 'forensics'
  | 'resolution';

export type DemoSpotlightModule =
  | 'incident_feed'
  | 'routing'
  | 'memory'
  | 'agents'
  | 'cost'
  | 'forensics'
  | 'timeline';

export interface DemoBeat {
  id: string;
  title: string;
  subtitle: string;
  stage: DemoBeatStage;
  spotlight: DemoSpotlightModule;
  event: ThreatEvent | null;
  narrativeSeed: string;
  systemReaction: string;
  cinematicLabel: string;
}

export interface DemoSequence {
  id: string;
  title: string;
  tagline: string;
  beats: DemoBeat[];
}
