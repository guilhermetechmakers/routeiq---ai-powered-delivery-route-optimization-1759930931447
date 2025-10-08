export interface Route {
  id: string;
  driver_id: string;
  name: string;
  status: RouteStatus;
  stops: Stop[];
  total_distance: number;
  total_duration: number;
  estimated_completion: string;
  created_at: string;
  updated_at: string;
  optimized_at?: string;
  metadata?: RouteMetadata;
}

export type RouteStatus = 'planned' | 'active' | 'completed' | 'cancelled' | 'paused';

export interface Stop {
  id: string;
  route_id: string;
  address: string;
  coordinates: Coordinates;
  customer_name?: string;
  customer_phone?: string;
  delivery_instructions?: string;
  status: StopStatus;
  sequence: number;
  estimated_arrival: string;
  actual_arrival?: string;
  estimated_duration: number;
  actual_duration?: number;
  signature_required: boolean;
  photo_required: boolean;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export type StopStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteMetadata {
  traffic_conditions?: TrafficCondition[];
  weather_conditions?: WeatherCondition[];
  optimization_score?: number;
  fuel_efficiency?: number;
  carbon_footprint?: number;
}

export interface TrafficCondition {
  timestamp: string;
  level: 'low' | 'medium' | 'high' | 'severe';
  description: string;
  impact_duration: number;
}

export interface WeatherCondition {
  timestamp: string;
  temperature: number;
  condition: string;
  wind_speed: number;
  visibility: number;
  impact_duration: number;
}

export interface CreateRouteInput {
  driver_id: string;
  name: string;
  stops: CreateStopInput[];
  metadata?: Partial<RouteMetadata>;
}

export interface CreateStopInput {
  address: string;
  coordinates: Coordinates;
  customer_name?: string;
  customer_phone?: string;
  delivery_instructions?: string;
  signature_required?: boolean;
  photo_required?: boolean;
  special_instructions?: string;
}

export interface UpdateRouteInput {
  id: string;
  name?: string;
  status?: RouteStatus;
  stops?: UpdateStopInput[];
  metadata?: Partial<RouteMetadata>;
}

export interface UpdateStopInput {
  id: string;
  status?: StopStatus;
  actual_arrival?: string;
  actual_duration?: number;
  special_instructions?: string;
}