/**
 * Simulation Store
 * Manages threat simulation state and event data
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ThreatEvent, SimulationConfig, EventFilter, PaginationParams, EventStatistics } from '../types';
import { EventGenerator, defaultConfig } from '../generator/EventGenerator';

// ============================================================
// STORE TYPES
// ============================================================

interface SimulationState {
  // Data
  events: ThreatEvent[];
  filteredEvents: ThreatEvent[];
  selectedEvent: ThreatEvent | null;
  
  // Configuration
  config: SimulationConfig;
  
  // Filters & Pagination
  filters: EventFilter;
  pagination: PaginationParams;
  totalCount: number;
  
  // UI State
  isGenerating: boolean;
  isLoaded: boolean;
  lastRefresh: Date | null;
  
  // Actions
  setConfig: (config: Partial<SimulationConfig>) => void;
  generateEvents: () => Promise<void>;
  setEvents: (events: ThreatEvent[]) => void;
  addEvent: (event: ThreatEvent) => void;
  updateEvent: (id: string, updates: Partial<ThreatEvent>) => void;
  removeEvent: (id: string) => void;
  selectEvent: (event: ThreatEvent | null) => void;
  
  // Filters
  setFilters: (filters: Partial<EventFilter>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  
  // Pagination
  setPagination: (pagination: Partial<PaginationParams>) => void;
  getPageEvents: () => ThreatEvent[];
  
  // Statistics
  getStatistics: () => EventStatistics;
  
  // Real-time simulation
  addRandomEvent: () => void;
  refreshData: () => void;
}

// ============================================================
// DEFAULT FILTER
// ============================================================

const defaultFilters: EventFilter = {
  eventTypes: [],
  threatLevels: [],
  statuses: [],
  categories: [],
  sourceTypes: [],
  searchQuery: '',
  minAnomalyScore: undefined,
  maxAnomalyScore: undefined,
  tags: [],
};

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useSimulationStore = create<SimulationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      events: [],
      filteredEvents: [],
      selectedEvent: null,
      config: { ...defaultConfig },
      filters: { ...defaultFilters },
      pagination: {
        page: 1,
        pageSize: 25,
        sortBy: 'timestamp',
        sortOrder: 'desc',
      },
      totalCount: 0,
      isGenerating: false,
      isLoaded: false,
      lastRefresh: null,

      // Set configuration
      setConfig: (configUpdates) => 
        set((state) => ({
          config: { ...state.config, ...configUpdates },
        })),

      // Generate events
      generateEvents: async () => {
        const { config } = get();
        set({ isGenerating: true });
        
        try {
          const generator = new EventGenerator(config);
          const events = await generator.generateEvents();
          
          set({
            events,
            filteredEvents: events,
            totalCount: events.length,
            isGenerating: false,
            isLoaded: true,
            lastRefresh: new Date(),
          });
        } catch (error) {
          console.error('[SimulationStore] Error generating events:', error);
          set({ isGenerating: false });
        }
      },

      // Set events directly
      setEvents: (events) => 
        set({
          events,
          filteredEvents: events,
          totalCount: events.length,
        }),

      // Add single event
      addEvent: (event) => 
        set((state) => ({
          events: [event, ...state.events],
          filteredEvents: [event, ...state.filteredEvents],
          totalCount: state.totalCount + 1,
        })),

      // Update event
      updateEvent: (id, updates) => 
        set((state) => {
          const updateEventList = (events: ThreatEvent[]) =>
            events.map((e) => (e.id === id ? { ...e, ...updates } : e));
          
          return {
            events: updateEventList(state.events),
            filteredEvents: updateEventList(state.filteredEvents),
          };
        }),

      // Remove event
      removeEvent: (id) => 
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
          filteredEvents: state.filteredEvents.filter((e) => e.id !== id),
          totalCount: state.totalCount - 1,
          selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent,
        })),

      // Select event
      selectEvent: (event) => 
        set({ selectedEvent: event }),

      // Set filters
      setFilters: (filterUpdates) => {
        set((state) => ({
          filters: { ...state.filters, ...filterUpdates },
        }));
        get().applyFilters();
      },

      // Reset filters
      resetFilters: () => {
        set({ filters: { ...defaultFilters } });
        get().applyFilters();
      },

      // Apply filters
      applyFilters: () => {
        const { events, filters, pagination } = get();
        let filtered = [...events];

        // Apply event type filter
        if (filters.eventTypes && filters.eventTypes.length > 0) {
          filtered = filtered.filter((e) => filters.eventTypes!.includes(e.eventType));
        }

        // Apply threat level filter
        if (filters.threatLevels && filters.threatLevels.length > 0) {
          filtered = filtered.filter((e) => filters.threatLevels!.includes(e.threatLevel));
        }

        // Apply status filter
        if (filters.statuses && filters.statuses.length > 0) {
          filtered = filtered.filter((e) => filters.statuses!.includes(e.status));
        }

        // Apply category filter
        if (filters.categories && filters.categories.length > 0) {
          filtered = filtered.filter((e) => filters.categories!.includes(e.category));
        }

        // Apply source type filter
        if (filters.sourceTypes && filters.sourceTypes.length > 0) {
          filtered = filtered.filter((e) => filters.sourceTypes!.includes(e.sourceType));
        }

        // Apply search query
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter((e) =>
            e.title.toLowerCase().includes(query) ||
            e.description.toLowerCase().includes(query) ||
            e.aiSummary.toLowerCase().includes(query) ||
            e.eventId.toLowerCase().includes(query) ||
            e.tags.some((t) => t.toLowerCase().includes(query))
          );
        }

        // Apply anomaly score filter
        if (filters.minAnomalyScore !== undefined) {
          filtered = filtered.filter((e) => e.anomalyScore >= filters.minAnomalyScore!);
        }
        if (filters.maxAnomalyScore !== undefined) {
          filtered = filtered.filter((e) => e.anomalyScore <= filters.maxAnomalyScore!);
        }

        // Apply tags filter
        if (filters.tags && filters.tags.length > 0) {
          filtered = filtered.filter((e) =>
            filters.tags!.some((t) => e.tags.includes(t))
          );
        }

        // Apply date range filter
        if (filters.dateRange) {
          filtered = filtered.filter((e) => {
            const eventDate = new Date(e.timestamp);
            if (filters.dateRange!.start && eventDate < filters.dateRange!.start) return false;
            if (filters.dateRange!.end && eventDate > filters.dateRange!.end) return false;
            return true;
          });
        }

        // Apply sorting
        if (pagination.sortBy) {
          filtered.sort((a, b) => {
            let aVal = a[pagination.sortBy as keyof ThreatEvent];
            let bVal = b[pagination.sortBy as keyof ThreatEvent];
            
            // Convert to comparable values
            let aComparable: string | number = 0;
            let bComparable: string | number = 0;
            
            if (aVal instanceof Date) {
              aComparable = aVal.getTime();
            } else if (typeof aVal === 'string') {
              aComparable = aVal.toLowerCase();
            } else if (typeof aVal === 'number') {
              aComparable = aVal;
            }
            
            if (bVal instanceof Date) {
              bComparable = bVal.getTime();
            } else if (typeof bVal === 'string') {
              bComparable = bVal.toLowerCase();
            } else if (typeof bVal === 'number') {
              bComparable = bVal;
            }
            
            if (aComparable < bComparable) return pagination.sortOrder === 'asc' ? -1 : 1;
            if (aComparable > bComparable) return pagination.sortOrder === 'asc' ? 1 : -1;
            return 0;
          });
        }

        set({
          filteredEvents: filtered,
          totalCount: filtered.length,
          pagination: { ...pagination, page: 1 },
        });
      },

      // Set pagination
      setPagination: (paginationUpdates) => 
        set((state) => ({
          pagination: { ...state.pagination, ...paginationUpdates },
        })),

      // Get paginated events
      getPageEvents: () => {
        const { filteredEvents, pagination } = get();
        const { page, pageSize } = pagination;
        const start = (page - 1) * pageSize;
        return filteredEvents.slice(start, start + pageSize);
      },

      // Get statistics
      getStatistics: () => {
        const { filteredEvents } = get();
        
        const byThreatLevel = { info: 0, low: 0, medium: 0, high: 0, critical: 0 };
        const byEventType: Record<string, number> = {};
        const byCategory = { cyber: 0, physical: 0, insider: 0, combined: 0 };
        const byStatus = { new: 0, investigating: 0, confirmed: 0, mitigated: 0, false_positive: 0, escalated: 0 };
        const bySource: Record<string, number> = {};
        const tagCounts: Record<string, number> = {};

        filteredEvents.forEach((event) => {
          byThreatLevel[event.threatLevel]++;
          byEventType[event.eventType] = (byEventType[event.eventType] || 0) + 1;
          byCategory[event.category]++;
          byStatus[event.status]++;
          bySource[event.sourceType] = (bySource[event.sourceType] || 0) + 1;
          event.tags.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        });

        const topTags = Object.entries(tagCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([tag, count]) => ({ tag, count }));

        return {
          totalEvents: filteredEvents.length,
          byThreatLevel,
          byEventType: byEventType as EventStatistics['byEventType'],
          byCategory,
          byStatus,
          bySource: bySource as EventStatistics['bySource'],
          averageAnomalyScore: filteredEvents.length > 0
            ? filteredEvents.reduce((sum, e) => sum + e.anomalyScore, 0) / filteredEvents.length
            : 0,
          averageConfidenceScore: filteredEvents.length > 0
            ? filteredEvents.reduce((sum, e) => sum + e.confidenceScore, 0) / filteredEvents.length
            : 0,
          topTags,
          timeline: [],
          campaigns: new Set(filteredEvents.filter((e) => e.campaign).map((e) => e.campaign?.campaignId)).size,
        };
      },

      // Add random event (for real-time simulation)
      addRandomEvent: () => {
        const { events } = get();
        if (events.length === 0) return;
        
        // Pick a random existing event and create a variant
        const baseEvent = events[Math.floor(Math.random() * events.length)];
        const newEvent: ThreatEvent = {
          ...baseEvent,
          id: crypto.randomUUID(),
          eventId: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          timestamp: new Date(),
          receivedAt: new Date(),
          status: 'new',
        };
        
        get().addEvent(newEvent);
      },

      // Refresh data
      refreshData: () => {
        set({ lastRefresh: new Date() });
        get().applyFilters();
      },
    }),
    { name: 'SimulationStore' }
  )
);
