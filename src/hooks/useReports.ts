import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports';
import { toast } from 'sonner';
import type { ReportFilters } from '@/types/report';

// Query keys
export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (filters: string) => [...reportKeys.lists(), { filters }] as const,
  details: () => [...reportKeys.all, 'detail'] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
  metrics: () => [...reportKeys.all, 'metrics'] as const,
  insights: (id: string) => [...reportKeys.detail(id), 'insights'] as const,
  recommendations: (id: string) => [...reportKeys.detail(id), 'recommendations'] as const,
};

// Get all reports
export const useReports = (filters?: ReportFilters) => {
  return useQuery({
    queryKey: [...reportKeys.lists(), filters],
    queryFn: () => reportsApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get report by ID
export const useReport = (id: string) => {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => reportsApi.getById(id),
    enabled: !!id,
  });
};

// Get report metrics
export const useReportMetrics = (id: string) => {
  return useQuery({
    queryKey: [...reportKeys.metrics(), id],
    queryFn: () => reportsApi.getMetrics(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get report insights
export const useReportInsights = (id: string) => {
  return useQuery({
    queryKey: reportKeys.insights(id),
    queryFn: () => reportsApi.getInsights(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get report recommendations
export const useReportRecommendations = (id: string) => {
  return useQuery({
    queryKey: reportKeys.recommendations(id),
    queryFn: () => reportsApi.getRecommendations(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create report mutation
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportsApi.create,
    onSuccess: (newReport) => {
      // Invalidate and refetch reports list
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      
      // Add the new report to the cache
      queryClient.setQueryData(reportKeys.detail(newReport.id), newReport);
      
      toast.success('Report generated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to generate report: ${error.message || 'Unknown error'}`);
    },
  });
};

// Delete report mutation
export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the report from the cache
      queryClient.removeQueries({ queryKey: reportKeys.detail(deletedId) });
      
      // Invalidate reports list
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      
      toast.success('Report deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete report: ${error.message || 'Unknown error'}`);
    },
  });
};

// Download report mutation
export const useDownloadReport = () => {
  return useMutation({
    mutationFn: ({ id, format }: { id: string; format: 'pdf' | 'csv' }) => {
      if (format === 'pdf') {
        return reportsApi.downloadPDF(id);
      } else {
        return reportsApi.downloadCSV(id);
      }
    },
    onSuccess: (blob, { format }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Report downloaded as ${format.toUpperCase()}`);
    },
    onError: (error: any) => {
      toast.error(`Failed to download report: ${error.message || 'Unknown error'}`);
    },
  });
};

// Generate report mutation
export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportsApi.generate,
    onSuccess: (newReport) => {
      // Invalidate and refetch reports list
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      
      // Add the new report to the cache
      queryClient.setQueryData(reportKeys.detail(newReport.id), newReport);
      
      toast.success('Report generated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to generate report: ${error.message || 'Unknown error'}`);
    },
  });
};

// Get dashboard summary
export const useDashboardSummary = (period?: string) => {
  return useQuery({
    queryKey: [...reportKeys.all, 'dashboard-summary', period],
    queryFn: () => reportsApi.getDashboardSummary(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get performance trends
export const usePerformanceTrends = (period: string, metric: string) => {
  return useQuery({
    queryKey: [...reportKeys.all, 'trends', period, metric],
    queryFn: () => reportsApi.getTrends(period, metric),
    enabled: !!period && !!metric,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get comparative analysis
export const useComparativeAnalysis = (period1: string, period2: string) => {
  return useQuery({
    queryKey: [...reportKeys.all, 'comparative', period1, period2],
    queryFn: () => reportsApi.getComparativeAnalysis(period1, period2),
    enabled: !!period1 && !!period2,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
