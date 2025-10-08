import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useAuth';
import type { UserRole } from '@/types/user';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredRole?: UserRole;
  userRole?: UserRole;
  fallbackPath?: string;
}

export function RoleGuard({ 
  children, 
  allowedRoles,
  requiredRole,
  userRole,
  fallbackPath = '/login' 
}: RoleGuardProps) {
  const location = useLocation();
  const { data: user, isLoading } = useCurrentUser();

  // Determine the effective role to check
  const effectiveUserRole = userRole || user?.user?.role;
  
  // Determine the allowed roles
  const effectiveAllowedRoles = allowedRoles || (requiredRole ? [requiredRole] : []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // If no user or user role not in allowed roles, redirect
  if (!effectiveUserRole || !effectiveAllowedRoles.includes(effectiveUserRole)) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminGuard({ children, fallbackPath }: { children: ReactNode; fallbackPath?: string }) {
  return (
    <RoleGuard allowedRoles={['admin']} fallbackPath={fallbackPath}>
      {children}
    </RoleGuard>
  );
}

export function DispatcherGuard({ children, fallbackPath }: { children: ReactNode; fallbackPath?: string }) {
  return (
    <RoleGuard allowedRoles={['admin', 'dispatcher']} fallbackPath={fallbackPath}>
      {children}
    </RoleGuard>
  );
}

export function DriverGuard({ children, fallbackPath }: { children: ReactNode; fallbackPath?: string }) {
  return (
    <RoleGuard allowedRoles={['admin', 'dispatcher', 'driver']} fallbackPath={fallbackPath}>
      {children}
    </RoleGuard>
  );
}