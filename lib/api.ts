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
};