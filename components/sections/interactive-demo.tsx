"use client";

import Image from 'next/image';

const InteractiveDemo = () => {
  return (
    <section className="relative flex w-full flex-col items-center gap-[60px] overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black px-5 py-[120px] md:px-10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/10 via-transparent to-transparent pointer-events-none" />

      {/* Heading Content */}
      <div className="z-10 flex max-w-[720px] flex-col items-center gap-5 text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-1">
          <p className="font-semibold uppercase text-text-primary text-[11px] leading-none tracking-[0.05em]">
            Real-Time Intelligence
          </p>
        </div>
        <h2 className="font-display text-4xl font-semibold leading-[1.2] tracking-[-0.01em] text-text-primary">
          Industry insights, delivered hourly.
        </h2>
        <p className="max-w-[560px] text-lg leading-[1.6] text-text-secondary">
          Wondr&apos;s research agent scans Reddit, LinkedIn, X, and YouTube to surface trending topics and content opportunities tailored to your ICP.
        </p>
      </div>

      {/* Idea Hub Dashboard Screenshot */}
      <div className="relative z-10 w-full max-w-[1200px]">
        <div className="relative w-full rounded-2xl border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)] overflow-hidden bg-gray-900">
          <Image
            src="/idea-hub-page.png"
            alt="Idea Hub Dashboard showing industry updates from Reddit, X, and LinkedIn with AI-powered remix suggestions"
            width={1200}
            height={675}
            className="w-full h-auto"
            quality={90}
          />
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
