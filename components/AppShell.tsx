"use client";
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
      <aside
        className={`flex-shrink-0 overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? "w-64" : "w-14"
        }`}
      >
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onItemClick={onSessionClick}
          isOpen={isOpen}
          onToggle={() => setIsOpen((prev) => !prev)}
        />
      </aside>

      <div className="flex-1 relative flex flex-col min-w-0">{children}</div>
    </div>
  );
}
