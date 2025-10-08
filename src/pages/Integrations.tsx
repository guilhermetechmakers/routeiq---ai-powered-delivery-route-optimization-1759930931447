import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IntegrationList } from '@/components/integrations/IntegrationList';
import { IntegrationDetail } from '@/components/integrations/IntegrationDetail';
import { EditIntegrationDialog } from '@/components/integrations/EditIntegrationDialog';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { useIntegrations } from '@/hooks/useIntegrations';
import type { Integration } from '@/types/integration';

export default function Integrations() {
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  // Mock user role - in real app this would come from auth context
  const userRole = 'admin' as const;

  const { data: integrationsResponse } = useIntegrations();
  const integrations = integrationsResponse?.data || [];
  const selectedIntegration = integrations.find(integration => integration.id === selectedIntegrationId);

  const handleIntegrationSelect = (integration: Integration) => {
    setSelectedIntegrationId(integration.id);
    setActiveTab('detail');
  };

  const handleEditIntegration = (integration: Integration) => {
    setEditingIntegration(integration);
  };

  const handleCloseEdit = () => {
    setEditingIntegration(null);
  };

  return (
    <RoleGuard requiredRole="admin" userRole={userRole}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">System Integrations</h1>
            <p className="text-muted-foreground">
              Connect RouteIQ with your existing systems and services to streamline operations
            </p>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Integration List</TabsTrigger>
              <TabsTrigger value="detail" disabled={!selectedIntegration}>
                Integration Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <IntegrationList
                onIntegrationSelect={handleIntegrationSelect}
                selectedIntegrationId={selectedIntegrationId || undefined}
              />
            </TabsContent>

            <TabsContent value="detail" className="space-y-6">
              {selectedIntegration ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <IntegrationDetail
                    integration={selectedIntegration}
                    onEdit={() => handleEditIntegration(selectedIntegration)}
                  />
                </motion.div>
              ) : (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <p className="text-lg">No integration selected</p>
                    <p className="text-sm">Select an integration from the list to view details</p>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Edit Integration Dialog */}
          {editingIntegration && (
            <EditIntegrationDialog
              integration={editingIntegration}
              onClose={handleCloseEdit}
            />
          )}
        </motion.div>
      </div>
    </RoleGuard>
  );
}