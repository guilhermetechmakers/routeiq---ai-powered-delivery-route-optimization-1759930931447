import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import { toast } from 'sonner';
import type { User, UpdateUserInput } from '@/types/user';

// Query keys
export const adminUserKeys = {
  all: ['admin', 'users'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (filters: string) => [...adminUserKeys.lists(), { filters }] as const,
  details: () => [...adminUserKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminUserKeys.details(), id] as const,
};

// Get all users (admin only)
export const useAdminUsers = (params?: any) => {
  return useQuery({
    queryKey: [...adminUserKeys.lists(), params],
    queryFn: () => usersApi.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get user by ID
export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
};

// Create user mutation (admin only)
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      
      // Add the new user to the cache
      queryClient.setQueryData(adminUserKeys.detail(newUser.id), newUser);
      
      toast.success('User created successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to create user: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Update user mutation (admin only)
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<UpdateUserInput> }) =>
      usersApi.update(id, updates),
    onSuccess: (updatedUser) => {
      // Update the user in the cache
      queryClient.setQueryData(adminUserKeys.detail(updatedUser.id), updatedUser);
      
      // Invalidate users list to ensure consistency
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      
      toast.success('User updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update user: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Delete user mutation (admin only)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the user from the cache
      queryClient.removeQueries({ queryKey: adminUserKeys.detail(deletedId) });
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
      
      toast.success('User deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Search users mutation
export const useSearchUsers = () => {
  return useMutation({
    mutationFn: ({ query, params }: { query: string; params?: any }) =>
      usersApi.search(query, params),
    onError: (error: any) => {
      toast.error(`Search failed: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Get users by role
export const useUsersByRole = (role: User['role'], params?: any) => {
  return useQuery({
    queryKey: [...adminUserKeys.lists(), 'role', role, params],
    queryFn: () => usersApi.getByRole(role, params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};