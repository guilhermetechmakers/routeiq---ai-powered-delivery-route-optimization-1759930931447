import apiClient from './client';
import type { Simulation, CreateSimulationInput, SimulationInsight, SimulationRecommendation } from '@/types/simulation';
import type { PaginatedResponse, QueryParams } from '@/types/api';

export const simulationsApi = {
  // Get all simulations
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Simulation>> => {
    const response = await apiClient.get<PaginatedResponse<Simulation>>('/simulations', { params });
    return response.data;
  },

  // Get simulation by ID
  getById: async (id: string): Promise<Simulation> => {
    const response = await apiClient.get<Simulation>(`/simulations/${id}`);
    return response.data;
  },

  // Create new simulation
  create: async (simulation: CreateSimulationInput): Promise<Simulation> => {
    const response = await apiClient.post<Simulation>('/simulations', simulation);
    return response.data;
  },

  // Run simulation
  run: async (id: string): Promise<Simulation> => {
    const response = await apiClient.post<Simulation>(`/simulations/${id}/run`);
    return response.data;
  },

  // Cancel simulation
  cancel: async (id: string): Promise<Simulation> => {
    const response = await apiClient.post<Simulation>(`/simulations/${id}/cancel`);
    return response.data;
  },

  // Get simulation results
  getResults: async (id: string): Promise<Simulation['results']> => {
    const response = await apiClient.get<Simulation['results']>(`/simulations/${id}/results`);
    return response.data;
  },

  // Get simulation status
  getStatus: async (id: string): Promise<{ status: Simulation['status']; progress?: number }> => {
    const response = await apiClient.get<{ status: Simulation['status']; progress?: number }>(`/simulations/${id}/status`);
    return response.data;
  },

  // Download simulation results
  downloadResults: async (id: string, format: 'pdf' | 'csv' | 'json'): Promise<Blob> => {
    const response = await apiClient.get(`/simulations/${id}/download/${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get simulation insights
  getInsights: async (id: string): Promise<SimulationInsight[]> => {
    const response = await apiClient.get<SimulationInsight[]>(`/simulations/${id}/insights`);
    return response.data;
  },

  // Get simulation recommendations
  getRecommendations: async (id: string): Promise<SimulationRecommendation[]> => {
    const response = await apiClient.get<SimulationRecommendation[]>(`/simulations/${id}/recommendations`);
    return response.data;
  },

  // Compare simulations
  compare: async (simulationIds: string[]): Promise<any> => {
    const response = await apiClient.post('/simulations/compare', { simulation_ids: simulationIds });
    return response.data;
  },

  // Get simulation templates
  getTemplates: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/simulations/templates');
    return response.data;
  },

  // Create simulation from template
  createFromTemplate: async (templateId: string, customizations?: any): Promise<Simulation> => {
    const response = await apiClient.post<Simulation>(`/simulations/templates/${templateId}`, customizations);
    return response.data;
  },

  // Delete simulation
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/simulations/${id}`);
  },

  // Search simulations
  search: async (query: string, params?: QueryParams): Promise<PaginatedResponse<Simulation>> => {
    const response = await apiClient.get<PaginatedResponse<Simulation>>('/simulations/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },
};