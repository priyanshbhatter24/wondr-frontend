"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api-client";
import { CompetitorAggregatedResponse, CompetitorPost, ResearchJob } from "@/types/competitor-research";
import PostInsightsModal from "./PostInsightsModal";
import CompetitorSelector from "./competitor-research/CompetitorSelector";
import PlatformSection from "./competitor-research/PlatformSection";

export default function CompetitorInsightsSection() {
  const router = useRouter();
  const api = useApiClient();

  // Data state
  const [data, setData] = useState<CompetitorAggregatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Research job state (for async polling)
  const [researchJob, setResearchJob] = useState<ResearchJob | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Selection state
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  // Modal state
  const [insightsModal, setInsightsModal] = useState<{
    isOpen: boolean;
    post: CompetitorPost | null;
    platform: string; // Added platform to modal state for context
  }>({ isOpen: false, post: null, platform: "" });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.competitorResearch.getAggregated();
      setData(response);

      // Auto-select first competitor
      const competitorNames = Object.keys(response.competitors);
      if (competitorNames.length > 0) {
        setSelectedCompetitor(competitorNames[0]);
      }
    } catch (err) {
      console.error("Failed to fetch competitor research:", err);
      setError("Failed to load competitor insights");
    } finally {
      setLoading(false);
    }
  }

  async function handleResearch() {
    try {
      setError(null);
      // Start the research (async)
      const response = await api.competitorResearch.triggerResearch();
      console.log("[CompetitorInsights] Research started:", response);

      // Set initial job state
      setResearchJob({
        job_id: response.job_id,
        user_id: "",
        status: "pending",
        competitors: [],
        started_at: new Date().toISOString(),
        results_count: 0,
      });

      // Start polling for job status
      startPolling(response.job_id);
    } catch (err) {
      console.error("Competitor research failed:", err);
      setError("Failed to start research. Please try again.");
      setResearchJob(null);
    }
  }

  function startPolling(jobId: string) {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const job = await api.competitorResearch.getJobStatus(jobId);
        setResearchJob(job);

        if (job.status === "completed" || job.status === "failed") {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          if (job.status === "completed") {
            await fetchData();
          } else if (job.status === "failed") {
            setError(job.error_message || "Research failed. Please try again.");
          }
          setTimeout(() => setResearchJob(null), 3000);
        }
      } catch (err) {
        console.error("Failed to poll job status:", err);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        setError("Lost connection to research job. Please refresh.");
        setResearchJob(null);
      }
    }, 5000); // Poll every 5 seconds
  }

  async function handleIdeatePost(post: CompetitorPost) {
    try {
      const params = new URLSearchParams();
      
      // 1. Generate prompt on the fly (simulated delay handled by UI state in components)
      // NOTE: In this new flow requested by user, we are generating the prompt text 
      // via the backend BEFORE navigation, or letting the navigation happen and then generating.
      // The user requested: "Just start a loader on the remix button until the text is ready and then redirect"
      // So we must call the API here.
      
      const postText = post.post_text.substring(0, 1000);
      const response = await api.promptGeneration.remix(postText);
      
      // 2. Pass the GENERATED prompt, not the raw text
      params.append("prompt", response.prompt);
      
      // 3. Pass other context
      params.append("competitor_post", post.post_id);
      
      if (post.images && post.images.length > 0) {
        params.append("post_image", post.images[0]);
      }
      
      // We don't need to pass 'post_text' for remixing anymore since we already generated the prompt
      // But we can keep it for reference if needed, or remove it to avoid double-generation on the next page.
      // To be safe and avoid double-generation on the target page, we WON'T pass 'post_text' as a trigger.
      // Instead, we pass the generated 'prompt'.

      router.push(`/generate-post?${params.toString()}`);
    } catch (error) {
      console.error("Failed to generate remix prompt:", error);
      // Optional: Show toast error
    }
  }

  function getResearchButtonText(job: ResearchJob): string {
    switch (job.status) {
      case "pending": return "Starting...";
      case "running": return job.progress || "Researching...";
      case "completed": return `Done! ${job.results_count} posts`;
      case "failed": return "Failed";
      default: return "Researching...";
    }
  }

  // Get current competitor data
  const currentCompetitor = selectedCompetitor
    ? data?.competitors[selectedCompetitor] ?? null
    : null;
  // Get all platforms for current competitor (we show all of them)
  const platforms = currentCompetitor?.platforms ?? [];

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-white">Competitor Insights</h2>
        <div className="flex gap-2">
          <button
            onClick={handleResearch}
            disabled={!!researchJob}
            className="px-4 py-2 rounded-md bg-white/5 text-white/90 font-medium text-sm transition-all hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {researchJob ? getResearchButtonText(researchJob) : "Research"}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-8">
          <div className="flex gap-4 overflow-x-auto pb-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="bg-white/5 animate-pulse h-24 w-64 rounded-xl flex-shrink-0" />
             ))}
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 animate-pulse h-6 w-32 rounded" />
            <div className="flex gap-4 overflow-hidden">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="bg-white/5 animate-pulse h-80 w-80 rounded-xl flex-shrink-0" />
               ))}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12 text-red-400 bg-[#1A1A1A] rounded-xl border border-red-900/20">
          <p>{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!data || data.total_competitors === 0) && (
        <div className="text-center py-16 text-white/40 bg-[#1A1A1A] rounded-xl border border-white/5">
          <p className="text-lg">No competitor research available.</p>
          <p className="text-sm mt-2">Click the arrow icon above to start analyzing your competitors.</p>
        </div>
      )}

      {/* Data Content */}
      {!loading && !error && data && data.total_competitors > 0 && (
        <div className="space-y-8">
          {/* 1. Competitor Selector (Horizontal List) */}
          <CompetitorSelector 
            competitors={data.competitors}
            selectedCompetitor={selectedCompetitor}
            onSelect={setSelectedCompetitor}
          />

          {/* 2. Platform Sections (Vertical Stack) */}
          {currentCompetitor && platforms.length > 0 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {platforms.map((platform) => (
                <PlatformSection
                  key={platform}
                  platform={platform}
                  posts={currentCompetitor.posts_by_platform[platform] || []}
                  onIdeate={handleIdeatePost}
                  onShowInsights={(post) => setInsightsModal({ isOpen: true, post, platform })}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-white/40">
              <p>No posts found for this competitor.</p>
            </div>
          )}
        </div>
      )}

      {/* Insights Modal */}
      <PostInsightsModal
        isOpen={insightsModal.isOpen}
        onClose={() => setInsightsModal({ isOpen: false, post: null, platform: "" })}
        post={insightsModal.post}
        competitorName={selectedCompetitor || ""}
        platform={insightsModal.platform}
        onIdeate={() => {
          if (insightsModal.post) {
            handleIdeatePost(insightsModal.post);
          }
          // Do NOT close modal immediately to show loading state in button
          // However, since handleIdeatePost is async, we might want to wait or close after success?
          // The user experience is usually: Click -> Load -> Redirect. 
          // So we don't need to close the modal, the redirect will handle it.
        }}
      />
    </div>
  );
}
