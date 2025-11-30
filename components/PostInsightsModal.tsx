"use client";

import { useState } from "react";
import { CompetitorPost } from "@/types/competitor-research";
import { Cross2Icon, EyeOpenIcon, HeartIcon, ChatBubbleIcon, Share1Icon, ExternalLinkIcon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";

interface PostInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CompetitorPost | null;
  competitorName: string;
  platform: string;
  onIdeate: () => Promise<void> | void;
}

/**
 * Format large numbers for display
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

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "Unknown date";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function PostInsightsModal({
  isOpen,
  onClose,
  post,
  competitorName,
  platform,
  onIdeate,
}: PostInsightsModalProps) {
  const [isRemixing, setIsRemixing] = useState(false);

  if (!post) return null;

  const engagement = post.engagement || { views: 0, likes: 0, comments: 0, shares: 0, retweets: 0 };
  const analysis = post.analysis || { messaging: "", positioning: "", strategy_fit: "", engagement_insight: "", themes: [] };
  const sentiment = post.sentiment;

  const handleRemixClick = async () => {
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
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2A2A2A] rounded-lg w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto z-50 shadow-xl">
          {/* Header */}
          <div className="sticky top-0 bg-[#2A2A2A] border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div>
              <Dialog.Title className="text-white font-semibold text-lg">
                Post Insights
              </Dialog.Title>
              <p className="text-white/60 text-sm mt-0.5">
                {competitorName} • {platform} • {formatDate(post.date_posted)}
              </p>
            </div>
            <Dialog.Close asChild>
              <button className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                <Cross2Icon className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Post Images */}
            {post.images && post.images.length > 0 && (
              <div className="space-y-2">
                {post.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Post image ${index + 1}`}
                    className="w-full rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ))}
              </div>
            )}

            {/* Post Text */}
            <div>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Post Content
              </h4>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                {post.post_text}
              </p>
            </div>

            {/* Engagement Metrics */}
            <div>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Engagement
              </h4>
              <div className="flex flex-wrap gap-4 text-white text-sm">
                {engagement.views > 0 && (
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                    <EyeOpenIcon className="w-4 h-4" />
                    {formatNumber(engagement.views)} views
                  </span>
                )}
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                  <HeartIcon className="w-4 h-4" />
                  {formatNumber(engagement.likes)} likes
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                  <ChatBubbleIcon className="w-4 h-4" />
                  {formatNumber(engagement.comments)} comments
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                  <Share1Icon className="w-4 h-4" />
                  {formatNumber(engagement.shares + (engagement.retweets || 0))} shares
                </span>
              </div>
            </div>

            {/* Themes */}
            {analysis.themes && analysis.themes.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                  Themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.themes.map((theme, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#C5D86D]/20 text-[#C5D86D] text-xs font-medium rounded-full"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                AI Analysis
              </h4>

              {analysis.messaging && (
                <div>
                  <h5 className="text-white font-medium text-sm mb-1">Messaging</h5>
                  <p className="text-white/80 text-sm leading-relaxed">{analysis.messaging}</p>
                </div>
              )}

              {analysis.positioning && (
                <div>
                  <h5 className="text-white font-medium text-sm mb-1">Positioning</h5>
                  <p className="text-white/80 text-sm leading-relaxed">{analysis.positioning}</p>
                </div>
              )}

              {analysis.strategy_fit && (
                <div>
                  <h5 className="text-white font-medium text-sm mb-1">Strategy Fit</h5>
                  <p className="text-white/80 text-sm leading-relaxed">{analysis.strategy_fit}</p>
                </div>
              )}

              {analysis.engagement_insight && (
                <div>
                  <h5 className="text-white font-medium text-sm mb-1">Engagement Insight</h5>
                  <p className="text-white/80 text-sm leading-relaxed">{analysis.engagement_insight}</p>
                </div>
              )}
            </div>

            {/* Sentiment (if available) */}
            {sentiment && (
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Sentiment Analysis
                </h4>

                {sentiment.overall && (
                  <div>
                    <h5 className="text-white font-medium text-sm mb-1">Overall Sentiment</h5>
                    <p className="text-white/80 text-sm">{sentiment.overall}</p>
                  </div>
                )}

                {sentiment.praise_points && sentiment.praise_points.length > 0 && (
                  <div>
                    <h5 className="text-white font-medium text-sm mb-1">Praise Points</h5>
                    <ul className="space-y-1">
                      {sentiment.praise_points.map((point, index) => (
                        <li key={index} className="text-white/80 text-sm flex items-start gap-2">
                          <span className="text-[#C5D86D]">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {sentiment.complaints && sentiment.complaints.length > 0 && (
                  <div>
                    <h5 className="text-white font-medium text-sm mb-1">Complaints</h5>
                    <ul className="space-y-1">
                      {sentiment.complaints.map((complaint, index) => (
                        <li key={index} className="text-white/80 text-sm flex items-start gap-2">
                          <span className="text-red-400">•</span>
                          {complaint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {sentiment.surprising_insights && sentiment.surprising_insights.length > 0 && (
                  <div>
                    <h5 className="text-white font-medium text-sm mb-1">Surprising Insights</h5>
                    <ul className="space-y-1">
                      {sentiment.surprising_insights.map((insight, index) => (
                        <li key={index} className="text-white/80 text-sm flex items-start gap-2">
                          <span className="text-yellow-400">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-[#2A2A2A] border-t border-white/10 px-6 py-4 flex items-center gap-3">
            <button
              onClick={handleRemixClick}
              disabled={isRemixing}
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 text-white/90 font-medium text-sm transition-all hover:bg-white/10 hover:text-white disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <a
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 border border-white/20 text-white/80 font-light text-sm rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <ExternalLinkIcon className="w-4 h-4" />
              Post
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
