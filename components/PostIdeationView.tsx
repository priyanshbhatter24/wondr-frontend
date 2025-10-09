"use client";

import * as Separator from "@radix-ui/react-separator";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import PromptTooltip from "./PromptTooltip";
import { SuggestedTask } from "@/types/post-ideation";
import Link from "next/link";

interface PostIdeationViewProps {
  remixTopic: string;
  reasoning: string;
  contextBlurb: string;
  textSummary: string;
  imageRecommendations: string;
  suggestedTasks: SuggestedTask[];
}

export default function PostIdeationView({
  remixTopic,
  reasoning,
  contextBlurb,
  textSummary,
  imageRecommendations,
  suggestedTasks,
}: PostIdeationViewProps) {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <ScrollArea.Root className="h-screen">
        <ScrollArea.Viewport className="h-full w-full">
          <div className="max-w-6xl mx-auto px-8 py-12 space-y-12">
            {/* Header - Remix Topic */}
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-white leading-tight">
                {remixTopic}
              </h1>

              <Separator.Root className="bg-white/20 h-px" />

              {/* Reasoning */}
              <div className="text-lg text-white/80 leading-relaxed">
                <span className="text-[#C1D75B] font-semibold uppercase text-sm tracking-wider mr-3">
                  Reasoning:
                </span>
                {reasoning}
              </div>
            </div>

            {/* Context Blurb */}
            <div className="bg-[#1a1a1a] border border-white/20 rounded-xl p-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#C1D75B] mb-5">
                Context
              </h2>
              <p className="text-base leading-relaxed text-white/90">
                {contextBlurb}
              </p>
            </div>

            <Separator.Root className="bg-white/20 h-px" />

            {/* Summary Section */}
            <div className="bg-[#1a1a1a] border border-white/20 rounded-xl p-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#C1D75B] mb-5">
                Summary
              </h2>
              <p className="text-base leading-relaxed text-white">
                {textSummary}
              </p>
            </div>

            {/* Image Recommendations Section */}
            <div className="bg-[#1a1a1a] border border-white/20 rounded-xl p-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#C1D75B] mb-5">
                Image Recommendations
              </h2>
              <p className="text-base leading-relaxed text-white/90 whitespace-pre-line">
                {imageRecommendations}
              </p>
            </div>

            {/* Suggested Tasks Section */}
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#C1D75B]">
                Suggested Tasks
              </h2>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {suggestedTasks.map((task, index) => (
                  <Link
                    key={index}
                    href={`/generate-post?prompt=${encodeURIComponent(task.detailed_prompt)}`}
                    className="block"
                  >
                    <PromptTooltip
                      taskTitle={task.task_title}
                      detailedPrompt={task.detailed_prompt}
                    >
                      <div className="bg-[#846348] hover:brightness-110 transition-all duration-200 rounded-xl p-6 cursor-pointer border border-transparent hover:border-[#C1D75B]/40">
                        <div className="flex items-start gap-4">
                          {/* Task Number */}
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>

                          {/* Task Title */}
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-white leading-tight">
                              {task.task_title}
                            </h3>
                            <p className="text-xs text-white/50 mt-2">
                              Click to generate post
                            </p>
                          </div>
                        </div>
                      </div>
                    </PromptTooltip>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Spacing for Input Bar */}
            <div className="h-32" />
          </div>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          className="flex touch-none select-none bg-white/5 transition-colors duration-150 ease-out hover:bg-white/10 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-white/20 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner className="bg-white/5" />
      </ScrollArea.Root>
    </div>
  );
}
