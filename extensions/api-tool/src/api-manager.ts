import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  auth?: {
    type: "none" | "basic" | "bearer" | "apiKey";
    username?: string;
    password?: string;
    token?: string;
    apiKey?: string;
    apiKeyHeader?: string;
  };
  params?: Record<string, string>;
  data?: any;
  timeout?: number;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  latency: number;
}

export interface ApiTestResult {
  success: boolean;
  response?: ApiResponse;
  error?: string;
}

export class ApiManager {
  private endpoints: Map<string, ApiEndpoint> = new Map();
  private axiosInstances: Map<string, AxiosInstance> = new Map();

  /**
   * Create a new API endpoint
   */
  createEndpoint(endpoint: Omit<ApiEndpoint, "id">): ApiEndpoint {
    const id = uuidv4();
    const newEndpoint: ApiEndpoint = {
      id,
      ...endpoint,
    };
    this.endpoints.set(id, newEndpoint);
    this.createAxiosInstance(id);
    return newEndpoint;
  }

  /**
   * Get all API endpoints
   */
  getEndpoints(): ApiEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  /**
   * Get an API endpoint by ID
   */
  getEndpoint(id: string): ApiEndpoint | undefined {
    return this.endpoints.get(id);
  }

  /**
   * Update an API endpoint
   */
  updateEndpoint(id: string, updates: Partial<ApiEndpoint>): ApiEndpoint | undefined {
    const existingEndpoint = this.endpoints.get(id);
    if (!existingEndpoint) {
      return undefined;
    }

    const updatedEndpoint = {
      ...existingEndpoint,
      ...updates,
    };

    this.endpoints.set(id, updatedEndpoint);
    this.createAxiosInstance(id);
    return updatedEndpoint;
  }

  /**
   * Delete an API endpoint
   */
  deleteEndpoint(id: string): boolean {
    const deleted = this.endpoints.delete(id);
    if (deleted) {
      this.axiosInstances.delete(id);
    }
    return deleted;
  }

  /**
   * Send an API request
   */
  async sendRequest(
    id: string,
    overrideConfig?: Partial<AxiosRequestConfig>,
  ): Promise<ApiResponse> {
    const endpoint = this.endpoints.get(id);
    if (!endpoint) {
      throw new Error(`Endpoint with ID ${id} not found`);
    }

    const axiosInstance = this.axiosInstances.get(id);
    if (!axiosInstance) {
      throw new Error(`Axios instance for endpoint ${id} not found`);
    }

    const startTime = Date.now();

    try {
      const config: AxiosRequestConfig = {
        url: endpoint.url,
        method: endpoint.method,
        headers: endpoint.headers,
        params: endpoint.params,
        data: endpoint.data,
        timeout: endpoint.timeout || 30000,
        ...overrideConfig,
      };

      const response: AxiosResponse = await axiosInstance.request(config);
      const latency = Date.now() - startTime;

      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: this.normalizeHeaders(response.headers),
        latency,
      };
    } catch (error: any) {
      const latency = Date.now() - startTime;
      if (error.response) {
        throw {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: this.normalizeHeaders(error.response.headers),
          latency,
        };
      }
      throw error;
    }
  }

  /**
   * Test an API endpoint
   */
  async testEndpoint(id: string): Promise<ApiTestResult> {
    try {
      const response = await this.sendRequest(id);
      return {
        success: true,
        response,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || JSON.stringify(error),
      };
    }
  }

  /**
   * Batch test multiple API endpoints
   */
  async batchTestEndpoints(ids: string[]): Promise<Map<string, ApiTestResult>> {
    const results = new Map<string, ApiTestResult>();

    await Promise.all(
      ids.map(async (id) => {
        const result = await this.testEndpoint(id);
        results.set(id, result);
      }),
    );

    return results;
  }

  /**
   * Create axios instance with auth configuration
   */
  private createAxiosInstance(id: string): void {
    const endpoint = this.endpoints.get(id);
    if (!endpoint) {
      return;
    }

    const axiosConfig: AxiosRequestConfig = {};

    // Configure authentication
    if (endpoint.auth) {
      switch (endpoint.auth.type) {
        case "basic":
          if (endpoint.auth.username && endpoint.auth.password) {
            axiosConfig.auth = {
              username: endpoint.auth.username,
              password: endpoint.auth.password,
            };
          }
          break;
        case "bearer":
          if (endpoint.auth.token) {
            axiosConfig.headers = {
              ...axiosConfig.headers,
              Authorization: `Bearer ${endpoint.auth.token}`,
            };
          }
          break;
        case "apiKey":
          if (endpoint.auth.apiKey && endpoint.auth.apiKeyHeader) {
            axiosConfig.headers = {
              ...axiosConfig.headers,
              [endpoint.auth.apiKeyHeader]: endpoint.auth.apiKey,
            };
          }
          break;
      }
    }

    this.axiosInstances.set(id, axios.create(axiosConfig));
  }

  /**
   * Normalize headers to plain object
   */
  private normalizeHeaders(headers: any): Record<string, string> {
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      normalized[key] = String(value);
    }
    return normalized;
  }

  /**
   * Import API endpoints from JSON
   */
  importEndpoints(endpoints: ApiEndpoint[]): number {
    let count = 0;
    for (const endpoint of endpoints) {
      this.endpoints.set(endpoint.id, endpoint);
      this.createAxiosInstance(endpoint.id);
      count++;
    }
    return count;
  }

  /**
   * Export API endpoints to JSON
   */
  exportEndpoints(): ApiEndpoint[] {
    return this.getEndpoints();
  }
}
