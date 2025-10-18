"use client";

import { useState } from "react";
import Image from "next/image";
import { BrandAsset } from "@/types/industry-updates";
import { PlusIcon, TrashIcon, Pencil1Icon, Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";

interface BrandAssetsManagerProps {
  assets: BrandAsset[];
  onUpload: (file: File, label: string) => Promise<void>;
  onDelete: (assetId: string) => Promise<void>;
  onUpdateLabel: (assetId: string, label: string) => Promise<void>;
  uploading: boolean;
}

export default function BrandAssetsManager({
  assets,
  onUpload,
  onDelete,
  onUpdateLabel,
  uploading,
}: BrandAssetsManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPEG, or WebP image');
      return;
    }

    // Validate file size (1MB max)
    if (file.size > 1 * 1024 * 1024) {
      alert('File size must be less than 1MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !label.trim()) {
      alert('Please select a file and enter a label');
      return;
    }

    if (label.length > 50) {
      alert('Label must be 50 characters or less');
      return;
    }

    try {
      await onUpload(selectedFile, label.trim());
      // Reset form
      setSelectedFile(null);
      setLabel("");
      setPreviewUrl(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload brand asset. Please try again.');
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this brand asset?')) {
      return;
    }

    try {
      await onDelete(assetId);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete brand asset. Please try again.');
    }
  };

  const handleStartEdit = (asset: BrandAsset) => {
    setEditingAssetId(asset.asset_id);
    setEditLabel(asset.label);
  };

  const handleSaveEdit = async (assetId: string) => {
    if (!editLabel.trim() || editLabel.length > 50) {
      alert('Label must be between 1 and 50 characters');
      return;
    }

    try {
      await onUpdateLabel(assetId, editLabel.trim());
      setEditingAssetId(null);
      setEditLabel("");
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update label. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingAssetId(null);
    setEditLabel("");
  };

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Brand Assets Library
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Upload images for future video generation ({assets.length} / 20)
          </p>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {assets.map((asset) => (
          <div
            key={asset.asset_id}
            className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#2A2A2A]"
          >
            {/* Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-black/20">
              <Image
                src={asset.s3_url}
                alt={asset.label}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
              {/* Delete button overlay */}
              <button
                onClick={() => handleDelete(asset.asset_id)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-red-500/50 bg-red-500/80 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                type="button"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Label */}
            <div className="p-3">
              {editingAssetId === asset.asset_id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    maxLength={50}
                    className="flex-1 rounded border border-white/20 bg-[#1A1A1A] px-2 py-1 text-xs text-white focus:border-[#C5D86D] focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(asset.asset_id)}
                    className="text-[#C5D86D] hover:text-[#d4e479]"
                    type="button"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-white/50 hover:text-white"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-1 truncate text-sm text-white">{asset.label}</p>
                  <button
                    onClick={() => handleStartEdit(asset)}
                    className="text-white/40 transition-colors hover:text-[#C5D86D]"
                    type="button"
                  >
                    <Pencil1Icon className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add New Asset Card */}
        {assets.length < 20 && (
          <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Dialog.Trigger asChild>
              <button
                className="group flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/20 bg-[#2A2A2A] transition-all hover:border-[#C5D86D]/50 hover:bg-[#C5D86D]/5"
                type="button"
              >
                <PlusIcon className="h-8 w-8 text-white/40 transition-colors group-hover:text-[#C5D86D]" />
                <p className="text-xs font-medium uppercase tracking-wide text-white/50 transition-colors group-hover:text-[#C5D86D]">
                  Add Asset
                </p>
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg border border-white/10 bg-[#2A2A2A] p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                <Dialog.Title className="mb-4 text-lg font-semibold text-white">
                  Upload Brand Asset
                </Dialog.Title>

                <div className="space-y-4">
                  {/* File Input */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-white/50">
                      Select Image
                    </label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleFileSelect}
                      className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-[#C5D86D] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-black hover:file:bg-[#d4e479]"
                    />
                    <p className="text-xs text-white/40">PNG, JPEG, or WebP • Max 1MB</p>
                  </div>

                  {/* Preview */}
                  {previewUrl && (
                    <div className="overflow-hidden rounded-lg border border-white/10">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={800}
                        height={600}
                        className="h-auto w-full object-contain"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Label Input */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-white/50">
                      Label (Max 50 characters)
                    </label>
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      maxLength={50}
                      className="w-full rounded-full border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                      placeholder="e.g., Product Screenshot 1"
                    />
                    <p className="text-xs text-white/40">{label.length} / 50</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Dialog.Close asChild>
                      <button
                        className="rounded-full border border-white/10 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
                        type="button"
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile || !label.trim() || uploading}
                      className="rounded-full bg-[#C5D86D] px-6 py-2 text-sm font-semibold text-black transition-all hover:bg-[#d4e479] disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>

                <Dialog.Close asChild>
                  <button
                    className="absolute right-4 top-4 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Close"
                    type="button"
                  >
                    <Cross2Icon className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </div>

      {assets.length === 0 && (
        <div className="rounded-lg border border-white/10 bg-black/20 px-6 py-8 text-center">
          <p className="text-sm text-white/50">
            No brand assets uploaded yet. Add your first asset to get started.
          </p>
        </div>
      )}
    </div>
  );
}
