"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api-client";
import { UserICPConfig, Competitor } from "@/types/industry-updates";
import AppShell from "@/components/AppShell";
import { GearIcon, PlusIcon, TrashIcon, CheckIcon } from "@radix-ui/react-icons";
import { useGenerations } from "@/lib/use-generations";

export default function ICPSettingsPage() {
  const router = useRouter();
  const api = useApiClient();

  // Fetch generations for sidebar
  const { generations } = useGenerations();

  // Handle sidebar generation click
  const handleGenerationClick = (sessionId: string) => {
    router.push(`/generate-post?session=${sessionId}`);
  };

  const [formData, setFormData] = useState<UserICPConfig>({
    ICP: { industry: '', target_audience: '', region: '' },
    persona: { youtubers: [] },
    industry: [],
    competitors: [],
    channels: ['Reddit', 'X', 'BBC'],
    company_content: { recent_blog_titles: [], keywords: [] }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Temporary input states for dynamic lists
  const [newYoutuber, setNewYoutuber] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newCompetitor, setNewCompetitor] = useState<Competitor>({ name: '', landing_page: '' });
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

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
      await api.userConfig.updateIcp(formData);
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

  if (loading) {
    return (
      <AppShell
        generations={generations}
        onGenerationClick={handleGenerationClick}
      >
        <div className="flex-1 flex items-center justify-center bg-[color:var(--color-gray-dark)]">
          <div className="text-white">Loading configuration...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      generations={generations}
      onGenerationClick={handleGenerationClick}
    >
      <div className="flex-1 overflow-y-auto bg-[color:var(--color-gray-dark)]">
        <div className="p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-10 flex items-center gap-3">
            <GearIcon className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-semibold text-white">ICP Settings</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-md text-red-400">
              {error}
            </div>
          )}

          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-[color:var(--color-lime)]/20 border border-[color:var(--color-lime)]/50 rounded-md text-[color:var(--color-lime)] flex items-center gap-2">
              <CheckIcon className="w-5 h-5" />
              <span>Configuration saved successfully!</span>
            </div>
          )}

          {/* Form */}
          <div className="space-y-8">
            {/* ICP Section */}
            <section>
              <h2 className="text-xl font-medium text-white mb-4">Ideal Customer Profile (ICP)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Industry</label>
                  <input
                    type="text"
                    value={formData.ICP.industry || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      ICP: { ...formData.ICP, industry: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--color-lime)]"
                    placeholder="e.g., AI Marketing Tools"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Target Audience</label>
                  <input
                    type="text"
                    value={formData.ICP.target_audience || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      ICP: { ...formData.ICP, target_audience: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--color-lime)]"
                    placeholder="e.g., Founders and marketing leads at Series A–B startups"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Region</label>
                  <input
                    type="text"
                    value={formData.ICP.region || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      ICP: { ...formData.ICP, region: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--color-lime)]"
                    placeholder="e.g., United States"
                  />
                </div>
              </div>
            </section>

            {/* Persona Section */}
            <section>
              <h2 className="text-xl font-medium text-white mb-4">Persona (Influencers/YouTubers)</h2>
              <div className="space-y-3">
                {formData.persona.youtubers.map((youtuber, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white">
                      {youtuber}
                    </div>
                    <button
                      onClick={() => removeYoutuber(index)}
                      className="p-2 bg-[color:var(--color-brown)]/20 hover:bg-[color:var(--color-brown)]/30 border border-[color:var(--color-brown)]/50 rounded-md text-[color:var(--color-brown)] transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newYoutuber}
                    onChange={(e) => setNewYoutuber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addYoutuber()}
                    className="flex-1 px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--color-lime)]"
                    placeholder="Add YouTuber/Influencer name"
                  />
                  <button
                    onClick={addYoutuber}
                    className="p-2 bg-[color:var(--color-lime)]/20 hover:bg-[color:var(--color-lime)]/30 border border-[color:var(--color-lime)]/50 rounded-md text-[color:var(--color-lime)] transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Industry Focus Section */}
            <section>
              <h2 className="text-xl font-medium text-white mb-4">Industry Focus</h2>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {formData.industry.map((ind, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1 bg-[color:var(--color-lime)]/20 border border-[color:var(--color-lime)]/50 rounded-full">
                      <span className="text-sm text-[color:var(--color-lime)]">{ind}</span>
                      <button
                        onClick={() => removeIndustry(index)}
                        className="text-[color:var(--color-lime)] hover:text-white transition-colors"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addIndustry()}
                    className="flex-1 px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--color-lime)]"
                    placeholder="Add industry tag (e.g., Artificial Intelligence)"
                  />
                  <button
                    onClick={addIndustry}
                    className="p-2 bg-[color:var(--color-lime)]/20 hover:bg-[color:var(--color-lime)]/30 border border-[color:var(--color-lime)]/50 rounded-md text-[color:var(--color-lime)] transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Competitors Section */}
            <section>
              <h2 className="text-xl font-medium text-white mb-4">Competitors</h2>
              <div className="space-y-3">
                {formData.competitors.map((comp, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div className="px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white">
                        {comp.name}
                      </div>
                      <div className="px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white text-sm truncate">
                        {comp.landing_page}
                      </div>
                    </div>
                    <button
                      onClick={() => removeCompetitor(index)}
                      className="p-2 bg-[color:var(--color-brown)]/20 hover:bg-[color:var(--color-brown)]/30 border border-[color:var(--color-brown)]/50 rounded-md text-[color:var(--color-brown)] transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newCompetitor.name}
                      onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                      className="px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--color-lime)]"
                      placeholder="Competitor name"
                    />
                    <input
                      type="url"
                      value={newCompetitor.landing_page}
                      onChange={(e) => setNewCompetitor({ ...newCompetitor, landing_page: e.target.value })}
                      className="px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--color-lime)]"
                      placeholder="https://example.com"
                    />
                  </div>
                  <button
                    onClick={addCompetitor}
                    className="p-2 bg-[color:var(--color-lime)]/20 hover:bg-[color:var(--color-lime)]/30 border border-[color:var(--color-lime)]/50 rounded-md text-[color:var(--color-lime)] transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Channels Section */}
            <section>
              <h2 className="text-xl font-medium text-white mb-4">Channels to Monitor</h2>
              <div className="flex gap-4">
                {['Reddit', 'X', 'BBC'].map((channel) => (
                  <label key={channel} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.channels.includes(channel)}
                      onChange={() => toggleChannel(channel)}
                      className="w-5 h-5 rounded border-white/20 bg-black/40 checked:bg-[color:var(--color-lime)] focus:ring-[color:var(--color-lime)]"
                    />
                    <span className="text-white">{channel}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Company Content Section */}
            <section>
              <h2 className="text-xl font-medium text-white mb-4">Company Content</h2>

              {/* Recent Blog Titles */}
              <div className="mb-6">
                <h3 className="text-sm text-white/70 mb-3">Recent Blog Titles</h3>
                <div className="space-y-3">
                  {formData.company_content.recent_blog_titles?.map((title, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1 px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white">
                        {title}
                      </div>
                      <button
                        onClick={() => removeBlogTitle(index)}
                        className="p-2 bg-[color:var(--color-brown)]/20 hover:bg-[color:var(--color-brown)]/30 border border-[color:var(--color-brown)]/50 rounded-md text-[color:var(--color-brown)] transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addBlogTitle()}
                      className="flex-1 px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--color-lime)]"
                      placeholder="Add blog title"
                    />
                    <button
                      onClick={addBlogTitle}
                      className="p-2 bg-[color:var(--color-lime)]/20 hover:bg-[color:var(--color-lime)]/30 border border-[color:var(--color-lime)]/50 rounded-md text-[color:var(--color-lime)] transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <h3 className="text-sm text-white/70 mb-3">Keywords</h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.company_content.keywords?.map((keyword, index) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-1 bg-[color:var(--color-brown)]/20 border border-[color:var(--color-brown)]/50 rounded-full">
                        <span className="text-sm text-[color:var(--color-brown)]">{keyword}</span>
                        <button
                          onClick={() => removeKeyword(index)}
                          className="text-[color:var(--color-brown)] hover:text-white transition-colors"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                      className="flex-1 px-4 py-2 bg-black/40 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--color-lime)]"
                      placeholder="Add keyword"
                    />
                    <button
                      onClick={addKeyword}
                      className="p-2 bg-[color:var(--color-lime)]/20 hover:bg-[color:var(--color-lime)]/30 border border-[color:var(--color-lime)]/50 rounded-md text-[color:var(--color-lime)] transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-[color:var(--color-lime)] text-black font-medium rounded-md hover:bg-[color:var(--color-lime)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
