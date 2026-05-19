/**
 * Threat Hooks
 * React Query hooks for threat intelligence data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { threatService, type ThreatQueryParams, type CreateThreatRequest, type UpdateThreatRequest } from '@/services/api';
import { useThreatStore } from '@/store';
import type { ThreatEvent } from '@/types';

// ============================================================
// QUERY KEYS
// ============================================================

export const threatKeys = {
  all: ['threats'] as const,
  lists: () => [...threatKeys.all, 'list'] as const,
  list: (params: ThreatQueryParams) => [...threatKeys.lists(), params] as const,
  details: () => [...threatKeys.all, 'detail'] as const,
  detail: (id: string) => [...threatKeys.details(), id] as const,
  stats: () => [...threatKeys.all, 'stats'] as const,
};

// ============================================================
// QUERY HOOKS
// ============================================================

/**
 * Hook to fetch paginated threats
 */
export function useThreats(params?: ThreatQueryParams) {
  const setThreats = useThreatStore((state) => state.setThreats);

  return useQuery({
    queryKey: threatKeys.list(params || {}),
    queryFn: async () => {
      const response = await threatService.getThreats(params);
      setThreats(response.data);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch single threat by ID
 */
export function useThreat(id: string) {
  return useQuery({
    queryKey: threatKeys.detail(id),
    queryFn: () => threatService.getThreatById(id),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!id,
  });
}

/**
 * Hook to fetch threat statistics
 */
export function useThreatStats() {
  return useQuery({
    queryKey: threatKeys.stats(),
    queryFn: () => threatService.getThreatStats(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}

// ============================================================
// MUTATION HOOKS
// ============================================================

/**
 * Hook to create new threat
 */
export function useCreateThreat() {
  const queryClient = useQueryClient();
  const addThreat = useThreatStore((state) => state.addThreat);

  return useMutation({
    mutationFn: (data: CreateThreatRequest) => threatService.createThreat(data),
    onSuccess: (newThreat: ThreatEvent) => {
      addThreat(newThreat);
      queryClient.invalidateQueries({ queryKey: threatKeys.all });
    },
  });
}

/**
 * Hook to update threat
 */
export function useUpdateThreat() {
  const queryClient = useQueryClient();
  const updateThreat = useThreatStore((state) => state.updateThreat);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateThreatRequest }) =>
      threatService.updateThreat(id, data),
    onSuccess: (updatedThreat: ThreatEvent) => {
      updateThreat(updatedThreat.id, updatedThreat);
      queryClient.invalidateQueries({ queryKey: threatKeys.all });
    },
  });
}

/**
 * Hook to delete threat
 */
export function useDeleteThreat() {
  const queryClient = useQueryClient();
  const removeThreat = useThreatStore((state) => state.removeThreat);

  return useMutation({
    mutationFn: (id: string) => threatService.deleteThreat(id),
    onSuccess: (_data: void, id: string) => {
      removeThreat(id);
      queryClient.invalidateQueries({ queryKey: threatKeys.all });
    },
  });
}

/**
 * Hook to enrich threat with additional IoCs
 */
export function useEnrichThreat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => threatService.enrichThreat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: threatKeys.all });
    },
  });
}

/**
 * Hook to assign threat to agent
 */
export function useAssignThreat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threatId, agentId }: { threatId: string; agentId: string }) =>
      threatService.assignToAgent(threatId, agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: threatKeys.all });
    },
  });
}
