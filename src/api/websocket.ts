import { toast } from 'sonner';

export interface WebSocketMessage {
  type: 'route_update' | 'notification' | 'weather_alert' | 'traffic_alert' | 'optimization_complete' | 'simulation_complete';
  data: any;
  timestamp: string;
}

export interface RouteUpdateMessage {
  route_id: string;
  status: string;
  current_stop?: string;
  eta_update?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface NotificationMessage {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: string[];
}

export interface WeatherAlertMessage {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'severe';
  title: string;
  description: string;
  affected_routes: string[];
  impact_duration: number;
}

export interface TrafficAlertMessage {
  id: string;
  level: 'low' | 'medium' | 'high' | 'severe';
  description: string;
  affected_routes: string[];
  impact_duration: number;
  location: {
    lat: number;
    lng: number;
  };
}

export interface OptimizationCompleteMessage {
  route_id: string;
  optimization_score: number;
  time_saved: number;
  distance_saved: number;
  new_eta: string;
}

export interface SimulationCompleteMessage {
  simulation_id: string;
  status: 'completed' | 'failed';
  results?: any;
  recommendations?: string[];
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000; // Start with 1 second
  private maxReconnectInterval = 30000; // Max 30 seconds
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private isConnecting = false;

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectInterval = 1000;
        toast.success('Connected to live updates');
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.ws = null;
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      toast.error('Lost connection to live updates. Please refresh the page.');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectInterval);
    
    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.connect();
    }, delay);
  }

  private handleMessage(message: WebSocketMessage) {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(message.data);
        } catch (error) {
          console.error('Error in WebSocket message listener:', error);
        }
      });
    }

    // Handle specific message types
    switch (message.type) {
      case 'route_update':
        this.handleRouteUpdate(message.data as RouteUpdateMessage);
        break;
      case 'notification':
        this.handleNotification(message.data as NotificationMessage);
        break;
      case 'weather_alert':
        this.handleWeatherAlert(message.data as WeatherAlertMessage);
        break;
      case 'traffic_alert':
        this.handleTrafficAlert(message.data as TrafficAlertMessage);
        break;
      case 'optimization_complete':
        this.handleOptimizationComplete(message.data as OptimizationCompleteMessage);
        break;
      case 'simulation_complete':
        this.handleSimulationComplete(message.data as SimulationCompleteMessage);
        break;
    }
  }

  private handleRouteUpdate(data: RouteUpdateMessage) {
    toast.info(`Route ${data.route_id} updated: ${data.status}`);
  }

  private handleNotification(data: NotificationMessage) {
    const priorityColors = {
      low: 'bg-blue-50 text-blue-800',
      medium: 'bg-yellow-50 text-yellow-800',
      high: 'bg-orange-50 text-orange-800',
      urgent: 'bg-red-50 text-red-800'
    };

    toast(data.title, {
      description: data.message,
      className: priorityColors[data.priority],
      duration: data.priority === 'urgent' ? 10000 : 5000,
    });
  }

  private handleWeatherAlert(data: WeatherAlertMessage) {
    const severityColors = {
      low: 'bg-blue-50 text-blue-800',
      medium: 'bg-yellow-50 text-yellow-800',
      high: 'bg-orange-50 text-orange-800',
      severe: 'bg-red-50 text-red-800'
    };

    toast(`Weather Alert: ${data.title}`, {
      description: data.description,
      className: severityColors[data.severity],
      duration: 10000,
    });
  }

  private handleTrafficAlert(data: TrafficAlertMessage) {
    const levelColors = {
      low: 'bg-blue-50 text-blue-800',
      medium: 'bg-yellow-50 text-yellow-800',
      high: 'bg-orange-50 text-orange-800',
      severe: 'bg-red-50 text-red-800'
    };

    toast(`Traffic Alert: ${data.description}`, {
      description: `Impact: ${data.impact_duration} minutes`,
      className: levelColors[data.level],
      duration: 8000,
    });
  }

  private handleOptimizationComplete(data: OptimizationCompleteMessage) {
    toast.success(`Route ${data.route_id} optimized!`, {
      description: `Time saved: ${data.time_saved}min, Distance saved: ${data.distance_saved}km`,
      duration: 8000,
    });
  }

  private handleSimulationComplete(data: SimulationCompleteMessage) {
    if (data.status === 'completed') {
      toast.success(`Simulation ${data.simulation_id} completed!`, {
        description: 'Check results in the simulations panel',
        duration: 8000,
      });
    } else {
      toast.error(`Simulation ${data.simulation_id} failed`, {
        description: 'Please try again or contact support',
        duration: 8000,
      });
    }
  }

  // Subscribe to specific message types
  subscribe(type: string, callback: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  // Send message to server
  send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data, timestamp: new Date().toISOString() }));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  // Get connection status
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  // Disconnect
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  // Reconnect manually
  reconnect() {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// React hook for WebSocket
export const useWebSocket = () => {
  return websocketService;
};
