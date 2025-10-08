import apiClient from './client';
import type { AuthResponse, SignInInput, SignUpInput, PasswordResetInput, PasswordUpdateInput, EmailVerificationInput, RefreshTokenInput } from '@/types/auth';

export const authApi = {
  // Sign in with email and password
  signIn: async (credentials: SignInInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Store auth tokens
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },

  // Sign up with email and password
  signUp: async (credentials: SignUpInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    
    // Optionally store token on signup
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Reset password - send reset email
  resetPassword: async (data: PasswordResetInput): Promise<void> => {
    await apiClient.post('/auth/forgot-password', data);
  },

  // Update password with reset token
  updatePassword: async (data: PasswordUpdateInput): Promise<void> => {
    await apiClient.post('/auth/reset-password', data);
  },

  // Refresh auth token
  refreshToken: async (data: RefreshTokenInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', data);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (data: EmailVerificationInput): Promise<void> => {
    await apiClient.post('/auth/verify-email', data);
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await apiClient.get<AuthResponse>('/auth/me');
    return response.data;
  },
};