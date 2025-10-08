export interface PerformanceReport {
  id: string;
  user_id?: string;
  type: ReportType;
  period: ReportPeriod;
  generated_at: string;
  data: ReportData;
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
  metrics: ReportMetrics;
  created_at: string;
}

export type ReportType = 'weekly' | 'monthly' | 'quarterly' | 'custom';

export interface ReportPeriod {
  start_date: string;
  end_date: string;
  timezone: string;
}

export interface ReportData {
  routes_completed: number;
  total_distance: number;
  total_duration: number;
  fuel_consumed: number;
  carbon_emissions: number;
  on_time_deliveries: number;
  delayed_deliveries: number;
  failed_deliveries: number;
  average_route_efficiency: number;
  cost_savings: number;
  time_savings: number;
}

export interface ReportInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  data_points: number;
}

export type InsightType = 
  | 'efficiency_trend'
  | 'bottleneck_identification'
  | 'time_optimization'
  | 'fuel_efficiency'
  | 'route_pattern'
  | 'weather_impact'
  | 'traffic_impact'
  | 'driver_performance';

export interface ReportRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimated_impact: {
    time_savings?: number;
    cost_savings?: number;
    efficiency_gain?: number;
  };
  implementation_effort: 'low' | 'medium' | 'high';
  category: string;
}

export type RecommendationType = 
  | 'route_optimization'
  | 'schedule_adjustment'
  | 'driver_training'
  | 'vehicle_upgrade'
  | 'process_improvement'
  | 'technology_upgrade';

export interface ReportMetrics {
  efficiency_score: number;
  on_time_percentage: number;
  fuel_efficiency: number;
  cost_per_delivery: number;
  customer_satisfaction: number;
  driver_satisfaction: number;
  environmental_impact: number;
}

export interface CreateReportInput {
  user_id?: string;
  type: ReportType;
  period: ReportPeriod;
  include_insights?: boolean;
  include_recommendations?: boolean;
}

export interface ReportFilters {
  date_range?: {
    start: string;
    end: string;
  };
  driver_ids?: string[];
  route_types?: string[];
  metrics?: string[];
}