import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserList } from '@/components/admin/UserList';

// Mock the hooks
vi.mock('@/hooks/useAdminUsers', () => ({
  useAdminUsers: vi.fn(() => ({
    data: {
      data: [
        {
          id: '1',
          email: 'admin@example.com',
          full_name: 'Admin User',
          role: 'admin',
          is_verified: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          email: 'driver@example.com',
          full_name: 'Driver User',
          role: 'driver',
          is_verified: false,
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ],
    },
    isLoading: false,
    error: null,
  })),
  useDeleteUser: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useCreateUser: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useUpdateUser: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useSearchUsers: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useUsersByRole: vi.fn(() => ({
    data: { data: [] },
    isLoading: false,
    error: null,
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('UserList', () => {
  it('renders user list with correct data', () => {
    render(<UserList />, { wrapper: createWrapper() });

    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Driver User')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('driver@example.com')).toBeInTheDocument();
  });

  it('renders role badges correctly', () => {
    render(<UserList />, { wrapper: createWrapper() });

    // Look for role text in the table rows
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('driver')).toBeInTheDocument();
  });

  it('renders status badges correctly', () => {
    render(<UserList />, { wrapper: createWrapper() });

    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders add user button', () => {
    render(<UserList />, { wrapper: createWrapper() });

    expect(screen.getByText('Add User')).toBeInTheDocument();
  });

  it('renders search and filter inputs', () => {
    render(<UserList />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
    expect(screen.getByText('All Roles')).toBeInTheDocument();
    expect(screen.getByText('All Status')).toBeInTheDocument();
  });
});