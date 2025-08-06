// src/lib/api.ts
import type {
  LoginRequest,
  LoginResponse,
  AuthUser,
  DashboardData,
  Incident,
  Tenant,
  SecurityRule,
  RuleTemplate,
  ErrorResponse,
} from "./types";

const API_BASE = "http://localhost:3001";

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Initialize token from localStorage
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        error: "Network Error",
        message: response.statusText,
        statusCode: response.status,
      }));

      // Handle unauthorized - clear token and redirect to login
      if (response.status === 401) {
        this.clearToken();
      }

      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    this.setToken(response.token);
    return response;
  }

  async getCurrentUser(): Promise<AuthUser> {
    return this.request<AuthUser>("/auth/me");
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/health");
  }

  // Dashboard endpoints
  async getDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>("/api/dashboard");
  }

  async getAlerts(): Promise<any> {
    return this.request<any>("/api/dashboard/alerts");
  }

  async getActivityFeed(): Promise<any> {
    return this.request<any>("/api/dashboard/activity-feed");
  }

  // Incident endpoints
  async getIncidents(params?: {
    severity?: string;
    status?: string;
    tenantId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    data: Incident[];
    total: number;
    hasMore: boolean;
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/incidents?${queryString}`
      : "/api/incidents";

    return this.request(endpoint);
  }

  async getIncident(id: string): Promise<Incident> {
    return this.request<Incident>(`/api/incidents/${id}`);
  }

  async updateIncidentStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<Incident> {
    return this.request<Incident>(`/api/incidents/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, notes }),
    });
  }

  async getIncidentTimeline(id: string): Promise<any> {
    return this.request<any>(`/api/incidents/${id}/timeline`);
  }

  // Tenant endpoints
  async getTenants(): Promise<Tenant[]> {
    return this.request<Tenant[]>("/api/tenants");
  }

  async getTenant(id: string): Promise<Tenant> {
    return this.request<Tenant>(`/api/tenants/${id}`);
  }

  async createTenant(data: {
    name: string;
    tenantId: string;
    domain?: string;
    clientId: string;
    clientSecret: string;
  }): Promise<Tenant> {
    return this.request<Tenant>("/api/tenants", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant> {
    return this.request<Tenant>(`/api/tenants/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async testTenantConnection(id: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    return this.request(`/api/tenants/${id}/test-connection`, {
      method: "POST",
    });
  }

  // Rules endpoints
  async getRuleTemplates(): Promise<RuleTemplate[]> {
    return this.request<RuleTemplate[]>("/api/rules/templates");
  }

  async getTenantRules(tenantId: string): Promise<SecurityRule[]> {
    return this.request<SecurityRule[]>(`/api/tenants/${tenantId}/rules`);
  }

  async createRule(
    tenantId: string,
    data: Partial<SecurityRule>
  ): Promise<SecurityRule> {
    return this.request<SecurityRule>(`/api/tenants/${tenantId}/rules`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createRuleFromTemplate(
    tenantId: string,
    templateId: string,
    data: {
      name: string;
      parameters?: Record<string, any>;
      severity?: string;
    }
  ): Promise<SecurityRule> {
    return this.request<SecurityRule>(
      `/api/tenants/${tenantId}/rules/from-template`,
      {
        method: "POST",
        body: JSON.stringify({ templateId, ...data }),
      }
    );
  }

  // Users endpoints
  async getUsers(): Promise<any[]> {
    return this.request<any[]>("/api/users");
  }

  async createUser(data: any): Promise<any> {
    return this.request<any>("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any): Promise<any> {
    return this.request<any>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();

// React Query keys
export const queryKeys = {
  auth: ["auth"] as const,
  dashboard: ["dashboard"] as const,
  incidents: (filters?: any) => ["incidents", filters] as const,
  incident: (id: string) => ["incident", id] as const,
  tenants: ["tenants"] as const,
  tenant: (id: string) => ["tenant", id] as const,
  rules: (tenantId: string) => ["rules", tenantId] as const,
  ruleTemplates: ["rule-templates"] as const,
  users: ["users"] as const,
} as const;
