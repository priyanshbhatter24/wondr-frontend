"use client";

import * as HoverCard from "@radix-ui/react-hover-card";

interface PromptTooltipProps {
  taskTitle: string;
  detailedPrompt: string;
  children: React.ReactNode;
}

export default function PromptTooltip({
  taskTitle,
  detailedPrompt,
  children,
}: PromptTooltipProps) {
  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        {children}
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="bg-[#262626] border border-white/20 rounded-lg p-6 shadow-2xl max-w-2xl w-[600px] z-50"
          sideOffset={5}
          side="top"
        >
          <div className="space-y-3">
            {/* Title */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#C1D75B]">
                PROMPT
              </div>
              <div className="text-sm font-semibold text-white">
                {taskTitle}
              </div>
            </div>

            {/* Detailed Prompt */}
            <div className="text-sm leading-relaxed text-white/90 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
              {detailedPrompt}
            </div>

            {/* Hint */}
            <div className="text-xs text-white/50 italic pt-2 border-t border-white/10">
              This prompt can be used directly in image generation tools
            </div>
          </div>

          <HoverCard.Arrow className="fill-[#262626]" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
