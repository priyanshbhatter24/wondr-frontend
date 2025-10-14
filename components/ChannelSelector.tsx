"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface ChannelSelectorProps {
  channel: "instagram" | "linkedin" | "x";
  onChannelChange: (channel: "instagram" | "linkedin" | "x") => void;
  disabled?: boolean;
}

const CHANNEL_OPTIONS = [
  {
    value: "instagram" as const,
    label: "Instagram",
    aspectRatios: ["1:1", "4:5", "16:9"],
  },
  {
    value: "linkedin" as const,
    label: "LinkedIn",
    aspectRatios: ["1:1", "4:5"],
  },
  {
    value: "x" as const,
    label: "X",
    aspectRatios: ["16:9", "1:1"],
  },
];

export function ChannelSelector({
  channel,
  onChannelChange,
  disabled = false,
}: ChannelSelectorProps) {
  const selectedOption = CHANNEL_OPTIONS.find((opt) => opt.value === channel);

  return (
    <Select.Root
      value={channel}
      onValueChange={(value) => onChannelChange(value as "instagram" | "linkedin" | "x")}
      disabled={disabled}
    >
      <Select.Trigger
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#252525] rounded-full text-sm font-medium text-white hover:bg-[#2A2A2A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Select channel"
      >
        <Select.Value>
          <span className="flex items-center gap-2">
            <span>{selectedOption?.label}</span>
            <span className="text-xs text-white/40">
              ({selectedOption?.aspectRatios[0]})
            </span>
          </span>
        </Select.Value>
        <Select.Icon>
          <ChevronDownIcon className="w-4 h-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="overflow-hidden bg-[#252525] rounded-xl border border-white/10 shadow-xl"
          position="popper"
          sideOffset={5}
        >
          <Select.Viewport className="p-1">
            {CHANNEL_OPTIONS.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="relative flex items-center px-4 py-3 text-sm text-white rounded-lg outline-none cursor-pointer hover:bg-white/10 focus:bg-white/10 data-[state=checked]:bg-white/15"
              >
                <Select.ItemText>
                  <div className="flex flex-row gap-1">
                    <span className="font-medium">{option.label}</span>
                    <span className="font-medium text-white/40">
                      {option.aspectRatios.join(", ")}
                    </span>
                  </div>
                </Select.ItemText>
                {/* <Select.ItemIndicator className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" /> */}
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
