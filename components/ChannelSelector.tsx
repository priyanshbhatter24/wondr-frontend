"use client";

import { ChangeEvent, useId } from "react";
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
  const selectId = useId();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChannelChange(event.target.value as "instagram" | "linkedin" | "x");
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <label htmlFor={selectId} className="sr-only">
        Select channel
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={channel}
          onChange={handleChange}
          disabled={disabled}
          className="appearance-none inline-flex items-center gap-2 pl-4 pr-10 py-2 bg-[#252525] rounded-full text-sm font-medium text-white hover:bg-[#2A2A2A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {CHANNEL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} ({option.aspectRatios.join(", ")})
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
      </div>
    </div>
  );
}
