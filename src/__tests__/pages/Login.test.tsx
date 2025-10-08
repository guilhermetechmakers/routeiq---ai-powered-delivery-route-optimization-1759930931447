import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, describe, it } from "vitest";
import Login from "@/pages/Login";

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

describe("Login Page", () => {
  it("renders the login form", () => {
    render(<Login />, { wrapper: createTestWrapper() });
    
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account to continue optimizing routes")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders form validation errors", async () => {
    render(<Login />, { wrapper: createTestWrapper() });
    
    const submitButton = screen.getByText("Sign In");
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
    });
  });

  it("renders navigation links", () => {
    render(<Login />, { wrapper: createTestWrapper() });
    
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByText("Back to Home")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<Login />, { wrapper: createTestWrapper() });
    
    const passwordInput = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button", { name: "" });
    
    expect(passwordInput).toHaveAttribute("type", "password");
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("renders remember me checkbox", () => {
    render(<Login />, { wrapper: createTestWrapper() });
    
    expect(screen.getByLabelText("Remember me")).toBeInTheDocument();
  });
});
