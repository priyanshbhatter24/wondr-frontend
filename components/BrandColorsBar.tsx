"use client";

import * as HoverCard from "@radix-ui/react-hover-card";
import { BrandColor } from "@/types/industry-updates";

interface BrandColorsBarProps {
  colors: BrandColor[];
}

export default function BrandColorsBar({ colors }: BrandColorsBarProps) {
  if (!colors || colors.length === 0) {
    return null;
  }

  // Calculate proportional widths based on weights
  const totalWeight = colors.reduce((sum, c) => sum + c.weight, 0);
  const getProportionalWidth = (weight: number) => {
    if (totalWeight === 0) return 0;
    return (weight / totalWeight) * 100;
  };

  return (
    <div className="border-t border-white/5 bg-[#2A2A2A] px-4 py-3">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wide text-white/50 shrink-0">
            Brand Colors
          </span>
          <div className="flex h-8 flex-1 overflow-hidden rounded-full border border-white/10">
            {colors.map((color, index) => {
              const width = getProportionalWidth(color.weight);

              return (
                <HoverCard.Root key={index} openDelay={100}>
                  <HoverCard.Trigger asChild>
                    <div
                      style={{
                        backgroundColor: color.hex_code,
                        width: `${width}%`,
                      }}
                      className="cursor-help transition-all duration-300 hover:opacity-80"
                      aria-label={`Brand color ${color.hex_code}`}
                    />
                  </HoverCard.Trigger>
                  <HoverCard.Portal>
                    <HoverCard.Content
                      side="top"
                      className="rounded-lg bg-black/90 px-3 py-2 text-xs text-white shadow-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded border border-white/20"
                          style={{ backgroundColor: color.hex_code }}
                        />
                        <div>
                          <div className="font-mono font-semibold">
                            {color.hex_code.toUpperCase()}
                          </div>
                          <div className="text-white/60">Weight: {color.weight}/5</div>
                        </div>
                      </div>
                      <HoverCard.Arrow className="fill-black/90" />
                    </HoverCard.Content>
                  </HoverCard.Portal>
                </HoverCard.Root>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
