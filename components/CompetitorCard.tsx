"use client";

import Image from "next/image";
import { EyeOpenIcon, HeartIcon, Share2Icon } from "@radix-ui/react-icons";

interface RemixOption {
  text: string;
}

interface Metrics {
  views: number;
  likes: number;
  shares: number;
}

interface CompetitorCardProps {
  source: string;
  topic: string;
  description: string;
  remixOptions: RemixOption[];
  heroImageUrl: string;
  heroImageAlt: string;
  heroImageSourceUrl: string;
  metrics: Metrics;
  ctaLabel: string;
  ctaHref: string;
  onClick?: () => void;
}

const numberFormatter = new Intl.NumberFormat("en-US");

const formatMetric = (value: number) => numberFormatter.format(value);

export default function CompetitorCard({
  source,
  topic,
  description,
  remixOptions,
  heroImageUrl,
  heroImageAlt,
  heroImageSourceUrl,
  metrics,
  ctaLabel,
  ctaHref,
  onClick,
}: CompetitorCardProps) {
  const clickable = Boolean(onClick);
  const containerClasses = [
    "flex min-w-[640px] max-w-[640px] flex-col overflow-hidden border border-[#3A3A3A] bg-[#1F1F1F] text-white transition-colors",
  ];

  if (clickable) {
    containerClasses.push("cursor-pointer hover:bg-[#232323]");
  }

  return (
    <div
      onClick={onClick}
      className={containerClasses.join(" ")}
    >
      <div className="flex flex-1">
        <div className="flex w-1/2 flex-col gap-5 p-6">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">
              {source}
            </div>
            <h3 className="text-xl font-semibold leading-snug text-white">{topic}</h3>
            <p className="text-sm leading-relaxed text-gray-200">{description}</p>
          </div>

          {remixOptions.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Remix
              </div>
              <div className="space-y-1.5 text-sm text-gray-200">
                {remixOptions.map((option, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="mt-[2px] flex-shrink-0 text-base">•</span>
                    <span className="leading-snug">{option.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative w-1/2 bg-[#F5F5F5]">
          <Image
            src={heroImageUrl}
            alt={heroImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
          />
          <a
            href={heroImageSourceUrl}
            onClick={(event) => event.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white"
          >
            View Source
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#3A3A3A] px-6 py-4">
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <EyeOpenIcon className="h-4 w-4" />
            <span>{formatMetric(metrics.views)}</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartIcon className="h-4 w-4" />
            <span>{formatMetric(metrics.likes)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2Icon className="h-4 w-4" />
            <span>{formatMetric(metrics.shares)}</span>
          </div>
        </div>
        <a
          href={ctaHref}
          onClick={(event) => event.stopPropagation()}
          className="rounded-full border border-white px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
