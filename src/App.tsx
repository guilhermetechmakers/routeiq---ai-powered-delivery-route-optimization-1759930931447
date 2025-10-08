import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AnimatedPage } from "@/components/AnimatedPage";
import { MainNav } from "@/components/layout/MainNav";
import { AdminGuard, DispatcherGuard, DriverGuard } from "@/components/guards/RoleGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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

// Layout wrapper component
function AppLayout({ children }: { children: React.ReactNode }) {
  // Mock user data - in real app this would come from auth context
  const mockUser = {
    role: 'admin' as const,
    name: 'John Admin',
    avatar: undefined,
    notificationCount: 3,
  };

  const handleLogout = () => {
    // In real app, this would clear auth tokens and redirect
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav
        userRole={mockUser.role}
        userName={mockUser.name}
        userAvatar={mockUser.avatar}
        notificationCount={mockUser.notificationCount}
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
          <BrowserRouter>
            <AnimatedPage>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/reset-password" element={<PasswordReset />} />
              <Route path="/500" element={<ServerError />} />
              <Route path="*" element={<NotFound />} />
              {/* Protected routes with navigation */}
              <Route path="/dashboard" element={
                <AppLayout>
                  <DriverGuard>
                    <Dashboard />
                  </DriverGuard>
                </AppLayout>
              } />
              <Route path="/route/:id" element={
                <AppLayout>
                  <DriverGuard>
                    <RouteOverview />
                  </DriverGuard>
                </AppLayout>
              } />
              <Route path="/settings" element={
                <AppLayout>
                  <DriverGuard>
                    <Settings />
                  </DriverGuard>
                </AppLayout>
              } />
              <Route path="/about" element={
                <AppLayout>
                  <About />
                </AppLayout>
              } />
              <Route path="/reports" element={
                <AppLayout>
                  <DispatcherGuard>
                    <PerformanceReports />
                  </DispatcherGuard>
                </AppLayout>
              } />
              <Route path="/profile" element={
                <AppLayout>
                  <DriverGuard>
                    <UserProfile />
                  </DriverGuard>
                </AppLayout>
              } />
              <Route path="/admin/users" element={
                <AppLayout>
                  <AdminGuard>
                    <AdminUsers />
                  </AdminGuard>
                </AppLayout>
              } />
              <Route path="/integrations" element={
                <AppLayout>
                  <AdminGuard>
                    <Integrations />
                  </AdminGuard>
                </AppLayout>
              } />
              <Route path="/help" element={
                <AppLayout>
                  <Help />
                </AppLayout>
              } />
              </Routes>
            </AnimatedPage>
          </BrowserRouter>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
