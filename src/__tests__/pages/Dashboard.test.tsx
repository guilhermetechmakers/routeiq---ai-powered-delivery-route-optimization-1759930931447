import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "@/pages/Dashboard";
import { vi, expect, describe, it } from "vitest";

// Mock the auth context

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Mock the hooks
vi.mock("@/hooks/useRoutes", () => ({
  useRoutes: () => ({
    data: {
      data: [
        {
          id: "1",
          name: "Test Route",
          driver_id: "driver1",
          status: "active",
          stops: [
            { id: "1", sequence: 1, address: "123 Main St", status: "completed", estimated_arrival: "10:00 AM" },
            { id: "2", sequence: 2, address: "456 Oak Ave", status: "in_progress", estimated_arrival: "11:00 AM" }
          ],
          total_distance: 15.5,
          total_duration: 90,
          metadata: { optimization_score: 85 }
        }
      ]
    },
    isLoading: false,
    error: null
  }),
  useOptimizeRoute: () => ({
    mutate: vi.fn(),
    isPending: false
  })
}));

vi.mock("@/hooks/useWeather", () => ({
  useWeatherAlerts: () => ({ data: [] }),
  useRouteWeatherImpact: () => ({ data: null })
}));

vi.mock("@/api/websocket", () => ({
  useWebSocket: () => ({
    isConnected: () => true,
    subscribe: vi.fn(() => vi.fn()), // Return unsubscribe function
    reconnect: vi.fn()
  })
}));

describe("Dashboard Page", () => {
  it("renders the dashboard header", () => {
    render(<Dashboard />, { wrapper: createTestWrapper() });
    
    expect(screen.getByText("RouteIQ Dashboard")).toBeInTheDocument();
  });

  it("renders stats cards", () => {
    render(<Dashboard />, { wrapper: createTestWrapper() });
    
    expect(screen.getByText("Total Routes")).toBeInTheDocument();
    expect(screen.getAllByText("Active Routes")).toHaveLength(2);
    expect(screen.getByText("Completed Today")).toBeInTheDocument();
    expect(screen.getByText("Avg Efficiency")).toBeInTheDocument();
  });

  it("renders tabs navigation", () => {
    render(<Dashboard />, { wrapper: createTestWrapper() });
    
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Routes")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("renders routes list", () => {
    render(<Dashboard />, { wrapper: createTestWrapper() });
    
    expect(screen.getAllByText("Active Routes")).toHaveLength(2);
    expect(screen.getByText("Test Route")).toBeInTheDocument();
  });

  it("renders notifications section", () => {
    render(<Dashboard />, { wrapper: createTestWrapper() });
    
    expect(screen.getByText("Live Notifications")).toBeInTheDocument();
  });
});
