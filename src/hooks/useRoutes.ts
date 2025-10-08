import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routesApi } from '@/api/routes';
import { toast } from 'sonner';
import type { UpdateRouteInput, UpdateStopInput } from '@/types/route';
import type { QueryParams } from '@/types/api';

// Query keys
export const routeKeys = {
  all: ['routes'] as const,
  lists: () => [...routeKeys.all, 'list'] as const,
  list: (filters: string) => [...routeKeys.lists(), { filters }] as const,
  details: () => [...routeKeys.all, 'detail'] as const,
  detail: (id: string) => [...routeKeys.details(), id] as const,
  driver: (driverId: string) => [...routeKeys.all, 'driver', driverId] as const,
};

// Get all routes
export const useRoutes = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...routeKeys.lists(), params],
    queryFn: () => routesApi.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get route by ID
export const useRoute = (id: string) => {
  return useQuery({
    queryKey: routeKeys.detail(id),
    queryFn: () => routesApi.getById(id),
    enabled: !!id,
  });
};

// Get routes by driver
export const useDriverRoutes = (driverId: string, params?: QueryParams) => {
  return useQuery({
    queryKey: [...routeKeys.driver(driverId), params],
    queryFn: () => routesApi.getByDriver(driverId, params),
    enabled: !!driverId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create route mutation
export const useCreateRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: routesApi.create,
    onSuccess: (newRoute) => {
      // Invalidate and refetch routes list
      queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
      
      // Add the new route to the cache
      queryClient.setQueryData(routeKeys.detail(newRoute.id), newRoute);
      
      toast.success('Route created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create route: ${error.message || 'Unknown error'}`);
    },
  });
};

// Update route mutation
export const useUpdateRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateRouteInput }) =>
      routesApi.update(id, updates),
    onSuccess: (updatedRoute) => {
      // Update the route in the cache
      queryClient.setQueryData(routeKeys.detail(updatedRoute.id), updatedRoute);
      
      // Invalidate routes list to ensure consistency
      queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
      
      toast.success('Route updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update route: ${error.message || 'Unknown error'}`);
    },
  });
};

// Delete route mutation
export const useDeleteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: routesApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the route from the cache
      queryClient.removeQueries({ queryKey: routeKeys.detail(deletedId) });
      
      // Invalidate routes list
      queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
      
      toast.success('Route deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete route: ${error.message || 'Unknown error'}`);
    },
  });
};

// Optimize route mutation
export const useOptimizeRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: routesApi.optimize,
    onSuccess: (optimizedRoute) => {
      // Update the route in the cache
      queryClient.setQueryData(routeKeys.detail(optimizedRoute.id), optimizedRoute);
      
      // Invalidate routes list
      queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
      
      toast.success('Route optimized successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to optimize route: ${error.message || 'Unknown error'}`);
    },
  });
};

// Start route mutation
export const useStartRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: routesApi.start,
    onSuccess: (startedRoute) => {
      queryClient.setQueryData(routeKeys.detail(startedRoute.id), startedRoute);
      queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
      toast.success('Route started successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to start route: ${error.message || 'Unknown error'}`);
    },
  });
};

// Complete route mutation
export const useCompleteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: routesApi.complete,
    onSuccess: (completedRoute) => {
      queryClient.setQueryData(routeKeys.detail(completedRoute.id), completedRoute);
      queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
      toast.success('Route completed successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to complete route: ${error.message || 'Unknown error'}`);
    },
  });
};

// Update stop mutation
export const useUpdateStop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ routeId, stopId, updates }: { routeId: string; stopId: string; updates: UpdateStopInput }) =>
      routesApi.updateStop(routeId, stopId, updates),
    onSuccess: (_, { routeId }) => {
      // Invalidate the route to refetch with updated stop
      queryClient.invalidateQueries({ queryKey: routeKeys.detail(routeId) });
      
      toast.success('Stop updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update stop: ${error.message || 'Unknown error'}`);
    },
  });
};

// Search routes
export const useSearchRoutes = (query: string, params?: QueryParams) => {
  return useQuery({
    queryKey: [...routeKeys.lists(), 'search', query, params],
    queryFn: () => routesApi.search(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};