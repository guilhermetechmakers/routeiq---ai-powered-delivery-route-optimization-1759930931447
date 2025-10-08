import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedButton } from "@/components/AnimatedButton";
import { 
  Truck, 
  Clock, 
  BarChart3, 
  Bell, 
  Settings, 
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Navigation,
  CheckCircle,
  XCircle,
  Pause
} from "lucide-react";

// Mock data - in real app this would come from API
const mockRoutes = [
  {
    id: "1",
    driver: "John Smith",
    status: "active",
    stops: 8,
    completed: 3,
    eta: "2h 15m",
    distance: "45.2 km",
    efficiency: 87,
    vehicle: "Truck #001"
  },
  {
    id: "2", 
    driver: "Sarah Johnson",
    status: "planned",
    stops: 12,
    completed: 0,
    eta: "3h 30m",
    distance: "67.8 km",
    efficiency: 92,
    vehicle: "Van #002"
  },
  {
    id: "3",
    driver: "Mike Chen",
    status: "paused",
    stops: 6,
    completed: 2,
    eta: "1h 45m",
    distance: "32.1 km",
    efficiency: 78,
    vehicle: "Truck #003"
  }
];

const mockNotifications = [
  {
    id: "1",
    type: "route_update",
    title: "Route #001 Optimized",
    message: "Route has been re-optimized due to traffic conditions",
    time: "5 minutes ago",
    unread: true
  },
  {
    id: "2",
    type: "delivery_complete",
    title: "Delivery Completed",
    message: "Stop #3 completed by John Smith",
    time: "15 minutes ago",
    unread: true
  },
  {
    id: "3",
    type: "traffic_alert",
    title: "Traffic Alert",
    message: "Heavy traffic on Highway 101 - consider alternative routes",
    time: "1 hour ago",
    unread: false
  }
];

const mockStats = {
  totalRoutes: 24,
  activeRoutes: 8,
  completedToday: 156,
  totalDistance: 1247.5,
  avgEfficiency: 89,
  onTimeRate: 94
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <Navigation className="h-4 w-4 text-green-500" />;
    case "planned":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "paused":
      return <Pause className="h-4 w-4 text-yellow-500" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <XCircle className="h-4 w-4 text-red-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "planned":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "paused":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-red-100 text-red-800 border-red-200";
  }
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

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
                <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  3
                </Badge>
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Routes</p>
                  <p className="text-3xl font-bold text-foreground">{mockStats.totalRoutes}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
              </div>
            </AnimatedCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AnimatedCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Routes</p>
                  <p className="text-3xl font-bold text-foreground">{mockStats.activeRoutes}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Navigation className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </AnimatedCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatedCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                  <p className="text-3xl font-bold text-foreground">{mockStats.completedToday}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </AnimatedCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatedCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Efficiency</p>
                  <p className="text-3xl font-bold text-foreground">{mockStats.avgEfficiency}%</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Routes List */}
              <div className="lg:col-span-2">
                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Active Routes</h2>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <AnimatedButton size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Route
                      </AnimatedButton>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mockRoutes.map((route, index) => (
                      <motion.div
                        key={route.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {getStatusIcon(route.status)}
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium text-foreground">Route #{route.id}</h3>
                                  <Badge className={getStatusColor(route.status)}>
                                    {route.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{route.driver} • {route.vehicle}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-foreground">
                                {route.completed}/{route.stops} stops
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {route.eta} • {route.distance}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {route.efficiency}% efficiency
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedCard>
              </div>

              {/* Notifications */}
              <div>
                <AnimatedCard className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Recent Notifications</h2>
                  <div className="space-y-4">
                    {mockNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <div className={`p-3 rounded-lg border ${
                          notification.unread ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Notifications
                  </Button>
                </AnimatedCard>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="routes">
            <AnimatedCard className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">All Routes</h2>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search routes..."
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <AnimatedButton>
                  <Plus className="h-4 w-4 mr-2" />
                  New Route
                </AnimatedButton>
              </div>
              <p className="text-muted-foreground">Route management interface will be implemented here.</p>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="notifications">
            <AnimatedCard className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Notifications</h2>
              <p className="text-muted-foreground">Notification management interface will be implemented here.</p>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="analytics">
            <AnimatedCard className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Analytics</h2>
              <p className="text-muted-foreground">Analytics dashboard will be implemented here.</p>
            </AnimatedCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}