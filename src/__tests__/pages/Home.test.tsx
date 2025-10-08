import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, describe, it } from "vitest";
import Home from "@/pages/Home";

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("Home Page", () => {
  it("renders the hero section with title and description", () => {
    render(<Home />, { wrapper: createTestWrapper() });
    
    expect(screen.getByText("AI-Powered Delivery")).toBeInTheDocument();
    expect(screen.getByText("Route Optimization")).toBeInTheDocument();
    expect(screen.getByText(/Maximize delivery efficiency with intelligent route planning/)).toBeInTheDocument();
  });

  it("renders call-to-action buttons", () => {
    render(<Home />, { wrapper: createTestWrapper() });
    
    expect(screen.getAllByText("Start Free Trial")).toHaveLength(2);
    expect(screen.getByText("Learn More")).toBeInTheDocument();
  });

  it("renders features section", () => {
    render(<Home />, { wrapper: createTestWrapper() });
    
    expect(screen.getByText("Powerful Features for Modern Logistics")).toBeInTheDocument();
    expect(screen.getByText("AI-Powered Route Optimization")).toBeInTheDocument();
    expect(screen.getByText("Real-Time Updates")).toBeInTheDocument();
  });

  it("renders testimonials section", () => {
    render(<Home />, { wrapper: createTestWrapper() });
    
    expect(screen.getByText("Trusted by Industry Leaders")).toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("Mike Chen")).toBeInTheDocument();
  });

  it("renders stats section", () => {
    render(<Home />, { wrapper: createTestWrapper() });
    
    expect(screen.getByText("1M+")).toBeInTheDocument();
    expect(screen.getByText("Routes Optimized")).toBeInTheDocument();
    expect(screen.getByText("500K+ Gallons")).toBeInTheDocument();
    expect(screen.getByText("Fuel Saved")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Home />, { wrapper: createTestWrapper() });
    
    expect(screen.getAllByText("About")).toHaveLength(2);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("renders footer with company information", () => {
    render(<Home />, { wrapper: createTestWrapper() });
    
    expect(screen.getAllByText("RouteIQ")).toHaveLength(2);
    expect(screen.getByText("AI-powered delivery route optimization for modern logistics companies.")).toBeInTheDocument();
    expect(screen.getByText("© 2024 RouteIQ. All rights reserved.")).toBeInTheDocument();
  });
});
