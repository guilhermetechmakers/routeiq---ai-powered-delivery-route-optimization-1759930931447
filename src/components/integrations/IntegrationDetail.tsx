import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Settings,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Pause,
  Calendar,
  Activity,
  Edit,
} from 'lucide-react';
import { useTestConnection, useSyncIntegration } from '@/hooks/useIntegrations';
import type { Integration, IntegrationType, IntegrationStatus } from '@/types/integration';

interface IntegrationDetailProps {
  integration: Integration;
  onEdit?: () => void;
}

export function IntegrationDetail({ integration, onEdit }: IntegrationDetailProps) {
  const testConnection = useTestConnection();
  const syncIntegration = useSyncIntegration();

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'inactive':
        return <Pause className="h-5 w-5 text-gray-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">
            {getTypeIcon(integration.type)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{integration.name}</h2>
            {integration.vendor && (
              <p className="text-muted-foreground">{integration.vendor}</p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center space-x-1">
                {getStatusIcon(integration.status)}
                {getStatusBadge(integration.status)}
              </div>
              <Badge variant="outline" className="capitalize">
                {integration.type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={testConnection.isPending}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Test Connection
          </Button>
          <Button
            variant="outline"
            onClick={handleSyncIntegration}
            disabled={syncIntegration.isPending}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Now
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {integration.error_message && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-medium text-red-800">Integration Error</div>
              <div className="text-sm text-red-700">{integration.error_message}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Configuration</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-medium">Base URL</div>
              <div className="text-sm text-muted-foreground font-mono">
                {integration.config.base_url || 'Not configured'}
              </div>
            </div>
            <div>
              <div className="font-medium">Sync Frequency</div>
              <div className="text-sm text-muted-foreground">
                {integration.config.sync_frequency 
                  ? `${integration.config.sync_frequency} minutes`
                  : 'Not configured'
                }
              </div>
            </div>
          </div>
          
          {integration.config.webhook_url && (
            <div>
              <div className="font-medium">Webhook URL</div>
              <div className="text-sm text-muted-foreground font-mono">
                {integration.config.webhook_url}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-medium">API Key</div>
              <div className="text-sm text-muted-foreground">
                {integration.config.api_key 
                  ? '••••••••••••••••' 
                  : 'Not configured'
                }
              </div>
            </div>
            <div>
              <div className="font-medium">API Secret</div>
              <div className="text-sm text-muted-foreground">
                {integration.config.api_secret 
                  ? '••••••••••••••••' 
                  : 'Not configured'
                }
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Status Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Status Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Created</div>
              <div className="text-sm text-muted-foreground">
                {new Date(integration.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Last Updated</div>
              <div className="text-sm text-muted-foreground">
                {new Date(integration.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
          {integration.last_sync && (
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Last Sync</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(integration.last_sync).toLocaleDateString('en-US', {
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

      {/* Custom Fields */}
      {integration.config.custom_fields && Object.keys(integration.config.custom_fields).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Custom Configuration</h3>
          <div className="space-y-2">
            {Object.entries(integration.config.custom_fields).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                <span className="text-sm text-muted-foreground">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Integration Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button
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
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Test Connection
              </>
            )}
          </Button>
          <Button
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
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Configuration
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}