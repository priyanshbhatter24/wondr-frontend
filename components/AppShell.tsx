"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
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
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Content className="transition-all duration-200 ease-in-out data-[state=closed]:w-0 data-[state=open]:w-64">
          <Sidebar generations={[]} />
        </Collapsible.Content>
      </Collapsible.Root>

      <div className="flex-1 relative flex flex-col min-w-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 left-4 z-50 p-2 bg-black/60 hover:bg-black/80 rounded-lg transition-colors"
          title={isOpen ? "Hide sidebar (⌘B)" : "Show sidebar (⌘B)"}
        >
          <HamburgerMenuIcon className="w-5 h-5 text-white" />
        </button>

        {children}
      </div>
    </div>
  );
}
