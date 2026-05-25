/**
 * Dashboard Store
 * Dashboard configuration and widget state management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DashboardState } from './types';
import type { DashboardWidget } from '@/types';

// Default dashboard widgets configuration
const defaultWidgets: DashboardWidget[] = [
  {
    id: 'threat-summary',
    type: 'threat_summary',
    title: 'Threat Summary',
    size: 'lg',
    position: { x: 0, y: 0, w: 2, h: 1 },
    config: { showChart: true },
    refreshInterval: 30000,
  },
  {
    id: 'severity-dist',
    type: 'severity_distribution',
    title: 'Severity Distribution',
    size: 'md',
    position: { x: 2, y: 0, w: 1, h: 1 },
    config: { chartType: 'donut' },
    refreshInterval: 60000,
  },
  {
    id: 'agent-status',
    type: 'agent_status',
    title: 'Agent Status',
    size: 'md',
    position: { x: 0, y: 1, w: 1, h: 1 },
    config: { showPerformance: true },
  },
  {
    id: 'recent-events',
    type: 'recent_events',
    title: 'Recent Events',
    size: 'lg',
    position: { x: 1, y: 1, w: 2, h: 1 },
    config: { maxItems: 10 },
  },
  {
    id: 'ioc-feed',
    type: 'ioc_feed',
    title: 'IoC Feed',
    size: 'md',
    position: { x: 0, y: 2, w: 1, h: 1 },
    config: { feedType: 'all' },
  },
  {
    id: 'metrics',
    type: 'metrics',
    title: 'System Metrics',
    size: 'md',
    position: { x: 1, y: 2, w: 2, h: 1 },
    config: { timeframe: '24h' },
  },
];

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      widgets: defaultWidgets,
      layout: 'default',
      lastRefresh: null,

      setWidgets: (widgets: DashboardWidget[]) => 
        set({ widgets }),

      updateWidget: (id: string, updates: Partial<DashboardWidget>) => 
        set((state) => ({
          widgets: state.widgets.map((w) => 
            w.id === id ? { ...w, ...updates } : w
          ),
        })),

      addWidget: (widget: DashboardWidget) => 
        set((state) => ({
          widgets: [...state.widgets, widget],
        })),

      removeWidget: (id: string) => 
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),

      refreshDashboard: () => 
        set({ lastRefresh: new Date() }),
    }),
    { name: 'DashboardStore' }
  )
);
