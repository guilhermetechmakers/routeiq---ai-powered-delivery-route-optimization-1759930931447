import { useEffect, useRef, useState, useCallback } from "react";
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
  XCircle,
  AlertTriangle,
  Cloud,
  Wind,
  Thermometer
} from "lucide-react";
import type { Route, Stop, TrafficCondition, WeatherCondition } from "@/types/route";

interface RouteMapProps {
  route: Route;
  height?: string;
  showTraffic?: boolean;
  showWeather?: boolean;
  onStopClick?: (stop: Stop) => void;
  onRouteOptimize?: () => void;
}

// Google Maps integration with real-time features
export function RouteMap({ 
  route, 
  height = "400px", 
  showTraffic = true, 
  onStopClick,
  onRouteOptimize
}: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [liveETA, setLiveETA] = useState<string>("");
  const [trafficAlerts, setTrafficAlerts] = useState<TrafficCondition[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherCondition[]>([]);

  // Initialize Google Maps
  const initializeMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const mapOptions: google.maps.MapOptions = {
      center: route.stops[0]?.coordinates || { lat: 37.7749, lng: -122.4194 },
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    };

    mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
    directionsServiceRef.current = new google.maps.DirectionsService();
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#3b82f6",
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    });

    if (showTraffic) {
      trafficLayerRef.current = new google.maps.TrafficLayer();
      trafficLayerRef.current.setMap(mapInstanceRef.current);
    }

    setMapLoaded(true);
  }, [route.stops, showTraffic]);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    loadGoogleMaps();
  }, [initializeMap]);

  // Create route on map
  const createRoute = useCallback(async () => {
    if (!mapInstanceRef.current || !directionsServiceRef.current || !directionsRendererRef.current) return;

    const waypoints = route.stops.slice(1, -1).map(stop => ({
      location: stop.coordinates,
      stopover: true
    }));

    const request: google.maps.DirectionsRequest = {
      origin: route.stops[0].coordinates,
      destination: route.stops[route.stops.length - 1].coordinates,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
      avoidHighways: false,
      avoidTolls: false
    };

    try {
      const result = await directionsServiceRef.current.route(request);
      directionsRendererRef.current.setDirections(result);
      
      // Update live ETA
      if (result.routes[0]?.legs) {
        const totalDuration = result.routes[0].legs.reduce((sum: number, leg: google.maps.DirectionsLeg) => sum + (leg.duration?.value || 0), 0);
        const eta = new Date(Date.now() + totalDuration * 1000);
        setLiveETA(eta.toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error creating route:', error);
    }
  }, [route.stops]);

  // Create markers for stops
  const createMarkers = useCallback(() => {
    if (!mapInstanceRef.current || markersRef.current.length > 0) return;

    route.stops.forEach((stop, index) => {
      const marker = new google.maps.Marker({
        position: stop.coordinates,
        map: mapInstanceRef.current,
        title: stop.address,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getStopColor(stop),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        label: {
          text: (index + 1).toString(),
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });

      marker.addListener('click', () => {
        setSelectedStop(stop);
        onStopClick?.(stop);
      });

      markersRef.current.push(marker);
    });
  }, [route.stops, onStopClick]);

  // Load real-time data
  const loadRealTimeData = useCallback(async () => {
    try {
      // Load traffic conditions
      if (route.metadata?.traffic_conditions) {
        setTrafficAlerts(route.metadata.traffic_conditions);
      }

      // Load weather conditions
      if (route.metadata?.weather_conditions) {
        setWeatherAlerts(route.metadata.weather_conditions);
      }
    } catch (error) {
      console.error('Error loading real-time data:', error);
    }
  }, [route.metadata]);

  // Initialize map and create route
  useEffect(() => {
    if (mapLoaded) {
      createRoute();
      createMarkers();
      loadRealTimeData();
    }
  }, [mapLoaded, createRoute, createMarkers, loadRealTimeData]);

  // Cleanup
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
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
        return "#10b981";
      case "in_progress":
        return "#3b82f6";
      case "failed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStopColorClass = (stop: Stop) => {
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

  const getTrafficLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-orange-600";
      case "severe":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes("rain")) return <Cloud className="h-4 w-4" />;
    if (condition.toLowerCase().includes("wind")) return <Wind className="h-4 w-4" />;
    return <Thermometer className="h-4 w-4" />;
  };

  if (!mapLoaded) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">Live Route Map</h3>
            {liveETA && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Clock className="h-3 w-3 mr-1" />
                ETA: {liveETA}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOptimizing(true)}
              disabled={isOptimizing}
            >
              <Navigation className="h-4 w-4 mr-2" />
              {isOptimizing ? 'Optimizing...' : 'Re-optimize'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRouteOptimize}
            >
              <Truck className="h-4 w-4 mr-2" />
              Full Optimization
            </Button>
          </div>
        </div>
        <div 
          ref={mapRef}
          className="relative"
          style={{ height }}
        />
      </Card>

      {/* Real-time Alerts */}
      {(trafficAlerts.length > 0 || weatherAlerts.length > 0) && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            Live Alerts
          </h3>
          <div className="space-y-3">
            {trafficAlerts.map((alert, index) => (
              <motion.div
                key={`traffic-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-200"
              >
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-orange-800">Traffic Alert</h4>
                    <Badge className={`text-xs ${getTrafficLevelColor(alert.level)}`}>
                      {alert.level.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-orange-700">{alert.description}</p>
                  <p className="text-xs text-orange-600 mt-1">
                    Impact: {alert.impact_duration} minutes
                  </p>
                </div>
              </motion.div>
            ))}
            {weatherAlerts.map((alert, index) => (
              <motion.div
                key={`weather-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200"
              >
                {getWeatherIcon(alert.condition)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-blue-800">Weather Alert</h4>
                    <Badge variant="outline" className="text-xs">
                      {alert.temperature}°C
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700">{alert.condition}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Wind: {alert.wind_speed} km/h • Visibility: {alert.visibility} km
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Route Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Efficiency</p>
              <p className="text-lg font-semibold">{route.metadata?.optimization_score || 0}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stops List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Route Stops</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {route.stops.filter(s => s.status === 'completed').length} of {route.stops.length} completed
            </Badge>
          </div>
        </div>
        <div className="space-y-3">
          {route.stops.map((stop, index) => (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedStop?.id === stop.id ? 'ring-2 ring-primary bg-primary/5' : ''
              } ${getStopColorClass(stop)}`}
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
                    {stop.delivery_instructions && (
                      <p className="text-xs text-muted-foreground mt-1">{stop.delivery_instructions}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{stop.estimated_arrival}</p>
                  <Badge variant="outline" className="text-xs">
                    {stop.status}
                  </Badge>
                  {stop.actual_arrival && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Actual: {stop.actual_arrival}
                    </p>
                  )}
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
          <Card className="max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
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
                  {selectedStop.customer_phone && (
                    <p className="text-sm text-muted-foreground">{selectedStop.customer_phone}</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStopColorClass(selectedStop)}>
                    {selectedStop.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sequence</p>
                  <p className="font-medium">#{selectedStop.sequence}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Arrival</p>
                  <p className="font-medium">{selectedStop.estimated_arrival}</p>
                </div>
                {selectedStop.actual_arrival && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Actual Arrival</p>
                    <p className="font-medium text-green-600">{selectedStop.actual_arrival}</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Duration</p>
                  <p className="font-medium">{selectedStop.estimated_duration} min</p>
                </div>
                {selectedStop.actual_duration && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Actual Duration</p>
                    <p className="font-medium">{selectedStop.actual_duration} min</p>
                  </div>
                )}
              </div>
              
              {(selectedStop.signature_required || selectedStop.photo_required) && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requirements</p>
                  <div className="flex space-x-2 mt-1">
                    {selectedStop.signature_required && (
                      <Badge variant="outline" className="text-xs">Signature Required</Badge>
                    )}
                    {selectedStop.photo_required && (
                      <Badge variant="outline" className="text-xs">Photo Required</Badge>
                    )}
                  </div>
                </div>
              )}
              
              {selectedStop.delivery_instructions && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Instructions</p>
                  <p className="text-sm">{selectedStop.delivery_instructions}</p>
                </div>
              )}
              
              {selectedStop.special_instructions && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Special Instructions</p>
                  <p className="text-sm">{selectedStop.special_instructions}</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
