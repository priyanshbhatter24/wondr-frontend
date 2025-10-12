"use client";

import { formatRelativeTime } from "@/utils/date";

interface RemixOption {
  text: string;
}

interface InsightCardProps {
  id?: string;
  source: string;
  topic: string;
  description: string;
  remixOptions: RemixOption[];
  onClick: () => void;
  createdAt?: string;
}

export default function InsightCard({
  source,
  topic,
  description,
  remixOptions,
  onClick,
  createdAt,
}: InsightCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#2A2A2A] rounded-lg text-white p-6 min-w-[400px] max-w-[400px] cursor-pointer transition-all duration-200 hover:brightness-110 flex flex-col gap-3"
    >
      {/* Source and Timestamp */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold tracking-wider uppercase">
          {source}
        </div>
        {createdAt && (
          <div className="text-xs text-white/60">
            {formatRelativeTime(createdAt)}
          </div>
        )}
      </div>

      {/* Topic */}
      <h3 className="text-lg font-bold leading-tight">{topic}</h3>

      {/* Description */}
      <p className="text-sm leading-relaxed opacity-95">{description}</p>

      {/* Remix Section */}
      <div className="mt-2">
        <div className="text-xs font-semibold tracking-wider uppercase mb-2">
          REMIX
        </div>
        <div className="space-y-1.5">
          {remixOptions.slice(0, 4).map((option, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-sm mt-0.5 flex-shrink-0">•</span>
              <span className="text-sm leading-snug">{option.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
