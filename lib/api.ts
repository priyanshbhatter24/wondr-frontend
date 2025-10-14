import { auth } from "@clerk/nextjs/server";

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

export async function apiClient<TResponse>(endpoint: string, options: RequestInit = {}): Promise<TResponse> {
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

  return response.json() as Promise<TResponse>;
}

// Example API functions
export const api = {
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
      const searchParams = new URLSearchParams();
      if (params?.limit !== undefined) searchParams.append("limit", params.limit.toString());
      if (params?.offset !== undefined) searchParams.append("offset", params.offset.toString());
      const queryString = searchParams.toString();
      return apiClient<IndustryUpdatesListResponse>(`/api/industry-updates${queryString ? `?${queryString}` : ""}`);
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
    createSession: (model?: string) =>
      apiClient<ImageGenerationSession>("/api/image-generation/sessions", {
        method: "POST",
        body: JSON.stringify({ model }),
      }),
    getSession: (sessionId: string) =>
      apiClient<ImageGenerationSession>(`/api/image-generation/sessions/${sessionId}`),
    updateSession: (sessionId: string, data: UpdateSessionRequest) =>
      apiClient<ImageGenerationSession>(`/api/image-generation/sessions/${sessionId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    generate: (data: GenerateImageRequest & { model: string }) =>
      apiClient<GenerateImageResponse>("/api/image-generation/generate", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getHistory: (sessionId: string) =>
      apiClient<ImageGenerationHistoryResponse>(`/api/image-generation/sessions/${sessionId}/history`),
    getMessages: (sessionId: string) =>
      apiClient<ImageGenerationMessagesResponse>(`/api/image-generation/sessions/${sessionId}/messages`),
    getUserSessions: (params?: { limit?: number; offset?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.limit !== undefined) searchParams.append("limit", params.limit.toString());
      if (params?.offset !== undefined) searchParams.append("offset", params.offset.toString());
      const queryString = searchParams.toString();
      return apiClient<UserSessionsResponse>(`/api/image-generation/user-generations${queryString ? `?${queryString}` : ""}`);
    },
  },
  planMode: {
    chat: (data: PlanModeChatRequest) =>
      apiClient<PlanModeChatResponse>("/api/plan-mode/chat", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};