import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedCard } from "@/components/AnimatedCard";
import { RouteMap } from "@/components/RouteMap";
import { useRoute, useOptimizeRoute, useUpdateStop } from "@/hooks/useRoutes";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Navigation,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Zap,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock notifications - in real app this would come from notifications API
const mockNotifications = [
  {
    id: "1",
    type: "traffic_alert",
    title: "Traffic Alert",
    message: "Heavy traffic on Highway 101 - consider alternative routes",
    time: "5 minutes ago"
  },
  {
    id: "2",
    type: "weather_alert",
    title: "Weather Warning",
    message: "Rain expected in the next hour - prepare for wet conditions",
    time: "15 minutes ago"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "in_progress":
      return <Navigation className="h-4 w-4 text-blue-500" />;
    case "failed":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function RouteOverview() {
  const { id } = useParams<{ id: string }>();
  const { data: route, isLoading, error } = useRoute(id || "");
  const optimizeRoute = useOptimizeRoute();
  const updateStop = useUpdateStop();

  const handleOptimizeRoute = () => {
    if (id) {
      optimizeRoute.mutate(id);
    }
  };

  const handleUpdateStop = (stopId: string, updates: any) => {
    if (id) {
      updateStop.mutate({ routeId: id, stopId, updates });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading route details...</p>
        </div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Failed to load route details</p>
          <Link to="/dashboard" className="text-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const completedStops = route.stops.filter(stop => stop.status === 'completed').length;
  const progressPercentage = (completedStops / route.stops.length) * 100;
  const efficiency = route.metadata?.optimization_score || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{route.name}</h1>
              <p className="text-muted-foreground">Driver ID: {route.driver_id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleOptimizeRoute}
              disabled={optimizeRoute.isPending}
            >
              <Zap className="h-4 w-4 mr-2" />
              {optimizeRoute.isPending ? 'Optimizing...' : 'Optimize Route'}
            </Button>
            <Button variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={getStatusColor(route.status)}>
                  {route.status}
                </Badge>
              </div>
              <Truck className="h-8 w-8 text-primary" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">{completedStops}/{route.stops.length}</p>
                <Progress value={progressPercentage} className="mt-2" />
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Distance</p>
                <p className="text-2xl font-bold">{route.total_distance.toFixed(1)}km</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold">{efficiency}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </AnimatedCard>
        </div>

        {/* Map and Stops */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div>
            <RouteMap route={route} height="500px" />
          </div>

          {/* Stops List */}
          <div>
            <AnimatedCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Route Stops</h2>
                <Badge variant="outline">
                  {completedStops} of {route.stops.length} completed
                </Badge>
              </div>

              <div className="space-y-4">
                {route.stops.map((stop, index) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      stop.status === 'in_progress' ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-muted-foreground">#{stop.sequence}</span>
                          {getStatusIcon(stop.status)}
                        </div>
                        <div>
                          <p className="font-medium">{stop.address}</p>
                          {stop.customer_name && (
                            <p className="text-sm text-muted-foreground">{stop.customer_name}</p>
                          )}
                          {stop.delivery_instructions && (
                            <p className="text-xs text-muted-foreground mt-1">{stop.delivery_instructions}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{stop.estimated_arrival}</p>
                        <Badge className={getStatusColor(stop.status)}>
                          {stop.status}
                        </Badge>
                        {stop.status === 'in_progress' && (
                          <div className="mt-2 space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStop(stop.id, { status: 'completed' })}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStop(stop.id, { status: 'failed' })}
                            >
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Failed
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Notifications */}
        {mockNotifications.length > 0 && (
          <div className="mt-8">
            <AnimatedCard className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Route Alerts</h2>
              <div className="space-y-3">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                  >
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-800">{notification.title}</h4>
                      <p className="text-sm text-yellow-700">{notification.message}</p>
                      <p className="text-xs text-yellow-600 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </div>
        )}
      </div>
    </div>
  );
}
