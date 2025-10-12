"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/image-generation";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import * as ScrollArea from "@radix-ui/react-scroll-area";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (prompt: string) => void;
  isGenerating: boolean;
  initialPrompt?: string;
}

export function ChatInterface({ messages, onSendMessage, isGenerating, initialPrompt }: ChatInterfaceProps) {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update prompt if initialPrompt changes
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSendMessage(prompt.trim());
      setPrompt("");
    }
  };

  const formatMessageContent = (msg: ChatMessage) => {
    if (msg.role === "tool_request") {
      return `Generating image with prompt: "${msg.content}"`;
    }
    if (msg.role === "tool_result") {
      return "Image generated successfully";
    }
    return msg.content;
  };

  return (
    <div className="flex flex-col h-full bg-[#3A3A3A]">
      {/* Chat messages */}
      <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport ref={scrollRef} className="w-full h-full p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-white/40 text-center py-12">
                <p className="text-lg font-medium mb-2">Start a conversation</p>
                <p className="text-sm max-w-md">
                  Describe the image you want to generate. Be specific about style, colors, composition, and mood.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.message_id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-[#C1D75B] text-[#000000]"
                        : msg.role === "assistant"
                        ? "bg-[#262626] text-white"
                        : "bg-[#1a1a1a] text-white/60 text-sm italic"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {formatMessageContent(msg)}
                    </div>
                    {msg.generation_id && (
                      <div className="mt-2 text-xs opacity-60">
                        Version {messages.filter(m => m.generation_id).indexOf(msg) + 1}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-[#262626] text-white rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#C1D75B] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-[#C1D75B] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-[#C1D75B] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm">Generating image...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-[#1a1a1a] transition-colors duration-150 ease-out hover:bg-[#262626] w-2.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-white/20 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Input form */}
      <div className="border-t border-[#2A2A2A] p-6 bg-[#3A3A3A]">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full max-w-3xl mx-auto">
            <div className="rounded-full bg-[#2A2A2A] shadow-2xl py-3 px-4 flex items-center gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none"
                disabled={isGenerating}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="w-10 h-10 flex items-center justify-center bg-gray-600 hover:bg-gray-500 rounded-full transition-colors shadow-md flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperPlaneIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
