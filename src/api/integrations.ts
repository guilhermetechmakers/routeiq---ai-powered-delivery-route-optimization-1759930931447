import apiClient from './client';
import type { Integration, CreateIntegrationInput, UpdateIntegrationInput } from '@/types/integration';
import type { PaginatedResponse, QueryParams } from '@/types/api';

export const integrationsApi = {
  // Get all integrations
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Integration>> => {
    const response = await apiClient.get<PaginatedResponse<Integration>>('/integrations', { params });
    return response.data;
  },

  // Get integration by ID
  getById: async (id: string): Promise<Integration> => {
    const response = await apiClient.get<Integration>(`/integrations/${id}`);
    return response.data;
  },

  // Create new integration
  create: async (integration: CreateIntegrationInput): Promise<Integration> => {
    const response = await apiClient.post<Integration>('/integrations', integration);
    return response.data;
  },

  // Update integration
  update: async (id: string, updates: UpdateIntegrationInput): Promise<Integration> => {
    const response = await apiClient.put<Integration>(`/integrations/${id}`, updates);
    return response.data;
  },

  // Delete integration
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/integrations/${id}`);
  },

  // Test integration connection
  testConnection: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>(`/integrations/${id}/test`);
    return response.data;
  },

  // Sync integration data
  sync: async (id: string): Promise<{ success: boolean; message: string; records_synced: number }> => {
    const response = await apiClient.post<{ success: boolean; message: string; records_synced: number }>(`/integrations/${id}/sync`);
    return response.data;
  },

  // Get integration status
  getStatus: async (id: string): Promise<{ status: string; last_sync: string; error_message?: string }> => {
    const response = await apiClient.get<{ status: string; last_sync: string; error_message?: string }>(`/integrations/${id}/status`);
    return response.data;
  },

  // Search integrations
  search: async (query: string, params?: QueryParams): Promise<PaginatedResponse<Integration>> => {
    const response = await apiClient.get<PaginatedResponse<Integration>>('/integrations/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },

  // Get integrations by type
  getByType: async (type: string, params?: QueryParams): Promise<PaginatedResponse<Integration>> => {
    const response = await apiClient.get<PaginatedResponse<Integration>>(`/integrations/type/${type}`, { params });
    return response.data;
  },
};