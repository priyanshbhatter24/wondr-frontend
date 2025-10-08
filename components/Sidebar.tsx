"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import {
  Pencil2Icon,
  LightningBoltIcon,
  ImageIcon,
  MagnifyingGlassIcon,
  Cross2Icon,
  GearIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

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
  const { openUserProfile } = useClerk();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress ??
    "Guest";

  const filteredGenerations = useMemo(() => {
    if (!searchTerm) {
      return generations;
    }

    return generations.filter((gen) =>
      gen.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [generations, searchTerm]);

  const toggleSearch = () => {
    setIsSearching((prev) => {
      const next = !prev;

      if (!prev) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 0);
      } else {
        setSearchTerm("");
      }

      return next;
    });
  };

  return (
    <div className="w-64 bg-black text-white h-screen flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (user) {
              openUserProfile?.();
            }
          }}
          className="w-8 h-8 bg-white/10 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50"
          disabled={!user}
        >
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={`${displayName}'s avatar`}
              width={32}
              height={32}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <span>{displayName.charAt(0).toUpperCase()}</span>
          )}
        </button>
        <span className="font-medium text-base truncate">{displayName}</span>
        <div className="ml-auto flex items-center gap-2">
          {isSearching && (
            <div className="relative">
              <input
                ref={searchInputRef}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search"
                className="bg-black/60 border border-white/20 rounded-md py-1 pl-7 pr-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              />
              <MagnifyingGlassIcon className="w-3.5 h-3.5 text-white/50 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>
          )}
          <button
            type="button"
            onClick={toggleSearch}
            className="w-7 h-7 rounded-md bg-black/60 flex items-center justify-center text-white transition-colors hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label={isSearching ? "Close search" : "Open search"}
          >
            {isSearching ? (
              <Cross2Icon className="w-3.5 h-3.5" />
            ) : (
              <MagnifyingGlassIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="px-4 py-2 space-y-1">
        <Link
          href="/dashboard"
          className="w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 text-sm hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <Pencil2Icon className="w-4 h-4" />
          <span>Generate Post</span>
        </Link>
        <Link
          href="/idea-hub"
          className="w-full text-left px-3 py-2 rounded-md bg-black/60 transition-colors flex items-center gap-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <LightningBoltIcon className="w-4 h-4" />
          <span>Idea Hub</span>
        </Link>
        <Link
          href="/icp-settings"
          className="w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 text-sm hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <GearIcon className="w-4 h-4" />
          <span>ICP Settings</span>
        </Link>
        <Link
          href="/"
          className="w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 text-sm hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Gallery</span>
        </Link>
      </div>

      <Separator.Root className="bg-black/50 h-px my-2" />

      {/* Generations Section */}
      <div className="px-4 flex-1 min-h-0">
        <div className="text-xs font-medium text-white/70 mb-3 px-3">
          Generations
        </div>
        <ScrollArea.Root className="w-full h-full overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="space-y-2">
              {filteredGenerations.map((gen) => (
                <button
                  key={gen.id}
                  type="button"
                  onClick={() => onItemClick?.(gen.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-colors text-xs hover:bg-black/40 ${
                    activeItem === gen.id ? "bg-black/60" : ""
                  }`}
                >
                  <div className="font-normal truncate text-white">{gen.name}</div>
                  <div className="text-white/50 text-xs mt-1">{gen.timestamp}</div>
                </button>
              ))}
              {filteredGenerations.length === 0 && (
                <div className="text-white/50 text-xs px-3 py-2">No generations found.</div>
              )}
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
      <div className="p-4 border-t border-black/50 bg-black">
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
