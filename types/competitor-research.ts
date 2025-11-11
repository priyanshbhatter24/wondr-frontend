/**
 * Competitor Research Data Types
 *
 * Type definitions for competitive intelligence data returned by the
 * Google ADK competitor research agent.
 */

export interface CompetitorProfile {
  name: string;
  website: string;
  about: string;
  value_propositions: string[];
  target_audience_signals: string[];
  product_offerings: string[];
  content_themes: string[];
  social_channels: { [key: string]: string };  // {"LinkedIn": "Active", ...}
}

export interface PostEngagement {
  likes?: number;
  comments?: number;
  shares?: number;      // LinkedIn, Reddit
  retweets?: number;    // Twitter/X
  replies?: number;     // Twitter/X
  views?: number;       // YouTube
  score?: number;       // Reddit
}

export interface SocialPost {
  platform: string;
  post_text: string;
  post_url: string;
  posted_date: string | null;
  engagement: PostEngagement;
  content_type: string;              // "text", "image", "video", "post"
  topics: string[];
}

export interface PostingPatterns {
  /** Average number of posts per week across the platform. */
  average_posts_per_week?: number | null;
  /** Days of the week where posting is most frequent. */
  days_of_week?: string[];
  /** Common time windows for publishing content. */
  times_of_day?: string[];
  /** Additional metadata supplied by the API. */
  [key: string]: number | string | string[] | null | undefined;
}

export interface PlatformAnalysis {
  competitor_name: string;
  platform: string;
  total_posts_analyzed: number;
  recent_posts: SocialPost[];
  posting_frequency: string;         // "3-5x per week", "Low frequency (weekly or less)", etc.
  content_themes: string[];          // Top themes extracted from posts
  content_types_distribution: { [key: string]: number };  // {"text": 5, "image": 2, ...}
  avg_engagement_rate: number | null;
  top_performing_posts: SocialPost[];
  posting_patterns: PostingPatterns;  // Days of week, times of day, avg posts per week
  insights: string[];            // Key insights about this platform
}

export interface CompetitorSocialAnalysis {
  competitor_name: string;
  platforms: { [platform: string]: PlatformAnalysis };  // {"LinkedIn": {...}, "Twitter": {...}, ...}
  total_posts_tracked: number;
  most_active_platform: string;
  most_engaging_platform: string;
  overall_content_themes: string[];
  cross_platform_insights: string[];
}

export interface MessagingAnalysis {
  value_propositions: string[];
  key_messages: string[];
  tone: string;
  positioning_statement: string;
  differentiation_claims: string[];
}

export interface CompetitorResearch {
  id: string;
  user_id: string;
  run_id: string;
  created_at: string;
  is_active: boolean;

  // Main research data
  competitor_profiles: CompetitorProfile[];
  social_post_analysis: { [competitor: string]: CompetitorSocialAnalysis };
  messaging_analysis: { [competitor: string]: MessagingAnalysis };

  // Empty fields (not used by competitor research agent)
  topic?: string;
  description?: string;
  channels?: Record<string, unknown>;
  post_suggestions?: unknown[];
  swot_analysis?: Record<string, unknown>;
  competitor_mentions?: Record<string, unknown>;
  content_strategies?: Record<string, unknown>;
  pricing_analysis?: Record<string, unknown>;
  seo_analysis?: Record<string, unknown>;
  engagement_analysis?: Record<string, unknown>;
  competitive_summary?: string;
}

export interface CompetitorResearchListResponse {
  competitor_research: CompetitorResearch[];
  total: number;
}
