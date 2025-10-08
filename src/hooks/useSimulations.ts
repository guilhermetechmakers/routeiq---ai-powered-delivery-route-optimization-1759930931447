import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simulationsApi } from '@/api/simulations';
import { toast } from 'sonner';
import type { SimulationFilters } from '@/types/simulation';

// Query keys
export const simulationKeys = {
  all: ['simulations'] as const,
  lists: () => [...simulationKeys.all, 'list'] as const,
  list: (filters: string) => [...simulationKeys.lists(), { filters }] as const,
  details: () => [...simulationKeys.all, 'detail'] as const,
  detail: (id: string) => [...simulationKeys.details(), id] as const,
  results: (id: string) => [...simulationKeys.detail(id), 'results'] as const,
  status: (id: string) => [...simulationKeys.detail(id), 'status'] as const,
};

// Get all simulations
export const useSimulations = (filters?: SimulationFilters) => {
  return useQuery({
    queryKey: [...simulationKeys.lists(), filters],
    queryFn: () => simulationsApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get simulation by ID
export const useSimulation = (id: string) => {
  return useQuery({
    queryKey: simulationKeys.detail(id),
    queryFn: () => simulationsApi.getById(id),
    enabled: !!id,
  });
};

// Get simulation results
export const useSimulationResults = (id: string) => {
  return useQuery({
    queryKey: simulationKeys.results(id),
    queryFn: () => simulationsApi.getResults(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get simulation status
export const useSimulationStatus = (id: string) => {
  return useQuery({
    queryKey: simulationKeys.status(id),
    queryFn: () => simulationsApi.getStatus(id),
    enabled: !!id,
    refetchInterval: (query) => {
      // Poll every 2 seconds if simulation is running
      return (query as any)?.data?.status === 'running' ? 2000 : false;
    },
  });
};

// Create simulation mutation
export const useCreateSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: simulationsApi.create,
    onSuccess: (newSimulation) => {
      // Invalidate and refetch simulations list
      queryClient.invalidateQueries({ queryKey: simulationKeys.lists() });
      
      // Add the new simulation to the cache
      queryClient.setQueryData(simulationKeys.detail(newSimulation.id), newSimulation);
      
      toast.success('Simulation created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create simulation: ${error.message || 'Unknown error'}`);
    },
  });
};

// Run simulation mutation
export const useRunSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: simulationsApi.run,
    onSuccess: (simulation) => {
      // Update the simulation in the cache
      queryClient.setQueryData(simulationKeys.detail(simulation.id), simulation);
      
      // Invalidate results to refetch them
      queryClient.invalidateQueries({ queryKey: simulationKeys.results(simulation.id) });
      
      // Invalidate status to start polling
      queryClient.invalidateQueries({ queryKey: simulationKeys.status(simulation.id) });
      
      toast.success('Simulation started successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to start simulation: ${error.message || 'Unknown error'}`);
    },
  });
};

// Cancel simulation mutation
export const useCancelSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: simulationsApi.cancel,
    onSuccess: (simulation) => {
      // Update the simulation in the cache
      queryClient.setQueryData(simulationKeys.detail(simulation.id), simulation);
      
      // Invalidate status to stop polling
      queryClient.invalidateQueries({ queryKey: simulationKeys.status(simulation.id) });
      
      toast.success('Simulation cancelled successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to cancel simulation: ${error.message || 'Unknown error'}`);
    },
  });
};

// Delete simulation mutation
export const useDeleteSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: simulationsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the simulation from the cache
      queryClient.removeQueries({ queryKey: simulationKeys.detail(deletedId) });
      
      // Invalidate simulations list
      queryClient.invalidateQueries({ queryKey: simulationKeys.lists() });
      
      toast.success('Simulation deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete simulation: ${error.message || 'Unknown error'}`);
    },
  });
};

// Get simulation insights
export const useSimulationInsights = (id: string) => {
  return useQuery({
    queryKey: [...simulationKeys.detail(id), 'insights'],
    queryFn: () => simulationsApi.getInsights(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get simulation recommendations
export const useSimulationRecommendations = (id: string) => {
  return useQuery({
    queryKey: [...simulationKeys.detail(id), 'recommendations'],
    queryFn: () => simulationsApi.getRecommendations(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Compare simulations mutation
export const useCompareSimulations = () => {
  return useMutation({
    mutationFn: simulationsApi.compare,
    onSuccess: () => {
      toast.success('Simulation comparison completed!');
    },
    onError: (error: any) => {
      toast.error(`Failed to compare simulations: ${error.message || 'Unknown error'}`);
    },
  });
};

// Get simulation templates
export const useSimulationTemplates = () => {
  return useQuery({
    queryKey: [...simulationKeys.all, 'templates'],
    queryFn: simulationsApi.getTemplates,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Create simulation from template mutation
export const useCreateSimulationFromTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, customizations }: { templateId: string; customizations?: any }) =>
      simulationsApi.createFromTemplate(templateId, customizations),
    onSuccess: (newSimulation) => {
      // Invalidate and refetch simulations list
      queryClient.invalidateQueries({ queryKey: simulationKeys.lists() });
      
      // Add the new simulation to the cache
      queryClient.setQueryData(simulationKeys.detail(newSimulation.id), newSimulation);
      
      toast.success('Simulation created from template successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create simulation from template: ${error.message || 'Unknown error'}`);
    },
  });
};

// Download simulation results mutation
export const useDownloadSimulationResults = () => {
  return useMutation({
    mutationFn: ({ id, format }: { id: string; format: 'pdf' | 'csv' | 'json' }) =>
      simulationsApi.downloadResults(id, format),
    onSuccess: (blob, { format }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `simulation-results.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Simulation results downloaded as ${format.toUpperCase()}`);
    },
    onError: (error: any) => {
      toast.error(`Failed to download results: ${error.message || 'Unknown error'}`);
    },
  });
};
