import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedButton } from "@/components/AnimatedButton";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Navigation,
  CheckCircle,
  AlertTriangle,
  Pause,
  Play,
  MoreHorizontal,
  Phone,
  MessageSquare
} from "lucide-react";

// Mock data - in real app this would come from API
const mockRoute = {
  id: "1",
  driver: "John Smith",
  status: "active",
  vehicle: "Truck #001",
  totalStops: 8,
  completedStops: 3,
  totalDistance: "45.2 km",
  totalDuration: "2h 15m",
  efficiency: 87,
  stops: [
    {
      id: "1",
      address: "123 Main St, Downtown",
      customer: "ABC Company",
      phone: "+1 (555) 123-4567",
      status: "completed",
      sequence: 1,
      eta: "09:30 AM",
      actualArrival: "09:28 AM",
      instructions: "Leave package at front desk"
    },
    {
      id: "2",
      address: "456 Oak Ave, Midtown",
      customer: "XYZ Corp",
      phone: "+1 (555) 234-5678",
      status: "completed",
      sequence: 2,
      eta: "10:15 AM",
      actualArrival: "10:12 AM",
      instructions: "Ring doorbell twice"
    },
    {
      id: "3",
      address: "789 Pine St, Uptown",
      customer: "DEF Industries",
      phone: "+1 (555) 345-6789",
      status: "completed",
      sequence: 3,
      eta: "11:00 AM",
      actualArrival: "10:58 AM",
      instructions: "Call customer upon arrival"
    },
    {
      id: "4",
      address: "321 Elm St, Downtown",
      customer: "GHI Solutions",
      phone: "+1 (555) 456-7890",
      status: "in_progress",
      sequence: 4,
      eta: "11:45 AM",
      instructions: "Signature required"
    },
    {
      id: "5",
      address: "654 Maple Ave, Westside",
      customer: "JKL Enterprises",
      phone: "+1 (555) 567-8901",
      status: "pending",
      sequence: 5,
      eta: "12:30 PM",
      instructions: "Leave with neighbor if not home"
    },
    {
      id: "6",
      address: "987 Cedar Blvd, Eastside",
      customer: "MNO Group",
      phone: "+1 (555) 678-9012",
      status: "pending",
      sequence: 6,
      eta: "1:15 PM",
      instructions: "Deliver to loading dock"
    },
    {
      id: "7",
      address: "147 Birch St, Northside",
      customer: "PQR Ltd",
      phone: "+1 (555) 789-0123",
      status: "pending",
      sequence: 7,
      eta: "2:00 PM",
      instructions: "Call 30 minutes before arrival"
    },
    {
      id: "8",
      address: "258 Spruce Dr, Southside",
      customer: "STU Inc",
      phone: "+1 (555) 890-1234",
      status: "pending",
      sequence: 8,
      eta: "2:45 PM",
      instructions: "Photo required upon delivery"
    }
  ]
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "in_progress":
      return <Navigation className="h-4 w-4 text-blue-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-gray-500" />;
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
    case "pending":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function RouteOverview() {
  const { id } = useParams<{ id: string }>();
  const progress = (mockRoute.completedStops / mockRoute.totalStops) * 100;

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
                <h1 className="text-xl font-semibold text-foreground">Route #{id}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Pause className="h-4 w-4 mr-2" />
                Pause Route
              </Button>
              <AnimatedButton size="sm">
                <Play className="h-4 w-4 mr-2" />
                Resume Route
              </AnimatedButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Route Info */}
          <div className="lg:col-span-1">
            <AnimatedCard className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Route Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver:</span>
                  <span className="font-medium">{mockRoute.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle:</span>
                  <span className="font-medium">{mockRoute.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={getStatusColor(mockRoute.status)}>
                    {mockRoute.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Distance:</span>
                  <span className="font-medium">{mockRoute.totalDistance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Duration:</span>
                  <span className="font-medium">{mockRoute.totalDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className="font-medium">{mockRoute.efficiency}%</span>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completed Stops</span>
                    <span>{mockRoute.completedStops}/{mockRoute.totalStops}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Stops List */}
          <div className="lg:col-span-2">
            <AnimatedCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Delivery Stops</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    View Map
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {mockRoute.stops.map((stop, index) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className={`p-4 ${
                      stop.status === 'in_progress' ? 'ring-2 ring-primary' : ''
                    }`}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {stop.sequence}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(stop.status)}
                              <h3 className="font-medium text-foreground">
                                {stop.customer}
                              </h3>
                              <Badge className={getStatusColor(stop.status)}>
                                {stop.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {stop.eta}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {stop.address}
                          </p>
                          {stop.instructions && (
                            <p className="text-xs text-muted-foreground mb-2">
                              <strong>Instructions:</strong> {stop.instructions}
                            </p>
                          )}
                          {stop.actualArrival && (
                            <p className="text-xs text-green-600">
                              <strong>Arrived:</strong> {stop.actualArrival}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-3">
                            <Button variant="ghost" size="sm">
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            {stop.status === 'in_progress' && (
                              <AnimatedButton size="sm">
                                Mark Complete
                              </AnimatedButton>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </div>
  );
}