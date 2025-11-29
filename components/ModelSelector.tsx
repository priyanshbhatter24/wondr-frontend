"use client";

import { InfoCircledIcon } from "@radix-ui/react-icons";

const MODEL_OPTIONS = [
  {
    value: "nano-banana-pro" as const,
    label: "Nano Banana Pro",
    helper: "Sharper, faster results",
  },
  {
    value: "nano-banana" as const,
    label: "Nano Banana",
    helper: "Standard quality",
  },
];

interface ModelSelectorProps {
  value: "nano-banana" | "nano-banana-pro";
  onChange: (value: "nano-banana" | "nano-banana-pro") => void;
  disabled?: boolean;
}

export function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-white/70 text-sm">
        <span className="font-medium text-white">Model</span>
        <InfoCircledIcon className="w-4 h-4" />
      </div>
      <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
        {MODEL_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
              value === option.value
                ? "bg-[#C5D86D] text-black border-[#C5D86D]"
                : "bg-transparent text-white/80 border-transparent hover:bg-white/10"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            aria-pressed={value === option.value}
          >
            <div className="flex flex-col items-start gap-0.5 text-left">
              <span>{option.label}</span>
              <span className="text-xs text-white/70">{option.helper}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
