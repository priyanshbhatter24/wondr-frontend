"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { FileIcon, LightningBoltIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { ChannelDetail } from "@/types/industry-updates";

interface RemixOption {
  text: string;
  reasoning?: string;
}

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  topic: string;
  description: string;
  remixOptions: RemixOption[];
  channels?: { [key: string]: ChannelDetail[] };
  fullContent?: string;
  industryUpdateId?: string;
}

// Helper function to get channel icon
const getChannelIcon = (channelName: string) => {
  const name = channelName.toLowerCase();

  if (name === "reddit") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF4500">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    );
  }

  if (name === "twitter" || name === "x") {
    return <span className="text-lg">🐦</span>;
  }

  if (name === "news" || name === "bbc") {
    return <span className="text-lg">📰</span>;
  }

  if (name === "youtube") {
    return <span className="text-lg">📹</span>;
  }

  if (name === "hacker_news" || name === "hackernews") {
    return <span className="text-lg">🟧</span>;
  }

  if (name === "linkedin") {
    return <span className="text-lg">💼</span>;
  }

  return <span className="text-lg">📄</span>;
};

// Helper function to get channel color
const getChannelColor = (channelName: string) => {
  const name = channelName.toLowerCase();
  if (name === "reddit") return "#FF4500";
  if (name === "twitter" || name === "x") return "#1DA1F2";
  if (name === "youtube") return "#FF0000";
  if (name === "hacker_news" || name === "hackernews") return "#FF6600";
  if (name === "linkedin") return "#0A66C2";
  if (name === "bbc" || name === "news") return "#BB1919";
  return "#FFFFFF";
};

// Helper function to capitalize channel name
const capitalizeChannelName = (name: string) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Color palette options - updated with proper colors including pure black
const colorPalette = [
  { id: "white", color: "#FFFFFF", label: "White" },
  { id: "lime", color: "#C5D86D", label: "Lime" },
  { id: "tan", color: "#8B7355", label: "Tan" },
  { id: "gray", color: "#2C2C2C", label: "Gray" },
  { id: "black", color: "#000000", label: "Black" },
];

export default function InsightModal({
  isOpen,
  onClose,
  description,
  remixOptions,
  channels,
  industryUpdateId,
}: InsightModalProps) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [promptInput, setPromptInput] = useState("");

  const handleRemixClick = (index: number) => {
    if (industryUpdateId) {
      router.push(`/post-ideation?id=${industryUpdateId}&index=${index}`);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleAutosuggest = () => {
    // TODO: Implement autosuggest functionality
    console.log("Autosuggest clicked");
  };

  // Get channels with data - dynamically generate cards for ALL channels
  const channelsWithData = Object.entries(channels || {}).filter(
    ([, details]) => Array.isArray(details) && details.length > 0
  );

  // Debug: Log all available channels
  console.log("Available channels:", channelsWithData.map(([name]) => name));

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* No overlay - sidebar should be clickable */}
        <Dialog.Content
          className="fixed inset-y-0 left-64 right-0 flex text-white transition-colors duration-300 z-40"
          style={{ backgroundColor: selectedColor }}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Industry Update Details</Dialog.Title>
          </VisuallyHidden.Root>

          {/* Modal Layout */}
          <div className="relative flex flex-col w-full h-full">
            {/* Close Button */}
            <Dialog.Close className="absolute right-6 top-6 rounded-sm bg-white/10 p-1 text-white opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 disabled:pointer-events-none z-50">
              <span className="text-3xl font-bold leading-none">×</span>
              <span className="sr-only">Close</span>
            </Dialog.Close>


            {/* Main Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto pb-32">
              <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
                {/* Two Column Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* LEFT SIDEBAR - ONLY Company Data + Documents (NO Generations) */}
                  <div className="flex-none lg:w-[35%]">
                    {/* Single box containing Company Data and Documents */}
                    <div className="rounded-lg bg-[#3A3A3A] p-6 flex flex-col h-full">
                      {/* Company Data Section */}
                      <div className="mb-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70 text-left">
                          COMPANY DATA
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed text-left">
                          Tease the competitor that we are building
                        </p>
                      </div>

                      {/* Document Links */}
                      <div className="space-y-2">
                        <a
                          href="#"
                          className="flex items-start gap-3 p-3 rounded-lg bg-white/5 text-white/90 hover:bg-white/10 transition-colors group text-left"
                        >
                          <FileIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/70 group-hover:text-white" />
                          <span className="text-sm">Bring up the research paper on mini LLMs</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-start gap-3 p-3 rounded-lg bg-white/5 text-white/90 hover:bg-white/10 transition-colors group text-left"
                        >
                          <FileIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/70 group-hover:text-white" />
                          <span className="text-sm">AI wearable device being a strong showcase</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT CONTENT - Single box with ICP Insights + Dynamic Channel Cards */}
                  <div className="flex-1">
                    <div className="rounded-lg bg-[#3A3A3A] p-6 h-full flex flex-col">
                      {/* ICP Insights Section */}
                      <div className="mb-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70 text-left">
                          ICP INSIGHTS
                        </h3>

                        {/* Description */}
                        <p className="text-white/90 text-sm mb-6 leading-relaxed text-left">
                          {description}
                        </p>

                        {/* Remix Options as bullet points */}
                        {remixOptions && remixOptions.length > 0 && (
                          <div className="space-y-2">
                            {remixOptions.slice(0, 3).map((option, index) => (
                              <div
                                key={index}
                                onClick={() => handleRemixClick(index)}
                                className="flex items-start gap-3 cursor-pointer group"
                              >
                                <LightningBoltIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/70 group-hover:text-[#C5D86D] transition-colors" />
                                <p className="text-sm text-white/80 group-hover:text-white transition-colors text-left">
                                  {option.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Dynamic Channel Cards - Render ALL channels with data */}
                      {channelsWithData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {channelsWithData.map(([channelName, details]) => (
                            <div key={channelName} className="rounded-lg bg-[#2A2A2A] p-5 flex flex-col min-h-[200px]">
                              <div className="flex items-center gap-2 mb-4">
                                {getChannelIcon(channelName)}
                                <h4
                                  className="text-sm font-semibold capitalize"
                                  style={{ color: getChannelColor(channelName) }}
                                >
                                  {capitalizeChannelName(channelName)}
                                </h4>
                              </div>
                              <div className="space-y-3 overflow-y-auto max-h-64 custom-scrollbar flex-1">
                                {details.slice(0, 4).map((detail, index) => {
                                  // Truncate long quotes
                                  const truncatedText = detail.filtered_detail.length > 200
                                    ? detail.filtered_detail.substring(0, 200) + "..."
                                    : detail.filtered_detail;

                                  return (
                                    <a
                                      key={index}
                                      href={detail.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block group"
                                    >
                                      <blockquote className="text-xs text-white/80 italic group-hover:text-white transition-colors cursor-pointer text-left">
                                        &ldquo;{truncatedText}&rdquo;
                                      </blockquote>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg bg-[#2A2A2A] p-6 text-center">
                          <p className="text-white/60 text-sm">No channel insights available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input - Centered and Smaller */}
            <div className="absolute bottom-6 left-0 right-0 z-40">
              <div className="flex flex-col items-center">
                {/* Color Picker and Autosuggest Row */}
                <div className="w-full max-w-2xl flex items-center justify-between mb-3 px-6">
                  {/* Color Picker - Left Side, Smaller */}
                  <div className="flex items-center gap-0 bg-white/10 backdrop-blur-sm rounded-full p-1 shadow-lg">
                    {colorPalette.map((colorOption, index) => (
                      <button
                        key={colorOption.id}
                        onClick={() => handleColorSelect(colorOption.color)}
                        className={`w-6 h-6 transition-all hover:scale-110 focus:outline-none ${
                          selectedColor === colorOption.color ? "ring-1 ring-white scale-110" : ""
                        } ${
                          index === 0 ? "rounded-l-full" : index === colorPalette.length - 1 ? "rounded-r-full" : ""
                        }`}
                        style={{ backgroundColor: colorOption.color }}
                        title={colorOption.label}
                        aria-label={`Select ${colorOption.label} color`}
                      />
                    ))}
                  </div>

                  {/* Autosuggest Button - Right Side */}
                  <button
                    onClick={handleAutosuggest}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-[#C5D86D] rounded-full hover:bg-[#252525] transition-colors font-medium text-sm shadow-md"
                  >
                    Autosuggest prompt
                    <ArrowUpIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Chat Input - Centered, 1/3 Width */}
                <div className="w-full max-w-2xl px-6">
                  <div className="rounded-full bg-[#2a2a2a] shadow-2xl py-3 px-5 flex items-center gap-3">
                    {/* Input Field */}
                    <input
                      type="text"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="Describe the post you want to generate"
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none"
                    />

                    {/* Submit Button */}
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-gray-600 hover:bg-gray-500 rounded-full transition-colors shadow-md flex-shrink-0"
                      aria-label="Submit"
                    >
                      <ArrowUpIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          `}</style>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
