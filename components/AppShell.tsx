"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { SidebarSessionItem } from "@/types/image-generation";

interface AppShellProps {
  children: React.ReactNode;
  sessions: SidebarSessionItem[];
  activeSessionId?: string;
  onSessionClick?: (sessionId: string) => void;
}

export default function AppShell({
  children,
  sessions,
  activeSessionId,
  onSessionClick
}: AppShellProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Load sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wondr-sidebar-collapsed");
    if (saved !== null) {
      setIsOpen(saved === "false");
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("wondr-sidebar-collapsed", String(!isOpen));
  }, [isOpen]);

  // Keyboard shortcut: Cmd/Ctrl + B
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`transition-all duration-200 ease-in-out ${isOpen ? "w-64" : "w-12"} overflow-hidden flex-shrink-0`}
      >
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onItemClick={onSessionClick}
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
        />
      </div>

      <div className="flex-1 relative flex flex-col min-w-0">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute top-4 left-4 z-50 p-2 bg-black/60 hover:bg-black/80 rounded-lg transition-colors"
            title="Show sidebar (⌘B)"
            aria-label="Show sidebar"
          >
            <HamburgerMenuIcon className="w-5 h-5 text-white" />
          </button>
        )}

        {children}
      </div>
    </div>
  );
}
