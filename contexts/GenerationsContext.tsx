"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useApiClient } from "@/lib/api-client";
import { SidebarSessionItem } from "@/types/image-generation";

interface GenerationsContextValue {
  sessions: SidebarSessionItem[];
  loading: boolean;
  error: string | null;
  addNewGeneration: (session: SidebarSessionItem) => void;
  refetch: () => Promise<void>;
}

const GenerationsContext = createContext<GenerationsContextValue | null>(null);

const CACHE_KEY = "wondr-generations-cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function GenerationsProvider({ children }: { children: ReactNode }) {
  const { imageGeneration } = useApiClient();
  const [sessions, setSessions] = useState<SidebarSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const loadSessions = useCallback(async () => {
    // Try localStorage first for instant display
    const cached = loadFromCache();
    if (cached) {
      setSessions(cached);
      setLoading(false);
    }

    // Fetch from API (in background if cached)
    try {
      const data = await imageGeneration.getUserSessions({ limit: 50 });
      setSessions(data.sessions);
      saveToCache(data.sessions);
      setHasFetched(true);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      if (!cached) {
        setError("Failed to load sessions");
      }
    } finally {
      setLoading(false);
    }
  }, [imageGeneration]);

  // Load from cache + fetch from API
  useEffect(() => {
    if (hasFetched) return; // Only fetch once per session
    void loadSessions();
  }, [hasFetched, loadSessions]);

  function addNewGeneration(session: SidebarSessionItem) {
    // Optimistically prepend new session
    setSessions(prev => {
      // Check if session already exists (avoid duplicates)
      const exists = prev.some(s => s.session_id === session.session_id);
      if (exists) {
        return prev;
      }
      const newSessions = [session, ...prev];
      saveToCache(newSessions);
      return newSessions;
    });
  }

  async function refetch() {
    // Manual refresh (called rarely, e.g., pull-to-refresh)
    try {
      setLoading(true);
      const data = await imageGeneration.getUserSessions({ limit: 50 });
      setSessions(data.sessions);
      saveToCache(data.sessions);
    } catch (err) {
      console.error("Failed to refetch sessions:", err);
      setError("Failed to refresh sessions");
    } finally {
      setLoading(false);
    }
  }

  function loadFromCache(): SidebarSessionItem[] | null {
    if (typeof window === "undefined") return null;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_TTL) {
        // Cache expired - clear it
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      return data;
    } catch (err) {
      console.warn("Failed to load from cache:", err);
      return null;
    }
  }

  function saveToCache(data: SidebarSessionItem[]) {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch (err) {
      console.warn("Failed to save to cache:", err);
    }
  }

  return (
    <GenerationsContext.Provider value={{ sessions, loading, error, addNewGeneration, refetch }}>
      {children}
    </GenerationsContext.Provider>
  );
}

export function useGenerations() {
  const context = useContext(GenerationsContext);
  if (!context) {
    throw new Error("useGenerations must be used within GenerationsProvider");
  }
  return context;
}
