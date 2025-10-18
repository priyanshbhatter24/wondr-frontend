"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api-client";
import { UserICPConfig, Competitor, SocialMediaHandles, BrandAsset } from "@/types/industry-updates";
import AppShell from "@/components/AppShell";
import BrandColorPicker from "@/components/BrandColorPicker";
import LogoUploader from "@/components/LogoUploader";
import SocialMediaInputs from "@/components/SocialMediaInputs";
import BrandAssetsManager from "@/components/BrandAssetsManager";
import { GearIcon, PlusIcon, TrashIcon, CheckIcon, ArrowLeftIcon, ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useGenerations } from "@/lib/use-generations";

export default function ICPSettingsPage() {
  const router = useRouter();
  const api = useApiClient();

  // Fetch sessions for sidebar
  const { sessions } = useGenerations();

  // Handle sidebar session click
  const handleSessionClick = (sessionId: string) => {
    router.push(`/generate-post?session=${sessionId}`);
  };

  const [formData, setFormData] = useState<UserICPConfig>({
    ICP: { industry: '', target_audience: '', region: '' },
    persona: { youtubers: [] },
    industry: [],
    competitors: [],
    channels: ['Reddit', 'X', 'LinkedIn', 'YouTube'],
    company_content: { recent_blog_titles: [], keywords: [] },
    company_name: '',
    company_website: '',
    brand_colors: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyAnalysisStatus, setCompanyAnalysisStatus] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [expandedCompetitors, setExpandedCompetitors] = useState<Set<number>>(new Set());

  // Temporary input states for dynamic lists
  const [newYoutuber, setNewYoutuber] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newCompetitor, setNewCompetitor] = useState<Competitor>({ name: '', landing_page: '' });
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newCustomChannel, setNewCustomChannel] = useState('');

  // Fetch existing config on mount
  useEffect(() => {
    async function fetchConfig() {
      try {
        const config = await api.userConfig.getIcp();
        setFormData(config);
      } catch (err) {
        console.error("Failed to fetch ICP config:", err);
        setError("Failed to load configuration");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setCompanyAnalysisStatus(null);

      const response = await api.userConfig.updateIcp(formData);

      // Check if company analysis was triggered
      if (response.company_analysis_triggered) {
        if (response.company_analysis_success) {
          setCompanyAnalysisStatus("Company website analyzed successfully! AI content will now be tailored to your business.");
        } else {
          setCompanyAnalysisStatus("Company website analysis failed, but your config was saved. Try again later or contact support.");
        }
        setTimeout(() => setCompanyAnalysisStatus(null), 8000);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save ICP config:", err);
      setError("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for dynamic lists
  const addYoutuber = () => {
    if (newYoutuber.trim()) {
      setFormData({
        ...formData,
        persona: { youtubers: [...formData.persona.youtubers, newYoutuber.trim()] }
      });
      setNewYoutuber('');
    }
  };

  const removeYoutuber = (index: number) => {
    setFormData({
      ...formData,
      persona: { youtubers: formData.persona.youtubers.filter((_, i) => i !== index) }
    });
  };

  const addIndustry = () => {
    if (newIndustry.trim() && !formData.industry.includes(newIndustry.trim())) {
      setFormData({
        ...formData,
        industry: [...formData.industry, newIndustry.trim()]
      });
      setNewIndustry('');
    }
  };

  const removeIndustry = (index: number) => {
    setFormData({
      ...formData,
      industry: formData.industry.filter((_, i) => i !== index)
    });
  };

  const addCompetitor = () => {
    if (newCompetitor.name.trim() && newCompetitor.landing_page.trim()) {
      setFormData({
        ...formData,
        competitors: [...formData.competitors, newCompetitor]
      });
      setNewCompetitor({ name: '', landing_page: '' });
    }
  };

  const removeCompetitor = (index: number) => {
    setFormData({
      ...formData,
      competitors: formData.competitors.filter((_, i) => i !== index)
    });
  };

  const addBlogTitle = () => {
    if (newBlogTitle.trim()) {
      setFormData({
        ...formData,
        company_content: {
          ...formData.company_content,
          recent_blog_titles: [...(formData.company_content.recent_blog_titles || []), newBlogTitle.trim()]
        }
      });
      setNewBlogTitle('');
    }
  };

  const removeBlogTitle = (index: number) => {
    setFormData({
      ...formData,
      company_content: {
        ...formData.company_content,
        recent_blog_titles: formData.company_content.recent_blog_titles?.filter((_, i) => i !== index) || []
      }
    });
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData({
        ...formData,
        company_content: {
          ...formData.company_content,
          keywords: [...(formData.company_content.keywords || []), newKeyword.trim()]
        }
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData({
      ...formData,
      company_content: {
        ...formData.company_content,
        keywords: formData.company_content.keywords?.filter((_, i) => i !== index) || []
      }
    });
  };

  const toggleChannel = (channel: string) => {
    if (formData.channels.includes(channel)) {
      setFormData({
        ...formData,
        channels: formData.channels.filter(c => c !== channel)
      });
    } else {
      setFormData({
        ...formData,
        channels: [...formData.channels, channel]
      });
    }
  };

  const addCustomChannel = () => {
    const trimmed = newCustomChannel.trim();
    if (trimmed && !formData.channels.includes(trimmed)) {
      setFormData({
        ...formData,
        channels: [...formData.channels, trimmed]
      });
      setNewCustomChannel('');
    }
  };

  // Logo upload handler
  const handleLogoUpload = async (file: File) => {
    try {
      setUploadingLogo(true);
      setError(null);
      const response = await api.userConfig.uploadLogo(file);

      // Update formData with new logo URL
      setFormData({
        ...formData,
        company_logo_url: response.logo_url,
        company_logo_s3_key: response.s3_key
      });
    } catch (err) {
      console.error("Failed to upload logo:", err);
      setError("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Brand asset handlers
  const handleBrandAssetUpload = async (file: File, label: string) => {
    try {
      setUploadingAsset(true);
      setError(null);
      const response = await api.userConfig.uploadBrandAsset(file, label);

      // Update formData with new asset
      setFormData({
        ...formData,
        brand_assets: [...(formData.brand_assets || []), response.asset]
      });
    } catch (err) {
      console.error("Failed to upload brand asset:", err);
      setError("Failed to upload brand asset");
      throw err; // Re-throw to let component handle it
    } finally {
      setUploadingAsset(false);
    }
  };

  const handleBrandAssetDelete = async (assetId: string) => {
    try {
      setError(null);
      await api.userConfig.deleteBrandAsset(assetId);

      // Update formData by removing the asset
      setFormData({
        ...formData,
        brand_assets: (formData.brand_assets || []).filter(a => a.asset_id !== assetId)
      });
    } catch (err) {
      console.error("Failed to delete brand asset:", err);
      setError("Failed to delete brand asset");
      throw err;
    }
  };

  const handleBrandAssetLabelUpdate = async (assetId: string, label: string) => {
    try {
      setError(null);
      await api.userConfig.updateBrandAssetLabel(assetId, label);

      // Update formData with new label
      setFormData({
        ...formData,
        brand_assets: (formData.brand_assets || []).map(a =>
          a.asset_id === assetId ? { ...a, label } : a
        )
      });
    } catch (err) {
      console.error("Failed to update brand asset label:", err);
      setError("Failed to update brand asset label");
      throw err;
    }
  };

  const toggleCompetitor = (index: number) => {
    const newExpanded = new Set(expandedCompetitors);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCompetitors(newExpanded);
  };

  if (loading) {
    return (
      <AppShell sessions={sessions} onSessionClick={handleSessionClick}>
        <div className="flex-1 flex items-center justify-center bg-[#3A3A3A]">
          <div className="text-white text-lg">Loading configuration...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell sessions={sessions} onSessionClick={handleSessionClick}>
      <div className="flex-1 overflow-y-auto bg-[#3A3A3A]">
        <div className="relative flex flex-col w-full h-full">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/idea-hub')}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Idea Hub</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-20">
            <div className="mx-auto max-w-4xl px-6 pt-2 pb-12 sm:px-10">
              <div>
                <div className="flex items-center gap-3 border-b border-white/5 px-6 py-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <GearIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">Configuration</p>
                    <h1 className="text-xl font-semibold text-white">ICP Settings</h1>
                  </div>
                </div>

                <div className="px-6 py-6 space-y-8">
                  {error && (
                    <div className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  {saveSuccess && (
                    <div className="flex items-center gap-2 rounded-full border border-[#C5D86D]/40 bg-[#C5D86D]/10 px-4 py-3 text-sm text-[#C5D86D]">
                      <CheckIcon className="h-4 w-4" />
                      <span>Configuration saved successfully!</span>
                    </div>
                  )}

                  {/* Company Branding Section */}
                  <section className="space-y-4">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">Company Branding</h2>
                      <p className="mt-1 text-sm text-white/50">
                        Define your company identity and brand colors for AI-generated content.
                      </p>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-white/50">Company Logo</label>
                      <LogoUploader
                        logoUrl={formData.company_logo_url}
                        onUpload={handleLogoUpload}
                        uploading={uploadingLogo}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-white/50">Company Name *</label>
                        <input
                          type="text"
                          value={formData.company_name || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company_name: e.target.value
                            })
                          }
                          className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                          placeholder="e.g., Wondr Marketing"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-white/50">Company Website</label>
                        <input
                          type="url"
                          value={formData.company_website || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company_website: e.target.value
                            })
                          }
                          className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-white/50">Brand Colors</label>
                      <p className="text-xs text-white/40 mb-3">
                        Select up to 5 brand colors with their importance weights (1-5). These colors will be used in AI-generated images.
                      </p>
                      <BrandColorPicker
                        colors={formData.brand_colors || []}
                        onChange={(colors) => setFormData({ ...formData, brand_colors: colors })}
                        maxColors={5}
                      />
                    </div>
                  </section>

                  {/* Social Media Section */}
                  <section className="space-y-4">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">Social Media Presence</h2>
                      <p className="mt-1 text-sm text-white/50">
                        Add your company's social media handles for reference.
                      </p>
                    </div>
                    <SocialMediaInputs
                      handles={formData.social_media}
                      onChange={(handles) => setFormData({ ...formData, social_media: handles })}
                    />
                  </section>

                  {/* ICP Section */}
                  <section className="space-y-4">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">Ideal Customer Profile</h2>
                      <p className="mt-1 text-sm text-white/50">
                        Define the foundational details of the companies you want to monitor.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-white/50">Industry</label>
                        <input
                          type="text"
                          value={formData.ICP.industry || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              ICP: { ...formData.ICP, industry: e.target.value }
                            })
                          }
                          className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                          placeholder="e.g., AI Marketing Tools"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs uppercase tracking-wide text-white/50">Target Audience</label>
                        <input
                          type="text"
                          value={formData.ICP.target_audience || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              ICP: { ...formData.ICP, target_audience: e.target.value }
                            })
                          }
                          className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                          placeholder="e.g., Founders and marketing leads at Series A–B startups"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-3 md:col-span-1">
                        <label className="text-xs uppercase tracking-wide text-white/50">Region</label>
                        <input
                          type="text"
                          value={formData.ICP.region || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              ICP: { ...formData.ICP, region: e.target.value }
                            })
                          }
                          className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                          placeholder="e.g., United States"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Persona Section */}
                  <section className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">Persona Insights</h2>
                        <p className="mt-1 text-sm text-white/50">
                          Track influential voices your ICP is likely to follow.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {formData.persona.youtubers.map((youtuber, index) => (
                        <div key={index} className="flex items-center gap-2 rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3">
                          <div className="flex-1 text-sm text-white">{youtuber}</div>
                          <button
                            onClick={() => removeYoutuber(index)}
                            className="rounded-full border border-red-500/50 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20"
                            type="button"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="relative">
                        <input
                          type="text"
                          value={newYoutuber}
                          onChange={(e) => setNewYoutuber(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addYoutuber()}
                          className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                          placeholder="Add YouTuber/Influencer name"
                        />
                        <button
                          onClick={addYoutuber}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[#C5D86D]/40 bg-[#C5D86D]/10 text-[#C5D86D] transition-colors hover:bg-[#C5D86D]/20"
                          type="button"
                          aria-label="Add persona"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Industry Focus Section */}
                  <section className="space-y-4">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">Industry Focus</h2>
                      <p className="mt-1 text-sm text-white/50">
                        Highlight the industry segments you care about most.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.industry.map((ind, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 rounded-full border border-[#C5D86D]/40 bg-[#C5D86D]/10 px-3 py-1"
                          >
                            <span className="text-xs font-medium uppercase tracking-wide text-[#C5D86D]">{ind}</span>
                            <button
                              onClick={() => removeIndustry(index)}
                              className="text-[#C5D86D] transition-colors hover:text-white"
                              type="button"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={newIndustry}
                          onChange={(e) => setNewIndustry(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addIndustry()}
                          className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                          placeholder="Add industry tag (e.g., Artificial Intelligence)"
                        />
                        <button
                          onClick={addIndustry}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[#C5D86D]/40 bg-[#C5D86D]/10 text-[#C5D86D] transition-colors hover:bg-[#C5D86D]/20"
                          type="button"
                          aria-label="Add industry"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Competitors Section */}
                  <section className="space-y-4">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">Competitors</h2>
                      <p className="mt-1 text-sm text-white/50">
                        Keep tabs on the companies your ICP compares you against.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {formData.competitors.map((comp, index) => {
                        const isExpanded = expandedCompetitors.has(index);
                        return (
                          <div
                            key={index}
                            className="overflow-hidden rounded-lg border border-white/10 bg-[#2A2A2A]"
                          >
                            <div className="flex items-center gap-3 px-6 py-4">
                              <button
                                onClick={() => toggleCompetitor(index)}
                                className="text-white/50 transition-colors hover:text-[#C5D86D]"
                                type="button"
                              >
                                {isExpanded ? (
                                  <ChevronDownIcon className="h-4 w-4" />
                                ) : (
                                  <ChevronRightIcon className="h-4 w-4" />
                                )}
                              </button>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">{comp.name}</p>
                                <p className="mt-1 truncate text-xs text-white/60">{comp.landing_page}</p>
                              </div>
                              <button
                                onClick={() => removeCompetitor(index)}
                                className="rounded-full border border-red-500/50 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20"
                                type="button"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                            {isExpanded && (
                              <div className="border-t border-white/10 px-6 py-4">
                                <SocialMediaInputs
                                  handles={comp.social_media}
                                  onChange={(handles) => {
                                    const updatedCompetitors = [...formData.competitors];
                                    updatedCompetitors[index] = { ...comp, social_media: handles };
                                    setFormData({ ...formData, competitors: updatedCompetitors });
                                  }}
                                  label="Competitor Social Media"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div className="rounded-lg border border-white/10 bg-black/20 p-6 space-y-4">
                        <h3 className="text-sm font-medium text-white/70">Add New Competitor</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            type="text"
                            value={newCompetitor.name}
                            onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                            className="rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                            placeholder="Competitor name"
                          />
                          <input
                            type="url"
                            value={newCompetitor.landing_page}
                            onChange={(e) => setNewCompetitor({ ...newCompetitor, landing_page: e.target.value })}
                            className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                            placeholder="https://example.com"
                          />
                        </div>

                        {/* Social Media URLs for new competitor */}
                        <div className="space-y-3">
                          <p className="text-xs text-white/50">Social Media (Optional)</p>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <input
                              type="url"
                              value={newCompetitor.social_media?.x || ''}
                              onChange={(e) => setNewCompetitor({
                                ...newCompetitor,
                                social_media: { ...newCompetitor.social_media, x: e.target.value.trim() || undefined }
                              })}
                              className="rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                              placeholder="X URL"
                            />
                            <input
                              type="url"
                              value={newCompetitor.social_media?.linkedin || ''}
                              onChange={(e) => setNewCompetitor({
                                ...newCompetitor,
                                social_media: { ...newCompetitor.social_media, linkedin: e.target.value.trim() || undefined }
                              })}
                              className="rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                              placeholder="LinkedIn URL"
                            />
                            <input
                              type="url"
                              value={newCompetitor.social_media?.instagram || ''}
                              onChange={(e) => setNewCompetitor({
                                ...newCompetitor,
                                social_media: { ...newCompetitor.social_media, instagram: e.target.value.trim() || undefined }
                              })}
                              className="rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                              placeholder="Instagram URL"
                            />
                            <input
                              type="url"
                              value={newCompetitor.social_media?.youtube || ''}
                              onChange={(e) => setNewCompetitor({
                                ...newCompetitor,
                                social_media: { ...newCompetitor.social_media, youtube: e.target.value.trim() || undefined }
                              })}
                              className="rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                              placeholder="YouTube URL"
                            />
                          </div>
                        </div>

                        <button
                          onClick={addCompetitor}
                          className="w-full rounded-full border border-[#C5D86D]/40 bg-[#C5D86D]/10 px-6 py-3 text-sm font-semibold text-[#C5D86D] transition-colors hover:bg-[#C5D86D]/20"
                          type="button"
                        >
                          Add Competitor
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Channels Section */}
                  <section className="space-y-4">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">Channels to Monitor</h2>
                      <p className="mt-1 text-sm text-white/50">
                        Choose the spaces where we should surface updates from.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        {['Reddit', 'X', 'LinkedIn', 'YouTube'].map((channel) => (
                          <label
                            key={channel}
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white transition-colors hover:border-white/20"
                          >
                            <input
                              type="checkbox"
                              checked={formData.channels.includes(channel)}
                              onChange={() => toggleChannel(channel)}
                              className="h-4 w-4 rounded border-white/30 bg-black/60 text-[#C5D86D] focus:ring-[#C5D86D]"
                            />
                            {channel}
                          </label>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-wide text-white/50">Custom Channels</h3>
                        <div className="space-y-2">
                          {formData.channels
                            .filter((ch) => !['Reddit', 'X', 'LinkedIn', 'YouTube'].includes(ch))
                            .map((channel, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3"
                              >
                                <span className="flex-1 text-sm text-white">{channel}</span>
                                <button
                                  onClick={() => toggleChannel(channel)}
                                  className="rounded-full border border-red-500/50 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20"
                                  type="button"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={newCustomChannel}
                            onChange={(e) => setNewCustomChannel(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomChannel()}
                            className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                            placeholder="Add custom channel (e.g., Hacker News, Product Hunt)"
                          />
                          <button
                            onClick={addCustomChannel}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[#C5D86D]/40 bg-[#C5D86D]/10 text-[#C5D86D] transition-colors hover:bg-[#C5D86D]/20"
                            type="button"
                            aria-label="Add channel"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Company Content Section */}
                  <section className="space-y-4">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">Company Content</h2>
                      <p className="mt-1 text-sm text-white/50">
                        Share what you are already producing to inform future insights.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-wide text-white/50">Recent Blog Titles</h3>
                        <div className="space-y-2">
                          {formData.company_content.recent_blog_titles?.map((title, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3"
                            >
                              <div className="flex-1 text-sm text-white">{title}</div>
                              <button
                                onClick={() => removeBlogTitle(index)}
                                className="rounded-full border border-red-500/50 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20"
                                type="button"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={newBlogTitle}
                            onChange={(e) => setNewBlogTitle(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addBlogTitle()}
                            className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                            placeholder="Add blog title"
                          />
                          <button
                            onClick={addBlogTitle}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[#C5D86D]/40 bg-[#C5D86D]/10 text-[#C5D86D] transition-colors hover:bg-[#C5D86D]/20"
                            type="button"
                            aria-label="Add title"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-wide text-white/50">Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.company_content.keywords?.map((keyword, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1"
                            >
                              <span className="text-xs font-medium uppercase tracking-wide text-white/70">{keyword}</span>
                              <button
                                onClick={() => removeKeyword(index)}
                                className="text-white/50 transition-colors hover:text-white"
                                type="button"
                              >
                                <TrashIcon className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                            className="w-full rounded-full border border-white/10 bg-[#2A2A2A] px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-[#C5D86D] focus:outline-none"
                            placeholder="Add keyword"
                          />
                          <button
                            onClick={addKeyword}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[#C5D86D]/40 bg-[#C5D86D]/10 text-[#C5D86D] transition-colors hover:bg-[#C5D86D]/20"
                            type="button"
                            aria-label="Add keyword"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Brand Assets Section */}
                  <section className="space-y-4">
                    <BrandAssetsManager
                      assets={formData.brand_assets || []}
                      onUpload={handleBrandAssetUpload}
                      onDelete={handleBrandAssetDelete}
                      onUpdateLabel={handleBrandAssetLabelUpdate}
                      uploading={uploadingAsset}
                    />
                  </section>

                  <div className="flex flex-col items-center justify-center pt-4 space-y-3">
                    <button
                      onClick={handleSave}
                      disabled={saving || saveSuccess}
                      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-all ${
                        saveSuccess
                          ? 'bg-green-500/20 border-2 border-green-500/50 text-green-400'
                          : 'bg-[#C5D86D] text-black hover:bg-[#d4e479]'
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {saveSuccess && <CheckIcon className="h-4 w-4" />}
                      {saving ? 'Saving...' : saveSuccess ? 'Configuration Saved!' : 'Save Configuration'}
                    </button>

                    {/* Company Analysis Status Message */}
                    {companyAnalysisStatus && (
                      <div className={`text-sm px-4 py-2 rounded-lg ${
                        companyAnalysisStatus.includes('successfully')
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {companyAnalysisStatus}
                      </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <div className="text-sm px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30">
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
