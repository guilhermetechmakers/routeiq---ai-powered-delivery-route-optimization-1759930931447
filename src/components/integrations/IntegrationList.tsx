import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Search,
  Plus,
  Settings,
  Trash2,
  Pause,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useIntegrations, useDeleteIntegration, useSyncIntegration, useTestConnection } from '@/hooks/useIntegrations';
import { CreateIntegrationDialog } from './CreateIntegrationDialog';
import { EditIntegrationDialog } from './EditIntegrationDialog';
import type { Integration, IntegrationType, IntegrationStatus } from '@/types/integration';
import { cn } from '@/lib/utils';

interface IntegrationListProps {
  onIntegrationSelect?: (integration: Integration) => void;
  selectedIntegrationId?: string;
}

export function IntegrationList({ onIntegrationSelect, selectedIntegrationId }: IntegrationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);

  const { data: integrationsResponse, isLoading, error } = useIntegrations({
    search: searchQuery,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: 1,
    limit: 50,
  });

  const deleteIntegration = useDeleteIntegration();
  const syncIntegration = useSyncIntegration();
  const testConnection = useTestConnection();

  const integrations = integrationsResponse?.data || [];

  const handleDeleteIntegration = async (integrationId: string) => {
    try {
      await deleteIntegration.mutateAsync(integrationId);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleSyncIntegration = async (integrationId: string) => {
    try {
      await syncIntegration.mutateAsync(integrationId);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleTestConnection = async (integrationId: string) => {
    try {
      await testConnection.mutateAsync(integrationId);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

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
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <Pause className="h-4 w-4 text-gray-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Integrations</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </div>
        <Card className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Integrations</h2>
        </div>
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            <p>Failed to load integrations. Please try again.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Integrations</h2>
          <p className="text-muted-foreground">
            Connect RouteIQ with your existing systems and services
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <CreateIntegrationDialog onClose={() => setIsCreateDialogOpen(false)} />
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fleet">Fleet</SelectItem>
              <SelectItem value="crm">CRM</SelectItem>
              <SelectItem value="fuel">Fuel</SelectItem>
              <SelectItem value="custom_api">Custom API</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Integrations Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Integration</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No integrations found
                </TableCell>
              </TableRow>
            ) : (
              integrations.map((integration) => (
                <tr
                  key={integration.id}
                  className={cn(
                    "hover:bg-muted/50 cursor-pointer transition-colors",
                    selectedIntegrationId === integration.id && "bg-muted"
                  )}
                  onClick={() => onIntegrationSelect?.(integration)}
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getTypeIcon(integration.type)}
                      </div>
                      <div>
                        <div className="font-medium">{integration.name}</div>
                        {integration.vendor && (
                          <div className="text-sm text-muted-foreground">
                            {integration.vendor}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {integration.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(integration.status)}
                      {getStatusBadge(integration.status)}
                    </div>
                    {integration.error_message && (
                      <div className="text-xs text-red-600 mt-1">
                        {integration.error_message}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {integration.last_sync 
                        ? new Date(integration.last_sync).toLocaleDateString()
                        : 'Never'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(integration.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestConnection(integration.id);
                        }}
                        disabled={testConnection.isPending}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSyncIntegration(integration.id);
                        }}
                        disabled={syncIntegration.isPending}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingIntegration(integration);
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Integration</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the {integration.name} integration? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteIntegration(integration.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </tr>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Integration Dialog */}
      {editingIntegration && (
        <EditIntegrationDialog
          integration={editingIntegration}
          onClose={() => setEditingIntegration(null)}
        />
      )}
    </div>
  );
}