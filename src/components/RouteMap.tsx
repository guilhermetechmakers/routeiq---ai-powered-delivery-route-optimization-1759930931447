import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Truck,
  CheckCircle,
  XCircle
} from "lucide-react";
import type { Route, Stop } from "@/types/route";

interface RouteMapProps {
  route: Route;
  height?: string;
}

// Mock map component - in real app this would use Google Maps API
export function RouteMap({ route, height = "400px" }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStopIcon = (stop: Stop) => {
    switch (stop.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Navigation className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStopColor = (stop: Stop) => {
    switch (stop.status) {
      case "completed":
        return "bg-green-100 border-green-300";
      case "in_progress":
        return "bg-blue-100 border-blue-300";
      case "failed":
        return "bg-red-100 border-red-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  if (!mapLoaded) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card className="overflow-hidden">
        <div 
          ref={mapRef}
          className="relative bg-gradient-to-br from-blue-50 to-green-50"
          style={{ height }}
        >
          {/* Mock map background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Truck className="h-16 w-16 text-primary mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground">Route Map</p>
              <p className="text-sm text-muted-foreground">
                {route.stops.length} stops • {route.total_distance.toFixed(1)}km • {Math.round(route.total_duration / 60)}min
              </p>
            </div>
          </div>

          {/* Mock route line */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d={`M 50 50 ${route.stops.map((_, i) => 
                `L ${50 + (i + 1) * 100} ${50 + Math.sin(i) * 50}`
              ).join(' ')}`}
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
            />
          </svg>

          {/* Mock stops */}
          {route.stops.map((stop, index) => (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute"
              style={{
                left: `${50 + index * 100}px`,
                top: `${50 + Math.sin(index) * 50}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <button
                onClick={() => setSelectedStop(stop)}
                className={`p-2 rounded-full border-2 ${getStopColor(stop)} hover:scale-110 transition-transform`}
              >
                {getStopIcon(stop)}
              </button>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-foreground">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Route Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Route Status</p>
              <Badge className={route.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {route.status}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Total Stops</p>
              <p className="text-lg font-semibold">{route.stops.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p className="text-lg font-semibold">{Math.round(route.total_duration / 60)}min</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stops List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Route Stops</h3>
        <div className="space-y-3">
          {route.stops.map((stop, index) => (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedStop?.id === stop.id ? 'ring-2 ring-primary bg-primary/5' : ''
              } ${getStopColor(stop)}`}
              onClick={() => setSelectedStop(stop)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-muted-foreground">#{stop.sequence}</span>
                    {getStopIcon(stop)}
                  </div>
                  <div>
                    <p className="font-medium">{stop.address}</p>
                    {stop.customer_name && (
                      <p className="text-sm text-muted-foreground">{stop.customer_name}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{stop.estimated_arrival}</p>
                  <Badge variant="outline" className="text-xs">
                    {stop.status}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Selected Stop Details */}
      {selectedStop && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedStop(null)}
        >
          <Card className="max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Stop Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStop(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="font-medium">{selectedStop.address}</p>
              </div>
              
              {selectedStop.customer_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedStop.customer_name}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={getStopColor(selectedStop)}>
                  {selectedStop.status}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">ETA</p>
                <p className="font-medium">{selectedStop.estimated_arrival}</p>
              </div>
              
              {selectedStop.delivery_instructions && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Instructions</p>
                  <p className="text-sm">{selectedStop.delivery_instructions}</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
