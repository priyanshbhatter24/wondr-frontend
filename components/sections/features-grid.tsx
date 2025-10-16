import Link from "next/link";
import {
  BarChartIcon,
  ImageIcon,
  LightningBoltIcon,
  MagicWandIcon,
  TargetIcon,
} from "@radix-ui/react-icons";
import { IdeaIcon } from "@/components/icons/IdeaIcon";

const IndustryUpdatesCard = () => (
  <div className="flex flex-col gap-6">
    <div className="relative h-[320px] bg-card border border-border-subtle p-8 flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col gap-6">
        <BarChartIcon className="h-8 w-8 text-white/10 self-start" />
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-white/60 bg-white/5 px-3 py-2 rounded">
            &quot;AI regulation in healthcare&quot;
          </div>
          <div className="text-sm font-medium text-white/60 bg-white/5 px-3 py-2 rounded">
            Reddit • 234 upvotes
          </div>
          <div className="text-sm font-medium text-white/60 bg-white/5 px-3 py-2 rounded">
            LinkedIn • 89 comments
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <div className="bg-white text-black px-3 py-2 flex items-center gap-2 text-sm font-medium shadow-2xl">
          <MagicWandIcon className="h-4 w-4 text-purple-500" />
          <span>View Insights</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2 px-1">
      <h3 className="text-xl font-medium text-text-primary">Industry Updates</h3>
      <p className="text-text-secondary">Hourly insights from Reddit, X, LinkedIn & YouTube.</p>
    </div>
  </div>
);

const PostGenerationCard = () => (
  <div className="flex flex-col gap-6">
    <div className="relative h-[320px] bg-card border border-border-subtle p-8 overflow-hidden">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center gap-2 text-white/40">
          <IdeaIcon className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">AI Generated</span>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-sm text-white leading-relaxed">
                &quot;Breaking down AI compliance for healthcare teams...&quot;
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-sm text-white/70 leading-relaxed">
                Post for LinkedIn
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button className="flex-1 bg-white/10 text-white text-xs py-2 rounded border border-white/10">
              Edit
            </button>
            <button className="flex-1 bg-white text-black text-xs py-2 rounded font-medium">
              Generate Image
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2 px-1">
      <h3 className="text-xl font-medium text-text-primary">Post Generation</h3>
      <p className="text-text-secondary">AI-powered content with reasoning and citations.</p>
    </div>
  </div>
);

const ICPTargetingCard = () => (
  <div className="flex flex-col gap-6">
      <div className="h-[320px] bg-card border border-border-subtle p-6 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center gap-2">
              <TargetIcon className="h-6 w-6 text-white/80" />
          </div>
          <div className="flex flex-col gap-3">
              <div className="bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Industry</p>
                  <p className="text-sm text-white font-medium">Healthcare SaaS</p>
              </div>
              <div className="bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Pain Points</p>
                  <p className="text-sm text-white font-medium">Compliance, Security</p>
              </div>
              <div className="bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Competitors</p>
                  <p className="text-sm text-white font-medium">3 tracked</p>
              </div>
          </div>
      </div>
      <div className="flex flex-col gap-2 px-1">
          <h3 className="text-xl font-medium text-text-primary">ICP Configuration</h3>
          <p className="text-text-secondary">Define your ideal customer for targeted insights.</p>
      </div>
  </div>
);

const ImageGenerationCard = () => (
  <div className="flex flex-col gap-6">
    <div className="h-[320px] bg-card border border-border-subtle p-6 flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="flex items-center text-xs font-medium text-white/60 bg-white/5 p-1 w-fit rounded">
          <div className="py-1 px-3 bg-white/10 text-white flex items-center gap-1.5 rounded">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Instagram 1:1</span>
          </div>
        </div>
        <div className="flex-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-white/10 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="h-12 w-12 text-white/40 mx-auto mb-2" />
            <p className="text-sm text-white/60">AI Generated</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <button className="bg-white/10 border border-white/10 px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-white hover:bg-white/15 transition-colors rounded">
          <LightningBoltIcon className="w-4 h-4" />
          <span>Plan Mode</span>
        </button>
      </div>
    </div>
    <div className="flex flex-col gap-2 px-1">
      <h3 className="text-xl font-medium text-text-primary">Image Generation</h3>
      <p className="text-text-secondary">Create social media images with AI (Fal.ai integration).</p>
    </div>
  </div>
);

export default function FeaturesGrid() {
  return (
    <section className="bg-background-primary py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-14">
          <div className="flex flex-col gap-4 max-w-lg">
            <div className="self-start">
              <div className="bg-secondary text-secondary-foreground text-[11px] font-semibold uppercase tracking-widest py-2 px-4">
                Features
              </div>
            </div>
            <h2 className="text-5xl font-semibold tracking-[-0.01em] text-text-primary">Your AI-Powered Marketing Brain</h2>
            <p className="text-lg text-text-secondary max-w-md">
              From industry research to content creation, Wondr automates your entire marketing workflow.
            </p>
          </div>
          <div className="flex-shrink-0 mt-4 lg:mt-0">
            <Link href="/idea-hub" className="inline-block bg-secondary text-secondary-foreground text-base font-medium py-[14px] px-8 border border-border-subtle hover:bg-accent/70 transition-colors">
              Try Idea Hub
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <IndustryUpdatesCard />
          <PostGenerationCard />
          <ICPTargetingCard />
          <ImageGenerationCard />
        </div>
      </div>
    </section>
  );
}
