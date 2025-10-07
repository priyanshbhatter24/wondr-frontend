"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import {
  Pencil2Icon,
  LightningBoltIcon,
  ImageIcon,
  MagnifyingGlassIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

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
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [internalActiveItem, setInternalActiveItem] = useState<string | null>(
    activeItem ?? null,
  );

  useEffect(() => {
    if (activeItem !== undefined) {
      setInternalActiveItem(activeItem ?? null);
    }
  }, [activeItem]);

  useEffect(() => {
    if (isSearching) {
      searchInputRef.current?.focus();
    }
  }, [isSearching]);

  const filteredGenerations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return generations;
    }

    return generations.filter((generation) =>
      generation.name.toLowerCase().includes(term),
    );
  }, [generations, searchTerm]);

  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress ??
    "Guest";

  const navItems = [
    {
      label: "Generate Post",
      href: "/generate-post",
      icon: Pencil2Icon,
    },
    {
      label: "Idea Hub",
      href: "/idea-hub",
      icon: LightningBoltIcon,
    },
    {
      label: "Gallery",
      href: "/gallery",
      icon: ImageIcon,
    },
  ];

  const resolvedActiveItem = activeItem ?? internalActiveItem ?? undefined;

  const handleGenerationClick = (id: string) => {
    setInternalActiveItem(id);
    onItemClick?.(id);
  };

  const toggleSearch = () => {
    setIsSearching((prev) => {
      const next = !prev;
      if (!next) {
        setSearchTerm("");
      }
      return next;
    });
  };

  return (
    <div className="w-64 bg-black text-white h-screen flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        {user ? (
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "w-8 h-8 rounded-full border border-white/10 overflow-hidden",
                userButtonTrigger:
                  "w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-white/40",
              },
            }}
          />
        ) : (
          <Link
            href="/sign-in"
            className="w-8 h-8 bg-white/10 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium hover:bg-white/15"
          >
            <span>{displayName.charAt(0).toUpperCase()}</span>
          </Link>
        )}
        {isSearching ? (
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-4 h-4 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search generations"
              className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        ) : (
          <span className="font-medium text-base truncate flex-1">{displayName}</span>
        )}
        <button
          type="button"
          onClick={toggleSearch}
          aria-label={isSearching ? "Close search" : "Search generations"}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 transition-colors"
        >
          {isSearching ? (
            <Cross2Icon className="w-4 h-4 text-white" />
          ) : (
            <MagnifyingGlassIcon className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="px-4 py-2 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/" && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 text-sm ${
                isActive
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/10 text-white/80"
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
          <ScrollArea.Viewport className="w-full h-full scrollbar-hide pr-1">
            <div className="space-y-2 pb-2">
              {filteredGenerations.length > 0 ? (
                filteredGenerations.map((gen) => (
                  <button
                    key={gen.id}
                    onClick={() => handleGenerationClick(gen.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md transition-colors text-xs hover:bg-white/10 ${
                      resolvedActiveItem === gen.id ? "bg-white/15" : "bg-white/5"
                    }`}
                  >
                    <div className="font-normal truncate text-white">{gen.name}</div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-xs text-white/60">
                  No generations match your search.
                </div>
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
      <div className="p-4 border-t border-black/50">
        <div className="bg-black rounded-lg p-3 border border-white/10 flex items-center gap-2 text-sm">
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
