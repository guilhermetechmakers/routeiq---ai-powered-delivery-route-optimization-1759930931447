import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AnimatedPage } from "@/components/AnimatedPage";

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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="routeiq-theme">
        <BrowserRouter>
          <AnimatedPage>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/route/:id" element={<RouteOverview />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/reset-password" element={<PasswordReset />} />
              <Route path="/reports" element={<PerformanceReports />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/500" element={<ServerError />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatedPage>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
