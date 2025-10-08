import apiClient from './client';
import type { User, CreateUserInput, UpdateUserInput } from '@/types/user';
import type { PaginatedResponse, QueryParams } from '@/types/api';

export const usersApi = {
  // Get current user
  getCurrent: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  // Get all users (admin only)
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  // Create new user (admin only)
  create: async (user: CreateUserInput): Promise<User> => {
    const response = await apiClient.post<User>('/users', user);
    return response.data;
  },

  // Update user profile
  updateProfile: async (updates: UpdateUserInput): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${updates.id}`, updates);
    return response.data;
  },

  // Update user (admin only)
  update: async (id: string, updates: Partial<UpdateUserInput>): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, updates);
    return response.data;
  },

  // Delete user account
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Update user preferences
  updatePreferences: async (id: string, preferences: Partial<User['preferences']>): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}/preferences`, preferences);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (id: string, file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.post<User>(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Search users
  search: async (query: string, params?: QueryParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/users/search', {
      params: { q: query, ...params }
    });
    return response.data;
  },

  // Get users by role
  getByRole: async (role: User['role'], params?: QueryParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>(`/users/role/${role}`, { params });
    return response.data;
  },
};