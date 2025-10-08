import apiClient from './client';
import type { PerformanceReport, CreateReportInput, ReportFilters } from '@/types/report';
import type { PaginatedResponse, QueryParams } from '@/types/api';

export const reportsApi = {
  // Get all reports
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<PerformanceReport>> => {
    const response = await apiClient.get<PaginatedResponse<PerformanceReport>>('/reports', { params });
    return response.data;
  },

  // Get report by ID
  getById: async (id: string): Promise<PerformanceReport> => {
    const response = await apiClient.get<PerformanceReport>(`/reports/${id}`);
    return response.data;
  },

  // Create new report
  create: async (report: CreateReportInput): Promise<PerformanceReport> => {
    const response = await apiClient.post<PerformanceReport>('/reports', report);
    return response.data;
  },

  // Generate report
  generate: async (filters: ReportFilters): Promise<PerformanceReport> => {
    const response = await apiClient.post<PerformanceReport>('/reports/generate', filters);
    return response.data;
  },

  // Download report as PDF
  downloadPDF: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/reports/${id}/download/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Download report as CSV
  downloadCSV: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/reports/${id}/download/csv`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get report insights
  getInsights: async (id: string): Promise<PerformanceReport['insights']> => {
    const response = await apiClient.get<PerformanceReport['insights']>(`/reports/${id}/insights`);
    return response.data;
  },

  // Get report recommendations
  getRecommendations: async (id: string): Promise<PerformanceReport['recommendations']> => {
    const response = await apiClient.get<PerformanceReport['recommendations']>(`/reports/${id}/recommendations`);
    return response.data;
  },

  // Get report metrics
  getMetrics: async (id: string): Promise<PerformanceReport['metrics']> => {
    const response = await apiClient.get<PerformanceReport['metrics']>(`/reports/${id}/metrics`);
    return response.data;
  },

  // Get dashboard summary
  getDashboardSummary: async (period?: string): Promise<any> => {
    const response = await apiClient.get('/reports/dashboard-summary', {
      params: period ? { period } : {}
    });
    return response.data;
  },

  // Get performance trends
  getTrends: async (period: string, metric: string): Promise<any> => {
    const response = await apiClient.get('/reports/trends', {
      params: { period, metric }
    });
    return response.data;
  },

  // Get comparative analysis
  getComparativeAnalysis: async (period1: string, period2: string): Promise<any> => {
    const response = await apiClient.get('/reports/comparative', {
      params: { period1, period2 }
    });
    return response.data;
  },

  // Delete report
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/reports/${id}`);
  },
};