export interface ChannelDetail {
  detail: string;
  filtered_detail: string;
  link: string;
}

export interface PostSuggestion {
  suggestion: string;
  reasoning: string;
}

export interface IndustryUpdate {
  id: string;
  user_id: string;
  run_id: string;
  topic: string;
  description: string;
  channels: {
    [key: string]: ChannelDetail[];
  };
  post_suggestions: PostSuggestion[];
  created_at: string;
  is_active: boolean;
}

export interface Competitor {
  name: string;
  landing_page: string;
}

export interface UserICPConfig {
  user_id?: string;
  ICP: {
    industry?: string;
    target_audience?: string;
    region?: string;
    [key: string]: any;
  };
  persona: {
    youtubers: string[];
  };
  industry: string[];
  competitors: Competitor[];
  channels: string[];
  company_content: {
    recent_blog_titles?: string[];
    keywords?: string[];
    [key: string]: any;
  };
  updated_at?: string;
}

export interface IndustryUpdatesListResponse {
  updates: IndustryUpdate[];
  total: number;
  limit: number;
  offset: number;
}
