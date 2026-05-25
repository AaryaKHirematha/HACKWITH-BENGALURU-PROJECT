/**
 * Agent Hooks
 * React Query hooks for multi-agent AI coordination
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentService, type AgentTaskRequest } from '@/services/api';
import { useAgentStore } from '@/store';
import type { AIAgent, AgentType, AgentStatus } from '@/types';

// ============================================================
// QUERY KEYS
// ============================================================

export const agentKeys = {
  all: ['agents'] as const,
  lists: () => [...agentKeys.all, 'list'] as const,
  list: (type?: AgentType) => [...agentKeys.lists(), { type }] as const,
  details: () => [...agentKeys.all, 'detail'] as const,
  detail: (id: string) => [...agentKeys.details(), id] as const,
  metrics: () => [...agentKeys.all, 'metrics'] as const,
  memory: (id: string) => [...agentKeys.detail(id), 'memory'] as const,
  tasks: (id: string) => [...agentKeys.detail(id), 'tasks'] as const,
  performance: (id: string, timeframe: string) => 
    [...agentKeys.detail(id), 'performance', timeframe] as const,
};

// ============================================================
// QUERY HOOKS
// ============================================================

/**
 * Hook to fetch all agents
 */
export function useAgents(type?: AgentType) {
  const setAgents = useAgentStore((state) => state.setAgents);

  return useQuery({
    queryKey: agentKeys.list(type),
    queryFn: async () => {
      const agents = await agentService.getAgents(type);
      setAgents(agents);
      return agents;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });
}

/**
 * Hook to fetch single agent by ID
 */
export function useAgent(id: string) {
  return useQuery({
    queryKey: agentKeys.detail(id),
    queryFn: () => agentService.getAgentById(id),
    staleTime: 10 * 1000, // 10 seconds
    enabled: !!id,
  });
}

/**
 * Hook to fetch agent metrics
 */
export function useAgentMetrics() {
  return useQuery({
    queryKey: agentKeys.metrics(),
    queryFn: () => agentService.getAgentMetrics(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 15000, // Auto-refresh every 15 seconds
  });
}

/**
 * Hook to fetch agent memory entries
 */
export function useAgentMemory(agentId: string, type?: string) {
  return useQuery({
    queryKey: agentKeys.memory(agentId),
    queryFn: () => agentService.getAgentMemory(agentId, type),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!agentId,
  });
}

/**
 * Hook to fetch agent tasks
 */
export function useAgentTasks(agentId: string) {
  return useQuery({
    queryKey: agentKeys.tasks(agentId),
    queryFn: () => agentService.getAgentTasks(agentId),
    staleTime: 10 * 1000, // 10 seconds
    enabled: !!agentId,
  });
}

/**
 * Hook to fetch agent performance metrics over time
 */
export function useAgentPerformance(agentId: string, timeframe: string = '24h') {
  return useQuery({
    queryKey: agentKeys.performance(agentId, timeframe),
    queryFn: () => agentService.getAgentPerformance(agentId, timeframe),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!agentId,
  });
}

// ============================================================
// MUTATION HOOKS
// ============================================================

/**
 * Hook to update agent status
 */
export function useUpdateAgent() {
  const queryClient = useQueryClient();
  const updateAgent = useAgentStore((state) => state.updateAgent);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: AgentStatus; currentTask?: string } }) =>
      agentService.updateAgent(id, data),
    onSuccess: (updatedAgent: AIAgent) => {
      updateAgent(updatedAgent.id, updatedAgent);
      queryClient.invalidateQueries({ queryKey: agentKeys.all });
    },
  });
}

/**
 * Hook to assign task to agent
 */
export function useAssignAgentTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, task }: { agentId: string; task: AgentTaskRequest }) =>
      agentService.assignTask(agentId, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.all });
    },
  });
}

/**
 * Hook to pause agent
 */
export function usePauseAgent() {
  const queryClient = useQueryClient();
  const updateAgent = useAgentStore((state) => state.updateAgent);

  return useMutation({
    mutationFn: (agentId: string) => agentService.pauseAgent(agentId),
    onSuccess: (updatedAgent: AIAgent) => {
      updateAgent(updatedAgent.id, updatedAgent);
      queryClient.invalidateQueries({ queryKey: agentKeys.all });
    },
  });
}

/**
 * Hook to resume agent
 */
export function useResumeAgent() {
  const queryClient = useQueryClient();
  const updateAgent = useAgentStore((state) => state.updateAgent);

  return useMutation({
    mutationFn: (agentId: string) => agentService.resumeAgent(agentId),
    onSuccess: (updatedAgent: AIAgent) => {
      updateAgent(updatedAgent.id, updatedAgent);
      queryClient.invalidateQueries({ queryKey: agentKeys.all });
    },
  });
}
