"use client";

import * as HoverCard from "@radix-ui/react-hover-card";

interface PromptTooltipProps {
  detailedPrompt: string;
  children: React.ReactNode;
}

export default function PromptTooltip({
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
          className="bg-[#262626] rounded-lg p-6 shadow-2xl max-w-2xl w-[600px] z-50"
          sideOffset={5}
          side="top"
        >
          <div className="space-y-3">
            {/* Detailed Prompt */}
            <div className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {detailedPrompt}
            </div>
          </div>

          <HoverCard.Arrow className="fill-[#262626]" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
