import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUpdateUser } from '@/hooks/useAdminUsers';
import type { User, UserRole } from '@/types/user';
import { cn } from '@/lib/utils';

const editUserSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'dispatcher', 'driver']),
  is_verified: z.boolean(),
});

type EditUserForm = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  user: User;
  onClose: () => void;
}

export function EditUserDialog({ user, onClose }: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      full_name: user.full_name || '',
      phone: user.phone || '',
      role: user.role,
      is_verified: user.is_verified,
    },
  });

  const watchedRole = watch('role');
  const watchedIsVerified = watch('is_verified');

  // Reset form when user changes
  useEffect(() => {
    reset({
      full_name: user.full_name || '',
      phone: user.phone || '',
      role: user.role,
      is_verified: user.is_verified,
    });
  }, [user, reset]);

  const onSubmit = async (data: EditUserForm) => {
    setIsSubmitting(true);
    try {
      await updateUser.mutateAsync({
        id: user.id,
        updates: data,
      });
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Full system access, can manage users and settings';
      case 'dispatcher':
        return 'Can manage routes and drivers, view reports';
      case 'driver':
        return 'Can view assigned routes and update status';
      default:
        return '';
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions for {user.email}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email address cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              placeholder="John Doe"
              {...register('full_name')}
              className={cn(errors.full_name && 'border-destructive')}
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...register('phone')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={watchedRole}
              onValueChange={(value: UserRole) => setValue('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex flex-col">
                    <span>Admin</span>
                    <span className="text-xs text-muted-foreground">
                      Full system access
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="dispatcher">
                  <div className="flex flex-col">
                    <span>Dispatcher</span>
                    <span className="text-xs text-muted-foreground">
                      Manage routes and drivers
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="driver">
                  <div className="flex flex-col">
                    <span>Driver</span>
                    <span className="text-xs text-muted-foreground">
                      View assigned routes
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {watchedRole && (
              <p className="text-xs text-muted-foreground">
                {getRoleDescription(watchedRole)}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_verified"
              checked={watchedIsVerified}
              onCheckedChange={(checked) => setValue('is_verified', checked)}
            />
            <Label htmlFor="is_verified">
              Email verified
            </Label>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-sm">
              <div className="font-medium">Account Information</div>
              <div className="text-muted-foreground space-y-1 mt-1">
                <div>Created: {new Date(user.created_at).toLocaleDateString()}</div>
                <div>Last updated: {new Date(user.updated_at).toLocaleDateString()}</div>
                {user.last_login && (
                  <div>Last login: {new Date(user.last_login).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || updateUser.isPending}
            >
              {isSubmitting || updateUser.isPending ? (
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </motion.div>
              ) : (
                'Update User'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}