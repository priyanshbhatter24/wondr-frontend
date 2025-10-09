"use client";

import { useState, useEffect } from "react";
import { useApiClient } from "./api-client";
import { SidebarSessionItem } from "@/types/image-generation";

export function useGenerations() {
  const { imageGeneration } = useApiClient();
  const [sessions, setSessions] = useState<SidebarSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const data = await imageGeneration.getUserSessions({ limit: 50 });
        setSessions(data.sessions);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setError("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [imageGeneration]);

  const refetch = async () => {
    try {
      const data = await imageGeneration.getUserSessions({ limit: 50 });
      setSessions(data.sessions);
    } catch (err) {
      console.error("Failed to refetch sessions:", err);
    }
  };

  return { sessions, loading, error, refetch };
}
