import type { User } from './user';

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface SignInInput {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignUpInput {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  role?: 'driver' | 'dispatcher' | 'admin';
}

export interface PasswordResetInput {
  email: string;
}

export interface PasswordUpdateInput {
  token: string;
  password: string;
}

export interface EmailVerificationInput {
  token: string;
}

export interface RefreshTokenInput {
  refresh_token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Re-export User type for convenience
export type { User } from './user';