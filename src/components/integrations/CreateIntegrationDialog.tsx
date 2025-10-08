import { useState } from 'react';
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
import { useCreateIntegration } from '@/hooks/useIntegrations';
import { INTEGRATION_VENDORS } from '@/types/integration';
import type { IntegrationType } from '@/types/integration';
import { cn } from '@/lib/utils';

const createIntegrationSchema = z.object({
  name: z.string().min(1, 'Integration name is required'),
  type: z.enum(['fleet', 'crm', 'fuel', 'custom_api']),
  vendor: z.string().optional(),
  config: z.object({
    api_key: z.string().optional(),
    api_secret: z.string().optional(),
    base_url: z.string().min(1, 'Base URL is required'),
    webhook_url: z.string().optional(),
    sync_frequency: z.number().min(1).max(1440).optional(),
  }),
});

type CreateIntegrationForm = z.infer<typeof createIntegrationSchema>;

interface CreateIntegrationDialogProps {
  onClose: () => void;
}

export function CreateIntegrationDialog({ onClose }: CreateIntegrationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createIntegration = useCreateIntegration();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateIntegrationForm>({
    resolver: zodResolver(createIntegrationSchema),
    defaultValues: {
      type: 'fleet',
      config: {
        sync_frequency: 60,
      },
    },
  });

  const watchedType = watch('type');
  const watchedVendor = watch('vendor');

  // Update type when selection changes
  const handleTypeChange = (type: IntegrationType) => {
    setValue('type', type);
    setValue('vendor', ''); // Reset vendor when type changes
  };

  // Get vendors for selected type
  const availableVendors = INTEGRATION_VENDORS.filter(vendor => vendor.type === watchedType);
  const selectedVendor = availableVendors.find(vendor => vendor.id === watchedVendor);

  const onSubmit = async (data: CreateIntegrationForm) => {
    setIsSubmitting(true);
    try {
      await createIntegration.mutateAsync(data);
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeDescription = (type: IntegrationType) => {
    switch (type) {
      case 'fleet':
        return 'Connect to fleet management systems for vehicle tracking and management';
      case 'crm':
        return 'Integrate with customer relationship management systems';
      case 'fuel':
        return 'Connect to fuel management and monitoring systems';
      case 'custom_api':
        return 'Connect to your custom API endpoint';
      default:
        return '';
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Integration</DialogTitle>
          <DialogDescription>
            Connect RouteIQ with your existing systems and services to streamline operations.
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
              <Label htmlFor="type">Integration Type *</Label>
              <Select
                value={watchedType}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select integration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fleet">
                    <div className="flex items-center space-x-2">
                      <span>🚛</span>
                      <span>Fleet Management</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="crm">
                    <div className="flex items-center space-x-2">
                      <span>👥</span>
                      <span>CRM</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="fuel">
                    <div className="flex items-center space-x-2">
                      <span>⛽</span>
                      <span>Fuel Management</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="custom_api">
                    <div className="flex items-center space-x-2">
                      <span>🔗</span>
                      <span>Custom API</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {getTypeDescription(watchedType)}
              </p>
            </div>
          </div>

          {availableVendors.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor (Optional)</Label>
              <Select
                value={watchedVendor || ''}
                onValueChange={(value) => setValue('vendor', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground">No specific vendor</span>
                  </SelectItem>
                  {availableVendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      <div className="flex items-center space-x-2">
                        <span>{vendor.name}</span>
                        {vendor.description && (
                          <span className="text-xs text-muted-foreground">
                            - {vendor.description}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
                {selectedVendor?.required_fields.includes('api_key') && (
                  <p className="text-xs text-muted-foreground">Required for {selectedVendor.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="api_secret">API Secret</Label>
                <Input
                  id="api_secret"
                  type="password"
                  placeholder="Enter API secret"
                  {...register('config.api_secret')}
                />
                {selectedVendor?.required_fields.includes('api_secret') && (
                  <p className="text-xs text-muted-foreground">Required for {selectedVendor.name}</p>
                )}
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
              disabled={isSubmitting || createIntegration.isPending}
            >
              {isSubmitting || createIntegration.isPending ? (
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </motion.div>
              ) : (
                'Create Integration'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}