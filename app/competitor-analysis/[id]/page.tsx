"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import AppShell from "@/components/AppShell";
import { useApiClient } from "@/lib/api-client";
import { useGenerations } from "@/lib/use-generations";
import { CompetitorResearch } from "@/types/competitor-research";
import { formatRelativeTime } from "@/utils/date";

// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  const name = platform.toLowerCase();

  if (name === "linkedin") return <span className="text-lg">💼</span>;
  if (name === "twitter" || name === "x") return <span className="text-lg">🐦</span>;
  if (name === "youtube") return <span className="text-lg">📹</span>;
  if (name === "reddit") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF4500">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    );
  }
  return <span className="text-lg">🌐</span>;
};

export default function CompetitorAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [research, setResearch] = useState<CompetitorResearch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompetitorIndex, setSelectedCompetitorIndex] = useState(0);

  // Carousel ref for competitor tabs
  const competitorSliderRef = useRef<HTMLDivElement>(null);

  // Get API client
  const api = useApiClient();

  // Fetch sessions for sidebar
  const { sessions } = useGenerations();

  // Handle sidebar session click
  const handleSessionClick = (sessionId: string) => {
    router.push(`/generate-post?session=${sessionId}`);
  };

  // Scroll function for carousel
  const scrollCompetitors = (direction: "left" | "right") => {
    if (competitorSliderRef.current) {
      const scrollAmount = 400;
      competitorSliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Fetch competitor research by ID
  useEffect(() => {
    async function fetchResearch() {
      try {
        const data = await api.competitorResearch.get(id);
        setResearch(data);
      } catch (error) {
        console.error("Failed to fetch competitor research:", error);
        setError("Failed to load competitor research data");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchResearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <AppShell sessions={sessions} onSessionClick={handleSessionClick}>
        <div className="flex-1 flex items-center justify-center bg-[#3A3A3A]">
          <div className="text-white">Loading competitor research...</div>
        </div>
      </AppShell>
    );
  }

  if (error || !research) {
    return (
      <AppShell sessions={sessions} onSessionClick={handleSessionClick}>
        <div className="flex-1 flex items-center justify-center bg-[#3A3A3A]">
          <div className="text-red-400">{error || "Competitor research not found"}</div>
        </div>
      </AppShell>
    );
  }

  const selectedCompetitor = research.competitor_profiles[selectedCompetitorIndex];
  const selectedSocialAnalysis = research.social_post_analysis[selectedCompetitor.name];
  const selectedMessagingAnalysis = research.messaging_analysis[selectedCompetitor.name];

  return (
    <AppShell sessions={sessions} onSessionClick={handleSessionClick}>
      <div className="flex-1 overflow-y-auto bg-[#3A3A3A]">
        <div className="p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Idea Hub</span>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-white mb-2">
                  Competitor Analysis
                </h1>
                {research.created_at && (
                  <p className="text-white/60 text-sm">
                    Generated {formatRelativeTime(research.created_at)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <div>
                  <span className="font-bold text-lg text-white">{research.competitor_profiles.length}</span>
                  <span className="ml-1">Competitors</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <div>
                  <span className="font-bold text-lg text-white">
                    {Object.values(research.social_post_analysis).reduce(
                      (sum, analysis) => sum + analysis.total_posts_tracked,
                      0
                    )}
                  </span>
                  <span className="ml-1">Posts Analyzed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Competitor Tabs */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-white">Select Competitor</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollCompetitors("left")}
                  className="w-8 h-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center text-white transition-colors hover:bg-black/40"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCompetitors("right")}
                  className="w-8 h-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center text-white transition-colors hover:bg-black/40"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={competitorSliderRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            >
              {research.competitor_profiles.map((competitor, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCompetitorIndex(index)}
                  className={`min-w-[280px] p-4 rounded-lg transition-all ${
                    selectedCompetitorIndex === index
                      ? "bg-[#C5D86D] text-black"
                      : "bg-[#2A2A2A] text-white hover:brightness-110"
                  }`}
                >
                  <div className="font-bold text-lg mb-1">{competitor.name}</div>
                  <div className="text-sm opacity-80 truncate">{competitor.website}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Competitor Profile */}
          <div className="bg-[#2A2A2A] rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Company Profile</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-white/70 mb-2">ABOUT</div>
                <p className="text-white leading-relaxed">{selectedCompetitor.about}</p>
              </div>

              <div>
                <div className="text-sm font-semibold text-white/70 mb-2">VALUE PROPOSITIONS</div>
                <ul className="space-y-2">
                  {selectedCompetitor.value_propositions.map((vp, index) => (
                    <li key={index} className="flex items-start gap-2 text-white">
                      <span className="mt-1 flex-shrink-0">•</span>
                      <span>{vp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-sm font-semibold text-white/70 mb-2">TARGET AUDIENCE SIGNALS</div>
                <div className="flex flex-wrap gap-2">
                  {selectedCompetitor.target_audience_signals.map((signal, index) => (
                    <div key={index} className="bg-white/10 rounded px-3 py-1.5 text-sm text-white">
                      {signal}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-white/70 mb-2">PRODUCT OFFERINGS</div>
                <div className="flex flex-wrap gap-2">
                  {selectedCompetitor.product_offerings.map((product, index) => (
                    <div key={index} className="bg-white/10 rounded px-3 py-1.5 text-sm text-white">
                      {product}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-white/70 mb-2">CONTENT THEMES</div>
                <div className="flex flex-wrap gap-2">
                  {selectedCompetitor.content_themes.map((theme, index) => (
                    <div key={index} className="bg-[#C5D86D]/20 text-[#C5D86D] rounded px-3 py-1.5 text-sm font-medium">
                      {theme}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-white/70 mb-2">SOCIAL CHANNELS</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedCompetitor.social_channels).map(([channel, status], index) => (
                    <div key={index} className="bg-white/10 rounded px-3 py-1.5 text-sm text-white">
                      {channel}: <span className="text-[#C5D86D]">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Analysis */}
          {selectedSocialAnalysis && (
            <div className="bg-[#2A2A2A] rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Social Media Analysis</h3>

              {/* Overall Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/70 mb-1">Total Posts Tracked</div>
                  <div className="text-2xl font-bold text-white">{selectedSocialAnalysis.total_posts_tracked}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/70 mb-1">Most Active Platform</div>
                  <div className="text-2xl font-bold text-[#C5D86D]">{selectedSocialAnalysis.most_active_platform}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white/70 mb-1">Most Engaging Platform</div>
                  <div className="text-2xl font-bold text-[#C5D86D]">{selectedSocialAnalysis.most_engaging_platform}</div>
                </div>
              </div>

              {/* Overall Content Themes */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-white/70 mb-2">OVERALL CONTENT THEMES</div>
                <div className="flex flex-wrap gap-2">
                  {selectedSocialAnalysis.overall_content_themes.map((theme, index) => (
                    <div key={index} className="bg-[#C5D86D]/20 text-[#C5D86D] rounded px-3 py-1.5 text-sm font-medium">
                      {theme}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Platform Insights */}
              <div>
                <div className="text-sm font-semibold text-white/70 mb-2">CROSS-PLATFORM INSIGHTS</div>
                <ul className="space-y-2">
                  {selectedSocialAnalysis.cross_platform_insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-white">
                      <span className="mt-1 flex-shrink-0">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Messaging Analysis */}
          {selectedMessagingAnalysis && (
            <div className="bg-[#2A2A2A] rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Messaging & Positioning</h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-white/70 mb-2">TONE</div>
                  <p className="text-white">{selectedMessagingAnalysis.tone}</p>
                </div>

                <div>
                  <div className="text-sm font-semibold text-white/70 mb-2">POSITIONING STATEMENT</div>
                  <p className="text-white leading-relaxed">{selectedMessagingAnalysis.positioning_statement}</p>
                </div>

                <div>
                  <div className="text-sm font-semibold text-white/70 mb-2">KEY MESSAGES</div>
                  <ul className="space-y-2">
                    {selectedMessagingAnalysis.key_messages.map((message, index) => (
                      <li key={index} className="flex items-start gap-2 text-white">
                        <span className="mt-1 flex-shrink-0">•</span>
                        <span>{message}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-white/70 mb-2">VALUE PROPOSITIONS</div>
                  <ul className="space-y-2">
                    {selectedMessagingAnalysis.value_propositions.map((vp, index) => (
                      <li key={index} className="flex items-start gap-2 text-white">
                        <span className="mt-1 flex-shrink-0">•</span>
                        <span>{vp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-white/70 mb-2">DIFFERENTIATION CLAIMS</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMessagingAnalysis.differentiation_claims.map((claim, index) => (
                      <div key={index} className="bg-[#C5D86D]/20 text-[#C5D86D] rounded px-3 py-1.5 text-sm font-medium">
                        {claim}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Platform-Specific Analysis */}
          {selectedSocialAnalysis && Object.keys(selectedSocialAnalysis.platforms).length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Platform-Specific Analysis</h3>
              {Object.entries(selectedSocialAnalysis.platforms).map(([platformName, platformData]) => (
                <div key={platformName} className="bg-[#2A2A2A] rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {getPlatformIcon(platformName)}
                    <h4 className="text-lg font-semibold text-white">{platformName}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/70 mb-1">Posts Analyzed</div>
                      <div className="text-xl font-bold text-white">{platformData.total_posts_analyzed}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/70 mb-1">Posting Frequency</div>
                      <div className="text-xl font-bold text-white">{platformData.posting_frequency}</div>
                    </div>
                  </div>

                  {platformData.insights && platformData.insights.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-white/70 mb-2">KEY INSIGHTS</div>
                      <ul className="space-y-2">
                        {platformData.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-white">
                            <span className="mt-1 flex-shrink-0">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
