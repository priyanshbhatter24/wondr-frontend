"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api-client";
import PostIdeationView from "@/components/PostIdeationView";
import AppShell from "@/components/AppShell";
import { PostIdeationResponse } from "@/types/post-ideation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useGenerations } from "@/lib/use-generations";

type PageStatus = "loading" | "ready" | "error";

function PostIdeationPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateId = searchParams.get("id") ?? "";
  const suggestionIndexParam = searchParams.get("index");
  const preGeneratedPrompt = searchParams.get("prompt");
  const ideationId = searchParams.get("ideationId");

  const suggestionIndex = useMemo(() => {
    if (suggestionIndexParam === null) return null;
    const parsed = Number.parseInt(suggestionIndexParam, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [suggestionIndexParam]);

  const [status, setStatus] = useState<PageStatus>("loading");
  const [userPrompt, setUserPrompt] = useState<string>("");
  type ConversationTurn = { prompt: string; ideation: PostIdeationResponse | null; isLoading?: boolean };
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const conversationRef = useRef<ConversationTurn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number | null>(suggestionIndex);
  const [conversationId, setConversationId] = useState<string | null>(null);  // Track conversation ID
  const hasFetchedRef = useRef(false);
  const isGeneratingRef = useRef(false);  // Prevent concurrent generations

  const api = useApiClient();

  const { sessions } = useGenerations();

  const handleSessionClick = (sessionId: string) => {
    router.push(`/generate-post?session=${sessionId}`);
  };

  useEffect(() => {
    hasFetchedRef.current = false;
    isGeneratingRef.current = false;  // Also reset generating lock
    setActiveSuggestionIndex(suggestionIndex);
  }, [updateId, suggestionIndex, preGeneratedPrompt, ideationId]);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  useEffect(() => {
    let isMounted = true;

    async function loadIdeation() {
      if (hasFetchedRef.current || isGeneratingRef.current) {
        console.log("[post-ideation] Skipping load; already fetched/generating");
        return;
      }
      hasFetchedRef.current = true;
      isGeneratingRef.current = true;

      setStatus("loading");
      setError(null);

      try {
        if (!updateId) {
          throw new Error("Missing industry update ID");
        }

        if (ideationId) {
          const existingTurn = conversationRef.current.find(
            ({ ideation }) => ideation?.ideation_id === ideationId
          );
          if (existingTurn && existingTurn.ideation) {
            console.log("[post-ideation] Found existing ideation in conversation; skipping generate", ideationId);
            setActiveSuggestionIndex(existingTurn.ideation.post_suggestion_index);
            setStatus("ready");
            isGeneratingRef.current = false;
            return;
          }
          console.log("[post-ideation] Loading conversation from history", ideationId);
          const conversationTurns = await api.postIdeation.getById(updateId, ideationId);  // Returns array of all turns
          if (!isMounted) {
            isGeneratingRef.current = false;
            return;
          }

          // Convert array of responses to conversation turns
          const existingConversation: ConversationTurn[] = conversationTurns.map(turn => ({
            prompt: turn.user_prompt,
            ideation: turn
          }));

          conversationRef.current = existingConversation;
          setConversation(existingConversation);
          setUserPrompt(conversationTurns[0]?.user_prompt || "");
          setActiveSuggestionIndex(conversationTurns[0]?.post_suggestion_index || null);
          setConversationId(conversationTurns[0]?.conversation_id || null);  // Store conversation ID
          setInputPrompt("");
          setStatus("ready");
          isGeneratingRef.current = false;
          return;
        }

        if (suggestionIndex === null) {
          throw new Error("Missing suggestion index");
        }

        let promptToUse = preGeneratedPrompt;
        console.log("[post-ideation] Generating new ideation; suggestion index", suggestionIndex, "prePrompt?", !!preGeneratedPrompt);

        if (!promptToUse) {
          const initialPrompt = await api.postIdeation.generatePrompt({
            industry_update_id: updateId,
            post_suggestion_index: suggestionIndex,
          });

          promptToUse = initialPrompt.generated_prompt;
        }

        const generatedIdeation = await api.postIdeation.generate({
          industry_update_id: updateId,
          post_suggestion_index: suggestionIndex,
          user_prompt: promptToUse,
        });
        console.log("[post-ideation] Generated ideation", generatedIdeation.ideation_id, "conversation_id", generatedIdeation.conversation_id);

        if (!isMounted) {
          isGeneratingRef.current = false;
          return;
        }

        const initialConversation: ConversationTurn[] = [{ prompt: promptToUse, ideation: generatedIdeation }];
        conversationRef.current = initialConversation;
        setConversation(initialConversation);
        setUserPrompt(promptToUse);
        setActiveSuggestionIndex(generatedIdeation.post_suggestion_index);
        setConversationId(generatedIdeation.conversation_id);  // Store conversation ID
        setInputPrompt("");
        setStatus("ready");
        isGeneratingRef.current = false;

        if (!ideationId) {
          const params = new URLSearchParams();
          params.set("id", updateId);
          params.set("ideationId", generatedIdeation.ideation_id);
          router.replace(`/post-ideation?${params.toString()}`);
        }
      } catch (err) {
        console.error("Failed to load ideation:", err);
        if (!isMounted) {
          isGeneratingRef.current = false;
          return;
        }
        setError(
          err instanceof Error ? err.message : "Unable to load post ideation"
        );
        setStatus("error");
        isGeneratingRef.current = false;
      }
    }

    void loadIdeation();

    return () => {
      isMounted = false;
    };
  }, [api.postIdeation, ideationId, preGeneratedPrompt, router, suggestionIndex, updateId]);

  const handleSubmitAdditionalPrompt = async () => {
    if (!updateId || activeSuggestionIndex === null || !inputPrompt.trim() || !conversationId) {
      return;
    }
    const trimmedPrompt = inputPrompt.trim();
    setInputPrompt("");  // Clear input immediately

    // OPTIMISTIC UI: Add user message immediately with loading state
    const optimisticTurn: ConversationTurn = {
      prompt: trimmedPrompt,
      ideation: null,
      isLoading: true
    };

    setConversation((prev) => {
      const next = [...prev, optimisticTurn];
      conversationRef.current = next;
      return next;
    });

    try {
      const previousContext = conversation
        .filter(item => item.ideation !== null)  // Only include completed turns
        .map((item, idx) => {
          const imagesSummary = item.ideation!.image_recommendations
            .map(
              (rec) =>
                `#${rec.recommendation_number}: ${rec.suggested_task.task_title} -> ${rec.explanation}`
            )
            .join("; ");
          return `Turn ${idx + 1}
User prompt:
${item.prompt}
Reasoning:
${item.ideation!.reasoning}
Text recommendation:
${item.ideation!.text_recommendation}
Image recommendations:
${imagesSummary}\n`;
        })
        .join("\n");
      const contextualPrompt = `${trimmedPrompt}\n\n---\nPrior conversation context (for reference only):\n${previousContext}`;

      // Pass conversation_id to update existing conversation
      const newIdeation = await api.postIdeation.generate({
        industry_update_id: updateId,
        post_suggestion_index: activeSuggestionIndex,
        user_prompt: contextualPrompt,
        conversation_id: conversationId  // THIS IS KEY: Update existing conversation instead of creating new one
      });

      console.log("[post-ideation] Generated follow-up turn", newIdeation.ideation_id, "in conversation", conversationId);

      // Replace loading turn with actual ideation
      setConversation((prev) => {
        const next = prev.map(turn =>
          turn.isLoading ? { prompt: trimmedPrompt, ideation: newIdeation, isLoading: false } : turn
        );
        conversationRef.current = next;
        return next;
      });

      setActiveSuggestionIndex(newIdeation.post_suggestion_index);
      // NO URL REPLACEMENT for follow-ups - conversation_id stays the same
    } catch (err) {
      console.error("Failed to generate additional ideation:", err);
      setError("Failed to generate a new response. Please try again.");

      // Remove the optimistic loading turn on error
      setConversation((prev) => {
        const next = prev.filter(turn => !turn.isLoading);
        conversationRef.current = next;
        return next;
      });

      setInputPrompt(trimmedPrompt);  // Restore the input
    }
  };

  return (
    <AppShell sessions={sessions} onSessionClick={handleSessionClick}>
      <div className="flex-1 flex flex-col overflow-hidden bg-[#1a1a1a]">
        <div className="flex-shrink-0 p-6">
          <Link
            href={updateId ? `/market-trend/${updateId}` : "/idea-hub"}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 transition-colors text-sm ml-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Market Trend
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          {status === "loading" && (
            <div className="flex items-center justify-center min-h-full">
              <div className="space-y-4 text-center">
                <div className="w-10 h-10 border-3 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto" />
                <p className="text-white/50 text-sm">
                  Preparing your ideation...
                </p>
              </div>
            </div>
          )}

          {status === "ready" && conversation.length > 0 && (
            <PostIdeationView
              userPrompt={userPrompt}
              conversation={conversation}
            />
          )}

          {status === "error" && error && (
            <div className="flex items-center justify-center min-h-full">
              <div className="text-center space-y-4 max-w-md">
                <div className="text-red-400/90 text-base font-medium">{error}</div>
                <Link
                  href="/idea-hub"
                  className="inline-block px-5 py-2.5 bg-white/10 hover:bg-white/15 transition-all text-white/90 rounded-lg text-sm"
                >
                  Return to Idea Hub
                </Link>
              </div>
            </div>
          )}
        </div>

        {status === "ready" && (
          <div className="border-t border-white/5 bg-[#1a1a1a] px-6 py-4">
            <div className="max-w-5xl mx-auto">
              <div className="rounded-xl bg-[#252525] py-3 px-4 flex items-center gap-3 shadow-lg border border-white/5">
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center text-white/40"
                  aria-label="Magic prompt"
                  disabled
                >
                  ✨
                </button>
                <textarea
                  value={inputPrompt}
                  onChange={(event) => setInputPrompt(event.target.value)}
                  placeholder="Refine your post idea..."
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none resize-none max-h-32 min-h-[40px] leading-5 scrollbar-hide"
                  rows={1}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSubmitAdditionalPrompt();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleSubmitAdditionalPrompt}
                  disabled={!inputPrompt.trim()}
                  className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/15 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Submit prompt"
                >
                  <ArrowLeftIcon className="w-4 h-4 transform rotate-90 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function PostIdeationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#000000] text-white">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-[#C1D75B] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/60 text-sm">Loading post ideation...</p>
          </div>
        </div>
      }
    >
      <PostIdeationPageContent />
    </Suspense>
  );
}
