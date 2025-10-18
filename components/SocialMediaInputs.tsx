"use client";

import { SocialMediaHandles } from "@/types/industry-updates";

interface SocialMediaInputsProps {
  handles?: SocialMediaHandles;
  onChange: (handles: SocialMediaHandles) => void;
  label?: string;
}

export default function SocialMediaInputs({ handles, onChange, label }: SocialMediaInputsProps) {
  const currentHandles = handles || { x: '', linkedin: '', instagram: '', youtube: '' };

  const handleChange = (platform: keyof SocialMediaHandles, value: string) => {
    onChange({
      ...currentHandles,
      [platform]: value.trim() || undefined,
    });
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-xs uppercase tracking-wide text-white/50">{label}</label>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label className="text-xs text-white/40">X (Twitter) URL</label>
          <input
            type="url"
            value={currentHandles.x || ''}
            onChange={(e) => handleChange('x', e.target.value)}
            className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
            placeholder="https://x.com/yourcompany"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-white/40">LinkedIn URL</label>
          <input
            type="url"
            value={currentHandles.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
            placeholder="https://linkedin.com/company/yourcompany"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-white/40">Instagram URL</label>
          <input
            type="url"
            value={currentHandles.instagram || ''}
            onChange={(e) => handleChange('instagram', e.target.value)}
            className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
            placeholder="https://instagram.com/yourcompany"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-white/40">YouTube URL</label>
          <input
            type="url"
            value={currentHandles.youtube || ''}
            onChange={(e) => handleChange('youtube', e.target.value)}
            className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
            placeholder="https://youtube.com/@yourcompany"
          />
        </div>
      </div>
      <p className="text-xs text-white/30">All fields are optional</p>
    </div>
  );
}
