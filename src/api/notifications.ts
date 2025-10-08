import apiClient from './client';
import type { Notification, CreateNotificationInput, NotificationStats, NotificationPreferences } from '@/types/notification';
import type { PaginatedResponse, QueryParams } from '@/types/api';

export const notificationsApi = {
  // Get all notifications for current user
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get<PaginatedResponse<Notification>>('/notifications', { params });
    return response.data;
  },

  // Get notification by ID
  getById: async (id: string): Promise<Notification> => {
    const response = await apiClient.get<Notification>(`/notifications/${id}`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },

  // Delete notification
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },

  // Delete all notifications
  deleteAll: async (): Promise<void> => {
    await apiClient.delete('/notifications');
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data.count;
  },

  // Get notification stats
  getStats: async (): Promise<NotificationStats> => {
    const response = await apiClient.get<NotificationStats>('/notifications/stats');
    return response.data;
  },

  // Update notification preferences
  updatePreferences: async (preferences: Partial<NotificationPreferences>): Promise<void> => {
    await apiClient.patch('/notifications/preferences', preferences);
  },

  // Get notification preferences
  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await apiClient.get<NotificationPreferences>('/notifications/preferences');
    return response.data;
  },

  // Create notification (admin only)
  create: async (notification: CreateNotificationInput): Promise<Notification> => {
    const response = await apiClient.post<Notification>('/notifications', notification);
    return response.data;
  },

  // Send test notification
  sendTest: async (type: Notification['type'], channels: Notification['channels']): Promise<void> => {
    await apiClient.post('/notifications/test', { type, channels });
  },
};