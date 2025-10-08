import apiClient from './client';

export interface SMSMessage {
  id: string;
  to: string;
  from: string;
  body: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  created_at: string;
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
}

export interface SendSMSInput {
  to: string;
  body: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  route_id?: string;
  notification_type?: string;
}

export interface SMSDeliveryReport {
  message_id: string;
  status: 'delivered' | 'failed' | 'undelivered';
  error_code?: string;
  error_message?: string;
  delivered_at?: string;
}

export const smsApi = {
  // Send SMS message
  sendSMS: async (input: SendSMSInput): Promise<SMSMessage> => {
    const response = await apiClient.post<SMSMessage>('/sms/send', input);
    return response.data;
  },

  // Send bulk SMS messages
  sendBulkSMS: async (messages: SendSMSInput[]): Promise<SMSMessage[]> => {
    const response = await apiClient.post<SMSMessage[]>('/sms/send-bulk', { messages });
    return response.data;
  },

  // Get SMS message by ID
  getSMSById: async (id: string): Promise<SMSMessage> => {
    const response = await apiClient.get<SMSMessage>(`/sms/${id}`);
    return response.data;
  },

  // Get SMS messages for a route
  getSMSForRoute: async (routeId: string): Promise<SMSMessage[]> => {
    const response = await apiClient.get<SMSMessage[]>(`/sms/route/${routeId}`);
    return response.data;
  },

  // Get SMS delivery reports
  getDeliveryReports: async (messageIds: string[]): Promise<SMSDeliveryReport[]> => {
    const response = await apiClient.post<SMSDeliveryReport[]>('/sms/delivery-reports', {
      message_ids: messageIds
    });
    return response.data;
  },

  // Send route update notification
  sendRouteUpdateNotification: async (routeId: string, driverPhone: string, update: {
    type: 'assigned' | 'updated' | 'completed' | 'delayed' | 'cancelled';
    message: string;
    eta?: string;
    location?: string;
  }): Promise<SMSMessage> => {
    const response = await apiClient.post<SMSMessage>('/sms/route-notification', {
      route_id: routeId,
      driver_phone: driverPhone,
      ...update
    });
    return response.data;
  },

  // Send weather alert notification
  sendWeatherAlert: async (driverPhone: string, alert: {
    severity: 'low' | 'medium' | 'high' | 'severe';
    title: string;
    description: string;
    affected_routes: string[];
    recommendations: string[];
  }): Promise<SMSMessage> => {
    const response = await apiClient.post<SMSMessage>('/sms/weather-alert', {
      driver_phone: driverPhone,
      ...alert
    });
    return response.data;
  },

  // Send traffic alert notification
  sendTrafficAlert: async (driverPhone: string, alert: {
    level: 'low' | 'medium' | 'high' | 'severe';
    description: string;
    affected_routes: string[];
    impact_duration: number;
    alternative_routes?: string[];
  }): Promise<SMSMessage> => {
    const response = await apiClient.post<SMSMessage>('/sms/traffic-alert', {
      driver_phone: driverPhone,
      ...alert
    });
    return response.data;
  },

  // Send delivery completion notification
  sendDeliveryCompletion: async (routeId: string, stopId: string, driverPhone: string, customerPhone: string, details: {
    stop_address: string;
    completed_at: string;
    signature_required: boolean;
    photo_taken: boolean;
    special_instructions?: string;
  }): Promise<SMSMessage> => {
    const response = await apiClient.post<SMSMessage>('/sms/delivery-completion', {
      route_id: routeId,
      stop_id: stopId,
      driver_phone: driverPhone,
      customer_phone: customerPhone,
      ...details
    });
    return response.data;
  },

  // Send optimization complete notification
  sendOptimizationComplete: async (routeId: string, driverPhone: string, results: {
    optimization_score: number;
    time_saved: number;
    distance_saved: number;
    new_eta: string;
    changes_summary: string[];
  }): Promise<SMSMessage> => {
    const response = await apiClient.post<SMSMessage>('/sms/optimization-complete', {
      route_id: routeId,
      driver_phone: driverPhone,
      ...results
    });
    return response.data;
  },

  // Get SMS statistics
  getSMSStats: async (period?: string): Promise<{
    total_sent: number;
    total_delivered: number;
    delivery_rate: number;
    failed_count: number;
    by_priority: Record<string, number>;
    by_type: Record<string, number>;
  }> => {
    const response = await apiClient.get('/sms/stats', {
      params: period ? { period } : {}
    });
    return response.data;
  },

  // Test SMS functionality
  sendTestSMS: async (phoneNumber: string): Promise<SMSMessage> => {
    const response = await apiClient.post<SMSMessage>('/sms/test', {
      phone_number: phoneNumber
    });
    return response.data;
  }
};
