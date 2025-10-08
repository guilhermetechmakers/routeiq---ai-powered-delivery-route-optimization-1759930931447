import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/hooks/useNotifications';
import { toast } from 'sonner';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react';

interface NotificationPreferencesProps {}

export function NotificationPreferences({}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: false,
    delivery_updates: true,
    route_changes: true,
    system_alerts: true,
    performance_reports: false,
    optimization_suggestions: true,
  });

  const { data: currentPreferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  useEffect(() => {
    if (currentPreferences) {
      setPreferences(currentPreferences);
    }
  }, [currentPreferences]);

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSavePreferences = async () => {
    try {
      await updatePreferences.mutateAsync(preferences);
      toast.success('Notification preferences updated successfully!');
    } catch (error) {
      toast.error('Failed to update notification preferences');
    }
  };

  const notificationTypes = [
    {
      key: 'email',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: Mail,
      color: 'text-blue-600'
    },
    {
      key: 'push',
      label: 'Push Notifications',
      description: 'Receive push notifications in the app',
      icon: Smartphone,
      color: 'text-green-600'
    },
    {
      key: 'sms',
      label: 'SMS Notifications',
      description: 'Receive notifications via SMS (charges may apply)',
      icon: MessageSquare,
      color: 'text-orange-600'
    }
  ];

  const notificationCategories = [
    {
      key: 'delivery_updates',
      label: 'Delivery Updates',
      description: 'Real-time updates on delivery status and progress',
      icon: CheckCircle,
      color: 'text-green-600',
      priority: 'high'
    },
    {
      key: 'route_changes',
      label: 'Route Changes',
      description: 'Notifications when routes are modified or optimized',
      icon: Settings,
      color: 'text-blue-600',
      priority: 'high'
    },
    {
      key: 'system_alerts',
      label: 'System Alerts',
      description: 'Important system notifications and maintenance alerts',
      icon: AlertTriangle,
      color: 'text-red-600',
      priority: 'urgent'
    },
    {
      key: 'performance_reports',
      label: 'Performance Reports',
      description: 'Weekly and monthly performance summaries',
      icon: Info,
      color: 'text-purple-600',
      priority: 'low'
    },
    {
      key: 'optimization_suggestions',
      label: 'Optimization Suggestions',
      description: 'AI-powered suggestions to improve route efficiency',
      icon: Zap,
      color: 'text-yellow-600',
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading preferences...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Notification Preferences</h2>
          <p className="text-muted-foreground">Manage how you receive notifications</p>
        </div>
        <Button
          onClick={handleSavePreferences}
          disabled={updatePreferences.isPending}
          className="bg-primary hover:bg-primary/90"
        >
          {updatePreferences.isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>

      {/* Notification Channels */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notification Channels
        </h3>
        <div className="space-y-4">
          {notificationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${type.color}`} />
                  <div>
                    <h4 className="font-medium text-foreground">{type.label}</h4>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
                <Switch
                  checked={preferences[type.key as keyof typeof preferences]}
                  onCheckedChange={(checked) => handlePreferenceChange(type.key, checked)}
                />
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Notification Categories */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Notification Categories
        </h3>
        <div className="space-y-4">
          {notificationCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${category.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">{category.label}</h4>
                      <Badge className={`text-xs ${getPriorityColor(category.priority)}`}>
                        {category.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <Switch
                  checked={preferences[category.key as keyof typeof preferences]}
                  onCheckedChange={(checked) => handlePreferenceChange(category.key, checked)}
                />
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Notification Frequency */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Notification Frequency</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Real-time Updates</h4>
              <p className="text-sm text-muted-foreground">Receive notifications immediately as events occur</p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Enabled
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Digest Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive a summary of notifications every 4 hours</p>
            </div>
            <Badge variant="outline">
              Disabled
            </Badge>
          </div>
        </div>
      </Card>

      {/* Quiet Hours */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quiet Hours</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Enable Quiet Hours</h4>
              <p className="text-sm text-muted-foreground">Pause non-urgent notifications during specified hours</p>
            </div>
            <Switch />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiet-start">Start Time</Label>
              <input
                id="quiet-start"
                type="time"
                defaultValue="22:00"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div>
              <Label htmlFor="quiet-end">End Time</Label>
              <input
                id="quiet-end"
                type="time"
                defaultValue="07:00"
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
