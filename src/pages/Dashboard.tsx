import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useRoutes, useOptimizeRoute } from "@/hooks/useRoutes";
import { useWeatherAlerts, useRouteWeatherImpact } from "@/hooks/useWeather";
import { useWebSocket } from "@/api/websocket";
import { SimulationDialog } from "@/components/SimulationDialog";
import { useAuth } from "@/contexts/AuthContext";
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
  TrendingUp,
  AlertTriangle,
  Cloud,
  Wifi,
  WifiOff,
  Users,
  Settings,
  FileText,
  ExternalLink
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
  const [liveNotifications, setLiveNotifications] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  
  // Get user role from auth context
  const { user } = useAuth();
  const userRole = user?.role || 'driver';
  
  // Fetch live data
  const { data: routesData, isLoading: routesLoading, error: routesError } = useRoutes();
  const optimizeRoute = useOptimizeRoute();
  
  // WebSocket for real-time updates
  const ws = useWebSocket();
  
  // Weather alerts for the main area (using first route's location as reference)
  const firstRoute = routesData?.data?.[0];
  const { data: weatherAlerts } = useWeatherAlerts(
    firstRoute?.stops?.[0]?.coordinates?.lat || 37.7749,
    firstRoute?.stops?.[0]?.coordinates?.lng || -122.4194,
    50,
    !!firstRoute
  );
  
  // Weather impact for active routes
  const activeRoutes = routesData?.data?.filter(route => route.status === 'active') || [];
  useRouteWeatherImpact(
    activeRoutes[0]?.id || '',
    activeRoutes.length > 0
  );

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

  // WebSocket event handlers
  useEffect(() => {
    const handleConnectionStatus = () => {
      setConnectionStatus(ws.isConnected() ? 'connected' : 'disconnected');
    };

    const unsubscribeRouteUpdates = ws.subscribe('route_update', (data) => {
      // Update route data in real-time
      console.log('Route update received:', data);
    });

    const unsubscribeNotifications = ws.subscribe('notification', (data) => {
      setLiveNotifications(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 notifications
    });

    const unsubscribeWeatherAlerts = ws.subscribe('weather_alert', (data) => {
      console.log('Weather alert received:', data);
    });

    const unsubscribeTrafficAlerts = ws.subscribe('traffic_alert', (data) => {
      console.log('Traffic alert received:', data);
    });

    const unsubscribeOptimizationComplete = ws.subscribe('optimization_complete', (data) => {
      console.log('Optimization complete:', data);
    });

    // Check connection status periodically
    const statusInterval = setInterval(handleConnectionStatus, 5000);
    handleConnectionStatus();

    return () => {
      unsubscribeRouteUpdates();
      unsubscribeNotifications();
      unsubscribeWeatherAlerts();
      unsubscribeTrafficAlerts();
      unsubscribeOptimizationComplete();
      clearInterval(statusInterval);
    };
  }, [ws]);

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
        {/* Real-time Status Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-foreground">RouteIQ Dashboard</h1>
            <div className="flex items-center space-x-2">
              {connectionStatus === 'connected' ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              ) : connectionStatus === 'connecting' ? (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Wifi className="h-3 w-3 mr-1 animate-pulse" />
                  Connecting...
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {weatherAlerts && weatherAlerts.length > 0 && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {weatherAlerts.length} Weather Alert{weatherAlerts.length > 1 ? 's' : ''}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => ws.reconnect()}
              disabled={connectionStatus === 'connected'}
            >
              {connectionStatus === 'connected' ? 'Connected' : 'Reconnect'}
            </Button>
          </div>
        </div>

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
          <TabsList className={`grid w-full ${userRole === 'admin' ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            {userRole === 'admin' && (
              <TabsTrigger value="admin">Admin</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Role-specific welcome message */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Welcome back, {user?.full_name || (userRole === 'admin' ? 'Administrator' : userRole === 'dispatcher' ? 'Dispatcher' : 'Driver')}!
              </h2>
              <p className="text-muted-foreground">
                {userRole === 'admin' 
                  ? 'Monitor system performance, manage users, and oversee all operations.'
                  : userRole === 'dispatcher' 
                  ? 'Optimize routes, track deliveries, and manage your fleet efficiently.'
                  : 'View your assigned routes, update delivery status, and stay connected.'
                }
              </p>
            </div>

            {/* Role-specific quick actions */}
            {userRole === 'admin' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AnimatedCard className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <Users className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Manage Users</h4>
                        <p className="text-sm text-muted-foreground">Add, edit, or remove users</p>
                      </div>
                    </div>
                  </AnimatedCard>
                  <AnimatedCard className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-8 w-8 text-green-500" />
                      <div>
                        <h4 className="font-medium">System Settings</h4>
                        <p className="text-sm text-muted-foreground">Configure system preferences</p>
                      </div>
                    </div>
                  </AnimatedCard>
                  <AnimatedCard className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-purple-500" />
                      <div>
                        <h4 className="font-medium">View Reports</h4>
                        <p className="text-sm text-muted-foreground">Generate performance reports</p>
                      </div>
                    </div>
                  </AnimatedCard>
                </div>
              </div>
            )}

            {userRole === 'dispatcher' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Today's Focus</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatedCard className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Optimize Routes</h4>
                        <p className="text-sm text-muted-foreground">AI-powered route optimization</p>
                      </div>
                    </div>
                  </AnimatedCard>
                  <AnimatedCard className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-8 w-8 text-green-500" />
                      <div>
                        <h4 className="font-medium">Performance Analytics</h4>
                        <p className="text-sm text-muted-foreground">Track delivery metrics</p>
                      </div>
                    </div>
                  </AnimatedCard>
                </div>
              </div>
            )}

            {userRole === 'driver' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">My Tasks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatedCard className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <Navigation className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Current Route</h4>
                        <p className="text-sm text-muted-foreground">View today's delivery route</p>
                      </div>
                    </div>
                  </AnimatedCard>
                  <AnimatedCard className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-8 w-8 text-green-500" />
                      <div>
                        <h4 className="font-medium">Update Status</h4>
                        <p className="text-sm text-muted-foreground">Mark deliveries as complete</p>
                      </div>
                    </div>
                  </AnimatedCard>
                </div>
              </div>
            )}

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

              {/* Live Notifications */}
              <div>
                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Live Notifications</h2>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {liveNotifications.length + mockNotifications.length} total
                    </Badge>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {/* Live notifications */}
                    {liveNotifications.map((notification, index) => (
                      <motion.div
                        key={`live-${notification.id}`}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="p-3 rounded-lg border bg-blue-50 border-blue-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-blue-900 text-sm">
                                {notification.title}
                              </h4>
                              <Badge className="text-xs bg-blue-100 text-blue-800">
                                LIVE
                              </Badge>
                            </div>
                            <p className="text-xs text-blue-700 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-blue-600 mt-2">
                              {new Date(notification.timestamp || Date.now()).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 animate-pulse" />
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Weather alerts */}
                    {weatherAlerts?.map((alert, index) => (
                      <motion.div
                        key={`weather-${alert.id}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: (liveNotifications.length + index) * 0.1 }}
                        className="p-3 rounded-lg border bg-orange-50 border-orange-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Cloud className="h-4 w-4 text-orange-600" />
                              <h4 className="font-medium text-orange-900 text-sm">
                                Weather Alert
                              </h4>
                              <Badge className={`text-xs ${
                                alert.severity === 'severe' ? 'bg-red-100 text-red-800' :
                                alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-xs text-orange-700 mt-1">
                              {alert.description}
                            </p>
                            <p className="text-xs text-orange-600 mt-2">
                              Impact: {alert.impact_duration} minutes
                            </p>
                          </div>
                          <AlertTriangle className="h-4 w-4 text-orange-600 mt-1" />
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Static notifications */}
                    {mockNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: (liveNotifications.length + (weatherAlerts?.length || 0) + index) * 0.1 }}
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

          {userRole === 'admin' && (
            <TabsContent value="admin" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold text-foreground">247</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">System Health</p>
                      <p className="text-3xl font-bold text-green-600">99.9%</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">API Calls Today</p>
                      <p className="text-3xl font-bold text-foreground">12.4K</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </AnimatedCard>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <AnimatedCard className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent System Events</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">System backup completed</p>
                        <p className="text-xs text-green-600">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">New user registered</p>
                        <p className="text-xs text-blue-600">15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">High API usage detected</p>
                        <p className="text-xs text-yellow-600">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      View Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      API Management
                    </Button>
                  </div>
                </AnimatedCard>
              </div>
            </TabsContent>
          )}
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