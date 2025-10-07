"use client";

import type { KeyboardEvent } from "react";
import Image from "next/image";
import {
  EyeOpenIcon,
  HeartIcon,
  Share1Icon,
} from "@radix-ui/react-icons";

interface RemixOption {
  text: string;
}

interface CompetitorMetrics {
  views: number;
  likes: number;
  shares: number;
}

interface HeroMedia {
  src: string;
  alt: string;
}

interface CompetitorCardProps {
  source: string;
  topic: string;
  description: string;
  remixOptions: RemixOption[];
  heroMedia: HeroMedia;
  metrics: CompetitorMetrics;
  ctaLabel: string;
  ctaHref?: string;
  onClick?: () => void;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", { notation: "standard" }).format(value);

export default function CompetitorCard({
  source,
  topic,
  description,
  remixOptions,
  heroMedia,
  metrics,
  ctaLabel,
  ctaHref,
  onClick,
}: CompetitorCardProps) {
  const content = (
    <div className="flex h-full w-full bg-[#1f1f1f] text-white transition-colors group-hover:bg-[#262626]">
      <div className="flex min-h-full flex-1 flex-col justify-between p-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
            {source}
          </div>
          <h3 className="mt-3 text-xl font-semibold leading-tight">{topic}</h3>
          <p className="mt-4 text-sm leading-relaxed text-gray-200">{description}</p>

          <div className="mt-6 space-y-2">
            {remixOptions.map((option, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-200">
                <span className="mt-1 text-base leading-none text-[#b8865b]">•</span>
                <span className="leading-snug">{option.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-[#2f2f2f] pt-4 text-sm text-gray-300">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <EyeOpenIcon className="h-4 w-4" />
                <span>{formatNumber(metrics.views)}</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartIcon className="h-4 w-4" />
                <span>{formatNumber(metrics.likes)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Share1Icon className="h-4 w-4" />
                <span>{formatNumber(metrics.shares)}</span>
              </div>
            </div>
            {ctaHref ? (
              <a
                href={ctaHref}
                rel="noreferrer noopener"
                onClick={(event) => event.stopPropagation()}
                className="bg-white px-4 py-2 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-gray-200"
              >
                {ctaLabel}
              </a>
            ) : (
              <span className="px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white">
                {ctaLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="relative min-h-[320px] w-[280px] flex-shrink-0 bg-[#111111]">
        <Image
          src={heroMedia.src}
          alt={heroMedia.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 280px"
        />
      </div>
    </div>
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`group min-w-[640px] max-w-[640px] overflow-hidden border border-[#2f2f2f] bg-transparent transition-colors ${
        onClick ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#b8865b] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] hover:bg-[#262626]" : ""
      } rounded-none`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      {content}
    </div>
  );
}
