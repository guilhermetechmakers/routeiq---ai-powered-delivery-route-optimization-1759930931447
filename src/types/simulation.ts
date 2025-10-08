import type { Stop } from './route';

export interface Simulation {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  status: SimulationStatus;
  scenario: SimulationScenario;
  results?: SimulationResults;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export type SimulationStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface SimulationScenario {
  base_route_id?: string;
  modifications: ScenarioModification[];
  constraints: SimulationConstraints;
  objectives: SimulationObjective[];
}

export interface ScenarioModification {
  type: ModificationType;
  parameters: Record<string, any>;
  description: string;
}

export type ModificationType = 
  | 'add_stop'
  | 'remove_stop'
  | 'reorder_stops'
  | 'change_time_window'
  | 'add_vehicle'
  | 'remove_vehicle'
  | 'change_capacity'
  | 'adjust_priorities'
  | 'weather_condition'
  | 'traffic_condition';

export interface SimulationConstraints {
  max_duration?: number;
  max_distance?: number;
  vehicle_capacity?: number;
  time_windows?: TimeWindow[];
  driver_availability?: DriverAvailability[];
  weather_conditions?: WeatherConstraint[];
  traffic_conditions?: TrafficConstraint[];
}

export interface TimeWindow {
  start: string;
  end: string;
  day_of_week?: number;
}

export interface DriverAvailability {
  driver_id: string;
  start_time: string;
  end_time: string;
  days: number[];
}

export interface WeatherConstraint {
  condition: string;
  severity: 'low' | 'medium' | 'high';
  impact_factor: number;
}

export interface TrafficConstraint {
  level: 'low' | 'medium' | 'high' | 'severe';
  time_periods: TimeWindow[];
  impact_factor: number;
}

export interface SimulationObjective {
  type: ObjectiveType;
  weight: number;
  target_value?: number;
}

export type ObjectiveType = 
  | 'minimize_distance'
  | 'minimize_duration'
  | 'minimize_cost'
  | 'maximize_efficiency'
  | 'minimize_fuel_consumption'
  | 'maximize_on_time_deliveries'
  | 'minimize_carbon_emissions';

export interface SimulationResults {
  optimized_routes: OptimizedRoute[];
  metrics: SimulationMetrics;
  comparison: ComparisonData;
  insights: SimulationInsight[];
  recommendations: SimulationRecommendation[];
}

export interface OptimizedRoute {
  id: string;
  driver_id: string;
  stops: Stop[];
  total_distance: number;
  total_duration: number;
  estimated_completion: string;
  efficiency_score: number;
  cost_estimate: number;
  fuel_estimate: number;
  carbon_estimate: number;
}

export interface SimulationMetrics {
  total_distance: number;
  total_duration: number;
  total_cost: number;
  fuel_consumption: number;
  carbon_emissions: number;
  on_time_percentage: number;
  efficiency_score: number;
  improvement_percentage: number;
}

export interface ComparisonData {
  baseline_metrics: SimulationMetrics;
  optimized_metrics: SimulationMetrics;
  improvements: {
    distance_saved: number;
    time_saved: number;
    cost_saved: number;
    fuel_saved: number;
    carbon_reduced: number;
  };
}

export interface SimulationInsight {
  type: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  data: Record<string, any>;
}

export interface SimulationRecommendation {
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimated_impact: Record<string, number>;
  implementation_effort: 'low' | 'medium' | 'high';
}

export interface CreateSimulationInput {
  name: string;
  description?: string;
  scenario: SimulationScenario;
}

export interface SimulationFilters {
  status?: SimulationStatus[];
  user_id?: string;
  date_range?: {
    start: string;
    end: string;
  };
  modification_types?: ModificationType[];
}
