export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
}

export interface FilterParams {
  [key: string]: any;
}

export interface QueryParams extends PaginationParams, FilterParams {}

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface ApiClient {
  get<T>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
}