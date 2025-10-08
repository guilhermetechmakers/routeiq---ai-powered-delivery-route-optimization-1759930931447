import apiClient from './client';
import type { Route, CreateRouteInput, UpdateRouteInput, Stop, UpdateStopInput } from '@/types/route';
import type { PaginatedResponse, QueryParams } from '@/types/api';

export const routesApi = {
  // Get all routes
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Route>> => {
    const response = await apiClient.get<PaginatedResponse<Route>>('/routes', { params });
    return response.data;
  },

  // Get route by ID
  getById: async (id: string): Promise<Route> => {
    const response = await apiClient.get<Route>(`/routes/${id}`);
    return response.data;
  },

  // Get routes by driver
  getByDriver: async (driverId: string, params?: QueryParams): Promise<PaginatedResponse<Route>> => {
    const response = await apiClient.get<PaginatedResponse<Route>>(`/routes/driver/${driverId}`, { params });
    return response.data;
  },

  // Create new route
  create: async (route: CreateRouteInput): Promise<Route> => {
    const response = await apiClient.post<Route>('/routes', route);
    return response.data;
  },

  // Update route
  update: async (id: string, updates: UpdateRouteInput): Promise<Route> => {
    const response = await apiClient.put<Route>(`/routes/${id}`, updates);
    return response.data;
  },

  // Partial update route
  patch: async (id: string, updates: Partial<UpdateRouteInput>): Promise<Route> => {
    const response = await apiClient.patch<Route>(`/routes/${id}`, updates);
    return response.data;
  },

  // Delete route
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/routes/${id}`);
  },

  // Optimize route
  optimize: async (id: string): Promise<Route> => {
    const response = await apiClient.post<Route>(`/routes/${id}/optimize`);
    return response.data;
  },

  // Start route
  start: async (id: string): Promise<Route> => {
    const response = await apiClient.post<Route>(`/routes/${id}/start`);
    return response.data;
  },

  // Complete route
  complete: async (id: string): Promise<Route> => {
    const response = await apiClient.post<Route>(`/routes/${id}/complete`);
    return response.data;
  },

  // Pause route
  pause: async (id: string): Promise<Route> => {
    const response = await apiClient.post<Route>(`/routes/${id}/pause`);
    return response.data;
  },

  // Resume route
  resume: async (id: string): Promise<Route> => {
    const response = await apiClient.post<Route>(`/routes/${id}/resume`);
    return response.data;
  },

  // Update stop status
  updateStop: async (routeId: string, stopId: string, updates: UpdateStopInput): Promise<Stop> => {
    const response = await apiClient.patch<Stop>(`/routes/${routeId}/stops/${stopId}`, updates);
    return response.data;
  },

  // Get route analytics
  getAnalytics: async (id: string, period?: string): Promise<any> => {
    const response = await apiClient.get(`/routes/${id}/analytics`, { 
      params: period ? { period } : {} 
    });
    return response.data;
  },

  // Search routes
  search: async (query: string, params?: QueryParams): Promise<PaginatedResponse<Route>> => {
    const response = await apiClient.get<PaginatedResponse<Route>>('/routes/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },
};