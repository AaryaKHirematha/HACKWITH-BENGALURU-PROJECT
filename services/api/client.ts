/**
 * API Client
 * Axios-based HTTP client with interceptors and error handling
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { ApiResponse, ApiError } from '@/types';

// ============================================================
// CLIENT CONFIGURATION
// ============================================================

/** Base API configuration */
const API_CONFIG: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// ============================================================
// HTTP CLIENT CLASS
// ============================================================

/**
 * Enterprise HTTP Client
 * Handles authentication, error transformation, and request/response interceptors
 */
class HttpClient {
  private client: AxiosInstance;
  private static instance: HttpClient;

  private constructor() {
    this.client = axios.create(API_CONFIG);
    this.setupInterceptors();
  }

  /** Singleton pattern for consistent client usage */
  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  /** Configure request and response interceptors */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('aegis_auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError = this.transformError(error);
        
        // Handle specific error codes
        if (apiError.code === 'UNAUTHORIZED') {
          localStorage.removeItem('aegis_auth_token');
          window.location.href = '/login';
        }
        
        return Promise.reject(apiError);
      }
    );
  }

  /** Transform axios errors to our ApiError format */
  private transformError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        code: error.response?.status?.toString() || 'NETWORK_ERROR',
        message: error.response?.data?.message || error.message || 'An error occurred',
        details: error.response?.data,
        timestamp: new Date(),
      };
    }
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      timestamp: new Date(),
    };
  }

  // ============================================================
  // HTTP METHODS
  // ============================================================

  /** GET request */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  /** POST request */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  /** PUT request */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  /** PATCH request */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  /** DELETE request */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  /** Upload file with progress tracking */
  async upload<T>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data.data;
  }

  /** Download file */
  async download(url: string, filename: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}

// Export singleton instance
export const httpClient = HttpClient.getInstance();
export default httpClient;
