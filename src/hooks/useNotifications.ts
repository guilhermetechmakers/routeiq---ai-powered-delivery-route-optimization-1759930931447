import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications';
import { toast } from 'sonner';
import type { Notification } from '@/types/notification';

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: string) => [...notificationKeys.lists(), { filters }] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
  stats: () => [...notificationKeys.all, 'stats'] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

// Get all notifications
export const useNotifications = (params?: any) => {
  return useQuery({
    queryKey: notificationKeys.list(JSON.stringify(params || {})),
    queryFn: () => notificationsApi.getAll(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

// Get notification by ID
export const useNotification = (id: string) => {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => notificationsApi.getById(id),
    enabled: !!id,
  });
};

// Get unread count
export const useUnreadCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationsApi.getUnreadCount,
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
};

// Get notification stats
export const useNotificationStats = () => {
  return useQuery({
    queryKey: notificationKeys.stats(),
    queryFn: notificationsApi.getStats,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get notification preferences
export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: notificationsApi.getPreferences,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: (updatedNotification) => {
      // Update the notification in the cache
      queryClient.setQueryData(notificationKeys.detail(updatedNotification.id), updatedNotification);
      
      // Invalidate lists to update read status
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      
      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
    onError: (error: any) => {
      toast.error(`Failed to mark notification as read: ${error.message}`);
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      
      toast.success('All notifications marked as read');
    },
    onError: (error: any) => {
      toast.error(`Failed to mark all notifications as read: ${error.message}`);
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the notification from the cache
      queryClient.removeQueries({ queryKey: notificationKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      
      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      
      toast.success('Notification deleted');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete notification: ${error.message}`);
    },
  });
};

// Delete all notifications
export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.deleteAll,
    onSuccess: () => {
      // Clear all notification data
      queryClient.removeQueries({ queryKey: notificationKeys.all });
      
      toast.success('All notifications deleted');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete all notifications: ${error.message}`);
    },
  });
};

// Update notification preferences
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.updatePreferences,
    onSuccess: (_, preferences) => {
      // Update preferences in cache
      queryClient.setQueryData(notificationKeys.preferences(), preferences);
      
      toast.success('Notification preferences updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update notification preferences: ${error.message}`);
    },
  });
};

// Create notification (admin only)
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.create,
    onSuccess: (newNotification) => {
      // Add the new notification to the cache
      queryClient.setQueryData(notificationKeys.detail(newNotification.id), newNotification);
      
      // Invalidate lists to include the new notification
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      
      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      
      toast.success('Notification created');
    },
    onError: (error: any) => {
      toast.error(`Failed to create notification: ${error.message}`);
    },
  });
};

// Send test notification
export const useSendTestNotification = () => {
  return useMutation({
    mutationFn: ({ type, channels }: { type: Notification['type']; channels: Notification['channels'] }) =>
      notificationsApi.sendTest(type, channels),
    onSuccess: () => {
      toast.success('Test notification sent');
    },
    onError: (error: any) => {
      toast.error(`Failed to send test notification: ${error.message}`);
    },
  });
};
