"use client";

import { useRef } from "react";
import { CompetitorPost } from "@/types/competitor-research";
import CompetitorPostCard from "./CompetitorPostCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface PlatformSectionProps {
  platform: string;
  posts: CompetitorPost[];
  onIdeate: (post: CompetitorPost) => void;
  onShowInsights: (post: CompetitorPost) => void;
}

export default function PlatformSection({
  platform,
  posts,
  onIdeate,
  onShowInsights,
}: PlatformSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!posts || posts.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // approx card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Map platform names to display names
  const platformName = {
    "X": "Twitter",
    "Twitter": "Twitter",
    "LinkedIn": "LinkedIn",
    "YouTube": "YouTube",
    "Reddit": "Reddit"
  }[platform] || platform;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        {/* Increased font size for platform headings */}
        <h3 className="text-white/80 text-lg font-medium">{platformName}</h3>
        
        {/* Scroll Buttons */}
        {posts.length > 3 && (
          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center text-white transition-colors hover:bg-black/40"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center text-white transition-colors hover:bg-black/40"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1 snap-x"
      >
        {posts.map((post, index) => (
          <div key={`${post.post_id}-${index}`} className="w-[320px] flex-shrink-0 snap-start">
            <CompetitorPostCard
              post={post}
              platform={platform}
              onIdeate={() => onIdeate(post)}
              onShowInsights={() => onShowInsights(post)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
