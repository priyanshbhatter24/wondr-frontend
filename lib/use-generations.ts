"use client";

import { useState, useEffect } from "react";
import { useApiClient } from "./api-client";
import { SidebarGenerationItem } from "@/types/image-generation";

export function useGenerations() {
  const { imageGeneration } = useApiClient();
  const [generations, setGenerations] = useState<SidebarGenerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGenerations() {
      try {
        const data = await imageGeneration.getUserGenerations({ limit: 50 });
        setGenerations(data.generations);
      } catch (err) {
        console.error("Failed to fetch generations:", err);
        setError("Failed to load generations");
      } finally {
        setLoading(false);
      }
    }

    fetchGenerations();
  }, [imageGeneration]);

  const refetch = async () => {
    try {
      const data = await imageGeneration.getUserGenerations({ limit: 50 });
      setGenerations(data.generations);
    } catch (err) {
      console.error("Failed to refetch generations:", err);
    }
  };

  return { generations, loading, error, refetch };
}
