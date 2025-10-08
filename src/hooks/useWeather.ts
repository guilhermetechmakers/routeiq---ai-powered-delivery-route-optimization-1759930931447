import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weatherApi } from '@/api/weather';
import { toast } from 'sonner';
// Types are imported from the API file when needed

// Query keys
export const weatherKeys = {
  all: ['weather'] as const,
  current: (lat: number, lng: number) => [...weatherKeys.all, 'current', lat, lng] as const,
  forecast: (lat: number, lng: number, days: number) => [...weatherKeys.all, 'forecast', lat, lng, days] as const,
  alerts: (lat: number, lng: number, radius: number) => [...weatherKeys.all, 'alerts', lat, lng, radius] as const,
  routeImpact: (routeId: string) => [...weatherKeys.all, 'route-impact', routeId] as const,
  optimization: (routeId: string) => [...weatherKeys.all, 'optimization', routeId] as const,
};

// Get current weather for a location
export const useCurrentWeather = (lat: number, lng: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: weatherKeys.current(lat, lng),
    queryFn: () => weatherApi.getCurrentWeather(lat, lng),
    enabled: enabled && !isNaN(lat) && !isNaN(lng),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
};

// Get weather forecast for a location
export const useWeatherForecast = (lat: number, lng: number, days: number = 5, enabled: boolean = true) => {
  return useQuery({
    queryKey: weatherKeys.forecast(lat, lng, days),
    queryFn: () => weatherApi.getForecast(lat, lng, days),
    enabled: enabled && !isNaN(lat) && !isNaN(lng),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Get weather alerts for an area
export const useWeatherAlerts = (lat: number, lng: number, radius: number = 50, enabled: boolean = true) => {
  return useQuery({
    queryKey: weatherKeys.alerts(lat, lng, radius),
    queryFn: () => weatherApi.getAlerts(lat, lng, radius),
    enabled: enabled && !isNaN(lat) && !isNaN(lng),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
  });
};

// Get weather impact on a route
export const useRouteWeatherImpact = (routeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: weatherKeys.routeImpact(routeId),
    queryFn: () => weatherApi.getRouteWeatherImpact(routeId),
    enabled: enabled && !!routeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
};

// Get weather data for route optimization
export const useOptimizationWeather = (routeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: weatherKeys.optimization(routeId),
    queryFn: () => weatherApi.getOptimizationWeather(routeId),
    enabled: enabled && !!routeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Subscribe to weather alerts
export const useSubscribeToWeatherAlerts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lat, lng, radius }: { lat: number; lng: number; radius: number }) =>
      weatherApi.subscribeToAlerts(lat, lng, radius),
    onSuccess: () => {
      toast.success('Subscribed to weather alerts');
      // Invalidate alerts query to refetch
      queryClient.invalidateQueries({ queryKey: weatherKeys.all });
    },
    onError: (error: any) => {
      toast.error(`Failed to subscribe to weather alerts: ${error.message}`);
    },
  });
};

// Unsubscribe from weather alerts
export const useUnsubscribeFromWeatherAlerts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) => weatherApi.unsubscribeFromAlerts(subscriptionId),
    onSuccess: () => {
      toast.success('Unsubscribed from weather alerts');
      // Invalidate alerts query to refetch
      queryClient.invalidateQueries({ queryKey: weatherKeys.all });
    },
    onError: (error: any) => {
      toast.error(`Failed to unsubscribe from weather alerts: ${error.message}`);
    },
  });
};

// Get bulk weather data for multiple coordinates
export const useBulkWeather = (coordinates: Array<{ lat: number; lng: number }>, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...weatherKeys.all, 'bulk', coordinates],
    queryFn: () => weatherApi.getBulkWeather(coordinates),
    enabled: enabled && coordinates.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get weather history for analytics
export const useWeatherHistory = (
  lat: number,
  lng: number,
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...weatherKeys.all, 'history', lat, lng, startDate, endDate],
    queryFn: () => weatherApi.getWeatherHistory(lat, lng, startDate, endDate),
    enabled: enabled && !isNaN(lat) && !isNaN(lng) && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 60, // 1 hour (historical data doesn't change)
  });
};
