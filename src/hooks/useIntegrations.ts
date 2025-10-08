import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { integrationsApi } from '@/api/integrations';
import { toast } from 'sonner';
import type { UpdateIntegrationInput } from '@/types/integration';

// Query keys
export const integrationKeys = {
  all: ['integrations'] as const,
  lists: () => [...integrationKeys.all, 'list'] as const,
  list: (filters: string) => [...integrationKeys.lists(), { filters }] as const,
  details: () => [...integrationKeys.all, 'detail'] as const,
  detail: (id: string) => [...integrationKeys.details(), id] as const,
  status: (id: string) => [...integrationKeys.detail(id), 'status'] as const,
};

// Get all integrations
export const useIntegrations = (params?: any) => {
  return useQuery({
    queryKey: [...integrationKeys.lists(), params],
    queryFn: () => integrationsApi.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get integration by ID
export const useIntegration = (id: string) => {
  return useQuery({
    queryKey: integrationKeys.detail(id),
    queryFn: () => integrationsApi.getById(id),
    enabled: !!id,
  });
};

// Get integration status
export const useIntegrationStatus = (id: string) => {
  return useQuery({
    queryKey: integrationKeys.status(id),
    queryFn: () => integrationsApi.getStatus(id),
    enabled: !!id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Create integration mutation
export const useCreateIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: integrationsApi.create,
    onSuccess: (newIntegration) => {
      // Invalidate and refetch integrations list
      queryClient.invalidateQueries({ queryKey: integrationKeys.lists() });
      
      // Add the new integration to the cache
      queryClient.setQueryData(integrationKeys.detail(newIntegration.id), newIntegration);
      
      toast.success('Integration created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create integration: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Update integration mutation
export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateIntegrationInput }) =>
      integrationsApi.update(id, updates),
    onSuccess: (updatedIntegration) => {
      // Update the integration in the cache
      queryClient.setQueryData(integrationKeys.detail(updatedIntegration.id), updatedIntegration);
      
      // Invalidate integrations list to ensure consistency
      queryClient.invalidateQueries({ queryKey: integrationKeys.lists() });
      
      toast.success('Integration updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update integration: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Delete integration mutation
export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: integrationsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the integration from the cache
      queryClient.removeQueries({ queryKey: integrationKeys.detail(deletedId) });
      
      // Invalidate integrations list
      queryClient.invalidateQueries({ queryKey: integrationKeys.lists() });
      
      toast.success('Integration deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete integration: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Test connection mutation
export const useTestConnection = () => {
  return useMutation({
    mutationFn: integrationsApi.testConnection,
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Connection test successful!');
      } else {
        toast.error(`Connection test failed: ${result.message}`);
      }
    },
    onError: (error: any) => {
      toast.error(`Connection test failed: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Sync integration mutation
export const useSyncIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: integrationsApi.sync,
    onSuccess: (result, integrationId) => {
      if (result.success) {
        toast.success(`Sync completed! ${result.records_synced} records synced.`);
        
        // Invalidate integration status and details
        queryClient.invalidateQueries({ queryKey: integrationKeys.status(integrationId) });
        queryClient.invalidateQueries({ queryKey: integrationKeys.detail(integrationId) });
      } else {
        toast.error(`Sync failed: ${result.message}`);
      }
    },
    onError: (error: any) => {
      toast.error(`Sync failed: ${error.response?.data?.message || error.message}`);
    },
  });
};