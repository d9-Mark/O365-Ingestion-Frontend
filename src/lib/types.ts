// src/lib/types.ts
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "admin" | "manager" | "analyst" | "viewer";
  permissions: string[];
  lastLoginAt: string | null;
  customerId: string;
}

export interface Customer {
  id: string;
  name: string;
  companyName: string | null;
  subscriptionTier: "basic" | "professional" | "enterprise";
  isActive: boolean;
}

export interface AuthUser extends User {
  customer: Customer;
}

export interface Tenant {
  id: string;
  name: string;
  tenantId: string;
  domain: string | null;
  isActive: boolean;
  lastPollAt: string | null;
  tenantInfo: Record<string, any>;
}

export interface Incident {
  id: string;
  title: string;
  description: string | null;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "open" | "investigating" | "resolved" | "false_positive";
  affectedUser: string | null;
  affectedResource: string | null;
  sourceIp: string | null;
  location: string | null;
  detectedAt: string;
  resolvedAt: string | null;
  tenant: {
    id: string;
    name: string;
  };
  rule: {
    id: string;
    name: string;
    ruleType: string;
  };
}

export interface SecurityRule {
  id: string;
  name: string;
  description: string | null;
  ruleType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  parameters: Record<string, any>;
  conditions: Record<string, any>;
  actions: string[];
  isActive: boolean;
  lastTriggeredAt: string | null;
  triggerCount: number;
}

export interface RuleTemplate {
  id: string;
  name: string;
  description: string | null;
  ruleType: string;
  severity: string;
  category: string | null;
  isPremium: boolean;
  defaultParameters: Record<string, any>;
  defaultConditions: Record<string, any>;
  defaultActions: string[];
}

export interface DashboardOverview {
  tenants: {
    total: number;
    active: number;
  };
  incidents: {
    total: number;
    open: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  users: {
    total: number;
    active: number;
  };
}

export interface DashboardData {
  overview: DashboardOverview;
  recentIncidents: Incident[];
  trends: {
    incidentsByDay: Record<string, number>;
    incidentsBySeverity: Record<string, number>;
  };
  tenantHealth: Array<{
    id: string;
    name: string;
    status: "healthy" | "warning" | "error";
    lastPoll: string | null;
    incidentCount: number;
  }>;
  topAffectedUsers: Array<{
    user: string;
    incidentCount: number;
  }>;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
