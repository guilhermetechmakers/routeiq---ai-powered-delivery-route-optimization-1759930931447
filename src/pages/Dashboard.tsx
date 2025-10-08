import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useRoutes, useOptimizeRoute } from "@/hooks/useRoutes";
import { SimulationDialog } from "@/components/SimulationDialog";
import { 
  Truck, 
  Clock, 
  BarChart3, 
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Navigation,
  CheckCircle,
  XCircle,
  Pause,
  Zap,
  TrendingUp
} from "lucide-react";

// Mock notifications - in real app this would come from notifications API
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
  const [isSimulationDialogOpen, setIsSimulationDialogOpen] = useState(false);
  
  // Fetch live data
  const { data: routesData, isLoading: routesLoading, error: routesError } = useRoutes();
  const optimizeRoute = useOptimizeRoute();

  // Calculate stats from live data
  const routes = routesData?.data || [];
  
  const stats = {
    totalRoutes: routes.length,
    activeRoutes: routes.filter(route => route.status === 'active').length,
    completedToday: routes.filter(route => route.status === 'completed').length,
    totalDistance: routes.reduce((sum, route) => sum + route.total_distance, 0),
    avgEfficiency: routes.length > 0 ? Math.round(routes.reduce((sum, route) => sum + (route.metadata?.optimization_score || 0), 0) / routes.length) : 0,
    onTimeRate: 94 // This would come from analytics API
  };

  const handleOptimizeRoute = (routeId: string) => {
    optimizeRoute.mutate(routeId);
  };

  const handleRunSimulation = () => {
    setIsSimulationDialogOpen(true);
  };

  if (routesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (routesError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
                  <p className="text-3xl font-bold text-foreground">{stats.totalRoutes}</p>
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
                  <p className="text-3xl font-bold text-foreground">{stats.activeRoutes}</p>
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
                  <p className="text-3xl font-bold text-foreground">{stats.completedToday}</p>
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
                  <p className="text-3xl font-bold text-foreground">{stats.avgEfficiency}%</p>
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleRunSimulation}
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Run Simulation
                      </Button>
                      <AnimatedButton size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Route
                      </AnimatedButton>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {routes.length === 0 ? (
                      <div className="text-center py-8">
                        <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No routes found</p>
                      </div>
                    ) : (
                      routes.map((route, index) => {
                        const completedStops = route.stops.filter(stop => stop.status === 'completed').length;
                        const efficiency = route.metadata?.optimization_score || 0;
                        
                        return (
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
                                      <h3 className="font-medium text-foreground">{route.name}</h3>
                                      <Badge className={getStatusColor(route.status)}>
                                        {route.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Driver ID: {route.driver_id} • {route.stops.length} stops
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-foreground">
                                    {completedStops}/{route.stops.length} stops
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {Math.round(route.total_duration / 60)}min • {route.total_distance.toFixed(1)}km
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {efficiency}% efficiency
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleOptimizeRoute(route.id)}
                                    disabled={optimizeRoute.isPending}
                                  >
                                    <Zap className="h-4 w-4 mr-1" />
                                    Optimize
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })
                    )}
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

      {/* Simulation Dialog */}
      <SimulationDialog
        isOpen={isSimulationDialogOpen}
        onClose={() => setIsSimulationDialogOpen(false)}
      />
    </div>
  );
}