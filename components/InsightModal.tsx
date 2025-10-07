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
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[90vh] w-[90vw] max-w-4xl translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-xl bg-[#A0826D] p-8 text-white shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {/* Close Button */}
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:pointer-events-none">
            <span className="text-3xl font-bold">×</span>
            <span className="sr-only">Close</span>
          </Dialog.Close>

          {/* Source */}
          <div className="text-sm font-semibold tracking-wide uppercase mb-4">
            {source}
          </div>

          {/* Topic */}
          <Dialog.Title className="text-3xl font-bold mb-6">
            {topic}
          </Dialog.Title>

          {/* Description */}
          <Dialog.Description className="text-lg leading-relaxed mb-6">
            {description}
          </Dialog.Description>

          {/* Full Content */}
          {fullContent && (
            <div className="mb-8 p-6 bg-white bg-opacity-10 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Detailed Analysis</h3>
              <p className="leading-relaxed">{fullContent}</p>
            </div>
          )}

          {/* Remix Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">REMIX IDEAS</h3>
            <div className="space-y-4">
              {remixOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-white bg-opacity-10 rounded-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0" />
                  <span className="text-base">{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
