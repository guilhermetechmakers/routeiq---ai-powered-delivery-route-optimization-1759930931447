import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainNav } from "@/components/layout/MainNav";
import { AdminGuard, DispatcherGuard } from "@/components/guards/RoleGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Import pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import RouteOverview from "@/pages/RouteOverview";
import Settings from "@/pages/Settings";
import About from "@/pages/About";
import EmailVerification from "@/pages/EmailVerification";
import PasswordReset from "@/pages/PasswordReset";
import PerformanceReports from "@/pages/PerformanceReports";
import NotFound from "@/pages/NotFound";
import ServerError from "@/pages/ServerError";
import UserProfile from "@/pages/UserProfile";
import AdminUsers from "@/pages/AdminUsers";
import Integrations from "@/pages/Integrations";
import Help from "@/pages/Help";

// React Query client with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Layout wrapper component
function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav
        userRole={user?.role || 'driver'}
        userName={user?.full_name || 'User'}
        userAvatar={user?.avatar_url}
        notificationCount={0} // This would come from notifications API
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="routeiq-theme">
          <AuthProvider>
            <BrowserRouter>
              <AnimatedPage>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-email" element={<EmailVerification />} />
                  <Route path="/reset-password" element={<PasswordReset />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/500" element={<ServerError />} />
                  <Route path="*" element={<NotFound />} />
                  
                  {/* Protected routes with navigation */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/route/:id" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <RouteOverview />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Settings />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <DispatcherGuard>
                          <PerformanceReports />
                        </DispatcherGuard>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <UserProfile />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AdminGuard>
                          <AdminUsers />
                        </AdminGuard>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/integrations" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AdminGuard>
                          <Integrations />
                        </AdminGuard>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/help" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Help />
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                </Routes>
              </AnimatedPage>
            </BrowserRouter>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
