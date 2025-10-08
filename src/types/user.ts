import type { NotificationPreferences } from './notification';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  preferences?: UserPreferences;
}

export type UserRole = 'admin' | 'dispatcher' | 'driver';

export interface UserPreferences {
  notifications: NotificationPreferences;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
}

export interface UpdateUserInput {
  id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  preferences?: Partial<UserPreferences>;
}

export interface CreateUserInput {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
}