/**
 * Agent Service
 * API operations for multi-agent AI coordination
 */

import { httpClient } from './client';
import type { 
  AIAgent, 
  AgentStatus, 
  AgentType, 
  AgentMemoryEntry 
} from '@/types';

// ============================================================
// REQUEST/RESPONSE TYPES
// ============================================================

export interface UpdateAgentRequest {
  status?: AgentStatus;
  currentTask?: string;
}

export interface AgentTaskRequest {
  taskType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  params: Record<string, unknown>;
}

export interface AgentTaskResponse {
  taskId: string;
  agentId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
}

export interface AgentMetricsResponse {
  totalAgents: number;
  activeAgents: number;
  tasksProcessed: number;
  avgResponseTime: number;
  successRate: number;
}

// ============================================================
// AGENT SERVICE
// ============================================================

class AgentService {
  private static instance: AgentService;
  private baseUrl = '/agents';

  static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  /**
   * Get all agents
   */
  async getAgents(type?: AgentType): Promise<AIAgent[]> {
    const url = type ? `${this.baseUrl}?type=${type}` : this.baseUrl;
    return httpClient.get<AIAgent[]>(url);
  }

  /**
   * Get agent by ID
   */
  async getAgentById(id: string): Promise<AIAgent> {
    return httpClient.get<AIAgent>(`${this.baseUrl}/${id}`);
  }

  /**
   * Update agent status
   */
  async updateAgent(id: string, data: UpdateAgentRequest): Promise<AIAgent> {
    return httpClient.patch<AIAgent>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Assign task to agent
   */
  async assignTask(agentId: string, task: AgentTaskRequest): Promise<AgentTaskResponse> {
    return httpClient.post<AgentTaskResponse>(`${this.baseUrl}/${agentId}/tasks`, task);
  }

  /**
   * Get agent task history
   */
  async getAgentTasks(agentId: string): Promise<AgentTaskResponse[]> {
    return httpClient.get<AgentTaskResponse[]>(`${this.baseUrl}/${agentId}/tasks`);
  }

  /**
   * Get agent memory entries
   */
  async getAgentMemory(agentId: string, type?: string): Promise<AgentMemoryEntry[]> {
    const url = type 
      ? `${this.baseUrl}/${agentId}/memory?type=${type}`
      : `${this.baseUrl}/${agentId}/memory`;
    return httpClient.get<AgentMemoryEntry[]>(url);
  }

  /**
   * Add memory entry to agent
   */
  async addMemoryEntry(agentId: string, entry: Omit<AgentMemoryEntry, 'id' | 'agentId'>): Promise<AgentMemoryEntry> {
    return httpClient.post<AgentMemoryEntry>(`${this.baseUrl}/${agentId}/memory`, entry);
  }

  /**
   * Get agent metrics
   */
  async getAgentMetrics(): Promise<AgentMetricsResponse> {
    return httpClient.get<AgentMetricsResponse>(`${this.baseUrl}/metrics`);
  }

  /**
   * Get agent performance over time
   */
  async getAgentPerformance(agentId: string, timeframe: string): Promise<{ timestamp: string; metrics: Record<string, number> }[]> {
    return httpClient.get(`${this.baseUrl}/${agentId}/performance?timeframe=${timeframe}`);
  }

  /**
   * Pause agent
   */
  async pauseAgent(agentId: string): Promise<AIAgent> {
    return httpClient.post<AIAgent>(`${this.baseUrl}/${agentId}/pause`);
  }

  /**
   * Resume agent
   */
  async resumeAgent(agentId: string): Promise<AIAgent> {
    return httpClient.post<AIAgent>(`${this.baseUrl}/${agentId}/resume`);
  }
}

export const agentService = AgentService.getInstance();
export default agentService;
