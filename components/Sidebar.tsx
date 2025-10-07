"use client";

import { useMemo, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import {
  Pencil2Icon,
  LightningBoltIcon,
  ImageIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress ??
    "Guest";

  const filteredGenerations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return generations;
    }

    return generations.filter((generation) =>
      generation.name.toLowerCase().includes(term)
    );
  }, [generations, searchTerm]);

  const navItems = [
    {
      href: "/generate-post",
      label: "Generate Post",
      icon: Pencil2Icon,
    },
    {
      href: "/idea-hub",
      label: "Idea Hub",
      icon: LightningBoltIcon,
    },
    {
      href: "/gallery",
      label: "Gallery",
      icon: ImageIcon,
    },
  ];

  return (
    <div className="w-64 bg-black text-white h-screen flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openUserProfile?.()}
            className="w-8 h-8 bg-white/10 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Open profile"
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
          <button
            type="button"
            onClick={() => searchInputRef.current?.focus()}
            className="ml-auto w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Search generations"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>
        </div>
        <label className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-xs text-white/70 focus-within:ring-2 focus-within:ring-white/40">
          <span className="w-6 h-6 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={`${displayName}'s avatar`}
                width={24}
                height={24}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-[0.6rem] font-medium text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </span>
          <input
            ref={searchInputRef}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={displayName}
            className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none"
            aria-label="Search generations"
          />
        </label>
      </div>

      {/* Navigation Items */}
      <div className="px-4 py-2 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname?.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`w-full flex items-center gap-3 text-sm px-3 py-2 rounded-md transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <Separator.Root className="bg-black/50 h-px my-2" />

      {/* Generations Section */}
      <div className="px-4 flex-1 min-h-0">
        <div className="text-xs font-medium text-white/70 mb-3 px-3">
          Generations
        </div>
        <ScrollArea.Root className="w-full h-full overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full pr-1 scrollbar-hide">
            <div className="space-y-2">
              {filteredGenerations.length === 0 ? (
                <div className="px-3 py-2 text-xs text-white/50">
                  No generations match “{searchTerm}”.
                </div>
              ) : (
                filteredGenerations.map((gen) => (
                  <button
                    key={gen.id}
                    onClick={() => onItemClick?.(gen.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md transition-colors text-xs hover:bg-black/40 ${
                      activeItem === gen.id ? "bg-black/60" : ""
                    }`}
                  >
                    <div className="font-normal truncate text-white">{gen.name}</div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-transparent data-[orientation=vertical]:w-2"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-white/20 rounded-full" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>

      {/* View Plans Footer */}
      <div className="p-4 border-t border-black/50">
        <div className="flex items-center gap-2 text-sm rounded-lg bg-black px-3 py-2">
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
