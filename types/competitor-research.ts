import { SocialMediaHandles } from "./industry-updates";

/**
 * Competitor Research Data Types
 *
 * Type definitions for the LangGraph-based competitor tracking agent.
 * Updated to match the wondr-comp-agent-lc Lambda response format.
 */

// Engagement metrics for a social media post
export interface PostEngagement {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  retweets: number;
}

// AI-generated analysis for a single post
export interface PostAnalysis {
  messaging: string;
  positioning: string;
  strategy_fit: string;
  engagement_insight: string;
  themes: string[];
}

// Sentiment analysis for posts with comments (Reddit, YouTube)
export interface PostSentiment {
  overall: string;
  praise_points: string[];
  complaints: string[];
  surprising_insights: string[];
  sample_comments: Array<{
    text?: string;
    num_upvotes?: number;
    num_replies?: number;
  }>;
}

// A single competitor post with analysis
export interface CompetitorPost {
  post_id: string;
  post_text: string;
  post_url: string;
  date_posted: string;
  images: string[];
  engagement: PostEngagement;
  analysis: PostAnalysis;
  sentiment?: PostSentiment;
}

// Aggregated data for a single competitor (across all runs)
export interface CompetitorAggregatedData {
  competitor_name: string;
  logo_url?: string;  // New field for logo
  total_posts: number;
  platforms: string[];
  top_themes: string[];
  posts_by_platform: { [platform: string]: CompetitorPost[] };
  latest_run_date: string;
}

// Response from aggregated endpoint GET /api/competitor-research/by-competitor
export interface CompetitorAggregatedResponse {
  competitors: { [name: string]: CompetitorAggregatedData };
  total_competitors: number;
  total_posts: number;
}

// Trigger research response (async - returns job_id)
export interface TriggerResearchResponse {
  status: "started";
  job_id: string;
  message: string;
}

// Research job status (for polling)
export type ResearchJobStatus = "pending" | "running" | "completed" | "failed";

export interface ResearchJob {
  job_id: string;
  user_id: string;
  status: ResearchJobStatus;
  competitors: string[];  // Names of competitors being researched
  progress?: string;      // e.g., "Analyzing HubSpot..."
  error_message?: string;
  started_at: string;
  completed_at?: string;
  results_count: number;  // Number of posts found
}

export interface RemixPromptResponse {
  prompt: string;
}
