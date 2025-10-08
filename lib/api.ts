import { auth } from "@clerk/nextjs/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const { getToken } = await auth();
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Example API functions
export const api = {
  auth: {
    getMe: () => apiClient("/api/auth/me"),
  },
  campaigns: {
    list: () => apiClient("/api/campaigns"),
    create: (data: any) =>
      apiClient("/api/campaigns", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  analytics: {
    get: () => apiClient("/api/analytics"),
  },
  ai: {
    generateInsights: (data: any) =>
      apiClient("/api/ai/insights", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  industryUpdates: {
    list: (params?: { limit?: number; offset?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.offset) searchParams.append("offset", params.offset.toString());
      const queryString = searchParams.toString();
      return apiClient(`/api/industry-updates${queryString ? `?${queryString}` : ""}`);
    },
    get: (id: string) => apiClient(`/api/industry-updates/${id}`),
  },
  userConfig: {
    getIcp: () => apiClient("/api/user-config/icp"),
    updateIcp: (data: any) =>
      apiClient("/api/user-config/icp", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};