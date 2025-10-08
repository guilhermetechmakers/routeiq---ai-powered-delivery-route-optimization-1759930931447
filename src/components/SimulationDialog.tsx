import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateSimulation, useRunSimulation } from "@/hooks/useSimulations";
import { useRoutes } from "@/hooks/useRoutes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  X,
  Play,
  Settings,
  MapPin,
  Clock,
  Truck,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import type { CreateSimulationInput, SimulationScenario } from "@/types/simulation";

interface SimulationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimulationDialog({ isOpen, onClose }: SimulationDialogProps) {
  const [activeTab, setActiveTab] = useState("scenario");
  const [simulationName, setSimulationName] = useState("");
  const [simulationDescription, setSimulationDescription] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [scenario, setScenario] = useState<SimulationScenario>({
    base_route_id: "",
    modifications: [],
    constraints: {
      max_duration: 480, // 8 hours
      max_distance: 200,
      vehicle_capacity: 100,
    },
    objectives: [
      { type: "minimize_distance", weight: 0.4 },
      { type: "minimize_duration", weight: 0.3 },
      { type: "maximize_efficiency", weight: 0.3 },
    ],
  });

  const { data: routesData } = useRoutes();
  const createSimulation = useCreateSimulation();
  const runSimulation = useRunSimulation();

  const routes = routesData?.data || [];

  const handleCreateSimulation = async () => {
    if (!simulationName.trim()) {
      return;
    }

    const simulationInput: CreateSimulationInput = {
      name: simulationName,
      description: simulationDescription,
      scenario: {
        ...scenario,
        base_route_id: selectedRouteId,
      },
    };

    try {
      const newSimulation = await createSimulation.mutateAsync(simulationInput);
      
      // Automatically run the simulation
      await runSimulation.mutateAsync(newSimulation.id);
      
      onClose();
    } catch (error) {
      console.error("Failed to create simulation:", error);
    }
  };

  const modificationTypes = [
    { id: "add_stop", name: "Add Stop", icon: MapPin, description: "Add a new delivery stop" },
    { id: "remove_stop", name: "Remove Stop", icon: X, description: "Remove an existing stop" },
    { id: "reorder_stops", name: "Reorder Stops", icon: Settings, description: "Change stop sequence" },
    { id: "change_time_window", name: "Time Window", icon: Clock, description: "Modify delivery windows" },
    { id: "weather_condition", name: "Weather", icon: AlertTriangle, description: "Simulate weather impact" },
    { id: "traffic_condition", name: "Traffic", icon: Truck, description: "Simulate traffic conditions" },
  ];

  const objectiveTypes = [
    { id: "minimize_distance", name: "Minimize Distance", description: "Reduce total travel distance" },
    { id: "minimize_duration", name: "Minimize Duration", description: "Reduce total travel time" },
    { id: "minimize_cost", name: "Minimize Cost", description: "Reduce operational costs" },
    { id: "maximize_efficiency", name: "Maximize Efficiency", description: "Improve overall efficiency" },
    { id: "minimize_fuel_consumption", name: "Minimize Fuel", description: "Reduce fuel consumption" },
    { id: "maximize_on_time_deliveries", name: "On-Time Delivery", description: "Improve delivery punctuality" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            What-If Route Simulation
          </DialogTitle>
          <DialogDescription>
            Create and run route optimization simulations to analyze different scenarios and improve delivery efficiency.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="simulation-name">Simulation Name</Label>
                <Input
                  id="simulation-name"
                  value={simulationName}
                  onChange={(e) => setSimulationName(e.target.value)}
                  placeholder="Enter simulation name"
                />
              </div>
              <div>
                <Label htmlFor="base-route">Base Route</Label>
                <select
                  id="base-route"
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select a route to simulate</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.name} ({route.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="simulation-description">Description (Optional)</Label>
              <Input
                id="simulation-description"
                value={simulationDescription}
                onChange={(e) => setSimulationDescription(e.target.value)}
                placeholder="Describe what this simulation will test"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scenario">Scenario</TabsTrigger>
              <TabsTrigger value="constraints">Constraints</TabsTrigger>
              <TabsTrigger value="objectives">Objectives</TabsTrigger>
            </TabsList>

            <TabsContent value="scenario" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Scenario Modifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modificationTypes.map((mod) => {
                    const Icon = mod.icon;
                    const isSelected = scenario.modifications.some(m => m.type === mod.id);
                    
                    return (
                      <Card
                        key={mod.id}
                        className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            setScenario(prev => ({
                              ...prev,
                              modifications: prev.modifications.filter(m => m.type !== mod.id)
                            }));
                          } else {
                            setScenario(prev => ({
                              ...prev,
                              modifications: [
                                ...prev.modifications,
                                {
                                  type: mod.id as any,
                                  parameters: {},
                                  description: mod.description
                                }
                              ]
                            }));
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">{mod.name}</h4>
                            <p className="text-sm text-muted-foreground">{mod.description}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="constraints" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Simulation Constraints</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max-duration">Max Duration (minutes)</Label>
                    <Input
                      id="max-duration"
                      type="number"
                      value={scenario.constraints.max_duration || ''}
                      onChange={(e) => setScenario(prev => ({
                        ...prev,
                        constraints: {
                          ...prev.constraints,
                          max_duration: parseInt(e.target.value) || undefined
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-distance">Max Distance (km)</Label>
                    <Input
                      id="max-distance"
                      type="number"
                      value={scenario.constraints.max_distance || ''}
                      onChange={(e) => setScenario(prev => ({
                        ...prev,
                        constraints: {
                          ...prev.constraints,
                          max_distance: parseInt(e.target.value) || undefined
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle-capacity">Vehicle Capacity</Label>
                    <Input
                      id="vehicle-capacity"
                      type="number"
                      value={scenario.constraints.vehicle_capacity || ''}
                      onChange={(e) => setScenario(prev => ({
                        ...prev,
                        constraints: {
                          ...prev.constraints,
                          vehicle_capacity: parseInt(e.target.value) || undefined
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="objectives" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Optimization Objectives</h3>
                <div className="space-y-3">
                  {objectiveTypes.map((obj) => {
                    const isSelected = scenario.objectives.some(o => o.type === obj.id);
                    const weight = scenario.objectives.find(o => o.type === obj.id)?.weight || 0;
                    
                    return (
                      <Card key={obj.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setScenario(prev => ({
                                    ...prev,
                                    objectives: [
                                      ...prev.objectives,
                                      { type: obj.id as any, weight: 0.2 }
                                    ]
                                  }));
                                } else {
                                  setScenario(prev => ({
                                    ...prev,
                                    objectives: prev.objectives.filter(o => o.type !== obj.id)
                                  }));
                                }
                              }}
                            />
                            <div>
                              <h4 className="font-medium">{obj.name}</h4>
                              <p className="text-sm text-muted-foreground">{obj.description}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`weight-${obj.id}`}>Weight:</Label>
                              <Input
                                id={`weight-${obj.id}`}
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={weight}
                                onChange={(e) => {
                                  const newWeight = parseFloat(e.target.value) || 0;
                                  setScenario(prev => ({
                                    ...prev,
                                    objectives: prev.objectives.map(o => 
                                      o.type === obj.id ? { ...o, weight: newWeight } : o
                                    )
                                  }));
                                }}
                                className="w-20"
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Selected Modifications Summary */}
          {scenario.modifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Selected Modifications</h3>
              <div className="flex flex-wrap gap-2">
                {scenario.modifications.map((mod, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {mod.description}
                    <button
                      onClick={() => {
                        setScenario(prev => ({
                          ...prev,
                          modifications: prev.modifications.filter((_, i) => i !== index)
                        }));
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateSimulation}
            disabled={!simulationName.trim() || !selectedRouteId || createSimulation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createSimulation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Create & Run Simulation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
