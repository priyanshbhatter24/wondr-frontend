export interface ImageGenerationSession {
  session_id: string;
  user_id: string;
  model_preference: "nano-banana";
  created_at: string;
}

export interface ImageGeneration {
  generation_id: string;
  session_id: string;
  user_id: string;
  prompt: string;
  model_used: "nano-banana";
  s3_url: string;
  s3_key: string;
  version_number: number;
  parent_generation_id?: string;
  created_at: string;
}

export interface ChatMessage {
  message_id: string;
  session_id: string;
  role: "user" | "assistant" | "tool_request" | "tool_result";
  content: string;
  generation_id?: string;
  created_at: string;
}

export interface GenerateImageRequest {
  session_id: string;
  prompt: string;
  previous_generation_id?: string;
}

export interface GenerateImageResponse {
  generation_id: string;
  session_id: string;
  s3_url: string;
  version_number: number;
  created_at: string;
}

export interface SidebarGenerationItem {
  session_id: string;
  generation_id: string;
  name: string;  // Truncated prompt (25 chars)
  full_prompt: string;  // Full prompt for tooltip
  created_at: string;
}

export interface UserGenerationsResponse {
  generations: SidebarGenerationItem[];
  total: number;
}
