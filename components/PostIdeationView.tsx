"use client";

import Link from "next/link";
import { PostIdeationResponse } from "@/types/post-ideation";
import PromptTooltip from "./PromptTooltip";

interface PostIdeationViewProps {
  userPrompt: string;
  conversation: { prompt: string; ideation: PostIdeationResponse | null; isLoading?: boolean }[];
}

export default function PostIdeationView({
  userPrompt,
  conversation,
}: PostIdeationViewProps) {
  return (
    <div className="min-h-screen bg-[#3A3A3A] text-white">
      <div className="mx-auto max-w-5xl px-8 py-8 space-y-6">
        {/* User Prompt - Right-aligned chat bubble */}
        <div className="flex justify-end">
          <div className="max-w-[80%] bg-[#2A2A2A] rounded-2xl p-5">
            <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
              {userPrompt}
            </p>
          </div>
        </div>

        {conversation.map(({ prompt, ideation, isLoading }, index) => (
          <div key={`${ideation?.ideation_id || index}-${index}`} className="space-y-6">
            {index > 0 && (
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-[#252525] rounded-xl p-5 border border-white/5 shadow-lg">
                  <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {prompt}
                  </p>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="bg-[#252525] rounded-xl p-6 border border-white/5 shadow-lg">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                  <div className="h-4 bg-white/10 rounded w-4/5"></div>
                </div>
              </div>
            ) : ideation ? (
              <>
                <div className="">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    {ideation.remix_topic}
                  </h2>
                  <div className="space-y-1">
                    <span className="text-white/50 font-medium text-xs uppercase tracking-wide">
                      Reasoning
                    </span>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {ideation.reasoning}
                    </p>
                  </div>
                </div>

                <div className="">
                  <h3 className="text-white/50 font-medium text-xs uppercase tracking-wide mb-3">
                    Text Recommendation
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {ideation.text_recommendation}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white/50 font-medium text-xs uppercase tracking-wide">
                    Image Recommendations
                  </h3>

                  {ideation.image_recommendations.map((rec) => (
                    <div key={`${index}-${rec.recommendation_number}`} className="overflow-hidden">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 text-white flex items-center justify-center font-semibold text-sm">
                            {rec.recommendation_number}.
                          </div>
                          <p className="text-white/90 text-sm leading-relaxed pt-0.5">
                            {rec.explanation}
                          </p>
                        </div>

                        <Link
                          href={`/generate-post?prompt=${encodeURIComponent(rec.suggested_task.detailed_prompt)}`}
                          className="block"
                        >
                          <PromptTooltip
                            detailedPrompt={rec.suggested_task.detailed_prompt}
                          >
                            <div className="hover:bg-[#303030] transition-all duration-200 rounded-xl mx-7 p-4 cursor-pointer border border-[#FFFFFF]/20 hover:border-white/10 group">
                              <div className="flex items-center justify-between">
                                <h4 className="text-white/90 font-medium text-sm group-hover:text-white transition-colors">
                                  {rec.suggested_task.task_title}
                                </h4>
                                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#FFFFFF]/20 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white text-xs font-medium">
                                  Start task
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3 3.732a1.5 1.5 0 012.305-1.265l6.706 4.267a1.5 1.5 0 010 2.531l-6.706 4.268A1.5 1.5 0 013 12.267V3.732z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </PromptTooltip>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ))}

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
