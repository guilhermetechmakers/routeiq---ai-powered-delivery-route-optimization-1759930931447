import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldX,
  Clock,
  Activity,
  Edit,
} from 'lucide-react';
import type { User as UserType, UserRole } from '@/types/user';
import { cn } from '@/lib/utils';

interface UserDetailProps {
  user: UserType;
  onEdit?: () => void;
}

export function UserDetail({ user, onEdit }: UserDetailProps) {
  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'dispatcher':
        return 'default';
      case 'driver':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'dispatcher':
        return <ShieldCheck className="h-4 w-4" />;
      case 'driver':
        return <ShieldX className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (user: UserType) => {
    if (user.is_verified) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
    }
    return <Badge variant="secondary">Pending Verification</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name || user.email}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-primary" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {user.full_name || 'No name provided'}
            </h2>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center w-fit">
                {getRoleIcon(user.role)}
                <span className="ml-1 capitalize">{user.role}</span>
              </Badge>
              {getStatusBadge(user)}
            </div>
          </div>
        </div>
        {onEdit && (
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </Button>
        )}
      </div>

      {/* Contact Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Email</div>
              <div className="text-muted-foreground">{user.email}</div>
            </div>
          </div>
          {user.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-muted-foreground">{user.phone}</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Account Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Created</div>
              <div className="text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Last Updated</div>
              <div className="text-muted-foreground">
                {new Date(user.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
          {user.last_login && (
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Last Login</div>
                <div className="text-muted-foreground">
                  {new Date(user.last_login).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Role Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Role & Permissions</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            {getRoleIcon(user.role)}
            <div>
              <div className="font-medium capitalize">{user.role} Role</div>
              <div className="text-sm text-muted-foreground">
                {user.role === 'admin' && 'Full system access, can manage users and settings'}
                {user.role === 'dispatcher' && 'Can manage routes and drivers, view reports'}
                {user.role === 'driver' && 'Can view assigned routes and update status'}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={cn(
              "h-2 w-2 rounded-full",
              user.is_verified ? "bg-green-500" : "bg-yellow-500"
            )} />
            <div>
              <div className="font-medium">
                {user.is_verified ? 'Verified Account' : 'Pending Verification'}
              </div>
              <div className="text-sm text-muted-foreground">
                {user.is_verified 
                  ? 'Email address has been verified'
                  : 'Email verification is pending'
                }
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      {user.preferences && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Language</span>
              <span className="text-muted-foreground">
                {user.preferences.language || 'English'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Timezone</span>
              <span className="text-muted-foreground">
                {user.preferences.timezone || 'UTC'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Theme</span>
              <span className="text-muted-foreground capitalize">
                {user.preferences.theme || 'System'}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}