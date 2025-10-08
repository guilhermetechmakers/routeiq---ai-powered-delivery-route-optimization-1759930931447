import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { toast } from 'sonner';

// Query keys
export const authKeys = {
  user: ['auth', 'user'] as const,
};

// Get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!localStorage.getItem('auth_token'),
  });
};

// Sign in mutation
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      // Update the user in the cache
      if (data.user) {
        queryClient.setQueryData(authKeys.user, data.user);
      }
      
      toast.success('Signed in successfully!');
    },
    onError: (error: any) => {
      toast.error(`Sign in failed: ${error.message || 'Invalid credentials'}`);
    },
  });
};

// Sign up mutation
export const useSignUp = () => {
  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: () => {
      toast.success('Account created! Please check your email to verify your account.');
    },
    onError: (error: any) => {
      toast.error(`Sign up failed: ${error.message || 'Failed to create account'}`);
    },
  });
};

// Sign out mutation
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      toast.success('Signed out successfully!');
    },
    onError: (error: any) => {
      toast.error(`Sign out failed: ${error.message || 'Failed to sign out'}`);
    },
  });
};

// Password reset mutation
export const usePasswordReset = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset email sent! Check your inbox.');
    },
    onError: (error: any) => {
      toast.error(`Password reset failed: ${error.message || 'Failed to send reset email'}`);
    },
  });
};

// Password update mutation
export const usePasswordUpdate = () => {
  return useMutation({
    mutationFn: authApi.updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Password update failed: ${error.message || 'Failed to update password'}`);
    },
  });
};

// Email verification mutation
export const useEmailVerification = () => {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      toast.success('Email verified successfully!');
    },
    onError: (error: any) => {
      toast.error(`Email verification failed: ${error.message || 'Invalid verification token'}`);
    },
  });
};

// Refresh token mutation
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      // Update the user in the cache
      if (data.user) {
        queryClient.setQueryData(authKeys.user, data.user);
      }
    },
    onError: () => {
      // If refresh fails, clear auth data and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      queryClient.clear();
      window.location.href = '/login';
    },
  });
};