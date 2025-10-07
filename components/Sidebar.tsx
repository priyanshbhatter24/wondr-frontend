"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import { Pencil2Icon, LightningBoltIcon, ImageIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

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
  return (
    <div className="w-64 bg-[#262626] text-white h-screen flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm">
          G
        </div>
        <span className="font-medium text-base">Google</span>
        <MagnifyingGlassIcon className="w-4 h-4 text-white ml-auto" />
      </div>

      {/* Navigation Items */}
      <div className="px-4 py-2 space-y-1">
        <button className="w-full text-left px-3 py-2 rounded-md hover:bg-[#333333] transition-colors flex items-center gap-3 text-sm">
          <Pencil2Icon className="w-4 h-4" />
          <span>Generate Post</span>
        </button>
        <button className="w-full text-left px-3 py-2 rounded-md bg-[#333333] transition-colors flex items-center gap-3 text-sm">
          <LightningBoltIcon className="w-4 h-4" />
          <span>Idea Hub</span>
        </button>
        <button className="w-full text-left px-3 py-2 rounded-md hover:bg-[#333333] transition-colors flex items-center gap-3 text-sm">
          <ImageIcon className="w-4 h-4" />
          <span>Gallery</span>
        </button>
      </div>

      <Separator.Root className="bg-[#333333] h-px my-2" />

      {/* Generations Section */}
      <div className="px-4 flex-1 min-h-0">
        <div className="text-xs font-medium text-gray-400 mb-3 px-3">
          Generations
        </div>
        <ScrollArea.Root className="w-full h-full overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full">
            <div className="space-y-0.5">
              {generations.map((gen) => (
                <button
                  key={gen.id}
                  onClick={() => onItemClick?.(gen.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md hover:bg-[#333333] transition-colors text-xs ${
                    activeItem === gen.id ? "bg-[#333333]" : ""
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
            <ScrollArea.Thumb className="flex-1 bg-gray-600 rounded-full" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>

      {/* View Plans Footer */}
      <div className="p-4 border-t border-[#333333]">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black text-xs font-bold">W</span>
          </div>
          <div>
            <div className="text-white font-medium">View plans</div>
            <div className="text-gray-400 text-xs">Unlimited access</div>
          </div>
        </div>
      </div>
    </div>
  );
}
