"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import {
  LightningBoltIcon,
  ImageIcon,
  GearIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { SidebarSessionItem } from "@/types/image-generation";
import { formatRelativeTime } from "@/utils/date";
import { usePathname } from "next/navigation";

interface SidebarProps {
  sessions: SidebarSessionItem[];
  activeSessionId?: string;
  onItemClick?: (sessionId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onItemClick,
  isOpen,
  onToggle,
}: SidebarProps) {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  const navItems = [
    {
      href: "/generate-post",
      label: "Generate Post",
      icon: ImageIcon,
    },
    {
      href: "/idea-hub",
      label: "Idea Hub",
      icon: LightningBoltIcon,
    },
    {
      href: "/icp-settings",
      label: "ICP Settings",
      icon: GearIcon,
    },
  ];

  const isNavActive = (href: string) => {
    if (!pathname) {
      return false;
    }

    if (href === "/generate-post") {
      return pathname.startsWith("/generate-post");
    }

    if (href === "/idea-hub") {
      return pathname.startsWith("/idea-hub");
    }

    if (href === "/icp-settings") {
      return pathname.startsWith("/icp-settings");
    }

    return pathname === href;
  };

  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress ??
    "Guest";

  const filteredSessions = useMemo(() => {
    if (!searchTerm) {
      return sessions;
    }

    return sessions.filter((session) =>
      session.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [sessions, searchTerm]);

  return (
    <div className="w-full bg-[#2A2A2A] text-white h-full flex flex-col">
      {/* Header */}
      <div
        className={`px-3 py-4 flex items-center ${
          isOpen ? "gap-3" : "justify-center"
        }`}
      >
        {isOpen && (
          <button
            type="button"
            onClick={() => {
              if (user) {
                openUserProfile?.();
              }
            }}
            className="w-9 h-9 bg-white/10 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50"
            disabled={!user}
          >
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={`${displayName}'s avatar`}
                width={36}
                height={36}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <span>{displayName.charAt(0).toUpperCase()}</span>
            )}
          </button>
        )}
        {isOpen && (
          <span className="font-medium text-base truncate">{displayName}</span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className={`w-9 h-9 rounded-md bg-[#1E1E1E] flex items-center justify-center text-white transition-colors hover:bg-[#3A3A3A] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
            isOpen ? "ml-auto" : ""
          }`}
          title={isOpen ? "Hide sidebar (⌘B)" : "Show sidebar (⌘B)"}
          aria-label={isOpen ? "Hide sidebar" : "Show sidebar"}
        >
          <HamburgerMenuIcon className="w-5 h-5" />
        </button>
      </div>

      {isOpen && (
        <div className="px-4 pb-3">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search sessions"
            className="w-full bg-[#1E1E1E] border border-white/10 rounded-md py-2 px-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          />
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 min-h-0 flex flex-col">
        {isOpen ? (
          <>
            <div className="px-4 py-2 space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = isNavActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                      active ? "bg-[#1E1E1E]" : "hover:bg-[#3A3A3A]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>

            <Separator.Root className="bg-white/10 h-px my-2" />

            {/* Generations Section */}
            <div className="px-4 flex-1 min-h-0">
              <div className="text-xs font-medium text-white/70 mb-3 px-3">
                Generations
              </div>
              <ScrollArea.Root className="w-full h-full overflow-hidden">
                <ScrollArea.Viewport className="w-full h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  <div className="space-y-2">
                    {filteredSessions.map((session) => {
                      const active = activeSessionId === session.session_id;
                      return (
                        <button
                          key={session.session_id}
                          type="button"
                          onClick={() => onItemClick?.(session.session_id)}
                          title={session.full_prompt}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-xs text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                            active ? "bg-[#1E1E1E]" : "hover:bg-[#3A3A3A]"
                          }`}
                        >
                          <div className="font-normal truncate text-white">
                            {session.name}
                          </div>
                          <div className="text-white/50 text-xs mt-1">
                            {formatRelativeTime(session.created_at)}
                          </div>
                        </button>
                      );
                    })}
                    {filteredSessions.length === 0 && (
                      <div className="text-white/50 text-xs px-3 py-2">
                        No sessions found.
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
            <div className="p-4 border-t border-white/10 bg-[#242424]">
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
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center py-6 gap-6">
            <div className="flex flex-col items-center gap-4">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = isNavActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                      active ? "bg-[#1E1E1E]" : "hover:bg-[#3A3A3A]"
                    }`}
                    title={label}
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
