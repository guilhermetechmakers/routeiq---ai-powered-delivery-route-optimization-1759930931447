export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
  read_at?: string;
  expires_at?: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
}

export type NotificationType = 
  | 'route_assigned'
  | 'route_updated'
  | 'delivery_completed'
  | 'delivery_failed'
  | 'traffic_alert'
  | 'weather_alert'
  | 'system_maintenance'
  | 'performance_report'
  | 'optimization_suggestion';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationChannel = 'email' | 'push' | 'sms' | 'in_app';

export interface CreateNotificationInput {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: NotificationPriority;
  channels: NotificationChannel[];
  expires_at?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  delivery_updates: boolean;
  route_changes: boolean;
  system_alerts: boolean;
  performance_reports: boolean;
  optimization_suggestions: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_type: Record<NotificationType, number>;
  by_priority: Record<NotificationPriority, number>;
}