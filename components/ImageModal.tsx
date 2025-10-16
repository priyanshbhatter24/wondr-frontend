"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { Cross2Icon } from "@radix-ui/react-icons";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  fileName: string;
}

export function ImageModal({ isOpen, onClose, imageUrl, fileName }: ImageModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="relative">
            {/* Close button */}
            <Dialog.Close asChild>
              <button
                className="absolute -top-12 right-0 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <Cross2Icon className="w-5 h-5" />
              </button>
            </Dialog.Close>

            {/* Image */}
            <Image
              src={imageUrl}
              alt={fileName}
              width={1200}
              height={1200}
              className="max-h-[90vh] max-w-[90vw] h-auto w-auto rounded-lg shadow-2xl object-contain"
              sizes="(max-width: 768px) 90vw, 70vw"
              priority
              unoptimized
            />

            {/* File name caption */}
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <p className="text-sm text-white/60">{fileName}</p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
