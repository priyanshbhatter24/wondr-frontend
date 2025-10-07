"use client";

import { useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import InsightCard from "@/components/InsightCard";
import InsightModal from "@/components/InsightModal";

interface InsightData {
  id: string;
  source: string;
  topic: string;
  description: string;
  remixOptions: { text: string }[];
  fullContent: string;
}

export default function IdeaHubPage() {
  const [selectedInsight, setSelectedInsight] = useState<InsightData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Placeholder generations for sidebar
  const generations = Array.from({ length: 20 }, (_, i) => ({
    id: `gen-${i + 1}`,
    name: `Google pixel 12mp camera announcement`,
    timestamp: `2 hours ago`,
  }));

  // Industry Updates data
  const industryUpdates: InsightData[] = [
    {
      id: "industry-1",
      source: "VERGE",
      topic: "Meta Ray Ban glasses fail live demo.",
      description:
        "During the live demo from mark zuckerberg, there was an error states, and onboarding flows. There is a need to further refine the framework and add more accessibility.",
      remixOptions: [
        {
          text: "Google believes that there is an infrastructure shortage",
        },
        { text: "Tease the competitor that we are building" },
        { text: "Google integration with meta glasses" },
        { text: "Need for smaller form factor to enable tech" },
      ],
      fullContent:
        "During Mark Zuckerberg's live demonstration of the Meta Ray-Ban smart glasses, a critical error occurred that highlighted the ongoing challenges in AR/VR technology. The incident occurred during a highly anticipated product showcase, where the CEO was demonstrating the glasses' AI capabilities and real-time information processing. The error states and onboarding flows exposed fundamental issues with the current framework that need to be addressed before mass market adoption. This presents an opportunity for competitors to emphasize their more robust testing and development processes.",
    },
    {
      id: "industry-2",
      source: "TECHCRUNCH",
      topic: "Deepmind image model announcement",
      description:
        "Google's DeepMind announces breakthrough in image generation with new model that surpasses current industry standards. The model shows improvements in photorealism and consistency.",
      remixOptions: [
        {
          text: "Highlight Google's leadership in AI image generation",
        },
        { text: "Compare capabilities with competitor models" },
        { text: "Showcase real-world applications for businesses" },
        { text: "Emphasize ethical AI development approach" },
      ],
      fullContent:
        "Google DeepMind has unveiled their latest image generation model, marking a significant advancement in AI-powered creative tools. The new model demonstrates unprecedented levels of photorealism and consistency in generated images, outperforming existing solutions from competitors. This breakthrough could have major implications for content creators, marketers, and businesses looking to leverage AI for visual content generation.",
    },
    {
      id: "industry-3",
      source: "WIRED",
      topic: "Gemini 2.5 pro intro posts",
      description:
        "Google announces Gemini 2.5 Pro with enhanced multimodal capabilities. The new model can process longer context windows and provides more accurate responses across various domains.",
      remixOptions: [
        {
          text: "Position Gemini as the most advanced AI assistant",
        },
        { text: "Highlight enterprise use cases and ROI" },
        { text: "Compare token limits with competitors" },
        { text: "Showcase developer-friendly API features" },
      ],
      fullContent:
        "The launch of Gemini 2.5 Pro represents Google's continued push in the competitive AI assistant market. With significantly enhanced multimodal capabilities and the ability to process context windows exceeding 1 million tokens, Gemini 2.5 Pro sets a new standard for enterprise AI applications. The model's improved accuracy and reasoning capabilities make it particularly suitable for complex business workflows and decision-making processes.",
    },
  ];

  // Competitor Insights data
  const competitorInsights: Record<string, InsightData[]> = {
    Meta: [
      {
        id: "meta-1",
        source: "META NEWSROOM",
        topic: "Llama 3 model family expansion",
        description:
          "Meta announces expansion of Llama 3 model family with new variants optimized for different use cases. Focus on open-source accessibility and community-driven development.",
        remixOptions: [
          {
            text: "Contrast with Google's enterprise-focused approach",
          },
          { text: "Highlight Gemini's superior performance metrics" },
          { text: "Emphasize Google's safety and reliability standards" },
          { text: "Showcase Google Cloud integration advantages" },
        ],
        fullContent:
          "Meta's strategic expansion of the Llama 3 model family demonstrates their commitment to open-source AI development. By releasing multiple variants optimized for different use cases, Meta is enabling developers and researchers to experiment with state-of-the-art language models. However, this open approach raises questions about safety guardrails and enterprise readiness compared to Google's more controlled ecosystem.",
      },
      {
        id: "meta-2",
        source: "BUSINESS INSIDER",
        topic: "Meta's AR spending reaches new heights",
        description:
          "Meta continues massive investment in AR/VR technologies with Reality Labs losses exceeding expectations. The company remains committed to its metaverse vision despite financial pressures.",
        remixOptions: [
          {
            text: "Position Google's practical AR approach as more sustainable",
          },
          { text: "Highlight Google Maps AR navigation success" },
          { text: "Compare ROI of different AR strategies" },
          { text: "Emphasize business applications over consumer focus" },
        ],
        fullContent:
          "Meta's Reality Labs division continues to incur significant losses as the company pursues its ambitious metaverse vision. Despite mounting financial pressures and skepticism from investors, Meta remains committed to AR/VR development. This presents an opportunity for Google to position its more measured, practical approach to AR—focused on enhancing existing products like Google Maps and Search—as a more sustainable path forward.",
      },
    ],
    Alphabet: [
      {
        id: "alphabet-1",
        source: "ALPHABET EARNINGS",
        topic: "Google Cloud revenue growth accelerates",
        description:
          "Alphabet reports strong Q4 results with Google Cloud revenue growth accelerating beyond expectations. AI services drive significant portion of new revenue.",
        remixOptions: [
          {
            text: "Showcase AI-powered cloud services as revenue driver",
          },
          { text: "Highlight enterprise customer success stories" },
          { text: "Position Google Cloud as AWS alternative" },
          { text: "Emphasize integrated AI tools and Vertex AI platform" },
        ],
        fullContent:
          "Alphabet's latest earnings report reveals Google Cloud's strongest performance yet, with revenue growth accelerating beyond analyst expectations. The growth is largely attributed to increased adoption of AI-powered services and tools, including Vertex AI and Gemini API integrations. This validates Google's strategy of deeply integrating AI capabilities across its cloud platform and positions Google Cloud as an increasingly viable alternative to AWS and Azure.",
      },
    ],
    Microsoft: [
      {
        id: "microsoft-1",
        source: "MICROSOFT BLOG",
        topic: "Copilot integration across Microsoft 365",
        description:
          "Microsoft expands Copilot AI assistant integration across all Microsoft 365 applications. New features enable automated workflow creation and intelligent document processing.",
        remixOptions: [
          {
            text: "Compare with Google Workspace AI features",
          },
          { text: "Highlight Gemini's superior language understanding" },
          { text: "Position Google Workspace as more open ecosystem" },
          { text: "Showcase collaborative AI features in Docs and Sheets" },
        ],
        fullContent:
          "Microsoft's aggressive integration of Copilot across the Microsoft 365 suite represents a major push to embed AI throughout their productivity tools. The new features promise to automate complex workflows and enhance document processing capabilities. This competitive move puts pressure on Google to accelerate Gemini integration in Google Workspace and clearly articulate the advantages of their approach to workplace AI.",
      },
      {
        id: "microsoft-2",
        source: "THE VERGE",
        topic: "Xbox Game Pass subscription numbers plateau",
        description:
          "Microsoft's Xbox Game Pass subscriber growth shows signs of plateauing after years of rapid expansion. The company explores new pricing tiers and content strategies.",
        remixOptions: [
          {
            text: "Contrast with YouTube Premium's steady growth",
          },
          { text: "Highlight Google's diverse subscription offerings" },
          { text: "Position YouTube as entertainment leader" },
          { text: "Showcase Google One bundled services advantage" },
        ],
        fullContent:
          "Microsoft's Xbox Game Pass, once hailed as the future of gaming, is showing signs of maturity with subscriber growth beginning to plateau. This development raises questions about the sustainability of subscription-based gaming services and highlights the challenges of maintaining growth in saturated markets. In contrast, Google's YouTube Premium continues to show steady subscriber growth, suggesting that video content subscriptions may have more staying power than gaming subscriptions.",
      },
    ],
  };

  const handleCardClick = (insight: InsightData) => {
    setSelectedInsight(insight);
    setIsModalOpen(true);
  };

  const industrySliderRef = useRef<HTMLDivElement>(null);
  const metaSliderRef = useRef<HTMLDivElement>(null);
  const alphabetSliderRef = useRef<HTMLDivElement>(null);
  const microsoftSliderRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 400;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const SliderSection = ({
    title,
    insights,
    sliderRef,
  }: {
    title: string;
    insights: InsightData[];
    sliderRef: React.RefObject<HTMLDivElement>;
  }) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(sliderRef, "left")}
            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            onClick={() => scroll(sliderRef, "right")}
            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {insights.map((insight) => (
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
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar generations={generations} />

      <div className="flex-1 bg-gray-950 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📁</span>
              </div>
              <h1 className="text-4xl font-bold text-white">Idea Hub</h1>
            </div>
          </div>

          {/* Industry Updates Slider */}
          <SliderSection
            title="Industry Updates"
            insights={industryUpdates}
            sliderRef={industrySliderRef}
          />

          {/* Competitor Insights */}
          <div className="mt-16 mb-8">
            <h2 className="text-3xl font-bold text-white mb-8">
              Competitor Insights
            </h2>

            {/* Meta */}
            <SliderSection
              title="Meta"
              insights={competitorInsights.Meta}
              sliderRef={metaSliderRef}
            />

            {/* Alphabet */}
            <SliderSection
              title="Alphabet"
              insights={competitorInsights.Alphabet}
              sliderRef={alphabetSliderRef}
            />

            {/* Microsoft */}
            <SliderSection
              title="Microsoft"
              insights={competitorInsights.Microsoft}
              sliderRef={microsoftSliderRef}
            />
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
