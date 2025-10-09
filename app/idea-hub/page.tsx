"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import InsightCard from "@/components/InsightCard";
import InsightModal from "@/components/InsightModal";
import CompetitorCard from "@/components/CompetitorCard";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon } from "@radix-ui/react-icons";
import { useApiClient } from "@/lib/api-client";
import { ChannelDetail, IndustryUpdate } from "@/types/industry-updates";
import { getChannelSourcesLabel } from "@/utils/date";
import { useGenerations } from "@/lib/use-generations";

interface InsightData {
  id: string;
  source: string;
  topic: string;
  description: string;
  remixOptions: { text: string; reasoning?: string }[];
  fullContent?: string;
  channels?: Record<string, ChannelDetail[]>;
  created_at?: string;
}

type CompetitorType = "Meta" | "Alphabet" | "Microsoft";

interface CompetitorInsightData extends InsightData {
  heroImageUrl: string;
  heroImageAlt: string;
  heroImageSourceUrl: string;
  metrics: {
    views: number;
    likes: number;
    shares: number;
  };
  ctaLabel: string;
  ctaHref: string;
}

export default function IdeaHubPage() {
  const router = useRouter();
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCompetitor, setActiveCompetitor] = useState<CompetitorType>("Meta");

  // API state for industry updates
  const [industryUpdatesFromAPI, setIndustryUpdatesFromAPI] = useState<IndustryUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get API client
  const api = useApiClient();

  // Fetch generations for sidebar
  const { generations } = useGenerations();

  // Handle sidebar generation click
  const handleGenerationClick = (sessionId: string) => {
    router.push(`/generate-post?session=${sessionId}`);
  };

  // Fetch industry updates on mount
  useEffect(() => {
    async function fetchUpdates() {
      try {
        const data = await api.industryUpdates.list({ limit: 20 });
        setIndustryUpdatesFromAPI(data.updates);
      } catch (error) {
        console.error("Failed to fetch industry updates:", error);
        setError("Failed to load industry updates");
      } finally {
        setLoading(false);
      }
    }
    fetchUpdates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Industry Updates data
  const industryUpdates: InsightData[] = [
    {
      id: "industry-1",
      source: "VERGE",
      topic: "Meta Ray Ban glasses fail live demo.",
      description:
        "During the live demo from mark zuckerberg, there was an error states, and onboarding flows. There is a need to further refine the framework and add more accessibility.",
      remixOptions: [
        { text: "Google believes that there is an infrastructure shortage" },
        { text: "Tease the competitor that we are building" },
        { text: "Google integration with meta glasses" },
        { text: "Need for smaller form factor to enable tech" },
      ],
      fullContent: "During Mark Zuckerberg's live demonstration of the Meta Ray-Ban smart glasses, a critical error occurred that highlighted the ongoing challenges in AR/VR technology...",
    },
    {
      id: "industry-2",
      source: "VERGE",
      topic: "Meta Ray Ban glasses fail live demo.",
      description:
        "During the live demo from mark zuckerberg, there was an error states, and onboarding flows. There is a need to further refine the framework and add more accessibility.",
      remixOptions: [
        { text: "Google believes that there is an infrastructure shortage" },
        { text: "Tease the competitor that we are building" },
        { text: "Google integration with meta glasses" },
        { text: "Need for smaller form factor to enable tech" },
      ],
      fullContent: "Another detailed analysis of the Meta Ray-Ban glasses demo failure...",
    },
    {
      id: "industry-3",
      source: "VERGE",
      topic: "Meta Ray Ban glasses fail live demo.",
      description:
        "During the live demo from mark zuckerberg, there was an error states, and onboarding flows. There is a need to further refine the framework and add more accessibility.",
      remixOptions: [
        { text: "Google believes that there is an infrastructure shortage" },
        { text: "Tease the competitor that we are building" },
        { text: "Google integration with meta glasses" },
        { text: "Need for smaller form factor to enable tech" },
      ],
      fullContent: "Third perspective on the Meta Ray-Ban glasses demonstration issues...",
    },
  ];

  // Competitor Insights data
  const competitorInsights: Record<CompetitorType, CompetitorInsightData[]> = {
    Meta: [
      {
        id: "meta-1",
        source: "VERGE",
        topic: "Meta Ray Ban glasses fail live demo.",
        description:
          "During the live demo from mark zuckerberg, there was an error states, and onboarding flows. There is a need to further refine the framework and add more accessibility.",
        remixOptions: [
          { text: "Google believes that there is an infrastructure shortage" },
          { text: "Tease the competitor that we are building" },
          { text: "Google integration with meta glasses" },
          { text: "Need for smaller form factor to enable tech" },
        ],
        fullContent: "Meta's strategic analysis...",
        heroImageUrl:
          "https://cdn.mos.cms.futurecdn.net/uBLE9FqeNG6j3kX2DowuXD.jpg",
        heroImageAlt: "Person holding modern wearable earbuds",
        heroImageSourceUrl: "https://unsplash.com/photos/a-person-holding-a-pair-of-earbuds-0y8Hq15SCBM",
        metrics: {
          views: 27864,
          likes: 3245,
          shares: 271,
        },
        ctaLabel: "Try with 100-day free returns",
        ctaHref: "https://www.verge.com/articles/meta-rayban-demo",
      },
      {
        id: "meta-2",
        source: "VERGE",
        topic: "Meta Ray Ban glasses fail live demo.",
        description:
          "During the live demo from mark zuckerberg, there was an error states, and onboarding flows. There is a need to further refine the framework and add more accessibility.",
        remixOptions: [
          { text: "Google believes that there is an infrastructure shortage" },
          { text: "Tease the competitor that we are building" },
          { text: "Google integration with meta glasses" },
          { text: "Need for smaller form factor to enable tech" },
        ],
        fullContent: "Additional Meta insights...",
        heroImageUrl:
          "https://cdn.mos.cms.futurecdn.net/uBLE9FqeNG6j3kX2DowuXD.jpg",
        heroImageAlt: "Augmented reality glasses on display",
        heroImageSourceUrl: "https://unsplash.com/photos/a-close-up-of-a-pair-of-glasses-on-a-table-g6fNRoe8t44",
        metrics: {
          views: 21950,
          likes: 1984,
          shares: 184,
        },
        ctaLabel: "View competitive teardown",
        ctaHref: "https://www.verge.com/articles/meta-rayban-analysis",
      },
    ],
    Alphabet: [
      {
        id: "alphabet-1",
        source: "VERGE",
        topic: "Meta Ray Ban glasses fail live demo.",
        description:
          "During the live demo from mark zuckerberg, there was an error states, and onboarding flows. There is a need to further refine the framework and add more accessibility.",
        remixOptions: [
          { text: "Google believes that there is an infrastructure shortage" },
          { text: "Tease the competitor that we are building" },
          { text: "Google integration with meta glasses" },
          { text: "Need for smaller form factor to enable tech" },
        ],
        fullContent: "Alphabet insights...",
        heroImageUrl:
          "https://cdn.mos.cms.futurecdn.net/uBLE9FqeNG6j3kX2DowuXD.jpg",
        heroImageAlt: "Person testing futuristic wearable display",
        heroImageSourceUrl: "https://unsplash.com/photos/person-wearing-augmented-reality-glasses-pOUA8Xay514",
        metrics: {
          views: 18742,
          likes: 1644,
          shares: 132,
        },
        ctaLabel: "Read the full report",
        ctaHref: "https://www.verge.com/articles/alphabet-ar-roadmap",
      },
    ],
    Microsoft: [
      {
        id: "microsoft-1",
        source: "VERGE",
        topic: "Meta Ray Ban glasses fail live demo.",
        description:
          "During the live demo from mark zuckerberg, there was an error states, and onboarding flows. There is a need to further refine the framework and add more accessibility.",
        remixOptions: [
          { text: "Google believes that there is an infrastructure shortage" },
          { text: "Tease the competitor that we are building" },
          { text: "Google integration with meta glasses" },
          { text: "Need for smaller form factor to enable tech" },
        ],
        fullContent: "Microsoft analysis...",
        heroImageUrl:
          "https://cdn.mos.cms.futurecdn.net/uBLE9FqeNG6j3kX2DowuXD.jpg",
        heroImageAlt: "Smart speaker with ambient lighting",
        heroImageSourceUrl: "https://unsplash.com/photos/gray-and-black-echo-dot-2nd-generation-AHVqE7MjIzk",
        metrics: {
          views: 20431,
          likes: 1762,
          shares: 165,
        },
        ctaLabel: "Explore partnership pitch",
        ctaHref: "https://www.verge.com/articles/microsoft-mesh-launch",
      },
    ],
  };

  const handleCardClick = (insight: InsightData) => {
    setSelectedInsight(insight);
    setIsModalOpen(true);
  };

  const industrySliderRef = useRef<HTMLDivElement | null>(null);
  const competitorSliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    competitorSliderRef.current?.scrollTo({
      left: 0,
      behavior: "instant",
    });
  }, [activeCompetitor]);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 420;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <AppShell
      generations={generations}
      onGenerationClick={handleGenerationClick}
    >
      <div className="flex-1 overflow-y-auto bg-[color:var(--color-gray-dark)]">
        <div className="p-8">
          {/* Header */}
          <div className="mb-10 flex items-center gap-3">
            <FileIcon className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-semibold text-white">Idea Hub</h1>
          </div>

          {/* Industry Updates Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-white">Industry Updates</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll(industrySliderRef, "left")}
                  className="w-8 h-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center text-white transition-colors hover:bg-black/40"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll(industrySliderRef, "right")}
                  className="w-8 h-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center text-white transition-colors hover:bg-black/40"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div
                ref={industrySliderRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white/5 animate-pulse min-w-[400px] h-[300px] rounded"
                  />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12 text-red-400">
                <p>{error}</p>
              </div>
            )}

            {/* Data or Empty State */}
            {!loading && !error && (
              <div
                ref={industrySliderRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              >
                {industryUpdatesFromAPI.length > 0 ? (
                  // Real API data
                  industryUpdatesFromAPI.map((update) => {
                    const insightData: InsightData = {
                      id: update.id,
                      source: getChannelSourcesLabel(update.channels),
                      topic: update.topic,
                      description: update.description,
                      remixOptions: update.post_suggestions.map((s) => ({
                        text: s.suggestion,
                        reasoning: s.reasoning,
                      })),
                      channels: update.channels,
                      created_at: update.created_at,
                    };
                    return (
                      <InsightCard
                        key={update.id}
                        id={update.id}
                        source={insightData.source}
                        topic={update.topic}
                        description={update.description}
                        remixOptions={insightData.remixOptions}
                        createdAt={update.created_at}
                        onClick={() => handleCardClick(insightData)}
                      />
                    );
                  })
                ) : (
                  // Fallback to mock data if no API data
                  industryUpdates.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      id={insight.id}
                      source={insight.source}
                      topic={insight.topic}
                      description={insight.description}
                      remixOptions={insight.remixOptions}
                      onClick={() => handleCardClick(insight)}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Competitor Tabs and Insights */}
          <div className="mb-12">
            {/* Competitor Tabs */}
            <div className="flex gap-8 mb-6 border-b border-white/20">
              {(["Meta", "Alphabet", "Microsoft"] as CompetitorType[]).map((competitor) => (
                <button
                  key={competitor}
                  onClick={() => setActiveCompetitor(competitor)}
                  className={`pb-3 text-lg font-medium transition-colors relative ${
                    activeCompetitor === competitor
                      ? "text-white border-b-2 border-white"
                      : "text-white/70 hover:text-white/80"
                  }`}
                >
                  {competitor}
                </button>
              ))}
            </div>

            {/* Active Competitor Carousel */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1" />
              <div className="flex gap-2">
                <button
                  onClick={() => scroll(competitorSliderRef, "left")}
                  className="w-8 h-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center text-white transition-colors hover:bg-black/40"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll(competitorSliderRef, "right")}
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
              {competitorInsights[activeCompetitor].map((insight) => (
                <CompetitorCard
                  key={insight.id}
                  source={insight.source}
                  topic={insight.topic}
                  description={insight.description}
                  remixOptions={insight.remixOptions}
                  heroImageUrl={insight.heroImageUrl}
                  heroImageAlt={insight.heroImageAlt}
                  heroImageSourceUrl={insight.heroImageSourceUrl}
                  metrics={insight.metrics}
                  ctaLabel={insight.ctaLabel}
                  ctaHref={insight.ctaHref}
                  onClick={() => handleCardClick(insight)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {selectedInsight && (
          <InsightModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            source={selectedInsight.source}
            topic={selectedInsight.topic}
            description={selectedInsight.description}
            remixOptions={selectedInsight.remixOptions}
            channels={selectedInsight.channels}
            fullContent={selectedInsight.fullContent}
            industryUpdateId={selectedInsight.id}
          />
        )}
      </div>
    </AppShell>
  );
}