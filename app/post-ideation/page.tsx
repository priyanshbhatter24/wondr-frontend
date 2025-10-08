"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useApiClient } from "@/lib/api-client";
import PostIdeationView from "@/components/PostIdeationView";
import Sidebar from "@/components/Sidebar";
import { PostIdeationResponse } from "@/types/post-ideation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function PostIdeationPage() {
  const searchParams = useSearchParams();
  const updateId = searchParams.get("id");
  const suggestionIndex = searchParams.get("index");

  const [ideation, setIdeation] = useState<PostIdeationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = useApiClient();

  // Placeholder generations for sidebar
  const generations = [
    { id: "1", name: "Google pixel 12mp camera", timestamp: "2 hours ago" },
    { id: "2", name: "Deepmind image model ann", timestamp: "3 hours ago" },
    { id: "3", name: "Google maps new navigatio", timestamp: "4 hours ago" },
    { id: "4", name: "Gemini 2.5 pro intro posts", timestamp: "5 hours ago" },
  ];

  useEffect(() => {
    async function fetchIdeation() {
      if (!updateId || !suggestionIndex) {
        setError("Missing required parameters");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await api.postIdeation.generate({
          industry_update_id: updateId,
          post_suggestion_index: parseInt(suggestionIndex),
        });
        setIdeation(data);
      } catch (err) {
        console.error("Failed to fetch post ideation:", err);
        setError("Failed to generate post ideation");
      } finally {
        setLoading(false);
      }
    }

    fetchIdeation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateId, suggestionIndex]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#000000]">
      <Sidebar
        generations={generations}
        activeItem={undefined}
        onItemClick={() => {}}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Back Button */}
        <div className="p-6 border-b border-white/10">
          <Link
            href="/idea-hub"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Idea Hub
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 border-4 border-[#C1D75B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white/60 text-sm">Generating post ideation...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4 max-w-md">
              <div className="text-red-400 text-lg font-semibold">
                {error}
              </div>
              <Link
                href="/idea-hub"
                className="inline-block px-6 py-3 bg-[#846348] hover:brightness-110 transition-all text-white rounded"
              >
                Return to Idea Hub
              </Link>
            </div>
          </div>
        )}

        {/* Success State */}
        {ideation && !loading && !error && (
          <PostIdeationView
            remixTopic={ideation.remix_topic}
            reasoning={ideation.reasoning}
            contextBlurb={ideation.context_blurb}
            textSummary={ideation.text_summary}
            imageRecommendations={ideation.image_recommendations}
            suggestedTasks={ideation.suggested_tasks}
          />
        )}
      </div>
    </div>
  );
}
