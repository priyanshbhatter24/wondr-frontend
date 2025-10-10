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
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        {/* User Prompt - Right-aligned chat bubble */}
        <div className="flex justify-end">
          <div className="max-w-[80%] bg-[#2A2A2A] rounded-2xl p-4 border border-white/10">
            <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
              {userPrompt}
            </p>
          </div>
        </div>

        {conversation.map(({ prompt, ideation, isLoading }, index) => (
          <div key={`${ideation?.ideation_id || index}-${index}`} className="space-y-6">
            {index > 0 && (
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-[#2A2A2A] rounded-2xl p-4 border border-white/10">
                  <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {prompt}
                  </p>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="bg-[#2A2A2A] rounded-lg p-6 border border-white/10">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                  <div className="h-4 bg-white/10 rounded w-4/5"></div>
                </div>
              </div>
            ) : ideation ? (
              <>
                <div className="bg-[#2A2A2A] rounded-lg p-6 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {ideation.remix_topic}
                  </h2>
                  <div className="flex items-start gap-2">
                    <span className="text-[#C5D86D] font-semibold text-sm uppercase tracking-wider flex-shrink-0">
                      Reasoning:
                    </span>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {ideation.reasoning}
                    </p>
                  </div>
                </div>

                <div className="bg-[#2A2A2A] rounded-lg p-6 border border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#C5D86D] mb-4">
                    Text Recommendation
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {ideation.text_recommendation}
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#C5D86D]">
                    Image Recommendations
                  </h3>

                  {ideation.image_recommendations.map((rec) => (
                    <div key={`${index}-${rec.recommendation_number}`} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C5D86D] text-[#000000] flex items-center justify-center font-bold text-sm">
                          {rec.recommendation_number}
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed pt-1">
                          {rec.explanation}
                        </p>
                      </div>

                      <Link
                        href={`/generate-post?prompt=${encodeURIComponent(rec.suggested_task.detailed_prompt)}`}
                        className="block ml-11"
                      >
                        <PromptTooltip
                          taskTitle={rec.suggested_task.task_title}
                          detailedPrompt={rec.suggested_task.detailed_prompt}
                        >
                          <div className="bg-[#846348] hover:brightness-110 transition-all duration-200 rounded-lg p-4 cursor-pointer border border-transparent hover:border-[#C5D86D]/40">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-semibold text-sm">
                                {rec.suggested_task.task_title}
                              </h4>
                              <button className="text-white/70 hover:text-white text-xs font-medium flex items-center gap-1">
                                Start task
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </PromptTooltip>
                      </Link>
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
