"use client";

import { useState } from "react";

interface ModelSelectorProps {
  selectedModel: "flux-pro" | "nano-banana";
  onModelChange: (model: "flux-pro" | "nano-banana") => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-[#1a1a1a] rounded-lg border border-[#262626]">
      <span className="text-sm text-white/60 font-medium">Model:</span>
      <div className="flex gap-1 bg-[#000000] rounded-md p-1">
        <button
          onClick={() => onModelChange("flux-pro")}
          className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
            selectedModel === "flux-pro"
              ? "bg-[#C1D75B] text-[#000000]"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          Flux Pro
        </button>
        <button
          onClick={() => onModelChange("nano-banana")}
          className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
            selectedModel === "nano-banana"
              ? "bg-[#C1D75B] text-[#000000]"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          Nano Banana
        </button>
      </div>
    </div>
  );
}
