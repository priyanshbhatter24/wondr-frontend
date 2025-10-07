"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import InsightCard from "@/components/InsightCard";
import InsightModal from "@/components/InsightModal";
import CompetitorCard from "@/components/CompetitorCard";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon } from "@radix-ui/react-icons";

interface InsightData {
  id: string;
  source: string;
  topic: string;
  description: string;
  remixOptions: { text: string }[];
  fullContent: string;
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
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCompetitor, setActiveCompetitor] = useState<CompetitorType>("Meta");

  // Placeholder generations for sidebar - matching wireframe
  const generations = [
    { id: "1", name: "Google pixel 12mp camera", timestamp: "2 hours ago" },
    { id: "2", name: "Deepmind image model ann", timestamp: "3 hours ago" },
    { id: "3", name: "Google maps new navigatio", timestamp: "4 hours ago" },
    { id: "4", name: "Gemini 2.5 pro intro posts", timestamp: "5 hours ago" },
    { id: "5", name: "Google pixel 12mp camera", timestamp: "6 hours ago" },
    { id: "6", name: "Deepmind image model ann", timestamp: "7 hours ago" },
    { id: "7", name: "Google maps new navigatio", timestamp: "8 hours ago" },
    { id: "8", name: "Gemini 2.5 pro intro posts", timestamp: "9 hours ago" },
    { id: "9", name: "Google pixel 12mp camera", timestamp: "10 hours ago" },
    { id: "10", name: "Deepmind image model ann", timestamp: "11 hours ago" },
    { id: "11", name: "Google maps new navigatio", timestamp: "12 hours ago" },
    { id: "12", name: "Gemini 2.5 pro intro posts", timestamp: "13 hours ago" },
    { id: "13", name: "Google pixel 12mp camera", timestamp: "14 hours ago" },
    { id: "14", name: "Deepmind image model ann", timestamp: "15 hours ago" },
    { id: "15", name: "Google maps new navigatio", timestamp: "16 hours ago" },
  ];

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
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
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
          "https://images.unsplash.com/photo-1589177778881-11d88d789b8e?auto=format&fit=crop&w=800&q=80",
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
          "https://images.unsplash.com/photo-1579536564083-09c1f8c8fb35?auto=format&fit=crop&w=800&q=80",
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
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
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

  const industrySliderRef = useRef<HTMLDivElement>(null);
  const competitorSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    competitorSliderRef.current?.scrollTo({
      left: 0,
      behavior: "instant",
    });
  }, [activeCompetitor]);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 420;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#262626]">
      <Sidebar generations={generations} />

      <div className="flex-1 overflow-y-auto">
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
                  className="w-8 h-8 rounded-full bg-transparent hover:bg-[#333333] border border-gray-600 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll(industrySliderRef, "right")}
                  className="w-8 h-8 rounded-full bg-transparent hover:bg-[#333333] border border-gray-600 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div
              ref={industrySliderRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            >
              {industryUpdates.map((insight) => (
                <InsightCard
                  key={insight.id}
                  source={insight.source}
                  topic={insight.topic}
                  description={insight.description}
                  remixOptions={insight.remixOptions}
                  onClick={() => handleCardClick(insight)}
                />
              ))}
            </div>
          </div>

          {/* Competitor Tabs and Insights */}
          <div className="mb-12">
            {/* Competitor Tabs */}
            <div className="flex gap-8 mb-6 border-b border-gray-600">
              {(["Meta", "Alphabet", "Microsoft"] as CompetitorType[]).map((competitor) => (
                <button
                  key={competitor}
                  onClick={() => setActiveCompetitor(competitor)}
                  className={`pb-3 text-lg font-medium transition-colors relative ${
                    activeCompetitor === competitor
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400 hover:text-gray-300"
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
                  className="w-8 h-8 rounded-full bg-transparent hover:bg-[#333333] border border-gray-600 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll(competitorSliderRef, "right")}
                  className="w-8 h-8 rounded-full bg-transparent hover:bg-[#333333] border border-gray-600 flex items-center justify-center text-white transition-colors"
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
          fullContent={selectedInsight.fullContent}
        />
      )}
    </div>
  );
}