import Link from 'next/link';
import {
  Sparkles,
  Quote,
  Plus,
  Search,
  Book,
  Star,
  Image as ImageIcon,
  FileText,
  GitBranch,
  MoveRight
} from 'lucide-react';

const VantaHorseLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className="text-white/80">
    <path d="M9 20V12L5 16V9L9 5V3H15V5L19 9V16L15 12V20H9Z" />
  </svg>
);

const ChatGPTLogo = () => (
    <div className="w-5 h-5 bg-green-500/80 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12c-3.14 0-5-1.5-5-4s1.86-4 5-4 5 1.5 5 4-1.86 4-5 4Z"></path><path d="M9 20c-3.14 0-5-1.5-5-4s1.86-4 5-4 5 1.5 5 4-1.86 4-5 4Z"></path><path d="m2.6 11.8 2.8 5.8"></path><path d="m14 4.1 2.8 5.8"></path><path d="m11.2 21.4 5.8-2.8"></path><path d="m20.9 11.2-5.8-2.8"></path></svg>
    </div>
);

const SmartOptimizationCard = () => (
  <div className="flex flex-col gap-6">
    <div className="relative h-[320px] bg-card border border-border-subtle p-8 flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col gap-6">
        <Quote className="h-8 w-8 text-white/10 self-start" fill="currentColor" strokeWidth={0} />
        <div className="text-lg font-medium text-white leading-snug">
          <span className="bg-white/10 px-2 py-0.5">Make</span> this prompt sound
          <br />
          more confident: I'm not
          <br />
          sure if this is right.
        </div>
      </div>

      <div className="flex justify-start">
        <div className="bg-white text-black px-3 py-2 flex items-center gap-2 text-sm font-medium shadow-2xl">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span>Optimize with Wondr</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2 px-1">
      <h3 className="text-xl font-medium text-text-primary">Smart optimization</h3>
      <p className="text-text-secondary">Instantly improve clarity, tone, and impact.</p>
    </div>
  </div>
);

const AiToneControlCard = () => (
  <div className="flex flex-col gap-6">
    <div className="relative h-[320px] bg-card border border-border-subtle p-8 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10 -translate-x-1/2" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10 -translate-y-1/2" />
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/40 uppercase text-xs font-semibold tracking-wider">
        Formal
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 uppercase text-xs font-semibold tracking-wider">
        Playful
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-36 h-36">
        <div className="absolute inset-0 border border-white/10" />
        <div className="w-28 h-28 bg-background flex items-center justify-center text-center text-sm font-medium leading-tight text-white relative">
          <Quote className="absolute h-3 w-3 -top-2 text-white/40" fill="currentColor" strokeWidth={0} />
          <span>Let's get<br />started</span>
        </div>
      </div>

      <div className="absolute py-1 px-4 text-sm font-medium bg-white/10 text-white border border-white/10 left-8 top-1/2 -translate-y-1/2">
        Friendly
      </div>

      <div className="absolute py-1 px-4 text-sm font-medium bg-white/10 text-white border border-white/10 right-8 top-1/2 -translate-y-1/2">
        Bold
      </div>
    </div>
    <div className="flex flex-col gap-2 px-1">
      <h3 className="text-xl font-medium text-text-primary">AI tone control</h3>
      <p className="text-text-secondary">Switch between formal, playful, or bold styles.</p>
    </div>
  </div>
);

const PromptLibraryCard = () => (
  <div className="flex flex-col gap-6">
      <div className="h-[320px] bg-card border border-border-subtle p-6 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center gap-2">
              <VantaHorseLogo />
          </div>
          <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3 p-2 bg-white/[0.03] text-white">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">New chat</span>
              </div>
              <div className="flex items-center gap-3 p-2 text-white/70">
                  <Search className="h-4 w-4" />
                  <span className="text-sm font-medium">Search chat</span>
              </div>
          </div>
          <div className="flex flex-col gap-3">
              <span className="text-xs text-white/40 font-medium px-2">Library</span>
              <div className="flex items-center gap-3 p-2 text-white/70">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">Favorites</span>
              </div>
              <div className="pl-9 flex flex-col gap-1.5 text-sm font-medium text-white/50">
                  <span>#working</span>
                  <span>#design</span>
                  <span>#development</span>
              </div>
          </div>
      </div>
      <div className="flex flex-col gap-2 px-1">
          <h3 className="text-xl font-medium text-text-primary">Prompt library</h3>
          <p className="text-text-secondary">Save, tag, and organize your favorite prompts.</p>
      </div>
  </div>
);

const TemplatesCard = () => (
  <div className="flex flex-col gap-6">
    <div className="h-[320px] bg-card border border-border-subtle p-6 flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="flex items-center text-xs font-medium text-white/60 bg-white/5 p-1 w-fit">
          <div className="py-1 px-3 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image</span>
          </div>
          <div className="py-1 px-3 bg-white/10 text-white flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Prompt</span>
          </div>
          <div className="py-1 px-3 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Workflow</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white">
          <div className="p-3 bg-white/5">Create me a</div>
          <div className="p-3 bg-white/5">&quot;Wondr logo&quot;</div>
          <div className="p-3 bg-white/5">with using</div>
          <div className="p-3 bg-white/5 flex items-center gap-2">
            <ChatGPTLogo />
            ChatGPT
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="bg-white/10 border border-white/10 px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-white w-28 hover:bg-white/15 transition-colors">
          <span>Start</span>
          <MoveRight className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="flex flex-col gap-2 px-1">
      <h3 className="text-xl font-medium text-text-primary">Templates</h3>
      <p className="text-text-secondary">Use ready-made prompts for ChatGPT, Midjourney, and more.</p>
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
            <h2 className="text-5xl font-semibold tracking-[-0.01em] text-text-primary">What you can do with Wondr</h2>
            <p className="text-lg text-text-secondary max-w-md">
              Level up your prompt workflow with tools built for speed, clarity, and creativity.
            </p>
          </div>
          <div className="flex-shrink-0 mt-4 lg:mt-0">
            <Link href="/features" className="inline-block bg-secondary text-secondary-foreground text-base font-medium py-[14px] px-8 border border-border-subtle hover:bg-accent/70 transition-colors">
              All features
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SmartOptimizationCard />
          <AiToneControlCard />
          <PromptLibraryCard />
          <TemplatesCard />
        </div>
      </div>
    </section>
  );
}
