"use client";

import { useRef, useEffect } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

interface PromptInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
}

export default function PromptInputBar({
  value,
  onChange,
  onSubmit,
  loading = false,
  placeholder = "Edit your prompt here...",
}: PromptInputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!loading && value.trim()) {
        onSubmit();
      }
    }
  };

  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="border-t border-white/20 bg-[#1a1a1a] px-8 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={loading}
            className="w-full min-h-[140px] max-h-[400px] bg-[#000000] border border-white/30 rounded-xl px-5 py-4 text-white text-base placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#C1D75B] focus:border-transparent disabled:opacity-50 transition-all"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />

          {/* Bottom bar with word count and button */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-white/60">
              {wordCount} words {loading && "• Generating..."}
            </div>

            <button
              onClick={onSubmit}
              disabled={loading || !value.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-[#C1D75B] text-black font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate
                  <PaperPlaneIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Hint text */}
          <div className="text-xs text-white/50 mt-3">
            Press Cmd/Ctrl + Enter to submit
          </div>
        </div>
      </div>
    </div>
  );
}
