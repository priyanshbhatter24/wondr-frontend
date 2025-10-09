"use client";

import { useAuth } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Debug: Log the API_URL value that was compiled into the bundle
console.log('🌐 [API Client] API_URL loaded:', API_URL);

/**
 * Client-side API client for use in React components
 * Uses Clerk's useAuth hook to get authentication token
 */
export function useApiClient() {
  const { getToken } = useAuth();

  async function apiClient(endpoint: string, options: RequestInit = {}) {
    const token = await getToken();

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const url = `${API_URL}${endpoint}`;
    console.log('[API Client] Request:', { url, method: options.method || 'GET', hasToken: !!token });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('[API Client] Response:', { status: response.status, statusText: response.statusText });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      console.error('[API Client] Error details:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  return {
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
        let endpoint = "/api/industry-updates";
        if (params) {
          const searchParams = new URLSearchParams();
          if (params.limit !== undefined) searchParams.append("limit", params.limit.toString());
          if (params.offset !== undefined) searchParams.append("offset", params.offset.toString());
          const queryString = searchParams.toString();
          if (queryString) {
            endpoint += `?${queryString}`;
          }
        }
        return apiClient(endpoint);
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
    postIdeation: {
      generatePrompt: (data: { industry_update_id: string; post_suggestion_index: number }) =>
        apiClient("/api/post-ideation/generate-prompt", {
          method: "POST",
          body: JSON.stringify(data),
        }),
      generate: (data: { industry_update_id: string; post_suggestion_index: number; user_prompt: string }) =>
        apiClient("/api/post-ideation", {
          method: "POST",
          body: JSON.stringify(data),
        }),
    },
    imageGeneration: {
      createSession: () =>
        apiClient("/api/image-generation/sessions", {
          method: "POST",
        }),
      getSession: (sessionId: string) =>
        apiClient(`/api/image-generation/sessions/${sessionId}`),
      generate: (data: { session_id: string; prompt: string; previous_generation_id?: string }) =>
        apiClient("/api/image-generation/generate", {
          method: "POST",
          body: JSON.stringify(data),
        }),
      getHistory: (sessionId: string) =>
        apiClient(`/api/image-generation/sessions/${sessionId}/history`),
      getMessages: (sessionId: string) =>
        apiClient(`/api/image-generation/sessions/${sessionId}/messages`),
    },
  };
}
