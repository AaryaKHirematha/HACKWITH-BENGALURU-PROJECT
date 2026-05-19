/**
 * Threat Intelligence Service
 * API operations for threat intelligence management
 */

import { httpClient } from './client';
import type { 
  ThreatEvent, 
  ThreatIndicator, 
  PaginatedResponse, 
  ThreatSeverity,
  ThreatStatus 
} from '@/types';

// ============================================================
// REQUEST/RESPONSE TYPES
// ============================================================

export interface CreateThreatRequest {
  title: string;
  description: string;
  severity: ThreatSeverity;
  indicators?: ThreatIndicator[];
  tags?: string[];
}

export interface UpdateThreatRequest {
  title?: string;
  description?: string;
  severity?: ThreatSeverity;
  status?: ThreatStatus;
  tags?: string[];
  assignedAgent?: string;
}

export interface ThreatQueryParams {
  page?: number;
  pageSize?: number;
  severity?: ThreatSeverity[];
  status?: ThreatStatus[];
  search?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface ThreatStatsResponse {
  total: number;
  bySeverity: Record<ThreatSeverity, number>;
  byStatus: Record<ThreatStatus, number>;
  recentTrend: { date: string; count: number }[];
  avgResponseTime: number;
}

// ============================================================
// THREAT SERVICE
// ============================================================

class ThreatService {
  private static instance: ThreatService;
  private baseUrl = '/threats';

  static getInstance(): ThreatService {
    if (!ThreatService.instance) {
      ThreatService.instance = new ThreatService();
    }
    return ThreatService.instance;
  }

  /**
   * Get paginated list of threats
   */
  async getThreats(params?: ThreatQueryParams): Promise<PaginatedResponse<ThreatEvent>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    const response = await httpClient.get<{ data: ThreatEvent[]; pagination: PaginatedResponse<ThreatEvent>['pagination'] }>(
      `${this.baseUrl}?${queryParams.toString()}`
    );
    
    // Transform response to match expected format
    return {
      success: true,
      data: response.data,
      timestamp: new Date(),
      pagination: response.pagination,
    };
  }

  /**
   * Get threat by ID
   */
  async getThreatById(id: string): Promise<ThreatEvent> {
    return httpClient.get<ThreatEvent>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new threat event
   */
  async createThreat(data: CreateThreatRequest): Promise<ThreatEvent> {
    return httpClient.post<ThreatEvent>(this.baseUrl, data);
  }

  /**
   * Update existing threat
   */
  async updateThreat(id: string, data: UpdateThreatRequest): Promise<ThreatEvent> {
    return httpClient.patch<ThreatEvent>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete threat
   */
  async deleteThreat(id: string): Promise<void> {
    return httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get threat statistics
   */
  async getThreatStats(): Promise<ThreatStatsResponse> {
    return httpClient.get<ThreatStatsResponse>(`${this.baseUrl}/stats`);
  }

  /**
   * Get threats by severity
   */
  async getThreatsBySeverity(severity: ThreatSeverity): Promise<ThreatEvent[]> {
    return httpClient.get<ThreatEvent[]>(`${this.baseUrl}/severity/${severity}`);
  }

  /**
   * Enrich threat with additional IoCs
   */
  async enrichThreat(id: string): Promise<ThreatEvent> {
    return httpClient.post<ThreatEvent>(`${this.baseUrl}/${id}/enrich`);
  }

  /**
   * Assign threat to agent
   */
  async assignToAgent(threatId: string, agentId: string): Promise<ThreatEvent> {
    return httpClient.post<ThreatEvent>(`${this.baseUrl}/${threatId}/assign`, { agentId });
  }

  /**
   * Export threats to CSV
   */
  async exportThreats(params?: ThreatQueryParams): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const response = await httpClient.get<Blob>(
      `${this.baseUrl}/export?${queryParams.toString()}`
    );
    return response;
  }
}

export const threatService = ThreatService.getInstance();
export default threatService;
