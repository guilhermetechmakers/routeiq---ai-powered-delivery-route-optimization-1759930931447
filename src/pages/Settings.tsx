import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedButton } from "@/components/AnimatedButton";
import { 
  Truck, 
  Bell, 
  Save,
  Phone,
  Mail
} from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    delivery_updates: true,
    route_changes: true,
    system_alerts: true,
    performance_reports: false,
    optimization_suggestions: true,
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "America/New_York",
    theme: "system",
    units: "metric",
  });

  const [profile, setProfile] = useState({
    full_name: "John Smith",
    email: "john.smith@routeiq.com",
    phone: "+1 (555) 123-4567",
    company: "RouteIQ Logistics",
    role: "Dispatcher",
  });

  const handleSave = () => {
    // Handle save logic
    console.log("Settings saved");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">RouteIQ</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-foreground">Settings</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <AnimatedCard className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Profile Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile.role}
                    disabled
                    className="mt-2"
                  />
                </div>
              </div>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <AnimatedCard className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                        </div>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="delivery-updates">Delivery Updates</Label>
                        <p className="text-sm text-muted-foreground">Updates about delivery status</p>
                      </div>
                      <Switch
                        id="delivery-updates"
                        checked={notifications.delivery_updates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, delivery_updates: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="route-changes">Route Changes</Label>
                        <p className="text-sm text-muted-foreground">Notifications when routes are modified</p>
                      </div>
                      <Switch
                        id="route-changes"
                        checked={notifications.route_changes}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, route_changes: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-alerts">System Alerts</Label>
                        <p className="text-sm text-muted-foreground">Important system notifications</p>
                      </div>
                      <Switch
                        id="system-alerts"
                        checked={notifications.system_alerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, system_alerts: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="performance-reports">Performance Reports</Label>
                        <p className="text-sm text-muted-foreground">Weekly performance summaries</p>
                      </div>
                      <Switch
                        id="performance-reports"
                        checked={notifications.performance_reports}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, performance_reports: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="optimization-suggestions">Optimization Suggestions</Label>
                        <p className="text-sm text-muted-foreground">AI-powered route improvement suggestions</p>
                      </div>
                      <Switch
                        id="optimization-suggestions"
                        checked={notifications.optimization_suggestions}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, optimization_suggestions: checked })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <AnimatedCard className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Preferences</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value) => setPreferences({ ...preferences, theme: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="units">Units</Label>
                  <Select value={preferences.units} onValueChange={(value) => setPreferences({ ...preferences, units: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (km, kg)</SelectItem>
                      <SelectItem value="imperial">Imperial (miles, lbs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <AnimatedCard className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Password</h3>
                  <Button variant="outline">Change Password</Button>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground mb-4">Manage your active login sessions</p>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </div>
            </AnimatedCard>
          </TabsContent>

          {/* Save Button */}
          <div className="flex justify-end">
            <AnimatedButton onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </AnimatedButton>
          </div>
        </Tabs>
      </div>
    </div>
  );
}