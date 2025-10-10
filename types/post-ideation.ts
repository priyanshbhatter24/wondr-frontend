export interface SuggestedTask {
  task_title: string;
  detailed_prompt: string;
}

export interface ImageRecommendation {
  recommendation_number: number;
  explanation: string;
  suggested_task: SuggestedTask;
}

export interface InitialPromptRequest {
  industry_update_id: string;
  post_suggestion_index: number;
}

export interface InitialPromptResponse {
  generated_prompt: string;
  context_preview: string;
}

export interface PostIdeationRequest {
  industry_update_id: string;
  post_suggestion_index: number;
  user_prompt: string;
  conversation_id?: string;  // Optional: for follow-up turns in existing conversation
}

export interface PostIdeationResponse {
  ideation_id: string;
  conversation_id: string;  // NEW: UUID for conversation threading
  user_prompt: string;
  post_suggestion_index: number;
  remix_topic: string;
  reasoning: string;
  context_blurb: string;
  text_recommendation: string;  // Renamed from text_summary
  image_recommendations: ImageRecommendation[];  // Changed from string
}

export interface PostIdeationHistoryItem {
  id: string;
  conversation_id: string;
  user_prompt: string;  // First message in conversation
  post_suggestion_index: number;
  created_at: string;
  turn_count: number;  // Number of turns in this conversation
}
