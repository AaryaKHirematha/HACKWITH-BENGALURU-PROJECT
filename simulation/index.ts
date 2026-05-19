/**
 * Simulation Module Index
 * Central export point for simulation engine
 */

// Types
export type * from './types';

// Generator
export { EventGenerator, defaultConfig, getEventGenerator } from './generator/EventGenerator';

// Store
export { useSimulationStore } from './store/useSimulationStore';

// Data (for reference)
export * from './data/realisticData';
