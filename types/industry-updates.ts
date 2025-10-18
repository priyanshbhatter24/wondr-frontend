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

export interface SocialMediaHandles {
  x?: string; // X (formerly Twitter) URL
  linkedin?: string; // LinkedIn company page URL
  instagram?: string; // Instagram URL
  youtube?: string; // YouTube channel URL
}

export interface Competitor {
  name: string;
  landing_page: string;
  social_media?: SocialMediaHandles;
}

export interface BrandColor {
  hex_code: string; // Format: #RRGGBB
}

export interface BrandAsset {
  asset_id: string;
  s3_url: string;
  s3_key: string;
  label: string; // Max 50 characters
  uploaded_at: string; // ISO date string
}

export interface CompanyDetails {
  industry: string;
  what_company_does: string;
  problem_solved: string;
  use_cases: string[];
  target_customers: string;
  value_proposition: string;
  raw_summary: string;
  last_analyzed: string;
}

export interface UserICPConfig {
  user_id?: string;
  ICP: {
    industry?: string;
    target_audience?: string;
    region?: string;
    [key: string]: string | string[] | undefined;
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
    [key: string]: string | string[] | undefined;
  };
  company_name?: string;
  company_website?: string;
  brand_colors?: BrandColor[];
  company_details?: CompanyDetails;
  company_website_last_crawled?: string;
  updated_at?: string;

  // NEW: Logo and social media
  company_logo_url?: string;
  company_logo_s3_key?: string;
  social_media?: SocialMediaHandles;

  // NEW: Brand assets (max 20)
  brand_assets?: BrandAsset[];
}

export interface UpdateIcpResponse extends UserICPConfig {
  company_analysis_triggered?: boolean;
  company_analysis_success?: boolean;
}

export interface IndustryUpdatesListResponse {
  updates: IndustryUpdate[];
  total: number;
  limit: number;
  offset: number;
}
