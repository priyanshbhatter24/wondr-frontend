"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  ArchiveIcon,
  BarChartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  CubeIcon,
  FaceIcon,
  FileTextIcon,
  GroupIcon,
  LayersIcon,
  LightningBoltIcon,
  StarIcon,
  TargetIcon,
} from "@radix-ui/react-icons";
import { IdeaIcon } from "@/components/icons/IdeaIcon";
import { cn } from "@/lib/utils";

// Using a type for list items for better maintainability and type safety
type FeatureItem = {
  icon: React.ElementType;
  text: string;
};

const ResearchFeatures: FeatureItem[] = [
  { icon: BarChartIcon, text: "Hourly scans of Reddit, LinkedIn, X, and YouTube" },
  { icon: TargetIcon, text: "ICP-based filtering for relevant insights" },
  { icon: IdeaIcon, text: "AI-generated topics with real citations" },
  { icon: LightningBoltIcon, text: "Automated competitor analysis" },
];

const ContentFeatures: FeatureItem[] = [
  { icon: FileTextIcon, text: "AI-powered post suggestions with reasoning" },
  { icon: LayersIcon, text: "Multi-channel content (LinkedIn, X, Instagram)" },
  { icon: StarIcon, text: "Brand voice integration with company context" },
  { icon: CopyIcon, text: "One-click image generation with Fal.ai" },
];

const CampaignFeatures: FeatureItem[] = [
  { icon: GroupIcon, text: "Define personas and pain points" },
  { icon: ArchiveIcon, text: "Track competitors and messaging gaps" },
  { icon: CubeIcon, text: "Custom scheduling with timezone support" },
  { icon: FaceIcon, text: "Usage analytics and monthly limits" },
];

const FeatureList = ({ features }: { features: FeatureItem[] }) => (
  <ul className="mt-6 space-y-4">
    {features.map((feature, index) => (
      <li key={index} className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white/5">
          <feature.icon className="h-5 w-5 text-text-secondary" />
        </div>
        <span className="text-base text-text-secondary">{feature.text}</span>
      </li>
    ))}
  </ul>
);

const CreatorTabs = () => {
  const [activeTab, setActiveTab] = useState<"Research" | "Content" | "Campaigns">("Research");
  const tabs: Array<"Research" | "Content" | "Campaigns"> = ["Research", "Content", "Campaigns"];

  const handlePrevious = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const previousIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setActiveTab(tabs[previousIndex]);
  };

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    setActiveTab(tabs[nextIndex]);
  };

  const WondrConfigCard = () => (
    <div className="bg-card p-8">
      <h3 className="font-display text-2xl font-medium text-text-primary">Your ICP Configuration</h3>
      <div className="mt-8 space-y-6">
        <div className="bg-white/5 p-4 rounded border border-white/10">
          <label className="text-xs font-medium text-text-secondary">Industry</label>
          <p className="mt-2 text-base text-text-primary">Healthcare SaaS</p>
        </div>

        <div className="bg-white/5 p-4 rounded border border-white/10">
          <label className="text-xs font-medium text-text-secondary">Pain Points</label>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="bg-white/10 px-3 py-1 text-sm text-white rounded-full">Compliance</span>
            <span className="bg-white/10 px-3 py-1 text-sm text-white rounded-full">Security</span>
            <span className="bg-white/10 px-3 py-1 text-sm text-white rounded-full">Integration</span>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded border border-white/10">
          <label className="text-xs font-medium text-text-secondary">Channels</label>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="bg-white/10 px-3 py-1 text-sm text-white rounded-full">Reddit</span>
            <span className="bg-white/10 px-3 py-1 text-sm text-white rounded-full">LinkedIn</span>
            <span className="bg-white/10 px-3 py-1 text-sm text-white rounded-full">X</span>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded border border-white/10">
          <label className="text-xs font-medium text-text-secondary">Competitors Tracked</label>
          <p className="mt-2 text-base text-text-primary">3 companies</p>
        </div>
      </div>
    </div>
  );

  const renderCards = () => {
    if (activeTab === "Research") {
      return [
        <div key="research" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Industry Insights
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Stay ahead with automated market research.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            Our research agent scans multiple platforms hourly, delivering trending topics and competitor insights directly to your Idea Hub.
          </p>
          <FeatureList features={ResearchFeatures} />
        </div>,
        <WondrConfigCard key="wondr" />,
        <div key="content" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Content Creation
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Generate posts that match your brand voice.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            AI-powered suggestions with reasoning and citations. Create social media content that resonates with your ICP.
          </p>
          <FeatureList features={ContentFeatures} />
        </div>
      ];
    } else if (activeTab === "Content") {
      return [
        <div key="content" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Content Creation
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Generate posts that match your brand voice.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            AI-powered suggestions with reasoning and citations. Create social media content that resonates with your ICP.
          </p>
          <FeatureList features={ContentFeatures} />
        </div>,
        <WondrConfigCard key="wondr" />,
        <div key="campaigns" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Campaign Management
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Orchestrate campaigns with intelligent targeting.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            Define your ICP, track competitors, and manage content schedules. Wondr keeps your marketing operations running smoothly.
          </p>
          <FeatureList features={CampaignFeatures} />
        </div>
      ];
    } else {
      return [
        <div key="campaigns" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Campaign Management
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Orchestrate campaigns with intelligent targeting.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            Define your ICP, track competitors, and manage content schedules. Wondr keeps your marketing operations running smoothly.
          </p>
          <FeatureList features={CampaignFeatures} />
        </div>,
        <WondrConfigCard key="wondr" />,
        <div key="research" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Industry Insights
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Stay ahead with automated market research.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            Our research agent scans multiple platforms hourly, delivering trending topics and competitor insights directly to your Idea Hub.
          </p>
          <FeatureList features={ResearchFeatures} />
        </div>
      ];
    }
  };

  const cards = renderCards();

  return (
    <section className="w-full bg-background-primary py-24 sm:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="mb-4 flex">
              <p className="bg-secondary px-4 py-1.5 text-sm font-medium text-foreground">
                PLATFORM
              </p>
            </div>
            <h2 className="font-display text-4xl font-semibold leading-tight text-text-primary md:text-5xl">
              Built for modern marketing teams
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              From industry research to content creation, Wondr automates your entire marketing workflow with AI.
            </p>
          </div>
          <Link
            href="/sign-in"
            className="flex-shrink-0 bg-secondary px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-white/20"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between border-b border-border-subtle">
            <div className="flex items-center gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "py-4 text-base font-medium transition-colors",
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-text-tertiary hover:text-text-secondary"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                className="flex h-10 w-10 items-center justify-center bg-secondary text-foreground transition-colors hover:bg-white/20"
                aria-label="Previous tab"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center bg-secondary text-foreground transition-colors hover:bg-white/20"
                aria-label="Next tab"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex">
          <div className="flex-1">{cards[0]}</div>
          <div className="flex-1">{cards[1]}</div>
          <div className="flex-1 ml-6">{cards[2]}</div>
        </div>
      </div>
    </section>
  );
};

export default CreatorTabs;
