"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import * as Popover from "@radix-ui/react-popover";
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
    // Default to black, user can change to any color
    onChange([...colors, { hex_code: "#000000" }]);
  };

  const removeColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, hex_code: string) => {
    const updated = [...colors];
    updated[index] = { hex_code };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Color Slots */}
      <div className="space-y-3">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#2A2A2A] p-3"
          >
            {/* Color Preview with Picker */}
            <Popover.Root
              open={editingIndex === index}
              onOpenChange={(open) => setEditingIndex(open ? index : null)}
            >
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className="h-12 w-12 shrink-0 rounded-full border-2 border-white/20 transition-all hover:scale-110 hover:border-white/40 cursor-pointer"
                  style={{ backgroundColor: color.hex_code }}
                  aria-label={`Edit color ${index + 1}: ${color.hex_code}`}
                />
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="right"
                  sideOffset={10}
                  className="z-50 rounded-xl border border-white/10 bg-[#2A2A2A] p-4 shadow-xl"
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

            {/* Hex Code Display */}
            <div className="flex-1">
              <div className="text-sm font-mono font-medium text-white">
                {color.hex_code.toUpperCase()}
              </div>
              <div className="text-xs text-white/50">
                Click circle to edit
              </div>
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

      {/* Equal-width Preview */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-white/50">
            Color Palette Preview
          </label>
          <div className="flex h-12 overflow-hidden rounded-full border border-white/10">
            {colors.map((color, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: color.hex_code,
                  width: `${100 / colors.length}%`,
                }}
                className="transition-all duration-300"
                title={color.hex_code.toUpperCase()}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
