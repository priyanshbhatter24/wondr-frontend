"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import { Pencil2Icon, LightningBoltIcon, ImageIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useUser } from "@clerk/nextjs";

interface Generation {
  id: string;
  name: string;
  timestamp: string;
}

interface SidebarProps {
  generations: Generation[];
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export default function Sidebar({
  generations,
  activeItem,
  onItemClick,
}: SidebarProps) {
  const { user } = useUser();

  const displayName = user?.fullName || user?.firstName || user?.username || "Guest";
  const profileImage = user?.imageUrl;
  const initials = (user?.firstName?.[0] || user?.fullName?.[0] || "").toUpperCase();

  return (
    <div className="w-64 bg-black text-white h-screen flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
          {profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profileImage} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-white">{initials || "U"}</span>
          )}
        </div>
        <span className="font-medium text-base truncate">{displayName}</span>
        <MagnifyingGlassIcon className="w-4 h-4 text-white ml-auto" />
      </div>

      {/* Navigation Items */}
      <div className="px-4 py-2 space-y-1">
        <button className="w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 text-sm hover:bg-black/40">
          <Pencil2Icon className="w-4 h-4" />
          <span>Generate Post</span>
        </button>
        <button className="w-full text-left px-3 py-2 rounded-md bg-black/60 transition-colors flex items-center gap-3 text-sm">
          <LightningBoltIcon className="w-4 h-4" />
          <span>Idea Hub</span>
        </button>
        <button className="w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 text-sm hover:bg-black/40">
          <ImageIcon className="w-4 h-4" />
          <span>Gallery</span>
        </button>
      </div>

      <Separator.Root className="bg-black/50 h-px my-2" />

      {/* Generations Section */}
      <div className="px-4 flex-1 min-h-0">
        <div className="text-xs font-medium text-white/70 mb-3 px-3">
          Generations
        </div>
        <ScrollArea.Root className="w-full h-full overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full">
            <div className="space-y-2">
              {generations.map((gen) => (
                <button
                  key={gen.id}
                  onClick={() => onItemClick?.(gen.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-xs hover:bg-black/40 ${
                    activeItem === gen.id ? "bg-black/60" : ""
                  }`}
                >
                  <div className="font-normal truncate text-white">{gen.name}</div>
                </button>
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-150 ease-out data-[orientation=vertical]:w-2"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-white/20 rounded-full" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>

      {/* View Plans Footer */}
      <div className="p-4 border-t border-black/50">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black text-xs font-bold">W</span>
          </div>
          <div>
            <div className="text-white font-medium">View plans</div>
            <div className="text-white/60 text-xs">Unlimited access</div>
          </div>
        </div>
      </div>
    </div>
  );
}
