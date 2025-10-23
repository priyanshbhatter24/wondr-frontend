"use client";

import { Cross2Icon, ImageIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { BrandAssetsData } from '@/types/brand-assets';

interface BrandAssetsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetSelect: (assetUrl: string, label: string) => void;
  brandAssets: BrandAssetsData;
}

/**
 * Sidebar component for displaying and selecting brand assets
 *
 * Shows company logo (if exists) first, followed by all brand assets.
 * Clicking an asset triggers the onAssetSelect callback to add it to the canvas.
 */
export function BrandAssetsSidebar({
  isOpen,
  onClose,
  onAssetSelect,
  brandAssets
}: BrandAssetsSidebarProps) {
  if (!isOpen) return null;

  // Combine logo and assets, with logo first
  const allAssets = [
    ...(brandAssets.logo ? [brandAssets.logo] : []),
    ...brandAssets.assets.map(a => ({ url: a.s3_url, label: a.label }))
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <div className="fixed right-0 top-0 h-full w-[320px] sm:w-[360px] bg-[#2A2A2A] border-l border-white/10 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#262626]/50">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C5D86D]" />
            <h3 className="text-lg font-semibold text-white">Brand Assets</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close sidebar"
          >
            <Cross2Icon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Asset count */}
        <div className="px-4 py-3 text-sm text-white/60 bg-[#262626]/30">
          {allAssets.length} {allAssets.length === 1 ? 'asset' : 'assets'} available
        </div>

        {/* Assets grid - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {allAssets.map((asset, index) => {
              const isLogo = index === 0 && brandAssets.logo;
              return (
                <button
                  key={asset.url}
                  onClick={() => onAssetSelect(asset.url, asset.label)}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#1A1A1A] hover:border-[#C5D86D] hover:shadow-lg transition-all"
                  aria-label={`Add ${asset.label} to canvas`}
                >
                  {/* Asset image */}
                  <Image
                    src={asset.url}
                    alt={asset.label}
                    fill
                    sizes="150px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />

                  {/* Logo badge */}
                  {isLogo && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#C5D86D] text-black text-xs font-bold rounded shadow-lg">
                      LOGO
                    </div>
                  )}

                  {/* Label overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 pt-6">
                    <p className="text-xs text-white font-medium truncate">{asset.label}</p>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-[#C5D86D]/0 group-hover:bg-[#C5D86D]/10 transition-colors pointer-events-none" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-4 py-3 text-xs text-white/40 border-t border-white/5 bg-[#262626]/30">
          Click an asset to add it to your image
        </div>
      </div>
    </>
  );
}
