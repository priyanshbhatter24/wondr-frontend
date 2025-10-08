"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useApiClient } from "@/lib/api-client";
import PostIdeationView from "@/components/PostIdeationView";
import PromptInputBar from "@/components/PromptInputBar";
import Sidebar from "@/components/Sidebar";
import { PostIdeationResponse } from "@/types/post-ideation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

type Stage = 'loading-prompt' | 'editing-prompt' | 'loading-recommendations' | 'showing-recommendations';

export default function PostIdeationPage() {
  const searchParams = useSearchParams();
  const updateId = searchParams.get("id");
  const suggestionIndex = searchParams.get("index");

  const [stage, setStage] = useState<Stage>('loading-prompt');
  const [userPrompt, setUserPrompt] = useState('');
  const [contextPreview, setContextPreview] = useState('');
  const [recommendations, setRecommendations] = useState<PostIdeationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const api = useApiClient();

  // Placeholder generations for sidebar
  const generations = [
    { id: "1", name: "Google pixel 12mp camera", timestamp: "2 hours ago" },
    { id: "2", name: "Deepmind image model ann", timestamp: "3 hours ago" },
    { id: "3", name: "Google maps new navigatio", timestamp: "4 hours ago" },
    { id: "4", name: "Gemini 2.5 pro intro posts", timestamp: "5 hours ago" },
  ];

  // Step 1: Generate initial prompt on mount
  useEffect(() => {
    async function fetchInitialPrompt() {
      if (!updateId || !suggestionIndex) {
        setError("Missing required parameters");
        setStage('editing-prompt');
        return;
      }

      try {
        setStage('loading-prompt');
        const data = await api.postIdeation.generatePrompt({
          industry_update_id: updateId,
          post_suggestion_index: parseInt(suggestionIndex),
        });
        setUserPrompt(data.generated_prompt);
        setContextPreview(data.context_preview);
        setStage('editing-prompt');
      } catch (err) {
        console.error("Failed to generate initial prompt:", err);
        setError("Failed to generate initial prompt");
        setStage('editing-prompt');
      }
    }

    fetchInitialPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateId, suggestionIndex]);

  // Step 2: Generate recommendations from user's edited prompt
  const handleGenerateRecommendations = async () => {
    if (!updateId || !suggestionIndex || !userPrompt.trim()) return;

    try {
      setStage('loading-recommendations');
      const data = await api.postIdeation.generate({
        industry_update_id: updateId,
        post_suggestion_index: parseInt(suggestionIndex),
        user_prompt: userPrompt,
      });
      setRecommendations(data);
      setStage('showing-recommendations');
    } catch (err) {
      console.error("Failed to generate recommendations:", err);
      setError("Failed to generate recommendations");
      setStage('editing-prompt');
    }
  };

  // Step 3: Regenerate with new prompt (iterative refinement)
  const handleRegenerate = async () => {
    if (!userPrompt.trim()) return;
    // Same as initial generation
    await handleGenerateRecommendations();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#000000]">
      <Sidebar
        generations={generations}
        activeItem={undefined}
        onItemClick={() => {}}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Back Button */}
        <div className="flex-shrink-0 p-6 border-b border-white/10">
          <Link
            href="/idea-hub"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Idea Hub
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading Initial Prompt */}
          {stage === 'loading-prompt' && (
            <div className="flex items-center justify-center min-h-full">
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 border-4 border-[#C1D75B] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-white/60 text-sm">Generating initial prompt...</p>
              </div>
            </div>
          )}

          {/* Editing Prompt (before recommendations) */}
          {stage === 'editing-prompt' && !error && (
            <div className="max-w-4xl mx-auto p-8 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Create Your Post
                </h1>
                {contextPreview && (
                  <p className="text-white/60 text-sm mb-6">
                    {contextPreview}
                  </p>
                )}
                <p className="text-white/80 leading-relaxed">
                  Below is an auto-generated prompt based on the industry insights.
                  Feel free to edit it to match your vision, then click Generate to create
                  text and image recommendations.
                </p>
              </div>
            </div>
          )}

          {/* Loading Recommendations */}
          {stage === 'loading-recommendations' && (
            <div className="flex items-center justify-center min-h-full">
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 border-4 border-[#C1D75B] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-white/60 text-sm">Generating recommendations...</p>
              </div>
            </div>
          )}

          {/* Showing Recommendations */}
          {stage === 'showing-recommendations' && recommendations && (
            <PostIdeationView
              remixTopic={recommendations.remix_topic}
              reasoning={recommendations.reasoning}
              contextBlurb={recommendations.context_blurb}
              textSummary={recommendations.text_summary}
              imageRecommendations={recommendations.image_recommendations}
              suggestedTasks={recommendations.suggested_tasks}
            />
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center min-h-full">
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
        </div>

        {/* Input Bar - Shows in editing or showing stages */}
        {(stage === 'editing-prompt' || stage === 'showing-recommendations') && !error && (
          <PromptInputBar
            value={userPrompt}
            onChange={setUserPrompt}
            onSubmit={stage === 'editing-prompt' ? handleGenerateRecommendations : handleRegenerate}
            loading={false}
            placeholder={
              stage === 'editing-prompt'
                ? "Edit your prompt here..."
                : "Refine your prompt to regenerate recommendations..."
            }
          />
        )}
      </div>
    </div>
  );
}
