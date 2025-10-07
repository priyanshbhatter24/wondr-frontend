"use client";

import Image from "next/image";
import {
  EyeOpenIcon,
  HeartIcon,
  Share1Icon,
} from "@radix-ui/react-icons";

interface RemixOption {
  text: string;
}

interface CompetitorCardProps {
  source: string;
  sourceUrl?: string;
  topic: string;
  description: string;
  remixOptions: RemixOption[];
  imageUrl: string;
  imageAlt: string;
  views: number;
  likes: number;
  shares: number;
  ctaLabel: string;
  onClick?: () => void;
}

export default function CompetitorCard({
  source,
  sourceUrl,
  topic,
  description,
  remixOptions,
  imageUrl,
  imageAlt,
  views,
  likes,
  shares,
  ctaLabel,
  onClick,
}: CompetitorCardProps) {
  const handleCardClick = () => {
    onClick?.();
  };

  const isClickable = Boolean(onClick);

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (!isClickable) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      className={`group flex min-h-[340px] min-w-[640px] max-w-[640px] flex-col border border-[#333333] bg-[#1b1b1b] text-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#f97316] rounded-none ${
        isClickable ? "cursor-pointer hover:bg-[#1f1f1f]" : ""
      }`}
    >
      <div className="flex flex-1 gap-6 p-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {source}
              </a>
            ) : (
              source
            )}
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold leading-tight">{topic}</h3>
            <p className="text-sm leading-relaxed text-gray-200">{description}</p>
          </div>
          <div className="mt-auto">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Remix
            </div>
            <div className="mt-2 space-y-1.5">
              {remixOptions.map((option, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-[2px] text-sm text-[#f97316]">•</span>
                  <span className="text-sm leading-snug text-gray-200">
                    {option.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative flex h-[260px] w-[240px] flex-shrink-0 items-center justify-center overflow-hidden bg-[#111111]">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 240px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#333333] bg-[#151515] px-6 py-4">
        <div className="flex gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <EyeOpenIcon className="h-4 w-4" />
            <span>{views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartIcon className="h-4 w-4" />
            <span>{likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Share1Icon className="h-4 w-4" />
            <span>{shares.toLocaleString()}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
