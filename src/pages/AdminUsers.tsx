import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserList } from '@/components/admin/UserList';
import { UserDetail } from '@/components/admin/UserDetail';
import { EditUserDialog } from '@/components/admin/EditUserDialog';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import type { User } from '@/types/user';

export default function AdminUsers() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  // Mock user role - in real app this would come from auth context
  const userRole = 'admin' as const;

  const { data: usersResponse } = useAdminUsers();
  const users = usersResponse?.data || [];
  const selectedUser = users.find(user => user.id === selectedUserId);

  const handleUserSelect = (user: User) => {
    setSelectedUserId(user.id);
    setActiveTab('detail');
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
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
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts, roles, and permissions for your organization
            </p>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">User List</TabsTrigger>
              <TabsTrigger value="detail" disabled={!selectedUser}>
                User Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <UserList
                onUserSelect={handleUserSelect}
                selectedUserId={selectedUserId || undefined}
              />
            </TabsContent>

            <TabsContent value="detail" className="space-y-6">
              {selectedUser ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserDetail
                    user={selectedUser}
                    onEdit={() => handleEditUser(selectedUser)}
                  />
                </motion.div>
              ) : (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <p className="text-lg">No user selected</p>
                    <p className="text-sm">Select a user from the list to view details</p>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Edit User Dialog */}
          {editingUser && (
            <EditUserDialog
              user={editingUser}
              onClose={handleCloseEdit}
            />
          )}
        </motion.div>
      </div>
    </RoleGuard>
  );
}