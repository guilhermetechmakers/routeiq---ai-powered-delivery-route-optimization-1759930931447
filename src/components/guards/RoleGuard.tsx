import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: 'admin' | 'dispatcher' | 'driver';
  userRole?: 'admin' | 'dispatcher' | 'driver';
  fallbackPath?: string;
}

const roleHierarchy = {
  admin: 3,
  dispatcher: 2,
  driver: 1,
};

export function RoleGuard({ 
  children, 
  requiredRole, 
  userRole = 'driver', 
  fallbackPath = '/dashboard' 
}: RoleGuardProps) {
  // Check if user has sufficient role level
  const hasPermission = roleHierarchy[userRole] >= roleHierarchy[requiredRole];

  if (!hasPermission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Access Denied
              </h2>
              <p className="text-muted-foreground mt-2">
                You don't have permission to access this page. This feature requires{' '}
                <span className="font-medium capitalize">{requiredRole}</span> role or higher.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Your current role: {userRole}</span>
            </div>
            <div className="pt-4">
              <a
                href={fallbackPath}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}