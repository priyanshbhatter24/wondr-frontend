"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadIcon, Cross2Icon } from "@radix-ui/react-icons";

interface LogoUploaderProps {
  logoUrl?: string;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

export default function LogoUploader({ logoUrl, onUpload, uploading }: LogoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(logoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPEG, or WebP image');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await onUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileChange(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative flex h-32 w-32 items-center justify-center rounded-full border-2 transition-all ${
          isDragging
            ? 'border-[#C5D86D] bg-[#C5D86D]/10'
            : previewUrl
            ? 'border-white/20 bg-[#2A2A2A]'
            : 'border-dashed border-white/20 bg-[#2A2A2A] hover:border-[#C5D86D]/50 hover:bg-[#C5D86D]/5'
        } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handleInputChange}
          disabled={uploading}
        />

        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Company logo"
              fill
              sizes="8rem"
              className="rounded-full object-cover"
              unoptimized
            />
            {!uploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-red-500/50 bg-red-500/20 text-red-300 transition-colors hover:bg-red-500/30"
                type="button"
              >
                <Cross2Icon className="h-3 w-3" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <UploadIcon className="h-8 w-8 text-white/40" />
            <p className="text-xs text-white/50">
              {uploading ? 'Uploading...' : 'Upload Logo'}
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-white/40">
        PNG, JPEG, or WebP • Max 2MB
      </p>
    </div>
  );
}
