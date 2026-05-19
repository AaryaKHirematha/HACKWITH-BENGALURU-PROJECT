/**
 * Store Types
 * Type definitions for Zustand state management
 */

import type { 
  ThreatEvent, 
  ThreatSeverity, 
  AIAgent, 
  DashboardWidget,
  IntelligenceFeed,
  WebSocketState,
  UserPreferences
} from '@/types';

// ============================================================
// APP STORE STATE
// ============================================================

export interface AppState {
  // UI State
  sidebarExpanded: boolean;
  sidebarWidth: number;
  theme: 'dark' | 'light' | 'cyberpunk';
  commandPaletteOpen: boolean;
  notificationsPanelOpen: boolean;
  settingsPanelOpen: boolean;
  activeModalId: string | null;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleCommandPalette: () => void;
  toggleNotificationsPanel: () => void;
  toggleSettingsPanel: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setTheme: (theme: 'dark' | 'light' | 'cyberpunk') => void;
}

// ============================================================
// THREAT STORE STATE
// ============================================================

export interface ThreatState {
  // Data
  threats: ThreatEvent[];
  selectedThreatId: string | null;
  filters: ThreatFilters;
  sortBy: ThreatSortField;
  sortDirection: 'asc' | 'desc';
  
  // Actions
  setThreats: (threats: ThreatEvent[]) => void;
  addThreat: (threat: ThreatEvent) => void;
  updateThreat: (id: string, updates: Partial<ThreatEvent>) => void;
  removeThreat: (id: string) => void;
  selectThreat: (id: string | null) => void;
  setFilters: (filters: Partial<ThreatFilters>) => void;
  resetFilters: () => void;
  setSort: (field: ThreatSortField, direction: 'asc' | 'desc') => void;
}

export interface ThreatFilters {
  severity: ThreatSeverity[];
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchQuery: string;
  tags: string[];
}

export type ThreatSortField = 
  | 'createdAt' 
  | 'severity' 
  | 'status' 
  | 'title';

// ============================================================
// DASHBOARD STORE STATE
// ============================================================

export interface DashboardState {
  // Data
  widgets: DashboardWidget[];
  layout: string;
  lastRefresh: Date | null;
  
  // Actions
  setWidgets: (widgets: DashboardWidget[]) => void;
  updateWidget: (id: string, updates: Partial<DashboardWidget>) => void;
  addWidget: (widget: DashboardWidget) => void;
  removeWidget: (id: string) => void;
  refreshDashboard: () => void;
}

// ============================================================
// AGENT STORE STATE
// ============================================================

export interface AgentState {
  // Data
  agents: AIAgent[];
  selectedAgentId: string | null;
  
  // Actions
  setAgents: (agents: AIAgent[]) => void;
  updateAgent: (id: string, updates: Partial<AIAgent>) => void;
  selectAgent: (id: string | null) => void;
}

// ============================================================
// INTELLIGENCE STORE STATE
// ============================================================

export interface IntelligenceState {
  // Data
  feeds: IntelligenceFeed[];
  selectedFeedId: string | null;
  
  // Actions
  setFeeds: (feeds: IntelligenceFeed[]) => void;
  updateFeed: (id: string, updates: Partial<IntelligenceFeed>) => void;
  selectFeed: (id: string | null) => void;
}

// ============================================================
// WEBSOCKET STORE STATE
// ============================================================

export interface WebSocketStoreState extends WebSocketState {
  // Actions
  setConnected: (connected: boolean) => void;
  setReconnecting: (reconnecting: boolean) => void;
  incrementMessageCount: () => void;
  reset: () => void;
}

// ============================================================
// USER STORE STATE
// ============================================================

export interface UserState {
  // Data
  preferences: UserPreferences;
  isAuthenticated: boolean;
  
  // Actions
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setAuthenticated: (authenticated: boolean) => void;
  resetPreferences: () => void;
}
