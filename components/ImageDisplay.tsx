"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { ImageGeneration } from "@/types/image-generation";

interface ImageDisplayProps {
  generations: ImageGeneration[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function ImageDisplay({ generations, currentIndex, onNavigate }: ImageDisplayProps) {
  const currentGeneration = generations[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < generations.length - 1;

  if (!currentGeneration) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#000000] text-white/40">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No image generated yet</p>
          <p className="text-sm">Enter a prompt to generate your first image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-[#000000] flex flex-col">
      {/* Header with version info */}
      <div className="flex items-center justify-between p-4 border-b border-[#262626]">
        <div className="text-white/60 text-sm">
          <span className="font-medium">Version {currentGeneration.version_number}</span>
          <span className="mx-2">•</span>
          <span>{currentGeneration.model_used}</span>
        </div>
        <div className="text-white/40 text-xs">
          {currentIndex + 1} / {generations.length}
        </div>
      </div>

      {/* Image container */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        <div className="relative max-w-full max-h-full">
          <Image
            src={currentGeneration.s3_url}
            alt={currentGeneration.prompt}
            width={1024}
            height={1024}
            className="max-w-full max-h-full object-contain rounded-lg"
            priority
          />
        </div>

        {/* Navigation arrows */}
        {hasPrevious && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#262626] hover:bg-[#C1D75B] text-white hover:text-[#000000] rounded-full flex items-center justify-center transition-all"
            aria-label="Previous version"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        )}

        {hasNext && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#262626] hover:bg-[#C1D75B] text-white hover:text-[#000000] rounded-full flex items-center justify-center transition-all"
            aria-label="Next version"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Version timeline */}
      {generations.length > 1 && (
        <div className="p-4 border-t border-[#262626]">
          <div className="flex gap-2 overflow-x-auto">
            {generations.map((gen, index) => (
              <button
                key={gen.generation_id}
                onClick={() => onNavigate(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-[#C1D75B]"
                    : "border-transparent hover:border-white/20"
                }`}
                aria-label={`Go to version ${gen.version_number}`}
              >
                <Image
                  src={gen.s3_url}
                  alt={`Version ${gen.version_number}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-0.5">
                  v{gen.version_number}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
