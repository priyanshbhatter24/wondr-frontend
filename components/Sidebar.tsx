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

  const isRouteActive = (href: string) => {
    if (!pathname) {
      return false;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
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

  const navItemClassName = (active: boolean) => {
    const base = isOpen
      ? "w-full text-left px-3 py-2 gap-3 text-sm font-medium"
      : "w-10 h-10 justify-center mx-auto";

    return `flex items-center rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
      active ? "bg-white/7 text-white" : "text-white/80 hover:bg-white/10"
    } ${base}`;
  };

  const sessionItemClassName = (sessionId: string) => {
    const isActive = activeSessionId === sessionId;

    return `w-full text-left px-3 py-2 rounded-md transition-colors text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
      isActive ? "bg-white/7 text-white" : "text-white/80 hover:bg-white/10"
    }`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#2A2A2A] text-white">
      <div
        className={`px-3 py-4 flex items-center ${
          isOpen ? "gap-3" : "justify-start"
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
          className={`w-9 h-9 rounded-md flex items-center justify-center text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
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
            className="w-full bg-white/10 border border-white/10 rounded-md py-2 px-3 text-xs text-white placeholder:text-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0">
        <div
          className={
            isOpen
              ? "px-1 py-2 space-y-0 text-sm"
              : "px-2 py-4 flex flex-col items-center gap-3"
          }
        >
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isRouteActive(href);

            return (
              <Link
                key={href}
                href={href}
                className={navItemClassName(active)}
                aria-label={isOpen ? undefined : label}
              >
                <Icon className={isOpen ? "w-4 h-4" : "w-5 h-5"} />
                {isOpen && <span>{label}</span>}
              </Link>
            );
          })}
        </div>

        {isOpen && (
          <>

            <div className="px-1 flex-1 min-h-0 pb-4 text-sm">
              <div className="text-sm font-light text-white/70 mb-2 mt-5 px-3">
                Generations
              </div>
              <ScrollArea.Root className="w-full h-full overflow-hidden">
                <ScrollArea.Viewport className="w-full h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  <div className="space-y-0">
                    {filteredSessions.map((session) => {
                      const isActive = activeSessionId === session.session_id;

                      return (
                        <button
                          key={session.session_id}
                          type="button"
                          onClick={() => onItemClick?.(session.session_id)}
                          title={session.full_prompt}
                          className={sessionItemClassName(session.session_id)}
                        >
                          <div
                            className={`font-medium truncate text-sm ${
                              isActive ? "text-white" : "text-white/90"
                            }`}
                          >
                            {session.name}
                          </div>
                        </button>
                      );
                    })}
                    {filteredSessions.length === 0 && (
                      <div className="text-white/60 text-xs px-3 py-2">
                        No sessions found.
                      </div>
                    )}
                  </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                  className="flex select-none touch-none p-0 bg-transparent transition-colors duration-150 ease-out data-[orientation=vertical]:w-2"
                  orientation="vertical"
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                >
                  <ScrollArea.Thumb className="flex-1 bg-white/20 rounded-full" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </div>
          </>
        )}
      </div>

      {isOpen && (
        <div className="p-4 border-t border-white/10 bg-[#232323]">
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
      )}
    </div>
  );
}
