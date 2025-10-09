"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { ImageDisplay } from "@/components/ImageDisplay";
import { ChatInterface } from "@/components/ChatInterface";
import { useApiClient } from "@/lib/api-client";
import { ImageGeneration, ChatMessage } from "@/types/image-generation";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function GeneratePostPage() {
  const { imageGeneration } = useApiClient();

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Data state
  const [generations, setGenerations] = useState<ImageGeneration[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await imageGeneration.createSession();
        setSessionId(session.session_id);
      } catch (err) {
        console.error("Failed to create session:", err);
        setError("Failed to initialize session. Please refresh the page.");
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, [imageGeneration]);

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
    } catch (err) {
      console.error("Failed to generate image:", err);
      setError("Failed to generate image. Please try again.");
      // Remove optimistic message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNavigate = (index: number) => {
    setCurrentIndex(index);
  };

  if (isInitializing) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-screen bg-[#000000] text-white">
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-4">
              <span className="w-3 h-3 bg-[#C1D75B] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-3 h-3 bg-[#C1D75B] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-3 h-3 bg-[#C1D75B] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-lg font-medium">Initializing session...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col h-screen bg-[#000000]">
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
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
              />
            </Panel>

            {/* Resize handle */}
            <PanelResizeHandle className="w-1 bg-[#262626] hover:bg-[#C1D75B] transition-colors" />

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
