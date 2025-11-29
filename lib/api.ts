import { auth } from "@clerk/nextjs/server";

import { GenerateImageRequest, GenerateImageResponse, ImageGeneration, ImageGenerationSession, ChatMessage, UserSessionsResponse, PlanModeChatRequest, PlanModeChatResponse, UpdateSessionRequest, SaveCanvasDataRequest } from "@/types/image-generation";
import { BrandAsset, IndustryUpdate, IndustryUpdatesListResponse, UpdateIcpResponse, UserICPConfig } from "@/types/industry-updates";
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
    triggerResearch: () =>
      apiClient<{ success: boolean; message: string; user_id: string }>("/api/industry-updates/research", {
        method: "POST",
      }),
  },
  userConfig: {
    getIcp: () => apiClient<UserICPConfig>("/api/user-config/icp"),
    updateIcp: (data: UserICPConfig) =>
      apiClient<UpdateIcpResponse>("/api/user-config/icp", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    uploadLogo: async (file: File) => {
      const { getToken } = await auth();
      const token = await getToken();

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/user-config/logo`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json() as Promise<{ success: boolean; logo_url: string; s3_key: string; message: string }>;
    },
    uploadBrandAsset: async (file: File, label: string) => {
      const { getToken } = await auth();
      const token = await getToken();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('label', label);

      const response = await fetch(`${API_URL}/api/user-config/brand-assets`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `API Error: ${response.statusText}`);
      }

      return response.json() as Promise<{ success: boolean; asset: BrandAsset; message: string }>;
    },
    deleteBrandAsset: async (assetId: string) => {
      const { getToken } = await auth();
      const token = await getToken();

      const response = await fetch(`${API_URL}/api/user-config/brand-assets/${assetId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json() as Promise<{ success: boolean; message: string }>;
    },
    updateBrandAssetLabel: async (assetId: string, label: string) => {
      const { getToken } = await auth();
      const token = await getToken();

      const formData = new FormData();
      formData.append('label', label);

      const response = await fetch(`${API_URL}/api/user-config/brand-assets/${assetId}`, {
        method: 'PATCH',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json() as Promise<{ success: boolean; message: string }>;
    },
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
      const token = await auth();
      const userToken = await token.getToken();

      const formData = new FormData();
      formData.append("session_id", data.session_id);
      formData.append("prompt", data.prompt);
      if (data.previous_generation_id) formData.append("previous_generation_id", data.previous_generation_id);
      if (data.aspect_ratio) formData.append("aspect_ratio", data.aspect_ratio);
      if (data.channel) formData.append("channel", data.channel);
      if (data.model_preference) formData.append("model_preference", data.model_preference);
      if (data.files) {
        data.files.forEach((file) => formData.append("files", file));
      }

      const response = await fetch(`${API_URL}/api/image-generation/generate`, {
        method: "POST",
        headers: {
          ...(userToken && { Authorization: `Bearer ${userToken}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Upload failed");
        throw new Error(errorText);
      }

      return response.json() as Promise<GenerateImageResponse>;
    },
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
    saveCanvasData: (generationId: string, data: SaveCanvasDataRequest) =>
      apiClient<{ message: string; asset_count: number }>(`/api/image-generation/generations/${generationId}/canvas`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
  planMode: {
    chat: async (data: PlanModeChatRequest) => {
      const { getToken } = await auth();
      const token = await getToken();

      const formData = new FormData();
      formData.append('session_id', data.session_id);
      formData.append('message', data.message);

      if (data.files) {
        data.files.forEach((file) => {
          formData.append('files', file);
        });
      }

      const response = await fetch(`${API_URL}/api/plan-mode/chat`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type - browser will set it with boundary
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(error.detail || 'Upload failed');
      }

      return response.json() as Promise<PlanModeChatResponse>;
    },
  },
};