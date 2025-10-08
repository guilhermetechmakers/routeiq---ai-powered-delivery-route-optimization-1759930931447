import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedButton } from "@/components/AnimatedButton";
import { 
  Truck, 
  MapPin,
  Edit,
  Save,
  Camera,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Activity,
  Settings,
  Shield,
  Bell
} from "lucide-react";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "John Smith",
    email: "john.smith@routeiq.com",
    phone: "+1 (555) 123-4567",
    company: "RouteIQ Logistics",
    role: "Dispatcher",
    avatar: "",
    address: "123 Main St, San Francisco, CA 94105",
    bio: "Experienced logistics professional with 5+ years in route optimization and fleet management.",
    join_date: "2022-03-15",
    last_login: "2024-12-22T08:30:00Z",
    status: "active"
  });

  // Mock performance data
  const performanceStats = {
    routes_completed: 156,
    efficiency_score: 89,
    on_time_rate: 94,
    total_distance: 1247.5,
    fuel_saved: 234.8,
    cost_savings: 2340.50
  };

  // Mock activity history
  const activityHistory = [
    {
      id: 1,
      action: "Completed route optimization",
      details: "Route #001 optimized for 15% efficiency improvement",
      timestamp: "2024-12-22T10:30:00Z",
      type: "route"
    },
    {
      id: 2,
      action: "Updated delivery status",
      details: "Marked 3 stops as completed on Route #002",
      timestamp: "2024-12-22T09:15:00Z",
      type: "delivery"
    },
    {
      id: 3,
      action: "Generated performance report",
      details: "Weekly report for December 16-22 generated",
      timestamp: "2024-12-21T16:45:00Z",
      type: "report"
    },
    {
      id: 4,
      action: "System login",
      details: "Logged in from Chrome on Windows",
      timestamp: "2024-12-21T08:00:00Z",
      type: "login"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "route":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "delivery":
        return <Clock className="h-4 w-4 text-green-500" />;
      case "report":
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case "login":
        return <Activity className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic
    console.log("Profile saved");
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload
      console.log("Avatar uploaded:", file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
                <h1 className="text-xl font-semibold text-foreground">Profile</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <AnimatedCard className="p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile.avatar} alt={profile.full_name} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary-hover transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {profile.full_name}
                  </h1>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {profile.status}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-2">
                  {profile.role} at {profile.company}
                </p>
                <p className="text-muted-foreground mb-4">
                  {profile.bio}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                  {isEditing && (
                    <AnimatedButton onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </AnimatedButton>
                  )}
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <AnimatedCard className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Personal Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        disabled={!isEditing}
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
                        disabled={!isEditing}
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
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Professional Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        disabled={!isEditing}
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
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                        rows={4}
                      />
                    </div>
                  </div>
                </AnimatedCard>
              </div>

              {/* Account Information */}
              <AnimatedCard className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Account Information</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(profile.join_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Last Login</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(profile.last_login).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Account Status</p>
                      <p className="text-sm text-muted-foreground capitalize">{profile.status}</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Routes Completed</p>
                      <p className="text-3xl font-bold text-foreground">{performanceStats.routes_completed}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Efficiency Score</p>
                      <p className="text-3xl font-bold text-foreground">{performanceStats.efficiency_score}%</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">On-Time Rate</p>
                      <p className="text-3xl font-bold text-foreground">{performanceStats.on_time_rate}%</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Distance</p>
                      <p className="text-3xl font-bold text-foreground">{performanceStats.total_distance}km</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Fuel Saved</p>
                      <p className="text-3xl font-bold text-foreground">{performanceStats.fuel_saved}L</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cost Savings</p>
                      <p className="text-3xl font-bold text-foreground">${performanceStats.cost_savings.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <AnimatedCard className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {activityHistory.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <AnimatedCard className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Change Password</h3>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Change
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Notification Preferences</h3>
                      <p className="text-sm text-muted-foreground">Manage your notification settings</p>
                    </div>
                    <Button variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </AnimatedCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}