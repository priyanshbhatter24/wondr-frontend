"use client";

import Image from "next/image";
import { useState } from "react";
import { CompetitorPost } from "@/types/competitor-research";
import { EyeOpenIcon, HeartIcon, ChatBubbleIcon, PaperPlaneIcon } from "@radix-ui/react-icons";

interface CompetitorPostCardProps {
  post: CompetitorPost;
  platform: string;
  onIdeate: () => Promise<void> | void;
  onShowInsights: () => void;
}

/**
 * Format large numbers for display (e.g., 27864 → "27.9K")
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export default function CompetitorPostCard({
  post,
  platform,
  onIdeate,
  onShowInsights,
}: CompetitorPostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  const hasImage = post.images && post.images.length > 0 && !imageError;

  // Use entire post text for display logic, truncation handled by CSS or length check in render
  const postText = post.post_text;

  const engagement = post.engagement || { views: 0, likes: 0, comments: 0, shares: 0 };
  
  // Hide views if 0
  const showViews = engagement.views > 0;
  
  // Hide platform label if Reddit or LinkedIn (context is redundant)
  const isRedditOrLinkedIn = platform === "Reddit" || platform === "LinkedIn";
  const showPlatformLabel = !isRedditOrLinkedIn;

  // Map platform names
  const platformDisplay = platform === 'X' ? 'Twitter' : platform;

  const handleRemixClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRemixing) return;

    setIsRemixing(true);
    try {
      await onIdeate();
    } catch (error) {
      console.error("Remix failed:", error);
      setIsRemixing(false);
    }
  };

  return (
    // Changed background to match Industry Updates cards (#2A2A2A)
    <div 
      onClick={onShowInsights}
      className="bg-[#2A2A2A] rounded-xl overflow-hidden flex flex-col border border-white/5 p-4 h-full transition-colors hover:bg-[#333333] cursor-pointer"
    >
      {/* Image Area - 3:2 aspect ratio with dark background */}
      <div className="relative aspect-[3/2] w-full bg-[#1A1A1A] rounded-md overflow-hidden mb-4 flex items-center justify-center">
        {hasImage ? (
          <Image
            src={post.images[0]}
            alt={postText.substring(0, 60)}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-[#151515] rounded-md">
            <p className="text-white/60 text-xs text-center line-clamp-6 italic">
              &ldquo;{postText.substring(0, 150)}{postText.length > 150 ? "..." : ""}&rdquo;
            </p>
          </div>
        )}
        
        {/* Platform Badge Overlay */}
        {showPlatformLabel && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-medium">
            {platformDisplay}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 flex-1">
        {/* Title (Post Text Snippet) */}
        {(!isRedditOrLinkedIn || hasImage) && (
          <h3 className="text-white font-medium text-sm line-clamp-2 leading-snug min-h-[2.5em]">
            {postText.length > 60 ? postText.substring(0, 60) + "..." : postText}
          </h3>
        )}

        {/* Engagement & Remix Button Row */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Engagement Metrics - Left Aligned with Gap */}
          <div className="flex items-center text-white/50 text-[13px] gap-4">
            {showViews && (
              <div className="flex items-center gap-1.5">
                <EyeOpenIcon className="w-[17px] h-[17px] text-blue-400" />
                <span>{formatNumber(engagement.views)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <HeartIcon className="w-[17px] h-[17px] hover:text-red-400 transition-colors" />
              <span>{formatNumber(engagement.likes)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ChatBubbleIcon className="w-[17px] h-[17px]" />
              <span>{formatNumber(engagement.comments)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PaperPlaneIcon className="w-[17px] h-[17px] -rotate-45 translate-y-[-1px]" />
              <span>{formatNumber(engagement.shares + (engagement.retweets || 0))}</span>
            </div>
          </div>

          {/* Remix Button - Right Aligned */}
          <button
            onClick={handleRemixClick}
            disabled={isRemixing}
            className="px-3 py-1.5 rounded-lg border border-white/20 text-white/90 text-xs font-medium hover:bg-white/5 hover:border-white/40 transition-all ml-4 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isRemixing ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              "Remix"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
