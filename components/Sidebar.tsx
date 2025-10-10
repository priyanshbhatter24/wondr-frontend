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

  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress ??
    "Guest";

  const filteredSessions = sessions;

  return (
    <div className="w-full bg-black text-white h-full flex flex-col">
      {/* Header */}
      <div
        className={`p-4 flex ${
          isOpen ? "items-center gap-3" : "items-center justify-center"
        }`}
      >
        {isOpen && (
          <>
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
          </>
        )}
        <button
          type="button"
          onClick={onToggle}
          className={`ml-auto flex items-center justify-center rounded-md bg-black/60 text-white transition-colors hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
            isOpen ? "w-7 h-7" : "w-10 h-10"
          }`}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isOpen ? "Hide sidebar (⌘B)" : "Show sidebar (⌘B)"}
        >
          <HamburgerMenuIcon className={isOpen ? "w-4 h-4" : "w-5 h-5"} />
        </button>
      </div>

      {isOpen && (
        <>
          {/* Navigation Items */}
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/generate-post"
              className="w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 text-sm hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <ImageIcon className="w-4 h-4" />
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
                  {filteredSessions.map((session) => (
                    <button
                      key={session.session_id}
                      type="button"
                      onClick={() => onItemClick?.(session.session_id)}
                      title={session.full_prompt}
                      className={`w-full text-left px-3 py-2.5 rounded-md transition-colors text-xs hover:bg-black/40 ${
                        activeSessionId === session.session_id ? "bg-black/60" : ""
                      }`}
                    >
                      <div className="font-normal truncate text-white">{session.name}</div>
                      <div className="text-white/50 text-xs mt-1">
                        {formatRelativeTime(session.created_at)}
                      </div>
                    </button>
                  ))}
                  {filteredSessions.length === 0 && (
                    <div className="text-white/50 text-xs px-3 py-2">No sessions found.</div>
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
        </>
      )}
    </div>
  );
}
