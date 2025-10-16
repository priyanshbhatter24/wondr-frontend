"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChatMessage } from "@/types/image-generation";
import { ArrowLeftIcon, PlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import imageCompression from 'browser-image-compression';

// File upload constants
const MAX_FILE_SIZE = 200 * 1024; // 200KB
const MAX_FILES_PER_SESSION = 5;
const ALLOWED_MIME_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  documents: ['application/pdf', 'text/plain', 'text/markdown']
};

// Get allowed file types based on mode
const getAllowedTypes = (mode: 'plan' | 'generate') => {
  if (mode === 'generate') return ALLOWED_MIME_TYPES.images;
  return [...ALLOWED_MIME_TYPES.images, ...ALLOWED_MIME_TYPES.documents];
};

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (prompt: string, files?: File[]) => void;
  isGenerating: boolean;
  initialPrompt?: string;
  onSelectGeneration?: (generationId: string) => void;
  selectedGenerationId?: string;
  mode?: "plan" | "generate";
  sessionFileCount?: number;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isGenerating,
  initialPrompt,
  onSelectGeneration,
  selectedGenerationId,
  mode = "generate",
  sessionFileCount = 0,
}: ChatInterfaceProps) {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generationMessages = useMemo(
    () => messages.filter((message) => message.generation_id),
    [messages],
  );

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

  // Compress image files
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.15, // 150KB target
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    return await imageCompression(file, options);
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError(null);

    // Check session limit
    if (sessionFileCount + attachedFiles.length + files.length > MAX_FILES_PER_SESSION) {
      setUploadError(`Maximum ${MAX_FILES_PER_SESSION} files per session`);
      return;
    }

    try {
      // Validate and compress files
      const processedFiles = await Promise.all(files.map(async (file) => {
        // Validate type
        const allowedTypes = getAllowedTypes(mode);
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File type ${file.type} not allowed in ${mode} mode`);
        }

        // Compress images
        if (file.type.startsWith('image/')) {
          file = await compressImage(file);
        }

        // Validate size
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`${file.name} exceeds 200KB limit`);
        }

        return file;
      }));

      setAttachedFiles([...attachedFiles, ...processedFiles]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'File upload failed');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove file from attachments
  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
    setUploadError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSendMessage(prompt.trim(), attachedFiles.length > 0 ? attachedFiles : undefined);
      setPrompt("");
      setAttachedFiles([]);
      setUploadError(null);
    }
  };

  const formatMessageContent = (msg: ChatMessage) => {
    if (msg.role === "tool_request") {
      return `Generating image with prompt: "${msg.content}"`;
    }
    return msg.content;
  };

  return (
    <div className="flex flex-col h-full bg-[#3A3A3A] min-h-0">
      {/* Chat messages */}
      <ScrollArea.Root className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea.Viewport ref={scrollRef} className="w-full h-full p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-white/40 text-center py-12">
                <p className="text-lg font-medium mb-2">Start a conversation</p>
                <p className="text-sm max-w-md">
                  {mode === "plan"
                    ? "Share your ideas and brainstorm concepts for your social media post. I'll help you refine and develop them."
                    : "Describe the image you want to generate. Be specific about style, colors, composition, and mood."}
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                if (msg.role === "assistant" && msg.generation_id) {
                  const generationId = msg.generation_id;
                  const versionIndex = generationMessages.findIndex(
                    (generationMessage) => generationMessage.generation_id === generationId,
                  );
                  const versionLabel = versionIndex >= 0 ? `v${versionIndex + 1}` : null;
                  const isSelected = selectedGenerationId === generationId;

                  return (
                    <div key={msg.message_id} className="flex justify-start">
                      <button
                        type="button"
                        onClick={() => onSelectGeneration?.(generationId)}
                        className={`w-full max-w-[85%] text-left transition-all rounded-xl border px-5 py-4 shadow-lg bg-[#252525] border-white/10 hover:bg-[#303030] hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                          isSelected ? "border-white/40 bg-[#303030]" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                            {formatMessageContent(msg)}
                          </div>
                          {versionLabel && (
                            <div className="text-xs text-white/40 font-medium uppercase tracking-wide">
                              {versionLabel}
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                }

                if (msg.role === "tool_request") {
                  return (
                    <div key={msg.message_id} className="flex justify-start">
                      <div className="max-w-[80%] rounded-xl px-4 py-3 bg-[#252525] text-white/60 text-sm italic border border-white/5">
                        <div className="whitespace-pre-wrap break-words">
                          {formatMessageContent(msg)}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.message_id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-[#2A2A2A] text-white"
                          : "bg-[#2A2A2A] text-white/80"
                      }  `}
                    >
                      <div className="whitespace-pre-wrap break-words leading-relaxed">
                        {formatMessageContent(msg)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-[#252525] text-white rounded-xl px-4 py-3 border border-white/10 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm">
                      {mode === "plan" ? "Brainstorming..." : "Generating image..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-[#1F1F1F] transition-colors duration-150 ease-out hover:bg-[#2C2C2C] w-2.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-white/20 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Input form */}
      <div className="px-4 py-2 bg-[#3A3A3A] flex-shrink-0">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full max-w-3xl mx-auto space-y-2">
            {/* File preview chips */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-2">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white/10 text-white/70 px-3 py-1.5 rounded-full text-xs"
                  >
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <span className="text-white/40">({Math.round(file.size / 1024)}KB)</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="hover:text-white transition-colors"
                    >
                      <Cross2Icon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Error message */}
            {uploadError && (
              <div className="px-2 text-xs text-red-400">
                {uploadError}
              </div>
            )}

            {/* Input field */}
            <div className="rounded-full bg-[#252525] py-2 pr-2.5 pl-4 flex items-center gap-3">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={getAllowedTypes(mode).join(',')}
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* File upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating || sessionFileCount + attachedFiles.length >= MAX_FILES_PER_SESSION}
                className="flex-shrink-0 text-white/40 hover:text-white/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Attach files"
              >
                <PlusIcon className="w-6 h-6" />
              </button>

              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === "plan"
                    ? "Share your ideas, ask for suggestions..."
                    : "Describe the image you want to generate..."
                }
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none"
                disabled={isGenerating}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/15 rounded-full transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeftIcon className="w-4 h-4 text-white transform rotate-90" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
