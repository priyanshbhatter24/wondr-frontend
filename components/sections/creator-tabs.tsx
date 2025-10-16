"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Shapes,
  Archive,
  Copy,
  Smile,
  Star,
  Layers,
  Lightbulb,
  Moon,
  Sun,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Using a type for list items for better maintainability and type safety
type FeatureItem = {
  icon: React.ElementType;
  text: string;
};

const DesignerFeatures: FeatureItem[] = [
  { icon: FileText, text: "Instantly optimize short UI copy" },
  { icon: Shapes, text: "Tone control for different use cases" },
  { icon: Archive, text: "Save to collections for future prompts" },
  { icon: Copy, text: "Reuse copy across multiple projects" },
];

const WriterFeatures: FeatureItem[] = [
  { icon: Smile, text: "Refine tone and structure" },
  { icon: Star, text: "Save and tag favorite prompts" },
  { icon: Layers, text: "Access writing-focused templates" },
  { icon: Lightbulb, text: "Generate multiple takes with 1 click" },
];

const MarketerFeatures: FeatureItem[] = [
  { icon: Target, text: "Create campaign copy that converts" },
  { icon: TrendingUp, text: "A/B test different messaging angles" },
  { icon: Users, text: "Tailor voice for target audiences" },
  { icon: Zap, text: "Speed up ad and email workflows" },
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
  const [activeTab, setActiveTab] = useState<"Designers" | "Writers" | "Marketers">("Designers");
  const tabs: Array<"Designers" | "Writers" | "Marketers"> = ["Designers", "Writers", "Marketers"];

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

  const WondrAICard = () => (
    <div className="bg-card p-8">
      <h3 className="font-display text-2xl font-medium text-text-primary">Created with Wondr AI</h3>
      <div className="mt-8 space-y-8">
        <div>
          <label className="text-sm font-medium text-text-secondary">Base text size</label>
          <div className="relative mt-4">
            <div className="h-1 w-full bg-white/10">
              <div
                className="absolute top-1/2 h-1 w-1/2 -translate-y-1/2 bg-white"
                style={{ left: "25%" }}
              ></div>
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: "50%" }}>
                 <div className="h-4 w-4 border-2 border-black bg-white ring-2 ring-white"></div>
              </div>
            </div>
            <div className="mt-3 flex justify-between text-sm text-text-tertiary">
              <span>12</span>
              <span>14</span>
              <span className="text-text-primary">16</span>
              <span>18</span>
              <span>20</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-text-secondary">Theme</label>
          <div className="mt-3 flex bg-secondary p-1">
            <button className="flex flex-1 items-center justify-center gap-2 p-2 text-sm text-text-secondary">
              <Moon className="h-4 w-4" />
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 p-2 text-sm text-text-secondary">
              <Sun className="h-4 w-4" />
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 bg-muted p-2 text-sm font-medium text-text-primary">
              Auto
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-text-secondary">Style</label>
          <div className="mt-3 flex items-center justify-between">
            <ChevronLeft className="h-5 w-5 text-text-tertiary" />
            <div className="flex items-center gap-4 text-sm">
              <span className="text-text-tertiary">Split color</span>
              <span className="font-medium text-text-primary">Monochromatic</span>
              <span className="text-text-tertiary">Complimen...</span>
            </div>
            <ChevronRight className="h-5 w-5 text-text-tertiary" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCards = () => {
    if (activeTab === "Designers") {
      return [
        <div key="designers" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Badge
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Craft microcopy and UX text effortlessly.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            Get clear, on-brand suggestions for buttons, error states, and onboarding flows — in
            seconds.
          </p>
          <FeatureList features={DesignerFeatures} />
        </div>,
        <WondrAICard key="wondr" />,
        <div key="writers" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Badge
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Write smarter intros, titles, and more.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            From blog hooks to tweet threads, Wondr helps you ideate and polish in your own voice.
          </p>
          <FeatureList features={WriterFeatures} />
        </div>
      ];
    } else if (activeTab === "Writers") {
      return [
        <div key="writers" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Badge
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Write smarter intros, titles, and more.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            From blog hooks to tweet threads, Wondr helps you ideate and polish in your own voice.
          </p>
          <FeatureList features={WriterFeatures} />
        </div>,
        <WondrAICard key="wondr" />,
        <div key="marketers" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Badge
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Drive campaigns with clear, persuasive copy.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            Generate high-converting headlines, CTAs, and social posts that resonate with your audience.
          </p>
          <FeatureList features={MarketerFeatures} />
        </div>
      ];
    } else {
      return [
        <div key="marketers" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Badge
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Drive campaigns with clear, persuasive copy.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            Generate high-converting headlines, CTAs, and social posts that resonate with your audience.
          </p>
          <FeatureList features={MarketerFeatures} />
        </div>,
        <WondrAICard key="wondr" />,
        <div key="designers" className="bg-[#3A2D21] p-8">
          <div className="flex">
            <p className="bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Badge
            </p>
          </div>
          <h3 className="mt-4 font-display text-2xl font-medium text-text-primary">
            Craft microcopy and UX text effortlessly.
          </h3>
          <p className="mt-2 text-base text-text-secondary">
            Get clear, on-brand suggestions for buttons, error states, and onboarding flows — in
            seconds.
          </p>
          <FeatureList features={DesignerFeatures} />
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
                BADGE
              </p>
            </div>
            <h2 className="font-display text-4xl font-semibold leading-tight text-text-primary md:text-5xl">
              Built for creators of all kinds
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Easily craft, refine, and manage prompts tailored for ChatGPT and Midjourney.
            </p>
          </div>
          <a
            href="/features"
            className="flex-shrink-0 bg-secondary px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-white/20"
          >
            All features
          </a>
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
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center bg-secondary text-foreground transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
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
