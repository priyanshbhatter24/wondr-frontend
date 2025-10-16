"use client";

import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";

import { GenerateImageRequest, GenerateImageResponse, ImageGeneration, ImageGenerationSession, ChatMessage, UserSessionsResponse, PlanModeChatRequest, PlanModeChatResponse, UpdateSessionRequest } from "@/types/image-generation";
import { IndustryUpdate, IndustryUpdatesListResponse, UpdateIcpResponse, UserICPConfig } from "@/types/industry-updates";
import { InitialPromptRequest, InitialPromptResponse, PostIdeationRequest, PostIdeationResponse, PostIdeationHistoryItem } from "@/types/post-ideation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type JsonRecord = Record<string, unknown>;

interface ImageGenerationHistoryResponse {
  generations: ImageGeneration[];
}

interface ImageGenerationMessagesResponse {
  messages: ChatMessage[];
}

/**
 * Client-side API client for use in React components
 * Uses Clerk's useAuth hook to get authentication token
 */
export function useApiClient() {
  const { getToken } = useAuth();

  return useMemo(() => {
    async function apiClient<TResponse>(endpoint: string, options: RequestInit = {}): Promise<TResponse> {
      const token = await getToken();

      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const url = `${API_URL}${endpoint}`;
      console.log("[API Client] Request:", { url, method: options.method || "GET", hasToken: !!token });

      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log("[API Client] Response:", { status: response.status, statusText: response.statusText });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "No error details");
        console.error("[API Client] Error details:", errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json() as Promise<TResponse>;
    }

    return {
      auth: {
        getMe: () => apiClient<JsonRecord>("/api/auth/me"),
      },
      campaigns: {
        list: () => apiClient<JsonRecord>("/api/campaigns"),
        create: (data: JsonRecord) =>
          apiClient<JsonRecord>("/api/campaigns", {
            method: "POST",
            body: JSON.stringify(data),
          }),
      },
      analytics: {
        get: () => apiClient<JsonRecord>("/api/analytics"),
      },
      ai: {
        generateInsights: (data: JsonRecord) =>
          apiClient<JsonRecord>("/api/ai/insights", {
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
          return apiClient<IndustryUpdatesListResponse>(endpoint);
        },
        get: (id: string) => apiClient<IndustryUpdate>(`/api/industry-updates/${id}`),
      },
      userConfig: {
        getIcp: () => apiClient<UserICPConfig>("/api/user-config/icp"),
        updateIcp: (data: UserICPConfig) =>
          apiClient<UpdateIcpResponse>("/api/user-config/icp", {
            method: "POST",
            body: JSON.stringify(data),
          }),
      },
      postIdeation: {
        generatePrompt: (data: InitialPromptRequest) =>
          apiClient<InitialPromptResponse>("/api/post-ideation/generate-prompt", {
            method: "POST",
            body: JSON.stringify(data),
          }),
        generate: (data: PostIdeationRequest) =>
          apiClient<PostIdeationResponse>("/api/post-ideation", {
            method: "POST",
            body: JSON.stringify(data),
          }),
        getHistory: (industryUpdateId: string) =>
          apiClient<PostIdeationHistoryItem[]>(`/api/post-ideation/history/${industryUpdateId}`),
        getById: (industryUpdateId: string, ideationId: string) =>
          apiClient<PostIdeationResponse[]>(`/api/post-ideation/history/${industryUpdateId}/${ideationId}`),  // Returns array of all turns
      },
      imageGeneration: {
        createSession: () =>
          apiClient<ImageGenerationSession>("/api/image-generation/sessions", {
            method: "POST",
          }),
        getSession: (sessionId: string) =>
          apiClient<ImageGenerationSession>(`/api/image-generation/sessions/${sessionId}`),
        updateSession: (sessionId: string, data: UpdateSessionRequest) =>
          apiClient<ImageGenerationSession>(`/api/image-generation/sessions/${sessionId}`, {
            method: "PATCH",
            body: JSON.stringify(data),
          }),
        generate: async (data: GenerateImageRequest) => {
          const token = await getToken();

          // If files provided, use FormData; otherwise use JSON
          if (data.files && data.files.length > 0) {
            const formData = new FormData();
            formData.append('session_id', data.session_id);
            formData.append('prompt', data.prompt);
            if (data.previous_generation_id) formData.append('previous_generation_id', data.previous_generation_id);
            if (data.aspect_ratio) formData.append('aspect_ratio', data.aspect_ratio);
            if (data.channel) formData.append('channel', data.channel);

            data.files.forEach((file) => {
              formData.append('files', file);
            });

            const url = `${API_URL}/api/image-generation/generate`;
            console.log("[API Client] Request (FormData):", { url, method: "POST", hasToken: !!token, fileCount: data.files.length });

            const response = await fetch(url, {
              method: 'POST',
              headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
                // Don't set Content-Type - browser will set it with boundary
              },
              body: formData
            });

            console.log("[API Client] Response:", { status: response.status, statusText: response.statusText });

            if (!response.ok) {
              const errorText = await response.text().catch(() => "No error details");
              console.error("[API Client] Error details:", errorText);
              throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            return response.json() as Promise<GenerateImageResponse>;
          } else {
            // Use JSON for backward compatibility (no files)
            return apiClient<GenerateImageResponse>("/api/image-generation/generate", {
              method: "POST",
              body: JSON.stringify(data),
            });
          }
        },
        getHistory: (sessionId: string) =>
          apiClient<ImageGenerationHistoryResponse>(`/api/image-generation/sessions/${sessionId}/history`),
        getMessages: (sessionId: string) =>
          apiClient<ImageGenerationMessagesResponse>(`/api/image-generation/sessions/${sessionId}/messages`),
        getUserSessions: (params?: { limit?: number; offset?: number }) => {
          let endpoint = "/api/image-generation/user-generations";
          if (params) {
            const searchParams = new URLSearchParams();
            if (params.limit !== undefined) searchParams.append("limit", params.limit.toString());
            if (params.offset !== undefined) searchParams.append("offset", params.offset.toString());
            const queryString = searchParams.toString();
            if (queryString) {
              endpoint += `?${queryString}`;
            }
          }
          return apiClient<UserSessionsResponse>(endpoint);
        },
      },
      planMode: {
        chat: async (data: PlanModeChatRequest) => {
          const token = await getToken();

          const formData = new FormData();
          formData.append('session_id', data.session_id);
          formData.append('message', data.message);

          if (data.files) {
            data.files.forEach((file) => {
              formData.append('files', file);
            });
          }

          const url = `${API_URL}/api/plan-mode/chat`;
          console.log("[API Client] Request:", { url, method: "POST", hasToken: !!token, fileCount: data.files?.length || 0 });

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
              // Don't set Content-Type - browser will set it with boundary
            },
            body: formData
          });

          console.log("[API Client] Response:", { status: response.status, statusText: response.statusText });

          if (!response.ok) {
            const errorText = await response.text().catch(() => "No error details");
            console.error("[API Client] Error details:", errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
          }

          return response.json() as Promise<PlanModeChatResponse>;
        },
      },
    };
  }, [getToken]);
}
