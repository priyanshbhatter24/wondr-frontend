"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import InsightCard from "@/components/InsightCard";
import CompetitorInsightsSection from "@/components/CompetitorInsightsSection";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon } from "@radix-ui/react-icons";
import { useApiClient } from "@/lib/api-client";
import { IndustryUpdate } from "@/types/industry-updates";
import { getChannelSourcesLabel } from "@/utils/date";
import { useGenerations } from "@/lib/use-generations";

interface InsightData {
  id: string;
  source: string;
  topic: string;
  description: string;
  remixOptions: { text: string; reasoning?: string }[];
}

export default function IdeaHubPage() {
  const router = useRouter();

  // API state for industry updates
  const [industryUpdatesFromAPI, setIndustryUpdatesFromAPI] = useState<IndustryUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [researching, setResearching] = useState(false);

  // Get API client
  const api = useApiClient();

  // Fetch sessions for sidebar
  const { sessions } = useGenerations();

  // Handle sidebar session click
  const handleSessionClick = (sessionId: string) => {
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

  // Handle manual research trigger
  const handleResearch = async () => {
    setResearching(true);
    setError(null);

    try {
      await api.industryUpdates.triggerResearch();

      // Refresh the list after research completes
      const data = await api.industryUpdates.list({ limit: 20 });
      setIndustryUpdatesFromAPI(data.updates);

      alert("Research completed! New topic added.");
    } catch (error) {
      console.error("Research failed:", error);
      setError("Research failed. Please try again.");
    } finally {
      setResearching(false);
    }
  };

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
    },
  ];



  const handleCardClick = (insightId: string) => {
    router.push(`/market-trend/${insightId}`);
  };

  const industrySliderRef = useRef<HTMLDivElement | null>(null);

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
      sessions={sessions}
      onSessionClick={handleSessionClick}
    >
      <div className="flex-1 overflow-y-auto bg-[#3A3A3A]">
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
              <div className="flex gap-4">
                <button
                  onClick={handleResearch}
                  disabled={researching}
                  className="px-4 py-1 rounded-md bg-transparent border border-white/20 text-white/90 font-medium text-sm transition-all hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {researching ? "Researching..." : "Research"}
                </button>
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
                        onClick={() => handleCardClick(update.id)}
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
                      onClick={() => handleCardClick(insight.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Competitor Insights Section */}
          <CompetitorInsightsSection />
        </div>
      </div>
    </AppShell>
  );
}