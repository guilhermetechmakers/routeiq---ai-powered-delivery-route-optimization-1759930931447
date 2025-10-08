import apiClient from './client';

export interface WeatherData {
  temperature: number;
  condition: string;
  wind_speed: number;
  visibility: number;
  humidity: number;
  pressure: number;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
}

export interface WeatherAlert {
  id: string;
  type: 'weather_warning' | 'weather_watch' | 'weather_advisory';
  severity: 'low' | 'medium' | 'high' | 'severe';
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  affected_area: {
    lat: number;
    lng: number;
    radius: number; // in kilometers
  };
  impact_duration: number; // in minutes
}

export interface WeatherForecast {
  date: string;
  hourly: WeatherData[];
  daily: {
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitation_chance: number;
  }[];
}

export const weatherApi = {
  // Get current weather for a specific location
  getCurrentWeather: async (lat: number, lng: number): Promise<WeatherData> => {
    const response = await apiClient.get<WeatherData>('/weather/current', {
      params: { lat, lng }
    });
    return response.data;
  },

  // Get weather forecast for a location
  getForecast: async (lat: number, lng: number, days: number = 5): Promise<WeatherForecast> => {
    const response = await apiClient.get<WeatherForecast>('/weather/forecast', {
      params: { lat, lng, days }
    });
    return response.data;
  },

  // Get weather alerts for a specific area
  getAlerts: async (lat: number, lng: number, radius: number = 50): Promise<WeatherAlert[]> => {
    const response = await apiClient.get<WeatherAlert[]>('/weather/alerts', {
      params: { lat, lng, radius }
    });
    return response.data;
  },

  // Get weather data for multiple locations (for route optimization)
  getBulkWeather: async (coordinates: Array<{ lat: number; lng: number }>): Promise<WeatherData[]> => {
    const response = await apiClient.post<WeatherData[]>('/weather/bulk', {
      coordinates
    });
    return response.data;
  },

  // Get weather impact on route
  getRouteWeatherImpact: async (routeId: string): Promise<{
    route_id: string;
    weather_conditions: WeatherData[];
    alerts: WeatherAlert[];
    impact_score: number; // 0-100, higher means more impact
    recommendations: string[];
  }> => {
    const response = await apiClient.get(`/weather/route/${routeId}/impact`);
    return response.data;
  },

  // Subscribe to weather alerts for a location
  subscribeToAlerts: async (lat: number, lng: number, radius: number = 50): Promise<void> => {
    await apiClient.post('/weather/alerts/subscribe', {
      lat,
      lng,
      radius
    });
  },

  // Unsubscribe from weather alerts
  unsubscribeFromAlerts: async (subscriptionId: string): Promise<void> => {
    await apiClient.delete(`/weather/alerts/subscribe/${subscriptionId}`);
  },

  // Get weather history for analytics
  getWeatherHistory: async (
    lat: number, 
    lng: number, 
    startDate: string, 
    endDate: string
  ): Promise<WeatherData[]> => {
    const response = await apiClient.get<WeatherData[]>('/weather/history', {
      params: { lat, lng, start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  // Get weather conditions for route optimization
  getOptimizationWeather: async (routeId: string): Promise<{
    current_conditions: WeatherData[];
    forecast_conditions: WeatherData[];
    alerts: WeatherAlert[];
    optimization_factors: {
      temperature_impact: number;
      precipitation_impact: number;
      wind_impact: number;
      visibility_impact: number;
      overall_impact: number;
    };
  }> => {
    const response = await apiClient.get(`/weather/optimization/${routeId}`);
    return response.data;
  }
};
