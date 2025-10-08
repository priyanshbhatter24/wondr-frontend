export interface SuggestedTask {
  task_title: string;
  detailed_prompt: string;
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
}

export interface PostIdeationResponse {
  remix_topic: string;
  reasoning: string;
  context_blurb: string;
  text_summary: string;
  image_recommendations: string;
  suggested_tasks: SuggestedTask[];
}
