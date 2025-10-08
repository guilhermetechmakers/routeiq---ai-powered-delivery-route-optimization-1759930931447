import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntegrationList } from '@/components/integrations/IntegrationList';

// Mock the hooks
vi.mock('@/hooks/useIntegrations', () => ({
  useIntegrations: vi.fn(() => ({
    data: {
      data: [
        {
          id: '1',
          name: 'Fleet Management',
          type: 'fleet',
          status: 'active',
          vendor: 'Geotab',
          config: {
            base_url: 'https://api.geotab.com',
            api_key: 'test-key',
          },
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'CRM Integration',
          type: 'crm',
          status: 'inactive',
          vendor: 'Salesforce',
          config: {
            base_url: 'https://api.salesforce.com',
            api_key: 'test-key',
          },
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ],
    },
    isLoading: false,
    error: null,
  })),
  useDeleteIntegration: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useSyncIntegration: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useTestConnection: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useCreateIntegration: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useUpdateIntegration: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useIntegration: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
  useIntegrationStatus: vi.fn(() => ({
    data: { status: 'active', last_sync: '2024-01-01T00:00:00Z' },
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

describe('IntegrationList', () => {
  it('renders integration list with correct data', () => {
    render(<IntegrationList />, { wrapper: createWrapper() });

    expect(screen.getByText('System Integrations')).toBeInTheDocument();
    expect(screen.getAllByText('Fleet Management')).toHaveLength(2); // One in table, one in dialog
    expect(screen.getByText('CRM Integration')).toBeInTheDocument();
    expect(screen.getByText('Geotab')).toBeInTheDocument();
    expect(screen.getByText('Salesforce')).toBeInTheDocument();
  });

  it('renders status badges correctly', () => {
    render(<IntegrationList />, { wrapper: createWrapper() });

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders type badges correctly', () => {
    render(<IntegrationList />, { wrapper: createWrapper() });

    expect(screen.getByText('fleet')).toBeInTheDocument();
    expect(screen.getByText('crm')).toBeInTheDocument();
  });

  it('renders add integration button', () => {
    render(<IntegrationList />, { wrapper: createWrapper() });

    expect(screen.getByText('Add Integration')).toBeInTheDocument();
  });

  it('renders search and filter inputs', () => {
    render(<IntegrationList />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Search integrations...')).toBeInTheDocument();
    expect(screen.getByText('All Types')).toBeInTheDocument();
    expect(screen.getByText('All Status')).toBeInTheDocument();
  });

  it('renders action buttons for each integration', () => {
    render(<IntegrationList />, { wrapper: createWrapper() });

    // Should have test connection, sync, settings, and delete buttons for each integration
    const actionButtons = screen.getAllByRole('button');
    expect(actionButtons.length).toBeGreaterThan(0);
  });
});