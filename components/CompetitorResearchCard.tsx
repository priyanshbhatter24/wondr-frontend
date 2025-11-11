"use client";

import { formatRelativeTime } from "@/utils/date";
import { CompetitorResearch } from "@/types/competitor-research";

interface CompetitorResearchCardProps {
  research: CompetitorResearch;
  onClick: () => void;
}

export default function CompetitorResearchCard({
  research,
  onClick,
}: CompetitorResearchCardProps) {
  // Extract key metrics for card display
  const competitorCount = research.competitor_profiles.length;
  const totalPosts = Object.values(research.social_post_analysis).reduce(
    (sum, analysis) => sum + analysis.total_posts_tracked,
    0
  );

  // Get top 3 competitors with most activity
  const topCompetitors = research.competitor_profiles
    .slice(0, 3)
    .map((comp) => comp.name);

  // Extract top content themes across all competitors
  const allThemes = new Set<string>();
  Object.values(research.social_post_analysis).forEach((analysis) => {
    analysis.overall_content_themes.slice(0, 2).forEach((theme) => allThemes.add(theme));
  });
  const topThemes = Array.from(allThemes).slice(0, 3);

  return (
    <div
      onClick={onClick}
      className="bg-[#2A2A2A] rounded-lg text-white p-6 min-w-[400px] max-w-[400px] cursor-pointer transition-all duration-200 hover:brightness-110 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold tracking-wider uppercase text-[#C5D86D]">
          COMPETITOR RESEARCH
        </div>
        {research.created_at && (
          <div className="text-xs text-white/60">
            {formatRelativeTime(research.created_at)}
          </div>
        )}
      </div>

      {/* Metrics Summary */}
      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="font-bold text-lg">{competitorCount}</span>
          <span className="text-white/70 ml-1">Competitors</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div>
          <span className="font-bold text-lg">{totalPosts}</span>
          <span className="text-white/70 ml-1">Posts Analyzed</span>
        </div>
      </div>

      {/* Top Competitors */}
      {topCompetitors.length > 0 && (
        <div>
          <div className="text-xs font-semibold tracking-wider uppercase mb-2">
            TOP COMPETITORS
          </div>
          <div className="flex flex-wrap gap-2">
            {topCompetitors.map((name, index) => (
              <div
                key={index}
                className="bg-white/10 rounded px-2.5 py-1 text-xs font-medium"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Content Themes */}
      {topThemes.length > 0 && (
        <div>
          <div className="text-xs font-semibold tracking-wider uppercase mb-2">
            KEY CONTENT THEMES
          </div>
          <div className="space-y-1.5">
            {topThemes.map((theme, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-sm mt-0.5 flex-shrink-0">•</span>
                <span className="text-sm leading-snug">{theme}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
