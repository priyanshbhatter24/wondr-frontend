"use client";

import Image from "next/image";
import {
  ChatBubbleIcon,
  EyeOpenIcon,
  HeartIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import { MouseEvent } from "react";

interface RemixOption {
  text: string;
}

export type CompetitorMetricType = "views" | "likes" | "shares" | "comments";

export interface CompetitorMetric {
  type: CompetitorMetricType;
  label: string;
  value: number;
}

export interface CompetitorHero {
  imageUrl: string;
  imageAlt: string;
  source: string;
  sourceUrl?: string;
}

interface CompetitorCardProps {
  source: string;
  topic: string;
  description: string;
  remixOptions: RemixOption[];
  hero: CompetitorHero;
  metrics: CompetitorMetric[];
  ctaLabel: string;
  ctaHref?: string;
  onClick: () => void;
}

const metricIconMap: Record<CompetitorMetricType, JSX.Element> = {
  views: <EyeOpenIcon className="h-4 w-4" />,
  likes: <HeartIcon className="h-4 w-4" />,
  shares: <Share1Icon className="h-4 w-4" />,
  comments: <ChatBubbleIcon className="h-4 w-4" />,
};

export default function CompetitorCard({
  source,
  topic,
  description,
  remixOptions,
  hero,
  metrics,
  ctaLabel,
  ctaHref,
  onClick,
}: CompetitorCardProps) {
  const handleCtaClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      onClick={onClick}
      className="flex min-w-[640px] max-w-[640px] cursor-pointer flex-col overflow-hidden border border-[#3A3A3A] bg-[#1F1F1F] text-white transition-colors hover:border-[#5A5A5A]"
    >
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col gap-5 bg-[#72573C] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {source}
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold leading-snug text-white">{topic}</h3>
            <p className="text-sm leading-relaxed text-white/85">{description}</p>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Remix
            </div>
            <div className="space-y-1.5">
              {remixOptions.map((option, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-white/90">
                  <span className="mt-0.5 flex-shrink-0">•</span>
                  <span className="leading-snug">{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex w-[260px] flex-none items-stretch bg-[#101010]">
          {hero.imageUrl ? (
            <Image
              src={hero.imageUrl}
              alt={hero.imageAlt}
              fill
              sizes="260px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0F0F0F] text-sm text-white/60">
              No media
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-xs">
            <div className="font-semibold uppercase tracking-[0.25em] text-white/80">{hero.source}</div>
            {hero.sourceUrl && (
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/60">{hero.sourceUrl}</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#3A3A3A] bg-[#141414] px-6 py-4">
        <div className="flex flex-wrap items-center gap-5">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex items-center gap-2 text-sm text-white/80">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                {metricIconMap[metric.type]}
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-xs uppercase tracking-widest text-white/50">{metric.label}</span>
                <span className="text-sm font-semibold text-white">
                  {new Intl.NumberFormat("en-US").format(metric.value)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {ctaHref ? (
          <a
            href={ctaHref}
            onClick={handleCtaClick}
            className="rounded-none border border-white/30 px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:text-white"
          >
            {ctaLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={handleCtaClick}
            className="rounded-none border border-white/30 px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:text-white"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
