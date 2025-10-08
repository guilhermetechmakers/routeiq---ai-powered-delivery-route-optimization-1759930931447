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
import { useUpdateIntegration, useTestConnection, useSyncIntegration } from '@/hooks/useIntegrations';
import type { Integration, IntegrationType, IntegrationStatus } from '@/types/integration';
import { cn } from '@/lib/utils';

const editIntegrationSchema = z.object({
  name: z.string().min(1, 'Integration name is required'),
  status: z.enum(['active', 'inactive', 'error', 'pending']),
  config: z.object({
    api_key: z.string().optional(),
    api_secret: z.string().optional(),
    base_url: z.string().min(1, 'Base URL is required'),
    webhook_url: z.string().optional(),
    sync_frequency: z.number().min(1).max(1440).optional(),
  }),
});

type EditIntegrationForm = z.infer<typeof editIntegrationSchema>;

interface EditIntegrationDialogProps {
  integration: Integration;
  onClose: () => void;
}

export function EditIntegrationDialog({ integration, onClose }: EditIntegrationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateIntegration = useUpdateIntegration();
  const testConnection = useTestConnection();
  const syncIntegration = useSyncIntegration();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EditIntegrationForm>({
    resolver: zodResolver(editIntegrationSchema),
    defaultValues: {
      name: integration.name,
      status: integration.status,
      config: {
        api_key: integration.config.api_key || '',
        api_secret: integration.config.api_secret || '',
        base_url: integration.config.base_url || '',
        webhook_url: integration.config.webhook_url || '',
        sync_frequency: integration.config.sync_frequency || 60,
      },
    },
  });

  const watchedStatus = watch('status');

  // Reset form when integration changes
  useEffect(() => {
    reset({
      name: integration.name,
      status: integration.status,
      config: {
        api_key: integration.config.api_key || '',
        api_secret: integration.config.api_secret || '',
        base_url: integration.config.base_url || '',
        webhook_url: integration.config.webhook_url || '',
        sync_frequency: integration.config.sync_frequency || 60,
      },
    });
  }, [integration, reset]);

  const onSubmit = async (data: EditIntegrationForm) => {
    setIsSubmitting(true);
    try {
      await updateIntegration.mutateAsync({
        id: integration.id,
        updates: data,
      });
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      await testConnection.mutateAsync(integration.id);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleSyncIntegration = async () => {
    try {
      await syncIntegration.mutateAsync(integration.id);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const getStatusDescription = (status: IntegrationStatus) => {
    switch (status) {
      case 'active':
        return 'Integration is active and syncing data';
      case 'inactive':
        return 'Integration is disabled and not syncing';
      case 'error':
        return 'Integration has encountered an error';
      case 'pending':
        return 'Integration is being set up';
      default:
        return '';
    }
  };

  const getTypeIcon = (type: IntegrationType) => {
    switch (type) {
      case 'fleet':
        return '🚛';
      case 'crm':
        return '👥';
      case 'fuel':
        return '⛽';
      case 'custom_api':
        return '🔗';
      default:
        return '🔧';
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Integration</DialogTitle>
          <DialogDescription>
            Update configuration and settings for the {integration.name} integration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Integration Name *</Label>
              <Input
                id="name"
                placeholder="My Fleet Integration"
                {...register('name')}
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watchedStatus}
                onValueChange={(value: IntegrationStatus) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      <span>Active</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-gray-500 rounded-full" />
                      <span>Inactive</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="error">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full" />
                      <span>Error</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                      <span>Pending</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {getStatusDescription(watchedStatus)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Configuration</h4>
            
            <div className="space-y-2">
              <Label htmlFor="base_url">Base URL *</Label>
              <Input
                id="base_url"
                placeholder="https://api.example.com"
                {...register('config.base_url')}
                className={cn(errors.config?.base_url && 'border-destructive')}
              />
              {errors.config?.base_url && (
                <p className="text-sm text-destructive">{errors.config.base_url.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="api_key">API Key</Label>
                <Input
                  id="api_key"
                  type="password"
                  placeholder="Enter API key"
                  {...register('config.api_key')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api_secret">API Secret</Label>
                <Input
                  id="api_secret"
                  type="password"
                  placeholder="Enter API secret"
                  {...register('config.api_secret')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook_url">Webhook URL</Label>
              <Input
                id="webhook_url"
                placeholder="https://your-app.com/webhook"
                {...register('config.webhook_url')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sync_frequency">Sync Frequency (minutes)</Label>
              <Input
                id="sync_frequency"
                type="number"
                min="1"
                max="1440"
                placeholder="60"
                {...register('config.sync_frequency', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">
                How often to sync data (1-1440 minutes)
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Integration Actions</h4>
                <p className="text-sm text-muted-foreground">
                  Test connection and sync data
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testConnection.isPending}
                >
                  {testConnection.isPending ? (
                    <motion.div
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Testing...</span>
                    </motion.div>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSyncIntegration}
                  disabled={syncIntegration.isPending}
                >
                  {syncIntegration.isPending ? (
                    <motion.div
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Syncing...</span>
                    </motion.div>
                  ) : (
                    'Sync Now'
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-sm">
              <div className="font-medium">Integration Information</div>
              <div className="text-muted-foreground space-y-1 mt-1">
                <div className="flex items-center space-x-2">
                  <span>{getTypeIcon(integration.type)}</span>
                  <span>Type: {integration.type.replace('_', ' ')}</span>
                </div>
                {integration.vendor && (
                  <div>Vendor: {integration.vendor}</div>
                )}
                <div>Created: {new Date(integration.created_at).toLocaleDateString()}</div>
                <div>Last updated: {new Date(integration.updated_at).toLocaleDateString()}</div>
                {integration.last_sync && (
                  <div>Last sync: {new Date(integration.last_sync).toLocaleDateString()}</div>
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
              disabled={isSubmitting || updateIntegration.isPending}
            >
              {isSubmitting || updateIntegration.isPending ? (
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </motion.div>
              ) : (
                'Update Integration'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}