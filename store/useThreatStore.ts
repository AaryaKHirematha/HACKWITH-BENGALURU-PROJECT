/**
 * Threat Store
 * Threat intelligence state management using Zustand
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ThreatState, ThreatFilters, ThreatSortField } from './types';
import type { ThreatEvent } from '@/types';

const defaultFilters: ThreatFilters = {
  severity: [],
  status: [],
  dateRange: {
    start: null,
    end: null,
  },
  searchQuery: '',
  tags: [],
};

export const useThreatStore = create<ThreatState>()(
  devtools(
    (set) => ({
      // Initial state
      threats: [],
      selectedThreatId: null,
      filters: { ...defaultFilters },
      sortBy: 'createdAt',
      sortDirection: 'desc',

      // Actions
      setThreats: (threats: ThreatEvent[]) => 
        set({ threats }),

      addThreat: (threat: ThreatEvent) => 
        set((state) => ({ 
          threats: [threat, ...state.threats] 
        })),

      updateThreat: (id: string, updates: Partial<ThreatEvent>) => 
        set((state) => ({
          threats: state.threats.map((t) => 
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      removeThreat: (id: string) => 
        set((state) => ({
          threats: state.threats.filter((t) => t.id !== id),
          selectedThreatId: state.selectedThreatId === id ? null : state.selectedThreatId,
        })),

      selectThreat: (id: string | null) => 
        set({ selectedThreatId: id }),

      setFilters: (filterUpdates: Partial<ThreatFilters>) => 
        set((state) => ({
          filters: { ...state.filters, ...filterUpdates },
        })),

      resetFilters: () => 
        set({ filters: { ...defaultFilters } }),

      setSort: (field: ThreatSortField, direction: 'asc' | 'desc') => 
        set({ sortBy: field, sortDirection: direction }),
    }),
    { name: 'ThreatStore' }
  )
);

// Selectors for computed values
export const selectFilteredThreats = (state: ThreatState) => {
  const { threats, filters, sortBy, sortDirection } = state;
  
  let filtered = [...threats];

  // Apply severity filter
  if (filters.severity.length > 0) {
    filtered = filtered.filter((t) => 
      filters.severity.includes(t.severity)
    );
  }

  // Apply status filter
  if (filters.status.length > 0) {
    filtered = filtered.filter((t) => 
      filters.status.includes(t.status)
    );
  }

  // Apply search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter((t) => 
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Apply tag filter
  if (filters.tags.length > 0) {
    filtered = filtered.filter((t) => 
      filters.tags.some((tag) => t.tags.includes(tag))
    );
  }

  // Apply date range filter
  if (filters.dateRange.start) {
    filtered = filtered.filter((t) => 
      new Date(t.createdAt) >= filters.dateRange.start!
    );
  }
  if (filters.dateRange.end) {
    filtered = filtered.filter((t) => 
      new Date(t.createdAt) <= filters.dateRange.end!
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'severity': {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
        comparison = severityOrder[a.severity] - severityOrder[b.severity];
        break;
      }
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }
    
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  return filtered;
};

export const selectThreatStats = (state: ThreatState) => {
  const { threats } = state;
  return {
    total: threats.length,
    critical: threats.filter((t) => t.severity === 'critical').length,
    high: threats.filter((t) => t.severity === 'high').length,
    medium: threats.filter((t) => t.severity === 'medium').length,
    low: threats.filter((t) => t.severity === 'low').length,
    info: threats.filter((t) => t.severity === 'info').length,
    active: threats.filter((t) => 
      !['mitigated', 'false_positive'].includes(t.status)
    ).length,
    mitigated: threats.filter((t) => t.status === 'mitigated').length,
  };
};
