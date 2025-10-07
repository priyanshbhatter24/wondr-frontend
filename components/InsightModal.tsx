"use client";

import * as Dialog from "@radix-ui/react-dialog";

interface RemixOption {
  text: string;
}

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  topic: string;
  description: string;
  remixOptions: RemixOption[];
  fullContent?: string;
}

export default function InsightModal({
  isOpen,
  onClose,
  source,
  topic,
  description,
  remixOptions,
  fullContent,
}: InsightModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-0 flex h-full w-full overflow-y-auto bg-[var(--color-gray-dark)] text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 p-6 sm:p-10">
            {/* Close Button */}
            <Dialog.Close className="absolute right-6 top-6 rounded-sm bg-white/10 p-1 text-white opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-[var(--color-gray-dark)] disabled:pointer-events-none">
              <span className="text-3xl font-bold leading-none">×</span>
              <span className="sr-only">Close</span>
            </Dialog.Close>

            <div className="space-y-6">
              {/* Source */}
              <div className="text-sm font-semibold uppercase tracking-wide text-white/70">
                {source}
              </div>

              {/* Topic */}
              <Dialog.Title className="text-3xl font-bold">
                {topic}
              </Dialog.Title>

              {/* Description */}
              <Dialog.Description className="text-lg leading-relaxed text-white/90">
                {description}
              </Dialog.Description>

              {/* Full Content */}
              {fullContent && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-4 text-xl font-bold text-white">Detailed Analysis</h3>
                  <p className="leading-relaxed text-white/90">{fullContent}</p>
                </div>
              )}

              {/* Remix Section */}
              <div className="pt-4">
                <h3 className="mb-4 text-xl font-bold text-white">REMIX IDEAS</h3>
                <div className="space-y-4">
                  {remixOptions.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-white/70" />
                      <span className="text-base text-white/90">{option.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
