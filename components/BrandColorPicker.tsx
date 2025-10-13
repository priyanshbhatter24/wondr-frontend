"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import * as Popover from "@radix-ui/react-popover";
import * as HoverCard from "@radix-ui/react-hover-card";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { BrandColor } from "@/types/industry-updates";

interface BrandColorPickerProps {
  colors: BrandColor[];
  onChange: (colors: BrandColor[]) => void;
  maxColors?: number;
}

export default function BrandColorPicker({
  colors,
  onChange,
  maxColors = 5,
}: BrandColorPickerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addColor = () => {
    if (colors.length >= maxColors) return;
    onChange([...colors, { hex_code: "#C1D75B", weight: 3 }]);
  };

  const removeColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, hex_code: string) => {
    const updated = [...colors];
    updated[index] = { ...updated[index], hex_code };
    onChange(updated);
  };

  const updateWeight = (index: number, weight: number) => {
    const updated = [...colors];
    updated[index] = { ...updated[index], weight };
    onChange(updated);
  };

  // Calculate proportional widths for visual preview
  const totalWeight = colors.reduce((sum, c) => sum + c.weight, 0);
  const getProportionalWidth = (weight: number) => {
    if (totalWeight === 0) return 0;
    return (weight / totalWeight) * 100;
  };

  return (
    <div className="space-y-4">
      {/* Color Slots */}
      <div className="space-y-3">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#2A2A2A] p-4"
          >
            {/* Color Preview with Picker */}
            <Popover.Root
              open={editingIndex === index}
              onOpenChange={(open) => setEditingIndex(open ? index : null)}
            >
              <Popover.Trigger asChild>
                <HoverCard.Root>
                  <HoverCard.Trigger asChild>
                    <button
                      type="button"
                      className="h-12 w-12 shrink-0 rounded-full border-2 border-white/20 transition-all hover:scale-110 hover:border-white/40"
                      style={{ backgroundColor: color.hex_code }}
                      aria-label={`Edit color ${index + 1}`}
                    />
                  </HoverCard.Trigger>
                  <HoverCard.Portal>
                    <HoverCard.Content
                      side="top"
                      className="rounded-lg bg-black/90 px-3 py-2 text-xs text-white shadow-lg"
                    >
                      {color.hex_code.toUpperCase()}
                      <HoverCard.Arrow className="fill-black/90" />
                    </HoverCard.Content>
                  </HoverCard.Portal>
                </HoverCard.Root>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="right"
                  className="rounded-xl border border-white/10 bg-[#2A2A2A] p-4 shadow-xl"
                >
                  <HexColorPicker
                    color={color.hex_code}
                    onChange={(hex) => updateColor(index, hex)}
                  />
                  <div className="mt-3 text-center">
                    <input
                      type="text"
                      value={color.hex_code.toUpperCase()}
                      onChange={(e) => updateColor(index, e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-center text-sm font-mono text-white focus:border-[#C5D86D] focus:outline-none"
                      placeholder="#RRGGBB"
                      maxLength={7}
                    />
                  </div>
                  <Popover.Arrow className="fill-[#2A2A2A]" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {/* Weight Slider */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wide text-white/50">
                  Weight
                </label>
                <span className="text-sm font-medium text-white">
                  {color.weight}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={color.weight}
                onChange={(e) =>
                  updateWeight(index, parseInt(e.target.value))
                }
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5D86D] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C5D86D] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
            </div>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => removeColor(index)}
              className="shrink-0 rounded-full border border-red-500/50 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20"
              aria-label={`Remove color ${index + 1}`}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Color Button */}
      {colors.length < maxColors && (
        <button
          type="button"
          onClick={addColor}
          className="w-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-4 text-sm font-medium text-white/60 transition-colors hover:border-[#C5D86D]/40 hover:bg-[#C5D86D]/10 hover:text-[#C5D86D]"
        >
          <PlusIcon className="inline h-4 w-4 mr-2" />
          Add Brand Color ({colors.length}/{maxColors})
        </button>
      )}

      {/* Visual Preview */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-white/50">
            Proportional Preview
          </label>
          <div className="flex h-12 overflow-hidden rounded-full border border-white/10">
            {colors.map((color, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: color.hex_code,
                  width: `${getProportionalWidth(color.weight)}%`,
                }}
                className="transition-all duration-300"
                title={`${color.hex_code} (weight: ${color.weight})`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
