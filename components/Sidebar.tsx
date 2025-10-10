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
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { SidebarSessionItem } from "@/types/image-generation";
import { formatRelativeTime } from "@/utils/date";

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

  const navButtonClasses = (active: boolean) =>
    `group flex items-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
      isOpen ? "gap-3 px-3 justify-start" : "justify-center px-2"
    } py-2 text-sm ${
      active
        ? "bg-[#1F1F1F] text-white hover:bg-[#323232]"
        : "text-white/80 hover:bg-[#3A3A3A] hover:text-white"
    }`;

  const sessionButtonClasses = (active: boolean) =>
    `w-full text-left rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
      isOpen ? "px-3 py-2.5" : "px-2 py-2"
    } ${
      active
        ? "bg-[#1F1F1F] text-white hover:bg-[#323232]"
        : "text-white/80 hover:bg-[#3A3A3A] hover:text-white"
    }`;

  return (
    <div className="w-full h-full flex flex-col bg-[#2A2A2A] text-white">
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
          className={`w-9 h-9 rounded-md bg-[#1F1F1F] flex items-center justify-center text-white transition-colors hover:bg-[#3A3A3A] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
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
            className="w-full bg-[#1F1F1F] border border-white/10 rounded-md py-2 px-3 text-xs text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          />
        </div>
      )}

      {/* Navigation Items */}
      <div className={`${isOpen ? "px-4" : "px-2"} py-2 space-y-1`}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={navButtonClasses(Boolean(active))}
              title={label}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isOpen && <span>{label}</span>}
            </Link>
          );
        })}
      </div>

      <Separator.Root className="bg-white/10 h-px my-2" />

      {/* Generations Section */}
      <div className={`${isOpen ? "px-4" : "px-2"} flex-1 min-h-0 w-full`}
      >
        {isOpen && (
          <div className="text-xs font-medium text-white/70 mb-3 px-3">
            Generations
          </div>
        )}
        <ScrollArea.Root className="w-full h-full overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="space-y-2">
              {filteredSessions.map((session) => {
                const active = activeSessionId === session.session_id;
                const sessionLabel = session.name?.trim() || "Session";
                const sessionInitial = sessionLabel.charAt(0).toUpperCase();
                return (
                  <button
                    key={session.session_id}
                    type="button"
                    onClick={() => onItemClick?.(session.session_id)}
                    title={session.full_prompt || sessionLabel}
                    className={sessionButtonClasses(active)}
                  >
                    {isOpen ? (
                      <>
                        <div className="font-normal truncate">{sessionLabel}</div>
                        <div className="text-white/50 text-xs mt-1">
                          {formatRelativeTime(session.created_at)}
                        </div>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-sm font-medium">
                          {sessionInitial}
                        </span>
                      </div>
                    )}
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
      {isOpen ? (
        <div className="p-4 border-t border-white/10 bg-[#262626]">
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
      ) : (
        <div className="p-3 border-t border-white/10 flex justify-center">
          <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center text-black font-semibold text-xs">
            W
          </div>
        </div>
      )}
    </div>
  );
}
