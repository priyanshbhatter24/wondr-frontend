"use client";

import { Cross2Icon } from "@radix-ui/react-icons";

interface ReadyBannerProps {
  onDismiss: () => void;
}

export function ReadyBanner({ onDismiss }: ReadyBannerProps) {
  return (
    <div className="bg-[#C1D75B]/10 border border-[#C1D75B]/30 rounded-xl p-4 mb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm text-white font-medium">
            Ready to proceed to generate? Toggle to Generate Mode when ready!
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <Cross2Icon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
