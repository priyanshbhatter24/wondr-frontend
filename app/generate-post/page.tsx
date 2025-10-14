"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { ImageDisplay } from "@/components/ImageDisplay";
import { ChatInterface } from "@/components/ChatInterface";
import BrandColorsBar from "@/components/BrandColorsBar";
import { useApiClient } from "@/lib/api-client";
import { ImageGeneration, ChatMessage } from "@/types/image-generation";
import { BrandColor } from "@/types/industry-updates";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useGenerations } from "@/lib/use-generations";
import { ModeToggle } from "@/components/ModeToggle";
import { ChannelSelector } from "@/components/ChannelSelector";
import { ReadyBanner } from "@/components/ReadyBanner";

function GeneratePostPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPrompt = searchParams.get("prompt") || "";
  const sessionIdFromUrl = searchParams.get("session");

  const { imageGeneration, userConfig, planMode } = useApiClient();
  const { sessions: sidebarSessions, refetch } = useGenerations();

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(sessionIdFromUrl);

  // Data state
  const [generations, setGenerations] = useState<ImageGeneration[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [brandColors, setBrandColors] = useState<BrandColor[]>([]);

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Mode and channel state
  const [mode, setMode] = useState<"plan" | "generate">("plan");
  const [channel, setChannel] = useState<"instagram" | "linkedin" | "x">("instagram");
  const [showReadyBanner, setShowReadyBanner] = useState(false);

  // Initialize or load session
  useEffect(() => {
    const initSession = async () => {
      if (sessionIdFromUrl) {
        // Load existing session (for refresh or sidebar navigation)
        try {
          setIsInitializing(true);
          await imageGeneration.getSession(sessionIdFromUrl);
          setSessionId(sessionIdFromUrl);
          // History will be loaded by next useEffect
        } catch (err) {
          console.error("Failed to load session:", err);
          // If session not found, create new one
          await createNewSession();
        } finally {
          setIsInitializing(false);
        }
      } else {
        // Create new session
        await createNewSession();
      }
    };

    async function createNewSession() {
      try {
        setIsInitializing(true);
        const session = await imageGeneration.createSession();
        setSessionId(session.session_id);

        // IMPORTANT: Update URL to include session_id for persistence
        const params = new URLSearchParams();
        params.set("session", session.session_id);
        if (initialPrompt) {
          params.set("prompt", initialPrompt);
        }
        router.replace(`/generate-post?${params.toString()}`);
      } catch (err) {
        console.error("Failed to create session:", err);
        setError("Failed to initialize session. Please refresh the page.");
      } finally {
        setIsInitializing(false);
      }
    }

    initSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionIdFromUrl]);

  // Load history when session changes
  useEffect(() => {
    if (!sessionId) return;

    const loadHistory = async () => {
      try {
        const [historyData, messagesData] = await Promise.all([
          imageGeneration.getHistory(sessionId),
          imageGeneration.getMessages(sessionId),
        ]);

        setGenerations(historyData.generations || []);
        setMessages(messagesData.messages || []);

        // Set current index to latest generation
        if (historyData.generations?.length > 0) {
          setCurrentIndex(historyData.generations.length - 1);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };

    loadHistory();
  }, [imageGeneration, sessionId]);

  // Fetch brand colors from ICP config
  useEffect(() => {
    const fetchBrandColors = async () => {
      try {
        const config = await userConfig.getIcp();
        if (config.brand_colors) {
          setBrandColors(config.brand_colors);
        }
      } catch (err) {
        console.error("Failed to fetch brand colors:", err);
        // Silently fail - brand colors are optional
      }
    };

    fetchBrandColors();
  }, [userConfig]);

  const handleSendMessage = async (prompt: string) => {
    if (!sessionId || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Optimistically add user message
      const userMessage: ChatMessage = {
        message_id: `temp-${Date.now()}`,
        session_id: sessionId,
        role: "user",
        content: prompt,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Get previous generation ID if iterating
      const previousGenerationId = generations.length > 0
        ? generations[generations.length - 1].generation_id
        : undefined;

      // Generate image
      await imageGeneration.generate({
        session_id: sessionId,
        prompt,
        previous_generation_id: previousGenerationId,
      });

      // Reload history and messages
      const [historyData, messagesData] = await Promise.all([
        imageGeneration.getHistory(sessionId),
        imageGeneration.getMessages(sessionId),
      ]);

      setGenerations(historyData.generations || []);
      setMessages(messagesData.messages || []);

      // Navigate to the new generation
      if (historyData.generations?.length > 0) {
        setCurrentIndex(historyData.generations.length - 1);
      }

      // Refetch sidebar generations
      await refetch();
    } catch (err) {
      console.error("Failed to generate image:", err);
      setError("Failed to generate image. Please try again.");
      // Remove optimistic message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsGenerating(false);
    }
  };

  // Load mode and channel from session
  useEffect(() => {
    if (!sessionId) return;

    const loadSessionSettings = async () => {
      try {
        const session = await imageGeneration.getSession(sessionId);
        if (session.mode) setMode(session.mode);
        if (session.channel) setChannel(session.channel);
      } catch (err) {
        console.error("Failed to load session settings:", err);
      }
    };

    loadSessionSettings();
  }, [imageGeneration, sessionId]);

  const handleModeChange = async (newMode: "plan" | "generate") => {
    if (!sessionId) return;

    setMode(newMode);
    setShowReadyBanner(false); // Clear banner when switching modes

    try {
      await imageGeneration.updateSession(sessionId, { mode: newMode });
    } catch (err) {
      console.error("Failed to update mode:", err);
    }
  };

  const handleChannelChange = async (newChannel: "instagram" | "linkedin" | "x") => {
    if (!sessionId) return;

    setChannel(newChannel);

    try {
      await imageGeneration.updateSession(sessionId, { channel: newChannel });
    } catch (err) {
      console.error("Failed to update channel:", err);
    }
  };

  const handlePlanModeChat = async (prompt: string) => {
    if (!sessionId || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Optimistically add user message
      const userMessage: ChatMessage = {
        message_id: `temp-${Date.now()}`,
        session_id: sessionId,
        role: "user",
        content: prompt,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Call plan mode chat API
      const response = await planMode.chat({
        session_id: sessionId,
        message: prompt,
      });

      // Reload messages from server for consistency
      const messagesData = await imageGeneration.getMessages(sessionId);
      setMessages(messagesData.messages || []);

      // Show ready banner if AI detected readiness
      if (response.ready_to_generate) {
        setShowReadyBanner(true);
      }
    } catch (err) {
      console.error("Failed to chat in plan mode:", err);
      setError("Failed to process message. Please try again.");
      // Remove optimistic message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsGenerating(false);
    }
  };

  // Detect aspect ratio from user prompt
  const detectAspectRatio = (prompt: string): string | undefined => {
    const lowerPrompt = prompt.toLowerCase();

    // Direct aspect ratio mentions
    if (lowerPrompt.includes("16:9") || lowerPrompt.includes("16 by 9")) return "16:9";
    if (lowerPrompt.includes("1:1") || lowerPrompt.includes("square")) return "1:1";
    if (lowerPrompt.includes("4:5") || lowerPrompt.includes("4 by 5")) return "4:5";
    if (lowerPrompt.includes("9:16") || lowerPrompt.includes("9 by 16")) return "9:16";
    if (lowerPrompt.includes("portrait") && !lowerPrompt.includes("16:9")) return "4:5";
    if (lowerPrompt.includes("landscape")) return "16:9";

    return undefined;
  };

  const handleMessage = async (prompt: string) => {
    if (mode === "plan") {
      await handlePlanModeChat(prompt);
    } else {
      // Generate mode - detect aspect ratio override
      const detectedAspectRatio = detectAspectRatio(prompt);

      if (!sessionId || isGenerating) return;

      setIsGenerating(true);
      setError(null);

      try {
        // Optimistically add user message
        const userMessage: ChatMessage = {
          message_id: `temp-${Date.now()}`,
          session_id: sessionId,
          role: "user",
          content: prompt,
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, userMessage]);

        // Get previous generation ID if iterating
        const previousGenerationId = generations.length > 0
          ? generations[generations.length - 1].generation_id
          : undefined;

        // Generate image with optional aspect ratio override
        await imageGeneration.generate({
          session_id: sessionId,
          prompt,
          previous_generation_id: previousGenerationId,
          aspect_ratio: detectedAspectRatio,
          channel: channel,
        });

        // Reload history and messages
        const [historyData, messagesData] = await Promise.all([
          imageGeneration.getHistory(sessionId),
          imageGeneration.getMessages(sessionId),
        ]);

        setGenerations(historyData.generations || []);
        setMessages(messagesData.messages || []);

        // Navigate to the new generation
        if (historyData.generations?.length > 0) {
          setCurrentIndex(historyData.generations.length - 1);
        }

        // Refetch sidebar generations
        await refetch();
      } catch (err) {
        console.error("Failed to generate image:", err);
        setError("Failed to generate image. Please try again.");
        // Remove optimistic message on error
        setMessages(prev => prev.slice(0, -1));
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleNavigate = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle sidebar generation click
  const handleGenerationClick = (newSessionId: string) => {
    router.push(`/generate-post?session=${newSessionId}`);
  };

  if (isInitializing) {
    return (
      <AppShell
        sessions={sidebarSessions}
        activeSessionId={sessionId || undefined}
        onSessionClick={handleGenerationClick}
      >
        <div className="flex items-center justify-center h-screen bg-[#3A3A3A] text-white">
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-4">
              <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-lg font-medium">Initializing session...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      sessions={sidebarSessions}
      activeSessionId={sessionId || undefined}
      onSessionClick={handleGenerationClick}
    >
      <div className="flex flex-col h-screen bg-[#3A3A3A]">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-[#262626]">
          <h1 className="text-2xl font-bold text-white">Generate Post</h1>
        </header>

        {/* Error banner */}
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 p-4">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Main content with resizable panels */}
        <div className="flex-1 overflow-hidden">
          <PanelGroup direction="horizontal">
            {/* Chat panel */}
            <Panel defaultSize={40} minSize={30}>
              <div className="flex h-full flex-col">
                {/* Mode and Channel Controls */}
                <div className="p-4 border-b border-[#262626] bg-[#3A3A3A]">
                  <div className="flex items-center justify-between gap-4">
                    <ModeToggle
                      mode={mode}
                      onModeChange={handleModeChange}
                      disabled={isGenerating}
                    />
                    <ChannelSelector
                      channel={channel}
                      onChannelChange={handleChannelChange}
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                <BrandColorsBar colors={brandColors} />

                <div className="flex-1 flex flex-col">
                  {/* Ready to generate banner */}
                  {showReadyBanner && mode === "plan" && (
                    <div className="p-4 pt-3">
                      <ReadyBanner onDismiss={() => setShowReadyBanner(false)} />
                    </div>
                  )}

                  <div className="flex-1">
                    <ChatInterface
                      messages={messages}
                      onSendMessage={handleMessage}
                      isGenerating={isGenerating}
                      initialPrompt={initialPrompt}
                      onSelectGeneration={(generationId) => {
                        const targetIndex = generations.findIndex(
                          (generation) => generation.generation_id === generationId,
                        );
                        if (targetIndex >= 0) {
                          setCurrentIndex(targetIndex);
                        }
                      }}
                      selectedGenerationId={generations[currentIndex]?.generation_id}
                      mode={mode}
                    />
                  </div>
                </div>
              </div>
            </Panel>

            {/* Resize handle */}
            <PanelResizeHandle className="w-1 bg-[#262626] hover:bg-white/30 transition-colors" />

            {/* Image panel */}
            <Panel defaultSize={60} minSize={40}>
              <ImageDisplay
                generations={generations}
                currentIndex={currentIndex}
                onNavigate={handleNavigate}
              />
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </AppShell>
  );
}

export default function GeneratePostPage() {
  return (
    <Suspense
      fallback={(
        <div className="flex items-center justify-center min-h-screen bg-[#000000] text-white">
          <div className="text-center space-y-3">
            <div className="flex justify-center gap-1">
              <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-sm text-white/80">Loading your session...</p>
          </div>
        </div>
      )}
    >
      <GeneratePostPageContent />
    </Suspense>
  );
}
