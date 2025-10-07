"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";

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
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-bold text-xl">G</span>
          </div>
          <span className="font-semibold text-lg">Google</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="p-4 space-y-2">
        <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-3">
          <span className="text-xl">✏️</span>
          <span>Generate Post</span>
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-800 transition-colors flex items-center gap-3">
          <span className="text-xl">💡</span>
          <span>Idea Hub</span>
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-3">
          <span className="text-xl">🖼️</span>
          <span>Gallery</span>
        </button>
      </div>

      <Separator.Root className="bg-gray-700 h-px" />

      {/* Generations Section */}
      <div className="p-4 flex-1 min-h-0">
        <div className="text-xs font-semibold text-gray-400 uppercase mb-3 px-4">
          Generations
        </div>
        <ScrollArea.Root className="w-full h-full overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full">
            <div className="space-y-1">
              {generations.map((gen) => (
                <button
                  key={gen.id}
                  onClick={() => onItemClick?.(gen.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm ${
                    activeItem === gen.id ? "bg-gray-800" : ""
                  }`}
                >
                  <div className="font-medium truncate">{gen.name}</div>
                  <div className="text-xs text-gray-500">{gen.timestamp}</div>
                </button>
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-gray-800 transition-colors duration-150 ease-out hover:bg-gray-700 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-gray-600 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner className="bg-gray-800" />
        </ScrollArea.Root>
      </div>
    </div>
  );
}
